import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, Building2, MapPin, FolderKanban, TrendingUp, UserCheck, Shapes, Shield, Landmark, Boxes, Mic, GraduationCap, ChevronDown, LogOut, PanelLeftClose, PanelLeftOpen, User, Sparkles } from 'lucide-react';
import { SIDEBAR_ITEMS, CURRENT_USER, BREADCRUMBS, type NavItem, type UserProfile } from './data';
import { BrandLogo } from './BrandLogo';
import { TopNav } from './TopNav';
import { SidebarTooltip } from './SidebarTooltip';

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

export interface DesktopNavProps {
  children?: ReactNode;
  activeItem?: string;
  onItemClick?: (item: NavItem) => void;
  onLogout?: () => void;
  breadcrumbs?: string[];
  onBreadcrumbClick?: (crumb: string) => void;
  user?: UserProfile;
}

export function DesktopNav({
  children,
  activeItem = 'projects',
  onItemClick,
  onLogout,
  breadcrumbs = BREADCRUMBS,
  onBreadcrumbClick,
  user = CURRENT_USER,
}: DesktopNavProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = useState<string | null>(null);

  const [tooltipItem, setTooltipItem] = useState<NavItem | null>(null);
  const [tooltipRect, setTooltipRect] = useState<DOMRect | null>(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const tooltipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleItemMouseEnter = (item: NavItem, e: React.MouseEvent<HTMLElement>) => {
    if (!collapsed) return;
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipRect(rect);
    setTooltipItem(item);
    setIsTooltipOpen(true);
  };

  const handleItemMouseLeave = () => {
    if (!collapsed) return;
    tooltipTimeoutRef.current = setTimeout(() => {
      setIsTooltipOpen(false);
      setTooltipItem(null);
      setTooltipRect(null);
    }, 100);
  };

  const toggleSubmenu = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSubmenu((prev) => (prev === itemId ? null : itemId));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-[#050811] font-sans antialiased text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <aside className="hidden lg:flex shrink-0 h-full select-none z-40">
        <div
          className={`flex flex-col h-full transition-all duration-300 ease-in-out overflow-hidden bg-blue-600 text-white shadow-xl ${
            collapsed ? 'w-[68px]' : 'w-64'
          }`}
        >
          <div className="flex items-center justify-between px-3 py-4 h-[80px] border-b border-blue-500 shrink-0">
            <BrandLogo collapsed={collapsed} variant="blue" />

            {!collapsed ? (
              <button
                type="button"
                onClick={() => setCollapsed(true)}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="hidden lg:block text-white hover:text-blue-200 transition p-1.5 rounded-lg hover:bg-blue-500/50 cursor-pointer"
              >
                <PanelLeftClose className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="hidden lg:block text-white hover:text-blue-200 transition p-1 rounded hover:bg-blue-500/50 cursor-pointer mx-auto"
              >
                <PanelLeftOpen className="w-5 h-5" />
              </button>
            )}
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto no-scrollbar">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.iconName] || FolderKanban;
              const isActive =
                activeItem.toLowerCase() === item.id.toLowerCase() ||
                (item.id === 'projects' && activeItem.toLowerCase().includes('project'));
              const isSubmenuOpen = expandedSubmenu === item.id;

              return (
                <div key={item.id} className="relative group">
                  <button
                    type="button"
                    onClick={() => {
                      if (item.hasSubmenu && !collapsed) {
                        setExpandedSubmenu((prev) => (prev === item.id ? null : item.id));
                      }
                      onItemClick?.(item);
                    }}
                    onMouseEnter={(e) => handleItemMouseEnter(item, e)}
                    onMouseLeave={handleItemMouseLeave}
                    aria-label={item.label}
                    className={`w-full flex items-center transition-all duration-150 ease-in-out rounded-md cursor-pointer ${
                      collapsed
                        ? 'justify-center px-0 py-2.5'
                        : 'justify-between px-4 py-2 gap-3 text-left'
                    } ${
                      isActive
                        ? 'bg-white text-blue-600 font-semibold shadow-sm'
                        : 'text-blue-100 hover:bg-blue-500 hover:text-white font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600' : 'text-blue-100 group-hover:text-white'}`} />
                      {!collapsed && (
                        <span className="text-sm truncate font-medium">
                          {item.label}
                        </span>
                      )}
                    </div>

                    {!collapsed && (
                      <div className="flex items-center gap-1.5 shrink-0 ml-1">
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
                          <span
                            onClick={(e) => toggleSubmenu(item.id, e)}
                            className="p-0.5 text-blue-200 hover:text-white transition-colors"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                isSubmenuOpen ? 'rotate-180' : ''
                              }`}
                            />
                          </span>
                        )}
                      </div>
                    )}
                  </button>

                  {!collapsed && item.hasSubmenu && isSubmenuOpen && item.subItems && (
                    <div className="pl-11 pr-2 py-1 space-y-1">
                      {item.subItems.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => onItemClick?.({ ...item, label: sub.label, route: sub.route })}
                          className="w-full text-left px-3 py-1.5 rounded-md text-xs font-medium text-blue-100 hover:text-white hover:bg-blue-500/70 transition-colors cursor-pointer"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-3 border-t border-blue-500 text-xs flex items-center justify-between text-blue-100 shrink-0 bg-blue-700/20">
            {!collapsed ? (
              <>
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
                  onClick={onLogout}
                  title="Log out"
                  className="text-blue-200 hover:text-white p-1.5 rounded-lg hover:bg-blue-500 transition-colors cursor-pointer shrink-0"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCollapsed(false)}
                  title={`Signed in as ${user.email || 'admin@gmail.com'} (${user.role || 'guest'})`}
                  className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-400 transition-colors cursor-pointer"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Log out"
                  className="text-blue-200 hover:text-white p-1 rounded hover:bg-blue-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <SidebarTooltip
        item={tooltipItem}
        targetRect={tooltipRect}
        isOpen={isTooltipOpen && collapsed}
        onMouseEnter={() => {
          if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
        }}
        onMouseLeave={handleItemMouseLeave}
        onSubItemClick={(sub) => {
          if (tooltipItem) {
            onItemClick?.({ ...tooltipItem, label: sub.label, route: sub.route });
            setIsTooltipOpen(false);
          }
        }}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <TopNav
          sidebarCollapsed={collapsed}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
          breadcrumbs={breadcrumbs}
          onBreadcrumbClick={onBreadcrumbClick}
          isDark={isDark}
          onToggleTheme={() => setIsDark((prev) => !prev)}
          onLogout={onLogout}
          user={user}
          onNavigateItem={onItemClick}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-2 sm:p-3">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DesktopNav;
