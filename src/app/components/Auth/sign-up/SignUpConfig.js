// import SignUpPage from './SignUpPage';
import ClassicSignUpPage from './ClassicSignUpPage';
import authRoles from '../../../data-access/utils/AuthRoles';
import RegistrationConfirmation from './RegistrationConfirmation';

const SignUpConfig = {
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
      path: 'sign-up',
      element: <ClassicSignUpPage />,
    },
    {
      path: 'under-review',
      element: <RegistrationConfirmation />,
    },
    // {
    //   path: 'email-validated',
    //   element: <UnderReview />,
    // },
  ],
};

export default SignUpConfig;
