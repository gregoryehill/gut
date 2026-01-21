'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Season } from '@/types';

interface SeasonSelectorProps {
  value: Season;
  onChange: (season: Season) => void;
}

const SEASON_CONFIG: { value: Season; label: string }[] = [
  { value: 'spring', label: 'Spring' },
  { value: 'summer', label: 'Summer' },
  { value: 'fall', label: 'Fall' },
  { value: 'winter', label: 'Winter' },
];

export function SeasonSelector({ value, onChange }: SeasonSelectorProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-none">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Season
      </label>
      <Select value={value} onValueChange={(val) => onChange(val as Season)}>
        <SelectTrigger className="w-full sm:w-[140px] h-11">
          <SelectValue>
            {SEASON_CONFIG.find((s) => s.value === value)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SEASON_CONFIG.map((season) => (
            <SelectItem key={season.value} value={season.value} className="py-2.5">
              {season.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
