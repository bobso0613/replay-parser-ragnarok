import PageLoading from '@/components/PageLoading';
import { BaseLayout } from '@/layouts';
import { lazy, Suspense, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

// 1. Swap static imports for dynamic lazy imports
const Home = lazy(() => import('@/pages/Home'));

/**
 * Reads the `?redirect=` search param set by the GitHub Pages 404.html fallback
 * and navigates to the original path on mount.
 *
 * This implements the SPA redirect pattern for static hosting:
 * the 404 page encodes the real URL as a query param, and this component
 * decodes it so the browser lands on the correct client-side route.
 */
const RedirectFromFallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const redirectPath = searchParams.get('redirect');

    if (redirectPath) {
      navigate(redirectPath, { replace: true });
    }
  }, [navigate, searchParams]);

  return null;
};

/**
 * Root router that wraps the application in a `BrowserRouter` and declares
 * all client-side routes.
 *
 * Route structure:
 * - `/` → redirects to `/replay-parser`.
 * - `/replay-parser` → `Home` (file upload view).
 * - `/replay-parser/:outputId` → `Home` (shared-link view, loads by ID).
 *
 * All routes are wrapped in a `<Suspense>` boundary that shows
 * {@link PageLoading} while the lazy `Home` chunk is downloading.
 * The `RedirectFromFallback` helper handles the GitHub Pages SPA 404 redirect.
 */
const AppRouter = () => {
  return (
    <Router basename={import.meta.env.BASE_URL}>
      {/* 2. Wrap your routes in Suspense to show a fallback UI while downloading */}
      <Suspense fallback={<PageLoading />}>
        <RedirectFromFallback />
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Navigate to="replay-parser" replace />} />
            <Route path="replay-parser" element={<Home />} />
            <Route path="replay-parser/:outputId" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
