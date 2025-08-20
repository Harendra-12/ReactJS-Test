import * as React from "react";
import { format, setHours, setMinutes, getHours, getMinutes } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export function DateTimePicker({ value, onChange, defaultValue, minDate }) {
  const minSelectableDate = minDate || new Date();

  const [localDate, setLocalDate] = React.useState(defaultValue || null);

  const [hour, setHour] = React.useState("12");
  const [minute, setMinute] = React.useState("00");
  const [ampm, setAmpm] = React.useState("AM");

  // Update time fields from external value (for default or controlled usage)
  React.useEffect(() => {
    if (value) {
      const h = getHours(value);
      const m = getMinutes(value);
      setHour(String(((h + 11) % 12) + 1).padStart(2, "0"));
      setMinute(String(m).padStart(2, "0"));
      setAmpm(h >= 12 ? "PM" : "AM");
      setLocalDate(value);
    }
  }, [value]);

  const handleDateChange = (selectedDate) => {
    if (!selectedDate) return;

    let h = parseInt(hour);
    const m = parseInt(minute);

    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;

    const updatedDate = setMinutes(setHours(selectedDate, h), m);
    setLocalDate(updatedDate);
    onChange?.(updatedDate);
  };

  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !localDate && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {localDate ? (
            format(localDate, "PPP p")
          ) : (
            <span>Pick a date & time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4" align="start">
        <Calendar
          mode="single"
          selected={localDate}
          onSelect={handleDateChange}
          initialFocus
          disabled={(date) =>
            date < new Date(minSelectableDate.setHours(0, 0, 0, 0))
          }
        />
        <div className="flex items-center gap-2">
          {/* Hour Picker */}
          <Select
            value={hour}
            onValueChange={(val) => {
              setHour(val);
              handleDateChange(localDate);
            }}
          >
            <SelectTrigger className="w-[75px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {hours.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Minute Picker */}
          <Select
            value={minute}
            onValueChange={(val) => {
              setMinute(val);
              handleDateChange(localDate);
            }}
          >
            <SelectTrigger className="w-[75px]">
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[150px]">
                {minutes.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>

          {/* AM/PM Picker */}
          <Select
            value={ampm}
            onValueChange={(val) => {
              setAmpm(val);
              handleDateChange(localDate);
            }}
          >
            <SelectTrigger className="w-[75px]">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
