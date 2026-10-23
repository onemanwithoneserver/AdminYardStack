import { ProjectsListDesktop } from './desktop';
import { ProjectsListMobile } from './mobile';
import type { ProjectListItem } from './data';

export { ProjectsListDesktop } from './desktop';
export { ProjectsListMobile } from './mobile';
export { INITIAL_PROJECTS_LIST, type ProjectListItem } from './data';

export interface ProjectsListViewProps {
  mode?: 'desktop' | 'mobile';
  onAddProject: () => void;
  onEditProject?: (project: ProjectListItem) => void;
}

export function ProjectsListView({
  mode = 'desktop',
  onAddProject,
  onEditProject,
}: ProjectsListViewProps) {
  if (mode === 'mobile') {
    return (
      <ProjectsListMobile
        onAddProject={onAddProject}
        onEditProject={onEditProject}
      />
    );
  }

  return (
    <ProjectsListDesktop
      onAddProject={onAddProject}
      onEditProject={onEditProject}
    />
  );
}

export default ProjectsListView;
