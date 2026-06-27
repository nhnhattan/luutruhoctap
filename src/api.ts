import type { DriveApiResponse, DriveVideo } from './types';

const API_KEY = import.meta.env.VITE_GDRIVE_API_KEY as string;
const FOLDER_ID = import.meta.env.VITE_GDRIVE_FOLDER_ID as string;

const BASE = 'https://www.googleapis.com/drive/v3';

export async function fetchVideos(): Promise<{ videos: (DriveVideo & { dayNumber: number })[] }> {
  const allVideos: DriveVideo[] = [];
  let pageToken: string | undefined;

  do {
    const params = new URLSearchParams({
      key: API_KEY,
      q: `'${FOLDER_ID}' in parents and mimeType contains 'video/' and trashed = false`,
      fields: 'nextPageToken,files(id,name,createdTime,thumbnailLink,size,mimeType,description)',
      orderBy: 'createdTime asc',
      pageSize: '100',
      supportsAllDrives: 'true',
      includeItemsFromAllDrives: 'true',
    });

    if (pageToken) params.set('pageToken', pageToken);

    const res = await fetch(`${BASE}/files?${params}`);
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error?.message || 'Failed to fetch videos');
    }

    const data: DriveApiResponse = await res.json();
    allVideos.push(...(data.files ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  const numbered = allVideos.map((v, i) => ({ ...v, dayNumber: i + 1 }));
  return { videos: numbered.reverse() };
}

export function getEmbedUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

export function getThumbnail(video: DriveVideo): string {
  if (video.thumbnailLink) {
    return video.thumbnailLink.replace(/=s[0-9]+$/, '=s640');
  }
  // Fallback: Drive public thumbnail
  return `https://drive.google.com/thumbnail?id=${video.id}&sz=w640`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} ngày trước`;
  return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatSize(bytes?: string): string {
  if (!bytes) return '';
  const b = parseInt(bytes);
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024 / 1024 / 1024).toFixed(2)} GB`;
}