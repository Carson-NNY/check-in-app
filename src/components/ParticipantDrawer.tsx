"use client";

import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Button,
  FormLabel,
  Input,
  Textarea,
  Stack,
  Box,
  useDisclosure,
  Select,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

type ParticipantDrawerProps = {
  eventId: string;
  participants: any[];
  setParticipants: React.Dispatch<React.SetStateAction<any[]>>;
};

export default function ParticipantDrawer({
  eventId,
  participants,
  setParticipants,
}: ParticipantDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/newParticipant", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const newParticipant = await res.json();
      console.log("New participant added:", newParticipant);

      setParticipants((prev) => [...prev, newParticipant]);
      onClose();
    } else {
      const err = await res.json();
      console.error("Error:", err);
    }

    setLoading(false);
  }

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

          <DrawerBody>
            <form id="participant-form" onSubmit={handleSubmit}>
              <Input type="hidden" name="eventId" value={eventId || ""} />
              <Input type="hidden" name="status" value="Attended" />

              <Stack spacing="20px">
                <Box>
                  <FormLabel htmlFor="lastName">Last Name *</FormLabel>
                  <Input
                    ref={firstField}
                    id="lastName"
                    name="lastName"
                    placeholder=""
                    required
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="middleName">Middle Name</FormLabel>
                  <Input id="middleName" name="middleName" placeholder="" />
                </Box>

                <Box>
                  <FormLabel htmlFor="firstName">First Name *</FormLabel>
                  <Input
                    id="firstName"
                    name="firstName"
                    placeholder=""
                    required
                  />
                </Box>

                <Box>
                  <FormLabel htmlFor="contactType">Contact Type</FormLabel>
                  <Select
                    id="contactType"
                    name="contactType"
                    placeholder="Select contact type"
                  >
                    <option value="Household">Household</option>
                    <option value="Individual">Individual</option>
                    <option value="Organization">Organization</option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel htmlFor="source">Source</FormLabel>
                  <Input id="source" name="source" />
                </Box>
              </Stack>
            </form>
          </DrawerBody>

          <DrawerFooter>
            <Button
              colorScheme="blue"
              type="submit"
              form="participant-form"
              isLoading={loading}
            >
              Submit
            </Button>
            <Button variant="outline" ml={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
