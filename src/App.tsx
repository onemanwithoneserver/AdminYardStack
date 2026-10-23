import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from 'react-router-dom';
import Header, { type ViewMode } from './components/Header';
import MobileViewport from './components/MobileViewport';

interface ViewportPageProps {
  mode: ViewMode;
}

function ViewportPage({ mode }: ViewportPageProps) {
  const { folder = 'Projects' } = useParams<{ folder: string }>();
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

      {!isHeaderOpen && (
        <button
          type="button"
          onClick={() => setIsHeaderOpen(true)}
          title="Open header (Press Ctrl+M)"
          className="fixed top-3 right-3 z-50 px-2.5 py-1 text-xs font-semibold bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 border border-slate-200 rounded-md shadow-sm transition-all duration-200 cursor-pointer backdrop-blur-xs flex items-center gap-1.5 opacity-60 hover:opacity-100"
        >
          <span>Header</span>
          <kbd className="px-1 py-0.5 text-[10px] font-mono bg-slate-100 border border-slate-300 rounded text-slate-500">
            Ctrl+M
          </kbd>
        </button>
      )}

      <div className="flex-1 overflow-hidden relative">
        <MobileViewport isMobile={mode === 'mobile'}>
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
            <h1 className="text-3xl font-extrabold text-[#1e293b] tracking-tight">
              Admin YardStack
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Interactive Viewport Simulator
            </p>

            <div className="mt-6 p-4 rounded-xl bg-white border border-slate-200 shadow-sm max-w-sm w-full text-left space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Active Route:</span>
                <code className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-indigo-600 font-semibold font-mono">
                  {location.pathname}
                </code>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Viewport Mode:</span>
                <span className="font-semibold text-slate-800 capitalize">{mode}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">Target Folder:</span>
                <span className="font-semibold text-slate-800 font-mono">{folder}</span>
              </div>
            </div>
          </div>
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
