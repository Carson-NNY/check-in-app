export async function fetchParticipantsByEventId(event_id: string) {
  if (!event_id) {
    throw new Error("Event ID is required");
  }

  try {
    const response = await fetch(`/api/eventParticipants/${event_id}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Status: ${response.status}, Cause: ${errorText}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw error;
  }
}
