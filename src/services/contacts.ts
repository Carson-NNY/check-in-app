// construct the URLs and headers
const CONTACT_CREATE_URL = process.env.CIVICRM_BASE_URL + "/Contact/create";
const CONTACT_GET_URL = process.env.CIVICRM_BASE_URL + "/Contact/get";
const PHONE_CREATE_URL = process.env.CIVICRM_BASE_URL + "/Phone/create";
const EMAIL_CREATE_URL = process.env.CIVICRM_BASE_URL + "/Email/create";
const API_KEY = process.env.CIVICRM_API_KEY || "";

const HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
};

// create a new contact
export async function createContact(data: {
  lastName: string;
  firstName: string;
  middleName: string;
  contactType: string;
  phoneNumber?: string;
  email?: string;
}) {
  //  first just create a new contact
  try {
    const res = await fetch(CONTACT_CREATE_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          values: {
            sort_name: `${data.lastName}, ${data.firstName} ${data.middleName}`,
            display_name: `${data.firstName} ${data.middleName} ${data.lastName}`,
            first_name: data.firstName,
            last_name: data.lastName,
            middle_name: data.middleName,
            contact_type: data.contactType,
            email_greeting_display: `Dear ${data.firstName}`,
            postal_greeting_display: `Dear ${data.firstName}`,
            addressee_display: `${data.firstName} ${data.lastName}`,
          },
        }),
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to create Contact", {
        cause: res.statusText,
      });
    }
    const payload = await res.json();
    return payload.values[0];
  } catch (error) {
    console.error("Error creating a Contact:", error);
    throw error;
  }
}

// fetch existing contact list by first and last name
export async function fetchContactListByName(
  firstName: string,
  lastName: string
) {
  try {
    const res = await fetch(CONTACT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: ["*", "phone_primary.phone", "email_primary.email"],
          where: [
            ["first_name", "=", firstName],
            ["last_name", "=", lastName],
          ],
        }),
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to fetch Contact by name", {
        cause: res.statusText,
      });
    }
    const payload = await res.json();
    if (payload.values && payload.values.length > 0) {
      // console.log("One existing contact fetched successfully:", payload.values);
      return Array.isArray(payload.values) ? payload.values : [];
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Contact by name:", error);
    throw error;
  }
}

// fetch existing contact by CiviCRM contact ID
export async function fetchContactById(contactId: string) {
  try {
    const res = await fetch(CONTACT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: ["*", "phone_primary.phone", "email_primary.email"],
          where: [["id", "=", contactId]],
        }),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch Contact by ID", {
        cause: res.statusText,
      });
    }
    const { values } = await res.json();
    return Array.isArray(values) && values.length > 0 ? values[0] : null;
  } catch (error) {
    console.error("Error fetching Contact by ID:", error);
    throw error;
  }
}

export async function createPhone(phoneNumber: string, contactId: string) {
  if (!phoneNumber || phoneNumber.trim() === "" || phoneNumber.length !== 10) {
    console.warn("No valid phone number provided, skipping phone creation.");
    return null;
  }

  // Format the phone number to remove non-numeric characters and format it as xxx-xxx-xxxx
  const formattedPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");
  const phoneData = {
    phone: formattedPhoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3"),
    phone_numeric: formattedPhoneNumber,
  };

  try {
    const res = await fetch(PHONE_CREATE_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          values: {
            phone_numeric: phoneData.phone_numeric, // raw phone number as 10 digits
            phone: phoneData.phone, // formatted phone number as xxx-xxx-xxxx
            contact_id: contactId,
            location_type_id: 3, // we assume 3 which is "Main" as the default location type
            is_primary: true, // set this phone as primary
          },
        }),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create Phone", {
        cause: res.statusText,
      });
    }

    const payload = await res.json();
    // console.log("raw phone payload:", payload);
    return payload.values[0];
  } catch (error) {
    console.error("Error creating Phone:", error);
    throw error;
  }
}

export async function createEmail(email: string, contactId: string) {
  if (!email || email.trim() === "") {
    console.warn("No valid email provided, skipping email creation.");
    return null;
  }

  try {
    const res = await fetch(EMAIL_CREATE_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          values: {
            email: email,
            contact_id: contactId,
            location_type_id: 3, // we assume 3 which is "Main" as the default location type1
            is_primary: true, // set this email as primary
          },
        }),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to create Email", {
        cause: res.statusText,
      });
    }

    const payload = await res.json();
    // console.log("raw email payload:", payload);
    return payload.values[0];
  } catch (error) {
    console.error("Error creating Email:", error);
    throw error;
  }
}
