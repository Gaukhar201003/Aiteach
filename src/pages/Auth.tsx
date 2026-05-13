import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowLeft, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';

const CheckCircle2: React.FC<{ size?: number; className?: string }> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const initializeUserData = async (uid: string, email: string | null, name: string | null) => {
    const userRef = doc(db, 'users', uid);
    try {
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid,
          email,
          displayName: name || email?.split('@')[0] || 'User',
          role: 'teacher',
          competencyLevel: 'Beginner',
          points: 0,
          completedTasksCount: 0,
          stats: {
            plansGenerated: 0,
            tasksGenerated: 0,
            promptsAnalyzed: 0
          },
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await initializeUserData(result.user.uid, result.user.email, result.user.displayName);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google Auth Error:', err);
      setError('Google арқылы кіру кезінде қате орын алды.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else if (mode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await initializeUserData(result.user.uid, result.user.email, name);
        navigate('/dashboard');
      } else if (mode === 'forgot') {
        setMessage('Құпия сөзді қалпына келтіру сілтемесі поштаңызға жіберілді.');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Бұл электрондық пошта тіркелген.');
      } else if (err.code === 'auth/weak-password') {
        setError('Құпия сөз тым әлсіз (кемінде 6 таңба).');
      } else if (err.code === 'auth/invalid-email') {
        setError('Электрондық пошта пішімі қате.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Электрондық пошта немесе құпия сөз қате.');
      } else {
        setError(err.message || 'Қате орын алды');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest">
        <ArrowLeft size={16} />
        Басты бетке
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 border border-slate-200"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-500/20">
            <BrainCircuit size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
            {mode === 'login' ? 'Қайта қош келдіңіз!' : mode === 'register' ? 'Тіркелу' : 'Құпия сөз'}
          </h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">
            {mode === 'login' ? 'AI-teach платформасына кіру үшін деректеріңізді енгізіңіз' : 
             mode === 'register' ? 'Платформаға тіркеліп, жаңа мүмкіндіктерді ашыңыз' :
             'Поштаңызды жазыңыз, біз қалпына келтіру сілтемесін жібереміз'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-red-100">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-green-50 text-green-600 rounded-2xl flex items-center gap-3 text-sm font-medium border border-green-100">
            <CheckCircle2 size={18} />
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Аты-жөніңіз</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium" 
                  placeholder="Берік Асанов"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium" 
                placeholder="example@mail.com"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Құпия сөз</label>
                {mode === 'login' && (
                  <button type="button" onClick={() => setMode('forgot')} className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">Ұмыттыңыз ба?</button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium" 
                  placeholder="********"
                />
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {mode === 'login' ? 'Кіру' : mode === 'register' ? 'Тіркелу' : 'Жіберу'}
          </button>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px]">
            <span className="bg-white px-4 text-slate-400 font-bold uppercase tracking-widest">немесе</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="mt-8 w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google арқылы кіру
        </button>

        <div className="mt-10 text-center text-sm font-medium">
          {mode === 'login' ? (
            <p className="text-slate-500">
              Аккаунт жоқ па? <button onClick={() => setMode('register')} className="text-blue-600 font-bold hover:underline">Тіркелу</button>
            </p>
          ) : mode === 'register' ? (
            <p className="text-slate-500">
              Аккаунт бар ма? <button onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline">Кіру</button>
            </p>
          ) : (
            <p className="text-gray-500">
               <button onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline">Кіруге оралу</button>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};
