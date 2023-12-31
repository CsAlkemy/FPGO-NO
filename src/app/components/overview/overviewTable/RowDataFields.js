import { organizationWiseUsersListOverviewHeaderRows } from "./HeaderRows";

export const fpAdminRowDataFields = [
  "clientName",
  "orgId",
  "clientType",
  "users",
  "status",
];

export const clientAdminRowDataFields = [
  "name",
  "email",
  "phone",
  "branch",
  "role",
  "status",
];

export const subClientAdminRowDataFields = [
  "name",
  "userId",
  "email",
  "phone",
  "role",
  "status",
];

export const approvalListForFPAdminRowDataFields = [
  "nameOrgId",
  "reqOn",
  "orgType",
  "primaryContact",
  "phone",
  "email",
];

export const clientsListRowDataFields = [
  "name",
  "orgId",
  // "orgType",
  "primaryContact",
  "phone",
  "email",
  "status",
];

export const productsListRowDataFields = [
  "id",
  "name",
  "type",
  "category",
  "unit",
  "pricePerUnit",
  "status",
];

export const categoriesListRowDataFields = [
  "name",
  "description",
  "noOfProducts",
];

export const customersListRowDataFields = [
  "name",
  "orgIdOrPNumber",
  "phone",
  "email",
  "lastInvoicedOn",
  "lastOrderAmount",
];

export const customerOrdersListRowDataFields = [
  "dateCreated",
  "orderId",
  "paymentLinkDueDate",
  "amount",
  "stage",
  "refundResend",
  "cancel",
];

export const clientOrdersListRowDataFields = [
  "dateCreated",
  "orderId",
  "customerName",
  "paymentLinkDueDate",
  "phoneNo",
  "amount",
  "status",
];

export const creditChecksListRowDataFields = [
  "date",
  "customerName",
  "orgIdOrPNumber",
  "phone",
  "defaultProbability",
  "status",
];

export const fpAdminUsersRowDataFields = [
  "name",
  "email",
  "phone",
  "designation",
  "status",
];

export const businessAdminUsersRowDataFields = [
  "nameOrgId",
  "orgType",
  "primaryContact",
  "phone",
  "email",
  "userCount",
  "status",
];

export const organizationWiseUsersRowDataFields = [
  "name",
  "email",
  "phone",
  "designation",
  "role",
  "status",
];

export const orderListOverviewRowDataFields = [
  "date",
  "id",
  "name",
  "dueDate",
  "phone",
  "amount",
  "stage",
  "refundResend",
  "cancel",
];
export const orderListOverviewFPAdminRowDataFields = [
  "date",
  "id",
  "clientName",
  "name",
  "dueDate",
  "phone",
  "amount",
  "stage",
  "refundResend",
  "cancel",
];

export const refundRequestsOverviewRowDataFields = [
  "date",
  "id",
  "clientName",
  "customerName",
  "orderAmount",
  "refundAmount",
  "stage",
  "approveAction",
  "cancel",
];

export const subscriptionsListOverviewRowDataFields = [
  "date",
  "id",
  "name",
  "phone",
  "paymentsMade",
  "amount",
  "stage",
  "refundResend",
  "cancel",
];

export const failedPaymentsListOverviewRowDataFields = [
  "date",
  "orderId",
  "name",
  "phone",
  "subscriptionId",
  "amount",
  "status",
];

export const reservationOverviewRowDataFields = [
  "date",
  "id",
  "customer",
  "phone",
  "reservedAmount",
  "amountPaid",
  "amountInBank",
  "status",
  "options",
];

export const reservationOverviewFPAdminRowDataFields = [
  "date",
  "id",
  "clientName",
  "customer",
  "phone",
  "reservedAmount",
  "amountPaid",
  "amountInBank",
  "status",
  "options",
];
export const payoutsListRowDataFields = [
  "name",
  // "orgId",
  // "orgType",
  "primaryContact",
  "email",
  "phone",
  "status",
];

export const payoutsMonthViewRowDataFields = [
  "dateAdded",
  "fileName",
  "fileFormat",
  "isDownload",
];
