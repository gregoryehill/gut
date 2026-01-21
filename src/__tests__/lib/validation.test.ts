import { describe, expect, test } from 'bun:test';
import {
  generateRecipeSchema,
  saveRecipeSchema,
  feedbackSchema,
  recipeIdSchema,
} from '@/lib/validation';

// Valid test data
const validIngredient = {
  id: '123',
  name: 'Olive oil',
  category: 'fat' as const,
  tags: ['italian'],
};

const validIngredients = {
  fat: validIngredient,
  foundation: { name: 'Onion and garlic' },
  feature: { name: 'Chicken breast' },
  flavor: { name: 'White wine' },
  finish: { name: 'Fresh basil' },
};

describe('generateRecipeSchema', () => {
  test('accepts valid input', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('accepts all valid seasons', () => {
    const seasons = ['spring', 'summer', 'fall', 'winter'];

    for (const season of seasons) {
      const input = {
        cuisine: 'Italian',
        season,
        servings: 4,
        ingredients: validIngredients,
      };
      const result = generateRecipeSchema.safeParse(input);
      expect(result.success).toBe(true);
    }
  });

  test('rejects invalid season', () => {
    const input = {
      cuisine: 'Italian',
      season: 'autumn', // should be 'fall'
      servings: 4,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('accepts servings from 1 to 12', () => {
    for (let servings = 1; servings <= 12; servings++) {
      const input = {
        cuisine: 'Italian',
        season: 'summer',
        servings,
        ingredients: validIngredients,
      };
      const result = generateRecipeSchema.safeParse(input);
      expect(result.success).toBe(true);
    }
  });

  test('rejects servings less than 1', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 0,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects servings greater than 12', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 13,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects non-integer servings', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 2.5,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects cuisine with invalid characters', () => {
    const input = {
      cuisine: 'Italian<script>alert(1)</script>',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('accepts cuisine with allowed punctuation', () => {
    const input = {
      cuisine: "American (Southern)",
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('rejects empty cuisine', () => {
    const input = {
      cuisine: '',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects cuisine longer than 100 characters', () => {
    const input = {
      cuisine: 'A'.repeat(101),
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects missing ingredients', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: {
        fat: validIngredient,
        // missing other categories
      },
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects ingredient with invalid name characters', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: {
        ...validIngredients,
        fat: { name: 'Olive <script>oil' },
      },
    };

    const result = generateRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('saveRecipeSchema', () => {
  test('accepts valid input', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
      recipe_text: 'This is a test recipe with some content.',
    };

    const result = saveRecipeSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('rejects empty recipe_text', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
      recipe_text: '',
    };

    const result = saveRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects recipe_text longer than 50000 characters', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
      recipe_text: 'A'.repeat(50001),
    };

    const result = saveRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('accepts recipe_text at max length', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
      recipe_text: 'A'.repeat(50000),
    };

    const result = saveRecipeSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('rejects missing recipe_text', () => {
    const input = {
      cuisine: 'Italian',
      season: 'summer',
      servings: 4,
      ingredients: validIngredients,
    };

    const result = saveRecipeSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('feedbackSchema', () => {
  test('accepts valid positive feedback', () => {
    const input = {
      recipe_inputs: {
        cuisine: 'Italian',
        season: 'summer',
        servings: 4,
        ingredients: validIngredients,
      },
      recipe_text: 'Test recipe text',
      rating: 'positive',
    };

    const result = feedbackSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('accepts valid negative feedback', () => {
    const input = {
      recipe_inputs: {
        cuisine: 'Italian',
        season: 'summer',
        servings: 4,
        ingredients: validIngredients,
      },
      recipe_text: 'Test recipe text',
      rating: 'negative',
    };

    const result = feedbackSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('accepts feedback without recipe_text (optional)', () => {
    const input = {
      recipe_inputs: {
        cuisine: 'Italian',
        season: 'summer',
        servings: 4,
        ingredients: validIngredients,
      },
      rating: 'positive',
    };

    const result = feedbackSchema.safeParse(input);
    expect(result.success).toBe(true);
  });

  test('rejects invalid rating', () => {
    const input = {
      recipe_inputs: {
        cuisine: 'Italian',
        season: 'summer',
        servings: 4,
        ingredients: validIngredients,
      },
      rating: 'neutral',
    };

    const result = feedbackSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects missing rating', () => {
    const input = {
      recipe_inputs: {
        cuisine: 'Italian',
        season: 'summer',
        servings: 4,
        ingredients: validIngredients,
      },
    };

    const result = feedbackSchema.safeParse(input);
    expect(result.success).toBe(false);
  });

  test('rejects missing recipe_inputs', () => {
    const input = {
      rating: 'positive',
    };

    const result = feedbackSchema.safeParse(input);
    expect(result.success).toBe(false);
  });
});

describe('recipeIdSchema', () => {
  test('accepts valid alphanumeric ID', () => {
    const result = recipeIdSchema.safeParse('abc123XYZ456');
    expect(result.success).toBe(true);
  });

  test('accepts ID with hyphens', () => {
    const result = recipeIdSchema.safeParse('abc-123-xyz');
    expect(result.success).toBe(true);
  });

  test('accepts 8-character ID (minimum)', () => {
    const result = recipeIdSchema.safeParse('abcd1234');
    expect(result.success).toBe(true);
  });

  test('accepts 36-character ID (maximum)', () => {
    const result = recipeIdSchema.safeParse('a'.repeat(36));
    expect(result.success).toBe(true);
  });

  test('rejects ID shorter than 8 characters', () => {
    const result = recipeIdSchema.safeParse('abc1234');
    expect(result.success).toBe(false);
  });

  test('rejects ID longer than 36 characters', () => {
    const result = recipeIdSchema.safeParse('a'.repeat(37));
    expect(result.success).toBe(false);
  });

  test('rejects ID with special characters', () => {
    const result = recipeIdSchema.safeParse('abc123!@#');
    expect(result.success).toBe(false);
  });

  test('rejects ID with spaces', () => {
    const result = recipeIdSchema.safeParse('abc 123 xyz');
    expect(result.success).toBe(false);
  });

  test('rejects ID with underscores', () => {
    const result = recipeIdSchema.safeParse('abc_123_xyz');
    expect(result.success).toBe(false);
  });

  test('rejects empty string', () => {
    const result = recipeIdSchema.safeParse('');
    expect(result.success).toBe(false);
  });
});
