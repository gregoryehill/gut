'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { isCoreStaple } from '@/utils/perishability';
import type {
  Ingredient,
  IngredientCategory,
  SelectedIngredients,
  LockedIngredients,
  SpecialtySuggestions,
} from '@/types';
import { INGREDIENT_CATEGORIES } from '@/types';

const EMPTY_INGREDIENTS: SelectedIngredients = {
  fat: null,
  foundation: null,
  feature: null,
  flavor: null,
  finish: null,
};

const EMPTY_LOCKS: LockedIngredients = {
  fat: false,
  foundation: false,
  feature: false,
  flavor: false,
  finish: false,
};

const EMPTY_SPECIALTIES: SpecialtySuggestions = {
  fat: null,
  foundation: null,
  feature: null,
  flavor: null,
  finish: null,
};

// Helper to pick a random item from an array
function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % arr.length;
  return arr[randomIndex];
}

export function useIngredients() {
  const [ingredients, setIngredients] =
    useState<SelectedIngredients>(EMPTY_INGREDIENTS);
  const [lockedIngredients, setLockedIngredients] =
    useState<LockedIngredients>(EMPTY_LOCKS);
  const [specialtySuggestions, setSpecialtySuggestions] =
    useState<SpecialtySuggestions>(EMPTY_SPECIALTIES);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch ingredients for a category, split into essentials and specialties
  const fetchIngredientsForCategory = useCallback(
    async (
      cuisineId: string,
      category: IngredientCategory
    ): Promise<{ essential: Ingredient | null; specialty: Ingredient | null }> => {
      // First get ingredient IDs for this cuisine
      const { data: links, error: linksError } = await supabase
        .from('cuisine_ingredients')
        .select('ingredient_id')
        .eq('cuisine_id', cuisineId);

      if (linksError || !links || links.length === 0) {
        console.error('Error fetching cuisine ingredients:', linksError);
        return { essential: null, specialty: null };
      }

      const ingredientIds = links.map((l) => l.ingredient_id);

      // Fetch all ingredients matching category and IDs
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name, category, tags')
        .eq('category', category)
        .in('id', ingredientIds);

      if (error) {
        console.error('Supabase error fetching ingredient:', error.message, error);
        return { essential: null, specialty: null };
      }

      if (!data || data.length === 0) {
        console.warn(`No ingredients found for category "${category}" in cuisine "${cuisineId}"`);
        return { essential: null, specialty: null };
      }

      // Split into essentials and specialties
      const allIngredients: Ingredient[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as IngredientCategory,
        tags: item.tags || [],
      }));

      const essentials = allIngredients.filter((ing) =>
        isCoreStaple(ing.name, ing.category)
      );
      const specialties = allIngredients.filter(
        (ing) => !isCoreStaple(ing.name, ing.category)
      );

      // Pick a random essential (preferred) or fall back to any ingredient
      let essential: Ingredient | null = null;
      if (essentials.length > 0) {
        essential = pickRandom(essentials);
      } else {
        // No essentials available for this cuisine/category, use any
        essential = pickRandom(allIngredients);
      }

      // Pick a random specialty as the "upgrade" suggestion
      // Make sure it's different from the essential we picked
      const availableSpecialties = specialties.filter(
        (s) => s.id !== essential?.id
      );
      const specialty = pickRandom(availableSpecialties);

      return { essential, specialty };
    },
    []
  );

  // Fetch all ingredients for a cuisine (respects locks)
  const fetchAllIngredients = useCallback(
    async (cuisineId: string) => {
      setIsLoading(true);

      // Fetch all categories in parallel
      const results = await Promise.all(
        INGREDIENT_CATEGORIES.map(async (category) => {
          const { essential, specialty } = await fetchIngredientsForCategory(
            cuisineId,
            category
          );
          return { category, essential, specialty };
        })
      );

      // Update state, preserving locked ingredients
      setIngredients((prev) => {
        const updated = { ...prev };
        for (const { category, essential } of results) {
          if (!lockedIngredients[category] && essential) {
            updated[category] = essential;
          }
        }
        return updated;
      });

      // Update specialty suggestions (these don't get locked)
      setSpecialtySuggestions((prev) => {
        const updated = { ...prev };
        for (const { category, specialty } of results) {
          if (!lockedIngredients[category]) {
            updated[category] = specialty;
          }
        }
        return updated;
      });

      setIsLoading(false);
    },
    [lockedIngredients, fetchIngredientsForCategory]
  );

  // Re-roll a single ingredient
  const rerollIngredient = useCallback(
    async (cuisineId: string, category: IngredientCategory) => {
      if (lockedIngredients[category]) return;

      const { essential, specialty } = await fetchIngredientsForCategory(
        cuisineId,
        category
      );

      if (essential) {
        setIngredients((prev) => ({
          ...prev,
          [category]: essential,
        }));
      }

      setSpecialtySuggestions((prev) => ({
        ...prev,
        [category]: specialty,
      }));
    },
    [lockedIngredients, fetchIngredientsForCategory]
  );

  // Swap current ingredient with the specialty suggestion
  const useSpecialty = useCallback(
    (category: IngredientCategory) => {
      const specialty = specialtySuggestions[category];
      const current = ingredients[category];

      if (!specialty || lockedIngredients[category]) return;

      // Swap: specialty becomes the main, current becomes the suggestion
      setIngredients((prev) => ({
        ...prev,
        [category]: specialty,
      }));

      setSpecialtySuggestions((prev) => ({
        ...prev,
        [category]: current,
      }));
    },
    [specialtySuggestions, ingredients, lockedIngredients]
  );

  // Toggle lock state for a category
  const toggleLock = useCallback((category: IngredientCategory) => {
    setLockedIngredients((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  }, []);

  // Reset all ingredients and locks
  const reset = useCallback(() => {
    setIngredients(EMPTY_INGREDIENTS);
    setLockedIngredients(EMPTY_LOCKS);
    setSpecialtySuggestions(EMPTY_SPECIALTIES);
  }, []);

  // Check if all ingredients are selected
  const allSelected = INGREDIENT_CATEGORIES.every(
    (cat) => ingredients[cat] !== null
  );

  return {
    ingredients,
    lockedIngredients,
    specialtySuggestions,
    isLoading,
    fetchAllIngredients,
    rerollIngredient,
    useSpecialty,
    toggleLock,
    reset,
    allSelected,
  };
}
