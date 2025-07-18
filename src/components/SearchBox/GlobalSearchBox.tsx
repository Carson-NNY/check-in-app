import { useState, useEffect, use } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

type GlobalSearchBoxProps = {
  handleRenderEventList: () => void;
  setOriginalList: (list: any[]) => void;
  setIsLoading: (loading: boolean) => void;
  placeholder: string;
};

export default function GlobalSearchBox({
  handleRenderEventList,
  setOriginalList,
  setIsLoading,
  placeholder,
}: GlobalSearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!searchTerm.trim()) {
      handleRenderEventList();
    }
  }, [searchTerm]);

  const handleSearch = async (eventId: string) => {
    try {
      setIsLoading(true);
      const event = await fetch(`/api/events/${eventId}`);
      const eventData = await event.json();
      if (eventData) {
        setOriginalList(Array.isArray(eventData) ? eventData : []);
      } else {
        setOriginalList([]);
      }
    } catch (error) {
      console.error("Failed to navigate:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear the search input and refetch the original list
  const handleClear = () => {
    setSearchTerm("");
    handleRenderEventList();
  };

  return (
    <Flex gap={2} align="center">
      <IconButton
        aria-label="Search"
        icon={<SearchIcon />}
        onClick={() => {
          handleSearch(searchTerm);
        }}
        colorScheme="teal"
        disabled={!searchTerm.trim()}
      />
      <InputGroup maxW="330px" w="100%">
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          variant="filled"
          size="lg"
          paddingRight="48px"
        />
        {searchTerm && (
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
    </Flex>
  );
}
