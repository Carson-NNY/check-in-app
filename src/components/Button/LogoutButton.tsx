"use client";

import { Box } from "@chakra-ui/react";
import Button from "./Button";

export default function LogoutButton() {
  return (
    <Box position="fixed" top={4} right={4} zIndex="overlay">
      <Button
        pattern="blueOutline"
        onClick={async () => {
          await fetch("/api/auth/logout");
          window.location.href = "/login";
        }}
        blurBackground={true}
      >
        Log out
      </Button>
    </Box>
  );
}
