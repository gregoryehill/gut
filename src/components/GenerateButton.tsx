'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const LOADING_MESSAGES = [
  { text: 'Heating the pan', icon: '🍳' },
  { text: 'Mincing the garlic', icon: '🧄' },
  { text: 'Tasting for seasoning', icon: '🧂' },
  { text: 'Building the flavor base', icon: '🧅' },
  { text: 'Letting it simmer', icon: '♨️' },
  { text: 'Deglazing the pan', icon: '🍷' },
  { text: 'Folding in fresh herbs', icon: '🌿' },
  { text: 'Ready to plate', icon: '✨' },
];

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
  const [messageIndex, setMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setMessageIndex(0);
      setIsTransitioning(false);
      return;
    }

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        setIsTransitioning(false);
      }, 200);
    }, 2200);

    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="relative overflow-hidden rounded-lg bg-card border border-border shadow-sm">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
            <div
              className="h-full bg-primary animate-pulse"
              style={{
                width: '100%',
                animation: 'shimmer 2s ease-in-out infinite',
              }}
            />
          </div>

          {/* Content */}
          <div className="px-6 py-5 flex items-center justify-center gap-4">
            <span
              className={`text-2xl transition-all duration-200 ${
                isTransitioning ? 'opacity-0 scale-75' : 'opacity-100 scale-100'
              }`}
            >
              {LOADING_MESSAGES[messageIndex].icon}
            </span>
            <div className="flex flex-col items-start">
              <span
                className={`font-serif text-lg text-foreground transition-all duration-200 ${
                  isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {LOADING_MESSAGES[messageIndex].text}
              </span>
              <span className="text-xs text-muted-foreground tracking-wide uppercase">
                Creating your recipe
              </span>
            </div>
          </div>

          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
            style={{
              animation: 'shimmer 2s ease-in-out infinite',
            }}
          />
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="w-full max-w-md mx-auto font-serif text-lg py-6 tracking-wide"
    >
      Make This Meal
    </Button>
  );
}
