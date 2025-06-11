import { useRouter } from "next/navigation";
import { Highlight } from "../Highlight/Highlight";
import { Button } from "@chakra-ui/react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";

type EventListProps = {
  events: any[];
  highlight: string;
};

export default function EventList({ events, highlight }: EventListProps) {
  const router = useRouter();

  return (
    <div>
      <h1>Events</h1>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <TableContainer>
          <Table variant="simple" maxHeight="400px">
            <TableCaption>Momath ~~~~~~</TableCaption>
            <Thead>
              <Tr>
                <Th>event_id</Th>
                <Th>title</Th>
                <Th>start_date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((event: any, i: number) => (
                <Tr
                  key={i}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/event_participants/${event.id}`)}
                  _hover={{ bg: "gray.50" }}
                >
                  <Td>{event.id.toString()}</Td>
                  <Td maxW="300px" whiteSpace="normal" wordBreak="break-word">
                    <Highlight text={event.title} highlight={highlight} />
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
