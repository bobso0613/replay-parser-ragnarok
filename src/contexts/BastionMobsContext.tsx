import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { BastionWave } from '@/types';

type BastionMobsContextValue = {
  waves: BastionWave[];
  isLoading: boolean;
  hasError: boolean;
  reload: () => void;
};

type BastionMobsProviderProps = {
  children: ReactNode;
};

const BastionMobsContext = createContext<BastionMobsContextValue | null>(null);

/**
 * Provides the Bastion waves data and its loading/error state to descendants.
 *
 * Handles two workflows:
 *
 * 1. **Initial fetch** — `bastion_mobs.json` is requested on mount via an
 *    `AbortController`-backed `fetch`, populating `waves` on success or
 *    `hasError` on failure.
 *
 * 2. **Reload** — consumers can call `reload` (e.g. from an `ErrorDetails`
 *    retry button) to re-run the fetch after a failure.
 *
 * @param props - {@link BastionMobsProviderProps}
 */
export const BastionMobsProvider = ({ children }: BastionMobsProviderProps) => {
  const [waves, setWaves] = useState<BastionWave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setHasError(false);

    fetch('/bastion_mobs.json', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json() as Promise<BastionWave[]>;
      })
      .then((data) => {
        setWaves(data);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        setHasError(true);
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [reloadToken]);

  return (
    <BastionMobsContext.Provider value={{ waves, isLoading, hasError, reload }}>
      {children}
    </BastionMobsContext.Provider>
  );
};

/**
 * Accesses the shared Bastion waves data and its loading/error state.
 *
 * @returns Waves data, loading/error flags, and a `reload` function.
 * @throws {Error} When used outside a {@link BastionMobsProvider}.
 */
export const useBastionMobs = () => {
  const context = useContext(BastionMobsContext);

  if (context === null) {
    throw new Error('useBastionMobs must be used within a BastionMobsProvider.');
  }

  return context;
};
