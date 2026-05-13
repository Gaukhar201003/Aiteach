import React from 'react';
import { UserCircle, Mail, Phone, MapPin, Edit3, Shield, LogOut } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export const Profile: React.FC = () => {
  const { user, userData } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Менің профилім</h1>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-all"
        >
          <LogOut size={18} /> Шығу
        </button>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm text-center">
            <div className="w-24 h-24 bg-blue-100 rounded-[2rem] mx-auto mb-6 flex items-center justify-center text-blue-600 border border-blue-200 shadow-xl shadow-blue-50">
              <UserCircle size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">{userData?.displayName}</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">{userData?.role === 'teacher' ? 'ҚР Педагогі' : 'Админ'}</p>
            <div className="inline-flex px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
              {userData?.competencyLevel || 'Beginner'}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
           <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
              <div className="flex justify-between items-center">
                 <h4 className="font-bold text-gray-900">Жалпы ақпарат</h4>
                 <button className="text-blue-600 font-bold flex items-center gap-2 text-sm">
                    <Edit3 size={16} /> Өңдеу
                 </button>
              </div>

              <div className="grid gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                      <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Телефон</p>
                      <p className="text-sm font-medium text-gray-700">+7 (707) *** ** **</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Мекен-жай</p>
                      <p className="text-sm font-medium text-gray-700">Алматы, Қазақстан</p>
                    </div>
                 </div>
              </div>
           </section>

           <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
               <h4 className="font-bold text-gray-900 mb-8">Қауіпсіздік</h4>
               <button className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-blue-600 transition-all">
                  <Shield size={18} /> Құпия сөзді өзгерту
               </button>
           </section>
        </div>
      </div>
    </div>
  );
};
