import { useState, useMemo } from 'react';
import { Eye, Search, Plus, ChevronLeft, ChevronRight, MapPin, X } from 'lucide-react';
import { INITIAL_PROJECTS_LIST, type ProjectListItem } from './data';

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
  if (!type || type === '-') return null;
  const t = type.toLowerCase();
  let bgClass = 'bg-slate-600';
  if (t === 'flats') bgClass = 'bg-blue-600';
  else if (t.includes('gated community')) bgClass = 'bg-pink-600';
  else if (t.includes('gated flats')) bgClass = 'bg-amber-600';
  else if (t.includes('integrated township')) bgClass = 'bg-purple-600';
  else if (t.includes('super luxury') || t.includes('luxury')) bgClass = 'bg-emerald-600';
  else if (t.includes('villa')) bgClass = 'bg-rose-600';

  return (
    <span className={`inline-block px-1.5 py-0.2 rounded-[2px] text-[10px] font-semibold ${bgClass} text-white shadow-2xs`}>
      {type}
    </span>
  );
}

interface ProjectsListMobileProps {
  onAddProject: () => void;
  onEditProject?: (project: ProjectListItem) => void;
}

export function ProjectsListMobile({
  onAddProject,
  onEditProject,
}: ProjectsListMobileProps) {
  const [projects] = useState<ProjectListItem[]>(INITIAL_PROJECTS_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'FLATS'>('ALL');
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
    } else if (selectedFilter === 'INACTIVE') {
      list = list.filter((p) => p.status === 'INACTIVE');
    } else if (selectedFilter === 'FLATS') {
      list = list.filter((p) => p.propertyType.toLowerCase().includes('flat'));
    }
    return list;
  }, [projects, searchQuery, selectedFilter]);

  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + rowsPerPage);

  return (
    <div className="space-y-3 select-none pb-4 animate-in fade-in duration-200">
      
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
            Projects ({projects.length})
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Portfolio registry & listings
          </p>
        </div>

        <button
          type="button"
          onClick={onAddProject}
          className="flex items-center gap-1 px-3 py-1.5 rounded-[4px] text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-500 shadow-sm active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Add</span>
        </button>
      </div>

      
      <div className="relative flex items-center">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search projects..."
          className="w-full pl-9 pr-8 py-2 text-xs rounded-[4px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-white/10 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-none focus:border-blue-500"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 p-1 rounded-[4px] text-slate-400"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          type="button"
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3 py-1 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'ALL'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          All ({projects.length})
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('ACTIVE')}
          className={`px-3 py-1 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'ACTIVE'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('INACTIVE')}
          className={`px-3 py-1 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'INACTIVE'
              ? 'bg-slate-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          Inactive
        </button>
        <button
          type="button"
          onClick={() => setSelectedFilter('FLATS')}
          className={`px-3 py-1 rounded-[4px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedFilter === 'FLATS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 bg-white/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10'
          }`}
        >
          Flats
        </button>
      </div>

      <div className="space-y-2.5">
        {paginatedProjects.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[4px] p-6 text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-white/10">
            No projects found. Tap "Add" to create one.
          </div>
        ) : (
          paginatedProjects.map((project, idx) => {
            const avatarClass = AVATAR_PALETTE[idx % AVATAR_PALETTE.length];
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-slate-900 rounded-[4px] p-3.5 border border-slate-200/80 dark:border-white/10 shadow-xs hover:shadow-md space-y-3 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <div className={`w-8 h-8 rounded-[4px] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 select-none ${avatarClass} shadow-xs`}>
                      {project.projectName.charAt(0)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3
                        onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                        className="font-bold text-xs text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors leading-tight"
                      >
                        {project.projectName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex-wrap">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{project.city}</span>
                        </span>
                        {getPropertyTypeBadge(project.propertyType)}
                      </div>
                    </div>
                  </div>

                  {project.status === 'INACTIVE' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-slate-500 dark:bg-slate-600 text-white shadow-xs shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
                      <span>Inactive</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white shadow-xs shrink-0">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
                      </span>
                      <span>Active</span>
                    </span>
                  )}
                </div>

                
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/5">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold leading-none">Base Price</span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 block">
                      {project.basePrice !== '-' ? project.basePrice : 'Price not set'}
                    </span>
                  </div>

                  
                  <button
                    type="button"
                    onClick={() => onEditProject ? onEditProject(project) : onAddProject()}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-xs active:scale-95 transition-all cursor-pointer"
                    title="View Project"
                  >
                    <Eye className="w-3.5 h-3.5 text-white" />
                    <span>View</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 px-1">
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="p-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 disabled:opacity-30 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-2 font-bold text-slate-800 dark:text-slate-200">{currentPage}</span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="p-1.5 rounded-[4px] border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 disabled:opacity-30 cursor-pointer shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProjectsListMobile;
