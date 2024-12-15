import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";

const OffersTab = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const adminId = auth.currentUser?.uid;
        const q = query(collection(db, "offers"), where("adminId", "==", adminId));
        const querySnapshot = await getDocs(q);
        const offersData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setOffers(offersData);
      } catch (err) {
        console.error("Error fetching offers:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [db, auth]);

  const handleRevoke = async (id) => {
    try {
      const offerRef = doc(db, "offers", id);
      await updateDoc(offerRef, { status: "revoked" });
      setOffers((prev) =>
        prev.map((offer) => (offer.id === id ? { ...offer, status: "revoked" } : offer))
      );
    } catch (err) {
      console.error("Error revoking offer:", err);
    }
  };

  const handleRevert = async (id) => {
    try {
      const offerRef = doc(db, "offers", id);
      await updateDoc(offerRef, { status: "offered" });
      setOffers((prev) =>
        prev.map((offer) => (offer.id === id ? { ...offer, status: "offered" } : offer))
      );
    } catch (err) {
      console.error("Error reverting offer:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  if (offers.length === 0) {
    return (
      <Typography variant="h6" align="center">
        No offers found.
      </Typography>
    );
  }

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Current Offers
      </Typography>
      <Grid container spacing={4}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card sx={{ maxWidth: 400, margin: "auto", boxShadow: 4, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {offer.fileName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Student Name: {offer.studentName}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Status:{" "}
                  <Typography
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      color: offer.status === "offered" ? "green" : "red",
                    }}
                  >
                    {offer.status}
                  </Typography>
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Expiry Date: {new Date(offer.expiryDate).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  color="primary"
                  component="a"
                  href={offer.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textDecoration: "none", display: "block", margin: "8px 0" }}
                >
                  View Offer
                </Typography>
                {offer.status === "offered" ? (
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRevoke(offer.id)}
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Revoke
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleRevert(offer.id)}
                    fullWidth
                    sx={{ marginTop: 2 }}
                  >
                    Revert
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OffersTab;
