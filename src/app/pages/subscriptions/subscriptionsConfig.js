import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
import SubscriptionDetails from "../../components/subscription/subscriptionDetails";
import SubscriptionsListOverview from "../overviews/subscriptions/SubscriptionsListOverview";
import FailedPaymentsListOverview from "../overviews/subscriptions/FailedPaymentsListOverview";

const CreateSubscription = lazy(() =>
  import("../../components/subscription/index")
);
const OrderModals = lazy(() =>
  import("../../components/salesManagement/order/popupModal")
);

export const SubscriptionsConfig = {
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
      path: "/subscription/create",
      element: <CreateSubscription />,
    },
  ],
};

export const SubscriptionsConfigRBAC = {
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
      path: "/subscription/modal",
      element: <OrderModals />,
    },
    {
      path: "/subscription/details/:uuid",
      element: <SubscriptionDetails />,
    },
    {
      path: "/subscriptions/list",
      element: <SubscriptionsListOverview />,
    },
    {
      path: "/subscriptions/failed-payments-list",
      element: <FailedPaymentsListOverview />,
    },
  ],
};
