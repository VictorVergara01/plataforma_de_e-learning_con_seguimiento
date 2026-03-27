'use client';
import { useState, useEffect } from 'react';
import { BookOpen, Award, Clock, CheckCircle, Play, ChevronRight, TrendingUp, Star, Lock } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const MOCK_STUDENT = {
  name: 'Carlos López',
  email: 'estudiante@nexus.com',
  joinedDate: 'Enero 2024',
  totalHours: 38,
  streak: 7,
};

const MOCK_ENROLLMENTS = [
  {
    id: '1',
    title: 'Arquitectura Avanzada en Next.js 14',
    instructor: 'Ana García',
    image: 'from-indigo-500 to-purple-600',
    totalLessons: 9,
    completedLessons: 6,
    lastLesson: 'Streaming con Suspense',
    lastLessonId: 'lesson3',
    hoursInvested: 18,
    certificateReady: false,
  },
  {
    id: '3',
    title: 'AWS Cloud Architecture desde Cero',
    instructor: 'Luis Torres',
    image: 'from-amber-500 to-orange-600',
    totalLessons: 12,
    completedLessons: 12,
    lastLesson: 'Proyecto Final',
    lastLessonId: 'lesson12',
    hoursInvested: 30,
    certificateReady: true,
  },
  {
    id: '6',
    title: 'DevOps con Docker y Kubernetes',
    instructor: 'Sofia Martín',
    image: 'from-violet-500 to-purple-700',
    totalLessons: 14,
    completedLessons: 2,
    lastLesson: 'Introducción a Docker',
    lastLessonId: 'lesson2',
    hoursInvested: 4,
    certificateReady: false,
  },
];

const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    courseTitle: 'AWS Cloud Architecture desde Cero',
    image: 'from-amber-500 to-orange-600',
    issuedDate: '12 Mar 2024',
    instructor: 'Luis Torres',
  },
];

const MOCK_ACTIVITY = [
  { action: 'Completaste', detail: 'React Cache y Memoización', course: 'Next.js 14', time: 'Hace 2h' },
  { action: 'Completaste', detail: 'Introducción a Docker', course: 'DevOps', time: 'Ayer' },
  { action: 'Obtuviste certificado', detail: 'AWS Cloud Architecture', course: 'AWS', time: 'Hace 3 días' },
  { action: 'Completaste', detail: 'Edge Runtime', course: 'Next.js 14', time: 'Hace 4 días' },
];

type Tab = 'progreso' | 'certificados' | 'actividad';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('progreso');

  useEffect(() => {
    if (status === 'unauthenticated') { router.push('/login'); return; }
    if (status === 'authenticated' && (session?.user as any)?.role !== 'student') {
      router.push('/courses');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if ((session?.user as any)?.role !== 'student') return null;

  const totalCourses = MOCK_ENROLLMENTS.length;
  const completedCourses = MOCK_ENROLLMENTS.filter(e => e.completedLessons === e.totalLessons).length;
  const totalLessons = MOCK_ENROLLMENTS.reduce((acc, e) => acc + e.completedLessons, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-black text-white tracking-tight">Mi Aprendizaje</h1>
          </div>
          <Link href="/courses" className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-xl">
            Explorar más cursos <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* Welcome + Streak */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-gray-400 font-medium text-sm">Bienvenido de vuelta,</p>
            <h2 className="text-3xl font-black text-white mt-0.5">{MOCK_STUDENT.name}</h2>
            <p className="text-gray-500 text-sm mt-1">Miembro desde {MOCK_STUDENT.joinedDate}</p>
          </div>
          <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl px-5 py-3.5">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-xl font-black text-orange-400">{MOCK_STUDENT.streak} días</p>
              <p className="text-xs font-semibold text-orange-400/70">Racha de estudio</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, label: 'Cursos activos', value: totalCourses, sub: `${completedCourses} completado${completedCourses !== 1 ? 's' : ''}`, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { icon: CheckCircle, label: 'Lecciones vistas', value: totalLessons, sub: 'en todos los cursos', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
            { icon: Clock, label: 'Horas invertidas', value: `${MOCK_STUDENT.totalHours}h`, sub: 'tiempo total', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
            { icon: Award, label: 'Certificados', value: MOCK_CERTIFICATES.length, sub: 'obtenidos', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
          ].map(({ icon: Icon, label, value, sub, color, bg }) => (
            <div key={label} className={`bg-gray-900 border ${bg} rounded-2xl p-5`}>
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
              <p className="text-xs text-gray-600 font-medium mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-1 bg-gray-900/50 p-1.5 rounded-2xl border border-gray-800 w-fit mb-8">
            {([
              { key: 'progreso', label: 'Mis Cursos' },
              { key: 'certificados', label: 'Certificados' },
              { key: 'actividad', label: 'Actividad' },
            ] as { key: Tab; label: string }[]).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* === CURSOS EN PROGRESO === */}
          {activeTab === 'progreso' && (
            <div className="space-y-5">
              {MOCK_ENROLLMENTS.map(enrollment => {
                const pct = Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100);
                const completed = enrollment.completedLessons === enrollment.totalLessons;
                return (
                  <div key={enrollment.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-colors">
                    <div className="flex flex-col sm:flex-row items-stretch">
                      {/* Color stripe / thumbnail */}
                      <div className={`sm:w-2 bg-gradient-to-b ${enrollment.image} flex-shrink-0`} />

                      <div className="flex-1 p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {completed && (
                                <span className="text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2.5 py-0.5 rounded-full">
                                  Completado
                                </span>
                              )}
                              {enrollment.certificateReady && (
                                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                  <Award className="w-3 h-3" /> Certificado disponible
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-white text-lg leading-snug">{enrollment.title}</h3>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">{enrollment.instructor}</p>

                            {/* Progress bar */}
                            <div className="mt-4 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-500 font-semibold">
                                  {enrollment.completedLessons}/{enrollment.totalLessons} lecciones
                                </span>
                                <span className="text-xs font-black text-white">{pct}%</span>
                              </div>
                              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${completed ? 'from-green-500 to-emerald-400' : enrollment.image}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>

                            <p className="text-xs text-gray-600 mt-3 font-medium">
                              Última lección vista: <span className="text-gray-400">{enrollment.lastLesson}</span>
                              {' · '}<span className="text-indigo-400/70">{enrollment.hoursInvested}h invertidas</span>
                            </p>
                          </div>

                          {/* CTA */}
                          <div className="flex-shrink-0 flex flex-row sm:flex-col gap-2">
                            <Link
                              href={`/courses/${enrollment.id}/lessons/${enrollment.lastLessonId}`}
                              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                            >
                              <Play className="w-4 h-4 fill-current" />
                              {completed ? 'Repasar' : 'Continuar'}
                            </Link>
                            {enrollment.certificateReady && (
                              <button className="flex items-center gap-2 px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-xl text-sm transition-all active:scale-95">
                                <Award className="w-4 h-4" />
                                Descargar
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Suggested course */}
              <div className="bg-gray-900/50 border border-dashed border-gray-700 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-indigo-400" />
                </div>
                <div className="text-center sm:text-left flex-1">
                  <p className="font-bold text-white">¿Listo para aprender algo nuevo?</p>
                  <p className="text-sm text-gray-500 mt-0.5">Basado en tu progreso, te recomendamos <span className="text-indigo-400 font-semibold">MongoDB Avanzado y Mongoose</span>.</p>
                </div>
                <Link href="/courses/5" className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 border border-indigo-500/40 hover:border-indigo-500 text-indigo-400 hover:text-indigo-300 font-bold rounded-xl text-sm transition-all">
                  Ver curso <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {/* === CERTIFICADOS === */}
          {activeTab === 'certificados' && (
            <div className="space-y-6">
              {MOCK_CERTIFICATES.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MOCK_CERTIFICATES.map(cert => (
                      <div key={cert.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 duration-300">
                        <div className={`h-32 bg-gradient-to-br ${cert.image} relative flex items-center justify-center`}>
                          <div className="absolute inset-0 bg-black/30" />
                          <Award className="w-14 h-14 text-white/90 relative z-10 drop-shadow-xl" />
                          <div className="absolute top-3 right-3">
                            <span className="text-xs font-bold bg-white/20 backdrop-blur-sm text-white px-2.5 py-1 rounded-full border border-white/20">Verificado</span>
                          </div>
                        </div>
                        <div className="p-6">
                          <p className="font-bold text-white leading-snug">{cert.courseTitle}</p>
                          <p className="text-sm text-gray-500 font-medium mt-1">{cert.instructor}</p>
                          <p className="text-xs text-gray-600 mt-2">Emitido el {cert.issuedDate}</p>
                          <button className="mt-5 w-full py-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 active:scale-95">
                            <Award className="w-4 h-4" />
                            Descargar PDF
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Locked certificates */}
                    {MOCK_ENROLLMENTS.filter(e => !e.certificateReady).map(e => (
                      <div key={`lock-${e.id}`} className="bg-gray-900/50 border border-dashed border-gray-800 rounded-3xl overflow-hidden opacity-60">
                        <div className={`h-32 bg-gradient-to-br ${e.image} relative flex items-center justify-center opacity-40`}>
                          <Lock className="w-10 h-10 text-white/80 relative z-10" />
                        </div>
                        <div className="p-6">
                          <p className="font-bold text-gray-400 leading-snug line-clamp-2">{e.title}</p>
                          <div className="mt-3 w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${e.image}`}
                              style={{ width: `${Math.round((e.completedLessons / e.totalLessons) * 100)}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-600 mt-2 font-medium">
                            {e.completedLessons}/{e.totalLessons} lecciones • Completa el curso para obtenerlo
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-24 text-gray-600">
                  <Award className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-xl font-bold text-gray-500">Aún no tienes certificados</p>
                  <p className="text-sm mt-2 text-gray-600">Completa un curso para obtener tu primer certificado.</p>
                </div>
              )}
            </div>
          )}

          {/* === ACTIVIDAD === */}
          {activeTab === 'actividad' && (
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden">
              <div className="px-8 py-5 border-b border-gray-800">
                <h3 className="font-bold text-white">Historial de actividad</h3>
                <p className="text-sm text-gray-500 mt-0.5">Tus últimas acciones en la plataforma</p>
              </div>
              <ul className="divide-y divide-gray-800/60">
                {MOCK_ACTIVITY.map((item, i) => (
                  <li key={i} className="px-8 py-5 flex items-center gap-4 hover:bg-gray-800/40 transition-colors">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                      {item.action === 'Obtuviste certificado' ? (
                        <Award className="w-4 h-4 text-amber-400" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-200">
                        {item.action}: <span className="text-white">{item.detail}</span>
                      </p>
                      <p className="text-xs text-indigo-400/70 font-medium mt-0.5">{item.course}</p>
                    </div>
                    <span className="text-xs text-gray-600 font-medium flex-shrink-0">{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
