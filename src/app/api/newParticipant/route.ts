import { NextResponse } from "next/server";
import { createParticipant } from "@/services/participants";
import { ParticipantSchema } from "@/schemas/participant";

// API route to create a new participant
export async function POST(request: Request) {
  const json = await request.json();
  // Validate the JSON against the ParticipantSchema
  const result = ParticipantSchema.safeParse(json);

  if (!result.success) {
    // aggregate all Zod errors into one message
    const errorMessages = result.error.errors
      .map((e: any) => e.message)
      .join("; ");
    return NextResponse.json({ error: errorMessages }, { status: 400 });
  }

  try {
    const created = await createParticipant(result.data);
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("createParticipant failed:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
