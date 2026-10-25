import React, { useState, useEffect, useRef, type ReactNode } from 'react';
import { LayoutDashboard, Users, Settings, Building2, MapPin, FolderKanban, TrendingUp, UserCheck, Shapes, Shield, Landmark, Boxes, Mic, GraduationCap, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { SIDEBAR_ITEMS, NAV_SECTIONS, CURRENT_USER, BREADCRUMBS, type NavItem, type UserProfile } from './data';
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
    <div className="flex h-screen w-screen overflow-hidden liquid-mesh-bg font-sans antialiased text-slate-800 dark:text-slate-100 theme-transition">
      
      <aside
        className={`flex flex-col shrink-0 h-full relative z-40 select-none transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          collapsed ? 'w-[76px]' : 'w-[268px]'
        } luxury-sidebar-light dark:luxury-sidebar-dark border-r border-slate-200/80 dark:border-white/[0.07] shadow-xl`}
      >
        
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-blue-600/10 via-indigo-500/5 to-transparent pointer-events-none" />

        
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-200/70 dark:border-white/[0.07] shrink-0 relative z-10">
          <BrandLogo collapsed={collapsed} />
        </div>

        
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 no-scrollbar relative z-10">
          {NAV_SECTIONS.map((section) => {
            const sectionItems = SIDEBAR_ITEMS.filter((i) => i.section === section.id);
            if (sectionItems.length === 0) return null;

            return (
              <div key={section.id} className="space-y-1">
                
                {!collapsed ? (
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-[0.14em] uppercase text-slate-600 dark:text-slate-400 select-none">
                    {section.title}
                  </div>
                ) : (
                  <div className="mx-2 my-1.5 border-t border-slate-200/60 dark:border-white/[0.08]" />
                )}

                
                {sectionItems.map((item) => {
                  const Icon = ICON_MAP[item.iconName] || FolderKanban;
                  const isActive = activeItem.toLowerCase() === item.id.toLowerCase() ||
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
                        className={`w-full relative flex items-center justify-between rounded-xl text-xs transition-all duration-200 cursor-pointer ${
                          collapsed ? 'px-0 py-2.5 justify-center' : 'px-3 py-2'
                        } ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-blue-500/5 dark:from-blue-500/20 dark:via-indigo-500/15 dark:to-transparent text-blue-700 dark:text-blue-300 font-bold border border-blue-500/25 dark:border-blue-400/25 shadow-xs luxury-active-glow'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.05] border border-transparent font-medium'
                        }`}
                      >
                        
                        {isActive && !collapsed && (
                          <div className="absolute left-1 w-1 h-5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-xs shadow-blue-500/50" />
                        )}

                        <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'justify-center' : 'pl-1'}`}>
                          <div
                            className={`p-1 rounded-lg transition-transform duration-200 ${
                              isActive
                                ? 'text-blue-600 dark:text-blue-400 scale-105'
                                : 'group-hover:scale-105 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'
                            }`}
                          >
                            <Icon className="w-4 h-4 shrink-0" />
                          </div>

                          {!collapsed && (
                            <span className="truncate text-[13px] tracking-tight">{item.label}</span>
                          )}
                        </div>

                        
                        {!collapsed && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-1">
                            {item.badge && (
                              <span
                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                                  item.badgeVariant === 'amber'
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                    : 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}

                            {item.hasSubmenu && (
                              <span
                                onClick={(e) => toggleSubmenu(item.id, e)}
                                className="p-0.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors"
                              >
                                {isSubmenuOpen ? (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </button>

                      
                      {!collapsed && item.hasSubmenu && isSubmenuOpen && item.subItems && (
                        <div className="pl-9 pr-2 py-1 space-y-1 animate-in fade-in-0 duration-150">
                          {item.subItems.map((sub) => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => onItemClick?.({ ...item, label: sub.label, route: sub.route })}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
                            >
                              <span className="truncate">{sub.label}</span>
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

        
        <div className="p-3 border-t border-slate-200/70 dark:border-white/[0.07] shrink-0 bg-slate-50/50 dark:bg-white/[0.02] relative z-10">
          <div
            className={`flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100/70 dark:hover:bg-white/[0.05] transition-colors cursor-pointer ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {user.name ? user.name.charAt(0) : 'A'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#090d16]" />
            </div>

            
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-bold text-slate-900 dark:text-white truncate leading-tight">
                  {user.name || 'Alexander Vance'}
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 font-medium truncate">
                  {user.role}
                </div>
              </div>
            )}

            
            {!collapsed && (
              <button
                type="button"
                onClick={onLogout}
                aria-label="Log out"
                title="Log out"
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
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
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden no-scrollbar p-2 sm:p-3">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DesktopNav;
