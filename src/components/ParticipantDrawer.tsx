"use client";

import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Button,
  FormLabel,
  Input,
  Stack,
  Box,
  useDisclosure,
  Select,
  InputGroup,
  InputLeftAddon,
  FormControl,
} from "@chakra-ui/react";
import { AddIcon, EmailIcon } from "@chakra-ui/icons";
import { useToast } from "@chakra-ui/react";
import ModalComponent from "./Modal/ModalComponent";

type ParticipantDrawerProps = {
  eventId: string;
  participants: any[];
  setParticipants: React.Dispatch<React.SetStateAction<any[]>>;
  participantRoles?: any[];
};

export default function ParticipantDrawer({
  eventId,
  participants,
  setParticipants,
  participantRoles,
}: ParticipantDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure(); // for the drawer
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure(); // for the modal popover

  const [pendingPayload, setPendingPayload] = useState<{
    eventId: string;
    status: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    source: string;
    participantRole: string;
  } | null>(null);

  const firstField = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [existingParticipant, setExistingParticipant] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const payload = {
      eventId,
      status: "Registered",
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phoneNumber: form.phoneNumber.value,
      email: form.email.value,
      source: form.source.value,
      participantRole: form.participantRole.value,
    };

    // iterate over the participants and see if the participant already exists
    const existing = participants.find((participant) => {
      const first = participant["contact_id.first_name"]?.trim().toLowerCase();
      const last = participant["contact_id.last_name"]?.trim().toLowerCase();

      const payloadFirst = payload.firstName.trim().toLowerCase();
      const payloadLast = payload.lastName.trim().toLowerCase();

      return first === payloadFirst && last === payloadLast;
    });

    if (existing) {
      setExistingParticipant(existing);
      console.log("Participant already exists:", existing);
      setPendingPayload(payload);
      onModalOpen();
      return;
    }

    // If no existing participant, proceed to add the new participant
    await addParticipant(payload);
  }

  async function addParticipant(payload: any) {
    setLoading(true);
    const res = await fetch("/api/newParticipant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newParticipant = await res.json();
      // I want to add a new field to the newParticipant object
      newParticipant.isNewlyAdded = true;
      setParticipants((prev) => [newParticipant, ...prev]);

      // store the id of the new participant in local storage
      const key = `newParticipants-${eventId}`;
      const list = JSON.parse(localStorage.getItem(key) || "[]");
      localStorage.setItem(
        key,
        JSON.stringify([...new Set([...list, newParticipant.id])])
      );

      toast({
        title: "Success!",
        description: `${newParticipant["contact_id.sort_name"]} has been added successfully.`,
        status: "success",
        duration: 3000, //  disappears after 3s
        isClosable: true,
        position: "top",
      });
      onClose();
    } else {
      const err = await res.json();
      console.error("Error:", err);
      toast({
        title: "Error!",
        description: `Failed to add participant: ${
          err.error || "Unknown error"
        }`,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }

    setPendingPayload(null);
    setLoading(false);
  }

  const handleModalConfirm = async () => {
    onModalClose();
    if (pendingPayload) {
      await addParticipant(pendingPayload);
    }
    setPendingPayload(null);
    setExistingParticipant(null);
    onClose();
  };

  const handleModalCancel = () => {
    setPendingPayload(null);
    setExistingParticipant(null);
    onModalClose();
  };

  return (
    <>
      <Button leftIcon={<AddIcon />} colorScheme="teal" onClick={onOpen}>
        Add a new participant
      </Button>

      <Drawer
        isOpen={isOpen}
        placement="right"
        initialFocusRef={firstField}
        onClose={onClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create Participant</DrawerHeader>
          <DrawerHeader style={{ display: "flex", justifyContent: "right" }}>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              ml={3}
              colorScheme="blue"
              type="submit"
              form="participant-form"
              isLoading={loading}
            >
              Submit
            </Button>
            {/* display Modal when a possible duplicate is detected */}
            <ModalComponent
              isOpen={isModalOpen}
              onClose={onModalClose}
              onConfirm={handleModalConfirm}
              onCancel={handleModalCancel}
              existingParticipant={existingParticipant}
              setExistingParticipant={setExistingParticipant}
            />
          </DrawerHeader>
          <DrawerBody>
            <form id="participant-form" onSubmit={handleSubmit}>
              <Stack spacing="20px">
                <FormControl isRequired>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
                  <Input
                    ref={firstField}
                    id="firstName"
                    name="firstName"
                    placeholder=""
                    required
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <Input
                    id="lastName"
                    name="lastName"
                    placeholder=""
                    required
                  />
                </FormControl>
                <Box>
                  <FormLabel htmlFor="participantRole">
                    Participant Role
                  </FormLabel>
                  <Select
                    id="participantRole"
                    name="participantRole"
                    placeholder="Select participant role"
                  >
                    {participantRoles?.map((role) => (
                      <option key={role.label} value={role.label}>
                        {role.label}{" "}
                      </option>
                    ))}
                  </Select>
                </Box>

                <Box>
                  <FormLabel htmlFor="phoneNumber">Phone </FormLabel>
                  <InputGroup>
                    <InputLeftAddon>+1</InputLeftAddon>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      minLength={10}
                      maxLength={10}
                      onInput={(e) => {
                        e.currentTarget.value = e.currentTarget.value.replace(
                          /\D/g,
                          ""
                        );
                      }}
                    />
                  </InputGroup>
                </Box>

                {/* EMAIL FIELD */}
                <FormControl>
                  <FormLabel htmlFor="email">Email address</FormLabel>
                  <InputGroup>
                    <InputLeftAddon>
                      <EmailIcon color="gray.500" />
                    </InputLeftAddon>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </InputGroup>
                </FormControl>

                <Box>
                  <FormLabel htmlFor="source">Source</FormLabel>
                  <Input id="source" name="source" />
                </Box>
              </Stack>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
