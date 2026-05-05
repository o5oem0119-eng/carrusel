import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { buildSystemPrompt } from "@/lib/chat-system-prompt";
import { getBrand } from "@/lib/brand";
import { getCarousel } from "@/lib/carousels";
import { getPreset } from "@/lib/style-presets";
import { loadHistory, saveHistory } from "@/lib/session-history";
import { splitSlideData } from "@/lib/split-slide-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ─────────────────────────────────────────────
// Tool 정의
// ─────────────────────────────────────────────
const TOOLS: OpenAI.Responses.Tool[] = [
  {
    type: "function",
    name: "create_slides_batch",
    description:
      "슬라이드를 한 번에 여러 개 생성합니다. 초기 캐러셀 제작 시 반드시 이 함수를 사용하세요.",
    parameters: {
      type: "object",
      properties: {
        slides: {
          type: "array",
          description: "생성할 슬라이드 데이터 목록",
          items: {
            type: "object",
            properties: {
              type: { type: "string", enum: ["thumbnail", "content", "cta"] },
              layout: { type: "string", enum: ["headline", "text_block", "list", "compare", "card_group", "step_flow", "highlight_box", "data_metric", "quote", "media"] },
              title: { type: "string" },
              subtitle: { type: "string" },
              body: { type: "string" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    desc: { type: "string" },
                    icon: { type: "string" }
                  },
                  required: ["title"]
                }
              },
              media: {
                type: "object",
                properties: {
                  layout: { type: "string", enum: ["none", "full", "single", "collage_2", "collage_3"] },
                  urls: { type: "array", items: { type: "string" } }
                }
              }
            },
            required: ["type", "layout", "title", "media"],
            additionalProperties: false
          }
        },
      },
      required: ["slides"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function",
    name: "update_slide",
    description: "슬라이드 데이터를 수정합니다.",
    parameters: {
      type: "object",
      properties: {
        slideId: { type: "string" },
        slideData: {
          type: "object",
          properties: {
            type: { type: "string" },
            layout: { type: "string" },
            title: { type: "string" },
            subtitle: { type: "string" },
            body: { type: "string" },
            items: { type: "array", items: { type: "object", properties: { title: { type: "string" }, desc: { type: "string" } } } },
            media: { type: "object", properties: { layout: { type: "string" }, urls: { type: "array", items: { type: "string" } } } }
          }
        }
      },
      required: ["slideId", "slideData"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function",
    name: "delete_slide",
    description: "슬라이드를 삭제합니다.",
    parameters: {
      type: "object",
      properties: {
        slideId: { type: "string" },
      },
      required: ["slideId"],
      additionalProperties: false,
    },
    strict: true,
  },
  {
    type: "function",
    name: "save_caption",
    description: "인스타그램 캡션과 해시태그를 저장합니다.",
    parameters: {
      type: "object",
      properties: {
        caption: { type: "string" },
        hashtags: { type: "array", items: { type: "string" } },
      },
      required: ["caption", "hashtags"],
      additionalProperties: false,
    },
    strict: true,
  },
];

// ─────────────────────────────────────────────
// Tool 실행
// ─────────────────────────────────────────────
async function executeTool(
  name: string,
  args: Record<string, unknown>,
  carouselId: string
): Promise<string> {
  const base = `http://localhost:${process.env.PORT ?? 3000}`;

  try {
    switch (name) {
      case "create_slides_batch": {
        const slides = args.slides as any[];
        const results: string[] = [];
        
        // 모든 슬라이드를 먼저 분할 처리
        const processedSlides = slides.flatMap(s => splitSlideData(s));

        for (const slideData of processedSlides) {
          const res = await fetch(
            `${base}/api/carousels/${carouselId}/slides`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slideData, notes: slideData.title }),
            }
          );
          if (!res.ok) {
            results.push(`Error: ${res.status}`);
          } else {
            const data = await res.json();
            results.push(data.id);
          }
        }
        return JSON.stringify({ created: results });
      }

      case "get_slide_html": {
        // 슬라이드 HTML 조회 (수정 전 현재 상태 확인용)
        const res = await fetch(
          `${base}/api/carousels/${carouselId}`
        );
        if (!res.ok) return `Error: ${res.status}`;
        const carousel = await res.json();
        const slide = carousel.slides?.find(
          (s: { id: string }) => s.id === args.slideId
        );
        if (!slide) return "Slide not found";
        return JSON.stringify({ html: slide.html });
      }

      case "update_slide": {
        const res = await fetch(
          `${base}/api/carousels/${carouselId}/slides/${args.slideId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ slideData: args.slideData }),
          }
        );
        if (!res.ok) return `Error: ${res.status}`;
        return JSON.stringify({ success: true });
      }

      case "delete_slide": {
        const res = await fetch(
          `${base}/api/carousels/${carouselId}/slides/${args.slideId}`,
          { method: "DELETE" }
        );
        if (!res.ok) return `Error: ${res.status}`;
        return JSON.stringify({ success: true });
      }

      case "save_caption": {
        const res = await fetch(
          `${base}/api/carousels/${carouselId}/caption`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              caption: args.caption,
              hashtags: args.hashtags,
            }),
          }
        );
        if (!res.ok) return `Error: ${res.status}`;
        return JSON.stringify({ success: true });
      }

      default:
        return `Unknown tool: ${name}`;
    }
  } catch (err) {
    return `Execution error: ${(err as Error).message}`;
  }
}

// ─────────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY가 설정되지 않았습니다. .env.local을 확인하세요." },
      { status: 503 }
    );
  }

  let body: {
    message?: string;
    sessionId?: string;
    carouselId?: string;
    stylePresetId?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { message, carouselId, stylePresetId } = body;

  if (!message || typeof message !== "string" || !message.trim() || message.length > 10000) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }
  if (!carouselId) {
    return NextResponse.json({ error: "carouselId is required" }, { status: 400 });
  }

  // 컨텍스트 수집
  const [brand, carousel, stylePreset, history] = await Promise.all([
    getBrand(),
    getCarousel(carouselId),
    stylePresetId ? getPreset(stylePresetId) : Promise.resolve(null),
    loadHistory(carouselId),
  ]);

  const systemPrompt = buildSystemPrompt(brand, carousel, stylePreset);
  const model = process.env.OPENAI_MODEL ?? "gpt-5.4";

  // 서버 히스토리(최근 N턴) + 새 메시지로 input 구성
  // previous_response_id 없이 직접 messages 배열 전달 → 컨텍스트 크기 제어 가능
  const inputMessages: OpenAI.Responses.ResponseInput = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: string) => {
        try {
          controller.enqueue(encoder.encode(data));
        } catch {
          // 이미 닫힌 스트림 무시
        }
      };

      // 히스토리에 저장할 AI 응답 텍스트 누적
      let assistantText = "";

      try {
        let currentInput = inputMessages;

        // Tool call 처리 루프
        while (true) {
          const response = await openai.responses.create({
            model,
            instructions: systemPrompt,
            input: currentInput,
            tools: TOOLS,
            stream: true,
          });

          const pendingCalls: Array<{
            callId: string;
            itemId: string;
            name: string;
            argsJson: string;
          }> = [];
          let hasToolCall = false;

          for await (const event of response) {
            // 텍스트 토큰 스트리밍
            if (event.type === "response.output_text.delta") {
              assistantText += event.delta;
              send(`data: ${JSON.stringify({ type: "token", text: event.delta })}\n\n`);
            }

            // Tool call 감지
            if (event.type === "response.output_item.added") {
              const item = event.item;
              if (item.type === "function_call") {
                hasToolCall = true;
                pendingCalls.push({
                  callId: item.call_id,
                  itemId: item.id ?? item.call_id,
                  name: item.name,
                  argsJson: "",
                });
              }
            }

            // Arguments 조각 수집
            if (event.type === "response.function_call_arguments.delta") {
              const call = pendingCalls.find((c) => c.itemId === event.item_id);
              if (call) call.argsJson += event.delta;
            }

            // Arguments 완성 → 실행
            if (event.type === "response.function_call_arguments.done") {
              const call = pendingCalls.find((c) => c.itemId === event.item_id);
              if (call) {
                let args: Record<string, unknown> = {};
                try {
                  args = JSON.parse(call.argsJson || "{}");
                } catch {
                  // 파싱 실패 시 빈 args
                }

                // 툴 실행 진행 상황 알림
                send(
                  `data: ${JSON.stringify({ type: "tool_call", tool: call.name })}\n\n`
                );

                const result = await executeTool(call.name, args, carouselId);
                // 결과를 임시 저장 (다음 turn input에 사용)
                call.argsJson = result;
              }
            }
          }

          // Tool call 없으면 루프 종료
          if (!hasToolCall || pendingCalls.length === 0) break;

          // Tool 결과를 다음 input으로 구성
          currentInput = [
            ...pendingCalls.map((c) => ({
              type: "function_call_output" as const,
              call_id: c.callId,
              output: c.argsJson,
            })),
          ];
        }

        // 대화 히스토리 저장 (user + assistant)
        const updatedHistory = [
          ...history,
          { role: "user" as const, content: message },
          { role: "assistant" as const, content: assistantText || "(tool calls completed)" },
        ];
        await saveHistory(carouselId, updatedHistory);

        send(`event: done\ndata: ${JSON.stringify({ sessionId: carouselId, exitCode: 0 })}\n\n`);
      } catch (err) {
        const e = err as Error;
        console.error("[chat] OpenAI API error", e.message);
        send(`event: error\ndata: ${JSON.stringify({ error: e.message })}\n\n`);
      } finally {
        try {
          controller.close();
        } catch {
          // 이미 닫힌 경우 무시
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
