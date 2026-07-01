import type { RouteObject } from 'react-router-dom';
import type { IReplayData } from './replay-api';
import type { ISkill } from './skill-db';
import type { IMob } from './mob-db';

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
};

export type TableProps = {
  headers?: string[] | Array<React.ReactNode>;
  rowClassNames?: string[];
  rows: Array<Array<React.ReactNode>>;
  className?: string;
};
