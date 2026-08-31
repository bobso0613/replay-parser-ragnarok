import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ENV } from '@/constants';

type PageMetadata = {
  logoText: string;
  title: string;
};

const applicationName = ENV.APPLICATION_NAME || 'Replay Parser Ragnarok';

const pageMetadataByPath: Record<string, PageMetadata> = {
  '/bastion-guide': {
    logoText: 'Bastion Guide',
    title: `Bastion Guide | ${applicationName}`,
  },
  '/replay-parser': {
    logoText: 'Replay Parser',
    title: `Replay Parser | ${applicationName}`,
  },
};

/** Returns the header label and document title appropriate for a route pathname. */
export const getPageMetadata = (pathname: string): PageMetadata => {
  const matchedPath = Object.keys(pageMetadataByPath).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  return pageMetadataByPath[matchedPath ?? '/replay-parser'];
};

/** Synchronizes the document title and exposes the current page's header label. */
export const usePageTitle = (): PageMetadata => {
  const { pathname } = useLocation();
  const pageMetadata = getPageMetadata(pathname);

  useEffect(() => {
    document.title = pageMetadata.title;
  }, [pageMetadata.title]);

  return pageMetadata;
};
