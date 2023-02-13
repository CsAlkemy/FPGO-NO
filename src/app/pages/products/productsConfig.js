import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";

import ProductOverview from '../overviews/products/ProductOverview'
const CreateProduct = lazy(() =>
  import("../../components/products/createProduct/createProduct")
);
import ProductDetails from '../../components/products/createProduct/productDetails'


export const ProductsConfig = {
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
  auth: [`${authRoles.businessAdmin}`, `${authRoles.user}`],
  routes: [
    {
      path: "/products/create",
      element: <CreateProduct />,
    },
  ],
};

export const ProductsConfigRBAC = {
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
  auth: [
    `${authRoles.businessAdmin}`,
    `${authRoles.user}`,
    `${authRoles.fpAdmin}`,
  ],
  routes: [
    {
      path: "/products/products-list",
      element: <ProductOverview />,
    },
    {
      path: "/products/details/:id",
      element: <ProductDetails />,
    },
  ],
};
