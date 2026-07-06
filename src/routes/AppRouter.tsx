import PageLoading from '@/components/PageLoading';
import { BaseLayout } from '@/layouts';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Swap static imports for dynamic lazy imports
const Home = lazy(() => import('@/pages/Home'));

const AppRouter = () => {
  return (
    <Router>
      {/* 2. Wrap your routes in Suspense to show a fallback UI while downloading */}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Navigate to="/replay-parser" replace />} />
            <Route path="replay-parser" element={<Home />} />
            <Route path="replay-parser/:outputId" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppRouter;
