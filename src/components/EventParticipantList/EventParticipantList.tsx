"use client";

import { useState, useEffect, useRef } from "react";
import { HighlightComponent } from "../Highlight/Highlight";
import { useToast } from "@chakra-ui/react";
import Button from "../Button/Button";
import SortByLetter from "../Event/Sort/SortByLetter";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

type Participant = {
  displayedParticipants: any[];
  originalParticipantList: any[];
  setOriginalParticipantList: React.Dispatch<React.SetStateAction<any[]>>;
  setError: (error: string | null) => void;
  highlight: string;
  eventId: string;
};

type StatusEntry = {
  status: string;
  timestamp: number;
};

export default function EventParticipantList({
  displayedParticipants,
  originalParticipantList,
  setOriginalParticipantList,
  setError,
  highlight,
  eventId,
}: Participant) {
  // for toast notifications
  const toast = useToast();

  // cleanup previousStatuses entries older than 10 days in localStorage to prevent unbounded growth
  const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;

  const containerRef = useRef<HTMLDivElement>(null);

  // we use _setSortByX to avoid confusion with the setter functions we expose that also reset other sort states
  const [sortByFirstName, _setSortByFirstName] = useState<
    "ASC" | "DESC" | null
  >(null);
  const [sortByLastName, _setSortByLastName] = useState<"ASC" | "DESC" | null>(
    null
  );

  const [sortByStatus, _setSortByStatus] = useState<"ASC" | "DESC" | null>(
    null
  );

  // On init, load + prune anything > 30 days old
  const [previousStatuses, setPreviousStatuses] = useState<
    Record<string, StatusEntry>
  >(() => {
    if (typeof window === "undefined") return {};
    const saved = localStorage.getItem("previousStatuses");
    if (!saved) return {};

    const all: Record<string, StatusEntry> = JSON.parse(saved);
    const cutoff = Date.now() - TEN_DAYS;
    const pruned: Record<string, StatusEntry> = {};

    for (const [id, entry] of Object.entries(all)) {
      if (entry.timestamp >= cutoff) {
        pruned[id] = entry;
      }
    }
    // write the pruned result back so storage never grows unbounded
    localStorage.setItem("previousStatuses", JSON.stringify(pruned));
    return pruned;
  });

  // whenever update previousStatuses, re-persist it
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "previousStatuses",
        JSON.stringify(previousStatuses)
      );
    }
  }, [previousStatuses]);

  //  whenever any sort state changes, scroll the container to top
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sortByFirstName, sortByLastName, sortByStatus]);

  // API call to update participant status
  const handleUpdate = async (
    id: string,
    status: string,
    first_name: string,
    last_name: string,
    action: string
  ) => {
    try {
      const res = await fetch(`/api/statusUpdate/${id}/${status}`, {
        method: "POST",
      });
      if (!res.ok) {
        setError(`Failed to update status: ${res.statusText}`);
        throw new Error(`HTTP ${res.status}`);
      }
      // show success toast if successful
      toast({
        title: "Success!",
        description: `${first_name} ${last_name} has been ${action} successfully.`,
        status: "success",
        duration: 2000, //  disappears after 2s
        isClosable: true,
        position: "top",
      });
      return true;
    } catch (err) {
      setError(
        `${err}, Error updating check-in status in /api/statusUpdate/[...data]`
      );
      console.error(err);
      return false;
    }
  };

  // behave differently for undo and check-in, we use optimistic update here and would roll back if API fails
  const handleCheckInClick = async (participant: any) => {
    // remember the original list in case we need to revert when request fails
    // we only create a shallow copy of originalParticipantList here (prevOriginal), which is sufficient since the life cycle of the objects is limited to this function
    const prevOriginal = [...originalParticipantList];
    let newStatus: string;
    const oldStatus = participant["status_id:label"];

    if (oldStatus === "Attended") {
      newStatus = previousStatuses[participant.id]?.status || "Registered";
    } else {
      // stash the current status before changing it
      setPreviousStatuses((ps) => ({
        ...ps,
        [participant.id]: { status: oldStatus, timestamp: Date.now() },
      }));
      newStatus = "Attended";
    }

    const updatedParticipant = {
      ...participant,
      "status_id:label": newStatus,
    };

    const without = originalParticipantList.filter(
      (p) => p.id !== participant.id
    );

    // we want to move "Attended" to the end of the list, so that checked-in participants are grouped together at the bottom
    // this is a simple way without re-sorting the entire list
    // if reverting to previous status, we put the participant back to the top of the list
    const nextList =
      newStatus === "Attended"
        ? [...without, updatedParticipant]
        : [updatedParticipant, ...without];

    // Update state
    setOriginalParticipantList(nextList);

    // fire API call
    const isSuccess = await handleUpdate(
      participant.id,
      newStatus,
      participant["contact_id.first_name"],
      participant["contact_id.last_name"],
      newStatus === "Attended" ? "checked in" : "reverted to registered status"
    );

    if (isSuccess == true) {
      // remove the previous status from the record after reverting
      if (oldStatus === "Attended") {
        setPreviousStatuses((ps) => {
          const { [participant.id]: _, ...rest } = ps;
          return rest;
        });
      }
    } else {
      // revert state if error
      setOriginalParticipantList(prevOriginal);
    }
  };

  // - reset other sort states when one is set
  const setSortByFirstName = (o: "ASC" | "DESC" | null) => {
    _setSortByFirstName(o);
    if (o) {
      _setSortByLastName(null);
      _setSortByStatus(null);
    }
  };

  const setSortByLastname = (o: "ASC" | "DESC" | null) => {
    _setSortByLastName(o);
    if (o) {
      _setSortByFirstName(null);
      _setSortByStatus(null);
    }
  };

  const setSortByStatus = (o: "ASC" | "DESC" | null) => {
    _setSortByStatus(o);
    if (o) {
      _setSortByLastName(null);
      _setSortByFirstName(null);
    }
  };

  // format US phone numbers to xxx-xxx-xxxx
  const formatPhone = (usRaw: string) => {
    // strip out anything that isn’t a digit
    const digits = usRaw.replace(/\D/g, "");
    // format 10-digit numbers: 3-3-4
    if (digits.length === 10) {
      return digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    // fallback to whatever we got
    return usRaw;
  };

  return (
    <ul>
      <TableContainer
        maxH="800px"
        overflowY="auto"
        overflowX="hidden"
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
        ref={containerRef}
      >
        <Table variant="simple" maxHeight="400px">
          <Thead
            position="sticky"
            top={0}
            bg="whiteAlpha.900"
            backdropFilter="blur(4px)"
            boxShadow="sm"
          >
            <Tr>
              <Th>
                <SortByLetter
                  sortOrder={sortByFirstName}
                  setSortOrder={setSortByFirstName}
                  sortList={displayedParticipants}
                  setSortList={setOriginalParticipantList}
                  sortTarget="participantFirstName"
                >
                  First Name
                </SortByLetter>
              </Th>
              <Th>
                <SortByLetter
                  sortOrder={sortByLastName}
                  setSortOrder={setSortByLastname}
                  sortList={displayedParticipants}
                  setSortList={setOriginalParticipantList}
                  sortTarget="participantLastName"
                >
                  Last Name
                </SortByLetter>
              </Th>

              <Th>Phone</Th>
              <Th>
                <SortByLetter
                  sortOrder={sortByStatus}
                  setSortOrder={setSortByStatus}
                  sortList={displayedParticipants}
                  setSortList={setOriginalParticipantList}
                  sortTarget="participantStatus"
                >
                  currentStatus
                </SortByLetter>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {displayedParticipants.length === 0 ? (
              <Tr>
                <Td colSpan={3}>No participants found.</Td>
              </Tr>
            ) : (
              displayedParticipants.map((participant: any, index) => {
                const currentStatus = participant["status_id:label"];
                return (
                  <Tr key={index}>
                    <Td
                      maxW="200px"
                      width="140px"
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      <HighlightComponent
                        text={
                          participant["contact_id.first_name"]
                            ? participant["contact_id.first_name"]
                            : ""
                        }
                        highlight={highlight}
                      />
                    </Td>
                    <Td
                      maxW="200px"
                      width="140px"
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      <HighlightComponent
                        text={
                          participant["contact_id.last_name"]
                            ? participant["contact_id.last_name"]
                            : ""
                        }
                        highlight={highlight}
                      />
                    </Td>
                    <Td>
                      {participant["contact_id.phone_primary.phone"]
                        ? formatPhone(
                            participant["contact_id.phone_primary.phone"]
                          )
                        : "None"}
                    </Td>
                    <Td
                      maxW="180px"
                      width="180px"
                      whiteSpace="normal"
                      wordBreak="break-word"
                    >
                      {currentStatus}{" "}
                      {currentStatus === "Attended" ? (
                        <span>
                          <Button
                            pattern="grey"
                            onClick={() => handleCheckInClick(participant)}
                          >
                            &nbsp; Revert &nbsp;
                          </Button>
                        </span>
                      ) : (
                        <Button
                          pattern="green"
                          onClick={() => handleCheckInClick(participant)}
                        >
                          Check In
                        </Button>
                      )}
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </ul>
  );
}
