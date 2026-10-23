import { useState, useMemo } from 'react';
import {
  Eye,
  Pencil,
  Trash2,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
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
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        p.projectName.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-3.5 select-none pb-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
          Projects ({projects.length})
        </h1>

        <button
          type="button"
          onClick={onAddProject}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#1956db] hover:bg-[#1546b3] transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD PROJECT</span>
        </button>
      </div>

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
          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl glass-input outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div className="space-y-2.5">
        {paginatedProjects.length === 0 ? (
          <div className="glass-card rounded-xl p-6 text-center text-xs text-slate-400">
            No projects found. Tap "ADD PROJECT" to create one.
          </div>
        ) : (
          paginatedProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-xl p-3.5 border border-slate-200/80 dark:border-white/10 dark:bg-slate-900/60 shadow-xs space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3
                    onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                    className="font-bold text-xs text-slate-900 dark:text-white cursor-pointer hover:text-blue-600 transition-colors"
                  >
                    {project.projectName}
                  </h3>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {project.city} {project.propertyType !== '-' && `• ${project.propertyType}`}
                  </div>
                </div>

                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60 shrink-0">
                  {project.status}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-white/5">
                <div className="text-[11px] text-slate-500 font-medium">
                  {project.basePrice !== '-' ? project.basePrice : 'Price not set'}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                    className="p-1.5 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/40 rounded-lg transition-colors"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(project.id, project.projectName)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
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

      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1.5 rounded-lg glass-card border disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 rounded-lg glass-card border disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsListMobile;
