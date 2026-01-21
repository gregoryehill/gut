'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Cuisine } from '@/types';

export function useCuisines() {
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all cuisines on mount
  useEffect(() => {
    async function fetchCuisines() {
      const { data, error } = await supabase
        .from('cuisines')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error fetching cuisines:', error);
        return;
      }

      setCuisines(data || []);
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

    const randomIndex = Math.floor(Math.random() * cuisines.length);
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
