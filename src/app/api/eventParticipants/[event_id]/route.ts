// src/app/api/events/[...date]/route.ts
import { NextResponse } from "next/server";
import { fetchParticipantByEventId } from "@/services/participants";

export async function GET(
  request: Request,
  context: { params: { event_id: string } }
) {
  const { event_id } = await context.params;

  if (!event_id) {
    return NextResponse.json(
      { error: "event_id is required" },
      { status: 400 }
    );
  }

  try {
    const participants = await fetchParticipantByEventId(event_id);
    // console.log("Fetched participants:", participants);
    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error in /api/eventParticipants/[event_id]", error);
    return NextResponse.json(
      { error: `Error in /api/eventParticipants/[event_id] — ${error}` },
      { status: 500 }
    );
  }
}
