import { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, FileText, RotateCcw, Save } from 'lucide-react';
import { TabControls } from './TabControls';
import { PROJECT_TABS, type ProjectTabItem } from './TabControls/data';

import { LocationForAllDesktop, LocationForAllMobile } from './01_Location_For_All';
import { EssentialsDesktop, EssentialsMobile } from './02_Essentials';
import { LayoutDesktop, LayoutMobile } from './03_Layout';
import { InventoryDesktop, InventoryMobile } from './04_Inventory';
import { ApprovalsDesktop, ApprovalsMobile } from './05_Approvals';
import { AmenitiesDesktop, AmenitiesMobile } from './06_Amenities';
import { SpecificationsDesktop, SpecificationsMobile } from './07_Specifications';
import { UtilitiesInfraDesktop, UtilitiesInfraMobile } from './08_Utilities_Infra';
import { FinancialsDesktop, FinancialsMobile } from './09_Financials';
import { MediaFilesDesktop, MediaFilesMobile } from './10_Media_Files';

export interface ProjectFormViewProps {
  mode?: 'desktop' | 'mobile';
  onBack?: () => void;
}

export function ProjectFormView({
  mode = 'desktop',
  onBack,
}: ProjectFormViewProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPathSegment =
    location.pathname.split('/').filter(Boolean).pop() || '';
  const currentTabFromUrl = PROJECT_TABS.find(
    (t) => t.slug === currentPathSegment || t.id === currentPathSegment
  );

  const [internalTabId, setInternalTabId] = useState<string>(
    currentTabFromUrl ? currentTabFromUrl.id : '01'
  );

  const effectiveTabId = currentTabFromUrl ? currentTabFromUrl.id : internalTabId;

  const [isScrolled, setIsScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const topSectionRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollParent = containerRef.current?.closest('main') || window;

    const handleScroll = () => {
      if (topSectionRef.current && scrollParent instanceof HTMLElement) {
        const topRect = topSectionRef.current.getBoundingClientRect();
        const parentRect = scrollParent.getBoundingClientRect();
        // Considered scrolled when the hero banner bottom has scrolled past the top of scroll container
        setIsScrolled(topRect.bottom <= parentRect.top + 16);
      } else if (scrollParent instanceof HTMLElement) {
        setIsScrolled(scrollParent.scrollTop > 130);
      } else {
        setIsScrolled(window.scrollY > 130);
      }
    };

    if (scrollParent instanceof HTMLElement) {
      scrollParent.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    let observer: IntersectionObserver | null = null;
    if (sentinelRef.current) {
      observer = new IntersectionObserver(
        ([entry]) => {
          const parentTop = scrollParent instanceof HTMLElement
            ? scrollParent.getBoundingClientRect().top
            : 0;
          const isAbove = entry.boundingClientRect.top <= parentTop + 24;
          setIsScrolled(!entry.isIntersecting && isAbove);
        },
        {
          root: scrollParent instanceof HTMLElement ? scrollParent : null,
          threshold: 0,
        }
      );
      observer.observe(sentinelRef.current);
    }

    return () => {
      if (scrollParent instanceof HTMLElement) {
        scrollParent.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      observer?.disconnect();
    };
  }, []);

  const handleTabChange = (tab: ProjectTabItem) => {
    setInternalTabId(tab.id);
    navigate(`/${mode}/Projects/create/${tab.slug}`);
  };

  return (
    <div ref={containerRef} className="space-y-3 max-w-7xl mx-auto select-none">
      
      {/* Top Section - Back Button & Hero Banner */}
      <div ref={topSectionRef} className="space-y-2.5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95 ${
              isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600 dark:text-slate-300" />
            <span>Back to Projects</span>
          </button>
        </div>

        {/* Hero Banner */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-[4px] border border-slate-200/80 dark:border-white/10 shadow-sm relative overflow-hidden py-3.5 px-5 sm:px-6">
          <div className="absolute top-0 right-1/4 w-96 h-16 bg-gradient-to-r from-blue-500/15 via-indigo-500/15 to-violet-500/15 blur-xl pointer-events-none" />
          <div
            className="absolute right-36 top-0 bottom-0 w-3/5 pointer-events-none opacity-90 dark:opacity-30 bg-contain bg-right bg-no-repeat hidden md:block"
            style={{
              backgroundImage: 'url(/project_banner.jpg)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 85%, transparent 100%)',
            }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9.5 h-9.5 rounded-[4px] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0 hover:scale-105 transition-transform duration-200">
                <FileText className="w-5 h-5 stroke-[2] text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                  Project Specification
                </h2>
              </div>
            </div>

            {/* Action Buttons in Hero Banner - ONLY active when NOT scrolled */}
            <div
              className={`flex items-center gap-2.5 transition-opacity duration-150 ${
                isScrolled ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <button
                type="button"
                onClick={() => {}}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white/95 dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 transition-all cursor-pointer shadow-xs active:scale-95"
                title="Reset form fields"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex items-center gap-1.5 px-4.5 py-1.5 rounded-[4px] text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 cursor-pointer active:scale-95 border border-white/20"
              >
                <Save className="w-3.5 h-3.5 text-white" />
                <span>Save Project</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sentinel element to track when hero banner scrolls away */}
      <div ref={sentinelRef} className="h-1 w-full pointer-events-none -mt-2" />

      {/* Sticky TabControls Bar */}
      <div className="sticky -top-4 sm:-top-5 lg:-top-6 z-30 -mx-4 sm:-mx-5 lg:-mx-6 px-4 sm:px-5 lg:px-6 py-2 backdrop-blur-xl bg-[#f4f6fb]/85 dark:bg-[#060911]/85 border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
          
          {/* Back Arrow Button - ONLY shown when scrolled to top */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.85, x: -8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.85, x: -8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="shrink-0"
              >
                <button
                  type="button"
                  onClick={onBack}
                  className="inline-flex items-center justify-center w-8 h-8 rounded-[4px] text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Back to Projects"
                >
                  <ArrowLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab controls */}
          <div className="flex-1 min-w-0">
            <TabControls
              mode={mode}
              activeTabId={effectiveTabId}
              onTabChange={handleTabChange}
              onReset={() => {}}
              onSave={onBack}
              hideBanner={true}
            />
          </div>

          {/* Action Buttons - ONLY shown when scrolled to top */}
          <AnimatePresence>
            {isScrolled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 8 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 8 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="flex items-center gap-2 shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {}}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-[4px] text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Reset form fields"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden md:inline">Reset</span>
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[4px] text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 transition-all shadow-md shadow-blue-500/25 cursor-pointer active:scale-95 border border-white/20"
                >
                  <Save className="w-3.5 h-3.5 text-white" />
                  <span>Save</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Routes>
        <Route
          index
          element={
            mode === 'mobile' ? (
              <LocationForAllMobile />
            ) : (
              <LocationForAllDesktop />
            )
          }
        />
        <Route
          path="01"
          element={
            mode === 'mobile' ? (
              <LocationForAllMobile />
            ) : (
              <LocationForAllDesktop />
            )
          }
        />
        <Route
          path="location-for-all"
          element={
            mode === 'mobile' ? (
              <LocationForAllMobile />
            ) : (
              <LocationForAllDesktop />
            )
          }
        />

        <Route
          path="02"
          element={
            mode === 'mobile' ? (
              <EssentialsMobile />
            ) : (
              <EssentialsDesktop />
            )
          }
        />
        <Route
          path="essentials"
          element={
            mode === 'mobile' ? (
              <EssentialsMobile />
            ) : (
              <EssentialsDesktop />
            )
          }
        />

        <Route
          path="03"
          element={
            mode === 'mobile' ? (
              <LayoutMobile />
            ) : (
              <LayoutDesktop />
            )
          }
        />
        <Route
          path="layout"
          element={
            mode === 'mobile' ? (
              <LayoutMobile />
            ) : (
              <LayoutDesktop />
            )
          }
        />

        <Route
          path="04"
          element={
            mode === 'mobile' ? (
              <InventoryMobile />
            ) : (
              <InventoryDesktop />
            )
          }
        />
        <Route
          path="inventory"
          element={
            mode === 'mobile' ? (
              <InventoryMobile />
            ) : (
              <InventoryDesktop />
            )
          }
        />

        <Route
          path="05"
          element={
            mode === 'mobile' ? (
              <ApprovalsMobile />
            ) : (
              <ApprovalsDesktop />
            )
          }
        />
        <Route
          path="approvals"
          element={
            mode === 'mobile' ? (
              <ApprovalsMobile />
            ) : (
              <ApprovalsDesktop />
            )
          }
        />

        <Route
          path="06"
          element={
            mode === 'mobile' ? (
              <AmenitiesMobile />
            ) : (
              <AmenitiesDesktop />
            )
          }
        />
        <Route
          path="amenities"
          element={
            mode === 'mobile' ? (
              <AmenitiesMobile />
            ) : (
              <AmenitiesDesktop />
            )
          }
        />

        <Route
          path="07"
          element={
            mode === 'mobile' ? (
              <SpecificationsMobile />
            ) : (
              <SpecificationsDesktop />
            )
          }
        />
        <Route
          path="specifications"
          element={
            mode === 'mobile' ? (
              <SpecificationsMobile />
            ) : (
              <SpecificationsDesktop />
            )
          }
        />

        <Route
          path="08"
          element={
            mode === 'mobile' ? (
              <UtilitiesInfraMobile />
            ) : (
              <UtilitiesInfraDesktop />
            )
          }
        />
        <Route
          path="utilities-infra"
          element={
            mode === 'mobile' ? (
              <UtilitiesInfraMobile />
            ) : (
              <UtilitiesInfraDesktop />
            )
          }
        />

        <Route
          path="09"
          element={
            mode === 'mobile' ? (
              <FinancialsMobile />
            ) : (
              <FinancialsDesktop />
            )
          }
        />
        <Route
          path="financials"
          element={
            mode === 'mobile' ? (
              <FinancialsMobile />
            ) : (
              <FinancialsDesktop />
            )
          }
        />

        <Route
          path="10"
          element={
            mode === 'mobile' ? (
              <MediaFilesMobile />
            ) : (
              <MediaFilesDesktop />
            )
          }
        />
        <Route
          path="media-files"
          element={
            mode === 'mobile' ? (
              <MediaFilesMobile />
            ) : (
              <MediaFilesDesktop />
            )
          }
        />

        <Route path="*" element={<Navigate to="" replace />} />
      </Routes>
    </div>
  );
}

export default ProjectFormView;
