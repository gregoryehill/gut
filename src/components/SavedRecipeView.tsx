'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SavedRecipe } from '@/types';

interface SavedRecipeViewProps {
  recipe: SavedRecipe;
}

export function SavedRecipeView({ recipe }: SavedRecipeViewProps) {
  const [copied, setCopied] = useState<'link' | 'recipe' | null>(null);

  const lines = recipe.recipe_text.split('\n');

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/recipe/${recipe.id}`;
    await navigator.clipboard.writeText(url);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyRecipe = async () => {
    await navigator.clipboard.writeText(recipe.recipe_text);
    setCopied('recipe');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/recipe/${recipe.id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this recipe!',
          url,
        });
      } catch {
        // User cancelled or share failed, fall back to copy
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back to home */}
      <Link href="/">
        <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
          <span className="mr-2">&larr;</span> Make your own
        </Button>
      </Link>

      {/* Recipe content */}
      <Card className="p-8 sm:p-10 shadow-sm">
        <article className="prose prose-stone max-w-none">
          {lines.map((line, index) => {
            if (line.startsWith('### ')) {
              return (
                <h1
                  key={index}
                  className="font-serif text-3xl sm:text-4xl font-normal mb-6 text-foreground leading-tight"
                >
                  {line.replace('### ', '')}
                </h1>
              );
            }

            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <h2
                  key={index}
                  className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-8 mb-4 pb-2 border-b border-border/50"
                >
                  {line.replace(/\*\*/g, '')}
                </h2>
              );
            }

            if (/^\d+\.\s/.test(line)) {
              return (
                <p key={index} className="mb-3 leading-relaxed">
                  {line}
                </p>
              );
            }

            if (line.startsWith('- ')) {
              return (
                <p key={index} className="mb-1.5 pl-4">
                  {line}
                </p>
              );
            }

            if (line.trim() === '') {
              return <div key={index} className="h-3" />;
            }

            return (
              <p key={index} className="mb-3 leading-relaxed text-muted-foreground">
                {line}
              </p>
            );
          })}
        </article>
      </Card>

      {/* Share buttons */}
      <div className="flex justify-center gap-3 mt-8 flex-wrap">
        <Button
          variant="outline"
          onClick={handleCopyRecipe}
          className="px-5"
        >
          {copied === 'recipe' ? 'Copied!' : 'Copy recipe'}
        </Button>
        <Button
          variant="outline"
          onClick={handleCopyLink}
          className="px-5"
        >
          {copied === 'link' ? 'Copied!' : 'Copy link'}
        </Button>
        <Button
          variant="default"
          onClick={handleShare}
          className="px-5 font-serif"
        >
          Share
        </Button>
      </div>

      {/* Recipe info */}
      <p className="text-center text-xs text-muted-foreground mt-6">
        {recipe.cuisine} cuisine &middot; {recipe.season} &middot; {recipe.servings} servings
      </p>
    </div>
  );
}
