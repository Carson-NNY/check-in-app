import { NextResponse } from "next/server";
import { fetchAllParticipantRoles } from "@/services/participants";

// API route to fetch all participant roles
export async function GET(): Promise<NextResponse> {
  try {
    const all_roles = await fetchAllParticipantRoles();
    if (!all_roles || all_roles.length === 0) {
      return NextResponse.json(
        { error: "No participant roles found." },
        { status: 404 }
      );
    }
    return NextResponse.json(all_roles, { status: 200 });
  } catch (error) {
    console.error("Error in /api/eventParticipants/[event_id]", error);
    return NextResponse.json(
      { error: `Error in /api/eventParticipants/[event_id] — ${error}` },
      { status: 500 }
    );
  }
}
