import { Season } from '@/types';

/**
 * Determines the current season based on the date and equinox/solstice dates.
 *
 * Spring: Mar 20 - Jun 20
 * Summer: Jun 21 - Sep 21
 * Fall: Sep 22 - Dec 20
 * Winter: Dec 21 - Mar 19
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();

  // Create a comparable number for easy date range checking
  const dateNum = month * 100 + day;

  // Spring: Mar 20 (2*100+20=220) to Jun 20 (5*100+20=520)
  if (dateNum >= 220 && dateNum <= 520) {
    return 'spring';
  }

  // Summer: Jun 21 (5*100+21=521) to Sep 21 (8*100+21=821)
  if (dateNum >= 521 && dateNum <= 821) {
    return 'summer';
  }

  // Fall: Sep 22 (8*100+22=822) to Dec 20 (11*100+20=1120)
  if (dateNum >= 822 && dateNum <= 1120) {
    return 'fall';
  }

  // Winter: Dec 21 to Mar 19 (wraps around year)
  return 'winter';
}

export const SEASON_LABELS: Record<Season, string> = {
  spring: 'Spring',
  summer: 'Summer',
  fall: 'Fall',
  winter: 'Winter',
};

export const SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter'];
