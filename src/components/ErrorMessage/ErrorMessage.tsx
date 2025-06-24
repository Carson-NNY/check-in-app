import {
  Alert,
  AlertIcon,
  AlertDescription,
  useDisclosure,
  CloseButton,
  Box,
} from "@chakra-ui/react";
import {} from "@chakra-ui/react";

type ErrorMessageProps = {
  error: string | null;
  setError: (error: string | null) => void;
};

// A component to display error messages in an alert box when there's an error (error prop is not null)
export default function ErrorMessage({ error, setError }: ErrorMessageProps) {
  const { onClose } = useDisclosure({ defaultIsOpen: false });

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return error ? (
    <Alert status="error" variant="left-accent">
      <AlertIcon />
      <Box>
        <AlertDescription>
          There was an error processing your request: {error}
        </AlertDescription>
      </Box>
      <CloseButton
        alignSelf="flex-start"
        position="relative"
        right={-1}
        top={-1}
        onClick={handleClose}
      />
    </Alert>
  ) : (
    <></>
  );
}
