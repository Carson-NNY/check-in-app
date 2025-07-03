"use client";

import styles from "../../.././page.module.css";
import EventParticipantList from "@/components/EventParticipantList/EventParticipantList";
import { useState, useEffect, useMemo } from "react";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";
import useDebounce from "@/hooks/useDebounce";
import LocalSearchBox from "@/components/SearchBox/LocalSearchBox";
import LogoutButton from "@/components/Button/LogoutButton";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Box } from "@chakra-ui/react";
import Button from "@/components/Button/Button";
import { SkeletonCircle, Flex } from "@chakra-ui/react";
import ParticipantDrawer from "@/components/ParticipantDrawer";
import { useToast } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
  Button as ChakraButton,
  Text,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";

const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "No Admin Email Set";

// the page that shows the participants of a specific event
export default function EventParticipants() {
  // Get eventId and eventTitle from the URL parameters
  const params = useParams();
  const rawId = params.id;
  const rawTitle = params.eventTitle;

  const toast = useToast();
  const [isReportLoading, setIsReportLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  const [participantRoles, setParticipantRoles] = useState<any[]>([]);

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
          setError(`Status: ${response.status}, Cause: ${errorText}`);
          throw new Error(`Status: ${response.status}, Cause: ${errorText}`);
        }

        // flag the newly added participants so we know which ones we should send in an email
        const data = await response.json();
        const key = `newParticipants-${eventId}`;
        const newlyAddedIds = JSON.parse(localStorage.getItem(key) || "[]");
        const updatedData = data.map((participant: any) => ({
          ...participant,
          isNewlyAdded: newlyAddedIds.includes(participant.id),
        }));

        setParticipants(Array.isArray(updatedData) ? updatedData : []);
        const participantRolesResponse = await fetch("/api/roles");

        if (!participantRolesResponse.ok) {
          const errorText = await participantRolesResponse.text();
          setError(
            `Status: ${participantRolesResponse.status}, Cause: ${errorText}`
          );
          throw new Error(
            `Status: ${participantRolesResponse.status}, Cause: ${errorText}`
          );
        }

        const participantRoles = await participantRolesResponse.json();
        setParticipantRoles(participantRoles);
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

  const handleSendEmail = async () => {
    setIsReportLoading(true);
    const newlyAddedParticipants = participants.filter((p) => p.isNewlyAdded);
    if (!newlyAddedParticipants || newlyAddedParticipants.length === 0) {
      alert("No newly added participants to send email to.");
      return;
    }
    try {
      const res = await fetch("/api/sendEmail/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId,
          eventTitle,
          participants: newlyAddedParticipants,
        }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Status: ${res.status}, Cause: ${errorText}`);
      }
      const data = await res.json();
      toast({
        title: "Success!",
        description: `Newly added participants report has been sent to ${adminEmail} successfully.`,
        status: "success",
        duration: 3000, //  disappears after 3s
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.error("Error sending email:", error);
      toast({
        title: "Error",
        description: "Could not send report. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      onClose();
      setIsReportLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Box position="fixed" top={4} left={1} zIndex="overlay">
        {/* back bubtton */}
        <Button
          pattern="blueOutline"
          onClick={() => router.back()}
          blurBackground={true}
        >
          ← Home
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
        <Flex direction="column" gap={4} w="100%">
          <Popover
            isOpen={isOpen}
            onOpen={onOpen}
            onClose={onClose}
            placement="bottom"
            closeOnBlur={false}
          >
            <PopoverTrigger>
              <ChakraButton colorScheme="green" width={"100px"}>
                Report
              </ChakraButton>
            </PopoverTrigger>

            <PopoverContent p={4}>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader fontWeight="bold">Send Report?</PopoverHeader>

              <PopoverBody>
                <Text>
                  You’re about to send a report of newly added participants to{" "}
                  {adminEmail}.
                </Text>
              </PopoverBody>

              <PopoverFooter border="0" justifyContent="flex-end" pt={0}>
                <HStack spacing={2}>
                  <ChakraButton variant="outline" onClick={onClose}>
                    Cancel
                  </ChakraButton>
                  <ChakraButton
                    colorScheme="green"
                    onClick={handleSendEmail}
                    isLoading={isReportLoading}
                  >
                    Confirm
                  </ChakraButton>
                </HStack>
              </PopoverFooter>
            </PopoverContent>
          </Popover>

          <LocalSearchBox
            search={search}
            setSearch={setSearch}
            placeholder="Search by names"
          />
          <ParticipantDrawer
            eventId={eventId}
            participants={participants}
            setParticipants={setParticipants}
            participantRoles={participantRoles}
          />
        </Flex>

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
