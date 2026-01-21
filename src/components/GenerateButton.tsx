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
      className="w-full max-w-md mx-auto font-serif text-lg py-6"
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="animate-spin">⏳</span>
          Generating Recipe...
        </span>
      ) : (
        'Generate Recipe'
      )}
    </Button>
  );
}
