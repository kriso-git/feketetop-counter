import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const redis = Redis.fromEnv();
const KEY = "feketetop:counter";

export async function GET() {
  const value = (await redis.get<number>(KEY)) ?? 0;
  return NextResponse.json({ value });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { action?: string };
  let value: number;
  if (body.action === "increment") {
    value = await redis.incr(KEY);
  } else if (body.action === "decrement") {
    value = await redis.decr(KEY);
  } else if (body.action === "reset") {
    await redis.set(KEY, 0);
    value = 0;
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
  return NextResponse.json({ value });
}
