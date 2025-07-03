import {
  fetchContactListByName,
  createContact,
  createPhone,
  createEmail,
  fetchContactById,
} from "./contacts";

// construct the URLs and headers
const PARTICIPANT_GET_URL = process.env.CIVICRM_BASE_URL + "/Participant/get";
const PARTICIPANT_UPDATE_URL =
  process.env.CIVICRM_BASE_URL + "/Participant/update";
const PARTICIPANT_CREATE_URL =
  process.env.CIVICRM_BASE_URL + "/Participant/create";

const HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
};

const API_KEY = process.env.CIVICRM_API_KEY || "";

const OPTION_VALUE_GET_URL = process.env.CIVICRM_BASE_URL + "/OptionValue/get";

export async function fetchAllParticipantRoles() {
  const res = await fetch(OPTION_VALUE_GET_URL, {
    method: "POST",
    headers: HEADER,
    body: new URLSearchParams({
      api_key: API_KEY,
      params: JSON.stringify({
        select: ["label"],
        where: [
          ["option_group_id.name", "=", "participant_role"], // filter by option group name
          ["is_active", "=", 1], // filter by active status
        ],
      }),
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Failed to fetch participant roles: ${res.status} ${res.statusText}\n${errorText}`
    );
  }

  const { values } = await res.json();
  return Array.isArray(values) ? values : [];
}

// Fetch all participants.  not currently used, but could be useful for other features
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

// Fetch participants by event ID
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
            "contact_id.phone_primary.phone", // nested implicit join
            "contact_id.email_primary.email", // nested implicit join
            // "contact_id.email_primary.email", // nested implicit join
            //   "*",
            //   "fee_level",
            //   "is_pay_later",
            //   "event_id.financial_type_id:name",
            //   "fee_amount",
            // "contact_id.first_name",
            // "contact_id.last_name",
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
    console.log(data.values);
    return data.values;
  } catch (error) {
    console.error("Error fetching participants by event ID:", error);
    throw error;
  }
}

// Fetch participants by event ID
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
            "contact_id.phone_primary.phone",
            "contact_id.email_primary.email",
            "role_id:name",
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

// Update participant status.
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

// Create a new participant.  If the contact does not exist, create a new contact first.
export async function createParticipant(data: {
  eventId: string;
  status: string;
  lastName: string;
  firstName: string;
  middleName: string;
  contactType: string;
  phoneNumber: string;
  email: string;
  source: string;
}) {
  try {
    // fetch the contact list by first and last name
    let contact = await handleContactFetchAndUpdate(data);

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
    console.log("Participant created successfully:", participant);
    return participant;
  } catch (error) {
    console.error("Error fetching contact by name:", error);
    throw error;
  }
}

/**
 * Returns the first contact whose phone or email matches,
 * or null if none found.
 */
const matchContactByPhoneOrEmail = (
  contactList: any[] | null | undefined,
  phoneNumber?: string,
  email?: string
): any | null => {
  const list = contactList ?? [];
  if (!phoneNumber && !email) {
    return list.length > 0 ? list[0] : null;
  }

  return (
    list.find(
      (contact) =>
        (phoneNumber && contact["phone_primary.phone"] === phoneNumber) ||
        (email && contact["email_primary.email"] === email)
    ) || null
  );
};

const getContactWithNoPhoneAndEmail = (
  contactList: any[] | null | undefined
): any | null => {
  const list = contactList ?? [];
  return (
    list.find(
      (contact) =>
        !contact["phone_primary.phone"] && !contact["email_primary.email"]
    ) || null
  );
};

async function handleContactFetchAndUpdate(data: {
  eventId: string;
  status: string;
  lastName: string;
  firstName: string;
  middleName: string;
  contactType: string;
  phoneNumber: string;
  email: string;
  source: string;
}) {
  // there might be multiple contacts with the same first and last name, so we need to fetch the contact list
  let contactList = await fetchContactListByName(data.firstName, data.lastName);

  let contact;
  // contact list exists: iterate through the list to check if any one of their phone number or email match
  //   1. if one of them match, update that contact's info and use that contact to create a new participant
  //   2. if none of them match, create a new contact and create a new phone and email
  // fetch the contact if either phone number or email matches
  console.log("data to be matched:", data);
  console.log("Contact list with the same name fetched:", contactList);

  // format the phone number and email
  const phone = data.phoneNumber?.trim() ?? "";
  const cleanedPhoneNumber = phone.replace(/[^0-9]/g, "");
  const formattedPhoneNumber = cleanedPhoneNumber.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "$1-$2-$3"
  );
  console.log("Formatted phone number:", formattedPhoneNumber);
  const email = data.email?.trim() ?? "";

  //  match the contact by phone or email, or return any of name-matching one contact if params of "phoneNumber" and "email" are both empty
  contact = matchContactByPhoneOrEmail(
    contactList,
    formattedPhoneNumber,
    email
  );

  console.log(
    "matching Contact with phone or email or when both params of these two are empty found???? :",
    contact
  );

  // contact does not exist:
  if (!contact) {
    //  though no matching contact found, but check if there is an existing contact with the same name but with empty phone and email
    // In this case, we can use that contact to update the phone and email without creating a duplicate contact
    contact = getContactWithNoPhoneAndEmail(contactList);
    console.log("Contact with no phone and email found22222:", contact);
    try {
      // only if in this case (no basic match), we will create a new contact
      if (!contact) {
        console.log("Contact not found, creating a new one...");
        contact = await createContact(data);
        console.log("Contact created successfully with ID:", contact.id);
      }
    } catch (error) {
      console.error("Error creating a Contact:", error);
      throw error;
    }
  }

  // here we have several cases:
  // 1. contact did not exist, and we have a newly created contact (contact without phone and email)
  // 2. contact exists, but with no phone and email
  // 3. contact exists with one of phone or email matches, but the other is empty or mismatched

  // separately creating contact and phone is fine, since when we create a phone with
  // corresponding contact_id, it will automatically update the contact's phone_primary (since phone.is_primary is true by default)
  // the same is true  when we create email

  let flag = 0;
  if (
    formattedPhoneNumber &&
    contact["phone_primary.phone"] !== formattedPhoneNumber
  ) {
    console.log("need to create a new phone for contact:", contact.id);
    await createPhone(data.phoneNumber, contact.id);
    flag = 1; // set flag to indicate that we have created a new phone
  }
  if (email && contact["email_primary.email"] !== email) {
    console.log("need to create a new email for contact:", contact.id);
    await createEmail(data.email, contact.id);
    flag = 1;
  }
  if (flag === 0) {
    console.log("contact with existing phone and email untouched~~~");
  }

  contact = await fetchContactById(contact.id);
  console.log("Contact updated with new phone and new email:", contact);

  return contact;
}
