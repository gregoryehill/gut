'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import type { Ingredient, IngredientCategory } from '@/types';
import { CATEGORY_LABELS, CATEGORY_DESCRIPTIONS } from '@/types';

interface IngredientSelectorProps {
  category: IngredientCategory;
  cuisineId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onSelect: (ingredient: Ingredient) => void;
  currentIngredient: Ingredient | null;
}

export function IngredientSelector({
  category,
  cuisineId,
  isOpen,
  onClose,
  onSelect,
  currentIngredient,
}: IngredientSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Ingredient[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch all ingredients for this category when drawer opens
  useEffect(() => {
    if (!isOpen || !cuisineId) return;

    const fetchIngredients = async () => {
      setIsSearching(true);

      // Get ingredient IDs for this cuisine
      const { data: links, error: linksError } = await supabase
        .from('cuisine_ingredients')
        .select('ingredient_id')
        .eq('cuisine_id', cuisineId);

      if (linksError || !links) {
        console.error('Error fetching cuisine ingredients:', linksError);
        setIsSearching(false);
        return;
      }

      const ingredientIds = links.map((l) => l.ingredient_id);

      // Fetch all ingredients for this category
      const { data, error } = await supabase
        .from('ingredients')
        .select('id, name, category, tags')
        .eq('category', category)
        .in('id', ingredientIds)
        .order('name');

      if (error) {
        console.error('Error fetching ingredients:', error);
        setIsSearching(false);
        return;
      }

      const ingredients: Ingredient[] = (data || []).map((item) => ({
        id: item.id,
        name: item.name,
        category: item.category as IngredientCategory,
        tags: item.tags || [],
      }));

      setAllIngredients(ingredients);
      setResults(ingredients);
      setIsSearching(false);
    };

    fetchIngredients();
  }, [isOpen, cuisineId, category]);

  // Filter results based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults(allIngredients);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = allIngredients.filter(
      (ing) =>
        ing.name.toLowerCase().includes(query) ||
        ing.tags.some((tag) => tag.toLowerCase().includes(query))
    );
    setResults(filtered);
  }, [searchQuery, allIngredients]);

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay to allow drawer animation
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset state when drawer closes
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setSearchQuery('');
        setResults([]);
        setAllIngredients([]);
        onClose();
      }
    },
    [onClose]
  );

  const handleSelect = (ingredient: Ingredient) => {
    onSelect(ingredient);
    handleOpenChange(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b pb-4">
          <DrawerTitle className="font-serif text-xl">
            Choose {CATEGORY_LABELS[category]}
          </DrawerTitle>
          <DrawerDescription>
            {CATEGORY_DESCRIPTIONS[category]}
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4 flex flex-col gap-4 overflow-hidden">
          {/* Search input */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ingredients..."
              className="w-full px-4 py-3 text-base border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Results list */}
          <div className="flex-1 overflow-y-auto min-h-0 max-h-[50vh] -mx-4 px-4">
            {isSearching ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading ingredients...
              </div>
            ) : results.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                {searchQuery
                  ? 'No ingredients found'
                  : 'No ingredients available'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {results.map((ingredient) => (
                  <Button
                    key={ingredient.id}
                    variant={
                      currentIngredient?.id === ingredient.id
                        ? 'default'
                        : 'outline'
                    }
                    className="justify-start h-auto py-3 px-4 text-left"
                    onClick={() => handleSelect(ingredient)}
                  >
                    <span className="font-medium">{ingredient.name}</span>
                    {ingredient.tags.length > 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        {ingredient.tags.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
