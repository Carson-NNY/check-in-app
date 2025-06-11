import { NextRequest, NextResponse } from "next/server";
import { fetchParticipantByEventId } from "@/services/participants";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
  const { event_id } = await params;

  if (!event_id) {
    return NextResponse.json(
      { error: "event_id is required" },
      { status: 400 }
    );
  }

  try {
    const participants = await fetchParticipantByEventId(event_id);
    return NextResponse.json(participants);
  } catch (error) {
    console.error("Error in /api/eventParticipants/[event_id]", error);
    return NextResponse.json(
      { error: `Error in /api/eventParticipants/[event_id] — ${error}` },
      { status: 500 }
    );
  }
}
