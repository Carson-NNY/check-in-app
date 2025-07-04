import styles from "./page.module.css";
import Events from "@/components/Event/Event";
import Image from "next/image";

// the home page, calls the Events component to list all events
export default async function Home() {
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

      <Events />
    </div>
  );
}
