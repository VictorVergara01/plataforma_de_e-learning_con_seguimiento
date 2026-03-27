import { Plus, Edit2, Eye } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const courses = [
    { id: 1, title: 'Arquitectura Avanzada en Next.js 14', status: 'Publicado', students: 124, price: '$99.00', image: 'bg-gradient-to-br from-indigo-500 to-purple-600' },
    { id: 2, title: 'Masterclass: Node.js Performance', status: 'Borrador', students: 0, price: '$49.00', image: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
    { id: 3, title: 'Diseño UI/UX para Desarrolladores', status: 'Publicado', students: 890, price: '$129.00', image: 'bg-gradient-to-br from-rose-500 to-orange-500' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-gray-900/30 p-6 rounded-2xl border border-gray-800/60 backdrop-blur-sm">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Mis Cursos</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Gestiona tu contenido educativo y monitoriza sus ventas.</p>
        </div>
        <Link 
          href="/instructor/courses/new" 
          className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5 mr-2" />
          Crear Nuevo Curso
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map(course => (
          <div key={course.id} className="group bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden hover:border-gray-700 transition-all duration-300 backdrop-blur-sm shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10">
            <div className={`h-52 w-full ${course.image} relative overflow-hidden`}>
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm gap-4">
                <button className="bg-white/10 hover:bg-white/20 p-3.5 rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-lg border border-white/10 text-white" title="Editar">
                  <Edit2 className="h-5 w-5" />
                </button>
                <button className="bg-white/10 hover:bg-white/20 p-3.5 rounded-full backdrop-blur-md transition-all hover:scale-110 shadow-lg border border-white/10 text-white" title="Vista Previa">
                  <Eye className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute top-4 right-4 bg-gray-950/60 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white border border-white/10 shadow-sm">
                {course.status}
              </div>
            </div>
            
            <div className="p-7">
              <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                {course.title}
              </h3>
              
              <div className="flex items-center justify-between mt-8 pt-5 border-t border-gray-800/60">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Estudiantes</span>
                  <span className="text-lg font-semibold text-gray-200">{course.students}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Precio</span>
                  <span className="text-lg font-bold text-green-400">{course.price}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
