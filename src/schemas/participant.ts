import { z } from "zod";

// Schema for new participant input
export const ParticipantSchema = z
  .object({
    eventId: z.string().nonempty("eventId is required"),
    status: z.enum(["Attended", "Registered", "No-show", "Cancelled"]),
    firstName: z.string().min(1, "firstName is required").max(50),
    lastName: z.string().min(1, "lastName is required").max(50),
    contactType: z
      .enum(["Individual", "Household", "Organization"])
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .length(10, "phoneNumber must be 10 digits")
      .optional()
      .or(z.literal("")),
    source: z.string().optional().or(z.literal("")),
  })
  .strict()
  .transform((data: any) => {
    // trim data
    for (const k of Object.keys(data) as (keyof typeof data)[]) {
      if (typeof data[k] === "string") data[k] = data[k].trim() as any;
    }
    return data;
  });

export type ParticipantInput = z.infer<typeof ParticipantSchema>;
