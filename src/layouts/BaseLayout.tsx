import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

export const BaseLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden">
        <Header routes={[]} />
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
