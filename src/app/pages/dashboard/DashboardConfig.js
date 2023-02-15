// import { Dashboard } from '@mui/icons-material';
import { lazy } from 'react';
import authRoles from '../../data-access/utils/AuthRoles';
import Dashboard from '../../components/Dashboard/Dashboard';

const DashboardConfig = {
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
  auth: [`${authRoles.businessAdmin}`, `${authRoles.fpAdmin}`],
  routes: [
    {
      path: '/dashboard',
      element: <Dashboard />,
    },
  ],
};

export default DashboardConfig;
