// src/app/api/events/[...date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchEventById } from "@/services/events";

// API route to fetch events by date range
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  const { eventId } = await params;

  // If /api/events or /api/events/ (no segments)
  if (!eventId) {
    return NextResponse.json(
      { error: "Event ID is missing or invalid event ID format" },
      { status: 400 }
    );
  }

  try {
    const event = await fetchEventById(eventId);
    console.log("Fetched event:", event);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Error in /api/events/[...date]", error);
    return NextResponse.json(
      { error: `Error in /api/events/[...date] — ${error}` },
      { status: 500 }
    );
  }
}
