import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  label: string;
  value: string;
}

interface StyledSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  error?: boolean;
  touched?: boolean;
  disabled?: boolean;
  label?: string;
}

export function StyledSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar',
  icon,
  error,
  touched,
  disabled,
  label,
}: StyledSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  function handleSelect(option: SelectOption) {
    onChange(option.value);
    setOpen(false);
    setSearch('');
  }

  const showError = error && touched;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      )}
      <button
        type="button"
        onClick={() => { if (!disabled) { setOpen(!open); if (!open) setSearch(''); } }}
        disabled={disabled}
        className={`w-full flex items-center gap-3 px-3.5 py-3 bg-[#1a1a1a] border rounded-xl text-sm transition cursor-pointer ${
          showError ? 'border-brand' : 'border-[#2a2a2a] hover:border-[#3a3a3a]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {icon && <span className="text-gray-500 shrink-0">{icon}</span>}
        <span className={`flex-1 text-left ${selected ? 'text-white' : 'text-gray-500'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-[#2a2a2a]">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar..."
              className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#E60000]/50 transition"
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setOpen(false); setSearch(''); }
                if (e.key === 'Enter' && filtered.length === 1) handleSelect(filtered[0]);
              }}
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Nenhum resultado</div>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#2a2a2a] ${
                    option.value === value
                      ? 'text-[#E60000] bg-[#E60000]/5 font-medium'
                      : 'text-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
