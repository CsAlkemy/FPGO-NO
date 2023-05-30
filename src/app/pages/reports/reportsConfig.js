import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
import OrdersListOverview from "../overviews/orders/OrdersListOverview";
import OrderDetails from "../../components/salesManagement/order/orderDetails";
import PayoutReportsListOverview from "../overviews/reports/PayoutReportsListOverview";
import Payouts from "../../components/reports/payouts";
import PayoutReports from "../../components/reports/payouts/payoutReports";
import VatReports from "../../components/reports/vats";

export const ReportsConfig = {
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
      path: "/reports/payouts-list",
      element: <PayoutReportsListOverview />,
    },
  ],
};

export const ReportsConfigRBAC = {
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
      path: "/reports/payouts/:uuid",
      element: <Payouts />,
    },
    {
      path: "/reports/vats",
      element: <VatReports />,
    },
  ],
};