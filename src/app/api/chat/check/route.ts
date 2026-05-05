import { NextResponse } from "next/server";

// Claude CLI 의존성 완전 제거
// OpenAI API 키 존재 여부로 가용성 체크
export async function GET() {
  const available = Boolean(process.env.OPENAI_API_KEY);
  return NextResponse.json({ available });
}
