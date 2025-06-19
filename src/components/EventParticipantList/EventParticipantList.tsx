"use client";

import { useEffect, useState } from "react";
import { HighlightComponent } from "../Highlight/Highlight";
import ParticipantDrawer from "../ParticipantDrawer";
import { useToast } from "@chakra-ui/react";
import Button from "../Button/Button";

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
  setError: (error: string | null) => void;
  highlight: string;
  eventId: string;
};

export default function EventParticipantList({
  participantList,
  setError,
  highlight,
  eventId,
}: Participant) {
  const [participants, setParticipants] = useState<any[]>([]);
  const toast = useToast();

  useEffect(() => {
    setParticipants(participantList);
  }, [participantList]);

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
  const handleClick = (participant: any, index: any, currentStatus: string) => {
    const updatedParticipants = [...participants];
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

    setParticipants(updatedParticipants);
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

  return (
    <ul>
      <TableContainer>
        <Table variant="simple" maxHeight="400px">
          <TableCaption>
            <ParticipantDrawer
              eventId={eventId}
              setParticipants={setParticipants}
            />
          </TableCaption>
          <Thead>
            <Tr>
              <Th>First Name</Th>
              <Th>Last Name</Th>
              {/* <Th>register_date</Th> */}
              <Th>currentStatus</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {participants.length === 0 ? (
              <Tr>
                <Td colSpan={3}>No participants found.</Td>
              </Tr>
            ) : (
              participants.map((participant: any, index) => {
                const currentStatus =
                  participant.statusLabel ?? participant["status_id:label"];
                return (
                  <Tr key={index}>
                    <Td
                      maxW="200px"
                      width="150px"
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
                      width="150px"
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
                    {/* <Td>{participant.register_date}</Td> */}
                    <Td>{currentStatus}</Td>
                    <Td>
                      {currentStatus === "Attended" ? (
                        <Button
                          pattern="grey"
                          onClick={() =>
                            handleClick(participant, index, currentStatus)
                          }
                        >
                          &nbsp; Revert &nbsp;
                        </Button>
                      ) : (
                        <Button
                          pattern="green"
                          onClick={() =>
                            handleClick(participant, index, currentStatus)
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
