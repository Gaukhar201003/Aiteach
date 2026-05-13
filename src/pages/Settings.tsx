import React from 'react';
import { Settings as SettingsIcon, Bell, Eye, Moon, Globe, Shield } from 'lucide-react';

export const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройкалар</h1>
        <p className="text-gray-500">Платформаны өзіңізге ыңғайлы етіп баптаңыз.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-10 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 leading-none shadow-sm">
                      <SettingsIcon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Негізгі баптаулар</h4>
                      <p className="text-xs text-gray-500 mt-1">Тіл және интерфейс параметрлері</p>
                    </div>
                 </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Globe size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Тіл</span>
                   </div>
                   <select className="bg-gray-50 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none">
                      <option>Қазақша</option>
                      <option>English</option>
                      <option>Русский</option>
                   </select>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Bell size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Хабарландырулар</span>
                   </div>
                   <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                      <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-md" />
                   </div>
                </div>

                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <Moon size={18} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Түнгі режим</span>
                   </div>
                   <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-md" />
                   </div>
                </div>
              </div>
           </div>
        </section>

        <section className="bg-red-50 p-10 rounded-[2.5rem] border border-red-100">
           <h4 className="font-bold text-red-900 mb-2">Аккаунтты жою</h4>
           <p className="text-sm text-red-700 mb-6 font-medium">Аккаунтты жойғаннан кейін барлық деректер мен құжаттар қайтарылмайды.</p>
           <button className="px-6 py-3 bg-white text-red-600 rounded-xl font-bold shadow-sm hover:shadow-md transition-all">
              Аккаунтты өшіру
           </button>
        </section>
      </div>
    </div>
  );
};
