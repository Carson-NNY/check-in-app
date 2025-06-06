import styles from "../.././page.module.css";
import { fetchParticipantByEventId } from "@/services/participants";
import EventParticipantList from "@/components/EventParticipantList/EventParticipantList";

export default async function EventParticipants({
  params,
}: {
  params: { id: string };
}) {
  const { id: eventId } = await params;
  if (!eventId) {
    return <h1 className={styles.page}>Error: Event ID is required.</h1>;
  }

  const data = await fetchParticipantByEventId(eventId);

  return (
    <div className={styles.page}>
      <h1>Event Participants</h1>
      <div>Event ID: {eventId}</div>
      <EventParticipantList participantList={data} />
    </div>
  );
}
