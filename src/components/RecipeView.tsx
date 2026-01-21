'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RecipeViewProps {
  recipe: string;
  onBack: () => void;
  onThumbsDown: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

export function RecipeView({
  recipe,
  onBack,
  onThumbsDown,
  onRegenerate,
  isRegenerating = false,
}: RecipeViewProps) {
  // Parse the recipe markdown into sections
  const lines = recipe.split('\n');

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back button */}
      <Button variant="ghost" onClick={onBack} className="mb-4">
        ← Back to ingredients
      </Button>

      {/* Recipe content */}
      <Card className="p-8">
        <article className="prose prose-stone max-w-none">
          {lines.map((line, index) => {
            // Recipe title (h3)
            if (line.startsWith('### ')) {
              return (
                <h1
                  key={index}
                  className="font-serif text-3xl font-normal mb-4 text-foreground"
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
                  className="font-sans text-sm font-semibold uppercase tracking-wide text-muted-foreground mt-6 mb-3"
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
                <p key={index} className="mb-1 pl-4">
                  {line}
                </p>
              );
            }

            // Empty lines
            if (line.trim() === '') {
              return <div key={index} className="h-2" />;
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

      {/* Feedback buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <Button
          variant="outline"
          onClick={onThumbsDown}
          disabled={isRegenerating}
        >
          👎 Not great
        </Button>
        <Button
          variant="default"
          onClick={onRegenerate}
          disabled={isRegenerating}
        >
          {isRegenerating ? '⏳ Regenerating...' : '🔄 Try another'}
        </Button>
      </div>
    </div>
  );
}
