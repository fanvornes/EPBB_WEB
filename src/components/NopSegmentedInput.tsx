"use client";

import * as React from "react";
import { NOP_SEGMENTS, joinNopSegments, splitNopSegments } from "@/lib/validators";
import { cn } from "@/lib/utils";

interface NopSegmentedInputProps {
  value: string; // 18 digit gabungan (tanpa titik)
  onChange: (nop: string) => void;
  disabled?: boolean;
  autoFocusFirst?: boolean;
}

/**
 * Input NOP tersegmen sesuai struktur backend:
 * KdPropinsi(2).KdDati2(2).KdKecamatan(3).KdKelurahan(3).KdBlok(3).NoUrut(4).KdJnsOp(1)
 * Mendukung ketik auto-advance, backspace lintas segmen, dan paste 18 digit.
 */
export function NopSegmentedInput({
  value,
  onChange,
  disabled,
  autoFocusFirst,
}: NopSegmentedInputProps) {
  const parts = React.useMemo(() => splitNopSegments(value), [value]);
  const refs = React.useRef<Array<HTMLInputElement | null>>([]);

  const setPart = (index: number, raw: string) => {
    const clean = raw.replace(/\D/g, "").slice(0, NOP_SEGMENTS[index].length);
    const next = [...parts];
    next[index] = clean;
    onChange(joinNopSegments(next));
    if (clean.length === NOP_SEGMENTS[index].length && index < NOP_SEGMENTS.length - 1) {
      refs.current[index + 1]?.focus();
      refs.current[index + 1]?.select();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget;
    if (e.key === "Backspace" && el.selectionStart === 0 && el.selectionEnd === 0 && index > 0) {
      e.preventDefault();
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && el.selectionStart === 0 && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && el.selectionStart === el.value.length && index < NOP_SEGMENTS.length - 1) {
      refs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (/\d/.test(text)) {
      e.preventDefault();
      onChange(text.replace(/\D/g, "").slice(0, 18));
      const last = refs.current[NOP_SEGMENTS.length - 1];
      last?.focus();
    }
  };

  React.useEffect(() => {
    if (autoFocusFirst) refs.current[0]?.focus();
  }, [autoFocusFirst]);

  return (
    <div onPaste={handlePaste}>
      <div className="flex flex-wrap items-stretch gap-1">
        {NOP_SEGMENTS.map((seg, i) => (
          <React.Fragment key={seg.key}>
            <div className="flex min-w-0 flex-col">
              <input
                ref={(el) => {
                  refs.current[i] = el;
                }}
                value={parts[i] ?? ""}
                onChange={(e) => setPart(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                disabled={disabled}
                aria-label={`${seg.label} (${seg.length} digit)`}
                placeholder={"0".repeat(seg.length)}
                maxLength={seg.length}
                style={{ width: `${seg.length * 1.15 + 1.6}rem` }}
                className={cn(
                  "rounded-lg border border-input bg-card px-2 py-2.5 text-center font-mono text-sm tracking-[0.18em] text-foreground shadow-sm",
                  "placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  "disabled:cursor-not-allowed disabled:opacity-60",
                  parts[i]?.length === seg.length && "border-primary/60 bg-accent",
                )}
              />
              <span className="mt-1 text-center text-[10px] font-medium leading-none text-muted-foreground">
                {/* {seg.label} */}
              </span>
            </div>
            {i < NOP_SEGMENTS.length - 1 && (
              <span aria-hidden className="pt-2 text-lg font-bold text-primary/50 select-none">
                .
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
