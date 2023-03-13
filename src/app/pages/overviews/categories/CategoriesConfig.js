import { lazy } from "react";
import authRoles from "../../../data-access/utils/AuthRoles";
import CategoriesListOverview from "./CategoriesListOverview";
const CreateCategory = lazy(() =>
  import("../../../components/products/productCategory/createCategory")
);
import CategoryDetails from '../../../components/products/productCategory/categoryDetails'

export const CategoriesConfig = {
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
    `${authRoles.user}`
  ],
  routes: [
    {
      path: "/categories/create-category",
      element: <CreateCategory />,
    },
  ],
};

export const CategoriesConfigRBAC = {
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
      path: "/categories/categories-list",
      element: <CategoriesListOverview />,
    },
    {
      path: "/category/details/:id",
      element: <CategoryDetails />,
    },
  ],
};
