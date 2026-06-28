import { useState, useEffect, useMemo } from "react";
import { fetchVideos } from "./api";
import type { DriveVideo } from "./types";
import VideoCard from "./components/VideoCard";
import VideoModal from "./components/VideoModal";
import SearchBar from "./components/SearchBar";
import SetupBanner from "./components/SetupBanner";
import "./index.css";
import { supabase } from "./libs/supabase";


const API_KEY = import.meta.env.VITE_GDRIVE_API_KEY as string;
const IS_CONFIGURED = API_KEY && API_KEY !== "your_google_api_key_here";

export default function App() {
  const [videos, setVideos] = useState<DriveVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<DriveVideo | null>(null);
  const [search, setSearch] = useState("");

  const load = async () => {
    if (!IS_CONFIGURED) return;
    setLoading(true);
    setError(null);
    try {
      const { videos: v } = await fetchVideos();
      setVideos(v);
    } catch (e: unknown) {
      setError((e as Error).message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return videos;
    const q = search.toLowerCase();
    return videos.filter(
      (v) =>
        `ngày ${v.dayNumber}`.includes(q) || String(v.dayNumber).includes(q),
    );
  }, [videos, search]);

    useEffect(() => {
    const logVisitor = async () => {
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipData = await ipRes.json();
        const ip = ipData.ip;

        const geoRes = await fetch(`https://ip-api.com/json/${ip}`);
        const geoData = await geoRes.json();

        const country = geoData.country;
        const city = geoData.city;
        const region = geoData.regionName;

        const visitTime = new Date().toISOString();

        const { error } = await supabase.from("visitors").insert([
          {
            ip,
            country,
            city,
            region,
            visit_time: visitTime,
            user_agent: navigator.userAgent,
          },
        ]);

        if (error) {
          console.error("Insert error:", error);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };

    logVisitor();
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-[#0a0a0f] text-[#e8e8f0]">
      <header className="sticky top-0 z-40 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-[#2a2a38]">
        <div className="max-w-7xl mx-auto flex items-center gap-4 px-4 py-3">
          <div className="flex items-center gap-2 font-bold text-[17px] tracking-tight shrink-0">
            {/* <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="3" width="20" height="14" rx="3" fill="#6c63ff" opacity=".9"/>
              <path d="M10 8l6 3.5L10 15V8z" fill="white"/>
              <path d="M8 20h8M12 17v3" stroke="#888899" strokeWidth="1.5" strokeLinecap="round"/>
            </svg> */}
            <div className="w-24 h-24">
              <img src="/fav.png" alt="" className="w-full" />
            </div>
            Lưu trữ nhảm nhí
          </div>
          <SearchBar value={search} onChange={setSearch} />
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4">
        {!IS_CONFIGURED ? (
          <SetupBanner />
        ) : (
          <>
            {videos.length > 0 && (
              <p className="text-xs text-[#888899] mb-3">
                {search
                  ? `${filtered.length} / ${videos.length} video`
                  : `${videos.length} video`}
              </p>
            )}

            {error && (
              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-300 text-sm mb-4">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="shrink-0"
                >
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
                </svg>
                <span className="flex-1">{error}</span>
                <button
                  onClick={load}
                  className="shrink-0 bg-red-500/20 border border-red-500/40 rounded-lg px-3 py-1 text-xs hover:bg-red-500/35 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {loading && (
              <div
                className="grid gap-3 sm:gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                }}
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl overflow-hidden bg-[#111118]"
                  >
                    <div
                      className="w-full bg-[#1a1a24] animate-pulse"
                      style={{ paddingTop: "56.25%" }}
                    />
                    <div className="px-3 pt-2.5 pb-3 space-y-2">
                      <div className="h-3 bg-[#1a1a24] rounded animate-pulse w-2/5" />
                      <div className="h-2.5 bg-[#1a1a24] rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div
                className="grid gap-3 sm:gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                }}
              >
                {filtered.map((v) => (
                  <VideoCard key={v.id} video={v} onClick={setSelected} />
                ))}
              </div>
            )}

            {!loading && search && filtered.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-24 text-[#888899] text-sm text-center">
                <p>
                  Không tìm thấy "
                  <strong className="text-[#e8e8f0]">{search}</strong>"
                </p>
              </div>
            )}

            {!loading && !error && videos.length === 0 && (
              <div className="flex flex-col items-center gap-4 py-24 text-[#888899]">
                <svg
                  width="52"
                  height="52"
                  viewBox="0 0 24 24"
                  fill="none"
                  opacity=".3"
                >
                  <rect
                    x="2"
                    y="3"
                    width="20"
                    height="14"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M10 8l6 3.5L10 15V8z" fill="currentColor" />
                </svg>
                <p className="text-sm">Folder này chưa có video nào</p>
              </div>
            )}
          </>
        )}
      </main>

      {selected && (
        <VideoModal video={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
