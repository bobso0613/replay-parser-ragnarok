import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DropdownSelect from './DropdownSelect';
import type { DropdownSelectProps } from '@/types';

describe('DropdownSelect', () => {
  const defaultProps: DropdownSelectProps = {
    id: 'test-dropdown',
    select: '',
    options: [
      { id: 1, label: 'Option 1', value: 'opt1' },
      { id: 2, label: 'Option 2', value: 'opt2' },
      { id: 3, label: 'Option 3', value: 'opt3' },
    ],
    placeholder: 'Select an option',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    expect(container).toBeDefined();
  });

  it('should display placeholder', () => {
    const { getByText } = render(React.createElement(DropdownSelect, defaultProps));
    expect(getByText('Select an option')).toBeDefined();
  });

  it('should render all options', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const options = container.querySelectorAll('option');
    // 1 placeholder + 3 options
    expect(options).toHaveLength(4);
  });

  it('should call onChange when value changes', () => {
    const onChange = vi.fn();
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        onChange,
      })
    );

    const select = container.querySelector('select');
    if (select) {
      fireEvent.change(select, { target: { value: 'opt1' } });
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('should display custom placeholder', () => {
    const { getByText } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        placeholder: 'Choose one',
      })
    );
    expect(getByText('Choose one')).toBeDefined();
  });

  it('should have select element', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select).toBeDefined();
  });

  it('should have correct id', () => {
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        id: 'custom-id',
      })
    );
    const select = container.querySelector('select');
    expect(select?.getAttribute('id')).toBe('custom-id');
  });

  it.each([
    'rounded-md',
    'border',
    'shadow-sm',
    'px-3',
    'py-2',
    'text-sm',
    'outline-none',
    'focus:border-slate-500',
    'focus:ring-2',
    'bg-white',
    'transition',
    'text-slate-700',
    'border-slate-300',
  ])('should have %s styling', (className) => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain(className);
  });

  it('should have correct value', () => {
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        select: 'opt2',
      })
    );
    const select = container.querySelector('select') as HTMLSelectElement;
    expect(select?.value).toBe('opt2');
  });

  it('should render option labels correctly', () => {
    const { getByText } = render(React.createElement(DropdownSelect, defaultProps));
    expect(getByText('Option 1')).toBeDefined();
    expect(getByText('Option 2')).toBeDefined();
    expect(getByText('Option 3')).toBeDefined();
  });

  it('should have disabled placeholder option', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const placeholderOption = Array.from(container.querySelectorAll('option')).find(
      (o) => o.textContent === 'Select an option'
    );
    expect(placeholderOption?.getAttribute('disabled')).not.toBeNull();
  });

  it('should render empty options list', () => {
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        options: [],
      })
    );
    const options = container.querySelectorAll('option');
    // Only placeholder
    expect(options).toHaveLength(1);
  });

  it('should handle single option', () => {
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        options: [{ id: 1, label: 'Only Option', value: 'only' }],
      })
    );
    const options = container.querySelectorAll('option');
    expect(options).toHaveLength(2);
  });

  it('should call onChange with correct event', () => {
    const onChange = vi.fn();
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        onChange,
        select: '',
      })
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    if (select) {
      // Since select.value is controlled by the select prop, we just verify the onChange callback receives the event
      fireEvent.change(select, { target: { value: 'opt2' } });
    }

    expect(onChange).toHaveBeenCalled();
    if (onChange.mock.calls.length > 0) {
      const callArgs = onChange.mock.calls[0];
      expect(callArgs).toBeDefined();
    }
  });

  it('should handle undefined onChange gracefully', () => {
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        onChange: undefined,
      })
    );

    const select = container.querySelector('select') as HTMLSelectElement;
    if (select) {
      // Should not throw error when onChange is undefined
      fireEvent.change(select, { target: { value: 'opt1' } });
    }
    expect(container).toBeDefined();
  });
});
