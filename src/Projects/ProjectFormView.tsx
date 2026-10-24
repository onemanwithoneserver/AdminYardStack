import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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

  const handleTabChange = (tab: ProjectTabItem) => {
    setInternalTabId(tab.id);
    navigate(`/${mode}/Projects/create/${tab.slug}`);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between pb-1">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 glass-card hover:bg-white dark:hover:bg-slate-800 border border-slate-200/80 dark:border-white/10 transition-all cursor-pointer shadow-xs active:scale-95"
        >
          <ArrowLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Back to Projects</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Step {effectiveTabId} of 10
          </span>
          <span>•</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {PROJECT_TABS.find((t) => t.id === effectiveTabId)?.label || 'Location-For all'}
          </span>
        </div>
      </div>

      <TabControls
        mode={mode}
        activeTabId={effectiveTabId}
        onTabChange={handleTabChange}
        onReset={() => {}}
        onSave={onBack}
      />

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
