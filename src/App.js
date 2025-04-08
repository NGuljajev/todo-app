import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';
import TodoList from './TodoList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [showRegister, setShowRegister] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    password: '',
  });

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch('/users/get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Login error:', data);
        throw new Error(data.message || `Login failed (status: ${response.status})`);
      }

      setToken(data.accessToken);
      localStorage.setItem('access_token', data.accessToken);
    } catch (error) {
      console.error('Login error details:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
  };

  const switchForm = () => {
    setShowRegister(!showRegister);
  };

  const validateForm = () => {
    // Add form validation logic here
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const apiUrl = 'https://demo2.z-bit.ee/users';

      const requestBody = {
        username: formData.username,
        firstname: formData.firstname,
        lastname: formData.lastname,
        password: formData.password,
      };

      console.log('Sending data:', requestBody);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:3000',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Server validation error:', data);
        throw new Error(data.message || `Registreerimine ebaõnnestus (status: ${response.status})`);
      }

      setTimeout(() => {
        switchForm();
      }, 2000);
    } catch (error) {
      console.error('Registration error details:', error);
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
            <Register onRegister={handleRegister} />
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
