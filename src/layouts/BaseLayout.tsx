import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

export const BaseLayout = () => {
  return (
    <div className=" flex overflow-hidden h-screen ">
      <div className="w-full h-full overflow-hidden">
        <Header routes={[]} />
        <div className="px-8 pt-4 w-full h-full overflow-auto bg-secondary_bg ">
          <div className="bg-gray-950/60 p-5 rounded-lg">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;
