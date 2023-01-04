import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
const CorporateCustomer = lazy(() =>
  import("../../components/customers/corporateCustomer/createCorporateCustomer")
);
const PrivateCustomer = lazy(() =>
  import("../../components/customers/privateCustomer/createPrivateCustomer")
);
const DetailCorporateCustomer = lazy(() =>
  import("../../components/customers/corporateCustomer/detailCorporateCustomer")
);
const DetailPrivateCustomer = lazy(() =>
  import("../../components/customers/privateCustomer/detailPrivateCustomer")
);
import CustomersListOverview from "../overviews/customers/CustomersListOverview";

export const CustomersConfig = {
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
      path: "/customers/corporate",
      element: <CorporateCustomer />,
    },
    {
      path: "/customers/private",
      element: <PrivateCustomer />,
    },
  ],
};

export const CustomersConfigRBAC = {
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
      path: "/customers/customers-list",
      element: <CustomersListOverview />,
    },
    {
      path: "/customers/corporate/details/:id",
      element: <DetailCorporateCustomer />,
    },
    {
      path: "/customers/private/details/:id",
      element: <DetailPrivateCustomer />,
    },
  ],
};
