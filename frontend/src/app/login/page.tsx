'use client';
import { signIn, getSession } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError('Credenciales inválidas. Verifica email y contraseña.');
      setLoading(false);
    } else {
      // Leer la sesión actualizada para conocer el rol
      const session = await getSession();
      const role = session?.user?.role;
      if (role === 'instructor') router.push('/instructor');
      else if (role === 'admin') router.push('/admin');
      else router.push('/courses');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">Bienvenido de vuelta</h2>
            <p className="mt-2 text-sm text-gray-400">
              Ingresa a la sala de control de tu aprendizaje.
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <div className="p-3 rounded-md bg-red-500/10 border border-red-500/50 text-red-500 text-sm">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Correo electrónico
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 bg-gray-900 border border-gray-800 rounded-lg py-3 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300">
                    Contraseña
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 bg-gray-900 border border-gray-800 rounded-lg py-3 text-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-950 transition-all disabled:opacity-50"
                >
                  {loading ? 'Iniciando sesión...' : (
                    <span className="flex items-center">
                      Ingresar al Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Abstract Art */}
      <div className="hidden lg:block relative w-0 flex-1 overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-indigo-900 via-gray-900 to-black" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
        <div className="absolute top-1/4 right-1/4 transform w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      </div>
    </div>
  );
}
