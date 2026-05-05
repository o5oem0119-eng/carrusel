import React from "react";
import type { SlideData } from "@/types/slide-data";
import { COLORS, COMMON, LAYOUT_TOKENS } from "@/lib/design-system";

interface TemplateProps {
  data: SlideData;
}

// ─── 유틸리티: 공통 컨테이너 스타일 ──────────────────
const containerStyle = (bgColor?: string): React.CSSProperties => ({
  padding: COMMON.padding,
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: bgColor || COLORS.surface,
  letterSpacing: COMMON.letterSpacing,
  lineHeight: COMMON.lineHeight,
  wordBreak: COMMON.wordBreak,
  fontFamily: COMMON.fontFamily,
  position: "relative",
  overflow: "hidden", 
});

// ─── 유틸리티: 오버플로우 경고 ──────────────────────
const OverflowWarning = () => (
  <div style={{
    position: "absolute", bottom: "10px", right: "10px",
    backgroundColor: "#ff4d4f", color: "white", padding: "4px 8px",
    borderRadius: "4px", fontSize: "12px", fontWeight: "bold", zIndex: 100,
    boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
  }}>
    ⚠ CONTENT OVERFLOW
  </div>
);

// 1. Headline
export const HeadlineTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.headline;
  return (
    <div style={containerStyle(data.backgroundColor || COLORS.background)}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {data.subtitle && <div style={{ ...tokens.subtitle, marginBottom: "16px" }}>{data.subtitle}</div>}
        <h1 style={{ color: COLORS.primary, ...tokens.title, wordBreak: "keep-all" }}>{data.title}</h1>
        {data.body && <p style={{ ...tokens.body, marginTop: "24px" }}>{data.body}</p>}
      </div>
    </div>
  );
};

// 2. Text Block
export const TextBlockTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.text_block;
  return (
    <div style={containerStyle()}>
      <h2 style={{ color: COLORS.primary, ...tokens.title, marginBottom: "32px" }}>{data.title}</h2>
      <div style={{ color: COLORS.secondary, ...tokens.body, whiteSpace: "pre-wrap" }}>{data.body}</div>
    </div>
  );
};

// 3. List (Fixed Design Tokens)
export const ListTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.list;
  const itemCount = data.items?.length || 0;
  
  // 4개 초과 시 2열 그리드 전환 (폰트 크기는 고정)
  const isGrid = itemCount > 4;

  return (
    <div style={containerStyle()}>
      <h2 style={{ color: COLORS.primary, ...tokens.title, marginBottom: "40px" }}>{data.title}</h2>
      <div style={{ 
        display: isGrid ? "grid" : "flex",
        gridTemplateColumns: isGrid ? "1fr 1fr" : "none",
        flexDirection: isGrid ? "initial" : "column",
        gap: tokens.gap,
        flex: 1
      }}>
        {data.items?.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div style={{ 
              width: "42px", height: "42px", borderRadius: "50%", 
              backgroundColor: COLORS.accent, color: "#fff", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              flexShrink: 0, fontWeight: "bold", fontSize: "20px" 
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.primary, ...tokens.itemTitle }}>{item.title}</div>
              {item.desc && <div style={{ color: COLORS.secondary, ...tokens.itemDesc, marginTop: "4px" }}>{item.desc}</div>}
            </div>
          </div>
        ))}
      </div>
      {/* 분할 로직에도 불구하고 물리적으로 넘치면 경고 (예: 제목이 너무 긴 경우 등) */}
      {itemCount > 5 && <OverflowWarning />}
    </div>
  );
};

// 4. Compare
export const CompareTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.compare;
  return (
    <div style={{ ...containerStyle(), padding: 0 }}>
      <div style={{ padding: `40px ${COMMON.padding} 20px`, textAlign: "center" }}>
        <h2 style={{ color: COLORS.primary, fontSize: "32px", fontWeight: "700" }}>{data.title}</h2>
      </div>
      <div style={{ flex: 1, display: "flex" }}>
        {data.items?.slice(0, 2).map((item, i) => (
          <div key={i} style={{ 
            flex: 1, padding: "40px", 
            backgroundColor: i === 1 ? `${COLORS.accent}08` : "transparent",
            borderRight: i === 0 ? `1px solid ${COLORS.background}` : "none", 
            display: "flex", flexDirection: "column", justifyContent: "center" 
          }}>
            <div style={{ 
              color: i === 0 ? COLORS.secondary : COLORS.accent, 
              ...tokens.label, marginBottom: "16px", textTransform: "uppercase" 
            }}>
              {i === 0 ? "AS-IS" : "TO-BE"}
            </div>
            <div style={{ color: COLORS.primary, ...tokens.title, marginBottom: "12px" }}>{item.title}</div>
            <div style={{ color: COLORS.secondary, ...tokens.body }}>{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Card Group (Fixed Design Tokens)
export const CardGroupTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.card_group;
  const itemCount = data.items?.length || 0;
  
  return (
    <div style={containerStyle(COLORS.background)}>
      <h2 style={{ color: COLORS.primary, ...tokens.title, marginBottom: "32px", textAlign: "center" }}>{data.title}</h2>
      <div style={{ 
        display: "flex", 
        flexDirection: "column",
        gap: tokens.gap,
        flex: 1
      }}>
        {data.items?.map((item, i) => (
          <div key={i} style={{ 
            backgroundColor: COLORS.surface, 
            padding: tokens.padding, 
            borderRadius: "20px", 
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            display: "flex", alignItems: "center", gap: "20px"
          }}>
            <div style={{ color: COLORS.accent, fontSize: "32px", flexShrink: 0 }}>{item.icon || "✦"}</div>
            <div>
              <div style={{ color: COLORS.primary, ...tokens.cardTitle, marginBottom: "4px" }}>{item.title}</div>
              <div style={{ color: COLORS.secondary, ...tokens.cardDesc }}>{item.desc}</div>
            </div>
          </div>
        ))}
      </div>
      {itemCount > 3 && <OverflowWarning />}
    </div>
  );
};

// 6. Step Flow
export const StepFlowTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.step_flow;
  return (
    <div style={containerStyle()}>
      <h2 style={{ color: COLORS.primary, ...tokens.title, marginBottom: "48px" }}>{data.title}</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: tokens.gap }}>
        {data.items?.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "24px", position: "relative" }}>
            <div style={{ 
              width: "48px", height: "48px", borderRadius: "14px", 
              backgroundColor: COLORS.primary, color: "#fff", 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontWeight: "bold", fontSize: "20px", zIndex: 2 
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: COLORS.primary, ...tokens.stepText }}>{item.title}</div>
              {item.desc && <div style={{ color: COLORS.secondary, ...tokens.stepDesc, marginTop: "4px" }}>{item.desc}</div>}
            </div>
            {i < (data.items?.length || 0) - 1 && (
              <div style={{ 
                position: "absolute", left: "23px", top: "48px", 
                width: "2px", height: tokens.gap, 
                backgroundColor: COLORS.background, zIndex: 1 
              }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 7. Highlight Box
export const HighlightBoxTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.highlight_box;
  return (
    <div style={{ ...containerStyle(), alignItems: "center", justifyContent: "center" }}>
      <div style={{ 
        backgroundColor: COLORS.background, 
        padding: "60px", borderRadius: "40px", 
        textAlign: "center", border: `2px solid ${COLORS.accent}`,
        maxWidth: "90%"
      }}>
        <h2 style={{ color: COLORS.primary, ...tokens.title }}>{data.title}</h2>
        {data.body && <p style={{ color: COLORS.secondary, ...tokens.body, marginTop: "24px" }}>{data.body}</p>}
      </div>
    </div>
  );
};

// 8. Data Metric
export const DataMetricTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.data_metric;
  return (
    <div style={{ ...containerStyle(COLORS.primary), alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div style={{ color: COLORS.accent, ...tokens.label, marginBottom: "20px", textTransform: "uppercase" }}>{data.subtitle || "KEY METRIC"}</div>
      <div style={{ ...tokens.number, color: COLORS.surface }}>{data.title}</div>
      <div style={{ ...tokens.subtitle, color: COLORS.surface, marginTop: "24px", opacity: 0.8 }}>{data.body}</div>
    </div>
  );
};

// 9. Quote
export const QuoteTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.quote;
  return (
    <div style={{ ...containerStyle(COLORS.background), justifyContent: "center" }}>
      <div style={{ fontSize: "120px", color: COLORS.accent, lineHeight: "0", marginBottom: "40px", opacity: 0.25 }}>“</div>
      <h2 style={{ color: COLORS.primary, ...tokens.text, fontStyle: "italic" }}>{data.title}</h2>
      <div style={{ marginTop: "40px", display: "flex", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "48px", height: "2px", backgroundColor: COLORS.accent }} />
        <div style={{ color: COLORS.secondary, ...tokens.source, fontWeight: "bold" }}>{data.subtitle || "Anonymous"}</div>
      </div>
    </div>
  );
};

// 10. Media
export const MediaTemplate: React.FC<TemplateProps> = ({ data }) => {
  const tokens = LAYOUT_TOKENS.media;
  return (
    <div style={{ height: "100%", width: "100%", position: "relative", backgroundColor: COLORS.primary, overflow: "hidden" }}>
      {data.media.urls[0] && (
        <img src={data.media.urls[0]} alt="Media" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      <div style={{ 
        position: "absolute", bottom: 0, left: 0, right: 0, 
        padding: COMMON.padding, 
        background: "linear-gradient(transparent, rgba(0,0,0,0.85))",
        color: "#fff",
        letterSpacing: COMMON.letterSpacing,
        fontFamily: COMMON.fontFamily
      }}>
        <h2 style={{ ...tokens.title, color: "#fff" }}>{data.title}</h2>
        {data.body && <p style={{ ...tokens.body, color: "rgba(255,255,255,0.8)", marginTop: "16px" }}>{data.body}</p>}
      </div>
    </div>
  );
};

// 메인 렌더러
export const SlideDataRenderer: React.FC<TemplateProps> = ({ data }) => {
  switch (data.layout) {
    case "headline": return <HeadlineTemplate data={data} />;
    case "text_block": return <TextBlockTemplate data={data} />;
    case "list": return <ListTemplate data={data} />;
    case "compare": return <CompareTemplate data={data} />;
    case "card_group": return <CardGroupTemplate data={data} />;
    case "step_flow": return <StepFlowTemplate data={data} />;
    case "highlight_box": return <HighlightBoxTemplate data={data} />;
    case "data_metric": return <DataMetricTemplate data={data} />;
    case "quote": return <QuoteTemplate data={data} />;
    case "media": return <MediaTemplate data={data} />;
    default: return <HeadlineTemplate data={data} />;
  }
};
