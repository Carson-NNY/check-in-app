"use client";

import { useState, useEffect, useMemo } from "react";
import DateFilters from "@/components/Event/Filters/DateFilter";
import EventList from "./EventList";
import styles from "./Event.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBox from "../SearchBox/SearchBox";
import useDebounce from "@/hooks/useDebounce";
import Button from "../Button/Button";
import LogoutButton from "@/components/Button/LogoutButton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function EventPage({ events = [] }: { events?: any[] }) {
  const [eventList, setEventList] = useState<any[]>([]);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [error, setError] = useState<string | null>(null);
  // limit the state to "ASC" or "DESC" or null
  const [sortByDate, _setSortByDate] = useState<"ASC" | "DESC" | null>(null);
  const [sortByTitle, _setSortByTitle] = useState<"ASC" | "DESC" | null>(null);
  const [search, setSearch] = useState<string>("");
  const deferredSearch = useDebounce(search, 500);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const displayedEvents = useMemo(() => {
    if (deferredSearch.trim() === "") return eventList;

    const kw = deferredSearch.toLowerCase();
    return eventList.filter((event) => {
      return (event.title ?? "").toLowerCase().includes(kw);
    });
  }, [eventList, deferredSearch]);

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

  // wrapper setters
  const setSortByDate = (order: "ASC" | "DESC" | null) => {
    _setSortByDate(order);
    if (order !== null) {
      _setSortByTitle(null);
    }
  };

  const setSortByTitle = (order: "ASC" | "DESC" | null) => {
    _setSortByTitle(order);
    if (order !== null) {
      _setSortByDate(null);
    }
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

  const fetchEventsByDate = async (
    year: string,
    month?: string,
    day?: string
  ) => {
    setIsLoading(true);

    try {
      if (!year) return [];
      let path = `/api/events/${year}`;
      if (month) path += `/${month}`;
      if (day) path += `/${day}`;

      // make the API call from the server side
      const response = await fetch(path);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Status: ${response.status}}, {cause: ${errorText}}`);
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(`handleDateSearch() failed — ${error}`);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSearch = async () => {
    // Update the URL with the selected year/month/day so when page is refreshed, the same events are preserved
    // updateURL(year, month, day);

    try {
      const data = await fetchEventsByDate(year, month, day);
      setEventList(data);
      _setSortByDate(null);
      _setSortByTitle(null);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(`handleDateSearch() failed in Event.tsx — ${error}`);
    }
  };

  // Fetch today's events by default when the component mounts
  const handleSearchTodaysEvents = async () => {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    // updateURL(year, month, day);
    setYear(year);
    setMonth(month);
    setDay(day);
    _setSortByDate(null);
    _setSortByTitle(null);

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
      <LogoutButton />
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

      <SearchBox search={search} setSearch={setSearch} />

      <div style={{ marginTop: "10px" }}></div>
      <Button pattern="blue" onClick={handleSearchTodaysEvents}>
        Today's Events
      </Button>

      {/* Main content area */}
      <main className={styles.main}>
        {isLoading ? (
          <Skeleton count={20} height={30} duration={0.7} borderRadius={10} />
        ) : (
          <>
            {" "}
            <EventList
              events={displayedEvents}
              highlight={search}
              sortByTitle={sortByTitle}
              setSortByTitle={setSortByTitle}
              sortByDate={sortByDate}
              setSortByDate={setSortByDate}
              eventList={eventList}
              setEventList={setEventList}
            />
            <ErrorMessage error={error} setError={setError} />
          </>
        )}
      </main>
    </div>
  );
}
