'use client';

import { useEffect, useRef } from 'react';
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

  const handleThumbsDown = () => {
    if (!selectedCuisine) return;

    submitFeedback({
      cuisine: selectedCuisine.name,
      season,
      servings,
      ingredients,
    });

    // Regenerate with same inputs
    handleGenerate();
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleBack = () => {
    clearRecipe();
  };

  // Show recipe view if we have a recipe
  if (recipe) {
    return (
      <div className="min-h-screen bg-background py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <RecipeView
            recipe={recipe}
            onBack={handleBack}
            onThumbsDown={handleThumbsDown}
            onRegenerate={handleRegenerate}
            isRegenerating={recipeLoading}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal mb-1 sm:mb-2">
            GUT
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Grand Unified Theory of Cooking
          </p>
        </header>

        {/* Selectors row */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:items-end sm:gap-6 mb-10 max-w-md mx-auto sm:max-w-none">
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
            <div className="mb-8">
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
