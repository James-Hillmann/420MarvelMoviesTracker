import { NextRequest, NextResponse } from "next/server";
import { profileById } from "@/lib/profiles";
import { getWatched, setWatched, storageKind } from "@/lib/progressStore";
import { entryById } from "@/lib/timeline";

export async function GET(req: NextRequest) {
  const profile = profileById(req.nextUrl.searchParams.get("profile"));
  if (!profile) return NextResponse.json({ error: "unknown profile" }, { status: 400 });
  const watched = await getWatched(profile.id);
  return NextResponse.json({ watched, storage: storageKind() }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as
    | { profile?: string; id?: string; watched?: boolean }
    | null;
  const profile = profileById(body?.profile);
  if (!profile || !body?.id || typeof body.watched !== "boolean" || !entryById(body.id)) {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  const watched = await setWatched(profile.id, body.id, body.watched);
  return NextResponse.json({ watched, storage: storageKind() });
}
