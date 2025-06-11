"use client";

import { useEffect, useState } from "react";
import { Highlight } from "../Highlight/Highlight";
import Button from "../Button/Button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Portal,
} from "@chakra-ui/react";
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
  const [open, setOpen] = useState(false);

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
      {participants.map((participant: any, index) => {
        const currentStatus =
          participant.statusLabel ?? participant["status_id:label"];

        return (
          <li key={index} style={{ marginBottom: 3 }}>
            Name:
            <Highlight
              text={participant["contact_id.sort_name"]}
              highlight={highlight}
            />
            — Registered: {participant.register_date} — Status: {currentStatus}{" "}
            —{" "}
            <Button
              pattern="green"
              onClick={() => {
                const updated = [...participants];
                updated[index] = {
                  ...participant,
                  statusLabel: "Attended",
                };
                setParticipants(updated);
                handleUpdate(participant.id, "Attended");
              }}
              disabledStatus={currentStatus === "Attended" ? true : false}
            >
              {currentStatus === "Attended" ? "Confirmed" : "Check-in"}
            </Button>
            <Popover>
              <PopoverTrigger>
                <Button
                  pattern="green"
                  onClick={() => {
                    const updated = [...participants];
                    updated[index] = {
                      ...participant,
                      statusLabel: "Attended",
                    };
                    setParticipants(updated);
                    handleUpdate(participant.id, "Attended");
                  }}
                >
                  pppp
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverBody>
                    This is a popover with the same width as the trigger button
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          </li>
        );
      })}
    </ul>
  );
}
