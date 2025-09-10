import { Routes, Route, NavLink, Navigate, useNavigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Detector from './pages/Detector';
import Logs from './pages/Logs';

const linkStyle = {
  color: 'white',
  textDecoration: 'none',
  fontSize: '18px',
  padding: '8px 12px',
  borderRadius: '6px',
  transition: 'background 0.2s',
  cursor: 'pointer',
};

const activeLinkStyle = {
  backgroundColor: '#2563eb',
  fontWeight: 'bold',
};

// Sidebar component with Logout button at bottom
function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Your logout logic here, e.g., clearing auth token
    localStorage.removeItem('authToken');
    navigate('/welcome');
  };

  const paths = ['/dashboard', '/users', '/detector', '/logs'];
  const labels = ['Dashboard', 'Users', 'Detector', 'Logs'];

  return (
    <div
      style={{
        width: '220px',
        backgroundColor: '#9c0101',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100vh',
      }}
    >
      <div>
        <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>AlertFi Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {paths.map((path, idx) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              style={({ isActive }) =>
                isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
              }
              onMouseEnter={(e) => (e.target.style.backgroundColor = '#374151')}
              onMouseLeave={(e) => (e.target.style.backgroundColor = '')}
            >
              {labels[idx]}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button at bottom */}
      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#173B45',
          border: 'none',
          color: 'white',
          fontSize: '18px',
          padding: '10px 15px',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#7f1414')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
      >
        Logout
      </button>
    </div>
  );
}

// Layout for admin pages with sidebar
function AdminLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: '30px',
          backgroundColor: '#f9fafb',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
      {/* Redirect root "/" to "/welcome" */}
      <Route path="/" element={<Navigate to="/welcome" replace />} />

      {/* Public routes */}
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin routes wrapped in layout */}
      <Route
        path="/*"
        element={
          <AdminLayout>
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="detector" element={<Detector />} />
              <Route path="logs" element={<Logs />} />
            </Routes>
          </AdminLayout>
        }
      />
    </Routes>
  );
}

export default App;
