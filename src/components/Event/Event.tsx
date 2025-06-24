"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DateFilters from "@/components/Event/Filters/DateFilter";
import EventList from "./EventList";
import styles from "./Event.module.css";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import SearchBox from "../SearchBox/SearchBox";
import useDebounce from "@/hooks/useDebounce";
import Button from "../Button/Button";
import LogoutButton from "@/components/Button/LogoutButton";
import { Flex } from "@chakra-ui/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function EventPage() {
  const router = useRouter();
  const params = useSearchParams();

  // — search
  const [search, setSearch] = useState("");
  const deferredSearch = useDebounce(search, 500);

  // — filters
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // — calendar
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // — data & UI state
  const [eventList, setEventList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // — sorting
  const [sortByDate, _setSortByDate] = useState<"ASC" | "DESC" | null>(null);
  const [sortByTitle, _setSortByTitle] = useState<"ASC" | "DESC" | null>(null);

  const setSortByDate = (o: "ASC" | "DESC" | null) => {
    _setSortByDate(o);
    if (o) _setSortByTitle(null);
  };
  const setSortByTitle = (o: "ASC" | "DESC" | null) => {
    _setSortByTitle(o);
    if (o) _setSortByDate(null);
  };

  // — build API path and fetch based on date
  const fetchEvents = async (y: string, m?: string, d?: string) => {
    setIsLoading(true);
    let path = `/api/events/${y}`;
    if (m) path += `/${m}`;
    if (d) path += `/${d}`;
    try {
      const res = await fetch(path);
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
      const data = await res.json();
      setEventList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(`Failed to fetch events — ${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  // — URL updater
  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const q = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (!v) q.delete(k);
        else q.set(k, v);
      });
      router.replace(`${window.location.pathname}?${q.toString()}`);
    },
    [params, router]
  );

  // — init from URL
  useEffect(() => {
    const uYear = params.get("year") || "";
    const uMonth = params.get("month") || "";
    const uDay = params.get("day") || "";
    const uSearch = params.get("search") || "";

    setSearch(uSearch);
    setYearMonthDay(uYear, uMonth, uDay);

    // if we have all three, full-date; else if year+month; else if year-only; else today
    if (uYear && uMonth && uDay) {
      const d = new Date(Number(uYear), Number(uMonth) - 1, Number(uDay));
      setSelectedDate(d);
      fetchEvents(uYear, uMonth, uDay);
    } else if (uYear && uMonth) {
      setSelectedDate(new Date(Number(uYear), Number(uMonth) - 1, 1));
      fetchEvents(uYear, uMonth);
    } else if (uYear) {
      const today = new Date();
      setSelectedDate(today);
      fetchEvents(uYear);
    } else {
      // default → today
      const now = new Date();
      const y = String(now.getFullYear());
      const m = String(now.getMonth() + 1).padStart(2, "0");
      const d = String(now.getDate()).padStart(2, "0");
      setYearMonthDay(y, m, d);
      setSelectedDate(now);
      fetchEvents(y, m, d);
    }
    // run only once
  }, []);

  // — handlers for date filters
  const handleDateSearch = () => {
    updateQuery({ year, month, day });
    fetchEvents(year, month, day);
  };

  const handleSearchTodaysEvents = () => {
    const now = new Date();
    const y = String(now.getFullYear());
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    setYearMonthDay(y, m, d);
    setSelectedDate(now);
    updateQuery({ year: y, month: m, day: d });
    fetchEvents(y, m, d);
  };

  // — search box handler
  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateQuery({ search: val });
  };

  // — filtered by title
  const displayedEvents = useMemo(() => {
    if (!deferredSearch.trim()) return eventList;
    const kw = deferredSearch.toLowerCase();
    return eventList.filter((e) => (e.title ?? "").toLowerCase().includes(kw));
  }, [eventList, deferredSearch]);

  // reusable function to set year, month, and day
  const setYearMonthDay = (y: string, m?: string, d?: string) => {
    setYear(y);
    setMonth(m || "");
    setDay(d || "");
  };

  return (
    <div className={styles.page}>
      <LogoutButton />

      {/* filters + today button */}
      <Flex width="100%" justify="space-between" align="center">
        <DateFilters
          year={year}
          month={month}
          day={day}
          selectedDate={selectedDate}
          onYearChange={(y) => {
            setYearMonthDay(y);
            setSelectedDate(new Date(Number(y), 0, 1));
          }}
          onMonthChange={(m) => {
            setMonth(m);
            setDay("");
            setSelectedDate(new Date(Number(year), Number(m) - 1, 1));
          }}
          onDayChange={(d) => {
            setDay(d);
            if (year && month && d)
              setSelectedDate(
                new Date(Number(year), Number(month) - 1, Number(d))
              );
          }}
          onDateChange={(d) => {
            setSelectedDate(d);
            if (d) {
              const y = String(d.getFullYear());
              const mo = String(d.getMonth() + 1).padStart(2, "0");
              const da = String(d.getDate()).padStart(2, "0");
              setYearMonthDay(y, mo, da);
            }
          }}
          onSearch={handleDateSearch}
        />
        <Button pattern="teal" onClick={handleSearchTodaysEvents}>
          Today’s Events
        </Button>
      </Flex>

      {/* title + count */}
      <Flex width="100%" justify="center" align="center" gap={2}>
        <h2 className={styles.title}>Event Listings</h2>
        {isLoading ? (
          <Skeleton
            count={1}
            height={20}
            width={65}
            duration={0.7}
            borderRadius={10}
          />
        ) : (
          <h4>(Total: {eventList.length})</h4>
        )}
      </Flex>

      {/* search box */}
      <div className={styles.searchBox}>
        <SearchBox
          search={search}
          setSearch={handleSearchChange}
          placeholder="Search by titles"
        />
      </div>

      {/* event list or loading via Skeleton */}
      <main className={styles.main}>
        {isLoading ? (
          <Skeleton count={20} height={30} duration={0.7} borderRadius={10} />
        ) : (
          <>
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
