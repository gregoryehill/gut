import { describe, expect, test } from 'bun:test';
import {
  INGREDIENT_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
  SERVINGS_OPTIONS,
} from '@/types';

describe('INGREDIENT_CATEGORIES', () => {
  test('contains all five categories', () => {
    expect(INGREDIENT_CATEGORIES).toHaveLength(5);
  });

  test('contains correct categories in order', () => {
    expect(INGREDIENT_CATEGORIES).toEqual([
      'fat',
      'foundation',
      'feature',
      'flavor',
      'finish',
    ]);
  });

  test('all categories start with "f"', () => {
    for (const category of INGREDIENT_CATEGORIES) {
      expect(category.startsWith('f')).toBe(true);
    }
  });
});

describe('CATEGORY_LABELS', () => {
  test('has label for each category', () => {
    for (const category of INGREDIENT_CATEGORIES) {
      expect(CATEGORY_LABELS[category]).toBeDefined();
    }
  });

  test('labels are capitalized', () => {
    expect(CATEGORY_LABELS.fat).toBe('Fat');
    expect(CATEGORY_LABELS.foundation).toBe('Foundation');
    expect(CATEGORY_LABELS.feature).toBe('Feature');
    expect(CATEGORY_LABELS.flavor).toBe('Flavor');
    expect(CATEGORY_LABELS.finish).toBe('Finish');
  });

  test('has exactly 5 labels', () => {
    expect(Object.keys(CATEGORY_LABELS)).toHaveLength(5);
  });
});

describe('CATEGORY_DESCRIPTIONS', () => {
  test('has description for each category', () => {
    for (const category of INGREDIENT_CATEGORIES) {
      expect(CATEGORY_DESCRIPTIONS[category]).toBeDefined();
    }
  });

  test('descriptions are non-empty strings', () => {
    for (const category of INGREDIENT_CATEGORIES) {
      expect(typeof CATEGORY_DESCRIPTIONS[category]).toBe('string');
      expect(CATEGORY_DESCRIPTIONS[category].length).toBeGreaterThan(0);
    }
  });

  test('has correct descriptions', () => {
    expect(CATEGORY_DESCRIPTIONS.fat).toBe('The cooking medium');
    expect(CATEGORY_DESCRIPTIONS.foundation).toBe('Aromatics & base');
    expect(CATEGORY_DESCRIPTIONS.feature).toBe('The star');
    expect(CATEGORY_DESCRIPTIONS.flavor).toBe('Sauces & liquids');
    expect(CATEGORY_DESCRIPTIONS.finish).toBe('Brightness & balance');
  });

  test('has exactly 5 descriptions', () => {
    expect(Object.keys(CATEGORY_DESCRIPTIONS)).toHaveLength(5);
  });
});

describe('SERVINGS_OPTIONS', () => {
  test('is a readonly array', () => {
    // This is a compile-time check, but we can verify it's an array
    expect(Array.isArray(SERVINGS_OPTIONS)).toBe(true);
  });

  test('contains expected serving sizes', () => {
    expect(SERVINGS_OPTIONS).toEqual([1, 2, 4, 6, 8]);
  });

  test('has 5 options', () => {
    expect(SERVINGS_OPTIONS).toHaveLength(5);
  });

  test('all options are positive integers', () => {
    for (const option of SERVINGS_OPTIONS) {
      expect(Number.isInteger(option)).toBe(true);
      expect(option).toBeGreaterThan(0);
    }
  });

  test('options are in ascending order', () => {
    for (let i = 1; i < SERVINGS_OPTIONS.length; i++) {
      expect(SERVINGS_OPTIONS[i]).toBeGreaterThan(SERVINGS_OPTIONS[i - 1]);
    }
  });

  test('includes 1 for single serving', () => {
    expect(SERVINGS_OPTIONS).toContain(1);
  });

  test('includes 4 as a common serving size', () => {
    expect(SERVINGS_OPTIONS).toContain(4);
  });
});
