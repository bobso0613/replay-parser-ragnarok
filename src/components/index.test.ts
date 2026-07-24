import { describe, it, expect } from 'vitest';
import * as components from './index';

describe('src/components/index', () => {
  it('should export components correctly', () => {
    expect(components).toBeDefined();
  });

  it('should have exported components', () => {
    const exported = Object.keys(components);
    expect(exported.length).toBeGreaterThan(0);
  });

  it('should export DropdownSelect', () => {
    expect(components.DropdownSelect).toBeDefined();
    expect(typeof components.DropdownSelect).toBe('object');
  });

  it('should export SkeletonLoader', () => {
    expect(components.SkeletonLoader).toBeDefined();
  });

  it('should export PageLoading', () => {
    expect(components.PageLoading).toBeDefined();
  });

  it('should export Header', () => {
    expect(components.Header).toBeDefined();
  });

  it('should export InputUpload', () => {
    expect(components.InputUpload).toBeDefined();
  });

  it('should export Table', () => {
    expect(components.Table).toBeDefined();
  });

  it('should export PlaceholderDetails', () => {
    expect(components.PlaceholderDetails).toBeDefined();
  });

  it('should export Spinner', () => {
    expect(components.Spinner).toBeDefined();
  });

  it('should export SectionLoading', () => {
    expect(components.SectionLoading).toBeDefined();
  });

  it('should export ReplayBreakdown', () => {
    expect(components.ReplayBreakdown).toBeDefined();
  });

  it('should export HorizontalTabs', () => {
    expect(components.HorizontalTabs).toBeDefined();
  });

  it('should export TextImage', () => {
    expect(components.TextImage).toBeDefined();
  });

  it('should export Tooltip', () => {
    expect(components.Tooltip).toBeDefined();
  });

  it('should export ErrorDetails', () => {
    expect(components.ErrorDetails).toBeDefined();
  });

  it('should export StickyButton', () => {
    expect(components.StickyButton).toBeDefined();
  });

  it('should export Footer', () => {
    expect(components.Footer).toBeDefined();
  });

  it('should have at least 16 exports', () => {
    const exported = Object.keys(components);
    expect(exported.length).toBeGreaterThanOrEqual(16);
  });

  it('should all exports be defined', () => {
    const exported = Object.keys(components);
    exported.forEach((name) => {
      expect(components[name as keyof typeof components]).toBeDefined();
    });
  });
});
