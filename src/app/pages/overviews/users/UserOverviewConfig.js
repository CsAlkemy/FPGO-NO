import authRoles from '../../../data-access/utils/AuthRoles';
import UserOverview from './UserOverview';
import FpAdminUsersOverview from './fp-admin/FpAdminUsersOverview';
import BusinessAdminUsersOverview from './fp-admin/BusinessAdminUsersOverview';
import OrganizationWiseUserList from './fp-admin/OrganizationWiseUserList';

const UserOverviewConfig = {
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
  auth: [`${authRoles.fpAdmin}`, `${authRoles.businessAdmin}`],
  routes: [
    {
      path: 'user-overview',
      element: <UserOverview />,
    },
    {
      path: '/users/fp-admin-list',
      element: <FpAdminUsersOverview />,
    },
    {
      path: '/users/business-admin-list',
      element: <BusinessAdminUsersOverview />,
    },
    {
      path: '/users/organization-wise-user-list/:uuid',
      element: <OrganizationWiseUserList />,
    },
  ],
};

export default UserOverviewConfig;
