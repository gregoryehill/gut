import { describe, expect, test, mock } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import { SeasonSelector } from '@/components/SeasonSelector';

describe('SeasonSelector', () => {
  test('renders Season label', () => {
    const { getByText } = render(<SeasonSelector value="summer" onChange={() => {}} />);

    expect(getByText('Season')).toBeDefined();
  });

  test('displays current season value', () => {
    const { container } = render(<SeasonSelector value="summer" onChange={() => {}} />);

    const trigger = container.querySelector('[data-slot="select-trigger"]');
    expect(trigger?.textContent).toContain('Summer');
  });

  test('displays all seasons correctly', () => {
    const seasons = ['spring', 'summer', 'fall', 'winter'] as const;
    const labels = ['Spring', 'Summer', 'Fall', 'Winter'];

    seasons.forEach((season, index) => {
      const { container, unmount } = render(
        <SeasonSelector value={season} onChange={() => {}} />
      );

      const trigger = container.querySelector('[data-slot="select-trigger"]');
      expect(trigger?.textContent).toContain(labels[index]);
      unmount();
    });
  });

  test('calls onChange with new season', () => {
    const handleChange = mock(() => {});
    const { container, getByRole } = render(<SeasonSelector value="summer" onChange={handleChange} />);

    // Open the dropdown
    const trigger = container.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    // Click on Fall option
    const fallOption = getByRole('option', { name: 'Fall' });
    fireEvent.click(fallOption);

    expect(handleChange).toHaveBeenCalledWith('fall');
  });

  test('shows all season options in dropdown', () => {
    const { container, getByRole } = render(<SeasonSelector value="summer" onChange={() => {}} />);

    // Open the dropdown
    const trigger = container.querySelector('[data-slot="select-trigger"]') as HTMLElement;
    fireEvent.click(trigger);

    // All options should be visible
    expect(getByRole('option', { name: 'Spring' })).toBeDefined();
    expect(getByRole('option', { name: 'Summer' })).toBeDefined();
    expect(getByRole('option', { name: 'Fall' })).toBeDefined();
    expect(getByRole('option', { name: 'Winter' })).toBeDefined();
  });

  test('has combobox role on trigger', () => {
    const { container } = render(<SeasonSelector value="summer" onChange={() => {}} />);

    const trigger = container.querySelector('[role="combobox"]');
    expect(trigger).toBeDefined();
  });
});
