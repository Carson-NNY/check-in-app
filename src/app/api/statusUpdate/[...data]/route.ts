import { NextRequest, NextResponse } from "next/server";
import { updateParticipantStatusAttended } from "@/services/participants";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ data: string[] }> }
): Promise<NextResponse> {
  const { data: segments } = await params;

  if (segments.length != 2) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const [participant_id, status] = segments;

  try {
    await updateParticipantStatusAttended(participant_id, status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in /api/statusUpdate/[...data]", error);
    return NextResponse.json(
      { error: "Failed to update participant status" },
      { status: 500 }
    );
  }
}
