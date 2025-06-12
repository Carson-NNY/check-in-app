const PARTICIPANT_GET_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Participant/get";
const PARTICIPANT_UPDATE_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Participant/update";

const HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
};

const API_KEY = process.env.CIVICRM_API_KEY || "";

// not currently used, but could be useful for other features
export async function fetchAllParticipants() {
  try {
    const res = await fetch(PARTICIPANT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: [
            "id",
            "event_id",
            "contact_id",
            "status_id:label",
            "register_date",
          ],
          limit: 20,
        }),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(
        `Failed to fetch participants: ${res.status} ${res.statusText}. ${errorText}`
      );
    }

    const data = await res.json();
    return data.values;
  } catch (error) {
    console.error("Error in fetchParticipants:", error);
    throw error;
  }
}

export async function fetchParticipantByEventId(eventId: any) {
  try {
    const res = await fetch(PARTICIPANT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: [
            "register_date",
            "source",
            "status_id:label", // Option transformations
            "contact_id.sort_name", // implicit join
          ],
          where: [["event_id", "=", eventId]],
          orderBy: { "contact_id.sort_name": "ASC" },
          limit: 20,
        }),
      }),
    });

    if (!res.ok) {
      throw new Error(
        "Failed to fetch participants (fetchParticipantByEventId)",
        {
          cause: res.statusText,
        }
      );
    }
    const data = await res.json();
    return data.values;
  } catch (error) {
    console.error("Error fetching participants by event ID:", error);
    throw error;
  }
}

// Note: the res reponded by server is always 200, even if the update failed
export async function updateParticipantStatusAttended(
  participantId: string,
  status: string
) {
  try {
    const res = await fetch(PARTICIPANT_UPDATE_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          where: [["id", "=", participantId]],
          values: {
            "status_id:name": status,
          },
        }),
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to update participant", {
        cause: res.statusText,
      });
    }
    const payload = await res.json();
    console.log("Updated participant status successfully:");
    return payload;
  } catch (error) {
    console.error("Error updating participant status:", error);
    throw error;
  }
}
