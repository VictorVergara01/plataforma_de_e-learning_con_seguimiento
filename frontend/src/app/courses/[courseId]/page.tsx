'use client';
import { useState } from 'react';
import { Star, Clock, Users, CheckCircle, Play, ShoppingCart, Award } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface CourseDetailPageProps {
  params: { courseId: string };
}

const MOCK_COURSE = {
  id: '1',
  title: 'Arquitectura Avanzada en Next.js 14',
  description: 'Domina el App Router, Server Components, streaming, caching avanzado, y despliega aplicaciones de nivel empresarial. El curso más completo de Next.js 14 en español.',
  instructor: 'Ana García',
  price: 99,
  rating: 4.9,
  students: 1240,
  duration: '42h',
  level: 'Avanzado',
  image: 'from-indigo-500 to-purple-600',
  curriculum: [
    { module: 'Módulo 1: Fundamentos del App Router', lessons: ['Server vs Client Components', 'Layouts y Nested Routes', 'Loading & Error States'] },
    { module: 'Módulo 2: Data Fetching Avanzado', lessons: ['fetch() con Server Components', 'React Cache y Memoización', 'Streaming con Suspense'] },
    { module: 'Módulo 3: Deployment y Performance', lessons: ['Optimización con Vercel', 'Edge Runtime', 'Análisis con Lighthouse'] },
  ],
};

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!session) {
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/payments/create-checkout-session', {
        courseId: params.courseId,
        userId: session.user?.id,
      });
      window.location.href = data.url;
    } catch (err) {
      console.error('Error iniciando checkout:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header Banner */}
      <div className={`relative bg-gradient-to-br ${MOCK_COURSE.image} py-20 px-6 overflow-hidden`}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative max-w-5xl mx-auto">
          <span className="inline-block mb-4 text-xs font-bold uppercase tracking-widest bg-white/10 border border-white/20 px-4 py-1.5 rounded-full text-white">
            {MOCK_COURSE.level}
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white leading-tight tracking-tight max-w-3xl">
            {MOCK_COURSE.title}
          </h1>
          <p className="mt-5 text-xl text-white/80 max-w-2xl font-medium leading-relaxed">
            {MOCK_COURSE.description}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6 text-sm font-semibold text-white/80">
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-amber-400 fill-amber-400" />{MOCK_COURSE.rating} valoración</span>
            <span className="flex items-center gap-2"><Users className="w-4 h-4" />{MOCK_COURSE.students.toLocaleString()} estudiantes</span>
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{MOCK_COURSE.duration} de contenido</span>
            <span className="flex items-center gap-2"><Award className="w-4 h-4" />Certificado incluido</span>
          </div>
          <p className="mt-4 text-white/60 font-medium">Instructor: <span className="text-white font-bold">{MOCK_COURSE.instructor}</span></p>
        </div>
      </div>

      {/* Content + Sticky CTA */}
      <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-white">Contenido del Curso</h2>
          {MOCK_COURSE.curriculum.map((mod, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-900/80 border-b border-gray-800">
                <h3 className="font-bold text-gray-100 text-base">{mod.module}</h3>
                <span className="text-xs text-gray-500 font-semibold">{mod.lessons.length} lecciones</span>
              </div>
              <ul className="divide-y divide-gray-800/60">
                {mod.lessons.map((lesson, li) => (
                  <li key={li} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition-colors group">
                    <Play className="w-4 h-4 text-indigo-400/60 group-hover:text-indigo-400 flex-shrink-0 transition-colors" />
                    <span className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors">{lesson}</span>
                    {li === 0 && (
                      <span className="ml-auto text-xs font-bold text-indigo-400 bg-indigo-400/10 border border-indigo-400/20 px-2.5 py-1 rounded-full">Vista previa</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Includes */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mt-4">
            <h3 className="font-bold text-white text-lg mb-5">¿Qué incluye?</h3>
            <ul className="space-y-3.5">
              {[
                'Acceso de por vida a todo el contenido',
                'Videos en HD descargables sin conexión',
                'Recursos y archivos de código fuente',
                'Quizzes con retroalimentación inmediata',
                'Notas personales integradas',
                'Certificado de finalización PDF',
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                  <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Purchase Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className={`h-2 bg-gradient-to-r ${MOCK_COURSE.image}`} />
            <div className="p-8 space-y-6">
              <div className="text-center">
                <span className="text-5xl font-black text-white">${MOCK_COURSE.price}</span>
                <p className="text-gray-500 text-sm mt-1 font-medium">Pago único • Acceso vitalicio</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center py-4 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-60 text-lg"
              >
                {loading ? (
                  <><div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin mr-3" />Redirigiendo a Stripe...</>
                ) : (
                  <><ShoppingCart className="w-5 h-5 mr-3" />Matricularme ahora</>
                )}
              </button>
              <p className="text-center text-xs text-gray-500 font-medium">Pago 100% seguro con <span className="text-indigo-400 font-bold">Stripe</span>. Garantía de 30 días.</p>

              <ul className="space-y-3 pt-2 border-t border-gray-800">
                {[
                  `${MOCK_COURSE.duration} de video en HD`,
                  `${MOCK_COURSE.students.toLocaleString()} ya matriculados`,
                  'Certificado PDF al completar',
                  'Acceso desde cualquier dispositivo',
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm text-gray-400 font-medium">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
