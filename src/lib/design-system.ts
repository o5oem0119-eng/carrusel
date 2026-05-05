/**
 * 카드뉴스 디자인 시스템
 * 레이아웃별 고정 타이포그래피 및 스페이싱 상수
 */

// ─── 색상 ────────────────────────────────────
export const COLORS = {
  primary:    "#1A1A1A",
  secondary:  "#6B6B6B",
  accent:     "#3D7A5E",
  background: "#F5F1EA",
  surface:    "#FFFFFF",
};

// ─── 공통 규칙 (반드시 지켜야 할 최소 사양) ─────
export const COMMON = {
  padding:       "60px",
  borderRadius:  "24px",
  lineHeight:    "1.5",
  letterSpacing: "-0.02em",
  wordBreak:     "keep-all" as const,
  fontFamily:    "'Pretendard', 'Apple SD Gothic Neo', -apple-system, sans-serif",
};

// ─── 레이아웃별 타이포그래피 토큰 (고정값) ─────
export const LAYOUT_TOKENS = {
  headline: {
    title:    { fontSize: "72px",  fontWeight: "800", lineHeight: "1.1" },
    subtitle: { fontSize: "26px",  fontWeight: "400", color: COLORS.accent },
    body:     { fontSize: "24px",  fontWeight: "400", color: COLORS.secondary },
  },
  text_block: {
    title:  { fontSize: "40px",  fontWeight: "700", lineHeight: "1.2" },
    body:   { fontSize: "26px",  fontWeight: "400", lineHeight: "1.6" },
  },
  list: {
    title:     { fontSize: "36px",  fontWeight: "700" },
    itemTitle: { fontSize: "30px",  fontWeight: "600" },
    itemDesc:  { fontSize: "22px",  fontWeight: "400" },
    gap:       "18px",
    maxItems:  5, // AI 지시용 (렌더링은 유동적 처리)
  },
  compare: {
    label: { fontSize: "20px",  fontWeight: "700", letterSpacing: "0.05em" },
    title: { fontSize: "30px",  fontWeight: "700", lineHeight: "1.2" },
    body:  { fontSize: "22px",  fontWeight: "400", lineHeight: "1.5" },
  },
  card_group: {
    title:    { fontSize: "36px",  fontWeight: "700" },
    cardTitle:{ fontSize: "24px",  fontWeight: "700" },
    cardDesc: { fontSize: "18px",  fontWeight: "400", lineHeight: "1.4" },
    padding:  "28px",
    gap:      "20px",
    maxCards: 3,
  },
  step_flow: {
    title:    { fontSize: "36px",  fontWeight: "700" },
    stepText: { fontSize: "26px",  fontWeight: "600" },
    stepDesc: { fontSize: "20px",  fontWeight: "400" },
    gap:      "28px",
  },
  highlight_box: {
    title: { fontSize: "44px",  fontWeight: "800", lineHeight: "1.2" },
    body:  { fontSize: "26px",  fontWeight: "400", lineHeight: "1.5" },
  },
  data_metric: {
    number:   { fontSize: "80px",  fontWeight: "900", lineHeight: "1" },
    label:    { fontSize: "22px",  fontWeight: "600" },
    subtitle: { fontSize: "28px",  fontWeight: "400" },
  },
  quote: {
    text:   { fontSize: "36px",  fontWeight: "600", lineHeight: "1.4" },
    source: { fontSize: "22px",  fontWeight: "500" },
  },
  media: {
    title: { fontSize: "48px",  fontWeight: "800", lineHeight: "1.2" },
    body:  { fontSize: "24px",  fontWeight: "400" },
  },
} as const;
