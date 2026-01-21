// Test setup file for bun test
// This file is preloaded before tests run

import { GlobalRegistrator } from '@happy-dom/global-registrator';

// Register happy-dom globals for React Testing Library
GlobalRegistrator.register();

// Import cleanup after happy-dom is registered
import { cleanup } from '@testing-library/react';
import { afterEach } from 'bun:test';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for component tests
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });

  // Mock IntersectionObserver
  class MockIntersectionObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: MockIntersectionObserver,
  });

  // Mock ResizeObserver
  class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  Object.defineProperty(window, 'ResizeObserver', {
    writable: true,
    value: MockResizeObserver,
  });

  // Mock URL.createObjectURL and revokeObjectURL
  if (typeof URL !== 'undefined') {
    Object.defineProperty(URL, 'createObjectURL', {
      writable: true,
      value: () => 'mock-url',
    });

    Object.defineProperty(URL, 'revokeObjectURL', {
      writable: true,
      value: () => {},
    });
  }
}
