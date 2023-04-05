import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
import ListOverview from "../overviews/reservations/listOverview";

const ReservationCreate = lazy(() => 
  import("../../components/salesManagement/reservations/createReservations")
); 

const ReservationDetails = lazy(() => 
  import("../../components/salesManagement/reservations/details")
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
            path: "/reservations/create",
            element: <ReservationCreate />
        }
    ]
}

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
          path: "/reservations/details/:uuid",
          element: <ReservationDetails />
        }
    ]
};