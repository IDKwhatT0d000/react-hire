import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent, Typography, Button, CardActions, Chip } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

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

  const handleDelete = async (offerId) => {
    try {
      await deleteDoc(doc(db, 'offers', offerId));
      setOffers((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#1a1a2e', minHeight: '100vh' }}>
      <Typography variant="h4" sx={{ color: "#f5f5f5", marginBottom: '24px' }} gutterBottom>
        Inbox
      </Typography>

      {offers.map((offer) => {
        const isExpired = new Date(offer.expiryDate) < new Date();

        return (
          <Card key={offer.id} sx={{ marginBottom: '16px', backgroundColor: '#0f3460', color: '#f5f5f5', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)' }}>
            <CardContent>
              <Typography variant="h6">Offer from: {offer.adminName}</Typography>
              <Chip 
                label={offer.status}
                color={offer.status === 'offered' ? 'success' : 'default'}
                sx={{ marginTop: '8px', marginBottom: '8px' }}
              />
              <Typography>Offer Date: {new Date(offer.timestamp).toLocaleDateString()}</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setSelectedPdf(offer.fileUrl)}
              >
                View Offer Letter
              </Button>
              {isExpired && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(offer.id)}
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
