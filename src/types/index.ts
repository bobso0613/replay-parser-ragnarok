import type { RouteObject } from 'react-router-dom';
import type { IReplayData } from './replay-api';
import type { ISkill } from './skill-db';
import type { IMob } from './mob-db';
import type { ReactNode } from 'react';

export * from './replay-api';
export * from './skill-db';
export * from './mob-db';
export * from './parsed-replay';
export interface JobListType {
  [jobId: number]: string;
}

export type DropdownOption = {
  id: number;
  value: string;
  label: string;
};

export type DropdownSelectProps = {
  id?: string;
  key?: string;
  select: string;
  options: DropdownOption[];
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

export type SkeletonLoaderProps = {
  rows?: number;
  columns?: number;
};

export interface HeaderProps {
  logoText?: string;
  routes: RouteObject[];
}

export type InputUploadProps = {
  id?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilesSelected?: (files: File[]) => void;
  label?: string;
  selectedFiles: File[];
};

export type PageLoadingProps = {
  message?: string;
};

export type SectionLoadingProps = {
  size?: number;
  className?: string;
  label?: string;
};

export type ReplayBreakdownProps = {
  apiResponse: IReplayData;
  skillDb: ISkill[] | null;
  mobDb: IMob[] | null;
  fileName?: string;
  outputId?: string;
};

export type TableProps = {
  headers?: string[] | Array<React.ReactNode>;
  rowClassNames?: string[];
  rows: Array<Array<React.ReactNode>>;
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

export interface TabItem {
  id: string;
  label: string | ReactNode;
  content: ReactNode;
}

export interface HorizontalTabsProps {
  tabs: TabItem[];
  defaultTabId?: string;
  extraContent?: ReactNode;
  className?: string;
}

export interface TextImageProps {
  textBefore?: ReactNode;
  variant?: string;
  keyId: number | string;
  keyInfo: string;
  title?: string;
}

export type TooltipProps = {
  content: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  placement?: string;
};
