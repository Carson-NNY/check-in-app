type SearchBoxProps = {
  search: string;
  setSearch: (value: string) => void;
};

export default function SearchBox({ search, setSearch }: SearchBoxProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          margin: "15px 5px 2px 0",
          borderRadius: "7px",
          padding: "2px",
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}
