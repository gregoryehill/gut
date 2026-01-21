import { NextRequest, NextResponse } from 'next/server';
import { anthropic, RECIPE_SYSTEM_PROMPT } from '@/lib/anthropic';
import { generateRecipeSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(`generate:${clientIp}`, RATE_LIMITS.generate);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    const body = await request.json();

    // Validate input with Zod schema
    const parseResult = generateRecipeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cuisine, season, servings, ingredients } = parseResult.data;

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
    // Log error without exposing details to client
    console.error('Error generating recipe:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to generate recipe' },
      { status: 500 }
    );
  }
}
