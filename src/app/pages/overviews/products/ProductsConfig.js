import { lazy } from 'react';
import authRoles from '../../../data-access/utils/AuthRoles';
import ProductOverview from './ProductOverview';
const CreateProduct = lazy(() => import('../../../components/products/createProduct/createProduct'));

const ProductsConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.fpAdmin,
  routes: [
    {
      path: '/products/products-list',
      element: <ProductOverview />,
    },
    {
      path: '/products/create',
      element: <CreateProduct />,
    }
  ],
};

export default ProductsConfig;
