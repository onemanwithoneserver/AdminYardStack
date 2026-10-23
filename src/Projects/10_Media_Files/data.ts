export interface MediaFilesData {
  id: string;
  name: string;
  description: string;
  fields: Record<string, unknown>;
}

export const initialMediaFilesData: MediaFilesData = {
  id: '10',
  name: 'Media & Files',
  description: 'Brochures, video walkthroughs, gallery images, 3D renders, and legal PDFs',
  fields: {},
};

export const sectionInfo = {
  id: '10',
  name: 'Media & Files',
  slug: '10_media_files',
};
