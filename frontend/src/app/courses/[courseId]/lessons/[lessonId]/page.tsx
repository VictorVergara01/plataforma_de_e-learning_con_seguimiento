'use client';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, CheckCircle, ChevronRight, FileText, BookOpen } from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const MOCK_LESSON = {
  id: 'lesson1',
  title: 'Server vs Client Components',
  videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', // Placeholder público para demo
  moduleTitle: 'Módulo 1: Fundamentos del App Router',
  quiz: [
    {
      question: '¿Cuál es la ventaja principal de los Server Components?',
      options: [
        'Se ejecutan en el cliente para mayor interactividad.',
        'No envían JavaScript al cliente, mejorando el tiempo de carga.',
        'Permiten manejar eventos del DOM directamente.',
        'Son más fáciles de escribir que los Client Components.',
      ],
      correctIndex: 1,
      explanation: '¡Correcto! Los Server Components no añaden JavaScript al bundle del cliente, lo que reduce drásticamente el tiempo de carga inicial.',
    },
    {
      question: '¿Qué directiva se usa para declarar un Client Component?',
      options: ['"use client"', '"use browser"', '"client:only"', 'export default Client'],
      correctIndex: 0,
      explanation: 'Se agrega "use client" en la primera línea del archivo para convertirlo en Client Component.',
    },
  ],
};

const COURSE_LESSONS = [
  { id: 'lesson1', title: 'Server vs Client Components', duration: '14:32', done: false },
  { id: 'lesson2', title: 'Layouts y Nested Routes', duration: '18:10', done: false },
  { id: 'lesson3', title: 'Loading & Error States', duration: '11:05', done: false },
];

export default function LessonPlayer({ params }: { params: { courseId: string; lessonId: string } }) {
  const { data: session } = useSession();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Quiz
  const [quizAnswers, setQuizAnswers] = useState<(number | null)[]>(MOCK_LESSON.quiz.map(() => null));
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'quiz' | 'notes'>('quiz');

  // Notes
  const [notes, setNotes] = useState('');

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(p || 0);
  };

  const seekTo = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const bar = e.currentTarget;
    const ratio = (e.clientX - bar.getBoundingClientRect().left) / bar.offsetWidth;
    videoRef.current.currentTime = ratio * videoRef.current.duration;
  };

  const quizScore = quizSubmitted
    ? quizAnswers.filter((a, i) => a === MOCK_LESSON.quiz[i].correctIndex).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 flex items-center px-6 bg-gray-900 border-b border-gray-800 gap-4 shrink-0">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          <span className="font-semibold text-sm text-gray-300">{MOCK_LESSON.moduleTitle}</span>
          <ChevronRight className="w-4 h-4 text-gray-600" />
          <span className="font-bold text-white text-sm">{MOCK_LESSON.title}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          {/* Video Player */}
          <div className="relative bg-black aspect-video w-full group">
            <video
              ref={videoRef}
              src={MOCK_LESSON.videoUrl}
              className="w-full h-full object-cover"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
            {/* Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-5 py-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {/* Progress bar */}
              <div
                className="w-full h-1.5 bg-gray-600/60 rounded-full mb-4 cursor-pointer hover:h-2.5 transition-all"
                onClick={seekTo}
              >
                <div className="h-full bg-indigo-500 rounded-full relative" style={{ width: `${progress}%` }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow-lg -mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="p-2 text-white hover:text-indigo-400 transition-colors">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current" />}
                </button>
                <button onClick={toggleMute} className="p-2 text-white hover:text-indigo-400 transition-colors">
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <div className="flex-1" />
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                  Marcar como completada
                </button>
              </div>
            </div>

            {/* Click to play */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 bg-white/10 hover:bg-indigo-500/90 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/20 hover:border-indigo-400 transition-all duration-300 hover:scale-110 shadow-2xl">
                  <Play className="w-9 h-9 text-white fill-white ml-1" />
                </div>
              </button>
            )}
          </div>

          {/* Quiz & Notes Tabs */}
          <div className="flex-1 p-8 max-w-4xl mx-auto w-full">
            <div className="flex gap-2 mb-8 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 w-fit">
              {(['quiz', 'notes'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  {tab === 'quiz' ? '📝 Quiz' : '📒 Mis Notas'}
                </button>
              ))}
            </div>

            {activeTab === 'quiz' && (
              <div className="space-y-8">
                {!quizSubmitted ? (
                  <>
                    {MOCK_LESSON.quiz.map((q, qi) => (
                      <div key={qi} className="bg-gray-900 border border-gray-800 rounded-2xl p-7">
                        <p className="font-bold text-white text-lg mb-5">{qi + 1}. {q.question}</p>
                        <div className="space-y-3">
                          {q.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => { const a = [...quizAnswers]; a[qi] = oi; setQuizAnswers(a); }}
                              className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all ${quizAnswers[qi] === oi ? 'bg-indigo-600/20 border-indigo-500 text-white' : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => setQuizSubmitted(true)}
                      disabled={quizAnswers.some(a => a === null)}
                      className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all disabled:opacity-50 active:scale-95"
                    >
                      Enviar Respuestas
                    </button>
                  </>
                ) : (
                  <div className="space-y-6">
                    <div className={`p-7 rounded-2xl text-center border ${quizScore === MOCK_LESSON.quiz.length ? 'bg-green-500/10 border-green-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                      <p className="text-5xl font-black text-white">{quizScore}/{MOCK_LESSON.quiz.length}</p>
                      <p className="text-gray-300 mt-2 font-semibold text-lg">
                        {quizScore === MOCK_LESSON.quiz.length ? '¡Perfecto! Lo lograste 🎉' : 'Buen intento, revisa las respuestas.'}
                      </p>
                    </div>
                    {MOCK_LESSON.quiz.map((q, qi) => {
                      const correct = quizAnswers[qi] === q.correctIndex;
                      return (
                        <div key={qi} className={`bg-gray-900 border rounded-2xl p-7 ${correct ? 'border-green-500/40' : 'border-red-500/40'}`}>
                          <div className="flex items-start gap-3 mb-4">
                            <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${correct ? 'text-green-400' : 'text-red-400'}`} />
                            <p className="font-bold text-white">{q.question}</p>
                          </div>
                          <p className={`text-sm px-4 py-1.5 rounded-lg font-medium inline-block mb-4 ${correct ? 'text-green-300 bg-green-500/10' : 'text-red-300 bg-red-500/10'}`}>
                            Tu respuesta: {q.options[quizAnswers[qi]!]}
                          </p>
                          <p className="text-sm text-gray-400 font-medium bg-gray-800 rounded-xl px-5 py-4 border border-gray-700">
                            💡 {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                    <button onClick={() => { setQuizAnswers(MOCK_LESSON.quiz.map(() => null)); setQuizSubmitted(false); }} className="w-full py-3.5 border border-gray-700 hover:border-indigo-500 text-gray-300 hover:text-white font-bold rounded-2xl transition-all">
                      Reintentar Quiz
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <FileText className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-bold text-white text-lg">Notas para esta lección</h3>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={14}
                  placeholder="Toma notas mientras aprendes... Aquí se guardarán junto al timestamp del video."
                  className="w-full bg-gray-900 border border-gray-800 rounded-2xl px-6 py-5 text-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none text-base leading-relaxed placeholder-gray-600 transition-all"
                />
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm">
                  Guardar Notas
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Course Outline */}
        <div className="w-80 bg-gray-900 border-l border-gray-800 overflow-y-auto shrink-0 hidden xl:block">
          <div className="p-6 border-b border-gray-800">
            <h3 className="font-bold text-white text-base">Contenido del Curso</h3>
          </div>
          <ul className="divide-y divide-gray-800/60">
            {COURSE_LESSONS.map((lesson, i) => (
              <li key={lesson.id}>
                <button className={`w-full text-left px-5 py-5 flex items-start gap-4 hover:bg-gray-800/50 transition-colors group ${lesson.id === params.lessonId ? 'bg-indigo-500/10' : ''}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors ${lesson.id === params.lessonId ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 group-hover:bg-gray-700 group-hover:text-white'}`}>
                    {lesson.done ? <CheckCircle className="w-5 h-5 text-green-400" /> : i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-snug ${lesson.id === params.lessonId ? 'text-indigo-300' : 'text-gray-300 group-hover:text-white'}`}>
                      {lesson.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 font-medium">{lesson.duration}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
