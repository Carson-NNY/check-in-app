type EventFiltersProps = {
  year: string;
  month: string;
  day: string;
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
  onSearch: () => void;
};

export default function DateFilters({
  year,
  month,
  day,
  onYearChange,
  onMonthChange,
  onDayChange,
  onSearch,
}: EventFiltersProps) {
  const currentYear = new Date().getFullYear();

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <select value={year} onChange={(e) => onYearChange(e.target.value)}>
        <option value="">Year</option>
        {/* currently display 30 years: starting from 2015 to 2044 */}
        {Array.from({ length: 30 }, (_, i) => currentYear - 10 + i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      <select
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        disabled={!year}
      >
        <option value="">Month</option>
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
          <option key={m} value={String(m).padStart(2, "0")}>
            {String(m).padStart(2, "0")}
          </option>
        ))}
      </select>

      <select
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        disabled={!year || !month}
      >
        <option value="">Day</option>
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
          <option key={d} value={String(d).padStart(2, "0")}>
            {String(d).padStart(2, "0")}
          </option>
        ))}
      </select>

      <button onClick={onSearch}>Search</button>
    </div>
  );
}
