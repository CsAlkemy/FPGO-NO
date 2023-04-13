import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
import ListOverview from "../overviews/reservations/listOverview";

const ReservationCreate = lazy(() => 
  import("../../components/salesManagement/reservations/createReservations")
); 

const ReservationDetails = lazy(() => 
  import("../../components/salesManagement/reservations/details")
);

const ReservationCheckout = lazy(() =>
  import("../../components/salesManagement/reservations/payments/checkout")
);

const PaymentConfirmation = lazy(() => 
  import("../../components/salesManagement/reservations/payments/information")
);

const PaymentStatus = lazy(() => 
  import("../../components/salesManagement/reservations/payments/status")
);

export const ReservationsConfig = {
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
      path: "/create-reservations",
      element: <ReservationCreate />
    }
  ]
};

export const ReservationsConfEx = {
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
      path: "/reservations",
      element: <ListOverview />
    },
    {
      path: "/reservations-details/:uuid",
      element: <ReservationDetails />
    }
  ]
};

export const ReservationCart = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
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
  auth: authRoles.allUserInclucingUnAuthenticatedUser,
  routes: [
    {
      path: "/reservations/:uuid/checkout",
      element: <ReservationCheckout />
    }, 
    {
      path: "/reservations/:uuid/payment",
      element: <PaymentConfirmation />
    },
    {
      path: "/reservations/:uuid/confirmation",
      element: <PaymentStatus />
    }
  ]
};