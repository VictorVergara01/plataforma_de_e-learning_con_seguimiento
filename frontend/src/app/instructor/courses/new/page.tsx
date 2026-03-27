'use client';
import { useState } from 'react';
import { ArrowLeft, UploadCloud, Save } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    level: 'beginner'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simular guardado POST en Mongoose
    setTimeout(() => {
      setLoading(false);
      router.push('/instructor/courses');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center space-x-5 bg-gray-900/30 p-6 rounded-3xl border border-gray-800/60 backdrop-blur-sm">
        <Link href="/instructor/courses" className="p-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all hover:-translate-x-1 shadow-sm">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Crear Nuevo Curso</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Configura los detalles básicos antes de subir módulos.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-10 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none"></div>

        <div className="space-y-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Título del Curso</label>
              <input
                type="text"
                required
                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-gray-600 shadow-inner"
                placeholder="Ej: Masterclass en Arquitectura Cloud"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-300 mb-2">Descripción</label>
              <textarea
                required
                rows={4}
                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-gray-600 resize-none shadow-inner"
                placeholder="Escribe un resumen atractivo para tus estudiantes..."
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Categoría</label>
              <select
                className="w-full bg-gray-950/50 border border-gray-800 rounded-xl px-4 py-3.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer shadow-inner"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Selecciona una categoría</option>
                <option value="programming">Desarrollo Web</option>
                <option value="cloud">Cloud Computing</option>
                <option value="design">Diseño UI/UX</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Precio Regular (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-500 font-medium">$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  className="w-full bg-gray-950/50 border border-gray-800 rounded-xl pl-8 pr-4 py-3.5 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none transition-all placeholder-gray-600 shadow-inner block"
                  placeholder="99.00"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: e.target.value})}
                />
              </div>
            </div>
            
            <div className="md:col-span-2">
               <label className="block text-sm font-semibold text-gray-300 mb-2">Imagen de Portada</label>
               <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-gray-700 border-dashed rounded-2xl hover:border-indigo-500 hover:bg-indigo-500/5 transition-all duration-300 cursor-pointer group shadow-sm">
                 <div className="space-y-2 text-center">
                   <UploadCloud className="mx-auto h-14 w-14 text-gray-500 group-hover:text-indigo-400 group-hover:-translate-y-1 transition-all duration-300" />
                   <div className="flex text-sm text-gray-400 justify-center font-medium my-2">
                     <span className="relative cursor-pointer bg-transparent rounded-md text-indigo-400 hover:text-indigo-300 focus-within:outline-none">
                       <span>Sube un archivo</span>
                     </span>
                     <p className="pl-1 text-gray-500">o arrastra y suelta aquí</p>
                   </div>
                   <p className="text-xs text-gray-500/80 font-medium tracking-wide border px-3 py-1 rounded-full border-gray-800 bg-gray-900 inline-block">PNG, JPG, WebP hasta 5MB</p>
                 </div>
               </div>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-4 border-t border-gray-800/60 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            {loading ? (
              <span className="flex items-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                Guardando en base de datos...
              </span>
            ) : (
              <>
                <Save className="w-5 h-5 mr-3" />
                Guardar Borrador y Continuar
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
