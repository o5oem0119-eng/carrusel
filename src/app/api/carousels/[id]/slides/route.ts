import { NextResponse } from "next/server";
import { addSlide, reorderSlides, getCarousel } from "@/lib/carousels";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { html, notes, slideData } = body as { 
      html?: string; 
      notes?: string; 
      slideData?: any 
    };

    // 하위 호환성: HTML이 있거나, 새로운 방식인 slideData가 있어야 함
    if ((!html || typeof html !== "string") && !slideData) {
      return NextResponse.json(
        { error: "HTML content or slideData is required" },
        { status: 400 }
      );
    }

    const slide = await addSlide(id, html || "", notes, slideData);
    if (!slide) {
      return NextResponse.json(
        { error: "Carousel not found or max slides reached" },
        { status: 400 }
      );
    }
    return NextResponse.json(slide, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { slideIds } = body as { slideIds?: string[] };

    if (!Array.isArray(slideIds)) {
      return NextResponse.json(
        { error: "slideIds array is required" },
        { status: 400 }
      );
    }

    const success = await reorderSlides(id, slideIds);
    if (!success) {
      return NextResponse.json(
        { error: "Carousel not found or invalid slide IDs" },
        { status: 400 }
      );
    }

    const carousel = await getCarousel(id);
    return NextResponse.json({ slides: carousel?.slides ?? [] });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
