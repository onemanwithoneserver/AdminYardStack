export interface MediaFilesFormData {
  
  questionsEnabled: boolean;
  gamificationEnabled: boolean;
  compatibilityEnabled: boolean;

  
  elevationsFiles: string | null;
  amenitiesFiles: string | null;
  workProgressFiles: string | null;
  brochureFile: string | null;

  
  droneVideo: string;
  video3D: string;
  siteProgress: string;

  
  status: 'Active' | 'Inactive';
}

export const INITIAL_MEDIA_FILES_DATA: MediaFilesFormData = {
  questionsEnabled: false,
  gamificationEnabled: false,
  compatibilityEnabled: false,

  elevationsFiles: null,
  amenitiesFiles: null,
  workProgressFiles: null,
  brochureFile: null,

  droneVideo: '',
  video3D: '',
  siteProgress: '',

  status: 'Active',
};

export const sectionInfo = {
  id: '10',
  name: 'Media & Files',
  slug: '10_media_files',
};

export const initialMediaFilesData = {
  id: '10',
  name: 'Media & Files',
  description: 'Brochures, video walkthroughs, gallery images, 3D renders, and legal PDFs',
};

export type MediaFilesData = MediaFilesFormData;
