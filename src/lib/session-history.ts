import { readDataSafe, writeData } from "./data";

// 유지할 최대 대화 턴 수 (user + assistant 쌍)
// 예: MAX_TURNS=2 → 최대 4개 메시지만 히스토리에 포함
const MAX_TURNS = 2;

export interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

interface SessionFile {
  messages: HistoryMessage[];
}

function sessionFilename(carouselId: string): string {
  return `sessions/${carouselId}.json`;
}

/** 캐러셀의 대화 히스토리 로드 (없으면 빈 배열 반환) */
export async function loadHistory(carouselId: string): Promise<HistoryMessage[]> {
  const data = await readDataSafe<SessionFile>(sessionFilename(carouselId), {
    messages: [],
  });
  return data.messages;
}

/** 대화 히스토리 저장: MAX_TURNS 쌍 초과분은 오래된 것부터 제거 */
export async function saveHistory(
  carouselId: string,
  messages: HistoryMessage[]
): Promise<void> {
  // user/assistant 쌍 단위로 자르기 위해 항상 짝수로 trim
  const limit = MAX_TURNS * 2;
  const trimmed = messages.slice(-limit);
  await writeData<SessionFile>(sessionFilename(carouselId), {
    messages: trimmed,
  });
}

/** 대화 히스토리 초기화 (새 캐러셀 시작 시) */
export async function clearHistory(carouselId: string): Promise<void> {
  await writeData<SessionFile>(sessionFilename(carouselId), { messages: [] });
}
