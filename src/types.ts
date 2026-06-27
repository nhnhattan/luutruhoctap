export interface DriveVideo {
  id: string;
  name: string;
  createdTime: string;
  thumbnailLink?: string;
  size?: string;
  mimeType: string;
  description?: string;
  dayNumber?: number;
}

export interface DriveApiResponse {
  files: DriveVideo[];
  nextPageToken?: string;
}