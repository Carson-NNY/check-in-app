import styles from "./page.module.css";
import Events from "@/components/Event/Event";
import { fetchEvents } from "@/services/events";

export default async function Home() {
  // Fetch events data on the server side
  const events = await fetchEvents();

  return (
    <div className={styles.page}>
      <Events events={events} />
    </div>
  );
}
