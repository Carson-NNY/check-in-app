import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { Parser } from "json2csv";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(request: Request) {
  const { eventId, eventTitle, participants } = await request.json();
  if (!Array.isArray(participants) || participants.length === 0) {
    return NextResponse.json(
      { error: "No participants provided" },
      { status: 400 }
    );
  }

  const fields = [
    { label: "First Name", value: "contact_id.first_name" },
    { label: "Last Name", value: "contact_id.last_name" },
    { label: "Phone", value: "contact_id.phone_primary.phone" },
    { label: "Email", value: "contact_id.email_primary.email" },
  ];
  const parser = new Parser({ fields });
  const csv = parser.parse(participants);

  // const lines = participants
  //   .map((p, index) => {
  //     const firstName = p["contact_id.first_name"] || "Unknown";
  //     const lastName = p["contact_id.last_name"] || "Unknown";
  //     const phone =
  //       p["contact_id.phone_primary.phone"] || "(No phone provided)";
  //     const email =
  //       p["contact_id.email_primary.email"] || "(No email provided)";
  //     return `${
  //       index + 1
  //     } - First Name: ${firstName} - Last Name: ${lastName} - Phone: ${phone} - Email: ${email}`;
  //   })
  //   .join("<br/>");

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  try {
    // then when you need to send:
    const res = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: `${participants.length} new participants added for ${eventTitle} - event id: (${eventId})`,
      text: `Hello! Please find attached the new participants CSV for event ${eventId}.`,
      attachments: [
        {
          filename: `NewParticipants-EventId(${eventId}).csv`,
          content: csv,
        },
      ],
      // text: `The following participants have been added:\n\n${lines}`,
      // html: `
      //   <p><strong>The following participants have been added:</strong></p>
      //   <p>${lines}</p>`,
    });

    if (res.accepted.length > 0) {
      return NextResponse.json(
        { message: "Email sent successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
