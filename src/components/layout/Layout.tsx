import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { Loader2 } from 'lucide-react';

export const Layout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-4 bg-white">
        <Loader2 size={40} className="text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Жүктелуде...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="p-8 flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
