"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./Event.module.css";

export default function Event() {
  const [participants, setParticipants] = useState<any[]>([]);
  const router = useRouter();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <button onClick={() => router.push("/event_participants")}>QQ</button>
        {/* <div>
          data:
          {participants.map((p: any, i: number) => (
            <div key={i}>
              source: {p.source},<button>event_id: {p.event_id}</button>
            </div>
          ))}
        </div> */}
      </main>
    </div>
  );
}
