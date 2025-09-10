import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-xl font-bold mb-6">AlertFi Admin</h2>
      <nav className="flex flex-col space-y-4">
        <Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/users" className="hover:text-yellow-400">User Management</Link>
        <Link to="/detector" className="hover:text-yellow-400">Detector Management</Link>
        <Link to="/logs" className="hover:text-yellow-400">Logs</Link>
      </nav>
    </div>
  );
}
