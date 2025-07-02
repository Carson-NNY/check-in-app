import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  ButtonGroup,
  Button,
  Text,
} from "@chakra-ui/react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  existingParticipant?: any;
  setExistingParticipant?: React.Dispatch<React.SetStateAction<any>>;
};

export default function ModalComponent({
  isOpen,
  onClose,
  onConfirm,
  onCancel,
  existingParticipant,
  setExistingParticipant,
}: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered motionPreset="scale">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton
          onClick={() => setExistingParticipant && setExistingParticipant(null)}
        />
        <ModalHeader>Participant with the same name detected</ModalHeader>
        <ModalBody>
          <Text>
            It looks like Participant{" "}
            {existingParticipant
              ? `${existingParticipant["contact_id.first_name"]} ${existingParticipant["contact_id.last_name"]}`
              : ""}{" "}
            is already registered, are you sure you still want to add them?
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="space-evenly">
          <ButtonGroup variant="outline" spacing="6">
            <Button onClick={onCancel}>No</Button>
            <Button colorScheme="blue" onClick={onConfirm}>
              Yes
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
