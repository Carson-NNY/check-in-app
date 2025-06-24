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
import { SkeletonCircle } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from "@chakra-ui/react";

export default function EventParticipants() {
  // Get eventId and eventTitle from the URL parameters
  const params = useParams();
  const rawId = params.id;
  const rawTitle = params.eventTitle;

  // Handle the case where params.id or params.eventTitle might be an array or undefined
  const eventId = Array.isArray(rawId) ? rawId[0] : rawId ?? "";
  const eventTitle = Array.isArray(rawTitle)
    ? rawTitle[0]
    : rawTitle
    ? decodeURIComponent(rawTitle)
    : "";

  const [participants, setParticipants] = useState<any[]>([]);
  const [checkedInParticipantCount, setCheckedInParticipantCount] =
    useState<number>(0);
  const [uncheckedInParticipantCount, setUncheckedInParticipantCount] =
    useState<number>(0);

  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  // we need to debounce the search input to avoid excessive filtering
  const debouncedSearch = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();

  // Filter participants based on the debounced search term
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

  // Update checked-in and unchecked-in counts whenever participants change
  useEffect(() => {
    if (participants.length === 0) return;
    setCheckedInParticipantCount(
      participants.filter((p) => p["status_id:label"] === "Attended").length
    );
    setUncheckedInParticipantCount(
      participants.filter((p) => p["status_id:label"] !== "Attended").length
    );
  }, [participants]);

  useEffect(() => {
    if (!eventId) return;
    const fetchData = async () => {
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
        {/* back bubtton */}
        <Button
          pattern="blueOutline"
          onClick={() => router.back()}
          blurBackground={true}
        >
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

        {/* display Total/Checked/Unchecked number and percentage */}
        <Box width="100%" display="flex" justifyContent="center" mb={4}>
          <StatGroup width="70%" maxWidth="600px">
            <Stat>
              <StatLabel>Total </StatLabel>

              {isLoading ? (
                <SkeletonCircle size="10" />
              ) : (
                <>
                  <StatNumber>{participants.length}</StatNumber>
                </>
              )}
            </Stat>

            <Stat>
              <StatLabel>Checked</StatLabel>
              {isLoading ? (
                <SkeletonCircle size="10" />
              ) : (
                <>
                  <StatNumber>{checkedInParticipantCount}</StatNumber>
                  <StatHelpText>
                    {checkedInParticipantCount / participants.length > 0.5 ? (
                      <>
                        <StatArrow type="increase" />
                        {(
                          (checkedInParticipantCount / participants.length) *
                          100
                        ).toFixed(0)}
                        %
                      </>
                    ) : (
                      <>
                        <StatArrow type="decrease" />
                        {(
                          (checkedInParticipantCount / participants.length) *
                          100
                        ).toFixed(0)}
                        %
                      </>
                    )}
                  </StatHelpText>
                </>
              )}
            </Stat>

            <Stat>
              <StatLabel>Unchecked</StatLabel>
              {isLoading ? (
                <SkeletonCircle size="10" />
              ) : (
                <>
                  <StatNumber>{uncheckedInParticipantCount}</StatNumber>
                  <StatHelpText>
                    {uncheckedInParticipantCount / participants.length > 0.5 ? (
                      <>
                        <StatArrow type="increase" />
                        {(
                          (uncheckedInParticipantCount / participants.length) *
                          100
                        ).toFixed(0)}
                        %
                      </>
                    ) : (
                      <>
                        <StatArrow type="decrease" />
                        {(
                          (uncheckedInParticipantCount / participants.length) *
                          100
                        ).toFixed(0)}
                        %
                      </>
                    )}
                  </StatHelpText>
                </>
              )}
            </Stat>
          </StatGroup>
        </Box>
      </div>

      {isLoading ? (
        <Skeleton count={20} height={30} duration={0.7} borderRadius={10} />
      ) : (
        <>
          <ErrorMessage error={error} setError={setError} />
          <EventParticipantList
            displayedParticipants={displayedParticipants}
            originalParticipantList={participants}
            setOriginalParticipantList={setParticipants}
            setError={setError}
            highlight={search}
            eventId={eventId || ""}
          />
        </>
      )}
    </div>
  );
}
