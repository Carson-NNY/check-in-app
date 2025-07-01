import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { HighlightComponent } from "../Highlight/Highlight";
import SortByLetter from "./Sort/SortByLetter";
import SortByDate from "./Sort/SortByDate";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

type sortByType = "ASC" | "DESC" | null;
type EventListProps = {
  events: any[];
  highlight: string;
  eventList: any[];
  setEventList: (events: any[]) => void;
  sortByTitle: sortByType;
  setSortByTitle: (sortBy: sortByType) => void;
  sortByDate: sortByType;
  setSortByDate: (sortBy: sortByType) => void;
  sortByEventId: sortByType;
  setSortByEventId: (sortBy: sortByType) => void;
};

//  render a list of events in Table component from Chakra UI
export default function EventList({
  events,
  highlight,
  eventList,
  setEventList,
  sortByTitle,
  setSortByTitle,
  sortByDate,
  setSortByDate,
  sortByEventId,
  setSortByEventId,
}: EventListProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [sortByTitle, sortByDate]);
  return (
    <div>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <TableContainer
          maxH="800px"
          overflowY="auto"
          border="1px solid"
          borderColor="gray.200"
          borderRadius="md"
          ref={containerRef}
        >
          <Table variant="simple" maxHeight="400px">
            <TableCaption>Momath ~~~~~~</TableCaption>
            <Thead
              position="sticky"
              top={0}
              bg="whiteAlpha.900"
              backdropFilter="blur(4px)"
              boxShadow="sm"
            >
              <Tr>
                <Th>
                  <SortByLetter
                    sortOrder={sortByEventId}
                    setSortOrder={setSortByEventId}
                    sortList={eventList}
                    setSortList={setEventList}
                    sortTarget="eventId"
                  >
                    event_id
                  </SortByLetter>
                </Th>
                <Th>
                  {/* Sort by title */}
                  <SortByLetter
                    sortOrder={sortByTitle}
                    setSortOrder={setSortByTitle}
                    sortList={eventList}
                    setSortList={setEventList}
                    sortTarget="eventTitle"
                  >
                    event title
                  </SortByLetter>
                </Th>
                <Th>
                  <SortByDate
                    sortByDate={sortByDate}
                    setSortByDate={setSortByDate}
                    eventList={eventList}
                    setEventList={setEventList}
                  />
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event: any, i: number) => (
                <Tr
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    router.push(
                      `/event_participants/${event.id}/${event.title}`
                    )
                  }
                  _hover={{ bg: "gray.50" }}
                >
                  <Td>
                    <HighlightComponent
                      text={event.id.toString()}
                      highlight={highlight}
                    />
                  </Td>
                  <Td maxW="300px" whiteSpace="normal" wordBreak="break-word">
                    <HighlightComponent
                      text={event.title ? event.title : ""}
                      highlight={highlight}
                    />
                  </Td>
                  <Td>{event.start_date}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
