'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Cuisine } from '@/types';

const CUISINE_FLAGS: Record<string, string> = {
  'Thai': '\u{1F1F9}\u{1F1ED}',
  'Italian': '\u{1F1EE}\u{1F1F9}',
  'Mexican': '\u{1F1F2}\u{1F1FD}',
  'American (Southern)': '\u{1F1FA}\u{1F1F8}',
  'Indian': '\u{1F1EE}\u{1F1F3}',
  'Chinese': '\u{1F1E8}\u{1F1F3}',
  'Japanese': '\u{1F1EF}\u{1F1F5}',
  'French': '\u{1F1EB}\u{1F1F7}',
  'Greek': '\u{1F1EC}\u{1F1F7}',
  'Korean': '\u{1F1F0}\u{1F1F7}',
  'Vietnamese': '\u{1F1FB}\u{1F1F3}',
  'Spanish': '\u{1F1EA}\u{1F1F8}',
};

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
                <span>{CUISINE_FLAGS[selectedCuisine.name] ?? ''}</span>
                <span>{selectedCuisine.name}</span>
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="random" className="py-2.5">
            Surprise me
          </SelectItem>
          {cuisines.map((cuisine) => (
            <SelectItem key={cuisine.id} value={cuisine.id} className="py-2.5">
              <span className="flex items-center gap-2">
                <span>{CUISINE_FLAGS[cuisine.name] ?? ''}</span>
                <span>{cuisine.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
