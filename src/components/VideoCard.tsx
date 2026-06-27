import { useState } from 'react';
import type { DriveVideo } from '../types';
import { getThumbnail, formatDate } from '../api';

interface Props {
  video: DriveVideo;
  onClick: (video: DriveVideo) => void;
}

export default function VideoCard({ video, onClick }: Props) {
  const [imgError, setImgError] = useState(false);
  const thumb = getThumbnail(video);
  const title = `Ngày ${video.dayNumber}`;

  return (
    <div
      onClick={() => onClick(video)}
      className="group cursor-pointer rounded-xl overflow-hidden bg-[#111118] border border-transparent hover:border-[#2a2a38] hover:-translate-y-0.5 active:scale-[.98] transition-all duration-150"
    >
      <div className="relative w-full bg-[#1a1a24] overflow-hidden" style={{ paddingTop: '56.25%' }}>
        {thumb && !imgError ? (
          <img
            src={thumb}
            alt={title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#6c63ff]/60 bg-gradient-to-br from-[#1a1a24] to-[#1c1c2e]">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
              <path d="M5 3l14 9-14 9V3z" fill="currentColor"/>
            </svg>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-11 h-11 rounded-full bg-black/55 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M8 5.5l11 6.5-11 6.5V5.5z" fill="white"/>
            </svg>
          </div>
        </div>
      </div>

      <div className="px-3 pt-2.5 pb-3">
        <p className="text-[13px] font-medium leading-snug text-[#e8e8f0] mb-1">{title}</p>
        <span className="text-[11px] text-[#888899]">{formatDate(video.createdTime)}</span>
      </div>
    </div>
  );
}