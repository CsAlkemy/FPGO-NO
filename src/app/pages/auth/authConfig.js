import { lazy } from "react";
import authRoles from "../../data-access/utils/AuthRoles";
const LoginPage = lazy(() => import('../../components/Auth/login/LoginPage'));
const ForgotPassword = lazy(() => import('../../components/Auth/forgotPassword/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../../components/Auth/resetPassword/ResetPasswordPage'));


const AuthConfig = {
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
      path: "login",
      element: <LoginPage />,
    },
    {
        path: 'forgot-password',
        element: <ForgotPassword />,
    },
    {
        path: '/reset-password/:token',
        element: <ResetPasswordPage />,
    },
  ],
};

export default AuthConfig;
