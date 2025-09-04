'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);

  useEffect(() => {
    axios.get('/api/school')
      .then(res => setSchools(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Schools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {schools.map(school => (
          <div key={school.id} className="border p-3 rounded shadow hover:shadow-lg transition">
           <img src={school.image} alt={school.name} className="w-full h-48 object-cover mb-2 rounded" />
            <h3 className="font-semibold">{school.name}</h3>
            <p>{school.address}</p>
            <p>{school.city}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
