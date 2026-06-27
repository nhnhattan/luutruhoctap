import { useEffect, useRef } from "react";
import type { DriveVideo } from "../types";
import { getEmbedUrl, formatDate, formatSize } from "../api";

interface Props {
  video: DriveVideo;
  onClose: () => void;
}

export default function VideoModal({ video, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const title = `Ngày ${video.dayNumber}`;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md"
      style={{ animation: "fadeIn .18s ease" }}
    >
      <div
        className="flex flex-col w-full max-w-3xl max-h-[92dvh] rounded-2xl overflow-hidden border border-[#2a2a38] bg-[#111118]"
        style={{
          animation: "slideUp .2s ease",
          boxShadow: "0 24px 80px rgba(0,0,0,.7)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-[#2a2a38] shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-semibold leading-snug truncate">
              {title}
            </h2>
            <div className="flex gap-2 mt-1 text-xs text-[#888899]">
              <span>{formatDate(video.createdTime)}</span>
              {video.size && <span>· {formatSize(video.size)}</span>}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="shrink-0 p-1.5 rounded-lg border border-[#2a2a38] bg-[#1a1a24] text-[#888899] hover:text-[#e8e8f0] hover:border-[#6c63ff] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Player — padding-top 56.25% = 16:9 ratio, work mọi mobile */}
        <div
          className="lg:relative w-full h-[100vh] lg:h-auto lg:shrink-0 bg-black relative"
          style={{ paddingTop: "56.25%" }}
        >
          <iframe
            src={getEmbedUrl(video.id)}
            allow="autoplay; fullscreen"
            allowFullScreen
            title={title}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
          />
          {/* Watermark */}
          <span className="absolute bottom-3 right-3 z-10 text-xs font-semibold tracking-wide text-white/30 pointer-events-none select-none drop-shadow-md">
            DriveVid
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 py-3 shrink-0">
          <a
            href={`https://drive.google.com/file/d/${video.id}/view`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[#888899] border border-[#2a2a38] bg-[#1a1a24] hover:text-[#e8e8f0] hover:border-[#6c63ff] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Mở trong Drive
          </a>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(16px);opacity:0 } to { transform:translateY(0);opacity:1 } }
      `}</style>
    </div>
  );
}
