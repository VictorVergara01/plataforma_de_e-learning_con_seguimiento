'use client';
import { useState, useRef } from 'react';
import { UploadCloud, FileVideo, CheckCircle2, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

export default function MediaUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatus('idle');
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setStatus('uploading');

    try {
      // 1. Obtener la Pre-signed URL desde nuestro backend Express
      const { data } = await axios.post('http://localhost:5000/api/upload/presigned-url', {
        fileName: file.name,
        fileType: file.type
      });

      const { uploadUrl, fileUrl } = data;

      // 2. Subir directamente a AWS S3 usando Axios para rastrear progreso
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });

      setStatus('success');
      console.log('Video subido exitosamente a:', fileUrl);
    } catch (error) {
      console.error('Error al subir el video', error);
      setStatus('error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <div className="bg-gray-900/40 p-8 rounded-3xl border border-gray-800/60 backdrop-blur-md">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">Biblioteca de Medios</h2>
        <p className="text-gray-400 mt-2 font-medium text-lg">Sube tus lecciones de video directamente a la nube (AWS S3) con Pre-Signed URLs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
        {/* Glow behind main upload area */}
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Upload Area */}
        <div className="lg:col-span-2 bg-gray-900/60 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-10 shadow-2xl relative z-10">
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-14 border-2 border-dashed rounded-3xl transition-all duration-300 ${
              file ? 'border-indigo-500 bg-indigo-500/5' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50 cursor-pointer'
            } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/*" 
              onChange={handleFileSelect}
            />
            
            {status === 'success' ? (
              <div className="text-center space-y-5 animate-in zoom-in duration-300">
                <div className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto ring-4 ring-green-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">¡Subida Exitosa!</h3>
                <p className="text-gray-400 font-medium">El video ha sido procesado de forma segura en S3.</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setStatus('idle'); }}
                  className="mt-6 px-8 py-3 bg-gray-800 hover:bg-gray-700 hover:ring-2 ring-gray-600 text-white rounded-xl transition-all font-semibold shadow-lg text-sm"
                >
                  Subir otro video
                </button>
              </div>
            ) : file ? (
              <div className="text-center w-full animate-in fade-in duration-300">
                <FileVideo className="w-20 h-20 text-indigo-400 mx-auto mb-6 scale-110 drop-shadow-2xl" />
                <h3 className="text-xl font-bold text-white truncate px-4">{file.name}</h3>
                <p className="text-gray-400 font-medium text-sm mt-2">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                
                {status !== 'uploading' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="mt-8 inline-flex items-center text-sm font-semibold text-red-400 hover:text-red-300 bg-red-400/10 hover:bg-red-500/20 px-5 py-2.5 rounded-xl transition-all border border-red-500/20 hover:border-red-500/40"
                  >
                    <X className="w-4 h-4 mr-2" /> Descartar Selección
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center group">
                <UploadCloud className="w-24 h-24 text-gray-500/70 mx-auto mt-2 mb-8 group-hover:text-indigo-400 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-300 drop-shadow-xl" />
                <h3 className="text-2xl font-bold text-gray-200 mb-3 tracking-tight group-hover:text-white transition-colors">Selecciona un video</h3>
                <p className="text-gray-500 font-medium">o arrástralo desde tu computadora</p>
                <div className="mt-10 flex justify-center gap-4 text-xs font-bold text-gray-500 tracking-wider uppercase">
                  <span className="px-4 py-1.5 bg-gray-950 rounded-xl border border-gray-800/80 shadow-sm">MP4</span>
                  <span className="px-4 py-1.5 bg-gray-950 rounded-xl border border-gray-800/80 shadow-sm">MOV</span>
                  <span className="px-4 py-1.5 bg-gray-950 rounded-xl border border-gray-800/80 shadow-sm">Max 2GB</span>
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar & Actions */}
          {file && status !== 'success' && (
            <div className="mt-10 animate-in slide-in-from-bottom-6 duration-500">
              {status === 'uploading' && (
                <div className="mb-8 space-y-3">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-indigo-400 tracking-wide">Transfiriendo a la nube...</span>
                    <span className="text-white tabula-nums">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-950/80 rounded-full h-4 overflow-hidden shadow-inner border border-gray-800 hover:border-gray-700 transition-colors relative">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 h-full rounded-full transition-all duration-300 relative overflow-hidden bg-[length:200%_auto] animate-gradient" 
                      style={{ width: `${progress}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center text-base"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                      Encriptando y Subiendo...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 mr-3 stroke-[2.5]" />
                      Iniciar Subida Segura
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-8 p-5 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start animate-in fade-in shadow-xl shadow-red-500/10">
              <AlertCircle className="w-6 h-6 text-red-500 mt-0.5 mr-4 flex-shrink-0" />
              <div>
                <h4 className="text-red-400 font-bold text-base">Error en la subida a S3</h4>
                <p className="text-red-300/80 text-sm mt-1.5 font-medium leading-relaxed">No se pudo generar la URL prefirmada. Verifica el inicio de sesión remoto y tus variables de entorno IAM.</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-2xl rounded-full"></div>
            <h3 className="text-xl font-bold text-white mb-6 tracking-tight relative z-10">Archivos Recientes</h3>
            <div className="space-y-4 relative z-10">
              {[1, 2].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 bg-gray-950/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-colors group">
                  <div className="w-14 h-14 bg-gray-800/80 rounded-xl flex items-center justify-center flex-shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-300">
                    <FileVideo className="w-7 h-7 text-indigo-400/70 group-hover:text-indigo-400 transition-colors" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-bold text-gray-200 truncate group-hover:text-white transition-colors">leccion_core_{i}.mp4</p>
                    <div className="flex items-center mt-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse"></span>
                      <p className="text-xs text-green-400 font-bold uppercase tracking-wider">Procesado</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
