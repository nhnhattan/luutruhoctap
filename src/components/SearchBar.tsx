interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="relative flex-1 max-w-lg">
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888899] pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      <input
        type="search"
        placeholder="Tìm video..."
        value={value}
        onChange={e => onChange(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        className="w-full bg-[#1a1a24] border border-[#2a2a38] rounded-full py-2 pl-9 pr-9 text-sm text-[#e8e8f0] placeholder-[#888899] outline-none focus:border-[#6c63ff] focus:bg-[#111118] transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          aria-label="Xóa"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888899] hover:text-[#e8e8f0] transition-colors p-0.5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
