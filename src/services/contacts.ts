const CONTACT_CREATE_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Contact/create";

const CONTACT_GET_URL =
  "https://sandbox.momath.org/civicrm/ajax/api4/Contact/get";

const HEADER = {
  "Content-Type": "application/x-www-form-urlencoded",
  "X-Requested-With": "XMLHttpRequest",
};

const API_KEY = process.env.CIVICRM_API_KEY || "";

export async function createContact(data: {
  lastName: string;
  firstName: string;
  middleName: string;
  contactType: string;
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
    console.log("create a new Contact  successfully");
    return payload.values[0];
  } catch (error) {
    console.error("Error creating a Contact:", error);
    throw error;
  }
}

export async function fetchContactByName(firstName: string, lastName: string) {
  try {
    const res = await fetch(CONTACT_GET_URL, {
      method: "POST",
      headers: HEADER,
      body: new URLSearchParams({
        api_key: API_KEY,
        params: JSON.stringify({
          select: ["*"],
          where: [
            ["first_name", "=", firstName],
            ["last_name", "=", lastName],
          ],
          limit: 1,
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
      console.log(
        "One existing contact fetched successfully:",
        payload.values[0]
      );
      return payload.values[0]; // Return the contact details
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching Contact by name:", error);
    throw error;
  }
}
