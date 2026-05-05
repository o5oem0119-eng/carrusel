import React, { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MediaUploadPanelProps {
  urls: string[];
  onChange: (urls: string[]) => void;
}

export function MediaUploadPanel({ urls, onChange }: MediaUploadPanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange([...urls, data.url]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {urls.map((url, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-border group">
            <img src={url} alt="Media" className="w-full h-full object-cover" />
            <button
              onClick={() => removeUrl(i)}
              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {urls.length < 5 && (
          <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg hover:border-accent/50 hover:bg-accent/5 cursor-pointer transition-all">
            {isUploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-[10px] font-medium mt-1 text-muted-foreground">Upload</span>
              </>
            )}
            <input type="file" className="hidden" accept="image/*,image/gif" onChange={handleFileChange} disabled={isUploading} />
          </label>
        )}
      </div>
    </div>
  );
}
