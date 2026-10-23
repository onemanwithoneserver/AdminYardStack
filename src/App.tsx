import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Header, { type ViewMode } from './components/Header';
import MobileViewport from './components/MobileViewport';
import { LeftSideTopNav } from './LeftSideTopNav';
import { Projects } from './Projects';
import { PROJECT_TABS } from './Projects/TabControls/data';

interface ViewportPageProps {
  mode: ViewMode;
}

function ViewportPage({ mode }: ViewportPageProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsHeaderOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleViewModeChange = (newMode: ViewMode) => {
    const currentSubPath = location.pathname.replace(/^\/(desktop|mobile)/, '');
    navigate(`/${newMode}${currentSubPath || '/Projects'}`);
  };

  const handleViewChange = (newView: string) => {
    navigate(`/${mode}/${newView}`);
  };

  const isCreating =
    location.pathname.includes('/Projects/create') ||
    PROJECT_TABS.some(
      (t) =>
        location.pathname.endsWith(`/${t.slug}`) ||
        location.pathname.endsWith(`/${t.id}`)
    );

  const breadcrumbs = isCreating
    ? ['Dashboard', 'Projects', 'Create']
    : ['Dashboard', 'Projects'];

  const handleBreadcrumbClick = (crumb: string) => {
    if (crumb === 'Projects' || crumb === 'Dashboard') {
      navigate(`/${mode}/Projects`);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col liquid-mesh-bg text-slate-800 dark:text-slate-100 theme-transition relative">
      {isHeaderOpen && (
        <Header
          viewMode={mode}
          onViewModeChange={handleViewModeChange}
          view="Projects"
          onViewChange={handleViewChange}
          onClose={() => setIsHeaderOpen(false)}
        />
      )}

      <div className="flex-1 overflow-hidden relative">
        <MobileViewport isMobile={mode === 'mobile'}>
          <LeftSideTopNav
            mode={mode}
            activeItem="projects"
            breadcrumbs={breadcrumbs}
            onBreadcrumbClick={handleBreadcrumbClick}
            onItemClick={(item) => navigate(`/${mode}/${item.label}`)}
          >
            <Projects mode={mode} />
          </LeftSideTopNav>
        </MobileViewport>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/desktop/Projects/*" element={<ViewportPage mode="desktop" />} />
        <Route path="/mobile/Projects/*" element={<ViewportPage mode="mobile" />} />
        <Route path="/desktop/projects/*" element={<Navigate to="/desktop/Projects" replace />} />
        <Route path="/mobile/projects/*" element={<Navigate to="/mobile/Projects" replace />} />
        <Route path="/desktop" element={<Navigate to="/desktop/Projects" replace />} />
        <Route path="/mobile" element={<Navigate to="/mobile/Projects" replace />} />
        <Route path="/" element={<Navigate to="/desktop/Projects" replace />} />
        <Route path="*" element={<Navigate to="/desktop/Projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
