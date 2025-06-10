"use client";

import { useEffect, useState } from "react";
import { Highlight } from "../Highlight/Highlight";

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
            <button
              onClick={() => {
                const updated = [...participants];
                updated[index] = {
                  ...participant,
                  statusLabel: "Attended",
                };
                setParticipants(updated);
                handleUpdate(participant.id, "Attended");
              }}
              disabled={currentStatus === "Attended"}
            >
              {currentStatus === "Attended" ? "Checked-in ✅" : "Check-in"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
