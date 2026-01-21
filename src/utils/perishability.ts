import type { IngredientCategory } from '@/types';

/**
 * Core staples are the versatile essentials that work across multiple cuisines.
 * These are the items every home cook should keep stocked.
 *
 * "Nice to have" items are more cuisine-specific - they unlock particular
 * flavors but aren't necessary for everyday cooking.
 */

// Manually curated list of core staples by category
// These are the versatile workhorses that apply across cuisines
const CORE_STAPLES: Record<IngredientCategory, string[]> = {
  fat: [
    'vegetable oil',
    'olive oil',
    'extra virgin olive oil',
    'butter',
  ],
  foundation: [
    'onion',
    'garlic',
    'ginger',
    'carrot',
    'shallots',
    'tomato paste',
  ],
  feature: [
    'white beans',
    'eggs',
    'chicken thighs',
    'ground beef',
    'lentils (red or yellow)',
  ],
  flavor: [
    'vegetable stock',
    'coconut milk',
    'fish sauce',
    'thai curry paste (red)',
    'bbq sauce',
    'curry powder',
  ],
  finish: [
    'lemon juice',
    'lime juice',
    'red pepper flakes',
    'honey',
    'sesame seeds',
    'sherry vinegar',
  ],
};

/**
 * Determines if an ingredient is a core staple (versatile, cross-cuisine essential)
 * vs a "nice to have" (cuisine-specific, more specialized).
 *
 * @returns true if the ingredient is NOT a core staple (i.e., it's a "nice to have")
 */
export function isPerishable(name: string, category: IngredientCategory): boolean {
  const lowerName = name.toLowerCase().trim();
  const staples = CORE_STAPLES[category];

  // Check if this ingredient matches any core staple
  // Use exact matching only - no partial/substring matching
  const isCoreStaple = staples.some(staple =>
    lowerName === staple.toLowerCase()
  );

  // Return true if NOT a core staple (meaning it's a "nice to have")
  return !isCoreStaple;
}

/**
 * Alternative function with clearer naming for future use
 */
export function isCoreStaple(name: string, category: IngredientCategory): boolean {
  return !isPerishable(name, category);
}
