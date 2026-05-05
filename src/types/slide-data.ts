export type SlideType = "thumbnail" | "content" | "cta";

export type LayoutType =
  | "headline"
  | "text_block"
  | "list"
  | "compare"
  | "card_group"
  | "step_flow"
  | "highlight_box"
  | "data_metric"
  | "quote"
  | "media";

export type MediaLayout = "none" | "full" | "single" | "collage_2" | "collage_3";

export interface SlideMedia {
  layout: MediaLayout;
  urls: string[];
}

export interface ListItem {
  title: string;
  desc?: string;
  icon?: string;
}

export interface SlideData {
  type: SlideType;
  layout: LayoutType;
  title: string;
  subtitle?: string;
  body?: string;
  cta?: string;
  items?: ListItem[];
  media: SlideMedia;
  // 썸네일 전용 모드
  thumbnailMode?: "image" | "text";
  // 디자인 시스템 토큰 오버라이드 (필요 시)
  accentColor?: string;
  backgroundColor?: string;
}
