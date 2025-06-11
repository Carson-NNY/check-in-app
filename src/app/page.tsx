import styles from "./page.module.css";
import Events from "@/components/Event/Event";
import { fetchEvents } from "@/services/events";
import Image from "next/image";

export default async function Home() {
  // Fetch events data on the server side
  const events = await fetchEvents();

  return (
    <div className={styles.page}>
      <div className={styles.banner}>
        <Image
          src="/momath-logo.png"
          alt="MoMath Logo"
          width={400}
          height={400}
        />
      </div>

      <Events events={events} />
    </div>
  );
}
