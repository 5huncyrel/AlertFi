import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('https://alertfi-web-7jgc.onrender.com/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.access) {
        localStorage.setItem('token', data.access);
        navigate('/home');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error logging in');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <div style={styles.link}>
          Don't have an account?{' '}
          <span
            style={styles.registerLink}
            onClick={() => navigate('/register')}
          >
            Register here
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #ffd6d6, #ff4c4c)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    border: '1px solid #ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    width: '100%',
  },
  button: {
    backgroundColor: '#FF5733',
    color: '#fff',
    padding: 12,
    border: 'none',
    borderRadius: 5,
    fontSize: 16,
    cursor: 'pointer',
    width: '100%',
  },
  link: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
  },
  registerLink: {
    color: '#FF5733',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default LoginScreen;
