import React from "react";
import type { MediaLayout } from "@/types/slide-data";
import { cn } from "@/lib/utils";

interface MediaLayoutSelectorProps {
  value: MediaLayout;
  onChange: (value: MediaLayout) => void;
}

const LAYOUTS: { value: MediaLayout; label: string }[] = [
  { value: "none", label: "None" },
  { value: "full", label: "Full" },
  { value: "single", label: "Single" },
  { value: "collage_2", label: "Collage 2" },
  { value: "collage_3", label: "Collage 3" },
];

export function MediaLayoutSelector({ value, onChange }: MediaLayoutSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {LAYOUTS.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          className={cn(
            "px-2 py-1 text-[10px] font-bold rounded border transition-all",
            value === l.value
              ? "bg-primary text-white border-primary"
              : "bg-surface text-muted-foreground border-border hover:border-muted-foreground"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
