import React from "react";
import type { LayoutType } from "@/types/slide-data";
import { cn } from "@/lib/utils";
import { 
  Heading, Type, List, Columns, Grid2X2, 
  ArrowRightCircle, Star, BarChart3, Quote, Image as ImageIcon 
} from "lucide-react";

interface LayoutSelectorProps {
  value: LayoutType;
  onChange: (value: LayoutType) => void;
}

const LAYOUTS: { value: LayoutType; label: string; icon: any }[] = [
  { value: "headline", label: "Headline", icon: Heading },
  { value: "text_block", label: "Text", icon: Type },
  { value: "list", label: "List", icon: List },
  { value: "compare", label: "Compare", icon: Columns },
  { value: "card_group", label: "Cards", icon: Grid2X2 },
  { value: "step_flow", label: "Steps", icon: ArrowRightCircle },
  { value: "highlight_box", label: "Highlight", icon: Star },
  { value: "data_metric", label: "Metric", icon: BarChart3 },
  { value: "quote", label: "Quote", icon: Quote },
  { value: "media", label: "Media", icon: ImageIcon },
];

export function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {LAYOUTS.map((l) => (
        <button
          key={l.value}
          onClick={() => onChange(l.value)}
          className={cn(
            "flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border-2 transition-all",
            value === l.value
              ? "border-accent bg-accent/5 text-accent"
              : "border-border hover:border-muted-foreground/30 text-muted-foreground hover:text-foreground"
          )}
        >
          <l.icon className="h-4 w-4" />
          <span className="text-[10px] font-semibold">{l.label}</span>
        </button>
      ))}
    </div>
  );
}
