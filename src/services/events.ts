const EVENT_GET_URL = "https://sandbox.momath.org/civicrm/ajax/api4/Event/get";
const HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
};
const API_KEY = "ohblAgjeXw7tEVrO0pGZSoi6bxyfb";

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

export async function fetchEventsByRange(start: string, end: string) {
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
          limit: 100,
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
