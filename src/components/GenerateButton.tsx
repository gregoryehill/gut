'use client';

import { Button } from '@/components/ui/button';

interface GenerateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function GenerateButton({
  onClick,
  disabled = false,
  isLoading = false,
}: GenerateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || isLoading}
      size="lg"
      className="w-full max-w-md mx-auto font-serif text-lg py-6 tracking-wide"
    >
      {isLoading ? (
        <span className="flex items-center gap-3">
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Creating your recipe...
        </span>
      ) : (
        'Make This Meal'
      )}
    </Button>
  );
}
