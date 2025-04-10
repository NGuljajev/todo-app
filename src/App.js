import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import TodoList from './TodoList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (accessToken) => {
    setToken(accessToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  const switchForm = () => {
    setShowRegister(!showRegister);
  };

  const defaultUser = {
    username: "email@example.com",
    firstname: "FirstName",
    lastname: "LastName",
    password: "password123"
  };

  const sendData = async (formData) => {
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server validation error:', errorData);
        throw new Error(errorData.message || `Registreerimine ebaõnnestus (status: ${response.status})`);
      }

      console.log('Registration successful');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>📝 ToDo Rakendus</h1>
      {token ? (
        <div>
          <button onClick={handleLogout}>Logi välja</button>
          <TodoList />
        </div>
      ) : (
        <>
          {showRegister ? (
            <Register onRegister={switchForm} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <button onClick={switchForm} style={{ marginTop: '1rem' }}>
            {showRegister ? 'Mul on juba konto' : 'Registreeri uus kasutaja'}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
