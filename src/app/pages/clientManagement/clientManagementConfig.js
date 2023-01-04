import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
import ClientDetails from "../../components/clientManagement/client-details/ClientDetails";
// import CreateClient from '../../components/clientManagement/create-client/CreateClient';

const OnbordingHome = lazy(() =>
  import("../../components/clientManagement/onboarding/index")
); //TODO will remove when the table is ready.
const Onbording = lazy(() =>
  import("../../components/clientManagement/onboarding/Onboarding")
);
const CreateClient = lazy(() =>
  import("../../components/clientManagement/create-client/CreateClient")
);

const ClientManagementConfig = {
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
      path: "/client-management",
      element: <OnbordingHome />,
    },
    {
      path: "/client-management/onbroading/:uuid",
      element: <Onbording />,
    },
    {
      path: "/client-management/details/:uuid",
      element: <ClientDetails />,
    },
    {
      path: "/client-management/create-client",
      element: <CreateClient />,
    },
  ],
};

export default ClientManagementConfig;
