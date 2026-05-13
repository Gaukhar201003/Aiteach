import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wand2, 
  MessageSquare, 
  ShieldCheck, 
  Lightbulb, 
  AlertTriangle, 
  BrainCircuit, 
  Loader2, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  Copy
} from 'lucide-react';
import { ai, MODELS } from '../lib/ai';
import { cn } from '../lib/utils';

import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

export const PromptBuilder: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const systemInstruct = `Сен - Prompt Engineering бойынша сарапшысың. Пайдаланушының жазған промптын қазақстандық білім беру контекстінде бағалап, кері байланыс бер.
      
      Жауапты JSON форматында қайтар:
      {
        "score": 0-100,
        "feedback": "...",
        "weaknesses": ["...", "..."],
        "suggestions": ["...", "..."],
        "improvedPrompt": "..."
      }`;

      const response = await ai.models.generateContent({
        model: MODELS.TEXT,
        contents: prompt,
        config: {
          systemInstruction: systemInstruct,
          responseMimeType: "application/json"
        }
      });

      const data = JSON.parse(response.text || '{}');
      setAnalysis(data);

      // Update stats in Firestore
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          'stats.promptsAnalyzed': increment(1)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prompt Builder</h1>
        <p className="text-gray-500">AI-мен тиімді жұмыс істеуді үйреніп, промпт жазу дағдыңызды жетілдіріңіз.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-lg font-bold text-gray-900">
                <MessageSquare className="text-blue-600" size={24} />
                Промпт жазу алаңы
              </div>
              <p className="text-sm text-gray-500">AI-ға қандай бұйрық бергіңіз келеді? Оны төменде жазыңыз, біз оны бағалап, қалай жақсарту керектігін айтамыз.</p>
              
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={8}
                placeholder="Мысалы: 7-сыныпқа алгоритм тақырыбына тапсырма жаса..."
                className="w-full p-4 bg-gray-50 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-100 resize-none font-medium text-gray-700"
              />

              <button 
                onClick={handleAnalyze}
                disabled={loading || !prompt}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <Wand2 size={20} />}
                Талдау және жақсарту
              </button>
           </section>

           <section className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100">
                <BrainCircuit className="text-blue-600 mb-4" size={32} />
                <h4 className="font-bold text-blue-900 text-sm mb-2">Context беріңіз</h4>
                <p className="text-[11px] text-blue-700 leading-relaxed">AI-ға рөл беріңіз (мұғалім, әдіскер) және нақты сынып пен пәнді көрсетіңіз.</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-[2rem] border border-purple-100">
                <Lightbulb className="text-purple-600 mb-4" size={32} />
                <h4 className="font-bold text-purple-900 text-sm mb-2">Нақтылық</h4>
                <p className="text-[11px] text-purple-700 leading-relaxed">Тапсырма форматын (кесте, тест), санын және деңгейін көрсетуді ұмытпаңыз.</p>
              </div>
           </section>
        </div>

        <div className="space-y-8">
           {!analysis && !loading ? (
             <div className="h-full min-h-[400px] bg-white rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-center p-12">
               <ShieldCheck size={80} className="text-gray-100 mb-6" />
               <h3 className="text-xl font-bold text-gray-900 mb-2">Нәтиже осында шығады</h3>
               <p className="text-gray-400 max-w-xs">Сол жақтағы өріске промпт жазып, "Талдау" түймесін басыңыз.</p>
             </div>
           ) : loading ? (
            <div className="h-full min-h-[400px] bg-white rounded-[2rem] border border-gray-100 flex flex-col items-center justify-center text-center p-12">
              <Loader2 className="text-blue-600 animate-spin mb-6" size={48} />
              <p className="font-bold text-gray-900 animate-pulse">Промпт сапасы бағалануда...</p>
            </div>
           ) : (
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-bold text-gray-900">Талдау нәтижесі</h3>
                   <div className={cn(
                     "w-16 h-16 rounded-2xl flex flex-col items-center justify-center text-white font-bold",
                     analysis.score > 70 ? "bg-green-500 shadow-green-100" : analysis.score > 40 ? "bg-orange-500 shadow-orange-100" : "bg-red-500 shadow-red-100",
                     "shadow-xl"
                   )}>
                      <span className="text-xs opacity-80 font-medium">Score</span>
                      {analysis.score}
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                      <AlertTriangle size={16} className="text-orange-500" /> Кемшіліктер:
                    </h4>
                    <ul className="space-y-2">
                       {analysis.weaknesses.map((w: string, i: number) => (
                         <li key={i} className="text-sm text-gray-600 flex gap-2">
                            <span className="text-orange-500 font-bold">•</span> {w}
                         </li>
                       ))}
                    </ul>
                  </div>

                  <div>
                     <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                       <CheckCircle2 size={16} className="text-green-500" /> Жақсарту бойынша ұсыныстар:
                     </h4>
                     <ul className="space-y-2">
                        {analysis.suggestions.map((s: string, i: number) => (
                          <li key={i} className="text-sm text-gray-600 flex gap-2">
                             <ChevronRight size={14} className="text-green-500 mt-1 shrink-0" /> {s}
                          </li>
                        ))}
                     </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 p-8 rounded-[2rem] text-white shadow-2xl relative">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold flex items-center gap-2">
                      <Sparkles size={18} className="text-blue-400" /> Жақсартылған нұсқа:
                    </h3>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 font-mono text-sm leading-relaxed text-blue-100 mb-6">
                    {analysis.improvedPrompt}
                  </div>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(analysis.improvedPrompt);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="w-full py-4 bg-white text-gray-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 size={20} className="text-green-500" /> Көшірілді
                      </>
                    ) : (
                      <>
                        <Copy size={20} /> Көшіріп алу
                      </>
                    )}
                  </button>
              </div>
            </motion.div>
           )}
        </div>
      </div>
    </div>
  );
};
