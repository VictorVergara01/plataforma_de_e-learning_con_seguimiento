import Link from 'next/link';
import { BookOpen, Video, Award, BarChart2, Star, ArrowRight, CheckCircle, Play, Zap, Shield, Globe } from 'lucide-react';

const FEATURED_COURSES = [
  { title: 'Arquitectura Avanzada en Next.js 14', instructor: 'Ana García', rating: 4.9, students: 1240, price: 99, gradient: 'from-indigo-500 to-purple-600' },
  { title: 'AWS Cloud Architecture desde Cero', instructor: 'Luis Torres', rating: 4.8, students: 2300, price: 79, gradient: 'from-amber-500 to-orange-600' },
  { title: 'Diseño UI/UX para Desarrolladores', instructor: 'María López', rating: 5.0, students: 540, price: 129, gradient: 'from-rose-500 to-pink-600' },
];

const STATS = [
  { value: '12,000+', label: 'Estudiantes activos' },
  { value: '48', label: 'Cursos publicados' },
  { value: '96%', label: 'Tasa de satisfacción' },
  { value: '3,800+', label: 'Certificados emitidos' },
];

const FEATURES = [
  { icon: Video, title: 'Video en HD sin límites', desc: 'Lecciones grabadas por expertos del sector, accesibles desde cualquier dispositivo.' },
  { icon: Zap, title: 'Quizzes con retroalimentación', desc: 'Evalúa tu aprendizaje en tiempo real con explicaciones detalladas por pregunta.' },
  { icon: BookOpen, title: 'Notas integradas', desc: 'Anota ideas clave directamente en la plataforma, sincronizadas con el timestamp del video.' },
  { icon: Award, title: 'Certificados PDF verificables', desc: 'Al llegar al 100%, recibes un certificado con hash único de autenticidad.' },
  { icon: Shield, title: 'Pagos 100% seguros', desc: 'Procesado por Stripe con encriptación de nivel bancario.' },
  { icon: Globe, title: 'Aprende a tu ritmo', desc: 'Sin fechas límite. Accede al contenido cuando y donde quieras.' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">Nexus <span className="text-indigo-400">LMS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <Link href="/courses" className="hover:text-white transition-colors">Cursos</Link>
            <Link href="/instructor" className="hover:text-white transition-colors">Instructores</Link>
            <Link href="/admin" className="hover:text-white transition-colors">Admin</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-colors">
              Iniciar sesión
            </Link>
            <Link href="/courses" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              Explorar cursos
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-28 px-6 overflow-hidden">
        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/2 w-[800px] h-[200px] bg-indigo-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-bold mb-8 shadow-lg shadow-indigo-500/5">
            <Zap className="w-4 h-4" />
            La plataforma de aprendizaje para el mundo tech
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white mb-6">
            Aprende.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Construye.
            </span><br />
            Certifícate.
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Cursos impartidos por expertos del sector, con video en HD, quizzes interactivos
            y certificados verificables. Todo en una plataforma diseñada para ti.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl shadow-indigo-500/25 active:scale-95 hover:-translate-y-0.5"
            >
              Explorar Cursos <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/courses/1/lessons/lesson1"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl text-lg transition-all border border-gray-700 hover:border-gray-500 active:scale-95"
            >
              <Play className="w-5 h-5 text-indigo-400 fill-indigo-400" /> Ver clase demo
            </Link>
          </div>

          {/* Social proof */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-6">
            <div className="flex -space-x-3">
              {['bg-indigo-500','bg-purple-500','bg-pink-500','bg-amber-500','bg-cyan-500'].map((c,i) => (
                <div key={i} className={`w-9 h-9 rounded-full ${c} border-2 border-gray-950 flex items-center justify-center text-xs font-bold text-white shadow-lg`}>
                  {String.fromCharCode(65+i)}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex">
                {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-gray-400 font-medium"><span className="text-white font-bold">4.9</span> de 12,000+ estudiantes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-800/60 bg-gray-900/40 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <div key={i}>
              <p className="text-4xl font-black text-white tracking-tight">{s.value}</p>
              <p className="text-sm text-gray-500 font-semibold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-28 px-6 relative">
        <div className="absolute right-0 top-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">Todo lo que necesitas<br/><span className="text-indigo-400">para aprender de verdad</span></h2>
            <p className="text-gray-400 mt-4 text-lg font-medium max-w-xl mx-auto">Una experiencia de aprendizaje completa, sin compromisos.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={i} className="group bg-gray-900 border border-gray-800 rounded-2xl p-7 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-5 group-hover:bg-indigo-500/20 transition-colors">
                  <f.icon className="w-6 h-6 text-indigo-400" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-6 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight">Cursos destacados</h2>
              <p className="text-gray-500 mt-2 font-medium">Los más populares entre nuestra comunidad</p>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_COURSES.map((c, i) => (
              <Link key={i} href="/courses" className="group block bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300">
                <div className={`h-44 bg-gradient-to-br ${c.gradient} relative`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-indigo-300 transition-colors line-clamp-2">{c.title}</h3>
                  <p className="text-sm text-gray-500 font-medium mb-4">{c.instructor}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-amber-400">{c.rating}</span>
                      <span className="text-gray-600">({c.students.toLocaleString()})</span>
                    </div>
                    <span className="text-xl font-black text-white">${c.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[800px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-6">
            ¿Listo para dar el<br/><span className="text-indigo-400">siguiente paso?</span>
          </h2>
          <p className="text-xl text-gray-400 font-medium mb-10 max-w-xl mx-auto">
            Únete a más de 12,000 profesionales que ya están avanzando en su carrera con Nexus LMS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl text-lg transition-all shadow-2xl shadow-indigo-500/25 active:scale-95 hover:-translate-y-0.5">
              Comenzar ahora — es gratis <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 font-medium">
            {['Sin tarjeta requerida', 'Acceso inmediato', 'Garantía de 30 días'].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800/60 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <BookOpen className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-gray-500">Nexus LMS</span>
          </div>
          <p>© 2026 Nexus LMS. Todos los derechos reservados.</p>
          <div className="flex gap-6 font-medium">
            <Link href="/courses" className="hover:text-gray-300 transition-colors">Cursos</Link>
            <Link href="/login" className="hover:text-gray-300 transition-colors">Ingresar</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
