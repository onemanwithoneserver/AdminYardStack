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
  X,
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

interface MobileNavProps {
  children?: ReactNode;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
}

export function MobileNav({
  children,
  activeItem = 'projects',
  onItemClick,
  onLogout,
}: MobileNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#f4f7fa] font-sans antialiased text-slate-800">
      
      <header className="h-14 bg-white border-b border-slate-200/80 px-4 flex items-center justify-between shrink-0 shadow-xs z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="p-1.5 -ml-1 text-slate-700 hover:text-slate-900 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <span className="font-black text-base tracking-wider text-[#1956db]">
            YARDSTACK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className="p-1.5 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      
      <div className="bg-slate-50 border-b border-slate-200/60 px-4 py-2 flex items-center gap-1.5 text-[11px] overflow-x-auto shrink-0">
        {BREADCRUMBS.map((crumb, idx) => {
          const isLast = idx === BREADCRUMBS.length - 1;
          return (
            <div key={crumb} className="flex items-center gap-1.5 shrink-0">
              <span className={isLast ? 'text-slate-900 font-semibold' : 'text-blue-600 font-medium'}>
                {crumb}
              </span>
              {!isLast && <ChevronRight className="w-3 h-3 text-slate-400" />}
            </div>
          );
        })}
      </div>

      
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          
          <div className="relative w-4/5 max-w-xs bg-[#1956db] text-white flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            
            <div className="h-14 px-4 flex items-center justify-between border-b border-white/10 shrink-0">
              <div>
                <div className="font-black text-lg tracking-wider text-white">
                  YARDSTACK
                </div>
                <div className="text-[9px] tracking-widest uppercase text-white/70 font-medium -mt-0.5">
                  Proptech Platform
                </div>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 text-white/80 hover:text-white rounded-md hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
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
                    onClick={() => {
                      onItemClick?.(item);
                      setDrawerOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white text-[#1956db] shadow-md font-bold'
                        : 'text-white/90 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.hasSubmenu && (
                      <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                    )}
                  </button>
                );
              })}
            </nav>

            
            <div className="p-3 border-t border-white/10 bg-black/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0 text-white">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div className="overflow-hidden">
                  <div className="text-[10px] text-white/90 truncate font-medium">
                    Signed in as <span className="font-semibold text-white">{CURRENT_USER.email}</span>
                  </div>
                  <div className="text-[9px] text-white/70 font-semibold tracking-wide">
                    Role: {CURRENT_USER.role}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      
      <main className="flex-1 overflow-y-auto p-4 bg-[#f4f7fa]">
        {children}
      </main>
    </div>
  );
}

export default MobileNav;
