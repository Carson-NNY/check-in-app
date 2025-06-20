import { fetchContactByName, createContact } from "./contacts";

const PARTICIPANT_GET_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Participant/get";
const PARTICIPANT_UPDATE_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Participant/update";
const PARTICIPANT_CREATE_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Participant/create";

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

// if
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
            "contact_id",
            "status_id:label", // Option transformations
            "contact_id.first_name", // implicit join
            "contact_id.last_name", // implicit join
            "contact_id.phone_primary.phone_numeric", // nested implicit join
          ],
          where: [["event_id", "=", eventId]],
          orderBy: { "status_id:label": "DESC" },
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

export async function fetchParticipantById(participantId: string) {
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
            "status_id:label",
            "contact_id.sort_name",
            "contact_id.first_name",
            "contact_id.last_name",
          ],
          where: [["id", "=", participantId]],
        }),
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch participant by ID", {
        cause: res.statusText,
      });
    }
    const payload = await res.json();
    if (payload.values.length === 0) {
      console.warn(`No participant found with ID: ${participantId}`);
      return null;
    }
    return payload.values[0];
  } catch (error) {
    console.error("Error fetching participant by ID:", error);
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
    // console.log("Updated participant status successfully:", payload);
    return payload;
  } catch (error) {
    console.error("Error updating participant status:", error);
    throw error;
  }
}

export async function createParticipant(data: {
  eventId: string;
  status: string;
  lastName: string;
  firstName: string;
  middleName: string;
  contactType: string;
  source: string;
}) {
  // first check if the contact already exists
  try {
    let contact = await fetchContactByName(data.firstName, data.lastName);
    if (!contact) {
      //   create a new contact
      console.log("Contact not found, creating a new one...");
      try {
        contact = await createContact(data);
        console.log("Contact created with ID:", contact.id);
      } catch (error) {
        console.error("Error creating a Contact:", error);
        throw error;
      }
    }

    // create a new participant
    const res = await fetch(PARTICIPANT_CREATE_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          values: {
            event_id: data.eventId,
            contact_id: contact.id,
            "status_id:name": data.status,
            source: data.source,
            register_date: new Date().toISOString(),
          },
        }),
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to create participant", {
        cause: res.statusText,
      });
    }
    const payload = await res.json();
    if (payload.values == null || payload.values.length === 0) {
      console.warn("No participant created.");
      return null;
    }
    // get the participant by ID with the fields we need. i.e. "status_id:label", "contact_id.sort_name".  (can not do this during creation)
    const participant = await fetchParticipantById(payload.values[0].id);
    return participant;
  } catch (error) {
    console.error("Error fetching contact by name:", error);
    throw error;
  }
}
