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

const SEASON_CONFIG: { value: Season; label: string; emoji: string }[] = [
  { value: 'spring', label: 'Spring', emoji: '🌸' },
  { value: 'summer', label: 'Summer', emoji: '☀️' },
  { value: 'fall', label: 'Fall', emoji: '🍂' },
  { value: 'winter', label: 'Winter', emoji: '❄️' },
];

function getSeasonEmoji(season: Season): string {
  return SEASON_CONFIG.find((s) => s.value === season)?.emoji ?? '🌿';
}

export function SeasonSelector({ value, onChange }: SeasonSelectorProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-none">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Season
      </label>
      <Select value={value} onValueChange={(val) => onChange(val as Season)}>
        <SelectTrigger className="w-full sm:w-[150px] h-11">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{getSeasonEmoji(value)}</span>
              <span>{SEASON_CONFIG.find((s) => s.value === value)?.label}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SEASON_CONFIG.map((season) => (
            <SelectItem key={season.value} value={season.value} className="py-2.5">
              <span className="flex items-center gap-2">
                <span>{season.emoji}</span>
                <span>{season.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
