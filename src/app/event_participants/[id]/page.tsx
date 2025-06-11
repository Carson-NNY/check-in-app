"use client";

import styles from "../.././page.module.css";
import EventParticipantList from "@/components/EventParticipantList/EventParticipantList";
import { useState, useEffect, useMemo } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "@/components/SearchBox/SearchBox";

export default function EventParticipants({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [eventId, setEventId] = useState<string | null>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);

  const displayedParticipants = useMemo(() => {
    if (debouncedSearch.trim() === "") return participants;

    const kw = debouncedSearch.toLowerCase();
    return participants.filter((participant) => {
      return (participant["contact_id.sort_name"] ?? "")
        .toLowerCase()
        .includes(kw);
    });
  }, [participants, debouncedSearch]);

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
        try {
          // make the API call from the server side
          const response = await fetch(`/api/eventParticipants/${eventId}`);
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Status: ${response.status}, Cause: ${errorText}`);
          }

          const data = await response.json();
          setParticipants(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error("Error fetching participants:", error);
          throw error;
        }
      } catch (err) {
        console.error("Error fetching participants:", err);
        setError("useEffect failed in event_participants/[id] — " + err);
      }
    };

    fetchData();
  }, [eventId]);

  return (
    <div className={styles.page}>
      <h2>
        Event Participants{" "}
        <span style={{ fontSize: "18px" }}>(Event ID: {eventId})</span>
      </h2>
      <SearchBox search={search} setSearch={setSearch} />
      <ErrorMessage error={error} setError={setError} />

      <EventParticipantList
        participantList={displayedParticipants}
        setError={setError}
        highlight={search}
      />
    </div>
  );
}
