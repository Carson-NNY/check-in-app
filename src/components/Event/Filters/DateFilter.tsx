import { Flex, Select } from "@chakra-ui/react";
import Button from "../../Button/Button";
import { BsSearch } from "react-icons/bs";

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
    <Flex gap={2} align="center">
      <Select
        placeholder="Year"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        width="100px"
      >
        {Array.from({ length: 30 }, (_, i) => currentYear - 10 + i).map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </Select>

      <Select
        placeholder="Month"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        isDisabled={!year}
        width="80px"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
          const val = String(m).padStart(2, "0");
          return (
            <option key={m} value={val}>
              {val}
            </option>
          );
        })}
      </Select>

      <Select
        placeholder="Day"
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        isDisabled={!year || !month}
        width="80px"
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
          const val = String(d).padStart(2, "0");
          return (
            <option key={d} value={val}>
              {val}
            </option>
          );
        })}
      </Select>

      <Button pattern="teal" onClick={onSearch}>
        <Flex align="center" gap={2}>
          Search
          <BsSearch />
        </Flex>
      </Button>
    </Flex>
  );
}
