'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RecipeRequest } from '@/types';

interface RecipeViewProps {
  recipe: string;
  recipeInputs: RecipeRequest;
  onBack: () => void;
  onThumbsDown: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function RecipeView({
  recipe,
  recipeInputs,
  onBack,
  onThumbsDown,
  onRegenerate,
  isRegenerating = false,
}: RecipeViewProps) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<'link' | 'recipe' | null>(null);

  const handleSave = async () => {
    setSaveState('saving');
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...recipeInputs,
          recipe_text: recipe,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      const { id } = await response.json();
      const url = `${window.location.origin}/recipe/${id}`;
      setSavedUrl(url);
      setSaveState('saved');
    } catch {
      setSaveState('error');
      setTimeout(() => setSaveState('idle'), 3000);
    }
  };

  const handleCopyLink = async () => {
    if (!savedUrl) return;
    await navigator.clipboard.writeText(savedUrl);
    setCopied('link');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleCopyRecipe = async () => {
    await navigator.clipboard.writeText(recipe);
    setCopied('recipe');
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    if (!savedUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this recipe!',
          url: savedUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  // Parse the recipe markdown into sections
  const lines = recipe.split('\n');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
        <span className="mr-2">&larr;</span> Back to ingredients
      </Button>

      {/* Recipe content */}
      <Card className="p-8 sm:p-10 shadow-sm">
        <article className="prose prose-stone max-w-none">
          {lines.map((line, index) => {
            // Recipe title (h3)
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

            // Section headers (bold text like **Ingredients**)
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

            // Numbered steps
            if (/^\d+\.\s/.test(line)) {
              return (
                <p key={index} className="mb-3 leading-relaxed">
                  {line}
                </p>
              );
            }

            // Bullet points (ingredients)
            if (line.startsWith('- ')) {
              return (
                <p key={index} className="mb-1.5 pl-4">
                  {line}
                </p>
              );
            }

            // Empty lines
            if (line.trim() === '') {
              return <div key={index} className="h-3" />;
            }

            // Regular paragraphs (headnote, accompaniment)
            return (
              <p key={index} className="mb-3 leading-relaxed text-muted-foreground">
                {line}
              </p>
            );
          })}
        </article>
      </Card>

      {/* Save/Share section */}
      <div className="flex justify-center gap-3 mt-8 flex-wrap">
        {saveState === 'idle' && (
          <Button
            variant="default"
            onClick={handleSave}
            className="px-6 font-serif"
          >
            Save recipe
          </Button>
        )}
        {saveState === 'saving' && (
          <Button disabled className="px-6 font-serif">
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          </Button>
        )}
        {saveState === 'saved' && (
          <>
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
          </>
        )}
        {saveState === 'error' && (
          <Button
            variant="destructive"
            onClick={handleSave}
            className="px-6"
          >
            Save failed - try again
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleCopyRecipe}
          className="px-5"
        >
          {copied === 'recipe' ? 'Copied!' : 'Copy recipe'}
        </Button>
      </div>

      {/* Feedback buttons */}
      <div className="flex justify-center gap-4 mt-4">
        <Button
          variant="ghost"
          onClick={onThumbsDown}
          disabled={isRegenerating}
          className="px-6 text-muted-foreground"
        >
          Not quite right
        </Button>
        <Button
          variant="ghost"
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="px-6 text-muted-foreground"
        >
          {isRegenerating ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Regenerating...
            </span>
          ) : (
            'Try another version'
          )}
        </Button>
      </div>
    </div>
  );
}
