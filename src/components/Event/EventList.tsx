import { useRouter } from "next/navigation";

export default function EventList({ events = [] }: { events: any[] }) {
  const router = useRouter();

  return (
    <div>
      <h1>Events</h1>
      {events.map((p: any, i: number) => (
        <div key={i}>
          <button onClick={() => router.push(`/event_participants/${p.id}`)}>
            event_id: {p.id}
          </button>
          , title: {p.title}, - date: start: {p.start_date}
        </div>
      ))}
    </div>
  );
}
