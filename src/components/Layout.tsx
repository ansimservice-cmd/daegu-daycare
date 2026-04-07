import { Link, Outlet, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/', icon: 'home', label: '홈' },
  { path: '/search', icon: 'search', label: '어린이집 찾기' },
  { path: '/board', icon: 'forum', label: '커뮤니티' },
  { path: '/about', icon: 'info', label: '연합회 소개' },
];

export default function Layout() {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-surface">
      {/* Top App Bar */}
      <header className="fixed top-0 w-full z-50 bg-white/80 glass-nav shadow-sm flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">child_care</span>
            <span className="text-primary font-extrabold tracking-tight text-lg font-headline">
              대구공공형어린이집연합회
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                pathname === item.path
                  ? 'bg-primary-fixed text-on-primary-fixed-variant'
                  : 'text-on-surface-variant hover:bg-surface-high'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        <button className="p-2 rounded-full hover:bg-surface-low transition-colors">
          <span className="material-symbols-outlined text-primary">notifications</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-16 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-white/80 glass-nav shadow-[0_-4px_24px_rgba(23,28,32,0.06)] z-50 rounded-t-3xl">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-4 py-2 transition-transform active:scale-90 ${
                active
                  ? 'bg-primary-fixed/60 text-primary rounded-full px-5'
                  : 'text-outline hover:text-primary'
              }`}
            >
              <span className={`material-symbols-outlined ${active ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[11px] font-semibold mt-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
