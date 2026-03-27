'use client';
import { useState } from 'react';
import { Search, BookOpen, Star, Clock, BarChart2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const MOCK_COURSES = [
  { id: '1', title: 'Arquitectura Avanzada en Next.js 14', instructor: 'Ana García', category: 'programming', level: 'advanced', price: 99, rating: 4.9, duration: '42h', students: 1240, image: 'from-indigo-500 to-purple-600' },
  { id: '2', title: 'Masterclass: Node.js Performance', instructor: 'Carlos Ruiz', category: 'programming', level: 'intermediate', price: 49, rating: 4.7, duration: '18h', students: 890, image: 'from-blue-500 to-cyan-500' },
  { id: '3', title: 'AWS Cloud Architecture desde Cero', instructor: 'Luis Torres', category: 'cloud', level: 'beginner', price: 79, rating: 4.8, duration: '30h', students: 2300, image: 'from-amber-500 to-orange-600' },
  { id: '4', title: 'Diseño UI/UX para Desarrolladores', instructor: 'María López', category: 'design', level: 'beginner', price: 129, rating: 5.0, duration: '26h', students: 540, image: 'from-rose-500 to-pink-600' },
  { id: '5', title: 'MongoDB Avanzado y Mongoose', instructor: 'Diego Vélez', category: 'programming', level: 'advanced', price: 59, rating: 4.6, duration: '14h', students: 670, image: 'from-green-500 to-emerald-600' },
  { id: '6', title: 'DevOps con Docker y Kubernetes', instructor: 'Sofia Martín', category: 'cloud', level: 'intermediate', price: 89, rating: 4.8, duration: '36h', students: 1100, image: 'from-violet-500 to-purple-700' },
];

const LEVELS = ['Todos', 'beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['Todos', 'programming', 'cloud', 'design'];

const levelLabels: Record<string, string> = {
  beginner: 'Principiante',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

export default function CourseCatalog() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');
  const [level, setLevel] = useState('Todos');

  const filtered = MOCK_COURSES.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'Todos' || c.category === category;
    const matchLevel = level === 'Todos' || c.level === level;
    return matchSearch && matchCategory && matchLevel;
  });

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gray-950 border-b border-gray-800/60">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-6">
            <BookOpen className="w-4 h-4" />
            Aprende a tu ritmo
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Cursos diseñados para <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">el mundo real</span>
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-xl mx-auto font-medium">
            Aprende con proyectos prácticos, acceso vitalicio y certificados que importan.
          </p>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Busca por título o instructor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-gray-900 border border-gray-700 rounded-2xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder-gray-600 shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filter Pills */}
        <div className="flex flex-wrap gap-6 mb-10 items-center">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-1">Categoría:</span>
            {CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${category === c ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
              >
                {c === 'Todos' ? 'Todos' : c === 'programming' ? 'Programación' : c === 'cloud' ? 'Cloud' : 'Diseño'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-1">Nivel:</span>
            {LEVELS.map(l => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all border ${level === l ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
              >
                {l === 'Todos' ? 'Todos' : levelLabels[l]}
              </button>
            ))}
          </div>
          <span className="ml-auto text-sm text-gray-500 font-medium">{filtered.length} cursos encontrados</span>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(course => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group block">
              <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-600 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                {/* Thumbnail */}
                <div className={`h-48 bg-gradient-to-br ${course.image} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <span className="bg-black/50 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                      {levelLabels[course.level]}
                    </span>
                  </div>
                </div>
                {/* Body */}
                <div className="p-6">
                  <h3 className="font-bold text-white text-lg leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">{course.instructor}</p>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      <span className="font-bold text-amber-400">{course.rating}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4" />
                      {course.students.toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-5 border-t border-gray-800">
                    <span className="text-2xl font-black text-white">${course.price}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 group-hover:text-indigo-300 transition-colors">
                      Ver Curso <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-xl font-semibold">No se encontraron cursos con esos filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}
