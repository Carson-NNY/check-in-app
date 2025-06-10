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
        const safeParse = (s: string) =>
          new Date(s.includes("T") ? s : s.replace(" ", "T")).getTime();

        const diff = safeParse(a.start_date) - safeParse(b.start_date);
        return next === "ASC" ? diff : -diff;
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
