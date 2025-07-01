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

type ParticipantDrawerProps = {
  eventId: string;
  setParticipants: React.Dispatch<React.SetStateAction<any[]>>;
  participantRoles?: any[];
};

export default function ParticipantDrawer({
  eventId,
  setParticipants,
  participantRoles,
}: ParticipantDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const firstField = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const payload = {
      eventId,
      status: "Registered",
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phoneNumber: form.phoneNumber.value,
      email: form.email.value,
      contactType: form.contactType.value,
      source: form.source.value,
      participantRole: form.participantRole.value,
    };

    const res = await fetch("/api/newParticipant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const newParticipant = await res.json();
      setParticipants((prev) => [...prev, newParticipant]);
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
          <DrawerHeader
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
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
                      ref={firstField}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </InputGroup>
                </FormControl>

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
