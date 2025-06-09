//Custom logic for fetching events (with filters), make the server request here
export async function fetchEventsByDate(
  year: string,
  month?: string,
  day?: string
) {
  if (!year) return [];

  let path = `/api/events/${year}`;
  if (month) path += `/${month}`;
  if (day) path += `/${day}`;

  const response = await fetch(path);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Status: ${response.status}}, {cause: ${errorText}}`);
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
