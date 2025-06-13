import { Highlight } from "@chakra-ui/react";

type HighlightProps = {
  text: string;
  highlight: string;
};

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
