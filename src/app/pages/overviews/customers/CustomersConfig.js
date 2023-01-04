import authRoles from '../../../data-access/utils/AuthRoles';
import CustomersListOverview from './CustomersListOverview';

const CustomersConfig = {
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
  auth: [`${authRoles.businessAdmin}`, `${authRoles.user}`],
  routes: [
    {
      path: '/customers/customers-list',
      element: <CustomersListOverview />,
    }
  ],
};

export default CustomersConfig;
