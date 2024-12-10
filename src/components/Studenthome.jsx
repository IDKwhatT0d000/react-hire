import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const Studenthome = ({ data }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [offers, setOffers] = useState([]);
  const [revokedOffers, setRevokedOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [message, setMessage] = useState('');
  const [currentRevokedOffer, setCurrentRevokedOffer] = useState(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const q = query(collection(db, 'offers'), where('studentId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const activeOffers = [];
        const revokedOffersList = [];
        querySnapshot.docs.forEach((doc) => {
          const offer = { id: doc.id, ...doc.data() };
          if (offer.status === 'revoked') {
            revokedOffersList.push(offer);
          } else {
            activeOffers.push(offer);
          }
        });
        setOffers(activeOffers);
        setRevokedOffers(revokedOffersList);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Message cannot be empty.');
      return;
    }
    try {
      const { adminId, studentId } = currentRevokedOffer;
      await addDoc(collection(db, 'messages'), {
        adminId,
        studentId,
        studentName: data.name,
        message,
        timestamp: new Date(),
      });
      setMessage('');
      setCurrentRevokedOffer(null);
      alert('Message sent successfully.');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'offers') {
      fetchOffers();
    }
  }, [activeTab]);

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold mb-4">Home Page</h1>
      <div className="relative bg-white w-[900px] h-[600px] p-4 rounded-lg shadow-md">
        <div className="absolute right-4 top-4">
          <button
            className="p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className="flex justify-center space-x-4 mb-4">
          <button
            className={`p-2 ${activeTab === 'info' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg`}
            onClick={() => setActiveTab('info')}
          >
            Info
          </button>
          <button
            className={`p-2 ${activeTab === 'offers' ? 'bg-blue-500 text-white' : 'bg-gray-200'} rounded-lg`}
            onClick={() => setActiveTab('offers')}
          >
            Offers
          </button>
        </div>
        {activeTab === 'info' && (
          <div>
            <p>Name: {data.name}</p>
            <p>Email: {data.email}</p>
            <p>Score: {data.rating}</p>
            <p>Projects: {data.projects}</p>
          </div>
        )}
        {activeTab === 'offers' && (
          <div>
            <h2 className="text-lg font-bold mb-2">Offers Received</h2>
            {loading ? (
              <p>Loading offers...</p>
            ) : (
              <>
                <h3 className="text-md font-semibold mb-2">Active Offers</h3>
                {offers.length > 0 ? (
                  <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Offer from</th>
                        <th className="border px-4 py-2">Offer Letter</th>
                        <th className="border px-4 py-2">Expires On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {offers.map((offer) => (
                        <tr key={offer.id}>
                          <td className="border px-4 py-2">{offer.adminId}</td>
                          <td className="border px-4 py-2">
                            <button
                              className="text-blue-500 underline"
                              onClick={() => setSelectedOffer(offer.fileUrl)}
                            >
                              View Offer
                            </button>
                          </td>
                          <td className="border px-4 py-2">
                            {new Date(offer.expiryDate).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No active offers found.</p>
                )}
                <h3 className="text-md font-semibold mb-2">Revoked Offers</h3>
                {revokedOffers.length > 0 ? (
                  <table className="table-auto w-full border-collapse border border-gray-200">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Offer from</th>
                        <th className="border px-4 py-2">Reason</th>
                        <th className="border px-4 py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revokedOffers.map((offer) => (
                        <tr key={offer.id}>
                          <td className="border px-4 py-2">{offer.adminId}</td>
                          <td className="border px-4 py-2">Offer Revoked</td>
                          <td className="border px-4 py-2">
                            <button
                              className="text-blue-500 underline"
                              onClick={() => setCurrentRevokedOffer(offer)}
                            >
                              Send Message
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No revoked offers found.</p>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {selectedOffer && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-4xl w-full relative overflow-hidden">
            <div className="relative max-h-[80vh] overflow-auto">
              <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                <Viewer
                  fileUrl={selectedOffer}
                  renderLoader={() => (
                    <p className="text-gray-600">Loading PDF, please wait...</p>
                  )}
                />
              </Worker>
            </div>
            <button
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => setSelectedOffer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {currentRevokedOffer && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-[400px]">
            <h2 className="text-lg font-bold mb-2">Send Message</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows="4"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setCurrentRevokedOffer(null)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Studenthome;
