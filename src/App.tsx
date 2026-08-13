import AppRouter from '@/routes/AppRouter';

/**
 * Application root component.
 *
 * A thin wrapper that mounts {@link AppRouter} so that the router is the
 * single child of the React tree. Having this indirection makes it easy to
 * swap the router implementation (e.g. for tests) without touching `main.tsx`.
 */
const App = () => {
  return <AppRouter />;
};

export default App;
