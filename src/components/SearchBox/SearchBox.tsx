import { Input, Flex } from "@chakra-ui/react";

type SearchBoxProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBox({ search, setSearch }: SearchBoxProps) {
  return (
    <Flex align="center" gap={2} margin={2}>
      Search:
      <Input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        width="320px"
      />
    </Flex>
  );
}
