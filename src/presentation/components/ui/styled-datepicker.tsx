import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface StyledDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  touched?: boolean;
  label?: string;
}

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function toDisplay(value: string): string {
  if (!value) return '';
  const d = new Date(value + 'T00:00:00');
  if (isNaN(d.getTime())) return value;
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function fromDisplay(display: string): string {
  const match = display.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return '';
  const [, d, m, y] = match;
  const date = new Date(`${y}-${m}-${d}T00:00:00`);
  if (isNaN(date.getTime())) return '';
  return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

function isValidDate(value: string): boolean {
  return !!fromDisplay(value);
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const d = new Date(value + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

export function StyledDatePicker({
  value,
  onChange,
  error,
  touched,
  label,
}: StyledDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(toDisplay(value));
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = parseDate(value);
  const [viewYear, setViewYear] = useState(selected?.getFullYear() || new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() || new Date().getMonth());

  useEffect(() => {
    setInputValue(toDisplay(value));
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  }, [selected]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const today = new Date();

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const showError = error && touched;

  function isSelected(day: number): boolean {
    if (!selected) return false;
    return selected.getFullYear() === viewYear && selected.getMonth() === viewMonth && selected.getDate() === day;
  }

  function isToday(day: number): boolean {
    return today.getFullYear() === viewYear && today.getMonth() === viewMonth && today.getDate() === day;
  }

  function selectDay(day: number) {
    const newVal = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(newVal);
    setInputValue(toDisplay(newVal));
    setOpen(false);
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    const limited = raw.slice(0, 8);

    let formatted = '';
    if (limited.length > 0) formatted = limited.slice(0, 2);
    if (limited.length > 2) formatted += '/' + limited.slice(2, 4);
    if (limited.length > 4) formatted += '/' + limited.slice(4, 8);

    setInputValue(formatted);

    const iso = fromDisplay(formatted);
    if (iso) {
      onChange(iso);
      const d = parseDate(iso);
      if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()); }
    } else if (!formatted) {
      onChange('');
    }
  }

  function handleInputBlur() {
    if (inputValue && !fromDisplay(inputValue)) {
      setInputValue(toDisplay(value));
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { setOpen(false); }
    if (e.key === 'Enter' && isValidDate(inputValue)) {
      setOpen(false);
    }
    if (e.key === 'Tab' && isValidDate(inputValue)) {
      setOpen(false);
    }
  }

  const inputCls = `w-full pl-10 pr-10 py-3 border rounded-xl text-sm transition focus:outline-none focus:border-[#E60000]/50 ${
    showError ? 'border-red-500' : 'border-gray-200 dark:border-[#2a2a2a]'
  } bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600`;

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setOpen(true)}
          placeholder="DD/MM/AAAA"
          className={inputCls}
        />
        <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
        <button
          type="button"
          onClick={() => setOpen(!open)}
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2a2a] text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition"
        >
          <ChevronDown className={`w-4 h-4 transition ${open ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-[300px] bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl shadow-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-white transition">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => (
              <div key={i}>
                {day ? (
                  <button
                    type="button"
                    onClick={() => selectDay(day)}
                    className={`w-full aspect-square rounded-lg text-xs font-medium transition flex items-center justify-center ${
                      isSelected(day)
                        ? 'bg-[#E60000] text-white'
                        : isToday(day)
                          ? 'border border-[#E60000] text-[#E60000]'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a]'
                    }`}
                  >
                    {day}
                  </button>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
