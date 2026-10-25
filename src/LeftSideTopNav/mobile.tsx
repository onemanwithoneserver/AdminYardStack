import { useState, useEffect, type ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, Building2, MapPin, FolderKanban, TrendingUp, UserCheck, Shapes, Shield, Landmark, Boxes, Mic, GraduationCap, ChevronDown, ChevronRight, Moon, Sun, Menu, X, LogOut, Home, User, Sparkles } from 'lucide-react';
import { SIDEBAR_ITEMS, CURRENT_USER, BREADCRUMBS, type NavItem, type UserProfile } from './data';
import { BrandLogo } from './BrandLogo';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Users,
  Settings,
  Building2,
  MapPin,
  FolderKanban,
  TrendingUp,
  UserCheck,
  Shapes,
  Shield,
  Landmark,
  Boxes,
  Mic,
  GraduationCap,
  Sparkles,
};

export interface MobileNavProps {
  children?: ReactNode;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
  breadcrumbs?: string[];
  onBreadcrumbClick?: (crumb: string) => void;
  user?: UserProfile;
}

export function MobileNav({
  children,
  activeItem = 'projects',
  onItemClick,
  onLogout,
  breadcrumbs = BREADCRUMBS,
  onBreadcrumbClick,
  user = CURRENT_USER,
}: MobileNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-slate-100 dark:bg-[#050811] font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <header className="h-14 backdrop-blur-xl bg-white/85 dark:bg-[#070b14]/85 border-b border-slate-200/80 dark:border-white/[0.08] px-3.5 flex items-center justify-between shrink-0 shadow-2xs z-30 relative">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open navigation menu"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer active:scale-95 shadow-2xs"
          >
            <Menu className="w-4 h-4" />
          </button>

          <BrandLogo collapsed={false} variant="default" />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-colors cursor-pointer active:scale-95 shadow-2xs"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-500" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {user.name ? user.name.charAt(0) : 'A'}
          </div>
        </div>
      </header>

      <div className="bg-slate-50/80 dark:bg-[#070b14]/70 backdrop-blur-md border-b border-slate-200/70 dark:border-white/[0.06] px-3 py-1.5 flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar shrink-0">
        <button
          type="button"
          onClick={() => onBreadcrumbClick?.('Dashboard')}
          className="p-1 rounded-md text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer shrink-0"
        >
          <Home className="w-3.5 h-3.5" />
        </button>

        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <div key={crumb} className="flex items-center gap-1.5 shrink-0">
              <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />
              <button
                type="button"
                onClick={() => onBreadcrumbClick?.(crumb)}
                disabled={isLast}
                className={`transition-colors px-2 py-0.5 rounded-lg text-xs ${
                  isLast
                    ? 'text-blue-700 dark:text-blue-300 font-bold bg-blue-500/10 dark:bg-blue-400/15 border border-blue-500/25 dark:border-blue-400/25 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer'
                }`}
              >
                {crumb}
              </button>
            </div>
          );
        })}
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in-0 duration-200"
            onClick={() => setDrawerOpen(false)}
          />

          <div className="relative w-72 max-w-[85vw] bg-blue-600 text-white flex flex-col h-full shadow-2xl z-10 border-r border-blue-500 animate-in slide-in-from-left duration-250 ease-out">
            <div className="flex items-center justify-between px-3 py-4 h-[80px] border-b border-blue-500 shrink-0">
              <BrandLogo collapsed={false} variant="blue" />

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-blue-200 hover:text-white hover:bg-blue-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 no-scrollbar">
              {SIDEBAR_ITEMS.map((item) => {
                const Icon = ICON_MAP[item.iconName] || FolderKanban;
                const isActive =
                  activeItem.toLowerCase() === item.id.toLowerCase() ||
                  (item.id === 'projects' && activeItem.toLowerCase().includes('project'));
                const isSubmenuOpen = expandedSubmenu === item.id;

                return (
                  <div key={item.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.hasSubmenu) {
                          setExpandedSubmenu((prev) => (prev === item.id ? null : item.id));
                        } else {
                          onItemClick?.(item);
                          setDrawerOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm transition-all duration-150 cursor-pointer ${
                        isActive
                          ? 'bg-white text-blue-600 font-semibold shadow-sm'
                          : 'text-blue-100 hover:bg-blue-500 hover:text-white font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-100'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-blue-500 text-white'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                        {item.hasSubmenu && (
                          <ChevronDown
                            className={`w-4 h-4 text-blue-200 transition-transform ${
                              isSubmenuOpen ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </div>
                    </button>

                    {item.hasSubmenu && isSubmenuOpen && item.subItems && (
                      <div className="pl-11 pr-2 py-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => {
                              onItemClick?.({ ...item, label: sub.label, route: sub.route });
                              setDrawerOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs font-medium text-blue-100 hover:text-white hover:bg-blue-500/70 text-left cursor-pointer"
                          >
                            <span>{sub.label}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-blue-200" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="p-3 border-t border-blue-500 text-xs flex items-center justify-between text-blue-100 shrink-0 bg-blue-700/20">
              <div className="flex items-center gap-2.5 min-w-0">
                <User className="w-5 h-5 shrink-0 text-blue-200" />
                <div className="truncate leading-tight">
                  <div>
                    Signed in as <span className="font-semibold text-white">{user.email || 'admin@gmail.com'}</span>
                  </div>
                  <div>
                    Role: <span className="uppercase font-semibold text-white">{user.role || 'guest'}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setDrawerOpen(false);
                  onLogout?.();
                }}
                className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto no-scrollbar p-2 sm:p-3">
        {children}
      </main>
    </div>
  );
}

export default MobileNav;
