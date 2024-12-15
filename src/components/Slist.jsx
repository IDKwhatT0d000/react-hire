import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Scard from './mui/Scard';
import { db } from './firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';

const Slist = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  const fetch = async () => {
    try {
      const ref = collection(db, 'Users');
      const dquery = query(ref, where('type', '==', 'student'));
      const students = await getDocs(dquery);
      const data = students.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setList(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleProfileView = (id) => {
    navigate(`/admin/candidate/${id}`);
  };

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {list.length > 0 ? (
          list.map((ele) => (
            <Scard
              key={ele.id}
              data={ele}
              handleclick={() => handleProfileView(ele.id)}
            />
          ))
        ) : (
          <p>No students found</p>
        )}
      </div>
    </div>
  );
};

export default Slist;
