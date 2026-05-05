import type { SlideData } from "@/types/slide-data";

/**
 * 슬라이드 데이터 분할 유틸리티
 */
export function splitSlideData(data: SlideData): SlideData[] {
  const MAX_LIST_ITEMS = 5;
  const MAX_CARD_ITEMS = 3;

  let itemsToSplit: any[] = [];
  let chunkSize = 0;

  if (data.layout === "list" && data.items && data.items.length > MAX_LIST_ITEMS) {
    itemsToSplit = data.items;
    chunkSize = MAX_LIST_ITEMS;
  } else if (data.layout === "card_group" && data.items && data.items.length > MAX_CARD_ITEMS) {
    itemsToSplit = data.items;
    chunkSize = MAX_CARD_ITEMS;
  } else {
    return [data]; // 분할 필요 없음
  }

  const chunks = chunkArray(itemsToSplit, chunkSize);
  const total = chunks.length;

  return chunks.map((chunk, index) => ({
    ...data,
    // (1/N) 형식 적용, 분할되었을 때만 붙임
    title: `${data.title} (${index + 1}/${total})`,
    items: chunk,
  }));
}

/**
 * 전체 슬라이드 개수를 체크하고 상한(13장)을 넘으면 자릅니다.
 */
export function guardSlideCount(
  newSlides: SlideData[],
  existingCount: number,
  maxTotal: number = 13
): { slides: SlideData[]; warning?: string } {
  const totalAfterAdding = existingCount + newSlides.length;

  if (totalAfterAdding <= maxTotal) {
    return { slides: newSlides };
  }

  // 넘치는 경우 자름
  const allowedNewCount = Math.max(0, maxTotal - existingCount);
  const truncatedSlides = newSlides.slice(0, allowedNewCount);

  return {
    slides: truncatedSlides,
    warning: "최대 13장 제한으로 인해 일부 내용이 제외되었습니다. 내용을 줄이거나 새 캐러셀로 나눠주세요."
  };
}

function chunkArray<T>(array: T[], size: number): T[][] {
  const results = [];
  for (let i = 0; i < array.length; i += size) {
    results.push(array.slice(i, i + size));
  }
  return results;
}
