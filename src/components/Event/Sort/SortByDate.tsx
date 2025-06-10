type SortOrder = "ASC" | "DESC" | null;

type SortByDateProps = {
  eventList: any[];
  setEventList: (events: any[]) => void;
  sortByDate: SortOrder;
  setSortByDate: (sortBy: SortOrder) => void;
};

export default function SortByDate({
  eventList,
  setEventList,
  sortByDate,
  setSortByDate,
}: SortByDateProps) {
  const handleSort = () => {
    // 1) choose the next sort state
    const next: SortOrder =
      sortByDate === null ? "ASC" : sortByDate === "ASC" ? "DESC" : "ASC";
    setSortByDate(next);

    // 2) reorder (or reset) the array
    setEventList(
      [...eventList].sort((a, b) => {
        // adjust these to match your actual field name:
        const aTime = new Date(a.start_date).getTime();
        const bTime = new Date(b.start_date).getTime();

        // ascending = earliest first, descending = latest first
        return next === "ASC" ? aTime - bTime : bTime - aTime;
      })
    );
  };

  return (
    <button onClick={handleSort}>
      Sort by Date{" "}
      {sortByDate === "ASC" ? "↑" : sortByDate === "DESC" ? "↓" : ""}
    </button>
  );
}
