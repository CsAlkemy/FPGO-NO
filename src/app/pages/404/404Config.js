import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import authRoles from '../../data-access/utils/AuthRoles';

const Error404 = lazy(() => import('../../main/404/Error404Page'));

const Error404Config = {
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
  auth: authRoles.unAuthenticatedUser,
  routes: [
    {
      path: '404',
      element: <Error404 />,
    },
    {
      path: '*',
      element: <Navigate to="404" />,
    },
  ],
};

export default Error404Config;
