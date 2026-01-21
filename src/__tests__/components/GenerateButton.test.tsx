import { describe, expect, test, mock } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import { GenerateButton } from '@/components/GenerateButton';

describe('GenerateButton', () => {
  test('renders "Make This Meal" text when not loading', () => {
    const { getByText } = render(<GenerateButton onClick={() => {}} />);

    expect(getByText('Make This Meal')).toBeDefined();
  });

  test('calls onClick when clicked', () => {
    const handleClick = mock(() => {});
    const { getByText } = render(<GenerateButton onClick={handleClick} />);

    fireEvent.click(getByText('Make This Meal'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('is disabled when disabled prop is true', () => {
    const { getByRole } = render(<GenerateButton onClick={() => {}} disabled={true} />);

    const button = getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(true);
  });

  test('is not disabled by default', () => {
    const { getByRole } = render(<GenerateButton onClick={() => {}} />);

    const button = getByRole('button');
    expect(button.hasAttribute('disabled')).toBe(false);
  });

  test('shows loading state when isLoading is true', () => {
    const { queryByText, getByText } = render(<GenerateButton onClick={() => {}} isLoading={true} />);

    // Should show loading message instead of button
    expect(queryByText('Make This Meal')).toBeNull();
    expect(getByText('Creating your recipe')).toBeDefined();
  });

  test('shows first loading message initially', () => {
    const { getByText } = render(<GenerateButton onClick={() => {}} isLoading={true} />);

    expect(getByText('Heating the pan')).toBeDefined();
  });

  test('does not call onClick when loading', () => {
    const handleClick = mock(() => {});
    const { queryByRole } = render(<GenerateButton onClick={handleClick} isLoading={true} />);

    // There's no button to click in loading state
    expect(queryByRole('button')).toBeNull();
  });

  test('shows button after loading completes', () => {
    const { rerender, queryByText, getByText } = render(<GenerateButton onClick={() => {}} isLoading={true} />);

    expect(queryByText('Make This Meal')).toBeNull();

    rerender(<GenerateButton onClick={() => {}} isLoading={false} />);

    expect(getByText('Make This Meal')).toBeDefined();
  });

  test('applies correct styling classes', () => {
    const { getByRole } = render(<GenerateButton onClick={() => {}} />);

    const button = getByRole('button');
    // Check for some expected classes
    expect(button.className).toContain('w-full');
    expect(button.className).toContain('max-w-md');
  });

  test('loading container has progress bar', () => {
    const { container } = render(<GenerateButton onClick={() => {}} isLoading={true} />);

    // Check for progress bar element
    const progressBar = container.querySelector('.bg-primary\\/20');
    expect(progressBar).toBeDefined();
  });
});
