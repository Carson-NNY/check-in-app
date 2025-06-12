"use client";

import { useEffect, useState } from "react";
import { Highlight } from "../Highlight/Highlight";
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

import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

type CheckinModalProps = {
  participant: any;
  participants: any[];
  index: number;
  currentStatus: string;
  handleUpdate: (id: string, status: string) => Promise<void>;

  setParticipants: (participants: any[]) => void;
};

function CheckinModal({
  participant,
  participants,
  index,
  currentStatus,
  handleUpdate,
  setParticipants,
}: CheckinModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        disabled={currentStatus === "Attended"}
      >
        {currentStatus === "Attended" ? "Confirmed" : "Check-in"}
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
          <ModalHeader>Confirm Check-In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to mark this participant as checked-in?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={() => {
                const updated = [...participants];
                updated[index] = {
                  ...participant,
                  statusLabel: "Attended",
                };
                setParticipants(updated);
                handleUpdate(participant.id, "Attended");
                onClose();
              }}
            >
              Confirm Attendance
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

type Participant = {
  participantList: any[];
  setError: (error: string | null) => void;
  highlight: string;
};

export default function EventParticipantList({
  participantList,
  setError,
  highlight,
}: Participant) {
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setParticipants(participantList);
    setLoading(false);
  }, [participantList]);

  const handleUpdate = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/statusUpdate/${id}/${status}`, {
        method: "POST",
      });
      if (!res.ok) {
        setError(`Failed to update status: ${res.statusText}`);
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      setError(`Error updating check-in status: ${err}`);
      console.error(err);
    }
  };

  if (loading) return <p>Loading participants…</p>;

  return (
    <ul>
      <TableContainer>
        <Table variant="simple" maxHeight="400px">
          <TableCaption>Momath ~~~~~~</TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>register_date</Th>
              <Th>currentStatus</Th>
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
                    <Td maxW="200px" whiteSpace="normal" wordBreak="break-word">
                      <Highlight
                        text={participant["contact_id.sort_name"]}
                        highlight={highlight}
                      />
                    </Td>
                    <Td>{participant.register_date}</Td>
                    <Td>
                      {currentStatus} -
                      <CheckinModal
                        participant={participant}
                        setParticipants={setParticipants}
                        index={index}
                        currentStatus={currentStatus}
                        handleUpdate={handleUpdate}
                        participants={participants}
                      />
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
