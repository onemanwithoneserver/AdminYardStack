import { useState, useMemo } from 'react';
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
  ArrowUpDown,
  MoreVertical,
  Plus,
  MapPin,
  X,
} from 'lucide-react';
import { INITIAL_PROJECTS_LIST, type ProjectListItem } from './data';

interface ProjectsListDesktopProps {
  onAddProject: () => void;
  onEditProject?: (project: ProjectListItem) => void;
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

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto select-none animate-in fade-in duration-300">
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
      <div className="w-full glass-card rounded-2xl border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/70 shadow-sm overflow-hidden backdrop-blur-xl">
        {/* Controls Toolbar: Search + Quick Category Filter Pills + Action Buttons */}
        <div className="p-4 sm:px-5 sm:py-3.5 border-b border-slate-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/40 dark:bg-white/[0.01]">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search projects by name, city, or property type..."
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl glass-input outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200 dark:border-white/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('FLATS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'FLATS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Flats
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('VILLAS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'VILLAS'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              Villas
            </button>

            <div className="h-4 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block" />

            <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
              <button
                type="button"
                className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Filter view"
              >
                <Filter className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Visible columns"
              >
                <Columns className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Density"
              >
                <Menu className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                title="Toggle fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-950 border-b border-white/10">
                <th className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase w-28 text-slate-300">
                  Actions
                </th>
                <th
                  onClick={() => handleSort('projectName')}
                  className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase cursor-pointer hover:bg-white/5 transition-colors text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Project Name</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-40 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('city')}
                  className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase cursor-pointer hover:bg-white/5 transition-colors w-36 text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>City</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-40 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('propertyType')}
                  className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase cursor-pointer hover:bg-white/5 transition-colors w-40 text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Property Type</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-40 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('phases')}
                  className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase cursor-pointer hover:bg-white/5 transition-colors w-32 text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Phases</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-40 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('basePrice')}
                  className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase cursor-pointer hover:bg-white/5 transition-colors w-36 text-slate-200"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Base Price</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-40 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3.5 px-4 font-bold text-[11px] tracking-wider uppercase cursor-pointer hover:bg-white/5 transition-colors w-28 text-center text-slate-200"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-70" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/70 dark:bg-slate-900/60">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500 dark:text-slate-400">
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
                paginatedProjects.map((project, idx) => (
                  <tr
                    key={project.id}
                    className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-default"
                  >
                    {/* Action Group */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                          className="p-1.5 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-950/40 rounded-lg transition-colors cursor-pointer"
                          title="View project preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                          className="p-1.5 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Edit project details"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id, project.projectName)}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          title="Delete development"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    {/* Project Name with Architectural Monogram */}
                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          idx % 3 === 0
                            ? 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-300'
                            : idx % 3 === 1
                            ? 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300'
                            : 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}>
                          {project.projectName.charAt(0)}
                        </div>
                        <span
                          onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                          className="cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-semibold text-[13px]"
                        >
                          {project.projectName}
                        </span>
                      </div>
                    </td>

                    {/* City */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{project.city}</span>
                      </div>
                    </td>

                    {/* Property Type */}
                    <td className="py-3 px-4">
                      {project.propertyType !== '-' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-white/10">
                          {project.propertyType}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Phases */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 font-medium">
                      {project.phases !== '-' ? project.phases : '—'}
                    </td>

                    {/* Base Price */}
                    <td className="py-3 px-4">
                      {project.basePrice !== '-' ? (
                        <span className="font-bold text-slate-900 dark:text-white tracking-tight">
                          {project.basePrice}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">Unset</span>
                      )}
                    </td>

                    {/* Status with Pulsing Beacon */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/10 dark:bg-emerald-400/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{project.status}</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer with Pagination Controls */}
        <div className="px-5 py-3.5 border-t border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 bg-slate-50/30 dark:bg-white/[0.01]">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg glass-input outline-none text-xs cursor-pointer border border-slate-200 dark:border-white/10"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
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
    </div>
  );
}

export default ProjectsListDesktop;
