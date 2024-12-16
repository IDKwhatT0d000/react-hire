import React, { useEffect, useState } from 'react';
import { auth, db } from './firebase';
import { collection, query, where, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const admin = auth.currentUser;
        if (!admin) return;

        // Query messages where adminId matches the logged-in admin
        const messagesQuery = query(
          collection(db, 'messages'),
          where('adminId', '==', admin.uid)
        );
        const querySnapshot = await getDocs(messagesQuery);

        // Map messages from query results
        const messagesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messagesData);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleRevertStatus = async (offerId, messageId) => {
    try {
      // Step 1: Update the offer status to "offered"
      const offerRef = doc(db, 'offers', offerId);
      await updateDoc(offerRef, { status: 'offered' });

      // Step 2: Delete the corresponding message from the messages collection
      const messageRef = doc(db, 'messages', messageId);
      await deleteDoc(messageRef);

      // Step 3: Remove the message from the state
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );

      alert('Offer status reverted, and message removed successfully!');
    } catch (error) {
      console.error('Error reverting offer status and deleting message:', error);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: '#1a1a2e',
        minHeight: '100vh',
        color: '#f5f5f5',
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 4, fontWeight: 'bold', color: '#f5f5f5' }}>
        Messages
      </Typography>

      {messages.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', marginTop: 8 }}>
          No messages found.
        </Typography>
      ) : (
        messages.map((message) => (
          <Card
            key={message.id}
            sx={{
              marginBottom: 2,
              backgroundColor: '#0f3460',
              color: '#f5f5f5',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
            }}
          >
            <CardContent>
              <Typography variant="h6">Message from: {message.studentName}</Typography>
              <Typography sx={{ marginBottom: 1 }}>Message: {message.message}</Typography>
              <Typography variant="body2">
                Date: {new Date(message.date).toLocaleString()}
              </Typography>
              <Typography variant="body2">Offer ID: {message.offerId}</Typography>
              <Chip
                label="Revertable Offer"
                sx={{
                  marginTop: 1,
                  backgroundColor: '#28a745',
                  color: '#f5f5f5',
                }}
              />
            </CardContent>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleRevertStatus(message.offerId, message.id)}
              sx={{
                margin: 2,
                display: 'block',
                marginLeft: 'auto',
                backgroundColor: '#f4511e',
                ':hover': {
                  backgroundColor: '#d84315',
                },
              }}
            >
              Revert Offer Status
            </Button>
          </Card>
        ))
      )}
    </Box>
  );
};

export default Messages;
