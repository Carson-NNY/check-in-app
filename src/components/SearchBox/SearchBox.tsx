import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

type SearchBoxProps = {
  search: string;
  setSearch: (value: string) => void;
  placeholder: string;
};

// A resuable search box component with a search icon and a clear button
export default function SearchBox({
  search,
  setSearch,
  placeholder,
}: SearchBoxProps) {
  const handleClear = () => {
    setSearch("");
  };

  return (
    <InputGroup>
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.400" />
      </InputLeftElement>
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        variant="filled"
        size="lg"
        paddingRight="48px"
      />
      {search && (
        <InputRightElement width="48px" height="100%">
          <IconButton
            aria-label="Clear search"
            icon={<CloseIcon />}
            size="md"
            variant="ghost"
            color="gray.500"
            _hover={{ color: "gray.700", bg: "gray.100" }}
            onClick={handleClear}
            minWidth="32px"
            height="32px"
          />
        </InputRightElement>
      )}
    </InputGroup>
  );
}
