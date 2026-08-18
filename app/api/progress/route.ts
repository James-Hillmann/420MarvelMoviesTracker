import { NextRequest, NextResponse } from "next/server";
import { getWatched, setWatched, storageKind } from "@/lib/progressStore";
import { entryById } from "@/lib/timeline";

export async function GET() {
  const watched = await getWatched();
  return NextResponse.json({ watched, storage: storageKind() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as { id?: string; watched?: boolean } | null;
  if (!body?.id || typeof body.watched !== "boolean" || !entryById(body.id)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const watched = await setWatched(body.id, body.watched);
  return NextResponse.json({ watched, storage: storageKind() });
}
