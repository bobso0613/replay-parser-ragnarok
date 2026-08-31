import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Outlet } from 'react-router-dom';

/** Shell layout wrapping the header, main content outlet, and footer. */
/**
 * Full-height application shell layout.
 *
 * Renders the sticky {@link Header} at the top, a scrollable main content
 * area in the middle (via React Router's `<Outlet>`), and a {@link Footer}
 * at the bottom. The outer container is `h-screen overflow-hidden` so the
 * page itself never scrolls; overflow scrolling is handled by the inner
 * content `<div>`.
 */
export const BaseLayout = () => {
  const { logoText } = usePageTitle();

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Header logoText={logoText} routes={[]} />
        <div className="h-full w-full flex-1 overflow-auto bg-secondary_bg px-8 pt-4">
          <div className="overflow-hidden rounded-lg ">
            <div className="p-5 bg-gray-950/60">
              <Outlet />
            </div>
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
