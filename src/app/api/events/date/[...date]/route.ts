// src/app/api/events/[...date]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { fetchEventsByDateRange } from "@/services/events";

// API route to fetch events by date range
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ date: string[] }> }
): Promise<NextResponse> {
  const { date: segments } = await params;

  // If /api/events or /api/events/ (no segments)
  if (!segments || segments.length === 0) {
    return NextResponse.json({ error: "Year is required" }, { status: 400 });
  }

  if (segments.length > 3) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const [year, month, day] = segments;
  let start = "";
  let end = "";

  switch (segments.length) {
    case 1: {
      // /api/events/2025 → range = [2025-01-01, 2026-01-01)
      start = `${year}-01-01`;
      end = `${Number(year) + 1}-01-01`;
      break;
    }
    case 2: {
      // /api/events/2025/07 → range = [2025-07-01, 2025-08-01)
      const m = month.padStart(2, "0");
      start = `${year}-${m}-01`;

      const nextMonthNum = Number(month) === 12 ? 1 : Number(month) + 1;
      const nextYear = Number(month) === 12 ? Number(year) + 1 : Number(year);
      const nextMonth = String(nextMonthNum).padStart(2, "0");
      end = `${nextYear}-${nextMonth}-01`;
      break;
    }
    case 3: {
      // /api/events/2025/07/15 → range = [2025-07-15, 2025-07-16)
      const m = month.padStart(2, "0");
      const d = day.padStart(2, "0");
      start = `${year}-${m}-${d}`;

      const dateObj = new Date(`${year}-${m}-${d}T00:00:00Z`);
      dateObj.setUTCDate(dateObj.getUTCDate() + 1);
      const nextYearVal = dateObj.getUTCFullYear();
      const nextMonth = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
      const nextDay = String(dateObj.getUTCDate()).padStart(2, "0");
      end = `${nextYearVal}-${nextMonth}-${nextDay}`;
      break;
    }
  }

  try {
    const events = await fetchEventsByDateRange(start, end);
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in /api/events/[...date]", error);
    return NextResponse.json(
      { error: `Error in /api/events/[...date] — ${error}` },
      { status: 500 }
    );
  }
}
