import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Gamepad2, 
  PlayCircle, 
  CheckCircle2, 
  Clock,
  Layout,
  Trophy,
  ChevronRight,
  Brain,
  Code,
  FlaskConical,
  Languages,
  History,
  Lightbulb,
  Search,
  Filter,
  Tag,
  Lock,
  X,
  Send,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, getDocs, collection, setDoc, updateDoc, increment, query } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrorHandler';
import { gradePracticalTask } from '../services/geminiService';

const categories = [
  { id: "all", name: "Барлығы", icon: <Briefcase size={18} /> },
  { id: "ai_pedagogy", name: "Педагогика & AI", icon: <Brain size={18} /> },
  { id: "it", name: "IT & Информатика", icon: <Code size={18} /> },
  { id: "steam", name: "STEAM & Жаратылыстану", icon: <FlaskConical size={18} /> },
  { id: "languages", name: "Тілдер", icon: <Languages size={18} /> },
  { id: "humanities", name: "Гуманитарлық бағыт", icon: <History size={18} /> },
  { id: "creativity", name: "Шығармашылық", icon: <Lightbulb size={18} /> }
];

const rawPracticalTasks = [
  // AI-Pedagogy (10 tasks)
  { category: "ai_pedagogy", title: "Промпт Оптимизация", desc: "Берілген сабақ мақсатына сәйкес AI-дан барынша сапалы нәтиже алу үшін промпты түзетіңіз.", difficulty: "Beginner", time: "15 мин" },
  { category: "ai_pedagogy", title: "Блум Лабораториясы", desc: "Lesson Plan ішіндегі тапсырмаларды Блум деңгейлеріне қарай дұрыс бөлу практикасы.", difficulty: "Practitioner", time: "20 мин" },
  { category: "ai_pedagogy", title: "AI-мен Дискуссия", desc: "AI Hallucination жағдайларын анықтау және онымен аргументті түрде сөйлесу практикасы.", difficulty: "Integrator", time: "30 мин" },
  { category: "ai_pedagogy", title: "Кері байланыс шебері", desc: "AI көмегімен оқушының жауабына сындарлы және ынталандырушы кері байланыс құрастыру.", difficulty: "Beginner", time: "10 мин" },
  { category: "ai_pedagogy", title: "Дескриптор конструкторы", desc: "Күрделі шығармашылық тапсырмаға арналған 5 деңгейлі нақты дескрипторларды AI-мен жасау.", difficulty: "Practitioner", time: "15 мин" },
  { category: "ai_pedagogy", title: "Сабақ сценарийін талдау", desc: "Дайын сабақ жоспарын AI-ге талдатып, оның осал тұстарын табу және жақсарту.", difficulty: "Integrator", time: "25 мин" },
  { category: "ai_pedagogy", title: "Оқу мақсатын СМАРТ-тау", desc: "Жалпы оқу мақсатын AI көмегімен СМАРТ форматқа ауыстыру және критерийлер жазу.", difficulty: "Beginner", time: "12 мин" },
  { category: "ai_pedagogy", title: "Метакогнитивті сұрақтар", desc: "Оқушының өзін-өзі бағалауына арналған 10 терең рефлексиялық сұрақтар жинағын жасау.", difficulty: "Practitioner", time: "15 мин" },
  { category: "ai_pedagogy", title: "Инклюзивті қолдау", desc: "ЕББҚ балаларға арналған тапсырмаларды бейімдеудің 3 стратегиясын AI-мен әзірлеу.", difficulty: "Integrator", time: "20 мин" },
  { category: "ai_pedagogy", title: "Цифрлық этика", desc: "Оқушыларға AI-ды этикалық тұрғыдан қолдануды түсіндіруге арналған кейс-стади жазу.", difficulty: "Beginner", time: "15 мин" },

  // IT & Informatica (10 tasks)
  { category: "it", title: "Python негіздері квесті", desc: "7-сыныпқа арналған циклдер тақырыбы бойынша 5 деңгейлі практикалық кодтау тапсырмасын жасау.", difficulty: "Practitioner", time: "30 мин" },
  { category: "it", title: "Веб-дизайн жобасы", desc: "HTML/CSS қолданып, жеке визитка-сайт жасау бойынша оқушыларға арналған инструкция әзірлеу.", difficulty: "Integrator", time: "45 мин" },
  { category: "it", title: "Деректер базасы", desc: "SQL сұраныстарын үйретуге арналған виртуалды 'Кітапхана' қорын жоспарлау.", difficulty: "Practitioner", time: "25 мин" },
  { category: "it", title: "Киберқауіпсіздік", desc: "Күрделі пароль жасау және фишингтен қорғану бойынша интерактивті симуляция сценарийі.", difficulty: "Beginner", time: "20 мин" },
  { category: "it", title: "Алгоритмдер әлемі", desc: "Күнделікті өмірден алгоритмдерге мысалдар келтіру және оларды блок-схемамен бейнелеу.", difficulty: "Beginner", time: "15 мин" },
  { category: "it", title: "Скретч ойын-жобасы", desc: "Төменгі сыныптар үшін лабиринт ойынын жасау бойынша қадамдық нұсқаулық әзірлеу.", difficulty: "Beginner", time: "30 мин" },
  { category: "it", title: "Мобильді қосымша", desc: "App Inventor-да қарапайым калькулятор жасаудың техникалық тапсырмасын құру.", difficulty: "Practitioner", time: "40 мин" },
  { category: "it", title: "Желілік протоколдар", desc: "OSI моделін аналогиялар арқылы түсіндіруге арналған 5 минуттық бейнебаян сценарийі.", difficulty: "Integrator", time: "20 мин" },
  { category: "it", title: "Жасанды интеллект", desc: "Машиналық оқытудың қарапайым моделін (Teachable Machine) сабақта қолдану инструкциясы.", difficulty: "Practitioner", time: "25 мин" },
  { category: "it", title: "Ақпаратты кодтау", desc: "Екілік жүйемен хабарлама алмасу ойынын ұйымдастыру жоспарын құру.", difficulty: "Beginner", time: "15 мин" },

  // STEAM & Science (10 tasks)
  { category: "steam", title: "Робот-шаңсорғыш моделі", desc: "Arduino көмегімен кедергілерден айналып өтетін робот құрастырудың STEAM жоспары.", difficulty: "Integrator", time: "60 мин" },
  { category: "steam", title: "Экологиялық мониторинг", desc: "Мектеп ауласындағы ауа сапасын өлшеу бойынша зерттеу жобасының дизайнын жасау.", difficulty: "Practitioner", time: "45 мин" },
  { category: "steam", title: "Химиялық реакциялар", desc: "Қауіпсіз тұрмыстық заттармен 'жанартау' жасаудың химиялық негіздемесін түсіндіру.", difficulty: "Beginner", time: "20 мин" },
  { category: "steam", title: "Физика: Күн энергиясы", desc: "Күн батареясымен жұмыс істейтін шам жасау бойынша практикалық нұсқаулық.", difficulty: "Practitioner", time: "40 мин" },
  { category: "steam", title: "Биология: Экосистема", desc: "Аквариум немесе террариумдағы биоценозды бақылау күнделігін әзірлеу.", difficulty: "Beginner", time: "30 мин" },
  { category: "steam", title: "Архитектура және Геометрия", desc: "Геометриялық фигуралардан 'Болашақ қаласын' макеттеу бойынша топтық жұмыс.", difficulty: "Beginner", time: "45 мин" },
  { category: "steam", title: "Ғарышты игеру", desc: "Марсқа қону модулін модельдеу бойынша инженерлік есептер жинағы.", difficulty: "Integrator", time: "50 мин" },
  { category: "steam", title: "Генетикалық есептер", desc: "Адам белгілерінің тұқым қуалауын AI көмегімен талдау және болжау жасау.", difficulty: "Practitioner", time: "35 мин" },
  { category: "steam", title: "Су фильтрациясы", desc: "Табиғи материалдардан су тазартқыш сүзгі жасаудың STEAM лабораториясы.", difficulty: "Beginner", time: "40 мин" },
  { category: "steam", title: "Дыбыс физикасы", desc: "Қолдан жасалған музыкалық аспаптар арқылы акустика заңдарын зерттеу.", difficulty: "Beginner", time: "25 мин" },

  // Languages (10 tasks)
  { category: "languages", title: "Сөздік қорын байыту", desc: "Жаңа сөздерді контекст арқылы үйретуге арналған 10 минуттық интерактивті карталар.", difficulty: "Beginner", time: "15 мин" },
  { category: "languages", title: "Эссе конструкторы", desc: "Аргументті эссе жазуға арналған AI көмегімен 'қаңқа' (outline) дайындау.", difficulty: "Practitioner", time: "20 мин" },
  { category: "languages", title: "Әдеби кейіпкер сұхбаты", desc: "Шығарма кейіпкерімен AI арқылы виртуалды сұхбат өткізу сценарийін жасау.", difficulty: "Integrator", time: "30 мин" },
  { category: "languages", title: "Грамматикалық квест", desc: "Септіктер немесе шақтар бойынша мектеп ішіндегі QR-кодты квест ұйымдастыру.", difficulty: "Practitioner", time: "25 мин" },
  { category: "languages", title: "Аудармашы шеберлігі", desc: "Берілген мәтінді әртүрлі стильдерге (ресми, көркем, ауызекі) аудару тапсырмасы.", difficulty: "Beginner", time: "20 мин" },
  { category: "languages", title: "Сөйлеу дағдысы", desc: "5 минут ішінде дайындықсыз белгілі бір тақырыпта монолог айту тренингі.", difficulty: "Beginner", time: "15 мин" },
  { category: "languages", title: "Оқылым стратегиясы", desc: "Мәтіннен негізгі ойды табуға бағытталған 'Сканирлеу' әдісі бойынша тапсырма.", difficulty: "Beginner", time: "15 min" },
  { category: "languages", title: "Медиа-сауаттылық", desc: "Жаңалықтардағы манипуляцияны анықтау бойынша сыни оқылым практикасы.", difficulty: "Practitioner", time: "25 мин" },
  { category: "languages", title: "Шетелдік достармен хат", desc: "AI көмегімен хат алмасудың этикалық және грамматикалық нұсқаларын талдау.", difficulty: "Beginner", time: "20 мин" },
  { category: "languages", title: "Поэзия кеші", desc: "Өлеңнің құрылысы мен рифмасын талдауға арнайы промпт жазу.", difficulty: "Practitioner", time: "20 мин" },

  // Humanities (10 tasks)
  { category: "humanities", title: "Тарихи репортаж", desc: "Тарихи оқиға орнынан тікелей репортаж жүргізу сценарийін дайындау.", difficulty: "Practitioner", time: "30 мин" },
  { category: "humanities", title: "Картографиялық зерттеу", desc: "Ежелгі сауда жолдарын заманауи картамен салыстыру бойынша жоба.", difficulty: "Beginner", time: "25 мин" },
  { category: "humanities", title: "Философиялық диалог", desc: "Екі түрлі бағыттағы философтардың пікірталасын AI арқылы модельдеу.", difficulty: "Integrator", time: "35 мин" },
  { category: "humanities", title: "Экономика және Қаржы", desc: "Отбасылық бюджетті жоспарлау бойынша практикалық математикалық есеп.", difficulty: "Beginner", time: "20 мин" },
  { category: "humanities", title: "Құқық негіздері", desc: "Заң бұзушылық кейстерін талдау және 'қорғаушы' позициясынан сөйлеу.", difficulty: "Practitioner", time: "30 мин" },
  { category: "humanities", title: "Мәдениеттану", desc: "Әртүрлі халықтардың салт-дәстүрлерін салыстырмалы талдау бойынша презентация.", difficulty: "Beginner", time: "25 мин" },
  { category: "humanities", title: "Географиялық экспедиция", desc: "Виртуалды түрде әлемнің 7 кереметіне маршрут сызу және бюджетін есептеу.", difficulty: "Practitioner", time: "40 мин" },
  { category: "humanities", title: "Саясаттану: Сайлау", desc: "Мектеп парламентіне үміткердің сайлауалды бағдарламасын құру.", difficulty: "Beginner", time: "30 мин" },
  { category: "humanities", title: "Этнографиялық зерттеу", desc: "Өз өлкеңіздің топонимдерін (жер-су аттарын) зерттеу бойынша шағын жоба.", difficulty: "Integrator", time: "45 мин" },
  { category: "humanities", title: "Дінтану негіздері", desc: "Әлемдік діндердің ортақ құндылықтарын талдау бойынша эссе.", difficulty: "Practitioner", time: "20 мин" },

  // Creativity (5+ additional)
  { category: "creativity", title: "Болашақ мектебі", desc: "2050 жылғы мектептің архитектуралық және педагогикалық моделін жасау.", difficulty: "Integrator", time: "50 мин" },
  { category: "creativity", title: "Музыкалық нейрожелі", desc: "AI көмегімен қысқа сабақ әуенін шығару және оның әсерін сипаттау.", difficulty: "Beginner", time: "20 мин" },
  { category: "creativity", title: "Бейнебаян монтажы", desc: "Оқу материалы бойынша 1 минуттық қызықты тик-ток стиліндегі видео жасау.", difficulty: "Practitioner", time: "35 мин" },
  { category: "creativity", title: "Комикс жасау", desc: "Күрделі ғылыми тақырыпты комикс арқылы түсіндіру бойынша сториборд әзірлеу.", difficulty: "Beginner", time: "40 мин" },
  { category: "creativity", title: "Театрлық қойылым", desc: "Сыныппен қойылатын 10 минуттық тәрбиелік мәні бар қойылым сценарийі.", difficulty: "Practitioner", time: "30 мин" }
].map((t, index) => ({ ...t, id: `task_${index + 1}` }));

export const PracticalTasks: React.FC = () => {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [progress, setProgress] = useState<Record<string, any>>({});
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [answer, setAnswer] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [gradingResult, setGradingResult] = useState<any>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!auth.currentUser) return;
      
      try {
        // Fetch user data for points
        const userPath = `users/${auth.currentUser.uid}`;
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          setUserPoints(userDoc.data().points || 0);
        }

        // Fetch task progress
        const progressPath = `users/${auth.currentUser.uid}/taskProgress`;
        const q = collection(db, progressPath);
        const snapshot = await getDocs(q);
        const progressMap: Record<string, any> = {};
        snapshot.forEach(doc => {
          progressMap[doc.id] = doc.data();
        });
        setProgress(progressMap);
      } catch (error) {
        console.error("Error fetching progress:", error);
        handleFirestoreError(error, OperationType.GET, `users/${auth.currentUser.uid}/taskProgress`);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const handleStartTask = (task: any) => {
    setSelectedTask(task);
    setGradingResult(null);
    setAnswer("");
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !auth.currentUser || !selectedTask) return;
    
    setIsGrading(true);
    try {
      const result = await gradePracticalTask(selectedTask.title, selectedTask.desc, answer);
      setGradingResult(result);

      if (result.status === "completed") {
        const newPoints = userPoints + result.score;
        let newLevel = "Beginner";
        
        if (newPoints > 1000) newLevel = "Advanced";
        else if (newPoints > 600) newLevel = "Integrator";
        else if (newPoints > 300) newLevel = "Practitioner";
        else if (newPoints > 100) newLevel = "Explorer";

        // Update Firestore
        const taskPath = `users/${auth.currentUser.uid}/taskProgress/${selectedTask.id}`;
        const taskRef = doc(db, `users/${auth.currentUser.uid}/taskProgress`, selectedTask.id);
        
        try {
          await setDoc(taskRef, {
            taskId: selectedTask.id,
            status: "completed",
            score: result.score,
            feedback: result.feedback,
            detailed_analysis: result.detailed_analysis || null,
            answer: answer,
            completedAt: new Date().toISOString()
          });

          // Update User Points and Competency Level
          const userRef = doc(db, 'users', auth.currentUser.uid);
          await updateDoc(userRef, {
            points: increment(result.score),
            completedTasksCount: increment(1),
            competencyLevel: newLevel
          });
        } catch (dbError) {
          handleFirestoreError(dbError, OperationType.WRITE, taskPath);
        }

        // Update local state
        setUserPoints(newPoints);
        setProgress(prev => ({
          ...prev,
          [selectedTask.id]: { status: "completed", score: result.score }
        }));
      }
    } catch (error) {
      console.error("Grading failed:", error);
      setGradingResult({ status: 'failed', feedback: "Жүйеде қате орын алды. Қайта көріңіз." });
    } finally {
      setIsGrading(false);
    }
  };

  const filteredTasks = rawPracticalTasks.filter(p => {
    const matchesCat = activeCat === "all" || p.category === activeCat;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getTaskStatus = (task: any, indexOverall: number) => {
    if (progress[task.id]?.status === "completed") return "completed";
    
    // Check if previous task is completed (Sequential Logic)
    if (indexOverall === 0) return "unlocked";
    
    const prevTask = rawPracticalTasks[indexOverall - 1];
    if (progress[prevTask.id]?.status === "completed") return "unlocked";
    
    return "locked";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-orange-600">
            <Trophy size={24} className="animate-bounce" />
            <span className="font-bold uppercase tracking-wider text-sm">Практика</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Практикалық тапсырмалар</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Тапсырмаларды ретімен орындап, ұпай жинаңыз және шеберлігіңізді арттырыңыз.
          </p>
        </div>

        <div className="bg-white px-8 py-6 rounded-[2rem] border border-blue-50 shadow-sm flex items-center gap-6">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Жалпы ұпай</div>
            <div className="text-3xl font-black text-gray-900">{userPoints} 🚀</div>
          </div>
        </div>
      </header>

      {/* Filter & Search */}
      <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md pt-4 pb-6 space-y-6">
        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Тапсырмаларды іздеу..."
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
                 "flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-bold transition-all border-2",
                 activeCat === c.id 
                  ? "bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100" 
                  : "bg-white text-gray-600 border-white hover:border-blue-100 hover:bg-blue-50/30"
              )}
            >
              {c.icon}
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Task Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-white rounded-[2.5rem]" />)}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredTasks.map((t, i) => {
              const status = getTaskStatus(t, i);
              const isCompleted = status === "completed";
              const isLocked = status === "locked";

              return (
                <motion.div 
                  layout
                  key={t.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className={cn(
                    "bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all group flex flex-col relative",
                    isLocked ? "opacity-75 grayscale bg-gray-50" : "hover:shadow-xl"
                  )}
                >
                  <div className="flex justify-between items-start mb-6">
                     <div className="px-3 py-1 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-lg uppercase tracking-wider flex items-center gap-1.5 border border-gray-100">
                        {isLocked ? <Lock size={12} className="text-gray-400" /> : <Tag size={12} className="text-blue-500" />}
                        {t.difficulty}
                     </div>
                     <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                       <Clock size={12} /> {t.time}
                     </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 tracking-tight mb-3 group-hover:text-blue-600 transition-colors uppercase leading-tight">
                    {t.title}
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed mb-8 flex-grow line-clamp-3 italic">
                    "{t.desc}"
                  </p>
                  
                  {isCompleted ? (
                    <div className="w-full py-4 bg-green-50 text-green-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 size={18} /> Орындалды (+{progress[t.id].score} ұпай)
                    </div>
                  ) : isLocked ? (
                    <div className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold text-xs flex items-center justify-center gap-2">
                       Келесі деңгейде ашылады
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleStartTask(t)}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-100"
                    >
                      Бастау <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Task Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isGrading && setSelectedTask(null)}
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
                  <div className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-2">Практикалық тапсырма</div>
                  <h2 className="text-3xl font-black text-gray-900 leading-tight">{selectedTask.title}</h2>
                </div>
                {!isGrading && (
                  <button 
                    onClick={() => setSelectedTask(null)}
                    className="p-3 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl transition-colors"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
                   <p className="text-gray-700 leading-relaxed font-medium">
                     {selectedTask.desc}
                   </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    "Мазмұн сәйкестігі",
                    "Әдістемелік тереңдік",
                    "Практикалық құндылық",
                    "Көлем және сапа"
                  ].map((c, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      {c}
                    </div>
                  ))}
                </div>

                {gradingResult ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-8 rounded-3xl space-y-4",
                      gradingResult.status === 'completed' ? "bg-green-50 border-2 border-green-100" : "bg-red-50 border-2 border-red-100"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg",
                        gradingResult.status === 'completed' ? "bg-green-600 shadow-green-100" : "bg-red-600 shadow-red-100"
                      )}>
                        {gradingResult.status === 'completed' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-xl">Ұпай: {gradingResult.score}/100</div>
                        <div className={cn("text-sm font-bold uppercase tracking-widest", gradingResult.status === 'completed' ? "text-green-600" : "text-red-600")}>
                          {gradingResult.status === 'completed' ? "Сәтті орындалды!" : "Қайта көру керек"}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-bold">
                      {gradingResult.feedback}
                    </p>

                    {gradingResult.detailed_analysis && (
                      <div className="space-y-4 pt-2">
                        {gradingResult.detailed_analysis.pros && (
                          <div className="space-y-2">
                            <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Жақсы тұстары:</div>
                            <ul className="space-y-1">
                              {gradingResult.detailed_analysis.pros.map((item: string, idx: number) => (
                                <li key={idx} className="text-sm text-green-800 flex items-start gap-2">
                                  <span className="mt-1 w-1.5 h-1.5 bg-green-400 rounded-full shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {gradingResult.detailed_analysis.cons && (
                          <div className="space-y-2">
                            <div className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Жақсартуды қажет етеді:</div>
                            <ul className="space-y-1">
                              {gradingResult.detailed_analysis.cons.map((item: string, idx: number) => (
                                <li key={idx} className="text-sm text-red-800 flex items-start gap-2">
                                  <span className="mt-1 w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {gradingResult.detailed_analysis.suggestions && (
                          <div className="space-y-2">
                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Кеңестер:</div>
                            <ul className="space-y-1">
                              {gradingResult.detailed_analysis.suggestions.map((item: string, idx: number) => (
                                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                                  <span className="mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {gradingResult.status === 'completed' ? (
                      <button 
                        onClick={() => setSelectedTask(null)}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-green-700 transition-all"
                      >
                        Жалғастыру
                      </button>
                    ) : (
                      <button 
                        onClick={() => setGradingResult(null)}
                        className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold transition-all"
                      >
                        Қайта орындау
                      </button>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Сіздің жауабыңыз</label>
                    <textarea 
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Жауабыңызды осында жазыңыз..."
                      rows={6}
                      className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-4 focus:ring-blue-100 transition-all text-lg font-medium resize-none"
                    />
                    <button 
                      disabled={!answer.trim() || isGrading}
                      onClick={handleSubmit}
                      className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-bold text-lg shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3"
                    >
                      {isGrading ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          AI тексеруде...
                        </>
                      ) : (
                        <>
                          <Send size={24} />
                          Жауапты жіберу
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
