import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    alert(`Registered as ${username} (${email}) (frontend only)`);
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Admin Register</h1>
        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username:
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Password:
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.button}>Register</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    width: '100%',
    background: 'linear-gradient(to bottom right, #FFFFFF, #8b0000)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    padding: '40px 30px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    maxWidth: 400,
    width: '100%',
    boxSizing: 'border-box',
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    marginBottom: 24,
    textAlign: 'center',
    background: 'linear-gradient(to right, #ff1744, #ff8a80)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontWeight: '600',
    marginBottom: '16px',
    fontSize: '16px',
    color: '#374151',
  },
  input: {
    marginTop: '8px',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    marginTop: '12px',
    background: 'linear-gradient(to right, #ff4e50, #ff1c1c)',
    color: '#fff',
    fontWeight: '600',
    fontSize: '18px',
    padding: '12px',
    borderRadius: '30px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(255, 70, 70, 0.6)',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  error: {
    color: 'red',
    marginTop: '-12px',
    marginBottom: '12px',
    fontWeight: '600',
  },
};
