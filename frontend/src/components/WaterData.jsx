import React, { useState, useEffect } from 'react';
import axios from 'axios';

function WaterData() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/water-data') // Replace with your backend URL
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="mt-5 grid gap-4">
      {data.map(item => (
        <div key={item.id} className="p-4 border rounded shadow">
          <p>pH: {item.ph}</p>
          <p>Temperature: {item.temp}°C</p>
        </div>
      ))}
    </div>
  );
}

export default WaterData;
