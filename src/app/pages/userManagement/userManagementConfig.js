import { lazy } from 'react';
import authRoles from '../../data-access/utils/AuthRoles';
import CreateUsers from '../../components/userManagement/createUsers';

const UserProfile = lazy(() => import('../../components/userManagement/userProfile/index'));


const UserManagementConfig = {
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
  auth: [`${authRoles.fpAdmin}`, `${authRoles.businessAdmin}`, `${authRoles.user}`],
  routes: [
    {
      path: '/user-management/create-user',
      element: <CreateUsers />,
    },
    {
      path: 'user-management/user-profile',
      element: <UserProfile />,
    },
    {
      path: '/my-profile',
      element: <UserProfile />,
    }
  ],
};

export default UserManagementConfig;