import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { ProjectsListView } from './ProjectsListView';
import { ProjectFormView } from './ProjectFormView';
import type { ProjectTabItem } from './TabControls/data';

export type { ProjectSection } from './data';

export interface ProjectsProps {
  mode?: 'desktop' | 'mobile';
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
}

export function Projects({ mode = 'desktop' }: ProjectsProps) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        index
        element={
          <ProjectsListView
            mode={mode}
            onAddProject={() => navigate(`/${mode}/Projects/create`)}
            onEditProject={() => navigate(`/${mode}/Projects/create`)}
          />
        }
      />
      <Route
        path="create/*"
        element={
          <ProjectFormView
            mode={mode}
            onBack={() => navigate(`/${mode}/Projects`)}
          />
        }
      />
      <Route
        path=":tabSlug"
        element={
          <ProjectFormView
            mode={mode}
            onBack={() => navigate(`/${mode}/Projects`)}
          />
        }
      />
      <Route path="*" element={<Navigate to="" replace />} />
    </Routes>
  );
}

export const ProjectsView = Projects;
export default Projects;
