import React from 'react';
import { useAuth } from '../context/AuthContext';
import Login from './Login';
import AdminPanel from './AdminPanel';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();

  // If not authenticated, show login
  if (!isAuthenticated) {
    return <Login />;
  }

  // If authenticated but not admin, show access denied with logout action
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-600 to-red-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access the admin panel. Only administrators can access this area.
          </p>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            Your role: <span className="font-semibold capitalize">{user?.role}</span>
          </div>
          <button
            onClick={logout}
            className="mt-4 inline-flex items-center justify-center px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Return to Login
          </button>
          <p className="text-sm text-gray-500 mt-4">Use the admin account below to log in.</p>
        </div>
      </div>
    );
  }

  // If authenticated and is admin, show admin panel
  return <AdminPanel />;
};

export default ProtectedRoute;
