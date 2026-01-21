import { describe, expect, test, mock } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import { ServingsSelector } from '@/components/ServingsSelector';

describe('ServingsSelector', () => {
  test('renders Servings label', () => {
    const { getByText } = render(<ServingsSelector value={4} onChange={() => {}} />);

    expect(getByText('Servings')).toBeDefined();
  });

  test('displays current value with plural label', () => {
    const { container } = render(<ServingsSelector value={4} onChange={() => {}} />);

    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger?.textContent).toContain('4');
    expect(trigger?.textContent).toContain('servings');
  });

  test('displays singular label for 1 serving', () => {
    const { container } = render(<ServingsSelector value={1} onChange={() => {}} />);

    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger?.textContent).toContain('1');
    expect(trigger?.textContent).toContain('serving');
    expect(trigger?.textContent).not.toContain('servings');
  });

  test('calls onChange with new number', () => {
    const handleChange = mock(() => {});
    const { container, getByRole } = render(<ServingsSelector value={4} onChange={handleChange} />);

    // Open the dropdown
    const trigger = container.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    // Find and click 8 servings option
    const option = getByRole('option', { name: /8 servings/i });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith(8);
  });

  test('shows all servings options in dropdown', () => {
    const { container, getByRole } = render(<ServingsSelector value={4} onChange={() => {}} />);

    // Open the dropdown
    const trigger = container.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    // All options from SERVINGS_OPTIONS should be visible
    expect(getByRole('option', { name: /1 servings/i })).toBeDefined();
    expect(getByRole('option', { name: /2 servings/i })).toBeDefined();
    expect(getByRole('option', { name: /4 servings/i })).toBeDefined();
    expect(getByRole('option', { name: /6 servings/i })).toBeDefined();
    expect(getByRole('option', { name: /8 servings/i })).toBeDefined();
  });

  test('parses string value to number', () => {
    const handleChange = mock(() => {});
    const { container, getByRole } = render(<ServingsSelector value={2} onChange={handleChange} />);

    // Open and select
    const trigger = container.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    const option = getByRole('option', { name: /6 servings/i });
    fireEvent.click(option);

    // Should receive a number, not a string
    expect(handleChange).toHaveBeenCalledWith(6);
    expect(typeof handleChange.mock.calls[0][0]).toBe('number');
  });

  test('has combobox role on trigger', () => {
    const { container } = render(<ServingsSelector value={4} onChange={() => {}} />);

    const trigger = container.querySelector('[role="combobox"]');
    expect(trigger).toBeDefined();
  });
});
