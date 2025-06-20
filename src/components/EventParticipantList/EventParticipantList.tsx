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
  setParticipantList: React.Dispatch<React.SetStateAction<any[]>>;
  setError: (error: string | null) => void;
  highlight: string;
  eventId: string;
};

export default function EventParticipantList({
  participantList,
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
  const handleCheckInClick = (
    participant: any,
    index: any,
    currentStatus: string
  ) => {
    const updatedParticipants = [...participantList];
    // Remove the participant from their current position
    updatedParticipants.splice(index, 1);
    // Update their status
    const updatedParticipant = {
      ...participant,
      statusLabel: currentStatus === "Attended" ? "Registered" : "Attended",
    };

    // Add to beginning if now "Attended", or end if "Registered"
    if (currentStatus === "Attended") {
      // If reverting to "Registered", add to end
      updatedParticipants.unshift(updatedParticipant);
    } else {
      // If checking in to "Attended", add to beginning
      updatedParticipants.push(updatedParticipant);
    }

    setParticipantList(updatedParticipants);
    handleUpdate(
      participant.id,
      currentStatus === "Attended" ? "Registered" : "Attended",
      participant["contact_id.first_name"],
      participant["contact_id.last_name"],
      currentStatus === "Attended"
        ? "reverted to registered status."
        : "checked In"
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

  return (
    <ul>
      <TableContainer>
        <Table variant="simple" maxHeight="400px">
          <TableCaption>
            <ParticipantDrawer
              eventId={eventId}
              setParticipants={setParticipantList}
            />
          </TableCaption>
          <Thead>
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

              <Th>Contact</Th>
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
                const currentStatus =
                  participant.statusLabel ?? participant["status_id:label"];
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
                        ? participant["contact_id.phone_primary.phone_numeric"]
                        : "None"}
                    </Td>
                    <Td>
                      {currentStatus} -{" "}
                      {currentStatus === "Attended" ? (
                        <span style={{ marginLeft: "6px" }}>
                          <Button
                            pattern="grey"
                            onClick={() =>
                              handleCheckInClick(
                                participant,
                                index,
                                currentStatus
                              )
                            }
                          >
                            &nbsp;&nbsp; Revert &nbsp;
                          </Button>
                        </span>
                      ) : (
                        <Button
                          pattern="green"
                          onClick={() =>
                            handleCheckInClick(
                              participant,
                              index,
                              currentStatus
                            )
                          }
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
