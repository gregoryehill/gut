'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { RecipeRequest } from '@/types';

interface RecipeViewProps {
  recipe: string;
  recipeInputs: RecipeRequest;
  onBack: () => void;
  onFeedback?: (rating: 'positive' | 'negative') => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function RecipeView({
  recipe,
  recipeInputs,
  onBack,
  onFeedback,
  onRegenerate,
  isRegenerating = false,
}: RecipeViewProps) {
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<'link' | 'recipe' | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null);

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
      // Automatically copy link to clipboard
      await navigator.clipboard.writeText(url);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 2500);
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

  const handleDownload = () => {
    const blob = new Blob([recipe], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handleFeedback = (rating: 'positive' | 'negative') => {
    if (feedbackGiven) return; // Already submitted
    setFeedbackGiven(rating);
    onFeedback?.(rating);
  };

  // Parse the recipe markdown into sections
  const lines = recipe.split('\n');

  // Extract title from recipe
  const titleLine = lines.find(line => line.startsWith('### '));
  const title = titleLine ? titleLine.replace('### ', '') : 'Your Recipe';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header with back + actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          &larr; Back
        </button>
        <div className="flex items-center gap-1">
          {/* Save/Share button */}
          {saveState === 'idle' && (
            <button
              onClick={handleSave}
              className="group relative p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Save & share
              </span>
            </button>
          )}
          {saveState === 'saving' && (
            <div className="p-2">
              <span className="inline-block w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {saveState === 'saved' && (
            <button
              onClick={handleShare}
              className="group relative p-2 text-primary hover:text-primary/80 transition-colors"
            >
              {justSaved ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              )}
              <span className={`absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded whitespace-nowrap pointer-events-none transition-opacity ${justSaved ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {justSaved ? 'Saved! Link copied' : copied === 'link' ? 'Copied!' : 'Share link'}
              </span>
            </button>
          )}
          {saveState === 'error' && (
            <button
              onClick={handleSave}
              className="group relative p-2 text-destructive hover:text-destructive/80 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Save failed - retry
              </span>
            </button>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopyRecipe}
            className="group relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied === 'recipe' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {copied === 'recipe' ? 'Copied!' : 'Copy text'}
            </span>
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="group relative p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {downloaded ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            )}
            <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {downloaded ? 'Downloaded!' : 'Download .md'}
            </span>
          </button>
        </div>
      </div>

      {/* Recipe content */}
      <Card className="p-8 sm:p-10 shadow-sm">
        <article className="prose prose-stone max-w-none">
          {lines.map((line, index) => {
            // Recipe title (h3) - already shown, but keep for spacing
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

      {/* Regenerate button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="px-6 py-3 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isRegenerating ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Creating another version...
            </span>
          ) : (
            'Try another version'
          )}
        </button>
      </div>

      {/* Feedback */}
      {onFeedback && (
        <div className="mt-6 flex items-center justify-center gap-3">
          <span className="text-sm text-muted-foreground">How was this recipe?</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleFeedback('positive')}
              disabled={feedbackGiven !== null}
              className={`group relative p-2 transition-colors ${
                feedbackGiven === 'positive'
                  ? 'text-primary'
                  : feedbackGiven === 'negative'
                  ? 'text-muted-foreground/30'
                  : 'text-muted-foreground hover:text-foreground'
              } disabled:cursor-default`}
            >
              <svg className="w-5 h-5" fill={feedbackGiven === 'positive' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
              </svg>
              {!feedbackGiven && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Good
                </span>
              )}
            </button>
            <button
              onClick={() => handleFeedback('negative')}
              disabled={feedbackGiven !== null}
              className={`group relative p-2 transition-colors ${
                feedbackGiven === 'negative'
                  ? 'text-destructive'
                  : feedbackGiven === 'positive'
                  ? 'text-muted-foreground/30'
                  : 'text-muted-foreground hover:text-foreground'
              } disabled:cursor-default`}
            >
              <svg className="w-5 h-5" fill={feedbackGiven === 'negative' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h2.67A2.31 2.31 0 0122 4v7a2.31 2.31 0 01-2.33 2H17" />
              </svg>
              {!feedbackGiven && (
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Not great
                </span>
              )}
            </button>
          </div>
          {feedbackGiven && (
            <span className="text-xs text-muted-foreground">Thanks!</span>
          )}
        </div>
      )}
    </div>
  );
}
