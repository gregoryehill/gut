import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateShortId } from '@/utils/shortId';
import { RecipeRequest } from '@/types';

interface SaveRecipeRequest extends RecipeRequest {
  recipe_text: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SaveRecipeRequest = await request.json();

    const { cuisine, season, servings, ingredients, recipe_text } = body;

    if (!cuisine || !season || !servings || !ingredients || !recipe_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

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
    console.error('Error saving recipe:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
