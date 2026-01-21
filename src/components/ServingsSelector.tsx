'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SERVINGS_OPTIONS } from '@/types';

interface ServingsSelectorProps {
  value: number;
  onChange: (servings: number) => void;
}

export function ServingsSelector({ value, onChange }: ServingsSelectorProps) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-0 sm:flex-none">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Servings
      </label>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger className="w-full sm:w-[120px] h-11">
          <SelectValue>
            {value} {value === 1 ? 'serving' : 'servings'}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SERVINGS_OPTIONS.map((num) => (
            <SelectItem key={num} value={num.toString()} className="py-2.5">
              {num} servings
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
