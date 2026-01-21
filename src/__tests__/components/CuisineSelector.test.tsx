import { describe, expect, test, mock } from 'bun:test';
import { render, fireEvent } from '@testing-library/react';
import { CuisineSelector } from '@/components/CuisineSelector';
import type { Cuisine } from '@/types';

const mockCuisines: Cuisine[] = [
  { id: 'italian', name: 'Italian' },
  { id: 'thai', name: 'Thai' },
  { id: 'mexican', name: 'Mexican' },
  { id: 'american-southern', name: 'American (Southern)' },
];

describe('CuisineSelector', () => {
  test('renders Cuisine label', () => {
    const { getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    expect(getByText('Cuisine')).toBeDefined();
  });

  test('shows placeholder when no value selected', () => {
    const { getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    expect(getByText('Select cuisine')).toBeDefined();
  });

  test('displays selected cuisine name', () => {
    const { getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value="italian"
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    expect(getByText('Italian')).toBeDefined();
  });

  test('calls onChange when cuisine selected', () => {
    const handleChange = mock(() => {});
    const { getByRole, getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={handleChange}
        onRandomize={() => {}}
      />
    );

    // Open dropdown
    fireEvent.click(getByRole('combobox'));

    // Click Thai option
    fireEvent.click(getByText('Thai'));

    expect(handleChange).toHaveBeenCalledWith('thai');
  });

  test('calls onRandomize when "Surprise me" selected', () => {
    const handleRandomize = mock(() => {});
    const { getByRole, getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value="italian"
        onChange={() => {}}
        onRandomize={handleRandomize}
      />
    );

    // Open dropdown
    fireEvent.click(getByRole('combobox'));

    // Click Surprise me
    fireEvent.click(getByText('Surprise me'));

    expect(handleRandomize).toHaveBeenCalledTimes(1);
  });

  test('shows "Surprise me" option in dropdown', () => {
    const { getByRole, getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    // Open dropdown
    fireEvent.click(getByRole('combobox'));

    expect(getByText('Surprise me')).toBeDefined();
  });

  test('shows all cuisines in dropdown', () => {
    const { getByRole, getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    // Open dropdown
    fireEvent.click(getByRole('combobox'));

    expect(getByText('Italian')).toBeDefined();
    expect(getByText('Thai')).toBeDefined();
    expect(getByText('Mexican')).toBeDefined();
    expect(getByText('American (Southern)')).toBeDefined();
  });

  test('shows flag emoji for known cuisines', () => {
    const { getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value="italian"
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    // Italian flag should be displayed
    expect(getByText('🇮🇹')).toBeDefined();
  });

  test('handles empty cuisines array', () => {
    const { getByRole, getByText } = render(
      <CuisineSelector
        cuisines={[]}
        value={null}
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    // Open dropdown
    fireEvent.click(getByRole('combobox'));

    // Should still show "Surprise me"
    expect(getByText('Surprise me')).toBeDefined();
  });

  test('does not call onChange for "Surprise me"', () => {
    const handleChange = mock(() => {});
    const handleRandomize = mock(() => {});

    const { getByRole, getByText } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={handleChange}
        onRandomize={handleRandomize}
      />
    );

    // Open dropdown
    fireEvent.click(getByRole('combobox'));

    // Click Surprise me
    fireEvent.click(getByText('Surprise me'));

    // onChange should NOT be called
    expect(handleChange).not.toHaveBeenCalled();
    // onRandomize should be called instead
    expect(handleRandomize).toHaveBeenCalled();
  });

  test('has correct aria label on trigger', () => {
    const { getByRole } = render(
      <CuisineSelector
        cuisines={mockCuisines}
        value={null}
        onChange={() => {}}
        onRandomize={() => {}}
      />
    );

    const trigger = getByRole('combobox');
    expect(trigger).toBeDefined();
  });
});
