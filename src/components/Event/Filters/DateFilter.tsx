import React from "react";
import { Flex, Select, IconButton } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import { CalendarIcon } from "@chakra-ui/icons";
import { BsSearch } from "react-icons/bs";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  year: string;
  month: string;
  day: string;
  selectedDate: Date | null;
  onYearChange: (v: string) => void;
  onMonthChange: (v: string) => void;
  onDayChange: (v: string) => void;
  onDateChange: (d: Date | null) => void;
  onSearch: () => void;
};

export default function DateFilters({
  year,
  month,
  day,
  selectedDate,
  onYearChange,
  onMonthChange,
  onDayChange,
  onDateChange,
  onSearch,
}: Props) {
  const currentYear = new Date().getFullYear();

  return (
    <Flex gap={2} align="center">
      {/* search button */}
      <IconButton
        aria-label="Search"
        icon={<BsSearch />}
        onClick={onSearch}
        colorScheme="teal"
        disabled={!year && !month && !day && !selectedDate}
      />

      {/* year dropdown */}
      <Select
        placeholder="Year"
        value={year}
        onChange={(e) => onYearChange(e.target.value)}
        width="100px"
      >
        {Array.from({ length: 30 }, (_, i) => currentYear - 10 + i).map((y) => {
          const ys = String(y);
          return (
            <option
              key={y}
              value={ys}
              onMouseDown={() => {
                if (ys === year) {
                  onMonthChange("");
                  onDayChange("");
                }
              }}
            >
              {y}
            </option>
          );
        })}
      </Select>

      {/* month dropdown */}
      <Select
        placeholder="Month"
        value={month}
        onChange={(e) => onMonthChange(e.target.value)}
        isDisabled={!year}
        width="80px"
      >
        {Array.from({ length: 12 }, (_, i) =>
          String(i + 1).padStart(2, "0")
        ).map((m) => {
          return (
            <option
              key={m}
              value={m}
              onMouseDown={() => {
                if (m === month) {
                  onDayChange("");
                }
              }}
            >
              {m}
            </option>
          );
        })}
      </Select>

      {/* day dropdown */}
      <Select
        placeholder="Day"
        value={day}
        onChange={(e) => onDayChange(e.target.value)}
        isDisabled={!year || !month}
        width="80px"
      >
        {Array.from({ length: 31 }, (_, i) =>
          String(i + 1).padStart(2, "0")
        ).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Select>

      {/* calendar icon */}
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        customInput={
          <IconButton
            aria-label="Pick date"
            icon={<CalendarIcon />}
            variant="outline"
          />
        }
        dateFormat="yyyy-MM-dd"
      />
    </Flex>
  );
}
