'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cuisine } from '@/types';

export function useCuisines() {
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all cuisines on mount and auto-select a random one
  useEffect(() => {
    async function fetchCuisines() {
      const { data, error } = await supabase
        .from('cuisines')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching cuisines:', error);
        setIsLoading(false);
        return;
      }

      const cuisineList = data || [];
      setCuisines(cuisineList);

      // Auto-select a random cuisine on initial load
      if (cuisineList.length > 0) {
        const randomIndex =
          crypto.getRandomValues(new Uint32Array(1))[0] % cuisineList.length;
        setSelectedCuisine(cuisineList[randomIndex]);
      }

      setIsLoading(false);
    }

    fetchCuisines();
  }, []);

  // Select a specific cuisine by ID
  const selectCuisine = useCallback(
    (cuisineId: string) => {
      const cuisine = cuisines.find((c) => c.id === cuisineId);
      if (cuisine) {
        setSelectedCuisine(cuisine);
      }
    },
    [cuisines]
  );

  // Select a random cuisine
  const randomizeCuisine = useCallback(() => {
    if (cuisines.length === 0) return;

    // Use crypto for better randomness
    const randomIndex = crypto.getRandomValues(new Uint32Array(1))[0] % cuisines.length;
    setSelectedCuisine(cuisines[randomIndex]);
  }, [cuisines]);

  return {
    cuisines,
    selectedCuisine,
    isLoading,
    selectCuisine,
    randomizeCuisine,
  };
}
