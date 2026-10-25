import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Bell, Sparkles, PanelLeftClose, PanelLeftOpen, LogOut, User as UserIcon, Shield, Plus, Activity, Layers, Search, ChevronRight, Home, CheckCircle2, Building, RefreshCw, X, ArrowRight } from 'lucide-react';
import { CURRENT_USER, SIDEBAR_ITEMS, type UserProfile, type NavItem } from './data';

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
  onNavigateItem?: (item: NavItem) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  sidebarCollapsed,
  onToggleSidebar,
  breadcrumbs = ['Dashboard', 'Projects'],
  onBreadcrumbClick,
  isDark,
  onToggleTheme,
  onLogout,
  user = CURRENT_USER,
  onQuickAction,
  onNavigateItem,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        onToggleSidebar();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleSidebar]);

  useEffect(() => {
    if (searchModalOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [searchModalOpen]);

  const notifications = [
    {
      id: '1',
      title: 'DSR The World - Phase 2 Approved',
      time: '12m ago',
      desc: 'Municipal planning clearance issued by Location Authority.',
      unread: true,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      id: '2',
      title: 'New Developer Onboarded',
      time: '1h ago',
      desc: 'Cybercity Builders verified with 4 active high-rise projects.',
      unread: true,
      icon: Building,
      color: 'blue',
    },
    {
      id: '3',
      title: 'Inventory Sync Complete',
      time: '3h ago',
      desc: '450 luxury units updated with revised base pricing.',
      unread: false,
      icon: RefreshCw,
      color: 'slate',
    },
  ];

  const searchResults = searchQuery.trim()
    ? SIDEBAR_ITEMS.filter(
        (item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.section?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : SIDEBAR_ITEMS.slice(0, 6);

  return (
    <>
      <header className="h-16 shrink-0 relative z-30 flex items-center justify-between px-4 sm:px-6 backdrop-blur-xl bg-white/85 dark:bg-[#070b14]/85 border-b border-slate-200/80 dark:border-white/[0.08] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_24px_-10px_rgba(0,0,0,0.5)] transition-all duration-300">
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
            title={sidebarCollapsed ? 'Expand sidebar (⌘B)' : 'Collapse sidebar (⌘B)'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/[0.08] border border-slate-200/80 dark:border-white/10 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs group"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 transition-transform duration-200 group-hover:scale-110 text-blue-600 dark:text-blue-400" />
            ) : (
              <PanelLeftClose className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
            )}
          </button>

          <div className="h-5 w-px bg-slate-200/80 dark:bg-white/10 hidden sm:block" />

          <nav aria-label="Breadcrumbs" className="hidden sm:flex items-center gap-1.5 min-w-0">
            <button
              type="button"
              onClick={() => onBreadcrumbClick?.('Dashboard')}
              className="p-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
              title="Home / Dashboard"
            >
              <Home className="w-3.5 h-3.5" />
            </button>

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb}>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
                  {isLast ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-500/10 dark:bg-blue-400/15 text-blue-700 dark:text-blue-300 border border-blue-500/20 dark:border-blue-400/25 shadow-2xs tracking-tight">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
                      {crumb}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onBreadcrumbClick?.(crumb)}
                      className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 px-1.5 py-0.5 rounded-md hover:bg-slate-100/60 dark:hover:bg-white/[0.04] transition-colors cursor-pointer truncate max-w-[140px]"
                    >
                      {crumb}
                    </button>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>Live Mesh</span>
          </div>

          {onQuickAction && (
            <button
              type="button"
              onClick={onQuickAction}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-indigo-500 shadow-sm shadow-blue-500/25 active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotificationsOpen((prev) => !prev)}
              aria-label="System Notifications"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200/90 dark:border-white/10 p-4 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
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
                  {notifications.map((n) => {
                    const Icon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="py-2.5 px-2 hover:bg-slate-50/80 dark:hover:bg-white/[0.04] rounded-xl transition-colors cursor-pointer group flex items-start gap-3"
                      >
                        <div
                          className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center mt-0.5 ${
                            n.color === 'emerald'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : n.color === 'blue'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-xs text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                              {n.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                            {n.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2.5 border-t border-slate-100 dark:border-white/10 text-center">
                  <button
                    type="button"
                    className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer flex items-center justify-center gap-1 w-full"
                  >
                    <span>View complete audit ledger</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/10 border border-slate-200/80 dark:border-white/10 transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs group"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500 transition-transform group-hover:rotate-45 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 transition-transform group-hover:-rotate-12 duration-300" />
            )}
          </button>

          <div className="h-5 w-px bg-slate-200/80 dark:bg-white/10 mx-0.5" />

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 bg-slate-50/70 dark:bg-white/[0.04] hover:bg-slate-100/80 dark:hover:bg-white/[0.08] transition-all duration-150 cursor-pointer shadow-2xs active:scale-95 group"
            >
              <div className="relative w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 shadow-xs flex items-center justify-center text-white text-xs font-bold">
                <span>{user.name ? user.name.charAt(0) : 'A'}</span>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="hidden md:flex flex-col text-left">
                <span className="text-[12px] font-bold text-slate-900 dark:text-white leading-tight">
                  {user.name ? user.name.split(' ')[0] : 'Admin'}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 leading-none">
                  {user.role}
                </span>
              </div>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2.5 w-72 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200/90 dark:border-white/10 p-4 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150 text-slate-800 dark:text-slate-100">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md">
                    {user.name ? user.name.charAt(0) : 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {user.name || 'Alexander Vance'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {user.email}
                    </div>
                    <div className="inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-500/10 dark:bg-blue-400/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
                      <Shield className="w-2.5 h-2.5" />
                      <span>{user.role}</span>
                    </div>
                  </div>
                </div>

                <div className="py-3 border-b border-slate-100 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Organization</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-right truncate max-w-[140px]">
                      {user.organization || 'YardStack HQ'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Tier</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>{user.tier || 'Diamond Partner'}</span>
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-0.5">
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Account & Security</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Workspace Preferences</span>
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.06] transition-colors cursor-pointer text-left"
                  >
                    <Activity className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                    <span>Telemetry & Audit</span>
                  </button>
                </div>

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
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">End Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in-0 duration-150"
            onClick={() => setSearchModalOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-white/15 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200/80 dark:border-white/10">
              <Search className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search across stack (e.g. Projects, Inventory, Users, LMS)..."
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="px-2 py-0.5 text-[10px] font-mono rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10">
                ESC
              </kbd>
            </div>

            <div className="max-h-80 overflow-y-auto no-scrollbar p-2">
              <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-slate-400 dark:text-slate-500">
                {searchQuery ? `Matching Items (${searchResults.length})` : 'Quick Navigation'}
              </div>

              {searchResults.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No modules or sections found matching &quot;{searchQuery}&quot;
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSearchModalOpen(false);
                      onNavigateItem?.(item);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-white/[0.06] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Search className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-sm">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {item.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400">
                        {item.shortcut}
                      </kbd>
                    )}
                  </button>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
              <span>Use <kbd className="font-mono">⌘K</kbd> to open search anytime</span>
              <span>YardStack PropTech Stack v2.4</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TopNav;
