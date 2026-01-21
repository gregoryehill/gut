import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { SavedRecipe } from '@/types';
import { recipeIdSchema } from '@/lib/validation';
import { checkRateLimit, getClientIp, RATE_LIMITS } from '@/lib/rateLimit';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request.headers);
    const rateLimitResult = checkRateLimit(`getRecipe:${clientIp}`, RATE_LIMITS.getRecipe);

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

    const { id } = await params;

    // Validate the ID format
    const idParseResult = recipeIdSchema.safeParse(id);
    if (!idParseResult.success) {
      return NextResponse.json(
        { error: 'Invalid recipe ID format' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data as SavedRecipe);
  } catch (error) {
    // Log error without exposing details to client
    console.error('Error fetching recipe:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
