import React, { useState, useEffect } from "react";
import type { Slide } from "@/types/carousel";
import type { SlideData } from "@/types/slide-data";
import { SlideTypeSelector } from "./SlideTypeSelector";
import { LayoutSelector } from "./LayoutSelector";
import { MediaLayoutSelector } from "./MediaLayoutSelector";
import { MediaUploadPanel } from "./MediaUploadPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, Plus, Trash2, Layout } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideEditPanelProps {
  slide: Slide;
  onSave: (updates: Partial<Slide>) => Promise<void>;
}

// 간단한 Textarea 스타일 클래스
const textareaClass = "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

export function SlideEditPanel({ slide, onSave }: SlideEditPanelProps) {
  const [localData, setLocalData] = useState<SlideData | null>(slide.slideData || null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalData(slide.slideData || null);
  }, [slide]);

  const initSlideData = () => {
    const newData: SlideData = {
      type: "content",
      layout: "headline",
      title: "New Title",
      subtitle: "",
      body: "",
      media: { layout: "none", urls: [] },
      items: []
    };
    setLocalData(newData);
  };

  const updateField = (field: keyof SlideData, value: any) => {
    if (!localData) return;
    setLocalData({ ...localData, [field]: value });
  };

  const updateMedia = (field: keyof SlideData["media"], value: any) => {
    if (!localData) return;
    setLocalData({
      ...localData,
      media: { ...localData.media, [field]: value }
    });
  };

  const handleSave = async () => {
    if (!localData) return;
    setIsSaving(true);
    await onSave({ slideData: localData });
    setIsSaving(false);
  };

  if (!localData) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-muted/30">
        <Layout className="h-12 w-12 text-muted-foreground/30 mb-4" />
        <p className="text-sm font-medium text-muted-foreground mb-4">
          This slide uses legacy HTML format.
        </p>
        <Button onClick={initSlideData} variant="outline" size="sm">
          Convert to Edit Mode
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-surface overflow-y-auto">
      <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-surface z-10">
        <h3 className="text-sm font-bold">Slide Editor</h3>
        <Button size="sm" onClick={handleSave} disabled={isSaving} className="h-8 gap-1.5 px-3">
          <Save className="h-3.5 w-3.5" />
          <span>{isSaving ? "Saving..." : "Save"}</span>
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <section>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Slide Type</label>
            <SlideTypeSelector value={localData.type} onChange={(v) => updateField("type", v)} />
          </section>

          <section>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Layout</label>
            <LayoutSelector value={localData.layout} onChange={(v) => updateField("layout", v)} />
          </section>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <section>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Title</label>
            <textarea 
              value={localData.title} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("title", e.target.value)}
              className={cn(textareaClass, "resize-none font-bold")}
              placeholder="Main heading..."
            />
          </section>

          <section>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Subtitle / Label</label>
            <Input 
              value={localData.subtitle || ""} 
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField("subtitle", e.target.value)}
              placeholder="Tag or category..."
            />
          </section>

          <section>
            <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2 block">Body Text</label>
            <textarea 
              value={localData.body || ""} 
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => updateField("body", e.target.value)}
              className={cn(textareaClass, "min-h-[120px]")}
              placeholder="Description or insights..."
            />
          </section>
        </div>

        <hr className="border-border" />

        <div className="space-y-4">
          <section>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Media</label>
              <MediaLayoutSelector value={localData.media.layout} onChange={(v) => updateMedia("layout", v)} />
            </div>
            <MediaUploadPanel urls={localData.media.urls} onChange={(urls) => updateMedia("urls", urls)} />
          </section>
        </div>

        <hr className="border-border" />

        <div className="space-y-4 pb-8">
          <section>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Content Items</label>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 px-2 text-[10px]"
                onClick={() => {
                  const items = [...(localData.items || [])];
                  items.push({ title: "New Item", desc: "" });
                  updateField("items", items);
                }}
              >
                <Plus className="h-3 w-3 mr-1" /> Add
              </Button>
            </div>
            
            <div className="space-y-3">
              {localData.items?.map((item, i) => (
                <div key={i} className="p-3 rounded-lg border border-border bg-muted/20 space-y-2 relative group">
                  <button 
                    onClick={() => {
                      const items = [...(localData.items || [])];
                      items.splice(i, 1);
                      updateField("items", items);
                    }}
                    className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <Input 
                    value={item.title} 
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const items = [...(localData.items || [])];
                      items[i] = { ...items[i], title: e.target.value };
                      updateField("items", items);
                    }}
                    className="h-8 text-xs font-bold bg-white"
                    placeholder="Item title"
                  />
                  <textarea 
                    value={item.desc || ""} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                      const items = [...(localData.items || [])];
                      items[i] = { ...items[i], desc: e.target.value };
                      updateField("items", items);
                    }}
                    className={cn(textareaClass, "min-h-[60px] text-[11px] bg-white")}
                    placeholder="Description"
                  />
                </div>
              ))}
              {(!localData.items || localData.items.length === 0) && (
                <p className="text-[10px] text-center text-muted-foreground italic py-4">No items added yet</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
