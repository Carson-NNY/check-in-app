// construct the URLs and headers
const EVENT_GET_URL = process.env.CIVICRM_BASE_URL + "/Event/get";
const API_KEY = process.env.CIVICRM_API_KEY || "";

const HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
};

// (not currently in use) Fetch existing events (limit 20)
export async function fetchEvents() {
  try {
    const res = await fetch(EVENT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: ["*"],
          limit: 20,
        }),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data", { cause: res.statusText });
    }

    const data = await res.json();
    return data.values;
  } catch (error) {
    console.error("Error in fetchEvents:", error);
    throw error;
  }
}

// Fetch existing events by date range (start, end in "YYYY-MM-DD" format)
export async function fetchEventsByDateRange(start: string, end: string) {
  try {
    const res = await fetch(EVENT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: ["*"],
          where: [
            ["start_date", ">=", `${start}`],
            ["end_date", "<", `${end}`],
          ],
        }),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch events by year", {
        cause: res.statusText,
      });
    }

    const data = await res.json();
    return data.values;
  } catch (error) {
    console.error("Error in fetchEventsByRange:", error);
    throw error;
  }
}
