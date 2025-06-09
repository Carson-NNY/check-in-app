"use client";

import { useState, useEffect, use } from "react";
import DateFilters from "@/components/Event/Filters/DateFilter";
import EventList from "./EventList";
import { fetchEventsByDate } from "@/hooks/useEvents";
import styles from "./Event.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SortByDate from "./Sort/SortByDate";

export default function EventPage({ events = [] }: { events?: any[] }) {
  const [eventList, setEventList] = useState<any[]>([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState<string | null>(null);

  // limit the state to "ASC" or "DESC" or null
  const [sortByDate, setSortByDate] = useState<"ASC" | "DESC" | null>(null);

  const handleYearChange = (newYear: string) => {
    setYear(newYear);
    setMonth("");
    setDay("");
  };
  const handleMonthChange = (newMonth: string) => {
    setMonth(newMonth);
    setDay("");
  };
  const handleDayChange = (newDay: string) => {
    setDay(newDay);
  };

  // Update the URL with the selected year/month/day so when page is refreshed, the same events are preserved
  // currenrly only preserve year/month/day
  // const updateURL = (year: string, month: string, day: string) => {
  //   const query = new URLSearchParams();
  //   if (year) query.set("year", year);
  //   if (month) query.set("month", month);
  //   if (day) query.set("day", day);
  //   const newUrl = `${window.location.pathname}?${query.toString()}`;
  //   window.history.replaceState(null, "", newUrl);
  // };

  const handleDateSearch = async () => {
    // Update the URL with the selected year/month/day so when page is refreshed, the same events are preserved
    // updateURL(year, month, day);

    try {
      const data = await fetchEventsByDate(year, month, day);
      setEventList(data);
      setSortByDate(null);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(`handleDateSearch() failed in Event.tsx — ${error}`);
    }
  };

  const handleSearchTodaysEvents = async () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    // updateURL(year, month, day);
    setYear(year);
    setMonth(month);
    setDay(day);
    setSortByDate(null);

    try {
      const data = await fetchEventsByDate(year, month, day);
      setEventList(data);
    } catch (error) {
      console.error("Error fetching today's events:", error);
      setError(
        `handleSearchTodaysEvents() failed in the component(Event.tsx) — ${error}`
      );
    }
  };

  useEffect(() => {
    if (eventList.length == 0) {
      // If events are passed as props, use them directly
      handleSearchTodaysEvents();
    }
  }, []);

  // useEffect(() => {
  //   // every time the page is loaded, check the URL for year/month/day params
  //   const params = new URLSearchParams(window.location.search);
  //   const y = params.get("year");
  //   const m = params.get("month");
  //   const d = params.get("day");

  //   if (y) {
  //     setYear(y);
  //     if (m) setMonth(m);
  //     if (d) setDay(d);
  //     fetchEventsByDate(y, m || undefined, d || undefined)
  //       .then(setEventList)
  //       .catch((error) => {
  //         console.error("Error loading filtered events:", error);
  //         setError(`Initial fetch failed: ${error}`);
  //       });
  //   } else {
  //     handleSearchTodaysEvents();
  //   }
  // }, []);

  return (
    <div className={styles.page}>
      {/* general date filter for display chosen year/month/day's events */}
      <DateFilters
        year={year}
        month={month}
        day={day}
        onYearChange={handleYearChange}
        onMonthChange={handleMonthChange}
        onDayChange={handleDayChange}
        onSearch={handleDateSearch}
      />

      {/* The button only to display today's events */}
      <button
        style={{ marginTop: "15px", marginBottom: "15px", marginRight: "15px" }}
        onClick={handleSearchTodaysEvents}
      >
        Today's Events
      </button>

      {/* Sort by date */}
      <SortByDate
        sortByDate={sortByDate}
        setSortByDate={setSortByDate}
        eventList={eventList}
        setEventList={setEventList}
      />

      <ErrorMessage error={error} setError={setError} />

      <main className={styles.main}>
        <EventList events={eventList} />
      </main>
    </div>
  );
}
