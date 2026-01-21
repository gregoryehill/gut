import { NextRequest, NextResponse } from 'next/server';
import { anthropic, RECIPE_SYSTEM_PROMPT } from '@/lib/anthropic';
import type { RecipeRequest } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: RecipeRequest = await request.json();
    const { cuisine, season, servings, ingredients } = body;

    // Validate all ingredients are present
    if (
      !ingredients.fat ||
      !ingredients.foundation ||
      !ingredients.feature ||
      !ingredients.flavor ||
      !ingredients.finish
    ) {
      return NextResponse.json(
        { error: 'All five ingredients are required' },
        { status: 400 }
      );
    }

    // Build the user message in the format expected by the prompt
    const userMessage = `Cuisine: ${cuisine}
Season: ${season.charAt(0).toUpperCase() + season.slice(1)}
Servings: ${servings}

Fat: ${ingredients.fat.name}
Foundation: ${ingredients.foundation.name}
Feature: ${ingredients.feature.name}
Flavor: ${ingredients.flavor.name}
Finish: ${ingredients.finish.name}`;

    // Call the Anthropic API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: RECIPE_SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    // Extract the text from the response
    const recipeText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => (block as { type: 'text'; text: string }).text)
      .join('');

    return NextResponse.json({ recipe: recipeText });
  } catch (error) {
    console.error('Error generating recipe:', error);
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}
