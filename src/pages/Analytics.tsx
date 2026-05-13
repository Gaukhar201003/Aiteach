import React from 'react';
import { BarChart3, TrendingUp, Award, Target, Brain, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';

export const Analytics: React.FC = () => {
  const { userData } = useAuth();
  
  const stats = [
    { label: "Жалпы ұпай", value: userData?.points || 0, icon: TrendingUp, color: "text-blue-600" },
    { label: "Жасалған ҚМЖ", value: userData?.stats?.plansGenerated || 0, icon: FileText, color: "text-green-600" },
    { label: "Деңгей", value: userData?.competencyLevel || "Beginner", icon: Award, color: "text-purple-600" },
    { label: "Орындалған тапсырма", value: userData?.completedTasksCount || 0, icon: Target, color: "text-orange-600" },
  ];

  const levels = ['Beginner', 'Explorer', 'Practitioner', 'Integrator', 'Advanced'];
  const currentIdx = levels.indexOf(userData?.competencyLevel || 'Beginner');
  const progressPercent = ((currentIdx + 1) / levels.length) * 100;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
        <p className="text-gray-500">Сіздің AI дағдыларыңыздың өсу динамикасы мен жетістіктеріңіз.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
             <div className="flex items-center gap-3 mb-6">
                <div className={cn("p-2 rounded-xl bg-gray-50", s.color)}>
                  <s.icon size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{s.label}</span>
             </div>
             <p className="text-3xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Award size={120} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-8">AI Competency Level</h3>
          <div className="relative pt-10">
            <div 
              className="absolute top-0 flex flex-col items-center transition-all duration-1000"
              style={{ left: `${(currentIdx / (levels.length - 1)) * 100}%`, transform: 'translateX(-50%)' }}
            >
               <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg mb-2 shadow-lg shadow-blue-200">СІЗДІҢ ДЕҢГЕЙІҢІЗ</div>
               <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg" />
            </div>
            <div className="h-4 w-full bg-gray-100 rounded-full flex overflow-hidden">
               {levels.map((_, idx) => (
                 <div 
                  key={idx} 
                  className={cn(
                    "h-full border-r border-white last:border-0",
                    idx <= currentIdx ? "bg-blue-600" : "bg-gray-200"
                  )} 
                  style={{ width: '20%' }}
                 />
               ))}
            </div>
            <div className="flex justify-between mt-4">
              {levels.map(l => (
                <span key={l} className={cn(
                  "text-[9px] font-bold uppercase tracking-tighter",
                  l === userData?.competencyLevel ? "text-blue-600" : "text-gray-400"
                )}>{l}</span>
              ))}
            </div>
          </div>
          
          <div className="mt-12 space-y-4">
             <div className="p-6 bg-blue-50 rounded-2xl flex items-center gap-5 border border-blue-100">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                   <p className="text-sm font-bold text-blue-900">Жақсы нәтиже!</p>
                   <p className="text-xs text-blue-700/70 font-medium">Белсенділік деңгейіңізді одан әрі арттыру үшін жаңа тапсырмаларды орындаңыз.</p>
                </div>
             </div>
          </div>
        </section>

        <section className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-sm">
           <h3 className="text-xl font-bold text-gray-900 mb-8">Платформадағы жұмыс барысы</h3>
           <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Lesson Plans (ҚМЖ)</span>
                   </div>
                   <span className="font-black text-xl">{userData?.stats?.plansGenerated || 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-blue-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(((userData?.stats?.plansGenerated || 0) / 20) * 100, 100)}%` }} 
                   />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <Brain size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Prompt Analysis</span>
                   </div>
                   <span className="font-black text-xl">{userData?.stats?.promptsAnalyzed || 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-purple-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(((userData?.stats?.promptsAnalyzed || 0) / 50) * 100, 100)}%` }} 
                   />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                        <Target size={18} />
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Орындалған тапсырмалар</span>
                   </div>
                   <span className="font-black text-xl">{userData?.completedTasksCount || 0}</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                   <div 
                    className="h-full bg-orange-500 transition-all duration-1000" 
                    style={{ width: `${Math.min(((userData?.completedTasksCount || 0) / 100) * 100, 100)}%` }} 
                   />
                </div>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
};
