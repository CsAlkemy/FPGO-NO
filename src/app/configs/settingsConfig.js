import themesConfig from 'app/configs/themesConfig';
import i18n from '../../i18n';
import AuthRoles from '../data-access/utils/AuthRoles';

const settingsConfig = {
  layout: {
    style: 'layout1',
    config: {
      mode: 'fullwidth',
      containerWidth: 1570,
      navbar: {
        display: true,
        style: 'style-2',
        folded: false,
        position: 'left',
      },
      toolbar: {
        display: true,
        style: 'fixed',
      },
      footer: {
        display: true,
        style: 'fixed',
      },
      leftSidePanel: {
        display: true,
      },
      rightSidePanel: {
        display: false,
      },
    },
  },
  // layout: {
  //   style: 'layout1', // layout1 layout2 layout3
  //   config: {}, // checkout default layout configs at app/theme-layouts for example  app/theme-layouts/layout1/Layout1Config.js
  // },
  customScrollbars: true,
  direction: i18n.dir(i18n.options.lng) || 'ltr', // rtl, ltr
  theme: {
    main: themesConfig.customFpAdmin_main,
    navbar: themesConfig.customFpAdmin_navbar,
    toolbar: themesConfig.customFpAdmin_toolbar,
    footer: themesConfig.customFpAdmin_footer,
  },
  /*
   To make whole app auth protected by default set defaultAuth:['admin','staff','user']
   To make whole app accessible without authorization by default set defaultAuth: null
   *** The individual route configs which has auth option won't be overridden.
   */
  defaultAuth: AuthRoles.allUser,
  /*
    Default redirect url for the logged-in user,
   */
  // loginRedirectUrl: '/dashboard', // FRON536- change redirect URL
  loginRedirectUrl: '/sales/orders-list',
};

export default settingsConfig;
