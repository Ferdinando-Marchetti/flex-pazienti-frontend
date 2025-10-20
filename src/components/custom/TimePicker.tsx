import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
  start?: string; // es. "06:00"
  end?: string;   // es. "23:45"
  step?: number;  // minuti (default 15)
}

export function TimePicker({ value, onChange, start = "00:00", end = "23:45", step = 15 }: TimePickerProps) {
  const generateTimes = () => {
    const times: string[] = [];
    const [startH, startM] = start.split(":").map(Number);
    const [endH, endM] = end.split(":").map(Number);
    let current = startH * 60 + startM;
    const limit = endH * 60 + endM;

    while (current <= limit) {
      const h = Math.floor(current / 60).toString().padStart(2, "0");
      const m = (current % 60).toString().padStart(2, "0");
      times.push(`${h}:${m}`);
      current += step;
    }
    return times;
  };

  const times = generateTimes();

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue placeholder="--:--" />
      </SelectTrigger>
      <SelectContent >
        {times.map((t) => (
          <SelectItem key={t} value={t}>
            {t}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
