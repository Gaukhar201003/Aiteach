import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Loader2,
  ChevronRight,
  Target,
  Brain,
  Layers,
  Wand2,
  FileText,
  Link2,
  BarChart3,
  Check
} from 'lucide-react';
import { GRADES, SUBJECTS_BY_GRADE, PROMPT_CHUNKS, TASK_FORMATS } from '../lib/constants';
import { ai, MODELS } from '../lib/ai';
import { cn } from '../lib/utils';
import ReactMarkdown from 'react-markdown';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';

export const TaskGenerator: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const [formData, setFormData] = useState({
    grade: '',
    subject: '',
    topic: '',
    goal: '',
    difficulty: 'Орташа',
    crossCurricular: '',
    includeAnswers: true,
    formats: ['standard']
  });

  const subjects = formData.grade ? SUBJECTS_BY_GRADE[formData.grade] || [] : [];

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const selectedFormats = TASK_FORMATS.filter(f => formData.formats.includes(f.id)).map(f => f.name).join(', ');
      const prompt = PROMPT_CHUNKS.task_generator
        .replace('{grade}', formData.grade)
        .replace('{subject}', formData.subject)
        .replace('{topic}', formData.topic)
        .replace('{goal}', formData.goal || '____________________')
        .replace('{difficulty}', formData.difficulty)
        .replace('{crossCurricular}', formData.crossCurricular || 'Жоқ')
        .replace('{format}', selectedFormats || 'Стандартты')
        + (formData.includeAnswers ? "" : "\n\nЕскерту: Жауаптар мен түсіндірмелерді ҚОСПА.");

      const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: prompt
      });

      setResult(response.text || '');

      // Auto-save and update stats
      if (user && response.text) {
        const batch = [
          addDoc(collection(db, 'users', user.uid, 'generatedTasks'), {
            topic: formData.topic,
            subject: formData.subject,
            grade: formData.grade,
            content: response.text,
            createdAt: serverTimestamp()
          }),
          updateDoc(doc(db, 'users', user.uid), {
            'stats.tasksGenerated': increment(1)
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
    if (!result) return;

    const sections = result.split('\n').map(line => {
      const isH1 = line.startsWith('# ');
      const isH2 = line.startsWith('## ');
      const isH3 = line.startsWith('### ');
      const isBold = line.includes('**');
      const isList = line.trim().startsWith('- ') || line.trim().match(/^\d+\./);
      
      const cleanText = line
        .replace(/^#+\s*/, '')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .trim();

      if (!cleanText) return null;

      return new Paragraph({
        text: cleanText,
        heading: isH1 ? HeadingLevel.HEADING_1 : isH2 ? HeadingLevel.HEADING_2 : isH3 ? HeadingLevel.HEADING_3 : undefined,
        bullet: isList ? { level: 0 } : undefined,
        children: isH1 || isH2 || isH3 ? undefined : [
          new TextRun({
            text: cleanText,
            bold: isBold,
            size: 24
          })
        ],
        spacing: { before: (isH1 || isH2 || isH3) ? 400 : 120, after: 120 },
        indent: isList ? { left: 720 } : undefined
      });
    }).filter(p => p !== null) as Paragraph[];

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun({
                text: "AI-teach: Тапсырмалар жинағы",
                bold: true,
                size: 40,
                color: "2563EB",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Пән: ", bold: true }),
              new TextRun({ text: formData.subject }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Сынып: ", bold: true }),
              new TextRun({ text: formData.grade }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Сабақ тақырыбы: ", bold: true }),
              new TextRun({ text: formData.topic }),
            ],
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Қиындық деңгейі: ", bold: true }),
              new TextRun({ text: formData.difficulty }),
            ],
            spacing: { after: 600 },
          }),
          ...sections
        ],
      }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${formData.topic}_тапсырмалар.docx`);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Тапсырма генераторы</h1>
        <p className="text-gray-500">Блум таксономиясы бойынша деңгейлік тапсырмалар жасаңыз.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Сынып пен Пән</label>
              <div className="grid grid-cols-2 gap-4">
                <select 
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value, subject: '' })}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
                >
                  <option value="">Сынып</option>
                  {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
                <select 
                  value={formData.subject}
                  disabled={!formData.grade}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                >
                  <option value="">Пән</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Тақырып</label>
              <input 
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Сабақ тақырыбы..."
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                <Target size={14} className="text-blue-500" />
                Оқу мақсаты
              </label>
              <textarea 
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                placeholder="Мемлекеттік бағдарламаға сай (мысалы: 7.2.1.1)..."
                rows={2}
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 resize-none"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                <Link2 size={14} className="text-blue-500" />
                Пәнаралық байланыс
              </label>
              <input 
                type="text"
                value={formData.crossCurricular}
                onChange={(e) => setFormData({ ...formData, crossCurricular: e.target.value })}
                placeholder="Мысалы: Информатика + Математика..."
                className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 flex items-center gap-2">
                <Layers size={14} className="text-blue-500" />
                Тапсырма форматы
              </label>
              <div className="space-y-2">
                {TASK_FORMATS.map((f) => {
                  const isSelected = formData.formats.includes(f.id);
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        const newFormats = isSelected 
                          ? formData.formats.filter(id => id !== f.id)
                          : [...formData.formats, f.id];
                        // Don't allow empty selection
                        if (newFormats.length > 0) {
                          setFormData({ ...formData, formats: newFormats });
                        }
                      }}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all group flex items-center justify-between",
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-100"
                          : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-white hover:border-blue-200"
                      )}
                    >
                      <div>
                        <div className="font-bold text-sm mb-1">{f.name}</div>
                        <div className={cn(
                          "text-[10px] leading-relaxed",
                          isSelected ? "text-blue-100" : "text-gray-400"
                        )}>{f.desc}</div>
                      </div>
                      {isSelected && <div className="w-2 h-2 bg-white rounded-full ring-4 ring-blue-400/30" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 size={14} className="text-blue-500" />
                  Қиындық деңгейі
                </label>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{formData.difficulty}</span>
              </div>
              <div className="flex bg-gray-50 p-1 rounded-xl gap-1">
                {['Жеңіл', 'Орташа', 'Қиын'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFormData({ ...formData, difficulty: lvl })}
                    className={cn(
                      "flex-1 py-2 text-[10px] font-bold rounded-lg transition-all",
                      formData.difficulty === lvl 
                        ? "bg-white text-blue-600 shadow-sm" 
                        : "text-gray-400 hover:text-gray-600"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-100">
               <input 
                type="checkbox"
                id="includeAnswers"
                checked={formData.includeAnswers}
                onChange={(e) => setFormData({ ...formData, includeAnswers: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
               />
               <label htmlFor="includeAnswers" className="text-[10px] font-bold text-gray-500 uppercase tracking-wider cursor-pointer flex-grow">
                 Дұрыс жауаптарды қосу
               </label>
               <div className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[8px] font-bold rounded uppercase">Мұғалім үшін</div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !formData.topic || !formData.grade}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-100 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
              Генерациялау
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          {!result && !loading ? (
            <div className="h-full min-h-[400px] bg-white rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-12">
              <Sparkles size={60} className="text-blue-100 mb-6" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Тапсырма дайын емес</h3>
              <p className="text-gray-400 max-w-xs">Параметрлерді таңдап, генерация түймесін басыңыз.</p>
            </div>
          ) : loading ? (
            <div className="h-full min-h-[400px] bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center text-center p-12">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                <Brain className="absolute inset-0 m-auto text-blue-600" size={24} />
              </div>
              <p className="mt-6 font-bold text-gray-900 animate-pulse">Интеллектуалды тапсырмалар жасалуда...</p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden"
            >
              <div className="p-6 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Генерация нәтижесі</span>
                <div className="flex gap-2">
                   <button 
                    onClick={handleCopy}
                    className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 transition-all shadow-sm"
                   >
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                   </button>
                   <button 
                    onClick={handleExportWord}
                    className="p-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2"
                   >
                      <FileText size={18} />
                      <span className="text-xs font-bold">Word</span>
                   </button>
                </div>
              </div>
              <div className="p-10 prose prose-blue max-w-none prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:text-gray-600 prose-li:text-gray-600 h-[600px] overflow-y-auto">
                <ReactMarkdown>{result || ''}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
