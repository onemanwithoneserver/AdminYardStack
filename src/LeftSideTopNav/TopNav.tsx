import React, { useState, useRef, useEffect } from 'react';
import {
  Sun,
  Moon,
  Bell,
  Sparkles,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  User as UserIcon,
  Shield,
  Plus,
  Activity,
  Layers,
} from 'lucide-react';
import { CURRENT_USER, type UserProfile } from './data';

interface TopNavProps {
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  breadcrumbs?: string[];
  onBreadcrumbClick?: (crumb: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onLogout?: () => void;
  user?: UserProfile;
  onQuickAction?: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  breadcrumbs: _breadcrumbs,
  onBreadcrumbClick: _onBreadcrumbClick,
  isDark,
  onToggleTheme,
  onLogout,
  user = CURRENT_USER,
  onQuickAction,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut for Cmd+B
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault();
        onToggleSidebar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleSidebar]);

  const notifications = [
    {
      id: '1',
      title: 'DSR The World - Phase 2 Approved',
      time: '12m ago',
      desc: 'Municipal planning clearance issued by Location Authority.',
      unread: true,
      type: 'success',
    },
    {
      id: '2',
      title: 'New Developer Onboarded',
      time: '1h ago',
      desc: 'Cybercity Builders verified with 4 active high-rise projects.',
      unread: true,
      type: 'info',
    },
    {
      id: '3',
      title: 'Inventory Sync Complete',
      time: '3h ago',
      desc: '450 luxury units updated with Q3 revised base pricing.',
      unread: false,
      type: 'system',
    },
  ];

  return (
    <>
      <header className="h-16 shrink-0 relative z-30 flex items-center justify-between px-4 sm:px-6 luxury-glass-nav transition-all duration-300">
        {/* Left Side: Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
            title={sidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
            ) : (
              <PanelLeftClose className="w-4 h-4 transition-transform duration-200 hover:scale-110" />
            )}
          </button>
        </div>

        {/* Right Controls: Notifications + Theme + Quick Action + User Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="System Notifications"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Notifications Popover */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl luxury-hover-card p-4 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Activity Feed</span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                      3 New
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-72 overflow-y-auto no-scrollbar py-1">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className="py-2.5 px-2 hover:bg-slate-50/80 dark:hover:bg-white/[0.03] rounded-xl transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 shrink-0 font-medium">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                        {n.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/10 text-center">
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                  >
                    View audit ledger →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Theme Switcher Toggle */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10 border border-slate-200/60 dark:border-white/10 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs group"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-transform group-hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 dark:text-slate-300 transition-transform group-hover:-rotate-12 duration-300" />
            )}
          </button>

          {/* Optional Quick Action button */}
          {onQuickAction && (
            <button
              type="button"
              onClick={onQuickAction}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-0.5" />

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200/70 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/60 dark:bg-white/[0.04] hover:bg-slate-100/70 dark:hover:bg-white/[0.08] transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 group"
            >
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 p-0.5 shadow-xs flex items-center justify-center text-white text-xs font-bold">
                <span>{user.name ? user.name.charAt(0) : 'A'}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name || 'Admin'}
                </span>
                <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 leading-none">
                  {user.role}
                </span>
              </div>
            </button>

            {/* User Profile Dropdown Card */}
            {profileOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-2xl luxury-hover-card p-4 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
                {/* User Header */}
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                    {user.name ? user.name.charAt(0) : 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {user.name || 'Alexander Vance'}
                    </div>
                    <div className="text-[11px] text-slate-600 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                    <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 dark:bg-blue-400/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      <Shield className="w-2.5 h-2.5" />
                      <span>{user.role}</span>
                    </div>
                  </div>
                </div>

                {/* Organization & Quota */}
                <div className="py-3 border-b border-slate-100 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Organization</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right truncate max-w-[140px]">
                      {user.organization || 'YardStack HQ'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-slate-400 font-medium">Enterprise Tier</span>
                    <span className="font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{user.tier || 'Diamond'}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="py-2 space-y-0.5">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Account & Security</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>Workspace Preferences</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <Activity className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                    <span>System Telemetry</span>
                  </button>
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      <span>Sign Out</span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">End Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

    </>
  );
};

export default TopNav;
