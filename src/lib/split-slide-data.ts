import type { SlideData } from "@/types/slide-data";

/**
 * 슬라이드 데이터 분할 유틸리티
 * 디자인 시스템의 한계를 넘는 데이터를 여러 슬라이드로 나눕니다.
 */
export function splitSlideData(data: SlideData): SlideData[] {
  const MAX_LIST_ITEMS = 5;
  const MAX_CARD_ITEMS = 3;

  // 1. List 분할 (5개 초과 시)
  if (data.layout === "list" && data.items && data.items.length > MAX_LIST_ITEMS) {
    const chunks = chunkArray(data.items, MAX_LIST_ITEMS);
    return chunks.map((chunk, index) => ({
      ...data,
      title: index === 0 ? data.title : `${data.title} (계속)`,
      items: chunk,
    }));
  }

  // 2. Card Group 분할 (3개 초과 시)
  if (data.layout === "card_group" && data.items && data.items.length > MAX_CARD_ITEMS) {
    const chunks = chunkArray(data.items, MAX_CARD_ITEMS);
    return chunks.map((chunk, index) => ({
      ...data,
      title: index === 0 ? data.title : `${data.title} (계속)`,
      items: chunk,
    }));
  }

  // 분할 필요 없음
  return [data];
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const results = [];
  for (let i = 0; i < array.length; i += size) {
    results.push(array.slice(i, i + size));
  }
  return results;
}
