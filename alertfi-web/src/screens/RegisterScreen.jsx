import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !username || !password || !confirmPassword) {
      alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('https://alertfi-web-7jgc.onrender.com/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username, password }),
      });

      if (response.ok) {
        alert('Registered successfully');
        navigate('/login');
      } else {
        alert('Registration failed');
      }
    } catch (error) {
      console.error(error);
      alert('Error registering');
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Register</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          style={styles.input}
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleRegister} style={styles.button}>
          Register
        </button>

        <div style={styles.link}>
          Already have an account?{' '}
          <span
            style={styles.loginLink}
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(to bottom right, #FFFFFF, #ff4c4c)',
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
  loginLink: {
    color: '#FF5733',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

export default RegisterScreen;
