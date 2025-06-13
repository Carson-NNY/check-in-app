import { Input } from "@chakra-ui/react";

type SearchBoxProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBox({ search, setSearch }: SearchBoxProps) {
  return (
    <div>
      <Input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}
