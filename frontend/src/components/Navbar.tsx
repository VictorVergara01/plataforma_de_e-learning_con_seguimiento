'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { BookOpen, LayoutDashboard, BarChart2, GraduationCap, LogOut, LogIn, Menu, X, ChevronDown } from 'lucide-react';

// Solo ocultar en el reproductor de lecciones (layout propio de pantalla completa)
export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (pathname.includes('/lessons/')) return null;

  const role = (session?.user as any)?.role as string | undefined;

  const navLinks = [
    { href: '/courses', label: 'Cursos', icon: BookOpen },
    ...(role === 'student'    ? [{ href: '/dashboard',  label: 'Mi Aprendizaje', icon: LayoutDashboard }] : []),
    ...(role === 'instructor' ? [{ href: '/instructor', label: 'Instructor',      icon: GraduationCap   }] : []),
    ...(role === 'admin'      ? [{ href: '/admin',      label: 'Admin',           icon: BarChart2        }] : []),
  ];

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href={session ? '/courses' : '/'} className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-black text-white tracking-tight">
            Nexus<span className="text-indigo-400">LMS</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: user menu or login */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/40 to-purple-600/40 border border-indigo-500/30 flex items-center justify-center">
                  <span className="text-sm font-black text-indigo-300">
                    {session.user?.name?.[0] ?? '?'}
                  </span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-white leading-tight">{session.user?.name}</p>
                  <p className="text-xs text-gray-500 font-medium capitalize leading-tight">{role ?? 'usuario'}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-20">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-xs text-gray-500 font-medium truncate">{session.user?.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                        Mi Aprendizaje
                      </Link>
                      <button
                        onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: '/login' }); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-950 px-4 py-4 space-y-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active ? 'bg-indigo-500/15 text-indigo-300' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}

          <div className="pt-2 border-t border-gray-800 mt-2">
            {session ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm font-bold text-white">{session.user?.name}</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
                <button
                  onClick={() => { setMobileOpen(false); signOut({ callbackUrl: '/login' }); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
