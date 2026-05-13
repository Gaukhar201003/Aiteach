import React, { useState } from 'react';
import { Library, Copy, CheckCircle2, Tag, Search, Sparkles, Layout, Brain, Gamepad2, Users, GraduationCap, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const categories = [
  { id: "all", name: "Барлығы", icon: <Library size={18} /> },
  { id: "planning", name: "Жоспарлау", icon: <Layout size={18} /> },
  { id: "assessment", name: "Тапсырма & Бағалау", icon: <Brain size={18} /> },
  { id: "interactive", name: "Интерактив", icon: <Gamepad2 size={18} /> },
  { id: "differentiation", name: "Дифференциация", icon: <Users size={18} /> },
  { id: "feedback", name: "Рефлексия & Даму", icon: <GraduationCap size={18} /> }
];

const prompts = [
  // 1. Сабақты жоспарлау және КМЖ (Planning)
  { 
    category: "planning", 
    title: "45 минуттық егжей-тегжейлі сабақ жоспары", 
    prompt: "[Пән] бойынша [Сынып]-қа арналған [Тақырып] сабағының 45 минуттық егжей-тегжейлі жоспарын құрастыр. Сабақта белсенді оқыту әдістерін және 'Ой қозғау' стратегиясын қолдан." 
  },
  { 
    category: "planning", 
    title: "Пәнаралық байланыс орнату", 
    prompt: "[Тақырып] сабағын [Басқа пән] пәнімен қалай байланыстыруға болатынын түсіндір және сабақ барысында қолданылатын 2 мышал келтір." 
  },
  { 
    category: "planning", 
    title: "СМАРТ мақсаттар құру", 
    prompt: "[Пән] бойынша [Тақырып] сабағына арналған 3 нақты СМАРТ (нақты, өлшенетін, қолжетімді, маңызды, уақытпен шектелген) оқу мақсатын жаз." 
  },
  { 
    category: "planning", 
    title: "Информатика: Код жазу сабағы", 
    prompt: "Информатика пәнінен [Тақырып] бойынша код жазуды үйрететін практикалық сабақ жоспарын жаса. Қиындық деңгейлері бойынша 3 тапсырма қосып бер." 
  },
  { 
    category: "planning", 
    title: "Тарих: Дереккөзбен жұмыс", 
    prompt: "Тарих сабағында [Тарихи оқиға] тақырыбы бойынша тарихи дереккөздерді талдауға арналған 20 минуттық топтық жұмыс сценарийін құр." 
  },
  { 
    category: "planning", 
    title: "КМЖ: Сабақтың кіріспе бөлімі", 
    prompt: "[Тақырып] сабағына арналған психологиялық ахуалды қалыптастыру және қызығушылықты ояту кезеңіне 3 түрлі әдіс ұсын." 
  },

  // 2. Тапсырмалар мен Бағалау құралдары (Assessment)
  { 
    category: "assessment", 
    title: "Блум таксономиясының 6 деңгейі", 
    prompt: "[Тақырып] бойынша Блум таксономиясының 6 деңгейіне сәйкес келетін 6 түрлі тапсырма дайында. Әр тапсырмаға нақты дескриптор мен баллдық жүйе қоса бер." 
  },
  { 
    category: "assessment", 
    title: "БЖБ дайындау (10-15 мин)", 
    prompt: "[Тақырып] бойынша 7-сынып деңгейіне сай келетін, 3 тапсырмадан тұратын Бөлім бойынша жиынтық бағалау (БЖБ) нұсқасын жаса." 
  },
  { 
    category: "assessment", 
    title: "Логикалық есептер жинағы", 
    prompt: "[Математика/Физика] пәнінен [Тақырып] бойынша оқушылардың сыни ойлауын дамытатын 5 логикалық есеп құрастыр." 
  },
  { 
    category: "assessment", 
    title: "Мәтін бойынша сұрақтар", 
    prompt: "[Тақырып] мәтініне негізделген 5 сұрақ дайында: 2 сұрақ - ашық, 3 сұрақ - жабық (аргументтерді қажет ететін)." 
  },
  { 
    category: "assessment", 
    title: "Тест: Ақиқат / Жалған", 
    prompt: "[Тақырып] бойынша оқушылардың теориялық білімін тексеруге арналған 10 'Ақиқат немесе Жалған' форматындағы сұрақ дайында." 
  },
  { 
    category: "assessment", 
    title: "Шығармашылық жоба тақырыптары", 
    prompt: "[Тақырып] бойынша оқушыларға арналған 5 мазмұнды және өзекті шығармашылық жоба (немесе эссе) тақырыбын ұсын." 
  },

  // 3. Сабақты интерактивті және ойын түрінде өткізу (Interactive)
  { 
    category: "interactive", 
    title: "5 минуттық викторина (Kahoot стилі)", 
    prompt: "[Тақырып] бойынша оқушыларға арналған 5 минуттық 10 сұрақтан тұратын викторина сценарийін жазып бер. Сабақтың басында қолданылады." 
  },
  { 
    category: "interactive", 
    title: "Квест ойыны", 
    prompt: "[Тақырып] бойынша сынып ішінде 15 минутта орындалатын 4 'бекеттен' тұратын білім беру квестінің жоспарын жаса." 
  },
  { 
    category: "interactive", 
    title: "Рөлдік ойын сценарийі", 
    prompt: "[Тақырып] аясында оқушылардың коммуникативтік дағдыларын дамытатын қысқа рөлдік ойын дайында (мысалы: сұхбат, сот отырысы, диалог)." 
  },
  { 
    category: "interactive", 
    title: "Дебат тақырыптары", 
    prompt: "[Тақырып] бойынша сыныпта дебат өткізуге арналған 2 қарама-қайшы пікірді тұжырымда және спикерлерге арналған негізгі аргументтерді ұсын." 
  },
  { 
    category: "interactive", 
    title: "Кім жылдам? сайысы", 
    prompt: "[Пән] сабағында жаңа тақырыпты бекітуге арналған 3 минуттық 'Кім жылдам?' блиц-сайысына арналған 15 қысқа сұрақ дайында." 
  },

  // 4. Дифференциация және Инклюзивті оқыту (Differentiation)
  { 
    category: "differentiation", 
    title: "Үлгерімі төмен оқушыға көмек", 
    prompt: "[Тақырыпты] үлгерімі төмен оқушыға қарапайым тілмен, аналогиялар арқылы түсіндіріп бер және оған арналған жеңілдетілген 3 тапсырма құрастыр." 
  },
  { 
    category: "differentiation", 
    title: "Дарынды балаларға арналған тапсырма", 
    prompt: "[Тақырып] бойынша озық деңгейдегі оқушыға арналған, стандарттан тыс ойлауды талап ететін 1 күрделі зерттеу тапсырмасын құр." 
  },
  { 
    category: "differentiation", 
    title: "Бейімделген мәтін (Инклюзив)", 
    prompt: "[Тақырып] мәтінін ерекше білім беруді қажет ететін балаларға (ЕББҚ) арнап, қысқа сөйлемдермен және көрнекілік нұсқауларымен бейімдеп бер." 
  },
  { 
    category: "differentiation", 
    title: "Көп деңгейлі тапсырмалар (A, B, C)", 
    prompt: "[Тақырып] бойынша сыныпқа арналған 3 деңгейлі (жеңіл, орташа, күрделі) тапсырмалар жүйесін дайында." 
  },

  // 5. Мұғалімнің кәсіби дамуы және кері байланыс (Feedback)
  { 
    category: "feedback", 
    title: "Рефлексия: Білдім, Үйрендім, Қиын болды", 
    prompt: "Мұғалімнің сабақ беру стилін жақсарту үшін оқушылардан алынатын 5 рефлексиялық сұрақ дайында. Сұрақтар 'Білдім, Үйрендім, Қиын болды' форматында болсын." 
  },
  { 
    category: "feedback", 
    title: "Ата-аналармен жұмыс", 
    prompt: "[Тақырып/Мәселе] бойынша ата-аналармен тиімді қарым-қатынас орнатуға және оқушының үлгерімін талқылауға арналған 5 кеңес дайында." 
  },
  { 
    category: "feedback", 
    title: "Эмоционалды жанудың алдын алу", 
    prompt: "Мұғалім ретінде эмоционалды жанудың алдын алу үшін күнделікті жұмыста қолдануға болатын 5 практикалық техника немесе кеңес ұсын." 
  },
  { 
    category: "feedback", 
    title: "Бұлттық технологиялармен сабақ", 
    prompt: "Сабақ барысында AI құралдарын және цифрлық технологияларды (Padlet, Mentimeter және т.б.) қалай тиімді қолдануға болатыны туралы нұсқаулық жаса." 
  }
];

export const PromptLibrary: React.FC = () => {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<number | string | null>(null);
  const [viewingPrompt, setViewingPrompt] = useState<any>(null);

  const handleCopy = (text: string, id: number | string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesCat = activeCat === "all" || p.category === activeCat;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.prompt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="space-y-4">
        <div className="flex items-center gap-3 text-blue-600">
          <Sparkles size={24} className="animate-pulse" />
          <span className="font-bold uppercase tracking-wider text-sm">Ресурстар</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Промпттар кітапханасы</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
          Мұғалімдердің жұмысын жеңілдету үшін дайындалған 50-ден астам кәсіби промпт шаблондары. 
          Шаблонды көшіріп алып, өзіңіздің деректеріңізді қоссаңыз жеткілікті.
        </p>
      </header>

      {/* Search & Categories */}
      <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md pt-4 pb-6 space-y-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Промпттарды іздеу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-white border-none rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map(c => (
            <button 
              key={c.id}
              onClick={() => setActiveCat(c.id)}
              className={cn(
                 "flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2",
                 activeCat === c.id 
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100 -translate-y-0.5" 
                  : "bg-white text-gray-600 border-white hover:border-blue-100 hover:bg-blue-50/30"
              )}
            >
              {c.icon}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPrompts.map((p, i) => (
            <motion.div 
              layout
              key={i} 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => setViewingPrompt(p)}
              className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/[0.02] transition-all flex flex-col group relative overflow-hidden cursor-pointer active:scale-95"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles size={24} className="text-blue-100" />
              </div>

              <div className="flex justify-between items-start mb-8">
                 <div className="px-4 py-1.5 bg-gray-50 text-[11px] font-bold text-gray-500 rounded-xl uppercase tracking-widest flex items-center gap-2 border border-gray-100">
                    <Tag size={12} className="text-blue-500" /> 
                    {categories.find(c => c.id === p.category)?.name}
                 </div>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(p.prompt, i);
                  }}
                  className={cn(
                    "p-3 rounded-2xl transition-all",
                    copiedId === i ? "bg-green-600 text-white shadow-lg shadow-green-100" : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                  )}
                 >
                    {copiedId === i ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                 </button>
              </div>

              <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{p.title}</h3>
              <div className="relative">
                <p className="text-base text-gray-500 line-clamp-4 leading-relaxed mb-8 italic">
                  "{p.prompt}"
                </p>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              </div>

              <div className="mt-auto flex items-center justify-between">
                <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                   <CheckCircle2 size={14} />
                   <span className="text-[10px] font-bold uppercase tracking-wider">Пайдалануға дайын</span>
                </div>
                <button 
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Толық көру
                </button>
              </div>

              {/* Toast for copy */}
              <AnimatePresence>
                {copiedId === i && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2 z-10"
                  >
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-green-100">
                      <CheckCircle2 size={24} />
                    </div>
                    <span className="font-bold text-green-600">Көшірілді!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredPrompts.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Ештеңе табылмады</h3>
            <p className="text-gray-500">Басқа кілтсөздерді байқап көріңіз немесе категорияны өзгертіңіз.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {viewingPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingPrompt(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[3rem] shadow-2xl p-10 overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="px-4 py-1.5 bg-blue-50 text-[10px] font-bold text-blue-600 rounded-xl uppercase tracking-widest inline-flex items-center gap-2 mb-4">
                    <Tag size={12} /> 
                    {categories.find(c => c.id === viewingPrompt.category)?.name}
                  </div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">{viewingPrompt.title}</h2>
                </div>
                <button 
                  onClick={() => setViewingPrompt(null)}
                  className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 relative group">
                <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-wrap italic">
                  "{viewingPrompt.prompt}"
                </p>
              </div>

              <div className="mt-10 flex gap-4">
                 <button 
                  onClick={() => handleCopy(viewingPrompt.prompt, 'modal')}
                  className={cn(
                    "flex-1 py-5 rounded-[1.5rem] font-bold text-lg transition-all flex items-center justify-center gap-3",
                    copiedId === 'modal' ? "bg-green-600 text-white" : "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-100"
                  )}
                 >
                    {copiedId === 'modal' ? <CheckCircle2 size={24} /> : <Copy size={24} />}
                    {copiedId === 'modal' ? "Көшірілді!" : "Промптты көшіру"}
                 </button>
                 <button 
                  onClick={() => setViewingPrompt(null)}
                  className="px-8 py-5 bg-gray-100 text-gray-600 rounded-[1.5rem] font-bold hover:bg-gray-200 transition-all"
                 >
                   Жабу
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-20 p-10 bg-blue-900 rounded-[3rem] text-white overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-2xl font-bold mb-4">Өз промптыңды жасағың келе ме?</h3>
          <p className="text-blue-100 mb-8 leading-relaxed">
            Біздің "Промпт Құрастырушы" құралын пайдаланып, сабақ беріп жүрген пәніңізге және сыныбыңызға бейімделген жеке нұсқаулықтарыңызды жасаңыз.
          </p>
          <button className="px-8 py-4 bg-white text-blue-900 rounded-2xl font-bold hover:bg-blue-50 transition-all shadow-xl shadow-blue-950/20">
            Промпт құрастырушыға өту
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl opacity-50" />
      </footer>
    </div>
  );
};
