import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { IngredientCategory } from '@/types';

export interface PantryIngredient {
  id: string;
  name: string;
  category: IngredientCategory;
  tags: string[];
}

export interface PantryResponse {
  ingredients: PantryIngredient[];
}

export async function GET() {
  try {
    // Fetch all unique ingredients
    const { data: ingredients, error } = await supabase
      .from('ingredients')
      .select('id, name, category, tags')
      .order('name');

    if (error) {
      console.error('Error fetching ingredients:', error);
      return NextResponse.json(
        { error: 'Failed to fetch ingredients' },
        { status: 500 }
      );
    }

    const response: PantryResponse = {
      ingredients: ingredients.map((ing) => ({
        id: ing.id,
        name: ing.name,
        category: ing.category as IngredientCategory,
        tags: ing.tags || [],
      })),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Unexpected error in pantry API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
