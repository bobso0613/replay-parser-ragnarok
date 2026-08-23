import type { RouteObject } from 'react-router-dom';
import type { IReplayData } from './replay-api';
import type { ISkill } from './skill-db';
import type { IMob } from './mob-db';
import type { IItem } from './item-db';
import type { ReactNode } from 'react';

export * from './replay-api';
export * from './skill-db';
export * from './mob-db';
export * from './item-db';
export * from './parsed-replay';
/** Maps a numeric job ID to its display name. */
export interface JobListType {
  [jobId: number]: string;
}

/**
 * A single option entry for the DropdownSelect component.
 *
 * @property id - Unique numeric key used as the React list key.
 * @property value - The string value submitted when this option is selected.
 * @property label - Human-readable display text shown in the dropdown.
 */
export type DropdownOption = {
  id: number;
  value: string;
  label: string;
};

/**
 * Props for the {@link DropdownSelect} component.
 *
 * @property id - HTML `id` attribute for the `<select>` element.
 * @property select - The currently selected value (controlled).
 * @property options - Array of options to render.
 * @property placeholder - Disabled placeholder shown when no value is selected.
 * @property onChange - Native change handler forwarded from the `<select>` element.
 */
export type DropdownSelectProps = {
  id?: string;
  key?: string;
  select: string;
  options: DropdownOption[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

/**
 * Props for the {@link SkeletonLoader} component.
 *
 * @property rows - Number of placeholder body rows to render (default: 5).
 * @property columns - Number of placeholder columns per row (default: 4).
 */
export type SkeletonLoaderProps = {
  rows?: number;
  columns?: number;
};

/**
 * Props for the {@link Header} component.
 *
 * @property logoText - Text displayed as the application logo/brand name.
 *   Falls back to `ENV.APPLICATION_NAME` when omitted.
 * @property routes - React Router route objects used to build the navigation links.
 *   Routes with `path === '*'` are excluded.
 */
export interface HeaderProps {
  logoText?: string;
  routes: RouteObject[];
}

/**
 * Props for the {@link InputUpload} component.
 *
 * @property id - HTML `id` for the hidden `<input type="file">` element.
 * @property accept - Comma-separated list of accepted file extensions (e.g. `.grf,.grfkey`).
 * @property multiple - Whether multiple files can be selected at once.
 * @property onChange - Native input change handler, called after file selection via dialog.
 * @property onFilesSelected - Callback with the resolved `File[]` array; also fires on drag-and-drop.
 * @property label - Accessible label text shown on the upload button.
 * @property selectedFiles - Currently selected files; used to render the preview text.
 */
export type InputUploadProps = {
  id?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  selectedFiles: File[];
};

/**
 * Props for the {@link PageLoading} component.
 *
 * @property message - Text shown below the spinner (default: `'Loading...'`).
 */
export type PageLoadingProps = {
  message?: string;
};

/**
 * Props for the {@link SectionLoading} component.
 *
 * @property size - Spinner diameter in pixels (default: 40).
 * @property className - Additional CSS class names applied to the wrapper.
 * @property label - Accessible label text shown next to the spinner (default: `'Loading...'`).
 */
export type SectionLoadingProps = {
  size?: number;
  className?: string;
  label?: string;
};

/**
 * Props for the {@link ReplayBreakdown} component.
 *
 * @property apiResponse - Raw replay data as returned by the parser API.
 * @property skillDb - Parsed skill database used to resolve skill names; `null` while loading.
 * @property mobDb - Parsed mob database used to resolve monster names and MVP flags; `null` while loading.
 * @property fileName - Original replay filename shown in the UI header.
 * @property outputId - Server-side output ID used to generate the shareable link.
 */
export type ReplayBreakdownProps = {
  apiResponse: IReplayData;
  skillDb: ISkill[] | null;
  mobDb: IMob[] | null;
  itemDb?: IItem[] | null;
  fileName?: string;
  outputId?: string;
};

/**
 * Props for the {@link Table} component.
 *
 * @property headers - Column header cells; accepts strings or React nodes.
 * @property rowClassNames - Per-column CSS class names applied to every `<td>` in that column.
 * @property rows - Two-dimensional array of React node cells; one sub-array per row.
 * @property columnWidths - Explicit column widths as pixel numbers or CSS strings.
 * @property sortValues - Pre-computed sort values parallel to `rows`; used when the cell content is not directly comparable.
 * @property sortableColumns - Zero-based indices of columns that should render a sort control.
 * @property sortExtractors - Per-column extractors: a function or a CSS class name whose text content to extract.
 * @property onSort - Callback invoked after a column header click with the new sort state.
 * @property enableVirtualization - Activates react-window virtualisation for large row counts.
 * @property virtualRowHeight - Estimated row height in pixels used for virtual list calculations.
 * @property virtualTableHeight - Maximum height in pixels of the virtual scroll container.
 * @property virtualOverscan - Number of rows rendered outside the visible window for smoother scrolling.
 * @property virtualColumnWeights - Relative weight ratios used to distribute column widths in virtualised mode.
 */
export type TableProps = {
  headers?: string[] | Array<React.ReactNode>;
  rowClassNames?: string[];
  rows: Array<Array<React.ReactNode>>;
  columnWidths?: Array<number | string>;
  sortValues?: Array<Array<string | number | null>>;
  className?: string;
  sortableColumns?: number[];
  sortExtractors?: Record<number, ((cell: React.ReactNode) => string | number) | string>;
  onSort?: (columnIndex: number, direction: 'asc' | 'desc') => void;
  enableVirtualization?: boolean;
  virtualRowHeight?: number;
  virtualTableHeight?: number;
  virtualOverscan?: number;
  virtualColumnWeights?: number[];
};

/**
 * A single tab definition for the {@link HorizontalTabs} component.
 *
 * @property id - Unique string identifier used to track the active tab.
 * @property label - Content rendered inside the tab button (string or JSX).
 * @property content - Panel content rendered when this tab is active.
 */
export interface TabItem {
  id: string;
  label: string | ReactNode;
  content: ReactNode;
}

/**
 * Props for the {@link HorizontalTabs} component.
 *
 * @property tabs - Ordered list of tab definitions.
 * @property defaultTabId - ID of the tab that should be active on first render.
 *   Defaults to the first tab when omitted.
 * @property extraContent - Optional JSX rendered to the right of the tab buttons.
 * @property className - Additional CSS class names applied to the outer wrapper.
 */
export interface HorizontalTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  extraContent?: ReactNode;
  className?: string;
}

/**
 * Props for the {@link TextImage} component.
 *
 * @property textBefore - Optional node rendered to the left of the icon.
 * @property variant - Image variant; one of `TEXT_IMAGE_VARIANTS` (`'skill'` or `'job'`). Defaults to `'skill'`.
 * @property keyId - Numeric or string ID used to build the image URL (skill ID or job ID).
 * @property keyInfo - Short label text rendered next to the icon and used as the `<img>` alt text.
 * @property title - Tooltip title; falls back to `keyInfo` when omitted.
 */
export interface TextImageProps {
  textBefore?: ReactNode;
  variant?: string;
  keyId: number | string;
  keyInfo: string;
  title?: string;
}

/**
 * Props for the {@link Tooltip} component.
 *
 * @property content - Content rendered inside the tooltip bubble.
 * @property children - The trigger element that shows the tooltip on hover.
 * @property className - Additional CSS class names applied to the trigger wrapper.
 * @property placement - Preferred position relative to the trigger; one of `TOOLTIP_POSITION` values.
 *   Defaults to `'top'`.
 */
export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  placement?: string;
};
