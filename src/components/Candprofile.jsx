import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from './firebase';
import { auth } from './firebase'; // Import Firebase Auth
import { doc, getDoc, collection, query, where, getDocs, setDoc,addDoc ,serverTimestamp } from 'firebase/firestore';
import { supabase } from './supabase'; // Import Supabase Client
import { Avatar, Button, Card, Typography, Box, Divider, Chip, TextField, Grid } from '@mui/material';
import { Email, Star, Work } from '@mui/icons-material';

const Candprofile = () => {
  const { id } = useParams(); // Candidate (Student) ID from route params
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [offerDetails, setOfferDetails] = useState({ companyName: '', file: null });
  const [existingOffers, setExistingOffers] = useState([]);

  // Fetch student details
  const fetchStudent = async () => {
    try {
      const docRef = doc(db, 'Users', id);
      const studentDoc = await getDoc(docRef);
      if (studentDoc.exists()) {
        setStudent({ id: studentDoc.id, ...studentDoc.data() });
      } else {
        console.error('Student not found');
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  // Fetch existing offers for the student
  const fetchOffers = async () => {
    try {
      const offersQuery = query(
        collection(db, 'offers'),
        where('studentId', '==', id) // Assuming 'studentId' field in offers collection matches student UID
      );
      const querySnapshot = await getDocs(offersQuery);
      const offers = querySnapshot.docs.map(doc => doc.data());
      setExistingOffers(offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  // Handle form changes
  const handleFormChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'file') {
      setOfferDetails({ ...offerDetails, file: files[0] });
    } else {
      setOfferDetails({ ...offerDetails, [name]: value });
    }
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      if (!offerDetails.file) {
        alert('Please upload a file.');
        return;
      }
  
      // Get admin user details
      const adminUser = auth.currentUser;
      if (!adminUser) {
        alert('Admin user not authenticated.');
        return;
      }
  
      const adminId = adminUser.uid; // Admin ID
      const studentId = id; // Student ID from route parameter
  
      // Fetch the admin's name from the Users collection
      const adminDocRef = doc(db, 'Users', adminId);
      const adminDocSnapshot = await getDoc(adminDocRef);
      if (!adminDocSnapshot.exists()) {
        alert('Admin data not found.');
        return;
      }
      const adminName = adminDocSnapshot.data().name; // Assuming 'name' is the field for admin name
  
      // Create the file path
      const filePath = `${adminId}/${studentId}/${offerDetails.file.name}`;
  
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('offers') // Your storage bucket name
        .upload(filePath, offerDetails.file, {
          cacheControl: '3600', // Optional: Cache control headers
          upsert: false, // Optional: Prevent overwriting existing files
        });
  
      if (error) {
        console.error('Error uploading file to Supabase:', error);
        alert('File upload failed.');
        return;
      }
  
      // Retrieve the public URL of the uploaded file
      const { data: cloudFile, error: urlError } = await supabase.storage
        .from('offers')
        .getPublicUrl(filePath);
  
      if (urlError) {
        console.error('Error fetching public URL:', urlError);
        alert('Failed to retrieve public URL.');
        return;
      }
  
      const publicUrl = cloudFile.publicUrl;
  
      // Calculate expiration date (7 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
  
      // Add offer to Firestore
      const offerDocRef = await addDoc(collection(db, 'offers'), {
        adminId: adminId,
        adminName: adminName, // Admin name fetched from Users collection
        studentId: studentId,
        studentName: student.name, // Assuming 'student' contains student data
        fileName: offerDetails.file.name, // The file name
        fileUrl: publicUrl, // The public URL of the uploaded file
        status: 'offered',
        timestamp: new Date().toISOString(), // Current timestamp
        expiryDate: expirationDate.toISOString(), // Expiry date (7 days from now)
      });
  
      // Reset form state
      setOfferDetails({ companyName: '', file: null });
  
      // Add the new offer to the existingOffers state
      setExistingOffers((prevOffers) => [
        ...prevOffers,
        {
          adminId: adminId,
          adminName: adminName,
          studentId: studentId,
          studentName: student.name,
          fileName: offerDetails.file.name,
          fileUrl: publicUrl,
          status: 'offered',
          timestamp: new Date().toISOString(),
          expiryDate: expirationDate.toISOString(),
        }
      ]);
  
      alert('Offer sent successfully!');
    } catch (error) {
      console.error('Error sending offer:', error);
      alert('An error occurred. Please try again.');
    }
  };
  
  
  

  // Fetch student data and offers on mount
  useEffect(() => {
    fetchStudent();
    fetchOffers();
  }, [id]);

  if (!student) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h6">Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'linear-gradient(to bottom, #f9f9f9, #e3f2fd)', minHeight: '100vh', py: 4 }}>
      <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
        {/* Left Side - Profile and Offer Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 2 }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ mb: 3 }}
              onClick={() => navigate(-1)}
            >
              Back to Candidates
            </Button>

            {/* Profile Card */}
            <Card sx={{ p: 3, bgcolor: 'white', boxShadow: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                <Avatar
                  src={student.image || '/default-avatar.png'}
                  alt={student.name}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                <Typography variant="h5" fontWeight="bold">
                  {student.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Email color="action" />
                  <Typography variant="body2" color="text.secondary">
                    {student.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                  <Star color="primary" />
                  <Typography variant="body1">
                    Rating: <strong>{student.rating || 'N/A'}</strong>
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                  <Work color="secondary" />
                  <Chip
                    label={`${student.projects || 0} Projects`}
                    color="secondary"
                    variant="outlined"
                  />
                </Box>
              </Box>
            </Card>

            <Divider sx={{ my: 4 }} />

            {/* Offer Form */}
            <Card sx={{ p: 3, bgcolor: 'white', boxShadow: 3 }}>
              <Typography variant="h6" mb={2}>
                Send an Offer
              </Typography>
              <form onSubmit={handleFormSubmit}>
                <TextField
                  label="Company Name"
                  name="companyName"
                  value={offerDetails.companyName}
                  onChange={handleFormChange}
                  fullWidth
                  required
                  sx={{ mb: 3 }}
                />
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ mb: 3 }}
                >
                  Upload Offer File
                  <input
                    type="file"
                    name="file"
                    accept="application/pdf"
                    hidden
                    onChange={handleFormChange}
                  />
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Send Offer
                </Button>
              </form>
            </Card>
          </Box>
        </Grid>

        {/* Right Side - Existing Offers */}
        <Grid item xs={12} md={6}>
          <Box sx={{ px: 2 }}>
            <Typography variant="h6" mb={3} sx={{ color: 'white' }}>
              Existing Offers
            </Typography>
            {existingOffers.length === 0 ? (
              <Typography variant="body2">No offers available.</Typography>
            ) : (
              existingOffers.map((offer, index) => (
                <Card key={index} sx={{ p: 3, mb: 3, bgcolor: 'white', boxShadow: 3 }}>
                  <Typography variant="h6">{offer.companyName}</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Status:</strong> {offer.status || 'Pending'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Admin name:</strong> {offer.adminName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Offer Date:</strong> {new Date(offer.timestamp).toLocaleDateString()}
                  </Typography>
                </Card>
              ))
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Candprofile;
