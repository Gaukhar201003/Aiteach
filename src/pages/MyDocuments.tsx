import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { cn } from '../lib/utils';
import { 
  FileText, 
  Clock, 
  Trash2, 
  Download, 
  ExternalLink,
  ChevronRight,
  Search,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

export const MyDocuments: React.FC = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    
    const plansQuery = query(
      collection(db, 'users', user.uid, 'lessonPlans'),
      orderBy('createdAt', 'desc')
    );
    
    const tasksQuery = query(
      collection(db, 'users', user.uid, 'generatedTasks'),
      orderBy('createdAt', 'desc')
    );

    let plans: any[] = [];
    let tasks: any[] = [];

    const unsubPlans = onSnapshot(plansQuery, (snapshot) => {
      plans = snapshot.docs.map(doc => ({ id: doc.id, type: 'plan', ...doc.data() }));
      combineAndSort();
    });

    const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
      tasks = snapshot.docs.map(doc => ({ id: doc.id, type: 'task', ...doc.data() }));
      combineAndSort();
    });

    const combineAndSort = () => {
      const combined = [...plans, ...tasks].sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setDocs(combined);
      setLoading(false);
    };

    return () => {
      unsubPlans();
      unsubTasks();
    };
  }, [user]);

  const handleDelete = async (id: string, type: string) => {
    if (!user || !window.confirm('Бұл құжатты жоюды растайсыз ба?')) return;
    const path = type === 'plan' ? 'lessonPlans' : 'generatedTasks';
    await deleteDoc(doc(db, 'users', user.uid, path, id));
  };

  const filteredDocs = docs.filter(d => filter === 'all' || d.type === filter);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Менің құжаттарым</h1>
          <p className="text-gray-500">Генерацияланған барлық ҚМЖ және тапсырмалар тізімі.</p>
        </div>
        <div className="flex gap-2">
          {['all', 'plan', 'task'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                filter === f ? "bg-blue-600 text-white" : "bg-white text-gray-500 border border-gray-100 hover:bg-gray-50"
              )}
            >
              {f === 'all' ? 'Барлығы' : f === 'plan' ? 'ҚМЖ' : 'Тапсырмалар'}
            </button>
          ))}
        </div>
      </header>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-blue-600" size={32} />
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-gray-100 p-20 text-center">
          <FileText size={60} className="text-gray-100 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Құжаттар табылған жоқ</h3>
          <p className="text-gray-400">Генератор арқылы алғашқы құжатыңызды жасаңыз.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredDocs.map((p) => (
            <div key={p.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-blue-50/50 transition-all">
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  p.type === 'plan' ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"
                )}>
                  <FileText size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                    {p.type === 'task' ? p.topic : p.topic}
                  </h4>
                  <div className="flex items-center gap-4 mt-1 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> {p.createdAt?.seconds ? format(new Date(p.createdAt.seconds * 1000), 'dd.MM.yyyy HH:mm') : 'Draft'}</span>
                    <span>•</span>
                    <span>{p.subject}</span>
                    <span>•</span>
                    <span>{p.grade}-сынып</span>
                    <span>•</span>
                    <span className={p.type === 'plan' ? "text-blue-500" : "text-purple-500"}>{p.type === 'plan' ? 'ҚМЖ' : 'Тапсырма'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                  <Download size={20} />
                </button>
                <button className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" onClick={() => handleDelete(p.id, p.type)}>
                  <Trash2 size={20} />
                </button>
                <button className="p-3 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
