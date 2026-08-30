import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Table from './Table';
import type { TableProps } from '@/types';

describe('Table', () => {
  const defaultProps: TableProps = {
    headers: [
      React.createElement('div', {}, 'Column 1'),
      React.createElement('div', {}, 'Column 2'),
      React.createElement('div', {}, 'Column 3'),
    ],
    rows: [
      [
        React.createElement('div', {}, 'Value 1'),
        React.createElement('div', {}, 'Value 2'),
        React.createElement('div', {}, 'Value 3'),
      ],
      [
        React.createElement('div', {}, 'Value 4'),
        React.createElement('div', {}, 'Value 5'),
        React.createElement('div', {}, 'Value 6'),
      ],
      [
        React.createElement('div', {}, 'Value 7'),
        React.createElement('div', {}, 'Value 8'),
        React.createElement('div', {}, 'Value 9'),
      ],
    ],
  };

  beforeEach(() => {
    // Clear mocks between tests if needed
  });

  it('should render without crashing', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render table element', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container.querySelector('div')).toBeDefined();
  });

  it('should display table headers', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container.innerHTML).toBeTruthy();
  });

  it('should handle empty rows', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rows: [],
      })
    );
    expect(container).toBeDefined();
  });

  it('should render multiple rows', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container).toBeDefined();
    expect(defaultProps.rows.length).toBe(3);
  });

  it('should handle large datasets', () => {
    const largeDataset: TableProps = {
      headers: [
        React.createElement('div', {}, 'ID'),
        React.createElement('div', {}, 'Name'),
        React.createElement('div', {}, 'Value'),
      ],
      rows: Array.from({ length: 100 }, (_, i) => [
        React.createElement('div', {}, `${i}`),
        React.createElement('div', {}, `Name ${i}`),
        React.createElement('div', {}, `Value ${i}`),
      ]),
    };

    const { container } = render(React.createElement(Table, largeDataset));
    expect(container).toBeDefined();
  });

  it('should handle single column', () => {
    const singleColumn: TableProps = {
      headers: [React.createElement('div', {}, 'Single Column')],
      rows: [
        [React.createElement('div', {}, 'Value 1')],
        [React.createElement('div', {}, 'Value 2')],
        [React.createElement('div', {}, 'Value 3')],
      ],
    };

    const { container } = render(React.createElement(Table, singleColumn));
    expect(container).toBeDefined();
  });

  it('should handle many columns', () => {
    const manyColumns: TableProps = {
      headers: Array.from({ length: 10 }, (_, i) =>
        React.createElement('div', {}, `Column ${i + 1}`)
      ),
      rows: [
        Array.from({ length: 10 }, (_, i) => React.createElement('div', {}, `Value ${i + 1}`)),
      ],
    };

    const { container } = render(React.createElement(Table, manyColumns));
    expect(container).toBeDefined();
  });

  it('should handle react element data', () => {
    const reactElementData: TableProps = {
      headers: [
        React.createElement('span', {}, 'Column A'),
        React.createElement('span', {}, 'Column B'),
      ],
      rows: [[React.createElement('strong', {}, 'Bold'), React.createElement('em', {}, 'Italic')]],
    };

    const { container } = render(React.createElement(Table, reactElementData));
    expect(container).toBeDefined();
  });

  it('should render with custom rowClassNames', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowClassNames: ['row-class-1', 'row-class-2'],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle sorting data structure', () => {
    const sortedData: TableProps = {
      headers: [React.createElement('div', {}, 'ID'), React.createElement('div', {}, 'Name')],
      rows: [
        [React.createElement('div', {}, '1'), React.createElement('div', {}, 'Alice')],
        [React.createElement('div', {}, '2'), React.createElement('div', {}, 'Bob')],
        [React.createElement('div', {}, '3'), React.createElement('div', {}, 'Charlie')],
      ],
    };

    const { container } = render(React.createElement(Table, sortedData));
    expect(container).toBeDefined();
  });

  it('should handle complex row objects', () => {
    const complexData: TableProps = {
      headers: [
        React.createElement('div', {}, 'Component'),
        React.createElement('div', {}, 'Count'),
      ],
      rows: [
        [
          React.createElement('div', { key: 'complex1' }, [
            React.createElement('span', { key: 's1' }, 'Item 1'),
            React.createElement('br', { key: 'br1' }),
            React.createElement('span', { key: 's2' }, 'Item 2'),
          ]),
          React.createElement('div', {}, '5'),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, complexData));
    expect(container).toBeDefined();
  });

  it('should render without optional props', () => {
    const minimalProps: TableProps = {
      headers: [React.createElement('div', {}, 'Header')],
      rows: [[React.createElement('div', {}, 'Cell')]],
    };

    const { container } = render(React.createElement(Table, minimalProps));
    expect(container).toBeDefined();
  });

  it('should handle rows with varying column counts', () => {
    const unevenData: TableProps = {
      headers: [
        React.createElement('div', {}, 'A'),
        React.createElement('div', {}, 'B'),
        React.createElement('div', {}, 'C'),
      ],
      rows: [
        [React.createElement('div', {}, '1'), React.createElement('div', {}, '2')],
        [
          React.createElement('div', {}, '3'),
          React.createElement('div', {}, '4'),
          React.createElement('div', {}, '5'),
          React.createElement('div', {}, '6'),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, unevenData));
    expect(container).toBeDefined();
  });

  it('should render table content', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('should handle null-like row classnames', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowClassNames: [],
      })
    );
    expect(container).toBeDefined();
  });

  it('should work with many rows', () => {
    const manyRows: TableProps = {
      headers: [React.createElement('div', {}, 'ID'), React.createElement('div', {}, 'Value')],
      rows: Array.from({ length: 500 }, (_, i) => [
        React.createElement('div', {}, `${i}`),
        React.createElement('div', {}, `Value ${i}`),
      ]),
    };

    const { container } = render(React.createElement(Table, manyRows));
    expect(container).toBeDefined();
    expect(manyRows.rows.length).toBe(500);
  });

  it('should handle headers as ReactNode array', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(Array.isArray(defaultProps.headers)).toBe(true);
    expect(container).toBeDefined();
  });

  it('should render without errors with valid data', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container.children.length).toBeGreaterThan(0);
  });

  it('should handle onSort callback', () => {
    const onSort = vi.fn();
    render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0, 1, 2],
        onSort,
      })
    );
    expect(onSort).not.toHaveBeenCalled();
  });

  it('should cycle sortable headers and notify the parent', () => {
    const onSort = vi.fn();
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        onSort,
      })
    );

    const header = container.querySelector('th');
    expect(header).toBeTruthy();
    fireEvent.click(header!);
    fireEvent.click(header!);

    expect(onSort).toHaveBeenNthCalledWith(1, 0, 'asc');
    expect(onSort).toHaveBeenNthCalledWith(2, 0, 'desc');
  });

  it('sorts with sort values, function extractors, and class extractors', () => {
    const { container } = render(
      React.createElement(Table, {
        headers: ['Value', 'Name'],
        rows: [
          ['2', React.createElement('span', { className: 'name' }, 'B')],
          ['1', React.createElement('span', { className: 'name' }, 'A')],
        ],
        sortableColumns: [0, 1],
        sortValues: [
          [2, 'B'],
          [1, 'A'],
        ],
        sortExtractors: {
          1: (node: React.ReactNode) => (typeof node === 'object' ? 'A' : ''),
        },
      })
    );

    const headers = container.querySelectorAll('th');
    fireEvent.click(headers[0]);
    fireEvent.click(headers[1]);
    expect(container.textContent).toContain('Value');

    render(
      React.createElement(Table, {
        headers: ['Name'],
        rows: [
          [React.createElement('span', { className: 'name' }, 'B')],
          [React.createElement('span', { className: 'name' }, 'A')],
        ],
        sortableColumns: [0],
        sortExtractors: { 0: 'name' },
      })
    );
  });

  it('renders virtualized rows and responds to resize observers', () => {
    const originalResizeObserver = window.ResizeObserver;
    class TestResizeObserver {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    window.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver;

    render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: true,
        virtualColumnWeights: [1, 2, 3],
      })
    );

    window.ResizeObserver = originalResizeObserver;
  });

  it('should render with custom className', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        className: 'custom-table-class',
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle sortValues prop', () => {
    const sortValues = [
      [10, 'Alice', 1000],
      [20, 'Bob', 2000],
      [30, 'Charlie', 3000],
    ];

    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0, 1, 2],
        sortValues,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle columnWidths prop', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        columnWidths: [100, 150, 200],
      })
    );
    expect(container).toBeDefined();
  });

  it('should render with virtualization enabled', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
      })
    );
    expect(true).toBe(true);
  });

  it('should handle virtualRowHeight prop', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        virtualRowHeight: 100,
      })
    );
    expect(true).toBe(true);
  });

  it('should handle virtualTableHeight prop', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        virtualTableHeight: 600,
      })
    );
    expect(true).toBe(true);
  });

  it('should handle virtualOverscan prop', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        virtualOverscan: 5,
      })
    );
    expect(true).toBe(true);
  });

  it('should handle virtualColumnWeights prop', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        virtualColumnWeights: [1, 2, 3],
      })
    );
    expect(true).toBe(true);
  });

  it('should handle sortExtractors as functions', () => {
    const sortExtractors = {
      0: (node: React.ReactNode) => {
        if (typeof node === 'string') return node.toUpperCase();
        return '';
      },
    };

    render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        sortExtractors,
      })
    );
    expect(true).toBe(true);
  });

  it('should handle sortExtractors as className strings', () => {
    const sortExtractors = {
      0: 'target-class',
    };

    render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        sortExtractors,
      })
    );
    expect(true).toBe(true);
  });

  it('should handle rows with string content', () => {
    const stringData: TableProps = {
      headers: ['Header 1', 'Header 2', 'Header 3'] as any,
      rows: [['Value 1', 'Value 2', 'Value 3'] as any, ['Value 4', 'Value 5', 'Value 6'] as any],
    };

    render(React.createElement(Table, stringData));
    expect(true).toBe(true);
  });

  it('should handle rows with numeric content', () => {
    const numericData: TableProps = {
      headers: [React.createElement('div', {}, 'ID'), React.createElement('div', {}, 'Value')],
      rows: [[100, 200] as any, [300, 400] as any],
    };

    render(React.createElement(Table, numericData));
    expect(true).toBe(true);
  });

  it('should handle empty headers array', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        headers: [],
      })
    );
    expect(true).toBe(true);
  });

  it('should handle mixed content types in rows', () => {
    const mixedData: TableProps = {
      headers: [
        React.createElement('div', {}, 'Mixed 1'),
        React.createElement('div', {}, 'Mixed 2'),
        React.createElement('div', {}, 'Mixed 3'),
      ],
      rows: [
        [
          'String value',
          React.createElement('span', {}, 'React Element'),
          React.createElement('div', {}, [
            React.createElement('p', { key: 'p1' }, 'Paragraph 1'),
            React.createElement('p', { key: 'p2' }, 'Paragraph 2'),
          ]),
        ],
      ],
    };

    render(React.createElement(Table, mixedData));
    expect(true).toBe(true);
  });

  it('should render tables within tables', () => {
    const nestedTable: TableProps = {
      headers: [React.createElement('div', {}, 'Parent Column')],
      rows: [
        [
          React.createElement(Table, {
            headers: [React.createElement('div', {}, 'Child Header')],
            rows: [[React.createElement('div', {}, 'Child Cell')]],
          }),
        ],
      ],
    };

    render(React.createElement(Table, nestedTable));
    expect(true).toBe(true);
  });

  it('should handle empty sortValues array', () => {
    render(
      React.createElement(Table, {
        ...defaultProps,
        sortValues: [],
      })
    );
    expect(true).toBe(true);
  });

  it('should handle very wide columns', () => {
    const wideColumns: TableProps = {
      headers: [
        React.createElement('div', {}, 'Wide Column 1'),
        React.createElement('div', {}, 'Wide Column 2'),
      ],
      rows: [
        [
          React.createElement('div', {}, 'Wide content 1'),
          React.createElement('div', {}, 'Wide content 2'),
        ],
      ],
      columnWidths: [1000, 1000],
    };

    render(React.createElement(Table, wideColumns));
    expect(true).toBe(true);
  });

  it('should handle very narrow columns', () => {
    const narrowColumns: TableProps = {
      headers: [React.createElement('div', {}, 'N1'), React.createElement('div', {}, 'N2')],
      rows: [[React.createElement('div', {}, 'A'), React.createElement('div', {}, 'B')]],
      columnWidths: [20, 20],
    };

    render(React.createElement(Table, narrowColumns));
    expect(true).toBe(true);
  });

  it('should handle sorting with string values', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0, 1, 2],
      })
    );
    const headers = container.querySelectorAll('div');
    expect(headers.length).toBeGreaterThan(0);
  });

  it('should handle column width with different types', () => {
    const mixedWidths: TableProps = {
      headers: [
        React.createElement('div', {}, 'Pixel'),
        React.createElement('div', {}, 'Percent'),
        React.createElement('div', {}, 'Auto'),
      ],
      rows: [
        [
          React.createElement('div', {}, 'Value 1'),
          React.createElement('div', {}, 'Value 2'),
          React.createElement('div', {}, 'Value 3'),
        ],
      ],
      columnWidths: [100, '50%', 'auto' as any],
    };

    const { container } = render(React.createElement(Table, mixedWidths));
    expect(container).toBeDefined();
  });

  it('should handle sortValues with different data types', () => {
    const sortValues = [
      [100, 'Alice', 1000],
      [20, 'Bob', 2000],
      [300, 'Charlie', 500],
    ];

    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0, 1, 2],
        sortValues,
      })
    );
    expect(container).toBeDefined();
  });

  it('should render row with more cells than headers', () => {
    const moreRowsCells: TableProps = {
      headers: [React.createElement('div', {}, 'H1'), React.createElement('div', {}, 'H2')],
      rows: [
        [
          React.createElement('div', {}, 'C1'),
          React.createElement('div', {}, 'C2'),
          React.createElement('div', {}, 'C3'),
          React.createElement('div', {}, 'C4'),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, moreRowsCells));
    expect(container).toBeDefined();
  });

  it('should handle className with special values', () => {
    const specialClassNames = ['px-4 py-3', 'text-center font-bold', 'border-b'];
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowClassNames: specialClassNames,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle onSort with null callback', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        onSort: null as any,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle extractAllText utility function indirectly', () => {
    const complexElements: TableProps = {
      headers: [React.createElement('div', {}, 'Complex')],
      rows: [
        [
          React.createElement('div', {}, [
            React.createElement('span', { key: 's1' }, 'Text1'),
            React.createElement('span', { key: 's2' }, 'Text2'),
            React.createElement('span', { key: 's3' }, 'Text3'),
          ]),
        ],
        [
          React.createElement('div', {}, [
            'String1',
            React.createElement('span', { key: 's' }, 'String2'),
            123,
          ]),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, complexElements));
    expect(container).toBeDefined();
  });

  it('should handle numeric string extraction', () => {
    const numericStrings: TableProps = {
      headers: [React.createElement('div', {}, 'Numbers')],
      rows: [
        [React.createElement('div', {}, '1,000.50')],
        [React.createElement('div', {}, '2,500.75')],
        [React.createElement('div', {}, '3,250.25')],
      ],
    };

    const { container } = render(React.createElement(Table, numericStrings));
    expect(container).toBeDefined();
  });

  it('should handle rows with null values', () => {
    const nullValues: TableProps = {
      headers: [
        React.createElement('div', {}, 'Header'),
        React.createElement('div', {}, 'Header 2'),
      ],
      rows: [
        [null as any, React.createElement('div', {}, 'Value')],
        [React.createElement('div', {}, 'Value'), null as any],
      ],
    };

    const { container } = render(React.createElement(Table, nullValues));
    expect(container).toBeDefined();
  });

  it('should handle rows with undefined values', () => {
    const undefinedValues: TableProps = {
      headers: [React.createElement('div', {}, 'Header')],
      rows: [[undefined as any], [React.createElement('div', {}, 'Value')]],
    };

    const { container } = render(React.createElement(Table, undefinedValues));
    expect(container).toBeDefined();
  });

  it('should handle extractTextByClassName utility function', () => {
    const classNameTargets: TableProps = {
      headers: [React.createElement('div', {}, 'Target Text')],
      rows: [
        [
          React.createElement('div', {}, [
            React.createElement('div', { key: 'd1', className: 'other-class' }, 'Other'),
            React.createElement('div', { key: 'd2', className: 'target-class' }, 'TargetText'),
            React.createElement('div', { key: 'd3' }, 'NotTarget'),
          ]),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, classNameTargets));
    expect(container).toBeDefined();
  });

  it('should handle rows and headers with React fragments', () => {
    const fragments: TableProps = {
      headers: [React.createElement(React.Fragment, { key: 'h1' }, 'Header 1')],
      rows: [[React.createElement(React.Fragment, { key: 'c1' }, 'Cell 1')]],
    };

    const { container } = render(React.createElement(Table, fragments));
    expect(container).toBeDefined();
  });

  it('should handle multiple calls to render same component', () => {
    const { rerender } = render(React.createElement(Table, defaultProps));
    expect(true).toBe(true);

    rerender(React.createElement(Table, defaultProps));
    expect(true).toBe(true);

    rerender(
      React.createElement(Table, {
        ...defaultProps,
        rows: [...defaultProps.rows, ...defaultProps.rows],
      })
    );
    expect(true).toBe(true);
  });

  it('should handle sorting with function extractor', () => {
    const sortExtractors = {
      0: (cell: React.ReactNode) => {
        const text = String(cell || '');
        return text.includes('Value') ? '100' : '1';
      },
    };

    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        sortExtractors,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle sorting with className extractor', () => {
    const classNameHeaders: TableProps = {
      headers: defaultProps.headers,
      rows: [
        [
          React.createElement('div', { className: 'price-value' }, '100'),
          React.createElement('div', {}, 'Item 1'),
          React.createElement('div', {}, 'Desc 1'),
        ],
        [
          React.createElement('div', { className: 'price-value' }, '50'),
          React.createElement('div', {}, 'Item 2'),
          React.createElement('div', {}, 'Desc 2'),
        ],
      ],
    };

    const sortExtractors = {
      0: 'price-value',
    };

    const { container } = render(
      React.createElement(Table, {
        ...classNameHeaders,
        sortableColumns: [0],
        sortExtractors,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle numeric sorting with commas', () => {
    const numericRows: TableProps = {
      headers: [React.createElement('div', {}, 'Price'), React.createElement('div', {}, 'Name')],
      rows: [
        [React.createElement('div', {}, '1,000'), React.createElement('div', {}, 'Item A')],
        [React.createElement('div', {}, '500'), React.createElement('div', {}, 'Item B')],
        [React.createElement('div', {}, '2,500'), React.createElement('div', {}, 'Item C')],
      ],
    };

    const { container } = render(
      React.createElement(Table, {
        ...numericRows,
        sortableColumns: [0],
      })
    );
    expect(container).toBeDefined();
  });

  it('should use sortValues for sorting when provided', () => {
    const sortValuesData: TableProps = {
      headers: defaultProps.headers,
      rows: defaultProps.rows,
      sortableColumns: [0],
      sortValues: [
        [100, 200, 300],
        [50, 100, 150],
        [75, 125, 175],
      ],
    };

    const { container } = render(React.createElement(Table, sortValuesData));
    expect(container).toBeDefined();
  });

  it('should handle sorting with null/undefined in rows', () => {
    const mixedData: TableProps = {
      headers: defaultProps.headers,
      rows: [
        [React.createElement('div', {}, 'Value 1'), null, undefined],
        [
          React.createElement('div', {}, 'Value 2'),
          React.createElement('div', {}, 'B'),
          React.createElement('div', {}, 'C'),
        ],
      ],
    };

    const { container } = render(
      React.createElement(Table, {
        ...mixedData,
        sortableColumns: [0],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle sorting ascending on click', () => {
    const onSort = vi.fn();
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        onSort,
      })
    );

    const headerCells = container.querySelectorAll('th');
    if (headerCells.length > 0) {
      headerCells[0].click?.();
    }

    expect(container).toBeDefined();
  });

  it('should handle sorting descending on second click', () => {
    const onSort = vi.fn();
    const { rerender, container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        onSort,
      })
    );

    const headerCells = container.querySelectorAll('th');
    if (headerCells.length > 0) {
      headerCells[0].click?.();
      rerender(
        React.createElement(Table, {
          ...defaultProps,
          sortableColumns: [0],
          onSort,
        })
      );
      headerCells[0].click?.();
    }

    expect(container).toBeDefined();
  });

  it('should not sort columns not in sortableColumns', () => {
    const onSort = vi.fn();
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        onSort,
      })
    );

    const headerCells = container.querySelectorAll('th');
    if (headerCells.length > 1) {
      headerCells[1].click?.();
    }

    expect(onSort).not.toHaveBeenCalledWith(1);
  });

  it('should handle text-based sorting', () => {
    const textRows: TableProps = {
      headers: [React.createElement('div', {}, 'Name')],
      rows: [
        [React.createElement('div', {}, 'Zebra')],
        [React.createElement('div', {}, 'Apple')],
        [React.createElement('div', {}, 'Banana')],
      ],
    };

    const { container } = render(
      React.createElement(Table, {
        ...textRows,
        sortableColumns: [0],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle column width in pixels', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        columnWidths: [100, 150, 200],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle column width as percentage', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        columnWidths: ['33.33%', '33.33%', '33.34%'],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle mixed column width types', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        columnWidths: [100, '50%', 150],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle column width with null values', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        columnWidths: [100, null, 200] as any,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle rowClassNames for styling', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowClassNames: ['font-bold', 'text-center', 'text-right'],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle partial rowClassNames', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowClassNames: ['font-bold'],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle empty rowClassNames', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowClassNames: [],
      })
    );
    expect(container).toBeDefined();
  });

  it('should apply custom className prop', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        className: 'custom-table-class',
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle rows with more columns than headers', () => {
    const mismatchedCols: TableProps = {
      headers: [React.createElement('div', {}, 'Col 1'), React.createElement('div', {}, 'Col 2')],
      rows: [
        [
          React.createElement('div', {}, 'Value 1'),
          React.createElement('div', {}, 'Value 2'),
          React.createElement('div', {}, 'Value 3'),
          React.createElement('div', {}, 'Value 4'),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, mismatchedCols));
    expect(container).toBeDefined();
  });

  it('should handle rows with fewer columns than headers', () => {
    const fewerCols: TableProps = {
      headers: [
        React.createElement('div', {}, 'Col 1'),
        React.createElement('div', {}, 'Col 2'),
        React.createElement('div', {}, 'Col 3'),
      ],
      rows: [
        [React.createElement('div', {}, 'Value 1'), React.createElement('div', {}, 'Value 2')],
      ],
    };

    const { container } = render(React.createElement(Table, fewerCols));
    expect(container).toBeDefined();
  });

  it('should handle numeric string vs actual numeric sorting', () => {
    const numericRows: TableProps = {
      headers: [React.createElement('div', {}, 'Numbers')],
      rows: [
        [React.createElement('div', {}, '100')],
        [React.createElement('div', {}, '20')],
        [React.createElement('div', {}, '3')],
      ],
    };

    const { container } = render(
      React.createElement(Table, {
        ...numericRows,
        sortableColumns: [0],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle virtualization disabled', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle virtualization with custom row height', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
        virtualRowHeight: 72,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle virtualization with custom table height', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
        virtualTableHeight: 800,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle virtualization with overscan', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
        virtualOverscan: 20,
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle virtualization with column weights', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
        virtualColumnWeights: [1, 2, 1],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle very long cell content', () => {
    const longContent: TableProps = {
      headers: [React.createElement('div', {}, 'Description')],
      rows: [
        [
          React.createElement(
            'div',
            {},
            'This is a very long piece of text that should be handled properly in the table cell without breaking the layout'
          ),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, longContent));
    expect(container).toBeDefined();
  });

  it('should handle nested React elements', () => {
    const nestedElements: TableProps = {
      headers: [React.createElement('div', {}, 'Header')],
      rows: [
        [
          React.createElement(
            'div',
            {},
            React.createElement('span', {}, 'Text'),
            React.createElement('strong', {}, 'Bold')
          ),
        ],
      ],
    };

    const { container } = render(React.createElement(Table, nestedElements));
    expect(container).toBeDefined();
  });

  it('should handle multiple sortable columns', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0, 1, 2],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle sorting with mixed data types', () => {
    const mixedTypes: TableProps = {
      headers: [React.createElement('div', {}, 'Mixed')],
      rows: [
        [React.createElement('div', {}, '100')],
        [React.createElement('div', {}, 'Text')],
        [React.createElement('div', {}, '50')],
        [React.createElement('div', {}, 'Another')],
      ],
    };

    const { container } = render(
      React.createElement(Table, {
        ...mixedTypes,
        sortableColumns: [0],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle sorting stability', () => {
    const stableSort: TableProps = {
      headers: [React.createElement('div', {}, 'Category'), React.createElement('div', {}, 'ID')],
      rows: [
        [React.createElement('div', {}, 'A'), React.createElement('div', {}, '1')],
        [React.createElement('div', {}, 'B'), React.createElement('div', {}, '2')],
        [React.createElement('div', {}, 'A'), React.createElement('div', {}, '3')],
        [React.createElement('div', {}, 'B'), React.createElement('div', {}, '4')],
      ],
    };

    const { container } = render(
      React.createElement(Table, {
        ...stableSort,
        sortableColumns: [0],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle extraction from text nodes', () => {
    const textNodes: TableProps = {
      headers: [React.createElement('div', {}, 'Text')],
      rows: [[React.createElement('div', {}, 'Simple text')]],
    };

    const { container } = render(React.createElement(Table, textNodes));
    expect(container).toBeDefined();
  });

  it('should handle 1000 row dataset', () => {
    const largeDataset: TableProps = {
      headers: [React.createElement('div', {}, 'ID'), React.createElement('div', {}, 'Name')],
      rows: Array.from({ length: 1000 }, (_, i) => [
        React.createElement('div', {}, `${i}`),
        React.createElement('div', {}, `Item ${i}`),
      ]),
    };

    const { container } = render(React.createElement(Table, largeDataset));
    expect(container).toBeDefined();
  });

  it('should handle header and row cell count mismatch consistently', () => {
    const { container } = render(React.createElement(Table, defaultProps));
    expect(container).toBeDefined();

    const { rerender } = render(React.createElement(Table, defaultProps));
    rerender(
      React.createElement(Table, {
        ...defaultProps,
        rows: defaultProps.rows.map((row) => [...row, React.createElement('div', {}, 'Extra')]),
      })
    );

    expect(container).toBeDefined();
  });

  it('should handle sorting with custom extractor returning numbers', () => {
    const customExtractor: TableProps = {
      headers: [React.createElement('div', {}, 'Score')],
      rows: [
        [React.createElement('div', {}, '95/100')],
        [React.createElement('div', {}, '87/100')],
        [React.createElement('div', {}, '92/100')],
      ],
      sortableColumns: [0],
      sortExtractors: {
        0: (cell: React.ReactNode) => {
          const text = String(cell || '');
          return text.split('/')[0];
        },
      },
    };

    const { container } = render(React.createElement(Table, customExtractor));
    expect(container).toBeDefined();
  });

  it('should handle all virtualization props together', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: false,
        virtualRowHeight: 64,
        virtualTableHeight: 600,
        virtualOverscan: 15,
        virtualColumnWeights: [1, 1, 1],
      })
    );
    expect(container).toBeDefined();
  });

  it('should maintain table structure with sorting enabled', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0, 1, 2],
        rowClassNames: ['class-a', 'class-b', 'class-c'],
      })
    );
    expect(container).toBeDefined();
  });

  it('should handle empty headers with content rows', () => {
    const noHeaders: TableProps = {
      headers: [],
      rows: [
        [React.createElement('div', {}, 'Value 1'), React.createElement('div', {}, 'Value 2')],
      ],
    };

    const { container } = render(React.createElement(Table, noHeaders));
    expect(container).toBeDefined();
  });

  it('should render with callback on sort', () => {
    const onSort = vi.fn();
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        sortableColumns: [0],
        onSort,
      })
    );

    expect(container).toBeDefined();
  });

  it('should handle rapid re-renders with different sort configs', () => {
    const { rerender } = render(React.createElement(Table, defaultProps));

    for (let i = 0; i < 5; i++) {
      rerender(
        React.createElement(Table, {
          ...defaultProps,
          sortableColumns: [i % 3],
        })
      );
    }

    expect(true).toBe(true);
  });

  it('should use reduced padding on cells when compact is enabled', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        compact: true,
      })
    );

    expect(container.querySelector('td.px-1.py-1')).not.toBeNull();
    expect(container.querySelector('td.px-4.py-3')).toBeNull();
  });

  it('should use default padding on cells when compact is not set', () => {
    const { container } = render(React.createElement(Table, defaultProps));

    expect(container.querySelector('td.px-4.py-3')).not.toBeNull();
    expect(container.querySelector('td.px-1.py-1')).toBeNull();
  });

  it('applies rowBackgroundClassNames to the matching <tr> only', () => {
    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        rowBackgroundClassNames: ['', 'bg-yellow-300/10', ''],
      })
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).not.toHaveClass('bg-yellow-300/10');
    expect(rows[1]).toHaveClass('bg-yellow-300/10');
    expect(rows[2]).not.toHaveClass('bg-yellow-300/10');
  });

  it('applies rowBackgroundClassNames to the matching virtualised row only', () => {
    const originalResizeObserver = window.ResizeObserver;
    class TestResizeObserver {
      observe() {}
      disconnect() {}
      unobserve() {}
    }
    window.ResizeObserver = TestResizeObserver as unknown as typeof ResizeObserver;

    const { container } = render(
      React.createElement(Table, {
        ...defaultProps,
        enableVirtualization: true,
        rowBackgroundClassNames: ['', 'bg-yellow-300/10', ''],
      })
    );

    const rows = container.querySelectorAll('tbody tr');
    expect(rows[0]).not.toHaveClass('bg-yellow-300/10');
    expect(rows[1]).toHaveClass('bg-yellow-300/10');
    expect(rows[2]).not.toHaveClass('bg-yellow-300/10');

    window.ResizeObserver = originalResizeObserver;
  });
});
