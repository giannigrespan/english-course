import React, { useState, useEffect } from 'react';
import { generateLesson } from '../services/geminiService';
import { LessonContent, Topic } from '../types';

interface LessonViewProps {
  topic: Topic;
  onComplete: (score: number) => void;
  onBack: () => void;
}

const LessonView: React.FC<LessonViewProps> = ({ topic, onComplete, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [currentStep, setCurrentStep] = useState<'theory' | 'quiz' | 'results'>('theory');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
      try {
        const data = await generateLesson(topic.title);
        if (isMounted) {
          setContent(data);
          setLoading(false);
        }
      } catch (e: any) {
        console.error(e);
        if (isMounted) {
            setLoading(false);
            if (e.message?.includes('API Key')) {
                setErrorMsg("API Key mancante. Su Vercel, rinomina la variabile in 'VITE_API_KEY' o 'REACT_APP_API_KEY'.");
            } else {
                setErrorMsg("Impossibile generare la lezione. Riprova più tardi.");
            }
        }
      }
    };
    fetchLesson();
    return () => { isMounted = false; };
  }, [topic]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const cleanText = text.replace(/\s*\(.*?\)\s*/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center animate-pulse">
        <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-xl font-bold text-white">Generazione Lezione...</h2>
        <p className="text-slate-400 mt-2">Gemini sta scrivendo appunti per {topic.title} 🤖📝</p>
      </div>
    );
  }

  if (errorMsg || !content) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Errore Configurazione</h2>
            <p className="text-slate-300 mb-6 max-w-md">{errorMsg || "Si è verificato un errore imprevisto."}</p>
            <button onClick={onBack} className="px-6 py-2 bg-slate-700 rounded-lg text-white hover:bg-slate-600">
                Torna Indietro
            </button>
          </div>
      )
  }

  // THEORY VIEW
  if (currentStep === 'theory') {
    return (
      <div className="max-w-3xl mx-auto pb-20 animate-fade-in">
        <button onClick={onBack} className="text-slate-400 hover:text-white mb-4 flex items-center gap-2 transition-colors">
          ← Torna alla Dashboard
        </button>
        
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-6 leading-tight">
          {content.title}
        </h1>
        
        {/* Explanation Card */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-accent mb-4 flex items-center gap-2">
            <span>📚</span> Teoria
          </h3>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="whitespace-pre-line text-slate-200 leading-relaxed">{content.theory}</p>
          </div>
        </div>

        {/* Vocabulary Section */}
        {content.vocabulary && content.vocabulary.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-pink-400 mb-4 flex items-center gap-2">
              <span>🧠</span> Vocabolario Chiave
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.vocabulary.map((item, idx) => (
                <div key={idx} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col gap-2 shadow-sm hover:border-slate-600 transition-colors">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-lg">{item.word}</span>
                    <button 
                      onClick={() => speakText(item.word)}
                      className="text-accent hover:text-white p-2 rounded-full hover:bg-slate-700 transition-colors"
                      title="Ascolta pronuncia"
                    >
                      🔊
                    </button>
                  </div>
                  <span className="text-slate-400 italic text-sm">{item.translation}</span>
                  <p className="text-slate-300 text-sm border-t border-slate-700 pt-2 mt-1">"{item.context}"</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples Section */}
        <div className="mb-10">
          <h3 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2">
            <span>🌟</span> Esempi
          </h3>
          <ul className="space-y-3">
            {content.examples.map((ex, idx) => (
              <li key={idx} className="flex items-center justify-between bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-slate-200 font-medium">{ex}</span>
                <button 
                  onClick={() => speakText(ex)}
                  className="text-accent hover:text-white ml-4 p-2 shrink-0 rounded-full hover:bg-slate-700 transition-colors"
                >
                  🔊
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button 
          onClick={() => setCurrentStep('quiz')}
          className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 rounded-xl font-bold text-white text-xl hover:scale-[1.01] transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
        >
          <span>Inizia il Quiz!</span> 🚀
        </button>
      </div>
    );
  }

  // QUIZ VIEW
  if (currentStep === 'quiz') {
    const question = content.quiz[currentQuizIndex];
    const isLastQuestion = currentQuizIndex === content.quiz.length - 1;

    const handleAnswer = (index: number) => {
      if (selectedOption !== null) return;
      setSelectedOption(index);
      setShowExplanation(true);
      if (index === question.correctAnswerIndex) {
        setScore(s => s + 1);
      }
    };

    const nextQuestion = () => {
      if (isLastQuestion) {
        setCurrentStep('results');
      } else {
        setCurrentQuizIndex(i => i + 1);
        setSelectedOption(null);
        setShowExplanation(false);
      }
    };

    return (
      <div className="max-w-2xl mx-auto flex flex-col justify-center min-h-[500px] animate-fade-in">
        <button onClick={onBack} className="text-slate-500 hover:text-slate-300 mb-6 text-sm">
           Esci dal quiz
        </button>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-accent h-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentQuizIndex + 1) / content.quiz.length) * 100}%` }}
          ></div>
        </div>

        <div className="mb-6 flex justify-between text-sm font-bold text-slate-400 uppercase tracking-widest">
          <span>Question {currentQuizIndex + 1} / {content.quiz.length}</span>
          <span>Score: {score}</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-8 leading-snug">{question.question}</h2>

        <div className="space-y-4 mb-8">
          {question.options.map((opt, idx) => {
            let btnClass = "w-full p-5 rounded-xl text-left font-medium transition-all border-2 flex justify-between items-center ";
            
            if (selectedOption === null) {
              btnClass += "bg-slate-800 border-slate-700 hover:border-primary hover:bg-slate-750 text-slate-200";
            } else {
              if (idx === question.correctAnswerIndex) {
                btnClass += "bg-green-500/20 border-green-500 text-green-300";
              } else if (idx === selectedOption) {
                btnClass += "bg-red-500/20 border-red-500 text-red-300";
              } else {
                btnClass += "bg-slate-800 border-slate-700 opacity-40";
              }
            }

            return (
              <button 
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedOption !== null}
                className={btnClass}
              >
                {opt}
                {selectedOption !== null && idx === question.correctAnswerIndex && <span>✅</span>}
                {selectedOption !== null && idx === selectedOption && idx !== question.correctAnswerIndex && <span>❌</span>}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/50 mb-6 animate-fade-in">
            <p className="text-blue-200">
              <span className="font-bold text-blue-100 uppercase text-xs block mb-1">Spiegazione</span> 
              {question.explanation}
            </p>
          </div>
        )}

        {selectedOption !== null && (
          <button 
            onClick={nextQuestion}
            className="w-full py-4 bg-secondary rounded-xl font-bold text-white hover:bg-pink-600 transition-colors shadow-lg shadow-secondary/20"
          >
            {isLastQuestion ? 'Vedi Risultati 🏆' : 'Prossima Domanda →'}
          </button>
        )}
      </div>
    );
  }

  // RESULTS VIEW
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-lg mx-auto animate-fade-in">
      <div className="text-8xl mb-6 filter drop-shadow-2xl animate-bounce">
        {score === content.quiz.length ? '🥇' : score >= content.quiz.length / 2 ? '🥈' : '🥉'}
      </div>
      <h2 className="text-4xl font-extrabold text-white mb-4">
        {score === content.quiz.length ? 'Perfetto!' : score >= content.quiz.length / 2 ? 'Ottimo lavoro!' : 'Continua a provare!'}
      </h2>
      
      <div className="bg-slate-800 p-6 rounded-2xl w-full mb-8 border border-slate-700">
        <p className="text-slate-400 mb-2 uppercase text-xs font-bold tracking-wider">Il tuo punteggio</p>
        <p className="text-5xl font-black text-white">
          <span className={score === content.quiz.length ? "text-green-400" : "text-accent"}>{score}</span>
          <span className="text-slate-600 text-3xl">/{content.quiz.length}</span>
        </p>
      </div>
      
      <button 
        onClick={() => onComplete(score)}
        className="w-full py-4 bg-primary rounded-xl font-bold text-white hover:bg-indigo-600 transition-all transform hover:scale-[1.02] shadow-xl shadow-indigo-500/30"
      >
        Torna alla Dashboard
      </button>
    </div>
  );
};

export default LessonView;