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
};

export default function EventList({
  events,
  highlight,
  eventList,
  setEventList,
  sortByTitle,
  setSortByTitle,
  sortByDate,
  setSortByDate,
}: EventListProps) {
  const router = useRouter();

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
                <Th>event_id</Th>
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
                  <Td>{event.id.toString()}</Td>
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
