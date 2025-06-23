"use client";

import { useState } from "react";
import { HighlightComponent } from "../Highlight/Highlight";
import ParticipantDrawer from "../ParticipantDrawer";
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
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

type Participant = {
  participantList: any[];
  originalParticipantList: any[];
  setParticipantList: React.Dispatch<React.SetStateAction<any[]>>;
  setError: (error: string | null) => void;
  highlight: string;
  eventId: string;
};

export default function EventParticipantList({
  participantList,
  originalParticipantList,
  setParticipantList,
  setError,
  highlight,
  eventId,
}: Participant) {
  const toast = useToast();

  const [sortByFirstName, _setSortByFirstName] = useState<
    "ASC" | "DESC" | null
  >(null);
  const [sortByLastName, _setSortByLastName] = useState<"ASC" | "DESC" | null>(
    null
  );

  const [sortByStatus, _setSortByStatus] = useState<"ASC" | "DESC" | null>(
    null
  );

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
      toast({
        title: "Success!",
        description: `${first_name} ${last_name} has been ${action} successfully.`,
        status: "success",
        duration: 2000, //  disappears after 2s
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      setError(`Error updating check-in status: ${err}`);
      console.error(err);
    }
  };

  // behave differently for undo and check-in
  const handleCheckInClick = (participant: any) => {
    const newStatus =
      participant["status_id:label"] === "Attended" ? "Registered" : "Attended";

    const updatedParticipant = {
      ...participant,
      "status_id:label": newStatus,
    };

    const filtered = originalParticipantList.filter(
      (p) => p.id !== participant.id
    );

    if (newStatus === "Attended") {
      filtered.push(updatedParticipant);
    } else {
      filtered.unshift(updatedParticipant);
    }

    // Update state and fire API call
    setParticipantList(filtered);
    handleUpdate(
      participant.id,
      newStatus,
      participant["contact_id.first_name"],
      participant["contact_id.last_name"],
      newStatus === "Attended" ? "checked in" : "reverted to registered status"
    );
  };

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
        border="1px solid"
        borderColor="gray.200"
        borderRadius="md"
      >
        <Table variant="simple" maxHeight="400px">
          <TableCaption>
            <ParticipantDrawer
              eventId={eventId}
              setParticipants={setParticipantList}
            />
          </TableCaption>
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
                  sortList={participantList}
                  setSortList={setParticipantList}
                  sortTarget="participantFirstName"
                >
                  First Name
                </SortByLetter>
              </Th>
              <Th>
                <SortByLetter
                  sortOrder={sortByLastName}
                  setSortOrder={setSortByLastname}
                  sortList={participantList}
                  setSortList={setParticipantList}
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
                  sortList={participantList}
                  setSortList={setParticipantList}
                  sortTarget="participantStatus"
                >
                  currentStatus
                </SortByLetter>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {participantList.length === 0 ? (
              <Tr>
                <Td colSpan={3}>No participants found.</Td>
              </Tr>
            ) : (
              participantList.map((participant: any, index) => {
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
                      {participant["contact_id.phone_primary.phone_numeric"]
                        ? formatPhone(
                            participant[
                              "contact_id.phone_primary.phone_numeric"
                            ]
                          )
                        : "None"}
                    </Td>
                    <Td>
                      {currentStatus} -{" "}
                      {currentStatus === "Attended" ? (
                        <span style={{ marginLeft: "6px" }}>
                          <Button
                            pattern="grey"
                            onClick={() => handleCheckInClick(participant)}
                          >
                            &nbsp;&nbsp; Revert &nbsp;
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
