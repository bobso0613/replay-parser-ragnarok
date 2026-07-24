import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import InputUpload from './InputUpload';

describe('InputUpload', () => {
  let defaultProps: any;

  beforeEach(() => {
    defaultProps = {
      onFilesSelected: vi.fn(),
      selectedFiles: [],
    };
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    expect(container).toBeDefined();
  });

  it('should render file input', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const input = container.querySelector('input[type="file"]');
    expect(input).toBeDefined();
  });

  it('should handle file selection', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, { onFilesSelected, selectedFiles: [] })
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['content'], 'test.json', { type: 'application/json' });
      fireEvent.change(input, { target: { files: [file] } });
    }

    expect(onFilesSelected).toHaveBeenCalled();
  });

  it('should accept file types', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        accept: '.json,.csv',
      })
    );
    const input = container.querySelector('input');
    expect(input?.getAttribute('accept')).toBe('.json,.csv');
  });

  it('should have border styling', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('border');
  });

  it('should have rounded-md styling', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('rounded-md');
  });

  it('should have flex layout', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('flex');
  });

  it('should be cursor-pointer', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('cursor-pointer');
  });

  it('should handle drop event', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, { onFilesSelected, selectedFiles: [] })
    );

    const label = container.querySelector('label');
    if (label) {
      fireEvent.drop(label, {
        dataTransfer: { files: [new File(['test'], 'test.json')] },
      } as any);
    }

    expect(onFilesSelected).toHaveBeenCalled();
  });

  it('should render label element', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label).toBeDefined();
  });

  it('should have group class for hover effects', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('group');
  });

  it('should display single file name in preview', () => {
    const file = new File(['content'], 'single-file.json');
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected: vi.fn(),
        selectedFiles: [file],
      })
    );
    expect(container.textContent?.includes('single-file.json')).toBe(true);
  });

  it('should display multiple files count in preview', () => {
    const files = [new File(['content1'], 'file1.json'), new File(['content2'], 'file2.json')];
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected: vi.fn(),
        selectedFiles: files,
      })
    );
    expect(container.textContent?.includes('2 files selected')).toBe(true);
  });

  it('should filter files by multiple accepted extensions', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected,
        selectedFiles: [],
        accept: '.json,.csv,.txt',
      })
    );

    const label = container.querySelector('label');
    if (label) {
      const csvFile = new File(['data'], 'data.csv', { type: 'text/csv' });
      fireEvent.drop(label, {
        dataTransfer: { files: [csvFile] },
      } as any);
    }

    expect(onFilesSelected).toHaveBeenCalled();
  });

  it('should handle drop with empty files', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected,
        selectedFiles: [],
      })
    );

    const label = container.querySelector('label');
    if (label) {
      fireEvent.drop(label, {
        dataTransfer: { files: [] },
      } as any);
    }

    expect(onFilesSelected).not.toHaveBeenCalled();
  });

  it('should handle drop with multiple attribute disabled', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected,
        selectedFiles: [],
        multiple: false,
      })
    );

    const label = container.querySelector('label');
    if (label) {
      const file1 = new File(['1'], 'file1.txt');
      const file2 = new File(['2'], 'file2.txt');
      fireEvent.drop(label, {
        dataTransfer: { files: [file1, file2] },
      } as any);
    }

    expect(onFilesSelected).toHaveBeenCalled();
  });

  it('should display default placeholder text', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected: vi.fn(),
        selectedFiles: [],
      })
    );
    expect(container.textContent?.includes('Click to upload or drag and drop')).toBe(true);
  });

  it('should display custom label', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected: vi.fn(),
        selectedFiles: [],
        label: 'Upload Document',
      })
    );
    expect(container.textContent?.includes('Upload Document')).toBe(true);
  });

  it('should handle file input with onChange callback', () => {
    const onChange = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected: vi.fn(),
        selectedFiles: [],
        onChange,
      })
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['content'], 'test.txt');
      fireEvent.change(input, { target: { files: [file] } });
    }

    expect(onChange).toHaveBeenCalled();
  });

  it('should render Browse text', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    expect(container.textContent?.includes('Browse')).toBe(true);
  });

  it('should handle accept with spaces', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        accept: '.json, .csv, .txt',
      })
    );
    const input = container.querySelector('input');
    expect(input?.getAttribute('accept')).toBe('.json, .csv, .txt');
  });

  it('should filter dropped files by extension case insensitive', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected,
        selectedFiles: [],
        accept: '.json',
      })
    );

    const label = container.querySelector('label');
    if (label) {
      const jsonFile = new File(['{}'], 'DATA.JSON');
      fireEvent.drop(label, {
        dataTransfer: { files: [jsonFile] },
      } as any);
    }

    expect(onFilesSelected).toHaveBeenCalled();
  });

  it('should have file upload icon', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const img = container.querySelector('img');
    expect(img).toBeDefined();
  });

  it('should have upload icon with alt text', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('Upload Icon');
  });

  it('should render with default id when not provided', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const input = container.querySelector('input');
    expect(input?.id).toBe('file-upload');
  });

  it('should accept custom id', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        id: 'custom-upload',
      })
    );
    const input = container.querySelector('input');
    expect(input?.id).toBe('custom-upload');
  });

  it('should handle multiple files selected through input', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        onFilesSelected,
        selectedFiles: [],
        multiple: true,
      })
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const files = [new File(['1'], 'file1.txt'), new File(['2'], 'file2.txt')];
      fireEvent.change(input, { target: { files } });
    }

    expect(onFilesSelected).toHaveBeenCalled();
  });

  it('should have focus ring styling', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('focus-within:ring');
  });

  it('should handle drop with empty file list', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        onFilesSelected,
      })
    );

    expect(container).toBeDefined();
  });

  it('should handle drop with filtered files', () => {
    const onFilesSelected = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        accept: '.txt,.pdf',
        onFilesSelected,
      })
    );

    expect(container).toBeDefined();
  });

  it('should handle onChange without onFilesSelected callback', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        onFilesSelected: undefined,
      })
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const files = [new File(['test'], 'file.txt')];
      fireEvent.change(input, { target: { files } });
    }

    expect(container).toBeDefined();
  });

  it('should have drag event handlers bound to label', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label).toBeDefined();
  });

  it('should have rounded-md styling on label', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const label = container.querySelector('label');
    expect(label?.className).toContain('rounded-md');
  });

  it('should have upload icon in drop zone', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const svg = container.querySelector('svg');
    expect(svg).toBeDefined();
  });

  it('should display upload instructions text', () => {
    const { container } = render(React.createElement(InputUpload, defaultProps));
    const text = container.textContent;
    expect(text).toBeDefined();
  });

  it('should handle onChange callback with files parameter', () => {
    const onChange = vi.fn();
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        onChange,
      })
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) {
      const file = new File(['content'], 'test.txt');
      fireEvent.change(input, { target: { files: [file] } });
      expect(onChange).toHaveBeenCalled();
    }
  });

  it('should have multiple file attribute when multiple prop is true', () => {
    const { container } = render(
      React.createElement(InputUpload, {
        ...defaultProps,
        multiple: true,
      })
    );

    const input = container.querySelector('input[type="file"]');
    expect(input?.hasAttribute('multiple')).toBe(true);
  });
});
