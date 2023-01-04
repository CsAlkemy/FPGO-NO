import { lazy } from 'react';
import authRoles from '../../data-access/utils/AuthRoles';

const CreditCheck = lazy(() => import('../../components/creditCheck/creditCheckHeader'));
const CreditCheckCorporateClient = lazy(() => import('../../components/creditCheck/corporateCreditCheck/CreditCheckCorporateClient'));
const CreditCheckPrivateClient = lazy(() => import('../../components/creditCheck/privateCreditCheck/CreditCheckPrivateClient'));

const CreditCheckConfig = {
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
      path: '/credit-check',
      element: <CreditCheck />,
    },
    {
      path: '/credit-check/corporate-client',
      element: <CreditCheckCorporateClient />,
    },
    {
      path: '/credit-check/private-client',
      element: <CreditCheckPrivateClient />,
    },
  ],
};

export default CreditCheckConfig;
