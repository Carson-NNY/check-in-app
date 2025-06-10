type HighlightProps = {
  text: string;
  highlight: string;
};

export function Highlight({ text, highlight }: HighlightProps) {
  if (!highlight) return <>{text}</>;

  // escape special regex chars in the highlight term
  const escaped = highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");

  // split on the term and wrap matches in <mark>
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? <mark key={i}>{part}</mark> : part
      )}
    </>
  );
}
