import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Header, { type ViewMode } from './components/Header';
import MobileViewport from './components/MobileViewport';
import { LeftSideTopNav } from './LeftSideTopNav';

interface ViewportPageProps {
  mode: ViewMode;
}

function ViewportPage({ mode }: ViewportPageProps) {
  const { folder = 'Projects' } = useParams<{ folder: string }>();
  const navigate = useNavigate();
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
    navigate(`/${newMode}/${folder}`);
  };

  const handleViewChange = (newView: string) => {
    navigate(`/${mode}/${newView}`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-[#f8fafc] relative">
      {isHeaderOpen && (
        <Header
          viewMode={mode}
          onViewModeChange={handleViewModeChange}
          view={folder}
          onViewChange={handleViewChange}
          onClose={() => setIsHeaderOpen(false)}
        />
      )}

      <div className="flex-1 overflow-hidden relative">
        <MobileViewport isMobile={mode === 'mobile'}>
          <LeftSideTopNav
            mode={mode}
            activeItem={folder.toLowerCase()}
            onItemClick={(item) => navigate(`/${mode}/${item.label}`)}
          >
            <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-xs min-h-[360px] flex flex-col items-center justify-center text-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 mb-3">
                Active Module: {folder}
              </span>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                {folder} Workspace
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Left navigation and top navbar configured for YardStack.
              </p>
            </div>
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
        <Route path="/desktop/:folder" element={<ViewportPage mode="desktop" />} />
        <Route path="/mobile/:folder" element={<ViewportPage mode="mobile" />} />
        <Route path="/desktop" element={<Navigate to="/desktop/Projects" replace />} />
        <Route path="/mobile" element={<Navigate to="/mobile/Projects" replace />} />
        <Route path="/" element={<Navigate to="/desktop/Projects" replace />} />
        <Route path="*" element={<Navigate to="/desktop/Projects" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
