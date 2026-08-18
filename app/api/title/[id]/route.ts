import { NextRequest, NextResponse } from "next/server";
import { fetchTitleInfo } from "@/lib/tmdb";
import { entryById } from "@/lib/timeline";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const entry = entryById(id);
  if (!entry) return NextResponse.json({ error: "unknown title" }, { status: 404 });
  const info = await fetchTitleInfo(entry);
  return NextResponse.json(info);
}
