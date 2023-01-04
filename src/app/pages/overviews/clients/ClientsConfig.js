import authRoles from '../../../data-access/utils/AuthRoles';
import ApprovalListOverview from './approval-list/ApprovalListOverview';
import ClientListOverview from './approved-list/ClientListOverview';

const ClientsConfig = {
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
  // auth: [`${authRoles.fpAdmin}`, `${authRoles.brandManager}`],
  auth: authRoles.fpAdmin,
  routes: [
    {
      path: '/clients/clients-list',
      element: <ClientListOverview />,
    },
    {
      path: '/clients/approval-list',
      element: <ApprovalListOverview />,
    },
  ],
};

export default ClientsConfig;
