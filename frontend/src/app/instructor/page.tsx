'use client';
import { TrendingUp, Users, BookOpen, DollarSign, Star, Award, Play } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

// ── Mock data ──────────────────────────────────────────────────────────────
const STATS = [
  { icon: Users,     label: 'Estudiantes totales', value: '1,024', delta: '+12%', color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
  { icon: BookOpen,  label: 'Cursos publicados',   value: '3',     delta: null,   color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
  { icon: DollarSign,label: 'Ingresos este mes',   value: '$8,450',delta: '+18%', color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/20'  },
  { icon: Star,      label: 'Valoración media',    value: '4.87',  delta: null,   color: 'text-amber-400',  bg: 'bg-amber-500/10  border-amber-500/20'  },
];

const COURSES = [
  {
    id: '1',
    title: 'Arquitectura Avanzada en Next.js 14',
    image: 'from-indigo-500 to-purple-600',
    students: 320,
    completionRate: 68,
    rating: 4.9,
    revenue: 31680,
    status: 'published',
  },
  {
    id: '4',
    title: 'Diseño UI/UX para Desarrolladores',
    image: 'from-rose-500 to-pink-600',
    students: 87,
    completionRate: 54,
    rating: 5.0,
    revenue: 11223,
    status: 'published',
  },
  {
    id: '2',
    title: 'Masterclass: Node.js Performance',
    image: 'from-blue-500 to-cyan-500',
    students: 0,
    completionRate: 0,
    rating: 0,
    revenue: 0,
    status: 'draft',
  },
];

const ACTIVITY = [
  { type: 'enrollment', student: 'Jorge Medina',   course: 'Next.js 14',  amount: '+$99',  time: 'Hace 2h' },
  { type: 'review',     student: 'Laura Ramos',    course: 'UI/UX Devs',  amount: '★ 5.0', time: 'Hace 5h' },
  { type: 'enrollment', student: 'Pablo Fuentes',  course: 'Next.js 14',  amount: '+$99',  time: 'Ayer' },
  { type: 'cert',       student: 'Andrea Silva',   course: 'UI/UX Devs',  amount: '—',     time: 'Ayer' },
  { type: 'enrollment', student: 'Marta Herrera',  course: 'Next.js 14',  amount: '+$99',  time: 'Hace 3 días' },
];

const REVENUE_BARS = [30, 50, 42, 70, 55, 88, 65, 80, 58, 92, 75, 100];

// ── Component ──────────────────────────────────────────────────────────────
export default function InstructorDashboard() {
  const { data: session } = useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'Instructor';

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Greeting */}
      <div>
        <p className="text-gray-500 font-medium text-sm">Hola de nuevo,</p>
        <h1 className="text-3xl font-black text-white mt-0.5">{name} 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Aquí tienes el resumen de tu actividad docente.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ icon: Icon, label, value, delta, color, bg }) => (
          <div key={label} className={`bg-gray-900 border ${bg} rounded-2xl p-5`}>
            <Icon className={`w-5 h-5 ${color} mb-3`} />
            <p className="text-2xl font-black text-white">{value}</p>
            {delta && <p className={`text-xs font-bold mt-0.5 ${color}`}>{delta} este mes</p>}
            <p className="text-xs font-bold text-gray-600 uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="xl:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-white">Ingresos por Mes</h2>
            </div>
            <span className="text-xs font-bold text-gray-500 bg-gray-800 border border-gray-700 px-3 py-1 rounded-lg">2024</span>
          </div>
          <div className="flex items-end gap-2 h-36">
            {REVENUE_BARS.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-default">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-lg group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300"
                  style={{ height: `${val}%` }}
                />
                <span className="text-xs text-gray-600 font-bold group-hover:text-indigo-400 transition-colors">
                  {['E','F','M','A','M','J','J','A','S','O','N','D'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <h2 className="font-bold text-white text-sm">Actividad Reciente</h2>
          </div>
          <ul className="divide-y divide-gray-800/60">
            {ACTIVITY.map((item, i) => (
              <li key={i} className="px-6 py-4 flex items-start gap-3 hover:bg-gray-800/40 transition-colors">
                <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs ${
                  item.type === 'enrollment' ? 'bg-indigo-500/15 text-indigo-400' :
                  item.type === 'review'     ? 'bg-amber-500/15  text-amber-400' :
                                              'bg-green-500/15  text-green-400'
                }`}>
                  {item.type === 'enrollment' ? <Play className="w-3 h-3" /> :
                   item.type === 'review'     ? <Star className="w-3 h-3" /> :
                                               <Award className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-200 truncate">{item.student}</p>
                  <p className="text-xs text-gray-500 truncate">{item.course}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs font-bold ${item.amount.startsWith('+') ? 'text-green-400' : item.amount.startsWith('★') ? 'text-amber-400' : 'text-gray-500'}`}>
                    {item.amount}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Course performance table */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white">Rendimiento por Curso</h2>
          </div>
          <Link href="/instructor/courses" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
            Gestionar →
          </Link>
        </div>

        <div className="divide-y divide-gray-800/60">
          {COURSES.map(course => (
            <div key={course.id} className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-gray-800/30 transition-colors group">
              {/* Color stripe */}
              <div className={`w-1.5 h-full rounded-full bg-gradient-to-b ${course.image} self-stretch flex-shrink-0 hidden sm:block`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-white text-sm truncate">{course.title}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${
                    course.status === 'published'
                      ? 'text-green-400 bg-green-400/10 border-green-400/20'
                      : 'text-amber-400 bg-amber-400/10 border-amber-400/20'
                  }`}>
                    {course.status === 'published' ? 'Publicado' : 'Borrador'}
                  </span>
                </div>

                {course.status === 'published' && (
                  <div className="flex items-center gap-4 mt-2">
                    {/* Completion bar */}
                    <div className="flex-1 max-w-xs">
                      <div className="flex justify-between text-xs text-gray-500 font-semibold mb-1">
                        <span>Tasa de completación</span>
                        <span className="text-white">{course.completionRate}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${course.image}`}
                          style={{ width: `${course.completionRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Metrics */}
              {course.status === 'published' ? (
                <div className="flex items-center gap-6 flex-shrink-0">
                  <div className="text-center">
                    <p className="text-lg font-black text-white">{course.students.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">alumnos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-amber-400">{course.rating.toFixed(1)}</p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">rating</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-black text-green-400">${course.revenue.toLocaleString()}</p>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">ingresos</p>
                  </div>
                </div>
              ) : (
                <Link
                  href={`/instructor/courses/new`}
                  className="flex-shrink-0 px-4 py-2 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 text-xs font-bold rounded-xl transition-colors"
                >
                  Completar y publicar
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
