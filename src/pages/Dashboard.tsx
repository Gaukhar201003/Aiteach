import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileEdit, 
  ListChecks, 
  BrainCircuit, 
  Trophy, 
  ArrowUpRight, 
  Clock,
  Sparkles,
  Loader2
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

const LEVEL_MAP: Record<string, { label: string, progress: number, nextXp: string }> = {
  'Beginner': { label: 'Novice (Бастаушы)', progress: 20, nextXp: '100 XP' },
  'Explorer': { label: 'Explorer (Зерттеуші)', progress: 40, nextXp: '250 XP' },
  'Practitioner': { label: 'Practitioner (Тәжірибеші)', progress: 60, nextXp: '500 XP' },
  'Integrator': { label: 'Integrator (Интегратор)', progress: 80, nextXp: '1000 XP' },
  'Advanced': { label: 'Advanced (Сарапшы)', progress: 100, nextXp: 'Маман' }
};

export const Dashboard: React.FC = () => {
  const { userData, user } = useAuth();
  const [recentPlans, setRecentPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  useEffect(() => {
    const fetchRecentPlans = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'users', user.uid, 'lessonPlans'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const snapshot = await getDocs(q);
        const plans = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentPlans(plans);
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        setLoadingPlans(false);
      }
    };

    fetchRecentPlans();
  }, [user]);

  const levelInfo = LEVEL_MAP[userData?.competencyLevel || 'Beginner'];

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">AI Құзыреттілік деңгейі</p>
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full">{userData?.points || 0} XP</span>
          </div>
          <p className="text-xl font-bold text-slate-900 mt-2">{levelInfo.label}</p>
          <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div 
              className={cn("bg-blue-600 h-full rounded-full shadow-sm shadow-blue-200 transition-all duration-1000")}
              style={{ width: `${levelInfo.progress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-semibold">Келесі деңгейге дейін: {levelInfo.nextXp}</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Дайындалған ҚМЖ</p>
          <p className="text-4xl font-extrabold text-slate-900 mt-2">{userData?.stats?.plansGenerated || 0}</p>
          <p className="text-xs text-slate-400 mt-2 font-medium">Белсенді қолданушы</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Орындалған тапсырмалар</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-extrabold text-blue-600 mt-2">{userData?.completedTasksCount || 0}</p>
          </div>
          <p className="text-xs text-slate-400 mt-2 font-medium">Практикалық дағдылар</p>
        </div>
      </div>

      {/* Main View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Documents Table */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">Соңғы генерацияланған ҚМЖ</h3>
            <Link to="/documents" className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:underline">Барлығын көру</Link>
          </div>
          <div className="p-4 overflow-auto min-h-[300px]">
            {loadingPlans ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <Loader2 className="animate-spin" size={24} />
                <p className="text-xs font-bold uppercase tracking-widest">Жүктелуде...</p>
              </div>
            ) : recentPlans.length > 0 ? (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500">
                    <th className="p-3 border border-slate-200 font-bold uppercase tracking-wider">Пән / Сынып</th>
                    <th className="p-3 border border-slate-200 font-bold uppercase tracking-wider">Сабақ тақырыбы</th>
                    <th className="p-3 border border-slate-200 font-bold uppercase tracking-wider">Күні</th>
                    <th className="p-3 border border-slate-200 font-bold uppercase tracking-wider">Әрекет</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  {recentPlans.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 border border-slate-200 font-medium">{item.subject}, {item.grade}-сынып</td>
                      <td className="p-3 border border-slate-200 font-bold text-slate-900">{item.topic}</td>
                      <td className="p-3 border border-slate-200 italic text-slate-400">
                        {new Date(item.createdAt).toLocaleDateString('kk-KZ')}
                      </td>
                      <td className="p-3 border border-slate-200">
                         <Link to={`/documents?id=${item.id}`} className="text-blue-600 font-bold hover:text-blue-700">Көру</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                <FileEdit size={40} className="opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">Әзірге ҚМЖ жасалмаған</p>
                <Link to="/lesson-planner" className="text-[10px] bg-blue-600 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest hover:bg-blue-700 transition-all">Сабақ жоспарын жасау</Link>
              </div>
            )}
            
            {recentPlans.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs shadow-sm">W</div>
                   <div>
                     <p className="text-xs font-bold text-slate-800">{recentPlans[0].topic}.docx</p>
                     <p className="text-[10px] text-slate-500 uppercase font-bold">Соңғы жасалған файл</p>
                   </div>
                 </div>
                 <Link to={`/documents?id=${recentPlans[0].id}`} className="bg-white border border-slate-200 text-slate-700 text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-all">Ашу</Link>
              </div>
            )}
          </div>
        </div>

        {/* AI Tips & Progress Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-bold">Prompt Builder-де жұмыс істеу</h3>
              <p className="text-sm text-blue-100 mt-2 opacity-90 leading-relaxed font-medium">Жақсы нәтиже алу үшін AI-ға нақты рөл мен контекст беріңіз.</p>
              <Link to="/prompt-builder" className="mt-4 inline-block bg-white text-blue-600 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-blue-50 transition-colors">
                Сынап көру
              </Link>
            </div>
            <Sparkles className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight mb-4">Жұмыс барысы</h3>
            <div className="space-y-4">
              {[
                { label: 'Жасалған ҚМЖ', val: userData?.stats?.plansGenerated || 0, max: 50, color: 'bg-blue-500' },
                { label: 'Жасалған тапсырмалар', val: userData?.stats?.tasksGenerated || 0, max: 100, color: 'bg-emerald-500' },
                { label: 'Анализ жасалған промптар', val: userData?.stats?.promptsAnalyzed || 0, max: 200, color: 'bg-indigo-500' },
              ].map((skill, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider text-slate-500">
                    <span>{skill.label}</span>
                    <span className="text-blue-600">{skill.val}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all duration-1000", skill.color)} style={{ width: `${Math.min((skill.val / skill.max) * 100, 100)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t border-slate-200 px-8 py-3 -mx-8 mt-4 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-600 cursor-pointer">Басты бет</Link>
          <span className="hover:text-blue-600 cursor-pointer">Көмек орталығы</span>
        </div>
      </footer>
    </div>
  );
};
