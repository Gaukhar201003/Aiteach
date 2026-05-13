import React from 'react';
import { Search, Bell, Menu, UserCircle } from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

export const Navbar: React.FC = () => {
  const { userData } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-4 text-slate-600">
        <span className="text-sm font-medium">Басты бет</span>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-semibold text-slate-900">Мұғалімнің жұмыс үстелі</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
          <Bell size={22} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center gap-2">
          <span className="text-lg">+</span> Жаңа ҚМЖ жасау
        </button>
      </div>
    </header>
  );
};
