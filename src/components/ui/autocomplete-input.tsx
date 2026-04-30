import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AutocompleteInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  notFoundMessage?: string;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onEnterNext?: () => void;
}

export function AutocompleteInput({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  className,
  notFoundMessage = "Não encontrado",
  inputRef,
  onEnterNext
}: AutocompleteInputProps) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const innerInputRef = useRef<HTMLInputElement>(null);
  // Permite passar ref externa
  const mergedInputRef = inputRef || innerInputRef;

  const filtered = options.filter(opt => opt.toLowerCase().includes(value.toLowerCase()));

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setHighlighted(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(option: string) {
    onChange(option);
    setOpen(false);
    setHighlighted(-1);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    setOpen(true);
    setHighlighted(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (open) {
      if (e.key === "ArrowDown") {
        setHighlighted(h => Math.min(h + 1, filtered.length - 1));
        return;
      } else if (e.key === "ArrowUp") {
        setHighlighted(h => Math.max(h - 1, 0));
        return;
      } else if (e.key === "Enter" && highlighted >= 0) {
        handleSelect(filtered[highlighted]);
        return;
      }
    }
    // Enter sem seleção: avança para o próximo campo
    if (e.key === "Enter" && onEnterNext) {
      e.preventDefault();
      onEnterNext();
    }
  }

  return (
    <div className={cn("grid min-w-0 gap-2 relative", className)} ref={ref}>
      <label className="text-sm font-bold text-muted-strong">{label}</label>
      <div className="relative">
        <input
          className={cn(
            "h-11 w-full min-w-0 rounded-[8px] border border-border bg-[linear-gradient(180deg,#ffffff_0%,#fbfaf8_100%)] px-3 text-sm text-foreground shadow-[var(--shadow-sm)] transition placeholder:text-muted focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/15 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted pr-10",
            disabled && "opacity-60 cursor-not-allowed"
          )}
          value={value}
          onChange={handleInput}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          ref={mergedInputRef}
        />
        <button
          type="button"
          tabIndex={-1}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted"
          onClick={() => setOpen(o => !o)}
        >
          <ChevronDown size={18} />
        </button>
        {open && (
          <div className="absolute left-0 z-30 mt-1 w-full rounded-[8px] border border-border bg-background shadow-lg max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-2 text-sm text-muted-strong">{notFoundMessage}</div>
            ) : (
              filtered.map((opt, i) => (
                <div
                  key={opt}
                  className={cn(
                    "px-3 py-2 cursor-pointer text-sm",
                    i === highlighted ? "bg-primary/10 text-primary" : "hover:bg-primary/5"
                  )}
                  onMouseDown={() => handleSelect(opt)}
                  onMouseEnter={() => setHighlighted(i)}
                >
                  {opt}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
