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
