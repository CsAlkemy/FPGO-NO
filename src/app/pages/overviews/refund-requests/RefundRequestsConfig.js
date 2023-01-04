import { lazy } from 'react';
import authRoles from '../../../data-access/utils/AuthRoles';
import RefundRequestsOverview from './RefundRequestsOverview';

const RefundRequestsConfig = {
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
      path: '/refund-requests',
      element: <RefundRequestsOverview />,
    }
  ],
};

export default RefundRequestsConfig;
