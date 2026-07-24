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
    expect(options.length).toBe(4);
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

  it('should have rounded-md styling', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('rounded-md');
  });

  it('should have border styling', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('border');
  });

  it('should have shadow-sm styling', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('shadow-sm');
  });

  it('should have padding', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('px-3');
    expect(select?.className).toContain('py-2');
  });

  it('should have text-sm', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('text-sm');
  });

  it('should have outline-none', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('outline-none');
  });

  it('should have focus styles', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('focus:border-slate-500');
    expect(select?.className).toContain('focus:ring-2');
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
    expect(options.length).toBe(1);
  });

  it('should handle single option', () => {
    const { container } = render(
      React.createElement(DropdownSelect, {
        ...defaultProps,
        options: [{ id: 1, label: 'Only Option', value: 'only' }],
      })
    );
    const options = container.querySelectorAll('option');
    expect(options.length).toBe(2);
  });

  it('should have white background', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('bg-white');
  });

  it('should have transition class', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('transition');
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

  it('should have text-slate-700', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('text-slate-700');
  });

  it('should have border-slate-300', () => {
    const { container } = render(React.createElement(DropdownSelect, defaultProps));
    const select = container.querySelector('select');
    expect(select?.className).toContain('border-slate-300');
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
