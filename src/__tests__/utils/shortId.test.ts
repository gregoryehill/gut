import { describe, expect, test } from 'bun:test';
import { generateShortId } from '@/utils/shortId';

describe('generateShortId', () => {
  test('generates a 12-character ID', () => {
    const id = generateShortId();
    expect(id).toHaveLength(12);
  });

  test('generates only alphanumeric characters (base62)', () => {
    const id = generateShortId();
    expect(id).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test('generates unique IDs', () => {
    const ids = new Set<string>();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      ids.add(generateShortId());
    }

    // All IDs should be unique
    expect(ids.size).toBe(iterations);
  });

  test('has good character distribution', () => {
    const charCounts: Record<string, number> = {};
    const iterations = 10000;

    for (let i = 0; i < iterations; i++) {
      const id = generateShortId();
      for (const char of id) {
        charCounts[char] = (charCounts[char] || 0) + 1;
      }
    }

    // All 62 characters should appear
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (const char of alphabet) {
      expect(charCounts[char]).toBeGreaterThan(0);
    }

    // Check that no character is dramatically over/under represented
    const totalChars = iterations * 12;
    const expectedCountPerChar = totalChars / 62;
    const allowedDeviation = expectedCountPerChar * 0.5; // 50% deviation allowed

    for (const char of alphabet) {
      const count = charCounts[char];
      expect(count).toBeGreaterThan(expectedCountPerChar - allowedDeviation);
      expect(count).toBeLessThan(expectedCountPerChar + allowedDeviation);
    }
  });

  test('does not include special characters', () => {
    for (let i = 0; i < 100; i++) {
      const id = generateShortId();
      expect(id).not.toMatch(/[^a-zA-Z0-9]/);
    }
  });
});
