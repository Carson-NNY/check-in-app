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
  handleUpdate: (
    id: string,
    status: string,
    sort_name: string
  ) => Promise<void>;

  setParticipants: (participants: any[]) => void;
};

/*
 *  This component is currently not adopted in the codebase, but it is designed to handle check-in confirmation for participants.
 *  Keep it now for possible future use or integration
 */
export default function CheckinModal({
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
                handleUpdate(
                  participant.id,
                  "Attended",
                  participant["contact_id.sort_name"]
                );
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
