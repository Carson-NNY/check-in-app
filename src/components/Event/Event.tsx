"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./Event.module.css";

type EventProps = { events?: any[] };

export default function Event(props?: EventProps) {
  const [eventList, setEventList] = useState<any[]>(props?.events || []);

  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const handleSearch = async () => {
    if (!year) return;
    let path = `/api/events/${year}`;
    if (month) {
      path += `/${month}`;
    }
    if (day) {
      path += `/${day}`;
    }
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setEventList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  return (
    <div className={styles.page}>
      <div
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          marginBottom: "26px",
        }}
      >
        {/* Year Dropdown */}
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Year</option>
          {Array.from({ length: 30 }, (_, i) => currentYear - 20 + i).map(
            (y) => (
              <option key={y} value={y}>
                {y}
              </option>
            )
          )}
        </select>

        {/* Month Dropdown */}
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          disabled={!year}
        >
          <option value="">Month</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={String(m).padStart(2, "0")}>
              {String(m).padStart(2, "0")}
            </option>
          ))}
        </select>

        {/* Day Dropdown */}
        <select
          value={day}
          onChange={(e) => setDay(e.target.value)}
          disabled={!month}
        >
          <option value="">Day</option>
          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
            <option key={d} value={String(d).padStart(2, "0")}>
              {String(d).padStart(2, "0")}
            </option>
          ))}
        </select>

        <button onClick={handleSearch}>Search</button>
      </div>
      <main className={styles.main}>
        <div>
          <h1>Events</h1>
          {eventList?.map((p: any, i: number) => (
            <div key={i}>
              <button
                onClick={() => router.push(`/event_participants/${p.id}`)}
              >
                event_id: {p.id}
              </button>
              , title: {p.title}, - date: start_date: {p.start_date}, end_date:{" "}
              {p.end_date}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
