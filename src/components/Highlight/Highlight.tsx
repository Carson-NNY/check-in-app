import { Highlight } from "@chakra-ui/react";

type HighlightProps = {
  text: string;
  highlight: string;
};

// A component to highlight search terms in a given text
export function HighlightComponent({ text, highlight }: HighlightProps) {
  return (
    <>
      <Highlight
        query={highlight}
        styles={{ px: "1", py: "1", bg: "orange.100" }}
      >
        {text}
      </Highlight>
    </>
  );
}
