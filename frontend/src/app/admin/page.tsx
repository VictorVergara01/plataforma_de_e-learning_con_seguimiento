'use client';
import { useState } from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Award, BarChart2, Search, Shield, GraduationCap, CheckCircle2, XCircle, Eye, ChevronDown } from 'lucide-react';

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_METRICS = {
  revenue: 48250,
  activeUsers: 3840,
  activeCourses: 12,
  certificates: 890,
  topCourses: [
    { title: 'Arquitectura Avanzada en Next.js 14', sales: 320, revenue: 31680, instructor: 'Ana García' },
    { title: 'AWS Cloud Architecture desde Cero', sales: 198, revenue: 15642, instructor: 'Luis Torres' },
    { title: 'DevOps con Docker y Kubernetes', sales: 145, revenue: 12905, instructor: 'Sofia Martín' },
    { title: 'Diseño UI/UX para Desarrolladores', sales: 87, revenue: 11223, instructor: 'María López' },
  ],
  recentActivity: [
    { action: 'Nueva matrícula', detail: 'Node.js Performance', user: 'jorge.m@email.com', amount: '+$49', time: '2 min' },
    { action: 'Certificado emitido', detail: 'Next.js 14', user: 'laura.r@email.com', amount: '—', time: '14 min' },
    { action: 'Nueva matrícula', detail: 'AWS desde Cero', user: 'pablo.f@email.com', amount: '+$79', time: '31 min' },
    { action: 'Nueva matrícula', detail: 'UI/UX para Devs', user: 'andrea.s@email.com', amount: '+$129', time: '1h' },
  ],
};

type Role = 'student' | 'instructor' | 'admin';

interface MockUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  joined: string;
  courses: number;
  status: 'active' | 'inactive';
}

const MOCK_USERS: MockUser[] = [
  { id: '1', name: 'Admin Principal', email: 'admin@nexus.com', role: 'admin', joined: 'Ene 2024', courses: 0, status: 'active' },
  { id: '2', name: 'Ana García', email: 'instructor@nexus.com', role: 'instructor', joined: 'Feb 2024', courses: 3, status: 'active' },
  { id: '3', name: 'Carlos López', email: 'estudiante@nexus.com', role: 'student', joined: 'Mar 2024', courses: 3, status: 'active' },
  { id: '4', name: 'Luis Torres', email: 'l.torres@nexus.com', role: 'instructor', joined: 'Feb 2024', courses: 2, status: 'active' },
  { id: '5', name: 'Sofia Martín', email: 's.martin@nexus.com', role: 'instructor', joined: 'Mar 2024', courses: 1, status: 'active' },
  { id: '6', name: 'Jorge Medina', email: 'jorge.m@email.com', role: 'student', joined: 'Mar 2024', courses: 2, status: 'active' },
  { id: '7', name: 'Laura Ramos', email: 'laura.r@email.com', role: 'student', joined: 'Abr 2024', courses: 1, status: 'inactive' },
  { id: '8', name: 'Pablo Fuentes', email: 'pablo.f@email.com', role: 'student', joined: 'Abr 2024', courses: 1, status: 'active' },
];

interface MockCourse {
  id: string;
  title: string;
  instructor: string;
  category: string;
  price: number;
  students: number;
  rating: number;
  status: 'published' | 'draft' | 'archived';
  image: string;
}

const MOCK_COURSES: MockCourse[] = [
  { id: '1', title: 'Arquitectura Avanzada en Next.js 14', instructor: 'Ana García', category: 'Programación', price: 99, students: 1240, rating: 4.9, status: 'published', image: 'from-indigo-500 to-purple-600' },
  { id: '2', title: 'Masterclass: Node.js Performance', instructor: 'Carlos Ruiz', category: 'Programación', price: 49, students: 890, rating: 4.7, status: 'published', image: 'from-blue-500 to-cyan-500' },
  { id: '3', title: 'AWS Cloud Architecture desde Cero', instructor: 'Luis Torres', category: 'Cloud', price: 79, students: 2300, rating: 4.8, status: 'published', image: 'from-amber-500 to-orange-600' },
  { id: '4', title: 'Diseño UI/UX para Desarrolladores', instructor: 'María López', category: 'Diseño', price: 129, students: 540, rating: 5.0, status: 'published', image: 'from-rose-500 to-pink-600' },
  { id: '5', title: 'MongoDB Avanzado y Mongoose', instructor: 'Diego Vélez', category: 'Programación', price: 59, students: 670, rating: 4.6, status: 'draft', image: 'from-green-500 to-emerald-600' },
  { id: '6', title: 'DevOps con Docker y Kubernetes', instructor: 'Sofia Martín', category: 'Cloud', price: 89, students: 1100, rating: 4.8, status: 'published', image: 'from-violet-500 to-purple-700' },
];

// ── Helpers ────────────────────────────────────────────────────────────────
const roleConfig: Record<Role, { label: string; color: string; icon: React.ElementType }> = {
  admin:      { label: 'Admin',       color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Shield },
  instructor: { label: 'Instructor',  color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20', icon: GraduationCap },
  student:    { label: 'Estudiante',  color: 'text-green-400  bg-green-400/10  border-green-400/20',  icon: BookOpen },
};

const statusConfig = {
  published: { label: 'Publicado', color: 'text-green-400 bg-green-400/10 border-green-400/20' },
  draft:     { label: 'Borrador',  color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  archived:  { label: 'Archivado', color: 'text-gray-400  bg-gray-400/10  border-gray-400/20' },
};

const StatCard = ({
  icon: Icon, label, value, sub, color,
}: { icon: React.ElementType; label: string; value: string; sub?: string; color: string }) => (
  <div className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 overflow-hidden hover:-translate-y-1 transition-transform duration-300 shadow-xl group">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 blur-2xl rounded-full group-hover:opacity-10 transition-opacity`} />
    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${color} bg-opacity-10 mb-5 border border-current border-opacity-10`}>
      <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
    </div>
    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{label}</p>
    <p className="text-4xl font-black text-white mt-2 tracking-tight">{value}</p>
    {sub && <p className="text-sm text-gray-500 font-semibold mt-1">{sub}</p>}
  </div>
);

type Tab = 'overview' | 'usuarios' | 'cursos';

// ── Component ──────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  // Users state
  const [users, setUsers] = useState<MockUser[]>(MOCK_USERS);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | Role>('all');

  // Courses state
  const [courses, setCourses] = useState<MockCourse[]>(MOCK_COURSES);
  const [courseSearch, setCourseSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | MockCourse['status']>('all');

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const filteredCourses = courses.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(courseSearch.toLowerCase()) || c.instructor.toLowerCase().includes(courseSearch.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleUserStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  };

  const toggleCourseStatus = (id: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== id) return c;
      return { ...c, status: c.status === 'published' ? 'draft' : 'published' };
    }));
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h1 className="text-lg font-black text-white tracking-tight">Panel de Administración</h1>
          </div>
          <div className="text-sm text-gray-500 font-medium bg-gray-800 px-4 py-2 rounded-xl border border-gray-700">
            {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Tab bar */}
        <div className="max-w-7xl mx-auto px-8 flex gap-1 pb-0">
          {([
            { key: 'overview',  label: 'Resumen' },
            { key: 'usuarios',  label: `Usuarios (${users.length})` },
            { key: 'cursos',    label: `Cursos (${courses.length})` },
          ] as { key: Tab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 text-sm font-bold transition-all border-b-2 ${activeTab === tab.key ? 'text-white border-indigo-500' : 'text-gray-500 hover:text-gray-300 border-transparent'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">

        {/* ═══════════════ OVERVIEW ═══════════════ */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={DollarSign} label="Ingresos Totales" value={`$${MOCK_METRICS.revenue.toLocaleString()}`} sub="↑ 18% vs mes anterior" color="bg-green-500" />
              <StatCard icon={Users} label="Usuarios Activos" value={MOCK_METRICS.activeUsers.toLocaleString()} sub="↑ 12% vs mes anterior" color="bg-indigo-500" />
              <StatCard icon={BookOpen} label="Cursos Activos" value={String(MOCK_METRICS.activeCourses)} sub="3 publicados esta semana" color="bg-purple-500" />
              <StatCard icon={Award} label="Certificados" value={MOCK_METRICS.certificates.toLocaleString()} sub="↑ 24% vs mes anterior" color="bg-amber-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Top Courses */}
              <div className="lg:col-span-3 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Cursos Más Vendidos</h2>
                  </div>
                  <span className="text-xs font-bold text-gray-500 bg-gray-800 px-3 py-1 rounded-lg border border-gray-700">Este mes</span>
                </div>
                <div className="divide-y divide-gray-800/60">
                  {MOCK_METRICS.topCourses.map((course, i) => (
                    <div key={i} className="px-8 py-5 flex items-center gap-5 hover:bg-gray-800/40 transition-colors group">
                      <div className="w-8 h-8 flex items-center justify-center text-sm font-black text-gray-500 group-hover:text-indigo-400 transition-colors shrink-0">
                        #{i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-gray-200 group-hover:text-white truncate">{course.title}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{course.instructor}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-white">${course.revenue.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">{course.sales} ventas</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="px-6 py-6 border-b border-gray-800 flex items-center gap-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-bold text-white">Actividad Reciente</h2>
                </div>
                <ul className="divide-y divide-gray-800/60">
                  {MOCK_METRICS.recentActivity.map((item, i) => (
                    <li key={i} className="px-6 py-5 hover:bg-gray-800/40 transition-colors group">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{item.action}</p>
                          <p className="text-xs text-gray-500 font-medium mt-1 truncate">{item.detail}</p>
                          <p className="text-xs text-indigo-400/70 font-semibold mt-1 truncate">{item.user}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-bold ${item.amount.startsWith('+') ? 'text-green-400' : 'text-gray-500'}`}>{item.amount}</p>
                          <p className="text-xs text-gray-600 mt-1 font-medium">{item.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BarChart2 className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">Ingresos por Mes</h2>
                </div>
              </div>
              <div className="flex items-end gap-3 h-40">
                {[45, 62, 38, 78, 55, 90, 72, 85, 60, 95, 78, 100].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2.5 group cursor-default">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-xl group-hover:from-indigo-500 group-hover:to-purple-400 transition-all duration-300 shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/30"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-xs text-gray-600 font-bold group-hover:text-indigo-400 transition-colors">
                      {['E','F','M','A','M','J','J','A','S','O','N','D'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ═══════════════ USUARIOS ═══════════════ */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'student', 'instructor', 'admin'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${roleFilter === r ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
                  >
                    {r === 'all' ? 'Todos' : roleConfig[r].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Estudiantes', count: users.filter(u => u.role === 'student').length, color: 'text-green-400' },
                { label: 'Instructores', count: users.filter(u => u.role === 'instructor').length, color: 'text-indigo-400' },
                { label: 'Administradores', count: users.filter(u => u.role === 'admin').length, color: 'text-purple-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
                  <p className={`text-2xl font-black ${color}`}>{count}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-400">{filteredUsers.length} usuarios</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Usuario</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Rol</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hidden md:table-cell">Registro</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest hidden lg:table-cell">Cursos</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Estado</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {filteredUsers.map(user => {
                      const { label: roleLabel, color: roleColor, icon: RoleIcon } = roleConfig[user.role];
                      return (
                        <tr key={user.id} className="hover:bg-gray-800/40 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-600/30 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-black text-indigo-300">{user.name[0]}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${roleColor}`}>
                              <RoleIcon className="w-3 h-3" />
                              {roleLabel}
                            </span>
                          </td>
                          <td className="px-6 py-4 hidden md:table-cell">
                            <span className="text-sm text-gray-500 font-medium">{user.joined}</span>
                          </td>
                          <td className="px-6 py-4 hidden lg:table-cell">
                            <span className="text-sm text-gray-400 font-semibold">{user.courses}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${user.status === 'active' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 'text-gray-500 bg-gray-500/10 border-gray-500/20'}`}>
                              {user.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {user.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => toggleUserStatus(user.id)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${user.status === 'active' ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20'}`}
                              >
                                {user.status === 'active' ? 'Desactivar' : 'Activar'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredUsers.length === 0 && (
                  <div className="text-center py-16 text-gray-600">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-semibold">No se encontraron usuarios</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════ CURSOS ═══════════════ */}
        {activeTab === 'cursos' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por título o instructor..."
                  value={courseSearch}
                  onChange={e => setCourseSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-600 transition-all"
                />
              </div>
              <div className="flex gap-2">
                {(['all', 'published', 'draft', 'archived'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${statusFilter === s ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
                  >
                    {s === 'all' ? 'Todos' : statusConfig[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Publicados', count: courses.filter(c => c.status === 'published').length, color: 'text-green-400' },
                { label: 'Borradores', count: courses.filter(c => c.status === 'draft').length, color: 'text-amber-400' },
                { label: 'Archivados', count: courses.filter(c => c.status === 'archived').length, color: 'text-gray-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 text-center">
                  <p className={`text-2xl font-black ${color}`}>{count}</p>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* Course cards grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {filteredCourses.map(course => {
                const { label: statusLabel, color: statusColor } = statusConfig[course.status];
                return (
                  <div key={course.id} className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-colors group">
                    <div className="flex items-stretch">
                      {/* Color bar */}
                      <div className={`w-2 bg-gradient-to-b ${course.image} flex-shrink-0`} />
                      <div className="flex-1 p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className={`inline-flex text-xs font-bold px-2.5 py-0.5 rounded-lg border ${statusColor}`}>
                                {statusLabel}
                              </span>
                              <span className="text-xs text-gray-600 font-medium">{course.category}</span>
                            </div>
                            <p className="font-bold text-white leading-snug line-clamp-2">{course.title}</p>
                            <p className="text-sm text-gray-500 font-medium mt-0.5">{course.instructor}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-black text-white">${course.price}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800/60">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-semibold">
                            <Users className="w-3.5 h-3.5" />
                            {course.students.toLocaleString()} estudiantes
                          </div>
                          <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                            <span>★</span> {course.rating}
                          </div>
                          <div className="flex-1" />
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleCourseStatus(course.id)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${course.status === 'published' ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/20' : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/20'}`}
                            >
                              {course.status === 'published' ? 'Despublicar' : 'Publicar'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-24 text-gray-600">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-semibold">No se encontraron cursos</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
