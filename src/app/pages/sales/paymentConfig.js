import { lazy } from 'react';
import authRoles from '../../data-access/utils/AuthRoles';
const CustomerInfo = lazy(() => import('../../components/salesManagement/payment/paymentInformation'));
const PaymentDetails = lazy(() => import('../../components/salesManagement/payment/orderDetails'));
const PaymentStatus = lazy(() => import('../../components/salesManagement/payment/paymentStatus'));
const OrderReceipt = lazy(() => import('../../components/salesManagement/order/orderReceipt'));

const PaymentConfig = {
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
  // auth: [`${authRoles.fpAdmin}`, `${authRoles.user}`, `${authRoles.businessAdmin}`, `${authRoles.unAuthenticatedUser}`],
  // auth: authRoles.unAuthenticatedUser,
  auth: authRoles.allUserInclucingUnAuthenticatedUser,
  routes: [
    {
      // path: '/payment/order-details',
      path: '/order/details/:uuid',
      element: <PaymentDetails />,
    },
    {
        // path: '/payment/checkout',
        path: '/order/details/:uuid/checkout',
        element: <CustomerInfo />,
    },
    {
        // path: 'payment/checkout/status',
        path: '/order/details/:uuid/confirmation',
        element: <PaymentStatus />,
    },
    {
      path: '/order/receipt/:uuid',
      element: <OrderReceipt />,
    },
  ],
};

export default PaymentConfig;

