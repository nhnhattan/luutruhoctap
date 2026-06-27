export default function SetupBanner() {
  return (
    <div className="max-w-lg mx-auto mt-16 bg-[#111118] border border-[#2a2a38] rounded-2xl p-8 text-center">
      <div className="text-[#a78bfa] mb-4 flex justify-center">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" fill="currentColor" opacity=".7"/>
        </svg>
      </div>
      <h2 className="text-lg font-bold mb-2">Cần cấu hình API Key</h2>
      <p className="text-sm text-[#888899] mb-3">Mở file <code className="bg-[#1a1a24] px-1.5 py-0.5 rounded text-xs font-mono">.env</code> và điền Google API Key:</p>
      <div className="bg-[#1a1a24] border border-[#2a2a38] rounded-lg p-3 font-mono text-sm text-left mb-5">
        VITE_GDRIVE_API_KEY=<span className="text-[#a78bfa]">AIza...</span>
      </div>
      <div className="bg-[#0a0a0f] rounded-lg p-4 text-left">
        <p className="text-xs text-[#888899] mb-2">Cách lấy API Key:</p>
        <ol className="text-xs text-[#888899] space-y-1 pl-4 list-decimal">
          <li>Vào <a href="https://console.cloud.google.com" target="_blank" rel="noopener noreferrer" className="text-[#a78bfa] hover:underline">Google Cloud Console</a></li>
          <li>Tạo project → Enable <strong className="text-[#e8e8f0]">Google Drive API</strong></li>
          <li>Credentials → Create API Key</li>
          <li>Paste vào <code className="bg-[#1a1a24] px-1 rounded font-mono">.env</code> rồi restart dev server</li>
        </ol>
        <p className="text-xs text-[#888899] mt-3">Folder Drive phải được share <strong className="text-[#e8e8f0]">Anyone with the link</strong></p>
      </div>
    </div>
  );
}
