import { sectionInfo as section01 } from './01_Location_For_All';
import { sectionInfo as section02 } from './02_Essentials';
import { sectionInfo as section03 } from './03_Layout';
import { sectionInfo as section04 } from './04_Inventory';
import { sectionInfo as section05 } from './05_Approvals';
import { sectionInfo as section06 } from './06_Amenities';
import { sectionInfo as section07 } from './07_Specifications';
import { sectionInfo as section08 } from './08_Utilities_Infra';
import { sectionInfo as section09 } from './09_Financials';
import { sectionInfo as section10 } from './10_Media_Files';

export interface ProjectSection {
  id: string;
  name: string;
  slug: string;
}

export const PROJECT_SECTIONS: ProjectSection[] = [
  section01,
  section02,
  section03,
  section04,
  section05,
  section06,
  section07,
  section08,
  section09,
  section10,
];

export * as LocationForAll from './01_Location_For_All';
export * as Essentials from './02_Essentials';
export * as Layout from './03_Layout';
export * as Inventory from './04_Inventory';
export * as Approvals from './05_Approvals';
export * as Amenities from './06_Amenities';
export * as Specifications from './07_Specifications';
export * as UtilitiesInfra from './08_Utilities_Infra';
export * as Financials from './09_Financials';
export * as MediaFiles from './10_Media_Files';
export * as TabControls from './TabControls';

export default PROJECT_SECTIONS;
