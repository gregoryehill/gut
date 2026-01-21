import { z } from 'zod';

// Sanitize string input - allow alphanumeric, spaces, and common punctuation
const sanitizedString = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9\s,.\-'&()]+$/, 'Invalid characters in input');

// Ingredient schema - validates name only since we just need the name for recipe generation
const ingredientSchema = z.object({
  id: z.string().optional(),
  name: sanitizedString,
  category: z.enum(['fat', 'foundation', 'feature', 'flavor', 'finish']).optional(),
  tags: z.array(z.string()).optional(),
});

// Selected ingredients schema - all five are required
const selectedIngredientsSchema = z.object({
  fat: ingredientSchema,
  foundation: ingredientSchema,
  feature: ingredientSchema,
  flavor: ingredientSchema,
  finish: ingredientSchema,
});

// Season must be one of the valid options
const seasonSchema = z.enum(['spring', 'summer', 'fall', 'winter']);

// Servings must be a reasonable number
const servingsSchema = z.number().int().min(1).max(12);

// Cuisine name - sanitized string
const cuisineSchema = sanitizedString;

// Recipe generation request schema
export const generateRecipeSchema = z.object({
  cuisine: cuisineSchema,
  season: seasonSchema,
  servings: servingsSchema,
  ingredients: selectedIngredientsSchema,
});

// Save recipe request schema - includes recipe text
export const saveRecipeSchema = z.object({
  cuisine: cuisineSchema,
  season: seasonSchema,
  servings: servingsSchema,
  ingredients: selectedIngredientsSchema,
  recipe_text: z.string().min(1).max(50000), // Recipe text from AI
});

// Feedback request schema
export const feedbackSchema = z.object({
  recipe_inputs: z.object({
    cuisine: cuisineSchema,
    season: seasonSchema,
    servings: servingsSchema,
    ingredients: selectedIngredientsSchema,
  }),
  recipe_text: z.string().min(1).max(50000).optional(),
  rating: z.enum(['positive', 'negative']),
});

// Recipe ID schema - alphanumeric, URL-safe
export const recipeIdSchema = z
  .string()
  .min(8)
  .max(36)
  .regex(/^[a-zA-Z0-9\-]+$/, 'Invalid recipe ID format');

// Type exports
export type GenerateRecipeInput = z.infer<typeof generateRecipeSchema>;
export type SaveRecipeInput = z.infer<typeof saveRecipeSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
