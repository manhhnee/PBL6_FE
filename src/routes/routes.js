import config from '~/config';

// Layouts
import { HeaderOnly, Admin } from '~/layouts';

// Pages
import Home from '~/pages/Home';
import Login from '~/pages/Login';
import DetailItem from '~/pages/DetailItem';
import AllProduct from '~/pages/AllProduct';
import Information from '~/pages/Information';
import History from '~/pages/History';
import Cart from '~/pages/Cart';

//ADMIN
import AdminPending from '~/pages/Admin/AdminPending';
import AdminDelivering from '~/pages/Admin/AdminDelivering';
import AdminWaiting from '~/pages/Admin/AdminWaiting';
import AdminSuccess from '~/pages/Admin/AdminSuccess';

// Public routes
const publicRoutes = [
  { path: config.routes.login, component: Login, layout: null },
  { path: config.routes.home, component: Home },
  { path: config.routes.detailItem, component: DetailItem },
  { path: config.routes.allProducts, component: AllProduct },
  { path: config.routes.information, component: Information, layout: HeaderOnly },
  { path: config.routes.history, component: History, layout: HeaderOnly },
  { path: config.routes.cart, component: Cart, layout: HeaderOnly },
];

const adminRoutes = [
  { path: config.routes.adminPending, component: AdminPending, layout: Admin },
  { path: config.routes.adminWaiting, component: AdminWaiting, layout: Admin },
  { path: config.routes.adminDelivering, component: AdminDelivering, layout: Admin },
  { path: config.routes.adminSuccess, component: AdminSuccess, layout: Admin },
];

export { publicRoutes, adminRoutes };
