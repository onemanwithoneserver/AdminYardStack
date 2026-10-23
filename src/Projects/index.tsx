import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
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

export type { ProjectSection } from './data';

export interface ProjectsProps {
  mode?: 'desktop' | 'mobile';
  activeTabId?: string;
  onTabChange?: (tab: ProjectTabItem) => void;
}

export function Projects({
  mode = 'desktop',
  activeTabId: controlledActiveTabId,
  onTabChange,
}: ProjectsProps) {
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

  const effectiveTabId =
    controlledActiveTabId ||
    (currentTabFromUrl ? currentTabFromUrl.id : internalTabId);

  const handleTabChange = (tab: ProjectTabItem) => {
    setInternalTabId(tab.id);
    onTabChange?.(tab);
    navigate(`/${mode}/Projects/${tab.slug}`);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <TabControls
        mode={mode}
        activeTabId={effectiveTabId}
        onTabChange={handleTabChange}
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

export const ProjectsView = Projects;
export default Projects;
