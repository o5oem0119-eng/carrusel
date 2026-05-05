import React from "react";
import type { SlideType } from "@/types/slide-data";
import { cn } from "@/lib/utils";

interface SlideTypeSelectorProps {
  value: SlideType;
  onChange: (value: SlideType) => void;
}

const TYPES: { value: SlideType; label: string }[] = [
  { value: "thumbnail", label: "Thumbnail" },
  { value: "content", label: "Content" },
  { value: "cta", label: "CTA" },
];

export function SlideTypeSelector({ value, onChange }: SlideTypeSelectorProps) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {TYPES.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
            value === t.value
              ? "bg-white shadow-sm text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
