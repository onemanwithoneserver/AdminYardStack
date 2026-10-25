import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, MapPin, X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ArrowUpDown, MoreVertical, Eye, Pencil, Trash2, AlertTriangle, RotateCcw } from 'lucide-react';
import { INITIAL_PROJECTS_LIST, type ProjectListItem } from './data';
import { ModernDropdown } from '../../components/elements/ModernDropdown';

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

interface ColumnConfig {
  key: string;
  label: string;
  sortField?: keyof ProjectListItem | 'id';
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
}

const COLUMN_CONFIGS: ColumnConfig[] = [
  { key: 'index', label: '#', sortField: 'id', minWidth: 50, maxWidth: 90, defaultWidth: 60 },
  { key: 'projectName', label: 'Project', sortField: 'projectName', minWidth: 260, maxWidth: 600, defaultWidth: 320 },
  { key: 'city', label: 'City', sortField: 'city', minWidth: 120, maxWidth: 250, defaultWidth: 160 },
  { key: 'propertyType', label: 'Property Type', sortField: 'propertyType', minWidth: 140, maxWidth: 260, defaultWidth: 180 },
  { key: 'phases', label: 'Phases', sortField: 'phases', minWidth: 100, maxWidth: 200, defaultWidth: 130 },
  { key: 'basePrice', label: 'Base Price', sortField: 'basePrice', minWidth: 110, maxWidth: 220, defaultWidth: 140 },
  { key: 'status', label: 'Status', sortField: 'status', minWidth: 110, maxWidth: 180, defaultWidth: 130 },
  { key: 'actions', label: 'Actions', minWidth: 70, maxWidth: 120, defaultWidth: 80 },
];

const AVATAR_PALETTE = [
  'bg-blue-600 text-white',
  'bg-purple-600 text-white',
  'bg-emerald-600 text-white',
  'bg-amber-600 text-white',
  'bg-indigo-600 text-white',
  'bg-rose-600 text-white',
  'bg-cyan-600 text-white',
  'bg-violet-600 text-white',
  'bg-teal-600 text-white',
  'bg-pink-600 text-white',
];

function getPropertyTypeBadge(type: string) {
  if (!type || type === '-') {
    return <span className="text-slate-400 dark:text-slate-500 font-normal">—</span>;
  }
  const t = type.toLowerCase();
  if (t === 'flats') {
    return (
      <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-blue-600 text-white shadow-xs">
        {type}
      </span>
    );
  }
  if (t.includes('gated community')) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-pink-600 text-white shadow-xs">
        {type}
      </span>
    );
  }
  if (t.includes('gated flats')) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-amber-600 text-white shadow-xs">
        {type}
      </span>
    );
  }
  if (t.includes('integrated township')) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-purple-600 text-white shadow-xs">
        {type}
      </span>
    );
  }
  if (t.includes('super luxury') || t.includes('luxury')) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-emerald-600 text-white shadow-xs">
        {type}
      </span>
    );
  }
  if (t.includes('villa')) {
    return (
      <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-rose-600 text-white shadow-xs">
        {type}
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 rounded-[4px] text-xs font-semibold bg-slate-600 text-white shadow-xs">
      {type}
    </span>
  );
}

export function ProjectsListDesktop({
  onAddProject,
  onEditProject,
}: ProjectsListDesktopProps) {
  const [projects, setProjects] = useState<ProjectListItem[]>(INITIAL_PROJECTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortField, setSortField] = useState<keyof ProjectListItem>('projectName');
  const [sortAsc, setSortAsc] = useState(true);

  
  const [colWidths, setColWidths] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    COLUMN_CONFIGS.forEach((col) => {
      initial[col.key] = col.defaultWidth;
    });
    return initial;
  });

  
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<ProjectListItem | null>(null);
  const [undoToast, setUndoToast] = useState<UndoToastData | null>(null);
  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  
  const handleResizeStart = (e: React.MouseEvent, colKey: string) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = colWidths[colKey] || 150;
    const config = COLUMN_CONFIGS.find((c) => c.key === colKey);
    const min = config?.minWidth ?? 50;
    const max = config?.maxWidth ?? 600;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const newWidth = Math.min(max, Math.max(min, startWidth + deltaX));
      setColWidths((prev) => ({
        ...prev,
        [colKey]: newWidth,
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

  const handleResetWidth = (colKey: string) => {
    const config = COLUMN_CONFIGS.find((c) => c.key === colKey);
    if (config) {
      setColWidths((prev) => ({
        ...prev,
        [colKey]: config.defaultWidth,
      }));
    }
  };

  const totalTableWidth = useMemo(() => {
    return Object.values(colWidths).reduce((a, b) => a + b, 0);
  }, [colWidths]);

  
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveMenuRowId(null);
    };
    if (activeMenuRowId) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenuRowId]);

  
  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  const handleSort = (field: keyof ProjectListItem | 'id') => {
    if (field === 'id') {
      setSortField('id' as any);
      setSortAsc((prev) => !prev);
      return;
    }
    if (sortField === field) {
      setSortAsc((prev) => !prev);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleToggleStatus = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, status: p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' }
          : p
      )
    );
    setActiveMenuRowId(null);
  };

  const handleDeleteClick = (project: ProjectListItem) => {
    setProjectToDelete(project);
    setActiveMenuRowId(null);
  };

  const handleConfirmDelete = () => {
    if (!projectToDelete) return;
    const target = projectToDelete;
    const originalIndex = projects.findIndex((p) => p.id === target.id);

    setProjects((prev) => prev.filter((p) => p.id !== target.id));
    setProjectToDelete(null);

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    setUndoToast({
      id: target.id,
      name: target.projectName,
      project: target,
      index: originalIndex,
    });

    undoTimerRef.current = setTimeout(() => {
      setUndoToast(null);
    }, 5000);
  };

  const handleUndo = () => {
    if (!undoToast) return;
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    setProjects((prev) => {
      const copy = [...prev];
      const targetIndex = Math.min(undoToast.index, copy.length);
      copy.splice(targetIndex, 0, undoToast.project);
      return copy;
    });

    setUndoToast(null);
  };

  const filteredProjects = useMemo(() => {
    return projects
      .filter((project) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          project.projectName.toLowerCase().includes(q) ||
          project.city.toLowerCase().includes(q) ||
          project.propertyType.toLowerCase().includes(q) ||
          (project.subtitle && project.subtitle.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const valA = (a[sortField] || '').toString().toLowerCase();
        const valB = (b[sortField] || '').toString().toLowerCase();
        if (valA < valB) return sortAsc ? -1 : 1;
        if (valA > valB) return sortAsc ? 1 : -1;
        return 0;
      });
  }, [projects, searchQuery, sortField, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / rowsPerPage));
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-4 w-full">
      
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
              Projects
            </h1>
            <span className="px-2.5 py-0.5 rounded-[4px] text-xs font-bold bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-400 shadow-2xs">
              {projects.length}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Manage and track all your real estate projects
          </p>
        </div>

        
        <div className="flex items-center gap-3">
          <div className="relative min-w-[280px] sm:min-w-[340px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects by name, city or type..."
              className="w-full pl-10 pr-9 py-2.5 text-xs rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 dark:hover:border-white/20 shadow-2xs transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer rounded-[4px] transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={onAddProject}
            className="px-5 py-2.5 rounded-[4px] font-semibold text-xs text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Project</span>
          </motion.button>
        </div>
      </motion.div>

      
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut', delay: 0.05 }}
        className="bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200/80 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden"
      >
        <div className="overflow-x-auto overflow-y-auto max-h-[calc(100vh-215px)] scroll-smooth no-scrollbar">
          <table
            style={{ minWidth: `${totalTableWidth}px` }}
            className="w-full text-left border-collapse text-xs table-fixed"
          >
            <thead>
              <tr className="bg-[#182038] dark:bg-[#111726] text-white select-none sticky top-0 z-10 shadow-xs">
                
                <th
                  style={{
                    width: `${colWidths.index}px`,
                    minWidth: `${colWidths.index}px`,
                    maxWidth: `${colWidths.index}px`,
                  }}
                  onClick={() => handleSort('id')}
                  className="relative py-3 pl-4 pr-3 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>#</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
                  </div>
                  
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'index')}
                    onDoubleClick={() => handleResetWidth('index')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 50px, max: 90px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.projectName}px`,
                    minWidth: `${colWidths.projectName}px`,
                    maxWidth: `${colWidths.projectName}px`,
                  }}
                  onClick={() => handleSort('projectName')}
                  className="relative py-3 px-4 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>Project</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'projectName')}
                    onDoubleClick={() => handleResetWidth('projectName')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 260px, max: 600px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.city}px`,
                    minWidth: `${colWidths.city}px`,
                    maxWidth: `${colWidths.city}px`,
                  }}
                  onClick={() => handleSort('city')}
                  className="relative py-3 px-4 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>City</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'city')}
                    onDoubleClick={() => handleResetWidth('city')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 120px, max: 250px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.propertyType}px`,
                    minWidth: `${colWidths.propertyType}px`,
                    maxWidth: `${colWidths.propertyType}px`,
                  }}
                  onClick={() => handleSort('propertyType')}
                  className="relative py-3 px-4 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>Property Type</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'propertyType')}
                    onDoubleClick={() => handleResetWidth('propertyType')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 140px, max: 260px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.phases}px`,
                    minWidth: `${colWidths.phases}px`,
                    maxWidth: `${colWidths.phases}px`,
                  }}
                  onClick={() => handleSort('phases')}
                  className="relative py-3 px-4 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>Phases</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70" />
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'phases')}
                    onDoubleClick={() => handleResetWidth('phases')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 100px, max: 200px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.basePrice}px`,
                    minWidth: `${colWidths.basePrice}px`,
                    maxWidth: `${colWidths.basePrice}px`,
                  }}
                  onClick={() => handleSort('basePrice')}
                  className="relative py-3 px-4 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>Base Price</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'basePrice')}
                    onDoubleClick={() => handleResetWidth('basePrice')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 110px, max: 220px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.status}px`,
                    minWidth: `${colWidths.status}px`,
                    maxWidth: `${colWidths.status}px`,
                  }}
                  onClick={() => handleSort('status')}
                  className="relative py-3 px-4 font-semibold text-xs cursor-pointer text-slate-100 hover:text-white transition-colors group"
                >
                  <div className="flex items-center gap-1 truncate">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-70 shrink-0" />
                  </div>
                  <div
                    onMouseDown={(e) => handleResizeStart(e, 'status')}
                    onDoubleClick={() => handleResetWidth('status')}
                    onClick={(e) => e.stopPropagation()}
                    className="absolute top-0 right-0 w-2.5 h-full cursor-col-resize flex items-center justify-center hover:bg-blue-500/30 active:bg-blue-500/60 transition-colors z-20"
                    title="Drag to resize column (min: 110px, max: 180px)"
                  >
                    <div className="w-0.5 h-3.5 bg-slate-600/70 hover:bg-blue-400 transition-colors rounded-full" />
                  </div>
                </th>

                
                <th
                  style={{
                    width: `${colWidths.actions}px`,
                    minWidth: `${colWidths.actions}px`,
                    maxWidth: `${colWidths.actions}px`,
                  }}
                  className="relative py-3 pl-4 pr-6 font-semibold text-xs text-right text-slate-100"
                >
                  <span>Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white dark:bg-slate-900">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-semibold text-sm">No developments match your search</p>
                      <p className="text-xs">Try clearing your search query</p>
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="mt-2 px-3 py-1 text-xs font-semibold rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Reset search
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project, idx) => {
                  const avatarClass = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
                  return (
                    <motion.tr
                      key={project.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.18, delay: idx * 0.02, ease: 'easeOut' }}
                      className="relative hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-all duration-200 group cursor-default"
                    >
                      
                      <td
                        style={{
                          width: `${colWidths.index}px`,
                          minWidth: `${colWidths.index}px`,
                          maxWidth: `${colWidths.index}px`,
                        }}
                        className="py-3 pl-4 pr-3 text-xs text-slate-600 dark:text-slate-400 font-medium overflow-hidden truncate relative"
                      >
                        
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-indigo-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                        <span>{startIndex + idx + 1}</span>
                      </td>

                      
                      <td
                        style={{
                          width: `${colWidths.projectName}px`,
                          minWidth: `${colWidths.projectName}px`,
                          maxWidth: `${colWidths.projectName}px`,
                        }}
                        className="py-3 px-4 overflow-hidden"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0 select-none ${avatarClass} shadow-xs group-hover:scale-105 group-hover:shadow-sm transition-transform duration-200`}
                          >
                            {project.projectName.charAt(0)}
                          </div>
                          <div className="min-w-0 flex-1 truncate">
                            <div
                              onClick={() => (onEditProject ? onEditProject(project) : onAddProject())}
                              className="font-bold text-slate-900 dark:text-white text-xs hover:text-blue-600 dark:hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-150 truncate cursor-pointer leading-tight"
                            >
                              {project.projectName}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate mt-0.5 leading-none">
                              {project.subtitle || 'Premium residential development'}
                            </div>
                          </div>
                        </div>
                      </td>

                      
                      <td
                        style={{
                          width: `${colWidths.city}px`,
                          minWidth: `${colWidths.city}px`,
                          maxWidth: `${colWidths.city}px`,
                        }}
                        className="py-3 px-4 text-slate-600 dark:text-slate-300 text-xs overflow-hidden"
                      >
                        <div className="flex items-center gap-1.5 min-w-0 truncate group-hover:text-slate-900 dark:group-hover:text-slate-100 transition-colors">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{project.city}</span>
                        </div>
                      </td>

                      
                      <td
                        style={{
                          width: `${colWidths.propertyType}px`,
                          minWidth: `${colWidths.propertyType}px`,
                          maxWidth: `${colWidths.propertyType}px`,
                        }}
                        className="py-3 px-4 overflow-hidden"
                      >
                        <div className="truncate group-hover:scale-[1.02] origin-left transition-transform duration-150 inline-block">
                          {getPropertyTypeBadge(project.propertyType)}
                        </div>
                      </td>

                      
                      <td
                        style={{
                          width: `${colWidths.phases}px`,
                          minWidth: `${colWidths.phases}px`,
                          maxWidth: `${colWidths.phases}px`,
                        }}
                        className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs font-normal overflow-hidden truncate"
                      >
                        {project.phases !== '-' ? project.phases : '—'}
                      </td>

                      
                      <td
                        style={{
                          width: `${colWidths.basePrice}px`,
                          minWidth: `${colWidths.basePrice}px`,
                          maxWidth: `${colWidths.basePrice}px`,
                        }}
                        className="py-3 px-4 overflow-hidden truncate"
                      >
                        {project.basePrice !== '-' ? (
                          <span className="font-bold text-slate-900 dark:text-white text-xs truncate block group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.basePrice}
                          </span>
                        ) : (
                          <span className="italic text-slate-400 dark:text-slate-500 text-[11px] truncate block">
                            Unset
                          </span>
                        )}
                      </td>

                      
                      
                      <td
                        style={{
                          width: `${colWidths.status}px`,
                          minWidth: `${colWidths.status}px`,
                          maxWidth: `${colWidths.status}px`,
                        }}
                        className="py-3 px-4 overflow-hidden"
                      >
                        {project.status === 'INACTIVE' ? (
                          <span
                            onClick={() => handleToggleStatus(project.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white shadow-xs whitespace-nowrap group-hover:shadow-sm transition-all cursor-pointer select-none"
                            title="Click to toggle status"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                            <span>Inactive</span>
                          </span>
                        ) : (
                          <span
                            onClick={() => handleToggleStatus(project.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs whitespace-nowrap group-hover:shadow-sm transition-all cursor-pointer select-none"
                            title="Click to toggle status"
                          >
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      
                      <td
                        style={{
                          width: `${colWidths.actions}px`,
                          minWidth: `${colWidths.actions}px`,
                          maxWidth: `${colWidths.actions}px`,
                        }}
                        className="py-3 pl-4 pr-6 text-right relative overflow-visible"
                      >
                        <div className="flex items-center justify-end relative">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuRowId((prev) => (prev === project.id ? null : project.id));
                            }}
                            className={`w-7 h-7 rounded-[4px] border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                              activeMenuRowId === project.id
                                ? 'border-blue-500 bg-blue-600 text-white shadow-sm'
                                : 'border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-500/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/40'
                            }`}
                            title="More Actions"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          <AnimatePresence>
                            {activeMenuRowId === project.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                                transition={{ duration: 0.15, ease: 'easeOut' }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-0 top-full mt-1.5 w-44 rounded-[4px] p-1 border border-slate-200/90 dark:border-white/15 bg-white/95 dark:bg-slate-900/95 shadow-xl backdrop-blur-xl z-50 text-left space-y-0.5"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuRowId(null);
                                    if (onEditProject) onEditProject(project);
                                    else onAddProject();
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-[4px] transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                  <span>View Details</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveMenuRowId(null);
                                    if (onEditProject) onEditProject(project);
                                    else onAddProject();
                                  }}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-[4px] transition-colors cursor-pointer"
                                >
                                  <Pencil className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                                  <span>Edit Project</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleToggleStatus(project.id)}
                                  className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/10 rounded-[4px] transition-colors cursor-pointer"
                                >
                                  {project.status === 'ACTIVE' ? (
                                    <>
                                      <span className="w-3.5 h-3.5 rounded-full bg-slate-400 flex items-center justify-center shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                      </span>
                                      <span>Mark as Inactive</span>
                                    </>
                                  ) : (
                                    <>
                                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                                      </span>
                                      <span>Mark as Active</span>
                                    </>
                                  )}
                                </button>

                                <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />

                                
                                <button
                                  type="button"
                                  onClick={() => handleDeleteClick(project)}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 rounded-[4px] transition-colors cursor-pointer group"
                                >
                                  <div className="w-5 h-5 rounded-[3px] bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center shrink-0">
                                    <Trash2 className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                  </div>
                                  <span>Delete Project</span>
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        
        <div className="px-6 py-3 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900">
          
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
              roundedClass="rounded-[4px]"
              dropUp
            />
          </div>

          
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <span className="font-medium text-slate-600 dark:text-slate-400">
              {filteredProjects.length === 0
                ? '0 of 0'
                : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredProjects.length)} of ${filteredProjects.length}`}
            </span>

            <div className="flex items-center gap-1 select-none">
              
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(1)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>

              
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-7 h-7 rounded-[4px] text-xs font-semibold flex items-center justify-center transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1 rounded-[4px] text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="Last Page"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      
      <AnimatePresence>
        {projectToDelete && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 select-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs"
              onClick={() => setProjectToDelete(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-md rounded-[4px] p-5 sm:p-6 shadow-2xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-slate-900 relative space-y-4.5 z-10"
              role="dialog"
              aria-modal="true"
            >
              
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9.5 h-9.5 rounded-[4px] bg-gradient-to-br from-amber-50 via-amber-100/80 to-red-100/70 dark:from-amber-950/60 dark:via-amber-900/40 dark:to-red-950/40 border border-amber-300/80 dark:border-amber-500/40 flex items-center justify-center shrink-0 shadow-xs shadow-red-500/15">
                    <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 stroke-[2.2] fill-amber-500/20" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display tracking-tight">
                      Delete Project
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Confirm removal of this project from portfolio
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="p-1 -mr-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-[4px] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Are you sure you want to permanently delete this development? All associated phase records and configurations will be removed.
              </p>

              
              {(() => {
                const targetIdx = projects.findIndex((p) => p.id === projectToDelete.id);
                const avatarClass = AVATAR_PALETTE[(targetIdx >= 0 ? targetIdx : 0) % AVATAR_PALETTE.length];

                return (
                  <div className="p-3 rounded-[4px] bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-white/10 flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-[4px] flex items-center justify-center font-bold text-xs shrink-0 select-none ${avatarClass} shadow-xs`}
                    >
                      {projectToDelete.projectName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1 truncate">
                      <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {projectToDelete.projectName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5 truncate">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{projectToDelete.city}</span>
                        </span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span className="truncate">{projectToDelete.propertyType}</span>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <span
                          className={`font-semibold ${
                            projectToDelete.status === 'INACTIVE'
                              ? 'text-slate-500 dark:text-slate-400'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {projectToDelete.status === 'INACTIVE' ? 'Inactive' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              
              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setProjectToDelete(null)}
                  className="px-3.5 py-1.5 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-white/15 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-[4px] text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                >
                  <Trash2 className="w-3.5 h-3.5 text-white" />
                  <span>Delete Project</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      
      <AnimatePresence>
        {undoToast && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 right-6 z-[130]"
          >
            <div className="relative overflow-hidden w-auto max-w-sm rounded-[4px] bg-slate-900/95 dark:bg-slate-950/95 text-white border border-white/15 shadow-2xl backdrop-blur-xl p-3 sm:px-4 sm:py-3 flex items-center gap-3">
              <div className="w-7 h-7 rounded-[4px] bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <p className="text-xs font-medium text-slate-200 truncate">
                  Deleted <span className="font-bold text-white">"{undoToast.name}"</span>
                </p>
                <p className="text-[10px] text-slate-400">Available to undo for 5s</p>
              </div>

              
              <button
                type="button"
                onClick={handleUndo}
                className="px-3 py-1.5 rounded-[4px] text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              
              <button
                type="button"
                onClick={() => {
                  if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
                  setUndoToast(null);
                }}
                className="p-1 rounded-[4px] text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              
              <div
                className="absolute bottom-0 inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 origin-left"
                style={{
                  animation: 'countdown-progress 5s linear forwards',
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ProjectsListDesktop;
