import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc,deleteDoc  } from 'firebase/firestore';
import Card from './Card';

const Adminhome = () => {
  const [activeTab, setActiveTab] = useState('candidates');
  const [candidates, setCandidates] = useState([]);
  const [offers, setOffers] = useState([]);
  const [revokedOffers, setRevokedOffers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const q = query(collection(db, 'Users'), where('type', '==', 'student'));
      const querySnapshot = await getDocs(q);
      const candidatesList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCandidates(candidatesList);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'offers'), where('adminId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const offersList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOffers(offersList.filter((offer) => offer.status !== 'revoked'));
        setRevokedOffers(offersList.filter((offer) => offer.status === 'revoked'));
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'messages'), where('adminId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const messagesList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesList);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const revokeOffer = async (offer) => {
    try {
      await updateDoc(doc(db, 'offers', offer.id), { status: 'revoked' });
      setOffers((prevOffers) => prevOffers.filter((off) => off.id !== offer.id));
      setRevokedOffers((prevRevokedOffers) => [...prevRevokedOffers, { ...offer, status: 'revoked' }]);
    } catch (error) {
      console.error('Error revoking offer:', error);
    }
  };
  const revertOfferStatus = async (message) => {
    try {
      const { adminId, studentId, id: messageId } = message;
      const q = query(
        collection(db, 'offers'),
        where('adminId', '==', adminId),
        where('studentId', '==', studentId),
        where('status', '==', 'revoked')
      );
      
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const offerDoc = querySnapshot.docs[0];
        await updateDoc(offerDoc.ref, { status: 'offered' });
  
        console.log(`Offer for student ${studentId} has been reverted to "offered".`);
  
        await deleteDoc(doc(db, 'messages', messageId));
        console.log(`Message from ${studentId} has been deleted.`);
        setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
      } else {
        console.log('No revoked offer found for this student.');
      }
    } catch (error) {
      console.error('Error reverting offer status and deleting message:', error);
    }
  };
  


  useEffect(() => {
    if (activeTab === 'candidates') {
      fetchCandidates();
    } else if (activeTab === 'messages') {
      fetchMessages();
    } else {
      fetchOffers();
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <div className="bg-white w-[900px] h-[500px] p-4 rounded-lg shadow-md">
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`p-2 ${activeTab === 'candidates' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates List
          </button>
          <button
            className={`p-2 ${activeTab === 'offers' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg`}
            onClick={() => setActiveTab('offers')}
          >
            Offers Sent
          </button>
          <button
            className={`p-2 ${activeTab === 'revoked' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg`}
            onClick={() => setActiveTab('revoked')}
          >
            Revoked Offers
          </button>
          <button
            className={`p-2 ${activeTab === 'messages' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button className="p-2 bg-blue-500 text-white rounded-lg" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {activeTab === 'candidates' && (
          <div>
            <h2 className="text-lg font-bold mb-2">Candidates List</h2>
            <div className="grid grid-cols-3 gap-4">
              {candidates.length > 0 ? (
                candidates.map((candidate) => <Card key={candidate.id} data={candidate} />)
              ) : (
                <p>No candidates found.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div>
            <h2 className="text-lg font-bold mb-2">Offers Sent</h2>
            {loading ? (
              <p>Loading offers...</p>
            ) : offers.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Student Name</th>
                    <th className="border px-4 py-2">Offer Letter</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.id}>
                      <td className="border px-4 py-2">{offer.studentName}</td>
                      <td className="border px-4 py-2">
                        <a
                          href={offer.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Offer
                        </a>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => revokeOffer(offer)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No offers found.</p>
            )}
          </div>
        )}

        {activeTab === 'revoked' && (
          <div>
            <h2 className="text-lg font-bold mb-2">Revoked Offers</h2>
            {loading ? (
              <p>Loading revoked offers...</p>
            ) : revokedOffers.length > 0 ? (
              <table className="table-auto w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Student Name</th>
                    <th className="border px-4 py-2">Offer Letter</th>
                  </tr>
                </thead>
                <tbody>
                  {revokedOffers.map((offer) => (
                    <tr key={offer.id}>
                      <td className="border px-4 py-2">{offer.studentName}</td>
                      <td className="border px-4 py-2">
                        <a
                          href={offer.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View Offer
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No revoked offers found.</p>
            )}
          </div>
        )}
        {activeTab === 'messages' && (
          <div>
            <h2 className="text-lg font-bold mb-2">Messages</h2>
            {loading ? (
              <p>Loading messages...</p>
            ) : messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="p-4 bg-gray-100 rounded-lg shadow-md">
                    <p><strong>From:</strong> {message.studentName}</p>
                    <p><strong>Message:</strong> {message.message}</p>

                    {/* Button to revert the offer status */}
                    <button
                      onClick={() => revertOfferStatus(message)}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded-lg"
                    >
                      Revert Offer Status
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>No messages found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Adminhome;
