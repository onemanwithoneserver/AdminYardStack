import { useState, useEffect, type ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, Building2, MapPin, FolderKanban, TrendingUp, UserCheck, Shapes, Shield, Landmark, Boxes, Mic, GraduationCap, ChevronDown, ChevronRight, Moon, Sun, User, Menu } from 'lucide-react';
import { SIDEBAR_ITEMS, CURRENT_USER, BREADCRUMBS, type NavItem } from './data';

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

interface DesktopNavProps {
  children?: ReactNode;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
  breadcrumbs?: string[];
  onBreadcrumbClick?: (crumb: string) => void;
}

export function DesktopNav({
  children,
  activeItem = 'projects',
  onItemClick,
  onLogout,
  breadcrumbs = BREADCRUMBS,
  onBreadcrumbClick,
}: DesktopNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="flex h-screen w-screen overflow-hidden liquid-mesh-bg font-sans antialiased text-slate-800 dark:text-slate-100 theme-transition">
      <aside
        className={`bg-gradient-to-b from-[#1546b3] via-[#1956db] to-[#123899] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0b1120] text-white flex flex-col shrink-0 transition-all duration-300 shadow-2xl relative z-20 border-r border-white/10 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
          {!collapsed ? (
            <div>
              <div className="font-black text-xl tracking-wider text-white flex items-center gap-1.5">
                <span>YARDSTACK</span>
              </div>
              <div className="text-[10px] tracking-widest uppercase text-white/70 -mt-0.5 font-medium">
                Proptech Platform
              </div>
            </div>
          ) : (
            <div className="font-black text-xl text-white mx-auto">Y</div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName] || FolderKanban;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemClick?.(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1956db] shadow-lg shadow-black/10 font-bold dark:bg-blue-600 dark:text-white'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
                {!collapsed && item.hasSubmenu && (
                  <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 shrink-0 bg-black/10 backdrop-blur-xs">
          <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-[11px] text-white/90 truncate font-medium">
                  Signed in as <span className="font-semibold text-white">{CURRENT_USER.email}</span>
                </div>
                <div className="text-[10px] text-white/70 font-semibold tracking-wide">
                  Role: {CURRENT_USER.role}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 glass-surface px-6 flex items-center justify-between shrink-0 shadow-xs z-10 border-b border-slate-200/80 dark:border-white/10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={crumb} className="flex items-center gap-2">
                  <span
                    onClick={() => onBreadcrumbClick?.(crumb)}
                    className={`font-medium transition-colors ${
                      isLast
                        ? 'text-slate-900 dark:text-white font-bold'
                        : 'text-blue-600 dark:text-blue-400 hover:text-blue-800 cursor-pointer'
                    }`}
                  >
                    {crumb}
                  </span>
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />}
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-black dark:hover:bg-slate-100 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DesktopNav;
