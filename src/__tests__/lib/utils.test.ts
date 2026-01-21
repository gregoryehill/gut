import { describe, expect, test } from 'bun:test';
import { cn } from '@/lib/utils';

describe('cn (className utility)', () => {
  test('merges single class', () => {
    expect(cn('text-red-500')).toBe('text-red-500');
  });

  test('merges multiple classes', () => {
    const result = cn('text-red-500', 'bg-blue-500');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
  });

  test('handles conditional classes with clsx', () => {
    expect(cn('base', true && 'conditional')).toContain('conditional');
    expect(cn('base', false && 'conditional')).toBe('base');
  });

  test('handles undefined and null values', () => {
    expect(cn('base', undefined, null, 'valid')).toBe('base valid');
  });

  test('handles empty string', () => {
    expect(cn('')).toBe('');
  });

  test('handles no arguments', () => {
    expect(cn()).toBe('');
  });

  test('handles arrays of classes', () => {
    const result = cn(['class1', 'class2']);
    expect(result).toContain('class1');
    expect(result).toContain('class2');
  });

  test('merges conflicting Tailwind utilities (tailwind-merge)', () => {
    // tailwind-merge should resolve conflicts, keeping the last one
    const result = cn('text-red-500', 'text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  test('merges conflicting padding utilities', () => {
    const result = cn('p-4', 'p-2');
    expect(result).toBe('p-2');
  });

  test('merges conflicting margin utilities', () => {
    const result = cn('m-4', 'm-8');
    expect(result).toBe('m-8');
  });

  test('keeps non-conflicting utilities', () => {
    const result = cn('text-red-500', 'bg-blue-500', 'p-4');
    expect(result).toContain('text-red-500');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('p-4');
  });

  test('handles object syntax', () => {
    const result = cn({
      'text-red-500': true,
      'text-blue-500': false,
      'bg-green-500': true,
    });
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('text-blue-500');
    expect(result).toContain('bg-green-500');
  });

  test('handles mixed array and object syntax', () => {
    const result = cn(
      'base-class',
      ['array-class'],
      { 'object-class': true }
    );
    expect(result).toContain('base-class');
    expect(result).toContain('array-class');
    expect(result).toContain('object-class');
  });

  test('handles responsive utilities', () => {
    const result = cn('p-2', 'md:p-4', 'lg:p-6');
    expect(result).toContain('p-2');
    expect(result).toContain('md:p-4');
    expect(result).toContain('lg:p-6');
  });

  test('handles hover and other states', () => {
    const result = cn('bg-white', 'hover:bg-gray-100');
    expect(result).toContain('bg-white');
    expect(result).toContain('hover:bg-gray-100');
  });
});
