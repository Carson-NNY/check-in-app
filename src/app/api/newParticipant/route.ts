import { NextResponse } from "next/server";
import { createParticipant } from "@/services/participants";

export async function POST(request: Request) {
  const form = await request.formData();
  const participantInput = {
    eventId: form.get("eventId")?.toString() || "",
    status: form.get("status")?.toString() || "Attended",
    lastName: form.get("lastName")?.toString() || "",
    firstName: form.get("firstName")?.toString() || "",
    middleName: form.get("middleName")?.toString() || "",
    contactType: form.get("contactType")?.toString() || "",
    source: form.get("source")?.toString() || "",
  };

  //  check the required fields
  if (!participantInput.lastName || !participantInput.firstName) {
    return NextResponse.json(
      { error: "First and last name are required." },
      { status: 400 }
    );
  }

  // TODO: logic to validate the input data and check if the participant already exists

  try {
    const res = await createParticipant(participantInput);
    if (!res) {
      return NextResponse.json(
        { error: "Failed to create participant" },
        { status: 500 }
      );
    }
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Error in /api/newParticipant/route.ts:", error);
    return NextResponse.json(
      { error: "Failed to create new participant" },
      { status: 500 }
    );
  }
}
