import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SavedRecipe } from '@/types';
import { SavedRecipeView } from '@/components/SavedRecipeView';

interface Props {
  params: Promise<{ id: string }>;
}

async function getRecipe(id: string): Promise<SavedRecipe | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as SavedRecipe;
}

export default async function RecipePage({ params }: Props) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <SavedRecipeView recipe={recipe} />
    </main>
  );
}
