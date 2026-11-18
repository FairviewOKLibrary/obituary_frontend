import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
const PERMITTED_PARAMS = new Set([
  "q", "name", "first_name", "last_name", "born", "death", "description", "location",
  "source", "limit", "offset",
]);

export async function GET(request: NextRequest) {
  const base = process.env.OBITUARY_API_URL || "http://localhost:3001";
  try {
    const endpoint = new URL("/obituary/search", base);
    request.nextUrl.searchParams.forEach((value, key) => {
      if (PERMITTED_PARAMS.has(key)) endpoint.searchParams.set(key, value);
    });
    const response = await fetch(endpoint, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12000),
    });
    const payload: unknown = await response.json();
    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "public, max-age=0, s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return NextResponse.json(
      { message: "The obituary collection is temporarily unavailable. Please try again shortly." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
