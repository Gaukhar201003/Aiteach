import React from 'react';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, 
  ArrowRight, 
  Star, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const features = [
  {
    title: "КМЖ Генераторы",
    desc: "Қазақстандық стандартқа сай толыққанды сабақ жоспарларын секундтар ішінде жасаңыз.",
    icon: Sparkles,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Тапсырмалар",
    desc: "Блум таксономиясы бойынша деңгейлік тапсырмалар мен бағалау критерийлерін жасау.",
    icon: CheckCircle2,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Prompt Builder",
    desc: "Жасанды интеллектпен тиімді жұмыс істеуді үйреніп, кәсіби промпттар жазыңыз.",
    icon: BrainCircuit,
    color: "bg-purple-50 text-purple-600"
  }
];

export const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {/* Hero Section */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center bg-white/80 backdrop-blur-md rounded-[2rem] mt-6 border border-slate-200">
        <div className="flex items-center gap-2 font-bold text-2xl text-blue-600">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <BrainCircuit size={20} />
          </div>
          AI-teach
        </div>
        <div className="flex gap-4 items-center">
          <Link to="/auth" className="bg-blue-600 text-white font-bold px-8 py-2.5 rounded-lg hover:bg-blue-700 transition-all shadow-sm">Кіру</Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
            <Star size={12} fill="currentColor" />
            Цифрлық оқыту ортасы
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight tracking-tight mb-8">
            Мұғалімнің <span className="text-blue-600 italic">интеллектуалды</span> көмекшісі
          </h1>
          <p className="text-lg text-slate-500 mb-10 leading-relaxed max-w-xl font-medium">
            Нейрондық желілерді оқу процесіне тиімді интеграциялауға арналған кешенді платформа. ҚМЖ жасаудан бастап, кәсіби дамуға дейін.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/auth" className="bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 transition-all flex items-center gap-3 shadow-lg shadow-blue-500/20 group">
              Жұмысты бастау <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 relative z-10">
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles size={20} />
                </div>
                <h4 className="font-bold text-slate-900 mb-1">AI Generator</h4>
                <p className="text-xs text-slate-500 leading-relaxed">ҚМЖ мен тапсырмаларды секундтарда жасаңыз.</p>
              </div>
              <div className="p-6 bg-blue-600 rounded-2xl text-white">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-md">
                  <BrainCircuit size={20} />
                </div>
                <h4 className="font-bold mb-1">Prompt Lab</h4>
                <p className="text-xs text-blue-100 leading-relaxed">Промпт жазу өнерін терең меңгеріңіз.</p>
              </div>
              <div className="p-6 bg-slate-900 rounded-2xl text-white col-span-2">
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">8.4</div>
                      <span className="text-xs font-bold font-mono">PROMPT QUALITY</span>
                   </div>
                   <div className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Live Feedback</div>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-blue-500 w-[85%] rounded-full" />
                </div>
              </div>
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        </motion.div>
      </section>

      <section className="bg-white py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 text-center mb-20">
          <div className="inline-block px-4 py-1.5 bg-slate-50 rounded-full text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-4 border border-slate-100">
            Функционалдық мүмкіндіктер
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Тиімді білім беру құралдары</h2>
          <p className="text-slate-500 max-w-xl mx-auto font-medium">Біз мұғалімдерге тек дайын нәтиже беріп қана қоймаймыз, AI-мен сапалы жұмыс істеуге бағыттаймыз.</p>
        </div>
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -12 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all outline outline-offset-0 outline-transparent hover:outline-blue-100"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-sm", f.color)}>
                <f.icon size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-10 font-medium">{f.desc}</p>
              <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-4 transition-all text-sm uppercase tracking-wider">
                Толығырақ <ChevronRight size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-t border-slate-100">
         <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6 border border-blue-100">
              Зерттеу барысы
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Мұғалімдердің AI сауаттылығын арттыру</h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">Бұл платформа магистрлік зерттеу аясында мұғалімдердің кәсіби дағдыларын дамытуға арналған құрал ретінде жасалған.</p>
         </div>
      </section>

      <footer className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 border-b border-slate-100 pb-20 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 font-bold text-2xl text-blue-600 mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <BrainCircuit size={20} />
              </div>
              AI-teach
            </div>
            <p className="text-slate-500 max-w-sm font-medium leading-relaxed">
              Мұғалімдердің білім беруде нейрондық желілерді қолдану дағдыларын қалыптастыруға арналған кәсіби цифрлық платформа.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Платформа</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li><Link to="/generator" className="hover:text-blue-600 transition-colors">ҚМЖ генераторы</Link></li>
              <li><Link to="/prompt-builder" className="hover:text-blue-600 transition-colors">Prompt Builder</Link></li>
              <li><Link to="/theory" className="hover:text-blue-600 transition-colors">Оқу материалдары</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-8 uppercase text-xs tracking-widest">Байланыс</h4>
            <ul className="space-y-4 text-slate-500 text-sm font-bold">
              <li className="hover:text-blue-600 cursor-pointer transition-colors">info@ai-teach.kz</li>
              <li className="hover:text-blue-600 cursor-pointer transition-colors">Алматы қ., Мұғалімдер орталығы</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
           <div>&copy; 2026 AI-teach. Барлық құқықтар қорғалған.</div>
           <div className="flex gap-8">
              <span className="hover:text-slate-600 cursor-pointer">Құпиялылық саясаты</span>
              <span className="hover:text-slate-600 cursor-pointer">Қолдану ережелері</span>
           </div>
        </div>
      </footer>
    </div>
  );
};
