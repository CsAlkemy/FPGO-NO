/* eslint import/no-extraneous-dependencies: off */
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import history from "@history";
import _ from "@lodash";
import {setInitialSettings} from "app/store/fuse/settingsSlice";
import {showMessage} from "app/store/fuse/messageSlice";
import settingsConfig from "app/configs/settingsConfig";
import AuthService from "../data-access/services/authService";
import {setNavigation} from "app/store/fuse/navigationSlice";
import {BUSINESS_ADMIN, FP_ADMIN, GENERAL_USER,} from "../utils/user-roles/UserRoles";

export const setUser = createAsyncThunk(
  "user/setUser",
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    switch (user.role[0]) {
      case FP_ADMIN:
        dispatch(
          setNavigation([
            {
              id: "dashboard",
              title: "Dashboard",
              translate: "dashboard",
              type: "item",
              icon: "material-outline:widgets",
              url: "/dashboard",
            },
            {
              id: "sales",
              title: "Sales",
              translate: "sales",
              type: "collapse",
              icon: "material-outline:receipt_long",
              children: [
                {
                  id: "orders",
                  title: "Orders",
                  translate: 'orders',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/sales/orders-list",
                },
                {
                  id: "reservations",
                  title: "Reservations",
                  translate: 'reservations',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reservations",
                },
              ]
            },
            {
              id: "subscriptions",
              title: "Subscriptions",
              translate: 'subscriptions',
              type: "collapse",
              icon: "material-outline:bookmarks",
              children: [
                {
                  id: "allSubscriptions",
                  title: "All Subscriptions",
                  translate: 'allSubscriptions',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/subscriptions/list",
                },
                {
                  id: "failedPayments",
                  title: "Failed Payments",
                  translate: 'failedPayments',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/subscriptions/failed-payments-list",
                },
              ],
            },
            {
              id: "clients",
              title: "Clients",
              translate: 'clients',
              type: "collapse",
              icon: "material-outline:apartment",
              children: [
                {
                  id: "allClients",
                  title: "All Clients",
                  translate: 'allClients',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/clients/clients-list",
                },
                {
                  id: "clientsApprovalList",
                  title: "Registration Requests",
                  translate: 'registrationRequests',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/clients/approval-list",
                },
              ],
            },
            {
              id: "refundRequests",
              title: "Refund Requests",
              translate: 'refundRequests',
              type: "item",
              icon: "material-outline:unarchive",
              url: "/refund-requests",
            },
            {
              id: "reports",
              title: "Reports",
              translate: 'reports',
              type: "collapse",
              icon: "material-outline:assignment_returned",
              children: [
                {
                  id: "payouts",
                  title: "Payouts",
                  translate: 'payouts',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reports/payouts-list",
                },
                {
                  id: "vatReport",
                  title: "VAT Report",
                  translate: 'vatReport',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reports/vats",
                },
              ],
            },
            {
              id: "customers",
              title: "Customers",
              translate: 'customers',
              type: "item",
              icon: "material-outline:business_center",
              url: "/customers/customers-list",
            },
            {
              id: "products",
              title: "Product Catalog",
              translate: 'productCatalog',
              type: "collapse",
              icon: "material-outline:category",
              children: [
                {
                  id: "allProducts",
                  title: "All Products",
                  translate: 'allProduct',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/products/products-list",
                },
                {
                  id: "allCategories",
                  title: "All Categories",
                  translate: 'allCategory',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/categories/categories-list",
                },
              ],
            },
            {
              id: 'users',
              title: 'Users',
              translate: 'users',
              type: 'collapse',
              icon: 'material-outline:group',
              children: [
                {
                  id: 'fpAdminUsers',
                  title: 'FP Admin User(s)',
                  translate: 'fpAdminUsers',
                  type: 'item',
                  icon: 'material-solid:fiber_manual_record',
                  url: '/users/fp-admin-list',
                },
                {
                  id: 'businessAdminUsers',
                  title: 'Client User(s)',
                  translate: 'clientUsers',
                  type: 'item',
                  icon: 'material-solid:fiber_manual_record',
                  url: '/users/business-admin-list',
                },
              ],
            },
          ])
        );
        break;
      case BUSINESS_ADMIN:
        dispatch(
          setNavigation([
            {
              id: "dashboard",
              title: "Dashboard",
              translate: "dashboard",
              type: "item",
              icon: "material-outline:widgets",
              url: "/dashboard",
            },
            {
              id: "sales",
              title: "Sales",
              translate: "sales",
              type: "collapse",
              icon: "material-outline:receipt_long",
              children: [
                {
                  id: "orders",
                  title: "Orders",
                  translate: 'orders',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/sales/orders-list",
                },
                {
                  id: "reservations",
                  title: "Reservations",
                  translate: 'reservations',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reservations",
                },
              ]
            },
            {
              id: "reports",
              title: "Reports",
              translate: 'reports',
              type: "collapse",
              icon: "material-outline:assignment_returned",
              children: [
                {
                  id: "payouts",
                  title: "Payouts",
                  translate: 'payouts',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: `/reports/payouts/${user?.user_data?.organization?.uuid}`,
                },
                {
                  id: "vatReport",
                  title: "VAT Report",
                  translate: 'vatReport',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reports/vats",
                },
              ],
            },
            {
              id: "subscriptions",
              title: "Subscriptions",
              translate: 'subscriptions',
              type: "collapse",
              icon: "material-outline:bookmarks",
              children: [
                {
                  id: "allSubscriptions",
                  title: "All Subscriptions",
                  translate: 'allSubscriptions',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/subscriptions/list",
                },
                {
                  id: "failedPayments",
                  title: "Failed Payments",
                  translate: 'failedPayments',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/subscriptions/failed-payments-list",
                },
              ],
            },
            {
              id: "customers",
              title: "Customers",
              translate: 'customers',
              type: "item",
              icon: "material-outline:business_center",
              url: "/customers/customers-list",
            },
            {
              id: "products",
              title: "Product Catalog",
              translate: 'productCatalog',
              type: "collapse",
              icon: "material-outline:category",
              children: [
                {
                  id: "allProducts",
                  title: "All Products",
                  translate: "allProduct",
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/products/products-list",
                },
                {
                  id: "allCategories",
                  title: "All Categories",
                  translate: "allCategory",
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/categories/categories-list",
                },
              ],
            },
            {
              id: "creditCheck",
              title: "Credit Check",
              translate: 'creditCheck',
              type: "item",
              // icon: 'heroicons-outline:credit-card',
              icon: "material-outline:credit_score",
              url: "/credit-check/credit-checks-list",
            },
            {
              id: "businessAdminUsers",
              title: "User Management",
              translate: 'userManagement',
              type: "item",
              icon: "material-outline:group",
              url: `/users/organization-wise-user-list/${user.user_data.organization.uuid}`,
            },
          ])
        );
        break;
      case GENERAL_USER:
        dispatch(
          setNavigation([
            // {
            //   id: "dashboard",
            //   title: "Dashboard",
            //   translate: "Dashboard",
            //   type: "item",
            //   icon: "material-outline:widgets",
            //   url: "dashboard",
            // },
            {
              id: "sales",
              title: "Sales",
              translate: "sales",
              type: "collapse",
              icon: "material-outline:receipt_long",
              children: [
                {
                  id: "orders",
                  title: "Orders",
                  translate: 'orders',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/sales/orders-list",
                },
                {
                  id: "reservations",
                  title: "Reservations",
                  translate: 'reservations',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reservations",
                },
              ]
            },
            {
              id: "reports",
              title: "Reports",
              translate: 'reports',
              type: "collapse",
              icon: "material-outline:assignment_returned",
              children: [
                {
                  id: "payouts",
                  title: "Payouts",
                  translate: 'payouts',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: `/reports/payouts/${user?.user_data?.organization?.uuid}`,
                },
                {
                  id: "vatReport",
                  title: "VAT Report",
                  translate: 'vatReport',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/reports/vats",
                },
              ],
            },
            {
              id: "subscriptions",
              title: "Subscriptions",
              translate: 'subscriptions',
              type: "collapse",
              icon: "material-outline:bookmarks",
              children: [
                {
                  id: "allSubscriptions",
                  title: "All Subscriptions",
                  translate: 'allSubscriptions',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/subscriptions/subscription-list",
                },
                {
                  id: "failedPayments",
                  title: "Failed Payments",
                  translate: 'failedPayments',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/subscriptions/failed-payments",
                },
              ],
            },
            {
              id: "customers",
              title: "Customers",
              translate: 'customers',
              type: "item",
              icon: "material-outline:business_center",
              url: "/customers/customers-list",
            },
            {
              id: "products",
              title: "Product Catalog",
              translate: 'productCatalog',
              type: "collapse",
              icon: "material-outline:category",
              children: [
                {
                  id: "allProducts",
                  title: "All Products",
                  translate: 'allProduct',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/products/products-list",
                },
                {
                  id: "allCategories",
                  title: "All Categories",
                  translate: 'allCategory',
                  type: "item",
                  icon: "material-solid:fiber_manual_record",
                  url: "/categories/categories-list",
                },
              ],
            },
            {
              id: "creditCheck",
              title: "Credit Check",
              translate: 'creditCheck',
              type: "item",
              // icon: 'heroicons-outline:credit-card',
              icon: "material-outline:credit_score",
              url: "/credit-check/credit-checks-list",
            },
          ])
        );
        break;
    }

    return user;
  }
);

export const updateUserSettings = createAsyncThunk(
  "user/updateSettings",
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  "user/updateShortucts",
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();

  if (!user.role || user.role.length === 0) {
    // is guest/unAuthorized User
    return null;
  }

  history.push({
    pathname: "/login",
  });

  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const updateUserData = (user) => async (dispatch, getState) => {
  if (!user.role || user.role.length === 0) {
    // is guest
    return;
  }

  AuthService.updateUserData(user)
    .then(() => {
      dispatch(showMessage({ message: "User data saved with api" }));
    })
    .catch((error) => {
      dispatch(showMessage({ message: error.message }));
    });
};

const initialState = {
  role: [], // guest
  data: {
    // displayName: 'John Doe',
    displayName: "John Doe",
    uuid: "",
    photoURL: "assets/images/avatars/brian-hughes.jpg",
    email: "johndoe@withinpixels.com",
    shortcuts: ["apps.calendar", "apps.mailbox", "apps.contacts", "apps.tasks"],
  },
  token_data: {},
  user_data: {},
  // loginRedirectUrl: "/dashboard",  // FRON536- change redirect URL
  loginRedirectUrl: "/sales/orders-list",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
  },
});

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
