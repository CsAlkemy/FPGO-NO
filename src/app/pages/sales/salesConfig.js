import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
import OrdersListOverview from "../overviews/orders/OrdersListOverview";
import OrderDetails from "../../components/salesManagement/order/orderDetails";

const CreateOrder = lazy(() =>
  import("../../components/salesManagement/order/createOrder")
);
const OrderModals = lazy(() =>
  import("../../components/salesManagement/order/popupModal")
);
const QuickOrder = lazy(() =>
  import("../../components/salesManagement/quickOrder")
);

export const SalesConfig = {
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
      path: "/create-order",
      element: <CreateOrder />,
    },
    {
      path: "/quick-order",
      element: <QuickOrder />,
    },
  ],
};

export const SalesConfigRBAC = {
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
    `${authRoles.fpAdmin}`,
    `${authRoles.businessAdmin}`,
    `${authRoles.user}`,
  ],
  routes: [
    {
      path: "/create-order/modal",
      element: <OrderModals />,
    },
    {
      path: "/create-order/details/:uuid",
      element: <OrderDetails />,
    },
    {
      path: "/sales/orders-list",
      element: <OrdersListOverview />,
    },
  ],
};
