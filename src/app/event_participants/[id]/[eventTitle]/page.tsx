"use client";

import styles from "../../.././page.module.css";
import EventParticipantList from "@/components/EventParticipantList/EventParticipantList";
import { useState, useEffect, useMemo } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useDebounce from "@/hooks/useDebounce";
import SearchBox from "@/components/SearchBox/SearchBox";
import LogoutButton from "@/components/Button/LogoutButton";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import Button from "@/components/Button/Button";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function EventParticipants() {
  const params = useParams();
  const rawId = params.id;
  const rawTitle = params.eventTitle;

  const eventId = Array.isArray(rawId) ? rawId[0] : rawId ?? "";
  const eventTitle = Array.isArray(rawTitle)
    ? rawTitle[0]
    : rawTitle
    ? decodeURIComponent(rawTitle)
    : "";

  const [participants, setParticipants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const debouncedSearch = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const displayedParticipants = useMemo(() => {
    if (debouncedSearch.trim() === "") return participants;

    const kw = debouncedSearch.toLowerCase();
    return participants.filter((participant) => {
      return (
        (participant["contact_id.first_name"] ?? "")
          .toLowerCase()
          .includes(kw) ||
        (participant["contact_id.last_name"] ?? "").toLowerCase().includes(kw)
      );
    });
  }, [participants, debouncedSearch]);

  useEffect(() => {
    if (!eventId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
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
        setError("useEffect failed in event_participants/[id] — " + error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [eventId]);

  return (
    <div className={styles.page}>
      <Box position="fixed" top={4} left={1} zIndex="overlay">
        <Button pattern="blueOutline" onClick={() => router.back()}>
          ← Back
        </Button>
      </Box>
      <LogoutButton />
      <div className={styles.banner}>
        <Image
          src="/momath-logo.png"
          alt="MoMath Logo"
          width={400}
          height={400}
        />
      </div>

      <h2 className={styles.eventTitle}>
        {eventTitle ? eventTitle : "Event Participants"}{" "}
        <span style={{ fontSize: "18px" }}>(Event ID: {eventId})</span>
      </h2>
      <div className={styles.searchBox}>
        <SearchBox
          search={search}
          setSearch={setSearch}
          placeholder="Search by names"
        />
      </div>

      {isLoading ? (
        <Skeleton count={20} height={30} duration={0.7} borderRadius={10} />
      ) : (
        <>
          <EventParticipantList
            participantList={displayedParticipants}
            setError={setError}
            highlight={search}
            eventId={eventId || ""}
          />
          <ErrorMessage error={error} setError={setError} />
        </>
      )}
    </div>
  );
}
