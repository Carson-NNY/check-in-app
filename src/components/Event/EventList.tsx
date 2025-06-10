import { useRouter } from "next/navigation";

export default function EventList({ events = [] }: { events: any[] }) {
  const router = useRouter();

  return (
    <div>
      <h1>Events</h1>
      {events.map((p: any, i: number) => (
        <div key={i} style={{ marginBottom: 5 }}>
          <button onClick={() => router.push(`/event_participants/${p.id}`)}>
            event_id: {p.id}
          </button>
          , title: {p.title}, - date: start: {p.start_date}
        </div>
      ))}
    </div>
  );
}

// import { useRouter } from "next/navigation";
// import { Highlight } from "../Highlight/Highlight"; // Adjust the import path as needed

// type EventListProps = {
//   events: any[];
//   highlight: string;
// };

// export default function EventList({ events, highlight }: EventListProps) {
//   const router = useRouter();

//   return (
//     <div>
//       <h1>Events</h1>
//       {events.length === 0 ? (
//         <p>No events found.</p>
//       ) : (
//         events.map((p: any, i: number) => (
//           <div key={i} style={{ marginBottom: "10px" }}>
//             <button onClick={() => router.push(`/event_participants/${p.id}`)}>
//               event_id:{" "}
//               <Highlight text={p.id.toString()} highlight={highlight} />
//             </button>
//             , title: <Highlight text={p.title} highlight={highlight} />, - date:
//             start: <Highlight text={p.start_date} highlight={highlight} />
//           </div>
//         ))
//       )}
//     </div>
//   );
// }
