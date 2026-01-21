import { describe, expect, test } from 'bun:test';
import { getCurrentSeason, SEASON_LABELS, SEASONS } from '@/utils/season';

describe('getCurrentSeason', () => {
  // Test boundary dates for each season

  describe('Spring boundaries (Mar 20 - Jun 20)', () => {
    test('Mar 19 is winter', () => {
      const date = new Date(2024, 2, 19); // March 19
      expect(getCurrentSeason(date)).toBe('winter');
    });

    test('Mar 20 is spring (first day)', () => {
      const date = new Date(2024, 2, 20); // March 20
      expect(getCurrentSeason(date)).toBe('spring');
    });

    test('Jun 20 is spring (last day)', () => {
      const date = new Date(2024, 5, 20); // June 20
      expect(getCurrentSeason(date)).toBe('spring');
    });

    test('Jun 21 is summer', () => {
      const date = new Date(2024, 5, 21); // June 21
      expect(getCurrentSeason(date)).toBe('summer');
    });
  });

  describe('Summer boundaries (Jun 21 - Sep 21)', () => {
    test('Jun 21 is summer (first day)', () => {
      const date = new Date(2024, 5, 21); // June 21
      expect(getCurrentSeason(date)).toBe('summer');
    });

    test('Sep 21 is summer (last day)', () => {
      const date = new Date(2024, 8, 21); // September 21
      expect(getCurrentSeason(date)).toBe('summer');
    });

    test('Sep 22 is fall', () => {
      const date = new Date(2024, 8, 22); // September 22
      expect(getCurrentSeason(date)).toBe('fall');
    });
  });

  describe('Fall boundaries (Sep 22 - Dec 20)', () => {
    test('Sep 22 is fall (first day)', () => {
      const date = new Date(2024, 8, 22); // September 22
      expect(getCurrentSeason(date)).toBe('fall');
    });

    test('Dec 20 is fall (last day)', () => {
      const date = new Date(2024, 11, 20); // December 20
      expect(getCurrentSeason(date)).toBe('fall');
    });

    test('Dec 21 is winter', () => {
      const date = new Date(2024, 11, 21); // December 21
      expect(getCurrentSeason(date)).toBe('winter');
    });
  });

  describe('Winter boundaries (Dec 21 - Mar 19)', () => {
    test('Dec 21 is winter (first day)', () => {
      const date = new Date(2024, 11, 21); // December 21
      expect(getCurrentSeason(date)).toBe('winter');
    });

    test('Jan 1 is winter', () => {
      const date = new Date(2024, 0, 1); // January 1
      expect(getCurrentSeason(date)).toBe('winter');
    });

    test('Feb 15 is winter', () => {
      const date = new Date(2024, 1, 15); // February 15
      expect(getCurrentSeason(date)).toBe('winter');
    });

    test('Mar 19 is winter (last day)', () => {
      const date = new Date(2024, 2, 19); // March 19
      expect(getCurrentSeason(date)).toBe('winter');
    });
  });

  describe('mid-season dates', () => {
    test('April 15 is spring', () => {
      const date = new Date(2024, 3, 15);
      expect(getCurrentSeason(date)).toBe('spring');
    });

    test('July 15 is summer', () => {
      const date = new Date(2024, 6, 15);
      expect(getCurrentSeason(date)).toBe('summer');
    });

    test('October 15 is fall', () => {
      const date = new Date(2024, 9, 15);
      expect(getCurrentSeason(date)).toBe('fall');
    });

    test('January 15 is winter', () => {
      const date = new Date(2024, 0, 15);
      expect(getCurrentSeason(date)).toBe('winter');
    });
  });

  test('defaults to current date when no argument provided', () => {
    const result = getCurrentSeason();
    expect(SEASONS).toContain(result);
  });
});

describe('SEASON_LABELS', () => {
  test('has all four seasons', () => {
    expect(Object.keys(SEASON_LABELS)).toHaveLength(4);
  });

  test('has correct labels', () => {
    expect(SEASON_LABELS.spring).toBe('Spring');
    expect(SEASON_LABELS.summer).toBe('Summer');
    expect(SEASON_LABELS.fall).toBe('Fall');
    expect(SEASON_LABELS.winter).toBe('Winter');
  });
});

describe('SEASONS', () => {
  test('contains all four seasons', () => {
    expect(SEASONS).toHaveLength(4);
    expect(SEASONS).toContain('spring');
    expect(SEASONS).toContain('summer');
    expect(SEASONS).toContain('fall');
    expect(SEASONS).toContain('winter');
  });

  test('seasons are in order', () => {
    expect(SEASONS).toEqual(['spring', 'summer', 'fall', 'winter']);
  });
});
