import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import Adminhome from './Adminhome';
import Studenthome from './Studenthome';

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const ref = doc(db, 'Users', user.uid);
          const userdata = await getDoc(ref);
          if (userdata.exists()) {
            setData(userdata.data());
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        navigate('/login');
      }
    });
  };

  return (
  <div className="w-screen min-h-screen flex flex-col items-center justify-between bg-gray-100">
    <div className="w-full flex items-center justify-center py-16 bg-gradient-to-r from-blue-100 to-blue-50">
      <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-8 px-8">
        <div className="w-full lg:w-1/2 text-center lg:text-left">
          <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Get Hired by Top Companies</h1>
          <p className="text-xl text-gray-700 mb-6">
            Unlock your potential and connect with industry-leading companies looking for talented professionals.
          </p>
          <ul className="list-disc list-inside text-left text-gray-600 mb-6">
            <li>Build a professional profile to showcase your skills.</li>
            <li>Access exclusive job opportunities tailored to your expertise.</li>
            <li>Join a network of top-performing candidates and employers.</li>
          </ul>
          <div className="flex justify-center lg:justify-start gap-4">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300" onClick={()=>navigate('/login')}>
              Log In
            </button>
            <button className="px-6 py-3 bg-gray-100 text-blue-600 border border-blue-600 rounded-md hover:bg-gray-200 transition duration-300" onClick={()=>navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <img src="choosing-best-candidate-concept_52683-43377.jpg" alt="Hiring Illustration" className="w-full h-auto object-cover rounded-lg shadow-lg" />
        </div>
      </div>
    </div>

    <div className="w-full">
      <div className="flex flex-col lg:flex-row items-stretch">
        <div className="w-full lg:w-1/2 bg-blue-500 text-white py-12 flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-semibold">For Admins</h2>
          <p className="text-lg">Hire talent, review applications, and connect with top candidates seamlessly.</p>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-md hover:bg-gray-200 transition duration-300">
            Admin Dashboard
          </button>
        </div>

        <div className="w-full lg:w-1/2 bg-green-500 text-white py-12 flex flex-col items-center text-center gap-4">
          <h2 className="text-3xl font-semibold">Get Hired</h2>
          <p className="text-lg">Create your profile, explore job opportunities, and apply to top companies with ease.</p>
          <button className="px-6 py-3 bg-white text-green-600 rounded-md hover:bg-gray-200 transition duration-300">
            Explore Opportunities
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
export default Home;
