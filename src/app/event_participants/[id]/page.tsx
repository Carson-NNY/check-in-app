"use client";

import styles from "../.././page.module.css";
import EventParticipantList from "@/components/EventParticipantList/EventParticipantList";
import { fetchParticipantsByEventId } from "@/hooks/useParticipants";
import { useState, useEffect } from "react";

export default function EventParticipants({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setEventId(resolvedParams.id);
      } catch (err) {
        console.error("Error unwrapping params:", err);
        setError("Failed to resolve event ID.");
      }
    };

    unwrapParams();
  }, [params]);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        const data = await fetchParticipantsByEventId(eventId);
        console.log("Fetched participants:", data);
        setParticipants(data);
      } catch (err) {
        console.error("Error fetching participants:", err);
        setError("Failed to load participants.");
      }
    };

    fetchData();
  }, [eventId]);

  if (!eventId) {
    return <h1 className={styles.page}>Error: Event ID is required.</h1>;
  }

  return (
    <div className={styles.page}>
      <h1>Event Participants</h1>
      <div>Event ID: {eventId}</div>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <EventParticipantList participantList={participants} />
      )}
    </div>
  );
}
