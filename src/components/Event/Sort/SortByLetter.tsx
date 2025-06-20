import { FaArrowDownShortWide, FaArrowUpShortWide } from "react-icons/fa6";
import Button from "@/components/Button/Button";
import { TbArrowsSort } from "react-icons/tb";

type SortByLetter = "ASC" | "DESC" | null;

type SortByLetterProps = {
  sortList: any[];
  setSortList: (events: any[]) => void;
  sortOrder: SortByLetter;
  setSortOrder: (sortBy: SortByLetter) => void;
  sortTarget:
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
    // 1) choose the next sort state
    const next: SortByLetter =
      sortOrder === null ? "ASC" : sortOrder === "ASC" ? "DESC" : "ASC";
    setSortOrder(next);

    // 2) reorder (or reset) the array based on the next sort state and the target field
    setSortList(
      [...sortList].sort((a, b) => {
        switch (sortTarget) {
          case "eventTitle":
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();

            return next === "ASC"
              ? aTitle.localeCompare(bTitle, undefined, {
                  ignorePunctuation: true,
                })
              : bTitle.localeCompare(aTitle, undefined, {
                  ignorePunctuation: true,
                });
          case "participantFirstName":
            const aFirstName = a["contact_id.first_name"].toLowerCase();
            const bFirstName = b["contact_id.first_name"].toLowerCase();
            return next === "ASC"
              ? aFirstName.localeCompare(bFirstName, undefined, {
                  ignorePunctuation: true,
                })
              : bFirstName.localeCompare(aFirstName, undefined, {
                  ignorePunctuation: true,
                });
          case "participantLastName":
            const aLastName = a["contact_id.last_name"].toLowerCase();
            const bLastName = b["contact_id.last_name"].toLowerCase();
            return next === "ASC"
              ? aLastName.localeCompare(bLastName, undefined, {
                  ignorePunctuation: true,
                })
              : bLastName.localeCompare(aLastName, undefined, {
                  ignorePunctuation: true,
                });
          case "participantStatus":
            const aStatus = a["status_id:label"].toLowerCase();
            const bStatus = b["status_id:label"].toLowerCase();
            // use DSEC here since we want the first click of the currentStatus button to sort
            // the list so that the "Attended" status is at the bottom of the list (green check-in button on the top)
            return next === "DESC"
              ? aStatus.localeCompare(bStatus, undefined, {
                  ignorePunctuation: true,
                })
              : bStatus.localeCompare(aStatus, undefined, {
                  ignorePunctuation: true,
                });
          default:
            console.warn(
              `SortByTitle: Unknown sort target "${sortTarget}". Defaulting to no sort.`
            );
            return 0; // no sort
        }
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
