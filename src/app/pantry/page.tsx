'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { isPerishable } from '@/utils/perishability';
import {
  INGREDIENT_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_DESCRIPTIONS,
} from '@/types';
import type { IngredientCategory } from '@/types';
import type { PantryIngredient, PantryResponse } from '@/app/api/pantry/route';

interface CategorizedIngredients {
  category: IngredientCategory;
  coreStaples: PantryIngredient[];
  niceToHave: PantryIngredient[];
}

const CATEGORY_COLORS: Record<IngredientCategory, { bg: string; border: string; accent: string }> = {
  fat: {
    bg: 'bg-[var(--category-fat)]',
    border: 'border-[var(--category-fat-border)]',
    accent: 'bg-[var(--category-fat-border)]'
  },
  foundation: {
    bg: 'bg-[var(--category-foundation)]',
    border: 'border-[var(--category-foundation-border)]',
    accent: 'bg-[var(--category-foundation-border)]'
  },
  feature: {
    bg: 'bg-[var(--category-feature)]',
    border: 'border-[var(--category-feature-border)]',
    accent: 'bg-[var(--category-feature-border)]'
  },
  flavor: {
    bg: 'bg-[var(--category-flavor)]',
    border: 'border-[var(--category-flavor-border)]',
    accent: 'bg-[var(--category-flavor-border)]'
  },
  finish: {
    bg: 'bg-[var(--category-finish)]',
    border: 'border-[var(--category-finish-border)]',
    accent: 'bg-[var(--category-finish-border)]'
  },
};

function IngredientGrid({ items, title }: { items: PantryIngredient[]; title: string }) {
  if (items.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {title} ({items.length})
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5">
        {items.map((item) => (
          <div key={item.id} className="text-sm font-serif truncate" title={item.name}>
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

function CollapsibleCategory({
  data,
  isExpanded,
  onToggle
}: {
  data: CategorizedIngredients;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const totalCount = data.coreStaples.length + data.niceToHave.length;
  const colors = CATEGORY_COLORS[data.category];

  return (
    <section className={`rounded-lg border overflow-hidden ${colors.border}`}>
      {/* Header - always visible, clickable */}
      <button
        onClick={onToggle}
        className={`w-full p-4 flex items-center justify-between text-left transition-colors hover:opacity-90 ${colors.bg}`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colors.accent}`} />
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              {CATEGORY_LABELS[data.category]}
            </h3>
            <p className="text-xs text-muted-foreground">
              {CATEGORY_DESCRIPTIONS[data.category]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground tabular-nums">
            {totalCount}
          </span>
          <span className={`text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            &#x25BC;
          </span>
        </div>
      </button>

      {/* Content - collapsible */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`p-4 pt-0 space-y-6 ${colors.bg}`}>
          <div className="border-t border-foreground/10 pt-4" />
          <IngredientGrid items={data.coreStaples} title="The Essentials" />
          <IngredientGrid items={data.niceToHave} title="Nice to Have" />
        </div>
      </div>
    </section>
  );
}

export default function PantryPage() {
  const [categorizedData, setCategorizedData] = useState<CategorizedIngredients[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<IngredientCategory>>(new Set());

  useEffect(() => {
    async function fetchPantry() {
      try {
        const response = await fetch('/api/pantry');
        if (!response.ok) {
          throw new Error('Failed to fetch pantry data');
        }

        const data: PantryResponse = await response.json();

        const categorized: CategorizedIngredients[] = INGREDIENT_CATEGORIES.map(
          (category) => {
            const categoryIngredients = data.ingredients.filter(
              (ing) => ing.category === category
            );

            // isPerishable returns true if NOT a core staple
            const coreStaples = categoryIngredients
              .filter((ing) => !isPerishable(ing.name, ing.category))
              .sort((a, b) => a.name.localeCompare(b.name));

            const niceToHave = categoryIngredients
              .filter((ing) => isPerishable(ing.name, ing.category))
              .sort((a, b) => a.name.localeCompare(b.name));

            return { category, coreStaples, niceToHave };
          }
        );

        setCategorizedData(categorized);
      } catch (err) {
        console.error('Error fetching pantry:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPantry();
  }, []);

  const toggleCategory = (category: IngredientCategory) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedCategories(new Set(INGREDIENT_CATEGORIES));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
  };

  const totalIngredients = categorizedData.reduce(
    (sum, cat) => sum + cat.coreStaples.length + cat.niceToHave.length,
    0
  );

  const totalEssentials = categorizedData.reduce(
    (sum, cat) => sum + cat.coreStaples.length,
    0
  );

  const totalNiceToHave = categorizedData.reduce(
    (sum, cat) => sum + cat.niceToHave.length,
    0
  );

  // Calculate total possible dish combinations from essentials
  // A dish = 1 ingredient from each of the 5 categories
  const totalPossibleDishes = categorizedData.length === 5
    ? categorizedData.reduce(
        (product, cat) => product * Math.max(cat.coreStaples.length, 1),
        1
      )
    : 0;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            &larr; Back to app
          </Button>
        </Link>

        {/* Hero */}
        <header className="mb-8 text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-normal mb-3">
            The GUT Pantry
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Stock the essentials and you can make a close-enough version of any dish in GUT
            {!isLoading && !error && totalPossibleDishes > 0 && (
              <>
                &mdash;that&apos;s{' '}
                <span className="font-semibold text-foreground">
                  {totalPossibleDishes.toLocaleString()}
                </span>{' '}
                possible combinations
              </>
            )}
            . Add specialty items as you explore to dial things in.
          </p>
        </header>

        {/* Stats */}
        {!isLoading && !error && (
          <div className="flex justify-center gap-8 mb-8 text-center">
            <div>
              <div className="font-serif text-2xl font-semibold">{totalEssentials}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Essentials</div>
            </div>
            <div className="border-l border-foreground/10" />
            <div>
              <div className="font-serif text-2xl font-semibold">{totalNiceToHave}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Nice to Have</div>
            </div>
            <div className="border-l border-foreground/10" />
            <div>
              <div className="font-serif text-2xl font-semibold">{totalIngredients}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wide">Total</div>
            </div>
          </div>
        )}

        {/* Expand/Collapse controls */}
        {!isLoading && !error && (
          <div className="flex justify-end gap-2 mb-4">
            <Button variant="ghost" size="sm" onClick={expandAll} className="text-xs">
              Expand all
            </Button>
            <Button variant="ghost" size="sm" onClick={collapseAll} className="text-xs">
              Collapse all
            </Button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="text-center text-muted-foreground py-12">
            Loading pantry...
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center text-destructive py-12">
            {error}
          </div>
        )}

        {/* Categories */}
        {!isLoading && !error && (
          <div className="space-y-3">
            {categorizedData.map((data) => (
              <CollapsibleCategory
                key={data.category}
                data={data}
                isExpanded={expandedCategories.has(data.category)}
                onToggle={() => toggleCategory(data.category)}
              />
            ))}
          </div>
        )}

        {/* Legend */}
        {!isLoading && !error && (
          <div className="mt-8 p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
            <div className="flex flex-col sm:flex-row sm:gap-8 gap-2">
              <div>
                <span className="font-semibold">The Essentials</span> &mdash; versatile basics that work across cuisines
              </div>
              <div>
                <span className="font-semibold">Nice to Have</span> &mdash; specialty items that unlock specific flavors
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-10 text-center">
          <Link href="/">
            <Button size="lg" className="font-serif text-lg px-8">
              Start Cooking &rarr;
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
