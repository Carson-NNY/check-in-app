import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import Button from "@/components/Button/Button";

type SortByTitle = "ASC" | "DESC" | null;

type SortByTitleProps = {
  eventList: any[];
  setEventList: (events: any[]) => void;
  sortByTitle: SortByTitle;
  setSortByTitle: (sortBy: SortByTitle) => void;
};

export default function SortByTitle({
  eventList,
  setEventList,
  sortByTitle,
  setSortByTitle,
}: SortByTitleProps) {
  const handleSort = () => {
    // 1) choose the next sort state
    const next: SortByTitle =
      sortByTitle === null ? "ASC" : sortByTitle === "ASC" ? "DESC" : "ASC";
    setSortByTitle(next);

    // 2) reorder (or reset) the array
    setEventList(
      [...eventList].sort((a, b) => {
        // adjust these to match your actual field name:
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();

        // ascending = A-Z, descending = Z-A
        return next === "ASC"
          ? aTitle.localeCompare(bTitle, undefined, { ignorePunctuation: true })
          : bTitle.localeCompare(aTitle, undefined, {
              ignorePunctuation: true,
            });
      })
    );
  };
  return (
    <Button pattern="blueOutline" onClick={handleSort}>
      Sort by Title &nbsp;
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        {sortByTitle === "ASC" ? (
          <FaArrowUpShortWide />
        ) : sortByTitle === "DESC" ? (
          <FaArrowDownShortWide />
        ) : (
          ""
        )}
      </span>
    </Button>
  );
}
