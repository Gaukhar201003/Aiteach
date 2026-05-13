import React, { useState } from 'react';
import { BookOpen, Brain, Shield, Users, Lightbulb, Zap, ArrowLeft, Clock, Book, MessageSquare, LayoutGrid, AlertTriangle, UserCheck, CheckCircle, Video } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';

const topics = [
  { 
    id: 1,
    title: "Жасанды интеллект деген не?", 
    icon: Brain, 
    color: "text-blue-600 bg-blue-50",
    description: "ЖИ-дің негізгі ұғымдары, даму тарихы және қазіргі мүмкіндіктері туралы түсінік.",
    content: `
# Жасанды интеллект деген не?

Жасанды интеллект (ЖИ) – бұл адамның когнитивтік функцияларын (үйрену, мәселелерді шешу, шешім қабылдау) имитациялайтын компьютерлік жүйелердің немесе алгоритмдердің жиынтығы.

## Негізгі бағыттары:
1. **Машиналық оқыту (Machine Learning):** Деректер арқылы алгоритмдердің өздігінен жетілуі.
2. **Нейрондық желілер:** Адам миының құрылымына негізделген модельдер.
3. **Табиғи тілді өңдеу (NLP):** Адам тілін түсіну және генерациялау (мысалы, ChatGPT).

## Білім берудегі рөлі:
ЖИ мұғалімді алмастыру үшін емес, оның жұмысын жеңілдету және сапасын арттыру үшін жасалған. Ол рутиндік тапсырмаларды өз мойнына алып, мұғалімге шығармашылық жұмысқа уақыт береді.
    `
  },
  { 
    id: 2,
    title: "Білім берудегі AI трендтері", 
    icon: Zap, 
    color: "text-yellow-600 bg-yellow-50",
    description: "Заманауи білім беру жүйесіндегі ЖИ-дің негізгі трендтері мен инновациялары.",
    content: `
# Білім берудегі AI трендтері

Қазіргі кезде білім беру саласы түбегейлі өзгерістер алдында тұр.

## Негізгі трендтер:
- **Жекешелендірілген оқыту:** Әр оқушының қарқыны мен қабілетіне қарай бейімделетін оқу жоспарлары.
- **Геймификация:** Оқу процесін қызықты ету үшін ЖИ арқылы жасалған ойын элементтері.
- **Интеллектуалды туторлар:** Оқушыларға 24/7 көмек беретін виртуалды көмекшілер.

## Болашаққа көзқарас:
Мұғалімдер енді тек ақпарат беруші емес, ЖИ құралдарын басқаратын "куратор" немесе "ментор" рөліне ауысады.
    `
  },
  { 
    id: 3,
    title: "Prompt Engineering негіздері", 
    icon: Lightbulb, 
    color: "text-purple-600 bg-purple-50",
    description: "AI-дан сапалы нәтиже алу үшін сұраныстарды дұрыс құру өнері.",
    content: `
# Prompt Engineering негіздері

Промпт-инжиниринг – бұл ЖИ модельдерімен тиімді қарым-қатынас жасау дағдысы.

## Промпт құрылымы:
1. **Рөл (Role):** "Сен тәжірибелі мұғалімсің."
2. **Контекст (Context):** "8-сынып оқушыларына арналған сабақ."
3. **Тапсырма (Task):** "Ойын түріндегі тапсырма дайында."
4. **Формат (Format):** "Кесте түрінде бер."

## Жақсы промпттың белгілері:
- Нақтылық (специфика).
- Қарапайым тіл.
- Мысалдардың болуы.
    `
  },
  { 
    id: 4,
    title: "Этика және AI", 
    icon: Shield, 
    color: "text-red-600 bg-red-50",
    description: "Жасанды интеллектті қолданудағы этикалық мәселелер мен қауіпсіздік ережелері.",
    content: `
# Этика және AI

ЖИ пайдалану кезінде этикалық нормаларды сақтау – басты талап.

## Негізгі мәселелер:
- **Академиялық адалдық:** Оқушылардың ЖИ-ді көшіру үшін пайдалануы.
- **Деректердің құпиялылығы:** Жеке ақпаратты сақтау және қорғау.
- **Алгоритмдік бұрмалаушылық:** ЖИ модельдерінің біржақты пікір айтуы.

## Қалай қауіпсіз пайдалану керек?
Оқушыларға ЖИ-ді тек құрал ретінде пайдалануды, нәтижені әрқашан тексеруді (fact-checking) үйрету қажет.
    `
  },
  { 
    id: 5,
    title: "Мұғалімнің жаңа рөлі", 
    icon: Users, 
    color: "text-green-600 bg-green-50",
    description: "AI дәуіріндегі педагогтың өзгеретін функциялары мен құзыреттіліктері.",
    content: `
# Мұғалімнің жаңа рөлі

Жасанды интеллект мұғалімді алмастыра алмайды, бірақ мұғалімнің рөлін өзгертеді.

## Жаңа функционал:
- **Менторлық:** Оқушының тұлғалық дамуын бағыттау.
- **Диджитал-куратор:** ЖИ құралдарын таңдау және сүзгілеу.
- **Эмоционалды интеллект:** ЖИ бере алмайтын қолдау мен мотивация беру.

## Мұғалімнің маңыздылығы:
Тек мұғалім ғана құндылықтарды тәрбиелеп, оқушының сыни ойлауын дамыта алады.
    `
  },
  { 
    id: 6,
    title: "Сабақты жоспарлау және AI", 
    icon: BookOpen, 
    color: "text-blue-600 bg-blue-50",
    description: "ҚМЖ мен сабақ жоспарларын AI көмегімен бірнеше секундта дайындау әдістері.",
    content: `
# Сабақты жоспарлау және AI

Қысқа мерзімді жоспар (ҚМЖ) жасау енді көп уақытты қажет етпейді.

## AI көмегімен не істеуге болады?
- Мақсаттарды нақтылау.
- Әдіс-тәсілдерді (белсенді оқыту) таңдау.
- Тапсырмаларды деңгей бойынша бөлу.
- Рефлексия сұрақтарын құру.

## Процесс:
Мұғалім тақырып пен мақсатты береді, ЖИ оған бірнеше нұсқаны ұсынады, ал мұғалім ең жақсысын таңдап, өзгертулер енгізеді.
    `
  },
  { 
    id: 7,
    title: "Генеративті ЖИ және LLM", 
    icon: MessageSquare, 
    color: "text-indigo-600 bg-indigo-50",
    description: "Үлкен тілдік модельдер қалай жұмыс істейді және олардың мәтін құру ерекшелігі.",
    content: `
# Генеративті ЖИ және LLM

Генеративті жасанды интеллект (GenAI) – бұл бұрыннан бар деректерді талдап қана қоймай, жаңа мазмұн (мәтін, сурет, код, аудио) жасай алатын жүйелер.

## LLM (Large Language Models) деген не?
Тілдік модельдер миллиардтаған сөздер мен сөйлемдер арқылы оқытылған. Олар келесі сөздің қандай болатынын статистикалық ықтималдықпен болжайды.

## Негізгі модельдер:
- **GPT (OpenAI):** Ең танымал әмбебап модель.
- **Claude (Anthropic):** Қауіпсіздік пен үлкен мәтіндерді талдауға бағытталған.
- **Gemini (Google):** Мультимодальді (мәтін, сурет, видеомен қатар жұмыс істейді).

## Мұғалімдер үшін маңызы:
Бұл модельдер мұғалімге кез-келген тақырыпта мәтін жазуға, аударуға және идеялар генерациялауға көмектеседі.
    `
  },
  { 
    id: 8,
    title: "AI құралдарының картасы", 
    icon: LayoutGrid, 
    color: "text-orange-600 bg-orange-50",
    description: "Мұғалім жұмысын жеңілдететін ең тиімді сервистер мен қосымшалар шолуы.",
    content: `
# AI құралдарының картасы

Нарықта мыңдаған AI құралы бар. Оларды мақсатына қарай топтастыру маңызды.

## Мәтінмен жұмыс:
- **ChatGPT, Claude, Bing Chat:** Сұрақ-жауап, жоспарлау.
- **Quillbot:** Мәтінді қайта жазу (paraphrasing).

## Презентация:
- **Gamma, Tome:** Мазмұны мен дизайнын бірден жасау.
- **Curipod:** Интерактивті сабақ слайдтары.

## Визуал:
- **Midjourney, DALL-E:** Сапалы суреттер.
- **Canva Magic Studio:** Дизайн элементтері.

## Тест және бағалау:
- **Conker, Quizizz AI:** Сұрақтарды автоматты дайындау.
    `
  },
  { 
    id: 9,
    title: "Сыни ойлау және Галлюцинация", 
    icon: AlertTriangle, 
    color: "text-pink-600 bg-pink-50",
    description: "AI қателіктерін (галлюцинацияларды) қалай анықтауға болады?",
    content: `
# Сыни ойлау және Галлюцинация

ЖИ әрқашан дұрыс ақпарат бере бермейді. Ол кейде деректерді "ойдан шығарады", бұл құбылыс **галлюцинация** деп аталады.

## Неге галлюцинация болады?
ЖИ шындықты білмейді, ол тек сөздердің ықтималдығын есептейді. Егер оған белгісіз тақырып болса, ол логикалық көрінетін, бірақ қате жауап беруі мүмкін.

## Қалай тексеру керек?
1. **Fact-checking:** Маңызды деректерді (даталар, есімдер) Википедия немесе энциклопедиямен салыстыру.
2. **Сілтемелерді сұрау:** ЖИ-ден ақпараттың көзін сұрау (бірақ оларды да тексеру керек).
3. **Логикалық тест:** ЖИ берген жауаптың қисынына мән беру.

## Оқушыларға үйрету:
Оқушыларға ЖИ-ді "кемеңгер" емес, "қателесетін көмекші" ретінде көрсету қажет.
    `
  },
  { 
    id: 10,
    title: "Жекешелендірілген оқыту", 
    icon: UserCheck, 
    color: "text-teal-600 bg-teal-50",
    description: "Әр оқушының индивидуальды ерекшелігіне сай бағдарлама құру.",
    content: `
# Жекешелендірілген оқыту

AI мұғалімге 30 оқушының әрқайсысына жеке көзқарас танытуға мүмкіндік береді.

## Мүмкіндіктер:
- **Деңгейлі тапсырмалар:** Бір тақырыпты әр түрлі қиындықта түсіндіру.
- **Қызығушылыққа бейімдеу:** Математика есептерін оқушының сүйікті ойыны немесе фильмі арқылы түсіндіру.
- **Бейімделгіш интерфейстер:** Оқушының қателеріне қарай өзгеретін онлайн тапсырмалар.

## Практикалық мысал:
Егер оқушы физиканы түсінбесе, ЖИ-ден "Осы заңды футбол мысалында түсіндір" деп сұрауға болады.
    `
  },
  { 
    id: 11,
    title: "Бағалау және Кері байланыс", 
    icon: CheckCircle, 
    color: "text-emerald-600 bg-emerald-50",
    description: "AI арқылы эсселерді тексеру және сындарлы кері байланыс беру.",
    content: `
# Бағалау және Кері байланыс

Мұғалімдер уақытының 30-50%-ын тексеруге жұмсайды. AI бұл уақытты үнемдейді.

## Тәсілдер:
1. **Рубрикалар бойынша бағалау:** ЖИ-ге бағалау критерийлерін енгізіп, соған сай талдау сұрау.
2. **Лездік кері байланыс:** Оқушы қателерін бірден көріп, түзетуге мүмкіндік алады.
3. **Аналитика:** Жалпы сыныптың қай тақырыпты нашар меңгергенін анықтау.

## Ескерту:
Соңғы шешім мен баға әрқашан мұғалімнің құзырында болуы тиіс. AI тек көмекші құрал.
    `
  },
  { 
    id: 12,
    title: "Медиа сауаттылық және Дипфейк", 
    icon: Video, 
    color: "text-rose-600 bg-rose-50",
    description: "Жалған видеолар мен суреттерді тану және цифрлық гигиена.",
    content: `
# Медиа сауаттылық және Дипфейк

ЖИ сурет пен видеоны өте нанымды етеді, бұл дезинформациялық қауіп тудырады.

## Дипфейк деген не?
Адамның бет-әлпеті мен дауысын басқа адамның үстіне ЖИ арқылы "жапсыру".

## Қалай тануға болады?
- Көздің жыпылықтамауы немесе табиғи емес қозғалысы.
- Дауыс пен ерін қимылының сәйкес келмеуі.
- Фонның немесе ұсақ бөлшектердің бұлдырауы.

## Мектептегі тәрбие:
Оқушыларды кез-келген цифрлық мазмұнға күмәнмен қарауға және оны сенімді дереккөздермен салыстыруға баулу.
    `
  },
];

export const Theory: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<typeof topics[0] | null>(null);

  if (selectedTopic) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto"
      >
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold mb-8 transition-colors uppercase text-xs tracking-widest"
        >
          <ArrowLeft size={16} /> Артқа оралу
        </button>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-12">
          <div className={`p-10 ${selectedTopic.color} flex items-center justify-between`}>
             <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-current shadow-sm">
                  <selectedTopic.icon size={32} />
                </div>
                <div>
                   <h1 className="text-3xl font-black text-slate-900 leading-tight">{selectedTopic.title}</h1>
                   <div className="flex items-center gap-4 mt-2 text-xs font-bold uppercase tracking-widest opacity-60">
                      <span className="flex items-center gap-1.5"><Clock size={14} /> 5 мин оқу</span>
                      <span className="flex items-center gap-1.5"><Book size={14} /> Теория</span>
                   </div>
                </div>
             </div>
          </div>
          
          <div className="p-10 md:p-14">
            <div className="prose prose-slate prose-blue max-w-none prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
              <ReactMarkdown>{selectedTopic.content}</ReactMarkdown>
            </div>
            
            <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center">
               <p className="text-sm font-medium text-slate-400 italic">Сын көзбен қарап, өзіңіздің педагогикалық тәжірибеңізбен ұштастырыңыз.</p>
               <button 
                onClick={() => setSelectedTopic(null)}
                className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
               >
                 Келесі тақырып
               </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">AI Теориясы</h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          Жасанды интеллект негіздері мен білім берудегі заманауи қолдану әдістемелерін меңгеріңіз. 
          Әр тақырып педагогтарға арнайы бейімделген.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {topics.map((t, i) => (
            <motion.div 
              key={t.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setSelectedTopic(t)}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                <t.icon size={120} />
              </div>
              
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 ${t.color} shadow-sm group-hover:scale-110 transition-transform`}>
                <t.icon size={28} />
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                {t.title}
              </h3>
              
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 opacity-80">
                {t.description}
              </p>
              
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest group-hover:gap-4 transition-all">
                Оқуды бастау <BookOpen size={16} />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
