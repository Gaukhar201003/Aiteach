import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Sparkles, 
  Download, 
  Printer, 
  Copy, 
  Save, 
  ChevronRight, 
  Loader2,
  Trash2,
  Edit2
} from 'lucide-react';
import { GRADES, SUBJECTS_BY_GRADE, BOOKS_BY_SUBJECT, PROMPT_CHUNKS } from '../lib/constants';
import { ai, MODELS } from '../lib/ai';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel } from 'docx';

export const LessonPlanGenerator: React.FC = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    book: '',
    unit: '',
    topic: '',
    teacherName: '',
    organization: '',
    participantsCount: '',
    absentCount: '',
    date: new Date().toISOString().split('T')[0],
    lessonGoal: '',
    goal: '',
    duration: '45 минут',
    type: 'Жаңа тақырыпты меңгеру',
    methods: 'Түсіндіру, сұрақ-жауап, СТО',
    difficulty: 'Орташа'
  });

  const subjects = formData.grade ? SUBJECTS_BY_GRADE[formData.grade] || [] : [];
  const books = BOOKS_BY_SUBJECT[formData.subject] || BOOKS_BY_SUBJECT['default'];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const prompt = PROMPT_CHUNKS.lesson_plan
        .replace('{organization}', formData.organization || '____________________')
        .replace('{teacherName}', formData.teacherName || '____________________')
        .replace('{date}', formData.date)
        .replace('{grade}', formData.grade)
        .replace('{participants}', formData.participantsCount || '____')
        .replace('{absent}', formData.absentCount || '____')
        .replace('{unit}', formData.unit || '____________________')
        .replace('{subject}', formData.subject)
        .replace('{book}', formData.book)
        .replace('{topic}', formData.topic)
        .replace('{goal}', formData.goal || '____________________')
        .replace('{lessonGoal}', formData.lessonGoal)
        .replace('{type}', formData.type)
        .replace('{methods}', formData.methods)
        .replace('{difficulty}', formData.difficulty);

      const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: prompt
      });

      setGeneratedPlan(response.text || '');
      setStep(3);
      
      // Auto-save and update stats
      if (user) {
        const batch = [
          addDoc(collection(db, 'users', user.uid, 'lessonPlans'), {
            ...formData,
            htmlContent: response.text,
            createdAt: serverTimestamp()
          }),
          updateDoc(doc(db, 'users', user.uid), {
            'stats.plansGenerated': increment(1)
          })
        ];
        await Promise.all(batch);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportWord = async () => {
    if (!generatedPlan) return;

    // Create a structured docx
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: formData.organization || "(білім беру ұйымының атауы)",
                size: 24,
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Қысқа мерзімді (сабақ) жоспары",
                bold: true,
                size: 28,
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 200 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Бөлім:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: formData.unit })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Педагогтің аты-жөні:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: formData.teacherName })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Күні:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: formData.date })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Сынып: " + formData.grade, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: "Қатысушылар: " + formData.participantsCount + " / Қатыспағандар: " + formData.absentCount })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Сабақтың тақырыбы:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: formData.topic })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Оқу мақсаты:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: formData.goal })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Сабақтың мақсаты:", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ text: formData.lessonGoal })] }),
                ],
              }),
            ],
          }),
          new Paragraph({
             children: [new TextRun({ text: "Сабақтың барысы", bold: true, size: 24 })],
             alignment: AlignmentType.CENTER,
             spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [new TextRun({ text: "Ескерту: Толық сабақ барысы кестесін AI-teach платформасынан көре аласыз немесе осы файлды қолмен толықтыра аласыз.", italics: true, size: 20 })],
            spacing: { after: 200 }
          }),
          // Since parsing HTML table is complex, we provide the header structure
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Сабақтың кезеңі", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Педагогтің әрекеті", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Оқушының әрекеті", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Бағалау", bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Ресурстар", bold: true })] })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Сабақтың басы" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Сабақтың ортасы" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ text: "Сабақтың соңы" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                  new TableCell({ children: [new Paragraph({ text: "" })] }),
                ],
              }),
            ],
          })
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `KMZ_${formData.topic}.docx`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ҚМЖ Генераторы</h1>
          <p className="text-gray-500">Оқулық мазмұнына негізделген сапалы сабақ жоспарын жасаңыз.</p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div 
              key={s} 
              className={cn(
                "h-1.5 w-8 rounded-full transition-all duration-500",
                step >= s ? "bg-blue-600" : "bg-gray-200"
              )} 
            />
          ))}
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-blue-50/50 overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4 col-span-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Білім беру ұйымының атауы</label>
                  <input 
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="№15 мектеп-лицейі"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Сынып</label>
                  <select 
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value, subject: '' })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Сыныпты таңдаңыз</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}-сынып</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Пән</label>
                  <select 
                    value={formData.subject}
                    disabled={!formData.grade}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                  >
                    <option value="">Пәнді таңдаңыз</option>
                    {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Оқулық</label>
                  <select 
                    value={formData.book}
                    onChange={(e) => setFormData({ ...formData, book: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="">Оқулықты таңдаңыз</option>
                    {books.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Мұғалімнің аты-жөні</label>
                  <input 
                    type="text"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    placeholder="Марат Ә.Ө."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Бөлім</label>
                  <input 
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="Компьютерлік желілер"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Қатысушылар саны</label>
                  <input 
                    type="number"
                    value={formData.participantsCount}
                    onChange={(e) => setFormData({ ...formData, participantsCount: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Қатыспағандар саны</label>
                  <input 
                    type="number"
                    value={formData.absentCount}
                    onChange={(e) => setFormData({ ...formData, absentCount: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Күні</label>
                  <input 
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex justify-end">
                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.grade || !formData.subject}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  Келесі <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-10 space-y-8"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Сабақ тақырыбы</label>
                  <input 
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="Мысалы: Алгоритмдер және олардың түрлері"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Оқу мақсаты</label>
                  <textarea 
                    rows={2}
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    placeholder="7.2.1.1 - компьютерлік желілерді жіктеу..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-gray-700 ml-1">Сабақ мақсаты</label>
                  <textarea 
                    rows={3}
                    value={formData.lessonGoal}
                    onChange={(e) => setFormData({ ...formData, lessonGoal: e.target.value })}
                    placeholder="Оқушылар алгоритм ұғымын түсінеді..."
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 ml-1">Сабақ түрі</label>
                    <input 
                      type="text"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-gray-700 ml-1">Қиындық деңгейі</label>
                    <select 
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100"
                    >
                      <option>Жеңіл</option>
                      <option>Орташа</option>
                      <option>Қиын</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-gray-50 flex justify-between">
                <button 
                  onClick={() => setStep(1)}
                  className="px-10 py-4 font-bold text-gray-500 hover:text-gray-900 transition-all underline underline-offset-4"
                >
                  Артқа
                </button>
                <button 
                  onClick={handleGenerate}
                  disabled={loading || !formData.topic}
                  className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center gap-3 disabled:opacity-50 shadow-xl shadow-blue-100"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
                  Генерациялау
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && generatedPlan && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-10"
            >
              <div className="flex justify-between items-center mb-8 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex gap-4">
                  <button onClick={handleExportWord} className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <Download size={16} /> Word
                  </button>
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <Printer size={16} /> Печать
                  </button>
                  <button className="flex items-center gap-2 text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <Copy size={16} /> Көшіру
                  </button>
                </div>
                <button 
                  onClick={() => { setGeneratedPlan(null); setStep(1); }}
                  className="text-sm font-bold text-red-500 hover:text-red-600 flex items-center gap-2"
                >
                  <Trash2 size={16} /> Тазалау
                </button>
              </div>

              <div className="prose prose-blue max-w-none prose-table:border prose-table:border-gray-200 prose-th:px-4 prose-th:py-3 prose-td:px-4 prose-td:py-3 prose-th:bg-blue-50 prose-th:text-blue-900 prose-th:text-left">
                <div 
                  dangerouslySetInnerHTML={{ __html: generatedPlan }} 
                  className="generated-content"
                />
              </div>

              <div className="mt-12 pt-8 border-t border-gray-50">
                <button 
                   onClick={() => setStep(2)}
                   className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all"
                >
                   <Edit2 size={18} /> Өңдеу
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .generated-content {
          font-family: 'Times New Roman', serif;
        }
        .generated-content h1, .generated-content h2, .generated-content p {
           text-align: center;
        }
        .generated-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 2rem;
          background: white;
          font-size: 0.875rem;
          border: 1px solid black;
        }
        .generated-content th, .generated-content td {
          padding: 0.5rem 0.75rem;
          border: 1px solid black;
          color: black !important;
          text-align: left;
          vertical-align: top;
        }
        .generated-content th {
          background: #f8fafc;
          font-weight: bold;
        }
        .generated-content tr {
          background: white !important;
        }
      `}</style>
    </div>
  );
};
