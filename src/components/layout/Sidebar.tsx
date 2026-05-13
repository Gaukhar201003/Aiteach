import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { 
  LayoutDashboard, 
  FileEdit, 
  ListChecks, 
  Type, 
  Library, 
  BookOpen, 
  Briefcase, 
  FolderOpen, 
  BarChart3, 
  UserCircle, 
  Settings,
  BrainCircuit
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileEdit, label: 'ҚМЖ генераторы', path: '/generator' },
  { icon: ListChecks, label: 'Тапсырма генераторы', path: '/task-generator' },
  { icon: BrainCircuit, label: 'Prompt Builder', path: '/prompt-builder' },
  { icon: Library, label: 'Prompt кітапханасы', path: '/prompt-library' },
  { icon: BookOpen, label: 'AI теориясы', path: '/theory' },
  { icon: Briefcase, label: 'Практика', path: '/practice' },
  { icon: FolderOpen, label: 'Менің құжаттарым', path: '/documents' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: UserCircle, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export const Sidebar: React.FC = () => {
  const { userData } = useAuth();
  const levels = ['Beginner', 'Explorer', 'Practitioner', 'Integrator', 'Advanced'];
  const currentIdx = levels.indexOf(userData?.competencyLevel || 'Beginner');

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-50">
      <div className="p-6 bg-blue-600 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white backdrop-blur-sm">
            <BrainCircuit size={20} />
          </div>
          AI-teach
        </div>
        <p className="text-blue-100 text-[10px] mt-1 uppercase tracking-widest font-semibold">Цифрлық оқыту ортасы</p>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item, index) => (
          <React.Fragment key={item.path}>
            {index === 5 && (
              <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Оқу орталығы</div>
            )}
            <NavLink
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group text-sm font-medium",
                isActive 
                  ? "bg-blue-50 text-blue-700" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={18} className={cn(
                "transition-colors duration-200",
                "text-slate-400 group-hover:text-blue-600"
              )} />
              {item.label}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200 shrink-0 uppercase">
            {userData?.displayName?.slice(0, 2) || 'AI'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-800 truncate">{userData?.displayName || 'User'}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold">Мұғалім</p>
          </div>
        </div>
        <div className="mt-2 bg-slate-50 rounded-lg p-3">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
            <span>Progress</span>
            <span className="text-blue-600">{userData?.competencyLevel || 'Beginner'}</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={cn("h-full bg-blue-600 rounded-full transition-all duration-1000")} 
              style={{ width: `${((currentIdx + 1) / levels.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};
