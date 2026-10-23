import section01 from './01_Location_For_All';
import section02 from './02_Essentials';
import section03 from './03_Layout';
import section04 from './04_Inventory';
import section05 from './05_Approvals';
import section06 from './06_Amenities';
import section07 from './07_Specifications';
import section08 from './08_Utilities_Infra';
import section09 from './09_Financials';
import section10 from './10_Media_Files';

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

export {
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
};

export default PROJECT_SECTIONS;
