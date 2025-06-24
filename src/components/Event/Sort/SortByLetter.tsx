import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import Button from "@/components/Button/Button";
import { TbArrowsSort } from "react-icons/tb";

type SortByLetter = "ASC" | "DESC" | null;

type SortByLetterProps = {
  sortList: any[];
  setSortList: (events: any[]) => void;
  sortOrder: SortByLetter;
  setSortOrder: (sortBy: SortByLetter) => void; // we need to update the new sort order so the ASC/DESC icon can be displayed correctly
  sortTarget: // identify which key in the object we want to sort by
  | "eventTitle"
    | "participantFirstName"
    | "participantLastName"
    | "participantStatus";
  children?: React.ReactNode;
};

export default function SortByLettparticipantStatuser({
  sortList,
  setSortList,
  sortOrder,
  setSortOrder,
  sortTarget,
  children,
}: SortByLetterProps) {
  const handleSort = () => {
    // choose the next sort state
    const next: SortByLetter =
      sortOrder === null ? "ASC" : sortOrder === "ASC" ? "DESC" : "ASC";
    setSortOrder(next);

    setSortList(
      [...sortList].sort((a, b) => {
        //  pick the two strings we want to compare
        let aKey: string, bKey: string;

        switch (sortTarget) {
          case "eventTitle":
            aKey = a.title ?? "";
            bKey = b.title ?? "";
            break;
          case "participantFirstName":
            aKey = a["contact_id.first_name"] ?? "";
            bKey = b["contact_id.first_name"] ?? "";
            break;
          case "participantLastName":
            aKey = a["contact_id.last_name"] ?? "";
            bKey = b["contact_id.last_name"] ?? "";
            break;
          case "participantStatus":
            aKey = a["status_id:label"] ?? "";
            bKey = b["status_id:label"] ?? "";
            // define the custom order for ASC (Registered first, Attended second for better check-in efficiency)
            const orderAsc = ["Registered", "Attended"];
            // any unknown statuses go to the bottom
            const defaultRank = orderAsc.length;
            const aRank =
              orderAsc.indexOf(aKey) !== -1
                ? orderAsc.indexOf(aKey)
                : defaultRank;
            const bRank =
              orderAsc.indexOf(bKey) !== -1
                ? orderAsc.indexOf(bKey)
                : defaultRank;

            return next === "ASC" ? aRank - bRank : bRank - aRank;
          default:
            return 0; // no sorting if we don’t recognize the key
        }
        // Normalize to lowercase for a case-insensitive compare
        aKey = aKey.toLowerCase();
        bKey = bKey.toLowerCase();

        // empty goes to bottom:
        if (!aKey && bKey) return 1; // a is empty, b is not ⇒ a should come _after_
        if (!bKey && aKey) return -1;

        return next === "ASC"
          ? aKey.localeCompare(bKey, undefined, { ignorePunctuation: true })
          : bKey.localeCompare(aKey, undefined, { ignorePunctuation: true });
      })
    );
  };
  return (
    <Button pattern="blueOutline" onClick={handleSort}>
      {children} &nbsp;
      <span style={{ display: "inline-flex", alignItems: "center" }}>
        {sortOrder === "ASC" ? (
          <FaArrowUpShortWide />
        ) : sortOrder === "DESC" ? (
          <FaArrowDownShortWide />
        ) : (
          <TbArrowsSort />
        )}
      </span>
    </Button>
  );
}
