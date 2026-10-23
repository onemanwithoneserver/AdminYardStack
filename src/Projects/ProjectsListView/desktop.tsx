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

    list = [...list].sort((a, b) => {
      const valA = String(a[sortField] || '').toLowerCase();
      const valB = String(b[sortField] || '').toLowerCase();
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [projects, searchQuery, sortField, sortAsc]);

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
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Projects ({projects.length})
        </h1>

        <button
          type="button"
          onClick={onAddProject}
          className="px-6 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#1956db] hover:bg-[#1546b3] transition-all shadow-sm shadow-blue-500/30 cursor-pointer active:scale-[0.98]"
        >
          ADD PROJECT
        </button>
      </div>

      <div className="w-full glass-card rounded-xl border border-slate-200/90 dark:border-white/10 dark:bg-slate-900/70 shadow-xs overflow-hidden backdrop-blur-xl">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-white/5 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xs flex items-center">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search projects..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg glass-input outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <button
              type="button"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Filter"
            >
              <Filter className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Columns"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Density"
            >
              <Menu className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#1956db] text-white">
                <th className="py-3 px-4 font-bold text-xs tracking-wider uppercase w-28">
                  Actions
                </th>
                <th
                  onClick={() => handleSort('projectName')}
                  className="py-3 px-4 font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-blue-700/80 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Project Name</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('city')}
                  className="py-3 px-4 font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-blue-700/80 transition-colors w-32"
                >
                  <div className="flex items-center gap-1.5">
                    <span>City</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('propertyType')}
                  className="py-3 px-4 font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-blue-700/80 transition-colors w-36"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Property Type</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('phases')}
                  className="py-3 px-4 font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-blue-700/80 transition-colors w-28"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Phases</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('basePrice')}
                  className="py-3 px-4 font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-blue-700/80 transition-colors w-32"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Base Price</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-60 ml-auto" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 font-bold text-xs tracking-wider uppercase cursor-pointer hover:bg-blue-700/80 transition-colors w-28 text-center"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3.5 h-3.5 opacity-80" />
                    <MoreVertical className="w-3.5 h-3.5 opacity-60" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-white/70 dark:bg-slate-900/60">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No projects found. Click "ADD PROJECT" to create one.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-blue-50/40 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                          className="p-1 text-sky-600 hover:text-sky-700 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                          className="p-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(project.id, project.projectName)}
                          className="p-1 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">
                      <span
                        onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                        className="cursor-pointer hover:text-blue-600 transition-colors"
                      >
                        {project.projectName}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {project.city}
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {project.propertyType}
                    </td>

                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {project.phases}
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">
                      {project.basePrice}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                        {project.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>Rows per page</span>
            <select
              value={rowsPerPage}
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-md glass-input outline-none text-xs cursor-pointer"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex items-center gap-4">
            <span>
              {filteredProjects.length === 0
                ? '0-0 of 0'
                : `${startIndex + 1}-${Math.min(startIndex + rowsPerPage, filteredProjects.length)} of ${filteredProjects.length}`}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(1)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
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
