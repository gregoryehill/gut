'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Cuisine } from '@/types';

// Map cuisine names to country flag emojis
const CUISINE_EMOJIS: Record<string, string> = {
  'Thai': '🇹🇭',
  'Italian': '🇮🇹',
  'Mexican': '🇲🇽',
  'American (Southern)': '🇺🇸',
  'Indian': '🇮🇳',
  'Chinese': '🇨🇳',
};

function getCuisineEmoji(name: string): string {
  return CUISINE_EMOJIS[name] ?? '🍽️';
}

interface CuisineSelectorProps {
  cuisines: Cuisine[];
  value: string | null;
  onChange: (cuisineId: string) => void;
  onRandomize: () => void;
}

export function CuisineSelector({
  cuisines,
  value,
  onChange,
  onRandomize,
}: CuisineSelectorProps) {
  const handleChange = (val: string) => {
    if (val === 'random') {
      onRandomize();
    } else {
      onChange(val);
    }
  };

  const selectedCuisine = cuisines.find((c) => c.id === value);

  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-none">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Cuisine
      </label>
      <Select value={value ?? undefined} onValueChange={handleChange}>
        <SelectTrigger className="w-full sm:w-[200px] h-11">
          <SelectValue placeholder="Select cuisine">
            {selectedCuisine && (
              <span className="flex items-center gap-2">
                <span>{getCuisineEmoji(selectedCuisine.name)}</span>
                <span>{selectedCuisine.name}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="random" className="py-2.5">
            <span className="flex items-center gap-2">
              <span>🎲</span>
              <span>Random</span>
            </span>
          </SelectItem>
          {cuisines.map((cuisine) => (
            <SelectItem key={cuisine.id} value={cuisine.id} className="py-2.5">
              <span className="flex items-center gap-2">
                <span>{getCuisineEmoji(cuisine.name)}</span>
                <span>{cuisine.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
