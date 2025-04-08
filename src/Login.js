import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log(password)
    const response = await fetch('https://demo2.z-bit.ee/users/get-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('access_token', data.access_token);
      onLogin(data.access_token); // teavita App komponenti
    } else {
      alert('Login ebaõnnestus: ' + data.message);
    }
  };

  return (
    <form onSubmit={handleLogin} style={{ marginTop: '2rem' }}>
      <h2>Logi sisse</h2>
      <input
        type="text"
        placeholder="Kasutajanimi"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br />
      <input
        type="password"
        placeholder="Parool"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <button type="submit">Logi sisse</button>
    </form>
  );
};

export default Login;
