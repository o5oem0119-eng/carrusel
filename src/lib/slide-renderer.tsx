import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SlideDataRenderer } from "@/components/editor/SlideDataRenderer";
import type { SlideData } from "@/types/slide-data";

/**
 * SlideData(JSON)를 정적 HTML 문자열로 변환합니다.
 * Puppeteer Export 및 하위 호환 렌더링에 사용됩니다.
 */
export function renderSlideDataToHtml(data: SlideData): string {
  try {
    // React 컴포넌트를 HTML 문자열로 변환
    const markup = renderToStaticMarkup(
      <div id="slide-root" style={{ width: "100%", height: "100%", overflow: "hidden" }}>
        <SlideDataRenderer data={data} />
      </div>
    );
    
    // 기본 스타일과 래퍼 포함
    return `
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        body, html { width: 100%; height: 100%; overflow: hidden; font-family: 'Pretendard', -apple-system, sans-serif; }
        #slide-root { width: 100%; height: 100%; }
      </style>
      ${markup}
    `;
  } catch (error) {
    console.error("Failed to render slide data to HTML:", error);
    return `<div style="padding: 20px; color: red;">Render Error: ${data.title}</div>`;
  }
}
