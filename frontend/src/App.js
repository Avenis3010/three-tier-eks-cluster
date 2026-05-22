import React, { useEffect, useState } from 'react';

function App() {

  const [message, setMessage] = useState('');

  useEffect(() => {

    fetch('http://backend-service:8085')
      .then(res => res.text())
      .then(data => setMessage(data))
      .catch(err => console.log(err));

  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Three Tier DevOps Project</h1>
      <h2>{message}</h2>
    </div>
  );
}

export default App;
