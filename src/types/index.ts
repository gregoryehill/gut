export type IngredientCategory = 'fat' | 'foundation' | 'feature' | 'flavor' | 'finish';

export type Season = 'spring' | 'summer' | 'fall' | 'winter';

export interface Cuisine {
  id: string;
  name: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: IngredientCategory;
  tags: string[];
}

export interface SelectedIngredients {
  fat: Ingredient | null;
  foundation: Ingredient | null;
  feature: Ingredient | null;
  flavor: Ingredient | null;
  finish: Ingredient | null;
}

// Tracks a specialty "upgrade" suggestion for each category
export interface SpecialtySuggestions {
  fat: Ingredient | null;
  foundation: Ingredient | null;
  feature: Ingredient | null;
  flavor: Ingredient | null;
  finish: Ingredient | null;
}

export interface LockedIngredients {
  fat: boolean;
  foundation: boolean;
  feature: boolean;
  flavor: boolean;
  finish: boolean;
}

export interface RecipeRequest {
  cuisine: string;
  season: Season;
  servings: number;
  ingredients: SelectedIngredients;
}

export interface FeedbackEntry {
  id: string;
  recipe_inputs: RecipeRequest;
  created_at: string;
}

export interface SavedRecipe {
  id: string;
  cuisine: string;
  season: Season;
  servings: number;
  ingredients: SelectedIngredients;
  recipe_text: string;
  created_at: string;
}

export const INGREDIENT_CATEGORIES: IngredientCategory[] = [
  'fat',
  'foundation',
  'feature',
  'flavor',
  'finish',
];

export const CATEGORY_LABELS: Record<IngredientCategory, string> = {
  fat: 'Fat',
  foundation: 'Foundation',
  feature: 'Feature',
  flavor: 'Flavor',
  finish: 'Finish',
};

export const CATEGORY_DESCRIPTIONS: Record<IngredientCategory, string> = {
  fat: 'The cooking medium',
  foundation: 'Aromatics & base',
  feature: 'The star',
  flavor: 'Sauces & liquids',
  finish: 'Brightness & balance',
};

export const SERVINGS_OPTIONS = [1, 2, 4, 6, 8] as const;
