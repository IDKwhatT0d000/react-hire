import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
const Card = ({ data }) => {
    const navigate=useNavigate();
    const handleclick=()=>{
        const id=data.id;
        navigate(`/candidate/${id}`)
    }
  return (
    <div className="border p-4 rounded-lg shadow-md bg-gray-100">
      <h3 className="font-bold text-lg">{data.name}</h3>
      <div className="mt-2">
        <div className='text-blue-500 hover:border-b-2'>
            <button onClick={handleclick}>
                view
            </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
