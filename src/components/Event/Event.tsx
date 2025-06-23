"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
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
import { SkeletonCircle } from "@chakra-ui/react";
import "react-loading-skeleton/dist/skeleton.css";

export default function EventPage() {
  const router = useRouter();
  const params = useSearchParams();

  // Local state mirrors what will eventually get pushed to URL
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [search, setSearch] = useState("");

  const [eventList, setEventList] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [sortByDate, _setSortByDate] = useState<"ASC" | "DESC" | null>(null);
  const [sortByTitle, _setSortByTitle] = useState<"ASC" | "DESC" | null>(null);

  // Apply 500 ms debounce so URL typing feels snappy
  const deferredSearch = useDebounce(search, 500);

  /** ----------------------------------------------------------------
   *  URL helpers
   *  ---------------------------------------------------------------- */
  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const q = new URLSearchParams(params.toString());

      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === "") q.delete(k);
        else q.set(k, v);
      });

      // update the URL, client-side only
      router.replace(`${window.location.pathname}?${q.toString()}`);
    },
    [params, router]
  );

  const fetchEventsByDate = useCallback(
    async (y: string, m?: string, d?: string) => {
      if (!y) return [];
      try {
        let path = `/api/events/${y}`;
        if (m) path += `/${m}`;
        if (d) path += `/${d}`;

        const res = await fetch(path);
        if (!res.ok) {
          const body = await res.text();
          throw new Error(`${res.status} ${body}`);
        }
        const data = await res.json();
        return Array.isArray(data) ? data : [];
      } catch (err) {
        console.error(err);
        setError(`Failed to fetch events — ${err}`);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /** ----------------------------------------------------------------
   *  Effects: hydrate local state from URL on first render
   *  ---------------------------------------------------------------- */
  useEffect(() => {
    const urlYear = params.get("year") || "";
    const urlMonth = params.get("month") || "";
    const urlDay = params.get("day") || "";
    const urlSearch = params.get("search") || "";

    // hydrate filter/search boxes
    setYear(urlYear);
    setMonth(urlMonth);
    setDay(urlDay);
    setSearch(urlSearch);

    // If URL already has a year param, load it; otherwise default to today
    if (urlYear) {
      fetchEventsByDate(urlYear, urlMonth, urlDay).then(setEventList);
    } else {
      handleSearchTodaysEvents(); // pushes URL & loads data
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once

  // Memo‑filtered list (search term)
  const displayedEvents = useMemo(() => {
    if (!deferredSearch.trim()) return eventList;
    const kw = deferredSearch.toLowerCase();
    return eventList.filter((e) => (e.title ?? "").toLowerCase().includes(kw));
  }, [eventList, deferredSearch]);

  /** ----------------------------------------------------------------
   *  Event handlers
   *  ---------------------------------------------------------------- */
  const handleDateSearch = async () => {
    const data = await fetchEventsByDate(year, month, day);
    setEventList(data);
    updateQuery({ year, month, day });
    _setSortByDate(null);
    _setSortByTitle(null);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    updateQuery({ search: val });
  };

  const handleSearchTodaysEvents = async () => {
    const today = new Date();
    const y = today.getFullYear().toString();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");

    setYear(y);
    setMonth(m);
    setDay(d);

    updateQuery({ year: y, month: m, day: d });

    const data = await fetchEventsByDate(y, m, d);
    setEventList(data);
  };

  /** sorting toggles */
  const setSortByDate = (o: "ASC" | "DESC" | null) => {
    _setSortByDate(o);
    if (o) _setSortByTitle(null);
  };
  const setSortByTitle = (o: "ASC" | "DESC" | null) => {
    _setSortByTitle(o);
    if (o) _setSortByDate(null);
  };

  /** ----------------------------------------------------------------
   *  JSX
   *  ---------------------------------------------------------------- */
  return (
    <div className={styles.page}>
      <LogoutButton />

      <Flex width="100%" justify="space-between" align="center">
        <DateFilters
          year={year}
          month={month}
          day={day}
          onYearChange={(y) => {
            setYear(y);
            setMonth("");
            setDay("");
          }}
          onMonthChange={(m) => {
            setMonth(m);
            setDay("");
          }}
          onDayChange={setDay}
          onSearch={handleDateSearch}
        />

        <Button pattern="teal" onClick={handleSearchTodaysEvents}>
          Today&apos;s Events
        </Button>
      </Flex>
      <Flex width="100%" justify="center" align="center" gap={2}>
        {" "}
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
          <h4>(Total:{eventList.length})</h4>
        )}
      </Flex>

      <div className={styles.searchBox}>
        {" "}
        <SearchBox
          search={search}
          setSearch={handleSearchChange}
          placeholder="Search by titles"
        />
      </div>

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
