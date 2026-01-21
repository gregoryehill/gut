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
        <SelectTrigger className="w-full sm:w-[140px] h-11">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>👥</span>
              <span>{value} people</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {SERVINGS_OPTIONS.map((num) => (
            <SelectItem key={num} value={num.toString()} className="py-2.5">
              <span className="flex items-center gap-2">
                <span>👥</span>
                <span>{num} people</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
