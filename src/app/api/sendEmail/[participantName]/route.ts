import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade with STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ participantName: string }> }
) {
  const { participantName } = await params;

  try {
    // then when you need to send:
    const res = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: "gl2852@columbia.edu",
      subject: "Hello from Gmail SMTP",
      text: `This is a test, did you receive this email, ${participantName}?`,
    });
    if (res.accepted.length > 0) {
      console.log("Email sent successfully to:", res.accepted);
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
