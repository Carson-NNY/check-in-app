"use client";

import { useEffect, useState } from "react";

export default function EventParticipantList({
  participantList,
}: {
  participantList: any[];
}) {
  // State to hold participants data
  const [participants, setParticipants] = useState<any[]>(
    participantList || []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch participants data when the component mounts
    const fetchParticipants = async () => {
      try {
        setParticipants(participantList);
      } catch (error) {
        console.error("Failed to fetch participants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchParticipants();
  }, []);

  const handleUpdate = async (id: string, status: string) => {
    let path = `/api/statusUpdate/${id}/${status}`;
    try {
      const response = await fetch(`/api/statusUpdate/${id}/${status}`, {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading participants...</p>
      ) : (
        <ul>
          {participants.map((participant: any, index) => (
            <li key={index}>
              Name: {participant["contact_id.sort_name"]} - register_date:{" "}
              {participant.register_date} - Current Status:{" "}
              {participant.statusLabel || participant["status_id:label"]} -
              <button
                onClick={() => {
                  const updatedParticipants = [...participants];
                  updatedParticipants[index] = {
                    ...participant,
                    statusLabel: "Attended",
                  };
                  setParticipants(updatedParticipants);
                  handleUpdate(participant.id, "Attended");
                }}
              >
                Check-in
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
