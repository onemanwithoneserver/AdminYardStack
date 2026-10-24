import { useState, useMemo } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
} from 'lucide-react';
import { INITIAL_PROJECTS_LIST, type ProjectListItem } from './data';

interface ProjectsListMobileProps {
  onAddProject: () => void;
  onEditProject?: (project: ProjectListItem) => void;
}

export function ProjectsListMobile({
  onAddProject,
  onEditProject,
}: ProjectsListMobileProps) {
  const [projects, setProjects] = useState<ProjectListItem[]>(INITIAL_PROJECTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'FLATS'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const filteredProjects = useMemo(() => {
    let list = projects;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.projectName.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }
    if (selectedFilter === 'ACTIVE') {
      list = list.filter((p) => p.status === 'ACTIVE');
    } else if (selectedFilter === 'FLATS') {
      list = list.filter((p) => p.propertyType.toLowerCase().includes('flat'));
    }
    return list;
  }, [projects, searchQuery, selectedFilter]);

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-4 select-none pb-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white font-display">
            Projects ({projects.length})
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Portfolio registry & listings
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProject}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 shadow-md shadow-blue-500/25 active:scale-95 transition-all cursor-pointer border border-white/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative flex items-center">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search projects..."
          className="w-full pl-9 pr-8 py-2 text-xs rounded-xl glass-input outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 border border-slate-200 dark:border-white/10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 p-1 rounded-full text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          All ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('ACTIVE')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'ACTIVE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('FLATS')}
          className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            selectedFilter === 'FLATS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-white/5 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          Flats
        </button>
      </div>

      {/* Project Cards List */}
      <div className="space-y-3">
        {paginatedProjects.length === 0 ? (
          <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-500 dark:text-slate-400">
            No projects found. Tap "Add" to create one.
          </div>
        ) : (
          paginatedProjects.map((project, idx) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl p-4 border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/60 shadow-xs space-y-3 transition-all active:scale-[0.99]"
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    idx % 3 === 0
                      ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300'
                      : idx % 3 === 1
                      ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                      : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                  }`}>
                    {project.projectName.charAt(0)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3
                      onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                      className="font-bold text-xs text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {project.projectName}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{project.city}</span>
                      {project.propertyType !== '-' && (
                        <>
                          <span>•</span>
                          <span className="truncate">{project.propertyType}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{project.status}</span>
                </span>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/5">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Base Price</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {project.basePrice !== '-' ? project.basePrice : 'Price not set'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                    className="p-1.5 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition-colors cursor-pointer"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                    className="p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id, project.projectName)}
                    className="p-1.5 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 px-1">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 glass-card disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-slate-800 dark:text-slate-200">{currentPage}</span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-white/10 glass-card disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsListMobile;
