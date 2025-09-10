import { useState } from 'react';

export default function Settings() {
  const [name, setName] = useState('Admin User');
  const [email, setEmail] = useState('admin@alertfi.com');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    alert('Changes saved (frontend only)');
    // Reset password fields (for demo)
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Admin Profile Settings</h1>
      <form onSubmit={handleSave} style={styles.form}>
        <div style={styles.group}>
          <label style={styles.label}>Full Name:</label>
          <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Email Address:</label>
          <input style={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Current Password:</label>
          <input
            style={styles.input}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>New Password:</label>
          <input
            style={styles.input}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div style={styles.group}>
          <label style={styles.label}>Confirm New Password:</label>
          <input
            style={styles.input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div style={styles.buttonRow}>
          <button type="submit" style={styles.button}>Save Changes</button>
          <button type="button" style={styles.logout} onClick={() => alert('Logging out (frontend only)')}>
            Logout
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    background: '#fff',
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 0 20px rgba(0,0,0,0.1)',
  },
  header: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '30px',
    textAlign: 'center',
    color: '#9c0101',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  group: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontWeight: 600,
    color: '#374151',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
  logout: {
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#9c0101',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
  },
};
