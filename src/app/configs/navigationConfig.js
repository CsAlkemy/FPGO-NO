import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from "./translations-i18n/en";
import tr from './navigation-i18n/tr';
import no from "./translations-i18n/no";
import MultiLanguageService from '../data-access/services/multiLanguageService/MultiLanguageService';

MultiLanguageService.translations()
  .then((response)=>{
    i18next.addResourceBundle('en', 'navigation', response.data.en.navigation);
    i18next.addResourceBundle('no', 'navigation', response.data.no.navigation);
    i18next.addResourceBundle('en', 'label', response.data.en.label);
    i18next.addResourceBundle('no', 'label', response.data.no.label);
  })

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'DASHBOARD',
    type: 'item',
    icon: 'material-outline:widgets',
    url: 'dashboard',
  },
  {
    id: 'orders',
    title: 'Orders',
    translate: 'Orders',
    type: 'item',
    icon: 'material-outline:receipt_long',
    url: '/sales/orders-list',
  },
  {
    id: 'clients',
    title: 'Clients',
    // translate: 'Dashboard',
    type: 'collapse',
    icon: 'material-outline:apartment',
    children: [
      {
        id: 'allClients',
        title: 'All Clients',
        type: 'item',
        icon: 'material-solid:fiber_manual_record',
        url: '/clients/clients-list',
      },
      {
        id: 'clientsApprovalList',
        title: 'Registration Requests',
        type: 'item',
        icon: 'material-solid:fiber_manual_record',
        url: '/clients/approval-list',
      },
    ],
  },
  {
    id: 'customers',
    title: 'Customers',
    // translate: 'Customers',
    type: 'item',
    icon: 'material-outline:business_center',
    url: '/customers/customers-list',
  },
  {
    id: 'products',
    title: 'Product Catalog',
    // translate: 'Dashboard',
    type: 'collapse',
    icon: 'material-outline:category',
    children: [
      {
        id: 'allProducts',
        title: 'All Products',
        type: 'item',
        icon: 'material-solid:fiber_manual_record',
        url: '/products/products-list',
      },
      {
        id: 'clientsApprovalList',
        title: 'All Categories',
        type: 'item',
        icon: 'material-solid:fiber_manual_record',
        url: '/categories/categories-list',
      },
    ],
  },
  {
    id: 'creditCheck',
    title: 'Credit Check',
    // translate: 'Credit Check',
    type: 'item',
    // icon: 'heroicons-outline:credit-card',
    icon: 'material-outline:credit_score',
    url: '/credit-check/credit-checks-list',
  },
  {
    id: 'users',
    title: 'Users',
    // translate: 'Dashboard',
    type: 'collapse',
    icon: 'material-outline:group',
    children: [
      {
        id: 'fpAdminUsers',
        title: 'FP Admin User(s)',
        type: 'item',
        icon: 'material-solid:fiber_manual_record',
        url: '/users/fp-admin-list',
      },
      {
        id: 'businessAdminUsers',
        title: 'Business Admin User(s)',
        type: 'item',
        icon: 'material-solid:fiber_manual_record',
        url: '/users/business-admin-list',
      },
    ],
  },
  // {
  //   id: 'userOverview',
  //   title: 'User Management',
  //   // translate: 'User Management',
  //   type: 'item',
  //   icon: 'material-outline:group',
  //   url: 'user-overview',
  // }
];


export default navigationConfig;
