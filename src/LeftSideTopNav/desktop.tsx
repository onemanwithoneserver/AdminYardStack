import { useState, type ReactNode } from 'react';
import {
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
  ChevronDown,
  ChevronRight,
  Moon,
  User,
  Menu,
} from 'lucide-react';
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
}

export function DesktopNav({
  children,
  activeItem = 'projects',
  onItemClick,
  onLogout,
}: DesktopNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f4f7fa] font-sans antialiased text-slate-800">
      
      <aside
        className={`bg-[#1956db] text-white flex flex-col shrink-0 transition-all duration-300 shadow-xl relative z-20 ${
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
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-colors cursor-pointer"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 scrollbar-thin">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.iconName] || FolderKanban;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onItemClick?.(item)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#1956db] shadow-md font-bold'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                } ${collapsed ? 'justify-center px-2' : ''}`}
                title={item.label}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.hasSubmenu && (
                  <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                )}
              </button>
            );
          })}
        </nav>

        
        <div className="p-3 border-t border-white/10 bg-black/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white">
              <User className="w-4 h-4" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
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
        
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
          
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
            {BREADCRUMBS.map((crumb, idx) => {
              const isLast = idx === BREADCRUMBS.length - 1;
              return (
                <div key={crumb} className="flex items-center gap-2">
                  <span
                    className={`font-medium ${
                      isLast
                        ? 'text-slate-900 font-semibold'
                        : 'text-blue-600 hover:text-blue-800 cursor-pointer'
                    }`}
                  >
                    {crumb}
                  </span>
                  {!isLast && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              );
            })}
          </nav>

          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#111827] text-white hover:bg-black transition-colors cursor-pointer shadow-xs"
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors cursor-pointer shadow-xs"
            >
              Logout
            </button>
          </div>
        </header>

        
        <main className="flex-1 overflow-y-auto p-6 bg-[#f4f7fa]">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DesktopNav;
