import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Card, CardContent, Typography, Button, CardActions, Chip, TextField, Box } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const MessageComponent = ({ offerId, adminId, adminName, studentId, studentName, onMessageSent }) => {
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, 'messages'), {
        offerId,
        studentId,
        studentName,
        adminId,
        adminName,
        message,
        date: new Date().toISOString(),
      });
      setMessage('');
      onMessageSent();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Box
      sx={{
        padding: 2,
        marginTop: 2,
        backgroundColor: '#0f3460',
        borderRadius: 2,
        color: '#f5f5f5',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
      }}
    >
      <Typography variant="subtitle1" sx={{ marginBottom: 1, fontWeight: 'bold' }}>
        Send a Message to {adminName}
      </Typography>
      <TextField
        label="Message"
        variant="outlined"
        multiline
        rows={3}
        fullWidth
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          marginBottom: 2,
        }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendMessage}
        sx={{ display: 'block', marginLeft: 'auto' }}
      >
        Send Message
      </Button>
    </Box>
  );
};

const Inbox = () => {
  const [offers, setOffers] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const offersQuery = query(
          collection(db, 'offers'),
          where('studentId', '==', user.uid)
        );
        const querySnapshot = await getDocs(offersQuery);

        const offersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOffers(offersData);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  return (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: "#f5f5f5", marginBottom: '24px' }} gutterBottom>
        Inbox
      </Typography>

      {offers.map((offer) => {
        const isExpired = new Date(offer.expiryDate) < new Date();
        const isRevoked = offer.status === 'revoked';

        return (
          <Card
            key={offer.id}
            sx={{
              marginBottom: '16px',
              backgroundColor: '#0f3460',
              color: '#f5f5f5',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CardContent>
              <Typography variant="h6">Offer from: {offer.adminName}</Typography>
              <Chip
                label={offer.status}
                color={isRevoked ? 'error' : offer.status === 'offered' ? 'success' : 'default'}
                sx={{
                  marginTop: '8px',
                  marginBottom: '8px',
                  backgroundColor: isRevoked ? 'red' : 'green',
                }}
              />
              <Typography>Offer Date: {new Date(offer.timestamp).toLocaleDateString()}</Typography>
            </CardContent>
            <CardActions>
              {!isRevoked ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setSelectedPdf(offer.fileUrl)}
                >
                  View Offer Letter
                </Button>
              ) : (
                <MessageComponent
                  offerId={offer.id}
                  adminId={offer.adminId}
                  adminName={offer.adminName}
                  studentId={auth.currentUser.uid}
                  studentName={offer.studentName}
                  onMessageSent={() => alert('Message sent successfully!')}
                />
              )}
              {isExpired && !isRevoked && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => console.log('Handle delete logic here.')}
                >
                  Delete Expired Offer
                </Button>
              )}
            </CardActions>
          </Card>
        );
      })}

      {selectedPdf && (
        <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#16213e', borderRadius: '8px' }}>
          <Typography variant="h5" sx={{ color: "#f5f5f5", marginBottom: '16px' }}>
            Offer Letter Preview
          </Typography>
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <div style={{ height: '600px', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff' }}>
              <Viewer fileUrl={selectedPdf} />
            </div>
          </Worker>
          <Button
            variant="contained"
            color="secondary"
            style={{ marginTop: '16px' }}
            onClick={() => setSelectedPdf(null)}
          >
            Close Preview
          </Button>
        </div>
      )}
    </div>
  );
};

export default Inbox;
