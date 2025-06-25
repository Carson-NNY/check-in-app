import { Spinner, Flex, Text } from "@chakra-ui/react";

// simple loading component for all the server fetching (spinner)
export default function Loading() {
  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      direction="column"
      gap={4}
    >
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="lg"
      />
      <Text fontSize="lg" color="gray.600">
        Loading...
      </Text>
    </Flex>
  );
}
