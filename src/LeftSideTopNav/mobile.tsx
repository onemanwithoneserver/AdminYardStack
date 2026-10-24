import { useState, useEffect, type ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, Building2, MapPin, FolderKanban, TrendingUp, UserCheck, Shapes, Shield, Landmark, Boxes, Mic, GraduationCap, ChevronDown, ChevronRight, Moon, Sun, Menu, X, LogOut, Search } from 'lucide-react';
import { SIDEBAR_ITEMS, NAV_SECTIONS, CURRENT_USER, BREADCRUMBS, type NavItem, type UserProfile } from './data';
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
  const [filterQuery, setFilterQuery] = useState('');
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

  const filteredItems = filterQuery
    ? SIDEBAR_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(filterQuery.toLowerCase()) ||
        i.description?.toLowerCase().includes(filterQuery.toLowerCase())
      )
    : SIDEBAR_ITEMS;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden liquid-mesh-bg font-sans antialiased text-slate-800 dark:text-slate-100 theme-transition select-none">
      
      <header className="h-14 luxury-glass-nav px-3 flex items-center justify-between shrink-0 shadow-xs z-30 relative">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open mobile navigation menu"
            className="w-8 h-8 rounded-[4px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10 transition-colors cursor-pointer active:scale-95 shadow-2xs"
          >
            <Menu className="w-4 h-4" />
          </button>

          <BrandLogo collapsed={false} />
        </div>

        <div className="flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 rounded-[4px] flex items-center justify-center text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 border border-slate-200/70 dark:border-white/10 transition-colors cursor-pointer active:scale-95 shadow-2xs"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>

          
          <div className="w-7 h-7 rounded-[4px] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            {user.name ? user.name.charAt(0) : 'A'}
          </div>
        </div>
      </header>

      
      <div className="bg-slate-100/70 dark:bg-[#070b14]/70 backdrop-blur-md border-b border-slate-200/60 dark:border-white/[0.06] px-3 py-1.5 flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar shrink-0">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <div key={crumb} className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => onBreadcrumbClick?.(crumb)}
                disabled={isLast}
                className={`transition-colors px-2 py-0.5 rounded-[4px] ${
                  isLast
                    ? 'text-slate-900 dark:text-white font-bold bg-white/70 dark:bg-white/10 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer'
                }`}
              >
                {crumb}
              </button>
              {!isLast && <ChevronRight className="w-3 h-3 text-slate-400 dark:text-slate-600 shrink-0" />}
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

          
          <div className="relative w-80 max-w-[85vw] luxury-sidebar-light dark:luxury-sidebar-dark text-slate-800 dark:text-slate-100 flex flex-col h-full shadow-2xl z-10 border-r border-slate-200 dark:border-white/10 animate-in slide-in-from-left duration-250 ease-out">
            
            <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.08] shrink-0">
              <BrandLogo collapsed={false} />

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            
            <div className="p-3 border-b border-slate-200/50 dark:border-white/[0.06]">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Filter navigation..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-white placeholder:text-slate-600 dark:placeholder:text-slate-400 outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            
            <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 no-scrollbar">
              {NAV_SECTIONS.map((section) => {
                const sectionItems = filteredItems.filter((i) => i.section === section.id);
                if (sectionItems.length === 0) return null;

                return (
                  <div key={section.id} className="space-y-1">
                    <div className="px-3 pt-1 pb-1 text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 dark:text-slate-400">
                      {section.title}
                    </div>

                    {sectionItems.map((item) => {
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
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                              isActive
                                ? 'bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-transparent text-blue-700 dark:text-blue-300 font-bold border border-blue-500/30'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06]'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-4 h-4 shrink-0" />
                              <div className="text-left">
                                <span className="block text-[13px]">{item.label}</span>
                                {item.description && (
                                  <span className="block text-[10px] font-normal text-slate-600 dark:text-slate-400 truncate max-w-[170px]">
                                    {item.description}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                                  {item.badge}
                                </span>
                              )}
                              {item.hasSubmenu && (
                                <ChevronDown
                                  className={`w-3.5 h-3.5 text-slate-600 dark:text-slate-400 transition-transform ${
                                    isSubmenuOpen ? 'rotate-180' : ''
                                  }`}
                                />
                              )}
                            </div>
                          </button>

                          
                          {item.hasSubmenu && isSubmenuOpen && item.subItems && (
                            <div className="pl-9 pr-2 py-1 space-y-1 bg-slate-50/50 dark:bg-white/[0.02] rounded-lg">
                              {item.subItems.map((sub) => (
                                <button
                                  key={sub.id}
                                  type="button"
                                  onClick={() => {
                                    onItemClick?.({ ...item, label: sub.label, route: sub.route });
                                    setDrawerOpen(false);
                                  }}
                                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 text-left"
                                >
                                  <span>{sub.label}</span>
                                  <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </nav>

            
            <div className="p-4 border-t border-slate-200/70 dark:border-white/[0.08] shrink-0 bg-slate-50/80 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                    {user.name ? user.name.charAt(0) : 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {user.name || 'Alexander Vance'}
                    </div>
                    <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDrawerOpen(false);
                    onLogout?.();
                  }}
                  className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <main className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-4">
        {children}
      </main>
    </div>
  );
}

export default MobileNav;
