import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateShortId } from '@/utils/shortId';
import { saveRecipeSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

// GET /api/recipes - List saved recipes with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const offset = parseInt(searchParams.get('offset') || '0');
    const cuisine = searchParams.get('cuisine');

    let query = supabase
      .from('recipes')
      .select('id, cuisine, season, servings, ingredients, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Optional cuisine filter
    if (cuisine) {
      query = query.eq('cuisine', cuisine);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Supabase error fetching recipes:', error);
      return NextResponse.json(
        { error: 'Failed to fetch recipes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      recipes: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error listing recipes:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(`saveRecipe:${clientIp}`, RATE_LIMITS.saveRecipe);

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
    const parseResult = saveRecipeSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parseResult.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { cuisine, season, servings, ingredients, recipe_text } = parseResult.data;

    const id = generateShortId();

    const { error } = await supabase.from('recipes').insert({
      id,
      cuisine,
      season,
      servings,
      ingredients,
      recipe_text,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to save recipe' },
        { status: 500 }
      );
    }

    return NextResponse.json({ id });
  } catch (error) {
    // Log error without exposing details to client
    console.error('Error saving recipe:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
