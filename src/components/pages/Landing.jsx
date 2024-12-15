import React, { useEffect, useState } from 'react';
import Landingbar from '../subcomps/Landingbar';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { db } from '../firebase';
import { collection, query, where, getDocs } from "firebase/firestore";

const Landing = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollection = collection(db, "Users");
        const studentsQuery = query(usersCollection, where("type", "==", "student"));
        const snapshot = await getDocs(studentsQuery);
        const data = snapshot.docs.map((doc) => {
          const userData = doc.data();
          return {
            ...userData,
          };
        });
        const sortedData = data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setData(sortedData[0]);
      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  const { name, email, projects, rating } = data;

  return (
    <div className='w-full h-screen flex flex-col'>
      <Landingbar />
      <p className=' mt-5 text-white font-extrabold text-2xl'> Top Candidate</p>
      <div className='mt-5 w-[55%] bg-white h-[250px] p-5 rounded-lg shadow-md'>
        <div className="flex justify-between">
          <div>
            <img src="/person.jpg"></img>
          </div>
          <div className='flex flex-col justify-center'>
            <h2 className="text-2xl font-semibold">{name || "Student Name"}</h2>
            <p className="text-gray-600">{email || "No Email Provided"}</p>
            <p className="text-gray-500">{projects ? `Projects: ${projects}` : "No Projects"}</p>
          </div>
          <div className="w-[200px] h-[200px]">
            <CircularProgressbar value={rating} text={`${rating}`} />
          </div>
          </div> 
      </div>
    </div>
  );
}

export default Landing;

