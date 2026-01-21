'use client';

import { useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import { CuisineSelector } from '@/components/CuisineSelector';
import { SeasonSelector } from '@/components/SeasonSelector';
import { ServingsSelector } from '@/components/ServingsSelector';
import { IngredientGrid } from '@/components/IngredientGrid';
import { GenerateButton } from '@/components/GenerateButton';
import { RecipeView } from '@/components/RecipeView';
import { useCuisines } from '@/hooks/useCuisines';
import { useIngredients } from '@/hooks/useIngredients';
import { useRecipe } from '@/hooks/useRecipe';
import { getCurrentSeason } from '@/utils/season';
import type { Season, IngredientCategory } from '@/types';
import { useState } from 'react';

export default function Home() {
  const [season, setSeason] = useState<Season>(getCurrentSeason());
  const [servings, setServings] = useState(4);

  const {
    cuisines,
    selectedCuisine,
    isLoading: cuisinesLoading,
    selectCuisine,
    randomizeCuisine,
  } = useCuisines();

  const {
    ingredients,
    lockedIngredients,
    isLoading: ingredientsLoading,
    fetchAllIngredients,
    rerollIngredient,
    toggleLock,
    allSelected,
  } = useIngredients();

  const {
    recipe,
    isLoading: recipeLoading,
    generateRecipe,
    clearRecipe,
    submitFeedback,
  } = useRecipe();

  // Use ref to avoid stale closure issues
  const fetchAllIngredientsRef = useRef(fetchAllIngredients);
  fetchAllIngredientsRef.current = fetchAllIngredients;

  // Fetch ingredients when cuisine changes
  useEffect(() => {
    if (selectedCuisine) {
      fetchAllIngredientsRef.current(selectedCuisine.id);
    }
  }, [selectedCuisine]);

  const handleCuisineChange = (cuisineId: string) => {
    selectCuisine(cuisineId);
  };

  const handleRandomizeCuisine = () => {
    randomizeCuisine();
  };

  const handleReroll = (category: IngredientCategory) => {
    if (selectedCuisine) {
      rerollIngredient(selectedCuisine.id, category);
    }
  };

  const handleGenerate = () => {
    if (!selectedCuisine || !allSelected) return;

    generateRecipe({
      cuisine: selectedCuisine.name,
      season,
      servings,
      ingredients,
    });
  };

  const handleFeedback = (rating: 'positive' | 'negative') => {
    if (!selectedCuisine || !recipe) return;

    submitFeedback(
      {
        cuisine: selectedCuisine.name,
        season,
        servings,
        ingredients,
      },
      recipe,
      rating
    );
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleBack = () => {
    clearRecipe();
  };

  // Scroll to top when recipe is shown
  useLayoutEffect(() => {
    if (recipe) {
      window.scrollTo(0, 0);
    }
  }, [recipe]);

  // Show recipe view if we have a recipe
  if (recipe && selectedCuisine) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:py-16">
        <div className="max-w-4xl mx-auto">
          <RecipeView
            recipe={recipe}
            recipeInputs={{
              cuisine: selectedCuisine.name,
              season,
              servings,
              ingredients,
            }}
            onBack={handleBack}
            onFeedback={handleFeedback}
            onRegenerate={handleRegenerate}
            isRegenerating={recipeLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12 sm:mb-16">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-medium mb-3 tracking-tight">
            G.U.T.
          </h1>
          <p className="font-serif text-muted-foreground text-lg sm:text-xl md:text-2xl max-w-lg mx-auto">
            A Grand Unified Theory of Cooking for people who ship code, and want to ship dinner too.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <Link
              href="/about"
              className="text-sm text-foreground hover:text-primary underline underline-offset-4 transition-colors"
            >
              What is GUT?
            </Link>
            <span className="text-foreground/40 text-lg" aria-hidden="true">&#x1F373;</span>
            <Link
              href="/how"
              className="text-sm text-foreground hover:text-primary underline underline-offset-4 transition-colors"
            >
              How is GUT?
            </Link>
            <span className="text-foreground/40 text-lg" aria-hidden="true">&#x1F373;</span>
            <a
              href="https://github.com/gregoryehill/gut"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-foreground hover:text-primary underline underline-offset-4 transition-colors"
            >
              GitHub
            </a>
          </div>
          
        </header>

        {/* Selectors row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:justify-center sm:items-end sm:gap-8 mb-12 max-w-xs mx-auto sm:max-w-none">
          <SeasonSelector value={season} onChange={setSeason} />
          <CuisineSelector
            cuisines={cuisines}
            value={selectedCuisine?.id ?? null}
            onChange={handleCuisineChange}
            onRandomize={handleRandomizeCuisine}
          />
          <ServingsSelector value={servings} onChange={setServings} />
        </div>

        {/* Loading state for cuisines */}
        {cuisinesLoading ? (
          <div className="text-center text-muted-foreground py-12">
            Loading cuisines...
          </div>
        ) : (
          <>
            {/* Ingredient grid */}
            <div className="mb-10">
              <IngredientGrid
                ingredients={ingredients}
                lockedIngredients={lockedIngredients}
                onToggleLock={toggleLock}
                onReroll={handleReroll}
                isLoading={ingredientsLoading}
              />
            </div>

            {/* Generate button */}
            <div className="flex justify-center">
              <GenerateButton
                onClick={handleGenerate}
                disabled={!allSelected || !selectedCuisine}
                isLoading={recipeLoading}
              />
            </div>

            {/* Helper text */}
            {!selectedCuisine && (
              <p className="text-center text-muted-foreground mt-4">
                Select a cuisine to get started
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
