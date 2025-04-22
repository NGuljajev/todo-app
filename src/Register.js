import React, { useState } from 'react';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: '',
    firstname: '',
    lastname: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.username.includes('@')) {
      setError('Palun sisesta korrektne e-mail');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Parool peab olema vähemalt 6 tähemärki pikk');
      return false;
    }
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Try with HTTPS first, fall back to HTTP if needed
      const apiUrl = 'https://demo2.z-bit.ee/users';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          username: formData.username,
          firstname: formData.firstname,
          lastname: formData.lastname,
          newPassword: formData.password
        }),
      });

      // Handle cases where response.json() fails
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Serveri vastus oli vigane');
      }

      if (!response.ok) {
        throw new Error(data.message || 
          `Registreerimine ebaõnnestus (status: ${response.status})`);
      }

      // Success
      setSuccess(true);
      setTimeout(() => {
        onRegister();
      }, 2000);
      
    } catch (error) {
      console.error('Registration error details:', {
        error: error.message,
        name: error.name,
        stack: error.stack
      });
      
      const errorMessage = error.message.includes('Failed to fetch') 
        ? 'Serveriga ühendamine ebaõnnestus. Palun kontrolli oma internettiühendust.'
        : error.message;
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ marginTop: '2rem', color: 'green' }}>
        <h2>Registreerimine õnnestus!</h2>
        <p>Suuname sind sisselogimislehele...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleRegister} style={{ marginTop: '2rem', maxWidth: '400px' }}>
      <h2>Registreeri uus kasutaja</h2>
      
      {error && (
        <div style={{ 
          color: 'red', 
          padding: '10px',
          marginBottom: '15px',
          border: '1px solid red',
          borderRadius: '4px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>
          E-mail*
        </label>
        <input
          id="username"
          name="username"
          type="email"
          placeholder="kasutaja@example.com"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="firstname" style={{ display: 'block', marginBottom: '5px' }}>
          Eesnimi*
        </label>
        <input
          id="firstname"
          name="firstname"
          type="text"
          placeholder="Mari"
          value={formData.firstname}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="lastname" style={{ display: 'block', marginBottom: '5px' }}>
          Perekonnanimi*
        </label>
        <input
          id="lastname"
          name="lastname"
          type="text"
          placeholder="Tamm"
          value={formData.lastname}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
          Parool* (vähemalt 6 tähemärki)
        </label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••"
          value={formData.password}
          onChange={handleChange}
          required
          minLength="6"
          style={{ width: '100%', padding: '8px' }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Registreerin...' : 'Registreeri'}
      </button>
    </form>
  );
};

export default Register;