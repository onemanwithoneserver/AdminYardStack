import { useState, useMemo, useRef, useEffect } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Filter,
  Columns,
  Menu,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUpDown,
  MoreVertical,
  Plus,
  MapPin,
  X,
  RotateCcw,
  AlertTriangle,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import { INITIAL_PROJECTS_LIST, type ProjectListItem } from './data';
import { ModernDropdown } from '../../components/ModernDropdown';

interface ProjectsListDesktopProps {
  onAddProject: () => void;
  onEditProject?: (project: ProjectListItem) => void;
}

interface UndoToastData {
  id: string;
  name: string;
  project: ProjectListItem;
  index: number;
}

export function ProjectsListDesktop({
  onAddProject,
  onEditProject,
}: ProjectsListDesktopProps) {
  const [projects, setProjects] = useState<ProjectListItem[]>(INITIAL_PROJECTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'FLATS' | 'VILLAS'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ProjectListItem>('projectName');
  const [sortAsc, setSortAsc] = useState(true);

  // Row dropdown & dialog states
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectListItem | null>(null);
  const [undoToast, setUndoToast] = useState<UndoToastData | null>(null);
  const [quickNotice, setQuickNotice] = useState<string | null>(null);
  const [density, setDensity] = useState<'compact' | 'comfortable' | 'spacious'>('comfortable');
  const [isDensityMenuOpen, setIsDensityMenuOpen] = useState(false);
  const [isColumnsMenuOpen, setIsColumnsMenuOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    city: true,
    propertyType: true,
    phases: true,
    basePrice: true,
    status: true,
  });

  // Resizable column widths state (in px)
  const [colWidths, setColWidths] = useState<Record<string, number>>({
    projectName: 320,
    city: 180,
    propertyType: 180,
    phases: 140,
    basePrice: 160,
    status: 140,
    actions: 90,
  });

  const categoryCounts = useMemo(() => {
    return {
      all: projects.length,
      active: projects.filter((p) => p.status === 'ACTIVE').length,
      flats: projects.filter((p) => p.propertyType.toLowerCase().includes('flat')).length,
      villas: projects.filter((p) => p.propertyType.toLowerCase().includes('villa')).length,
    };
  }, [projects]);

  const sortOptions = [
    { value: 'projectName-asc', label: 'Name (A → Z)' },
    { value: 'projectName-desc', label: 'Name (Z → A)' },
    { value: 'city-asc', label: 'City (A → Z)' },
    { value: 'propertyType-asc', label: 'Property Type' },
    { value: 'basePrice-desc', label: 'Price (High → Low)' },
    { value: 'basePrice-asc', label: 'Price (Low → High)' },
    { value: 'status-asc', label: 'Status' },
  ];

  const totalTableWidth = useMemo(() => {
    let sum = colWidths.projectName + colWidths.actions;
    if (visibleColumns.city) sum += colWidths.city;
    if (visibleColumns.propertyType) sum += colWidths.propertyType;
    if (visibleColumns.phases) sum += colWidths.phases;
    if (visibleColumns.basePrice) sum += colWidths.basePrice;
    if (visibleColumns.status) sum += colWidths.status;
    return sum;
  }, [colWidths, visibleColumns]);

  const handleResizeStart = (e: React.MouseEvent, key: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = colWidths[key] || 150;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.max(70, startWidth + deltaX);
      setColWidths((prev) => ({
        ...prev,
        [key]: newWidth,
      }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close menus on outside click or escape
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuRowId(null);
      setIsDensityMenuOpen(false);
      setIsColumnsMenuOpen(false);
      setIsFilterMenuOpen(false);
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMenuRowId(null);
        setProjectToDelete(null);
        setIsDensityMenuOpen(false);
        setIsColumnsMenuOpen(false);
        setIsFilterMenuOpen(false);
        setIsFullscreen(false);
      }
    };
    document.addEventListener('click', handleGlobalClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
      if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    };
  }, []);

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.propertyType.toLowerCase().includes(q)
      );
    }

    if (selectedFilter === 'ACTIVE') {
      list = list.filter((p) => p.status === 'ACTIVE');
    } else if (selectedFilter === 'FLATS') {
      list = list.filter((p) => p.propertyType.toLowerCase().includes('flat'));
    } else if (selectedFilter === 'VILLAS') {
      list = list.filter((p) => p.propertyType.toLowerCase().includes('villa'));
    }

    list = [...list].sort((a, b) => {
      const valA = String(a[sortField] || '').toLowerCase();
      const valB = String(b[sortField] || '').toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [projects, searchQuery, selectedFilter, sortField, sortAsc]);

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: keyof ProjectListItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const showNotice = (msg: string) => {
    setQuickNotice(msg);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    noticeTimerRef.current = setTimeout(() => {
      setQuickNotice(null);
    }, 2500);
  };

  // Open confirmation dialog
  const handleDeleteClick = (project: ProjectListItem) => {
    setActiveMenuRowId(null);
    setProjectToDelete(project);
  };

  // User confirms deletion in dialog
  const handleConfirmDelete = () => {
    if (!projectToDelete) return;

    const target = projectToDelete;
    const targetIndex = projects.findIndex((p) => p.id === target.id);

    // Remove from projects list
    setProjects((prev) => prev.filter((p) => p.id !== target.id));
    setProjectToDelete(null);

    // Show 5-second status toast with undo control
    setUndoToast({
      id: target.id,
      name: target.projectName,
      project: target,
      index: targetIndex >= 0 ? targetIndex : 0,
    });

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    undoTimerRef.current = setTimeout(() => {
      setUndoToast(null);
    }, 5000);
  };

  // User clicks undo
  const handleUndo = () => {
    if (!undoToast) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    setProjects((prev) => {
      const updated = [...prev];
      const insertAt = Math.min(undoToast.index, updated.length);
      updated.splice(insertAt, 0, undoToast.project);
      return updated;
    });

    showNotice(`Restored "${undoToast.name}"`);
    setUndoToast(null);
  };

  return (
    <div className="space-y-6 w-full select-none animate-in fade-in duration-300">
      {/* Page Header with Breadcrumbs & Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-display">
              Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/10 dark:bg-blue-400/15 text-blue-700 dark:text-blue-300 border border-blue-500/20">
              {projects.length} Total
            </span>
          </div>
          {/* Breadcrumb under the projects */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs mt-2">
            <span className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer font-medium transition-colors">
              Dashboard
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />
            <span className="px-2 py-0.5 rounded-md font-bold text-slate-900 dark:text-white bg-slate-100/70 dark:bg-white/[0.08] border border-slate-200/60 dark:border-white/10 shadow-2xs">
              Projects
            </span>
          </nav>
        </div>

        <button
          type="button"
          onClick={onAddProject}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:via-indigo-500 hover:to-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Main Table Card */}
      <div
        className={`w-full glass-card rounded-2xl border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/70 shadow-sm overflow-hidden backdrop-blur-xl transition-all duration-300 ${
          isFullscreen ? 'fixed inset-4 z-[100] m-0 overflow-auto shadow-2xl bg-white dark:bg-slate-900' : ''
        }`}
      >
        {/* Redesigned Controls Toolbar: Search + Category Segments + Sort by Dropdown + Micro Action Controls */}
        <div className="p-3.5 sm:px-5 border-b border-slate-200/70 dark:border-white/5 flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
          {/* Left: Modern Glass Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md flex items-center">
            <div className="absolute left-3 w-6 h-6 rounded-lg bg-blue-500/10 dark:bg-blue-400/15 text-blue-600 dark:text-blue-400 flex items-center justify-center pointer-events-none">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects by name, city, type..."
              className="w-full pl-10 pr-9 py-2 text-xs rounded-xl glass-input outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/90 dark:border-white/10 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 transition-all shadow-2xs"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded pointer-events-none hidden sm:inline">
                /
              </span>
            )}
          </div>

          {/* Right Section: Filter Pills, Sort by Dropdown & Micro Action Controls */}
          <div className="flex flex-wrap items-center justify-between xl:justify-end gap-2.5">
            {/* Category Filter Segments */}
            <div className="inline-flex p-1 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/60 dark:border-white/5 shadow-2xs">
              {[
                { key: 'ALL', label: 'All', count: categoryCounts.all },
                { key: 'ACTIVE', label: 'Active', count: categoryCounts.active },
                { key: 'FLATS', label: 'Flats', count: categoryCounts.flats },
                { key: 'VILLAS', label: 'Villas', count: categoryCounts.villas },
              ].map((tab) => {
                const isActive = selectedFilter === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => {
                      setSelectedFilter(tab.key as any);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                      isActive
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/5'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300'
                          : 'bg-slate-200/70 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

            {/* Sort By Modern Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 hidden lg:inline uppercase tracking-wider">
                Sort:
              </span>
              <ModernDropdown
                value={`${sortField}-${sortAsc ? 'asc' : 'desc'}`}
                onChange={(val) => {
                  const parts = String(val).split('-');
                  const field = parts[0] as keyof ProjectListItem;
                  const isAsc = parts[1] === 'asc';
                  setSortField(field);
                  setSortAsc(isAsc);
                }}
                options={sortOptions}
                prefix={<SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                size="sm"
                align="right"
              />
            </div>

            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 hidden sm:block" />

            {/* Micro Action Icon Controls with Tooltips & Popovers */}
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              {/* Filter Popover Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFilterMenuOpen((prev) => !prev);
                    setIsColumnsMenuOpen(false);
                    setIsDensityMenuOpen(false);
                  }}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isFilterMenuOpen || selectedFilter !== 'ALL' || searchQuery
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/15'
                      : 'border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                  title="Filter options"
                >
                  <Filter className="w-3.5 h-3.5" />
                  {(selectedFilter !== 'ALL' || searchQuery) && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  )}
                </button>

                {isFilterMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-56 rounded-2xl p-3 border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl z-40 animate-in fade-in zoom-in-95 duration-150 space-y-2.5 text-xs text-left"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-white/10">
                      <span className="font-bold text-slate-900 dark:text-white">Filters</span>
                      {(selectedFilter !== 'ALL' || searchQuery) && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFilter('ALL');
                            setSearchQuery('');
                            setIsFilterMenuOpen(false);
                          }}
                          className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                        >
                          Reset all
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status</span>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedFilter('ALL')}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            selectedFilter === 'ALL'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                          }`}
                        >
                          All
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFilter('ACTIVE')}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            selectedFilter === 'ACTIVE'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                          }`}
                        >
                          Active
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Property Type</span>
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          type="button"
                          onClick={() => setSelectedFilter('FLATS')}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            selectedFilter === 'FLATS'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                          }`}
                        >
                          Flats
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedFilter('VILLAS')}
                          className={`px-2 py-1 rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            selectedFilter === 'VILLAS'
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70'
                          }`}
                        >
                          Villas
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Columns Visibility Popover Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsColumnsMenuOpen((prev) => !prev);
                    setIsFilterMenuOpen(false);
                    setIsDensityMenuOpen(false);
                  }}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isColumnsMenuOpen
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/15'
                      : 'border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                  title="Visible columns"
                >
                  <Columns className="w-3.5 h-3.5" />
                </button>

                {isColumnsMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl p-2 border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl z-40 animate-in fade-in zoom-in-95 duration-150 space-y-1 text-xs text-left"
                  >
                    <div className="px-2 py-1 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">Toggle Columns</span>
                      <button
                        type="button"
                        onClick={() =>
                          setVisibleColumns({
                            city: true,
                            propertyType: true,
                            phases: true,
                            basePrice: true,
                            status: true,
                          })
                        }
                        className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>

                    {[
                      { key: 'city', label: 'City' },
                      { key: 'propertyType', label: 'Property Type' },
                      { key: 'phases', label: 'Phases' },
                      { key: 'basePrice', label: 'Base Price' },
                      { key: 'status', label: 'Status' },
                    ].map((col) => {
                      const isVis = visibleColumns[col.key];
                      return (
                        <button
                          key={col.key}
                          type="button"
                          onClick={() =>
                            setVisibleColumns((prev) => ({
                              ...prev,
                              [col.key]: !prev[col.key],
                            }))
                          }
                          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer text-slate-700 dark:text-slate-200"
                        >
                          <span>{col.label}</span>
                          <span
                            className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                              isVis
                                ? 'bg-blue-600 border-blue-600 text-white shadow-2xs'
                                : 'border-slate-300 dark:border-white/20 bg-transparent'
                            }`}
                          >
                            {isVis && <Check className="w-3 h-3 stroke-[3]" />}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Density Popover Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDensityMenuOpen((prev) => !prev);
                    setIsColumnsMenuOpen(false);
                    setIsFilterMenuOpen(false);
                  }}
                  className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                    isDensityMenuOpen
                      ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/15'
                      : 'border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'
                  }`}
                  title="Table density"
                >
                  <Menu className="w-3.5 h-3.5" />
                </button>
                {isDensityMenuOpen && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl p-1.5 border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-2xl z-40 animate-in fade-in zoom-in-95 duration-150 space-y-0.5"
                  >
                    {(['compact', 'comfortable', 'spacious'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDensity(d);
                          setIsDensityMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-colors cursor-pointer ${
                          density === d
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'
                        }`}
                      >
                        <span>{d}</span>
                        {density === d && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Fullscreen Button */}
              <button
                type="button"
                onClick={() => setIsFullscreen((prev) => !prev)}
                className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isFullscreen
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500/15'
                    : 'border-slate-200/90 dark:border-white/10 bg-white/90 dark:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20'
                }`}
                title={isFullscreen ? 'Exit fullscreen' : 'Toggle fullscreen'}
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Table with Resizable Columns to Increase Table Width */}
        <div className="overflow-x-auto">
          <table
            style={{ minWidth: `${totalTableWidth}px` }}
            className="w-full text-left border-collapse text-xs table-fixed"
          >
            <thead>
              <tr className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-white/10">
                {/* Project Name Header */}
                <th
                  style={{ width: `${colWidths.projectName}px`, minWidth: `${colWidths.projectName}px` }}
                  onClick={() => handleSort('projectName')}
                  className="relative py-3.5 px-4 font-semibold text-xs cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200 select-none group"
                >
                  <div className="flex items-center justify-between gap-1.5 w-full">
                    <span className="truncate">Project Name</span>
                    <ChevronsUpDown
                      className={`w-3.5 h-3.5 shrink-0 transition-all ${
                        sortField === 'projectName'
                          ? 'text-blue-600 dark:text-blue-400 opacity-100 scale-110'
                          : 'text-slate-400 opacity-60 group-hover:opacity-100'
                      }`}
                    />
                  </div>
                  {/* Drag to increase column & table width */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'projectName')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20"
                    title="Drag to resize column width"
                  />
                </th>

                {/* City Header */}
                {visibleColumns.city && (
                  <th
                    style={{ width: `${colWidths.city}px`, minWidth: `${colWidths.city}px` }}
                    onClick={() => handleSort('city')}
                    className="relative py-3.5 px-4 font-semibold text-xs cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200 select-none group"
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="truncate">City</span>
                      <ChevronsUpDown
                        className={`w-3.5 h-3.5 shrink-0 transition-all ${
                          sortField === 'city'
                            ? 'text-blue-600 dark:text-blue-400 opacity-100 scale-110'
                            : 'text-slate-400 opacity-60 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, 'city')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20"
                      title="Drag to resize column width"
                    />
                  </th>
                )}

                {/* Property Type Header */}
                {visibleColumns.propertyType && (
                  <th
                    style={{ width: `${colWidths.propertyType}px`, minWidth: `${colWidths.propertyType}px` }}
                    onClick={() => handleSort('propertyType')}
                    className="relative py-3.5 px-4 font-semibold text-xs cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200 select-none group"
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="truncate">Property Type</span>
                      <ChevronsUpDown
                        className={`w-3.5 h-3.5 shrink-0 transition-all ${
                          sortField === 'propertyType'
                            ? 'text-blue-600 dark:text-blue-400 opacity-100 scale-110'
                            : 'text-slate-400 opacity-60 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, 'propertyType')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20"
                      title="Drag to resize column width"
                    />
                  </th>
                )}

                {/* Phases Header */}
                {visibleColumns.phases && (
                  <th
                    style={{ width: `${colWidths.phases}px`, minWidth: `${colWidths.phases}px` }}
                    onClick={() => handleSort('phases')}
                    className="relative py-3.5 px-4 font-semibold text-xs cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200 select-none group"
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="truncate">Phases</span>
                      <ChevronsUpDown
                        className={`w-3.5 h-3.5 shrink-0 transition-all ${
                          sortField === 'phases'
                            ? 'text-blue-600 dark:text-blue-400 opacity-100 scale-110'
                            : 'text-slate-400 opacity-60 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, 'phases')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20"
                      title="Drag to resize column width"
                    />
                  </th>
                )}

                {/* Base Price Header */}
                {visibleColumns.basePrice && (
                  <th
                    style={{ width: `${colWidths.basePrice}px`, minWidth: `${colWidths.basePrice}px` }}
                    onClick={() => handleSort('basePrice')}
                    className="relative py-3.5 px-4 font-semibold text-xs cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-200 select-none group"
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="truncate">Base Price</span>
                      <ChevronsUpDown
                        className={`w-3.5 h-3.5 shrink-0 transition-all ${
                          sortField === 'basePrice'
                            ? 'text-blue-600 dark:text-blue-400 opacity-100 scale-110'
                            : 'text-slate-400 opacity-60 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, 'basePrice')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20"
                      title="Drag to resize column width"
                    />
                  </th>
                )}

                {/* Status Header */}
                {visibleColumns.status && (
                  <th
                    style={{ width: `${colWidths.status}px`, minWidth: `${colWidths.status}px` }}
                    onClick={() => handleSort('status')}
                    className="relative py-3.5 px-4 font-semibold text-xs cursor-pointer hover:bg-slate-200/50 dark:hover:bg-white/5 transition-colors text-center text-slate-700 dark:text-slate-200 select-none group"
                  >
                    <div className="flex items-center justify-between gap-1.5 w-full">
                      <span className="truncate">Status</span>
                      <ChevronsUpDown
                        className={`w-3.5 h-3.5 shrink-0 transition-all ${
                          sortField === 'status'
                            ? 'text-blue-600 dark:text-blue-400 opacity-100 scale-110'
                            : 'text-slate-400 opacity-60 group-hover:opacity-100'
                        }`}
                      />
                    </div>
                    <div
                      onMouseDown={(e) => handleResizeStart(e, 'status')}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-500/80 active:bg-blue-600 transition-colors z-20"
                      title="Drag to resize column width"
                    />
                  </th>
                )}

                {/* Actions column on the right side */}
                <th
                  style={{ width: `${colWidths.actions}px`, minWidth: `${colWidths.actions}px` }}
                  className="relative py-3.5 px-5 font-semibold text-xs text-right text-slate-700 dark:text-slate-200"
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/70 dark:bg-slate-900/60">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={2 + Object.values(visibleColumns).filter(Boolean).length}
                    className="py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-sm">No developments match your filter</p>
                      <p className="text-xs">Try clearing your search query or reset filter</p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedFilter('ALL');
                        }}
                        className="mt-2 px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project, idx) => {
                  const rowPy = density === 'compact' ? 'py-2' : density === 'spacious' ? 'py-5' : 'py-3.5';
                  return (
                    <tr
                      key={project.id}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-default"
                    >
                      {/* Project Name with Architectural Monogram */}
                      <td
                        style={{ width: `${colWidths.projectName}px`, minWidth: `${colWidths.projectName}px` }}
                        className={`${rowPy} px-4 font-semibold text-slate-800 dark:text-slate-100 overflow-hidden`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 shadow-2xs border ${
                              idx % 3 === 0
                                ? 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-600 dark:text-blue-400 border-blue-200/60 dark:border-blue-800/30'
                                : idx % 3 === 1
                                ? 'bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 text-indigo-600 dark:text-indigo-400 border-indigo-200/60 dark:border-indigo-800/30'
                                : 'bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/30'
                            }`}
                          >
                            {project.projectName.charAt(0)}
                          </div>
                          <span
                            onClick={() => (onEditProject ? onEditProject(project) : onAddProject())}
                            className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-[13px] tracking-tight truncate"
                          >
                            {project.projectName}
                          </span>
                        </div>
                      </td>

                      {/* City */}
                      {visibleColumns.city && (
                        <td
                          style={{ width: `${colWidths.city}px`, minWidth: `${colWidths.city}px` }}
                          className={`${rowPy} px-4 text-slate-600 dark:text-slate-300 overflow-hidden`}
                        >
                          <div className="flex items-center gap-1.5 min-w-0">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="truncate">{project.city}</span>
                          </div>
                        </td>
                      )}

                      {/* Property Type */}
                      {visibleColumns.propertyType && (
                        <td
                          style={{ width: `${colWidths.propertyType}px`, minWidth: `${colWidths.propertyType}px` }}
                          className={`${rowPy} px-4 overflow-hidden`}
                        >
                          {project.propertyType !== '-' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/10 truncate">
                              {project.propertyType}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                      )}

                      {/* Phases */}
                      {visibleColumns.phases && (
                        <td
                          style={{ width: `${colWidths.phases}px`, minWidth: `${colWidths.phases}px` }}
                          className={`${rowPy} px-4 text-slate-600 dark:text-slate-400 font-medium overflow-hidden`}
                        >
                          <span className="truncate">{project.phases !== '-' ? project.phases : '—'}</span>
                        </td>
                      )}

                      {/* Base Price */}
                      {visibleColumns.basePrice && (
                        <td
                          style={{ width: `${colWidths.basePrice}px`, minWidth: `${colWidths.basePrice}px` }}
                          className={`${rowPy} px-4 overflow-hidden`}
                        >
                          {project.basePrice !== '-' ? (
                            <span className="font-bold text-slate-900 dark:text-white tracking-tight truncate">
                              {project.basePrice}
                            </span>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Unset</span>
                          )}
                        </td>
                      )}

                      {/* Status with Pulsing Beacon */}
                      {visibleColumns.status && (
                        <td
                          style={{ width: `${colWidths.status}px`, minWidth: `${colWidths.status}px` }}
                          className={`${rowPy} px-4 text-center overflow-hidden`}
                        >
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span>{project.status}</span>
                          </span>
                        </td>
                      )}

                      {/* Action Group on the RIGHT side - ONLY MORE CONTENT MENU */}
                      <td
                        style={{ width: `${colWidths.actions}px`, minWidth: `${colWidths.actions}px` }}
                        className={`${rowPy} px-5 text-right whitespace-nowrap overflow-visible`}
                      >
                      <div className="flex items-center justify-end relative">
                        {/* More Options Dropdown Trigger */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuRowId((prev) => (prev === project.id ? null : project.id));
                            }}
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95 ${
                              activeMenuRowId === project.id
                                ? 'border-blue-400 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-sm'
                                : 'border-slate-200/80 dark:border-white/10 bg-white/90 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/80 hover:border-slate-300 dark:hover:border-white/20'
                            }`}
                            title="More Options"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {/* Floating Row Dropdown Menu */}
                          {activeMenuRowId === project.id && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute right-0 top-full mt-1.5 w-48 rounded-xl glass-pop py-1.5 z-40 border border-slate-200 dark:border-white/10 shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuRowId(null);
                                  if (onEditProject) {
                                    onEditProject(project);
                                  } else {
                                    onAddProject();
                                  }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                <span>View Details</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveMenuRowId(null);
                                  if (onEditProject) {
                                    onEditProject(project);
                                  } else {
                                    onAddProject();
                                  }
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                              >
                                <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                <span>Edit Configuration</span>
                              </button>
                              <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />
                              <button
                                type="button"
                                onClick={() => handleDeleteClick(project)}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Delete Project</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <ModernDropdown
              value={rowsPerPage}
              onChange={(val) => {
                setRowsPerPage(Number(val));
                setCurrentPage(1);
              }}
              options={[
                { value: 10, label: '10' },
                { value: 25, label: '25' },
                { value: 50, label: '50' },
              ]}
              size="xs"
              dropUp
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="font-medium">
              {filteredProjects.length === 0
                ? '0 of 0'
                : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredProjects.length)} of ${filteredProjects.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(1)}
                className="p-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-semibold text-slate-800 dark:text-slate-200">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1.5 rounded-lg border border-slate-200/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 ys-overlay animate-in fade-in duration-200">
          <div
            className="fixed inset-0"
            onClick={() => setProjectToDelete(null)}
          />
          <div
            className="w-full max-w-md ys-dialog rounded-2xl p-6 shadow-2xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-slate-900 relative overflow-hidden space-y-5 animate-in zoom-in-95 duration-200 z-10"
            role="dialog"
            aria-modal="true"
          >
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-red-500 to-amber-500" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0 shadow-sm">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Delete Project
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Are you sure you want to delete{' '}
                  <span className="font-bold text-slate-900 dark:text-white">
                    "{projectToDelete.projectName}"
                  </span>
                  ? This will remove the development from the active listings registry.
                </p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <span>You will have 5 seconds to undo this deletion.</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-md shadow-rose-500/30 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5-Second Status Toast with Undo Control (Small Width) */}
      {undoToast && (
        <div className="fixed bottom-6 right-6 z-[130] animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="relative overflow-hidden w-auto max-w-sm rounded-2xl bg-slate-900/95 dark:bg-slate-950/95 text-white border border-white/15 shadow-2xl backdrop-blur-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <p className="text-xs font-medium text-slate-200 truncate">
                Deleted <span className="font-bold text-white">"{undoToast.name}"</span>
              </p>
              <p className="text-[10px] text-slate-400">Available to undo for 5s</p>
            </div>

            {/* Undo Button */}
            <button
              type="button"
              onClick={handleUndo}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 active:scale-95 shadow-sm shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Undo</span>
            </button>

            {/* Dismiss X Button */}
            <button
              type="button"
              onClick={() => {
                if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                setUndoToast(null);
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            {/* Animated 5s countdown line */}
            <div
              className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left"
              style={{
                animation: 'countdown-progress 5s linear forwards',
              }}
            />
          </div>
        </div>
      )}

      {/* Brief Quick Notice Toast (e.g., duplicated, link copied) */}
      {quickNotice && (
        <div className="fixed bottom-6 right-6 z-[130] animate-in slide-in-from-bottom-4 fade-in duration-200">
          <div className="px-4 py-2.5 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 text-white border border-white/15 shadow-xl backdrop-blur-xl text-xs font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{quickNotice}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectsListDesktop;
