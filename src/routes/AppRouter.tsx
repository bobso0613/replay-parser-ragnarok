import PageLoading from '@/components/PageLoading';
import { BaseLayout } from '@/layouts';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// 1. Swap static imports for dynamic lazy imports
const Home = lazy(() => import('@/pages/Home'));

function AppRouter() {
  return (
    <Router>
      {/* 2. Wrap your routes in Suspense to show a fallback UI while downloading */}
      <Suspense fallback={<PageLoading />}>
        <Routes>
          <Route path="/" element={<BaseLayout />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRouter;
