import FuseLoading from "@fuse/core/FuseLoading";
import FuseUtils from "@fuse/utils";
import settingsConfig from "app/configs/settingsConfig";
import { Navigate } from "react-router-dom";
import SignOutConfig from "../components/Auth/sign-out/SignOutConfig";
import SignUpConfig from "../components/Auth/sign-up/SignUpConfig";
import Error404Page from "../main/404/Error404Page";
import DashboardConfig from "../pages/dashboard/DashboardConfig";
import AuthConfig from "../pages/auth/authConfig";
import ClientManagementConfig from "../pages/clientManagement/clientManagementConfig";
import {
  CustomersConfig,
  CustomersConfigRBAC,
} from "../pages/customers/customersConfig";
import {
  CategoriesConfig,
  CategoriesConfigRBAC,
} from "../pages/overviews/categories/CategoriesConfig";
import ClientsConfig from "../pages/overviews/clients/ClientsConfig";
import CreditChecksConfig from "../pages/overviews/credit-checks/CreditChecksConfig";
import UserOverviewConfig from "../pages/overviews/users/UserOverviewConfig";
import {
  ProductsConfig,
  ProductsConfigRBAC,
} from "../pages/products/productsConfig";
import { SalesConfig, SalesConfigRBAC } from "../pages/sales/salesConfig";
import UserManagementConfig from "../pages/userManagement/userManagementConfig";
import PaymentConfig from "../pages/sales/paymentConfig";
import RefundRequestsConfig from "../pages/overviews/refund-requests/RefundRequestsConfig";
import Config404 from "../pages/404/404Config";
import SubscriptionPaymentConfig from "../pages/subscriptions/subscriptionPaymentConfig";
import {SubscriptionsConfig, SubscriptionsConfigRBAC} from "../pages/subscriptions/subscriptionsConfig";
import { ReportsConfig, ReportsConfigRBAC } from "../pages/reports/reportsConfig";
import {
  ReservationsConfig,
  ReservationsConfEx,
  ReservationCart,
} from "../pages/sales/reservationsConfig";

const routeConfigs = [
  DashboardConfig,
  SignOutConfig,
  SignUpConfig,
  // CreditCheckConfig,
  UserManagementConfig,
  UserOverviewConfig,
  ClientManagementConfig,
  ClientsConfig,
  ProductsConfig,
  ProductsConfigRBAC,
  SubscriptionPaymentConfig,
  SubscriptionsConfig,
  SubscriptionsConfigRBAC,
  CategoriesConfig,
  CategoriesConfigRBAC,
  CustomersConfig,
  CustomersConfigRBAC,
  AuthConfig,
  CreditChecksConfig,
  SalesConfig,
  SalesConfigRBAC,
  PaymentConfig,
  RefundRequestsConfig,
  Config404,
  ReservationsConfig,
  ReservationsConfEx,
  ReservationCart,
  ReportsConfig,
  ReportsConfigRBAC,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: "/",
    element: <Navigate to="/login" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: "loading",
    element: <FuseLoading />,
  },
  {
    path: "404",
    element: <Error404Page />,
  },
  {
    path: "*",
    element: <Navigate to="404" />,
  },
];

export default routes;
