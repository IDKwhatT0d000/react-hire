import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { collection, addDoc } from 'firebase/firestore';
import {auth} from './firebase'
import { db } from './firebase';
import { supabase } from './supabase'; 
import { v4 as uuidv4 } from 'uuid';

const CandidateDetails = () => {
  const { id } = useParams();
  const [candidate, setCandidate] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null); 
  const [fileLink, setFileLink] = useState(null); 

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const docRef = doc(db, 'Users', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCandidate(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching candidate details:', error);
      }
    };
    fetchCandidate();
    console.log(auth.currentUser);
  }, [id]);

  const handleFileUpload = async () => {
    if (!file) {
      setUploadStatus('Please select a file to upload.');
      return;
    }
  
    try {
      const user = auth.currentUser;
      const { data, error } = await supabase.storage
        .from('offers')
        .upload(`${user.uid}/${candidate.id}/${file.name}`, file, {
          contentType: file.type,
        });
  
      if (error) throw error;
  
      setUploadStatus('File uploaded successfully!');
      const cloudfile = await supabase.storage
        .from('offers')
        .getPublicUrl(`${user.uid}/${candidate.id}/${file.name}`);
  
      if (user) {
        const docref = await addDoc(collection(db, 'offers'), {
          adminId: user.uid,
          studentId: candidate.id,
          studentName: candidate.name,
          fileName: file.name,
          fileUrl: cloudfile.data.publicUrl,
          status: 'offered',
          timestamp: new Date().toISOString(),
          expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
        });
        console.log('Document added with ID:', docref.id);
      }
  
      setFileLink(cloudfile.data.publicUrl);
      console.log('Uploaded file details:', data);
    } catch (error) {
      setUploadStatus('Failed to upload file.');
      console.error('Error uploading file:', error);
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      {candidate ? (
        <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">{candidate.name}</h1>
          <div className="space-y-4 text-gray-800">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Email:</span>
              <span>{candidate.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Score:</span>
              <span>{candidate.rating}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Projects:</span>
              <span>{candidate.projects}</span>
            </div>
          </div>
          <div className="mt-6">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <button
              onClick={handleFileUpload}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              send offer
            </button>
          </div>
          {uploadStatus && (
            <p className={`mt-4 text-sm ${uploadStatus.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {uploadStatus}
            </p>
          )}
          {fileLink && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Uploaded File Link:</p>
              <a
                href={fileLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                <span>{fileLink}</span>
              </a>
            </div>
          )}
        </div>
      ) : (
        <p>Loading candidate details...</p>
      )}
    </div>
  );
};

export default CandidateDetails;
