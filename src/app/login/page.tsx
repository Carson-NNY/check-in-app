"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Flex,
  Card,
  CardHeader,
  CardBody,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";

import { PinInput, PinInputField } from "@chakra-ui/pin-input";

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const bg = useColorModeValue("gray.50", "gray.700");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pin }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      setError("Incorrect PIN.");
    }
  }

  useEffect(() => {
    // Clear error message on component mount
    setError("");
  }, [pin]);

  return (
    <Flex align="center" justify="center" minH="100vh" bg={bg} px={4}>
      <Card w="full" maxW="md" shadow="lg">
        <CardHeader textAlign="center">
          <Heading size="lg">Please Log In</Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin}>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <HStack justify="center">
                <PinInput value={pin} mask onChange={(val) => setPin(val)}>
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                  <PinInputField />
                </PinInput>
              </HStack>
            </FormControl>

            {error && (
              <Text color="red.500" mt={2} textAlign="center">
                {error}
              </Text>
            )}

            <Button type="submit" mt={4} colorScheme="blue" w="full">
              Login
            </Button>
          </form>
        </CardBody>
      </Card>
    </Flex>
  );
}
