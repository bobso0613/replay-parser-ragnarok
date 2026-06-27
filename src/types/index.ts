import type { RouteObject } from 'react-router-dom';

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
  onChange?: (value: string) => void;
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
};

export type PageLoadingProps = {
  message?: string;
};
