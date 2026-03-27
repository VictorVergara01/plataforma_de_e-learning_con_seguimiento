'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { BookOpen, Video, LayoutDashboard, Plus } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

const NAV_LINKS = [
  { href: '/instructor',         label: 'Dashboard',          icon: LayoutDashboard },
  { href: '/instructor/courses', label: 'Mis Cursos',         icon: BookOpen },
  { href: '/instructor/uploads', label: 'Biblioteca de Medios', icon: Video },
];

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && (session?.user as any)?.role !== 'instructor')) {
      router.push('/login');
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 4rem)' }}>
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === 'unauthenticated' || (session?.user as any)?.role !== 'instructor') return null;

  return (
    <div className="flex bg-gray-950 text-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 4rem)' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col shrink-0">
        <nav className="flex-1 px-3 py-6 space-y-1">
          <p className="px-4 mb-3 text-xs font-bold text-gray-600 uppercase tracking-widest">Instructor</p>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== '/instructor' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-indigo-400' : ''}`} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Quick action */}
        <div className="p-4 border-t border-gray-800">
          <Link
            href="/instructor/courses/new"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nuevo Curso
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
