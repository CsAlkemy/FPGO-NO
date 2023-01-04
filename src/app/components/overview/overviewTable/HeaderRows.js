import { organizationWiseUsersOverview } from './TablesName';
// import i18n from 'i18next';
// import i18n from 'src/i18n';
import { t } from 'i18next';
export const userListOverviewHeaderRows = [
  {
    id: 'clientName',
    align: 'left',
    disablePadding: false,
    label: 'Client Name',
    sort: true,
  },
  {
    id: 'orgId',
    align: 'left',
    disablePadding: false,
    label: 'Organization ID',
    sort: true,
  },
  {
    id: 'clientType',
    align: 'left',
    disablePadding: false,
    label: 'Client Type',
    sort: true,
  },
  {
    id: 'users',
    align: 'left',
    disablePadding: false,
    label: 'Users',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const clientAdminHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone',
    sort: true,
  },
  {
    id: 'branch',
    align: 'left',
    disablePadding: false,
    label: 'Branch',
    sort: true,
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const subClientAdminHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'userId',
    align: 'left',
    disablePadding: false,
    label: 'User ID',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone',
    sort: true,
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const approvalListForFPAdminHeaderRows = [
  {
    id: 'nameOrgId',
    align: 'left',
    disablePadding: false,
    label: 'Name (Organization ID)',
    sort: true,
  },
  {
    id: 'reqOn',
    align: 'left',
    disablePadding: false,
    label: 'Requested on',
    sort: true,
  },
  {
    id: 'orgType',
    align: 'left',
    disablePadding: false,
    label: 'Organization Type',
    sort: true,
  },
  {
    id: 'primaryContact',
    align: 'left',
    disablePadding: false,
    label: 'Primary Contact',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
];

export const clientsListOverviewHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'orgId',
    align: 'left',
    disablePadding: false,
    label: 'Organization ID',
    sort: true,
  },
  {
    id: 'orgType',
    align: 'left',
    disablePadding: false,
    label: 'Organization Type',
    sort: true,
  },
  {
    id: 'primaryContact',
    align: 'left',
    disablePadding: false,
    label: 'Primary Contact',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
];

export const producstListHeaderRows = [
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Product ID',
    sort: true,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Product Name',
    sort: true,
  },
  {
    id: 'type',
    align: 'left',
    disablePadding: false,
    label: 'Type',
    sort: true,
  },
  {
    id: 'category',
    align: 'left',
    disablePadding: false,
    label: 'Category',
    sort: true,
  },
  {
    id: 'unit',
    align: 'left',
    disablePadding: false,
    label: 'Unit',
    sort: true,
  },
  {
    id: 'pricePerUnit',
    align: 'left',
    disablePadding: false,
    label: 'Price Per Unit',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const categoriesListOverviewHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Name',
    sort: true,
  },
  {
    id: 'description',
    align: 'left',
    disablePadding: false,
    label: 'Description',
    sort: true,
  },
  {
    id: 'noOfProducts',
    align: 'right',
    disablePadding: false,
    label: 'No. of Products',
    sort: true,
  }
];

export const customersListHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Customer Name',
    sort: true,
  },
  {
    id: 'orgIdOrPNumber',
    align: 'left',
    disablePadding: false,
    label: 'Org ID/P-number',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'lastInvoicedOn',
    align: 'left',
    disablePadding: false,
    label: 'Last Invoiced on',
    sort: true,
  },
  {
    id: 'lastOrderAmount',
    align: 'right',
    disablePadding: false,
    label: 'Last Order Amount',
    sort: true,
  }
];

export const creditChecksListHeaderRows = [
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: 'Date',
    sort: true,
  },
  {
    id: 'customerName',
    align: 'left',
    disablePadding: false,
    label: 'Customer Name',
    sort: true,
  },
  {
    id: 'orgIdOrPNumber',
    align: 'left',
    disablePadding: false,
    label: 'Org ID/P-number',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'defaultProbability',
    align: 'left',
    disablePadding: false,
    label: 'Probability to Default',
    sort: true,
  },
  {
    id: 'status',
    align: 'center',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const fpAdminUsersListOverviewHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Client Name',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'designation',
    align: 'left',
    disablePadding: false,
    label: 'Designation',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const businessAdminUsersListOverviewHeaderRows = [
  {
    id: 'nameOrgId',
    align: 'left',
    disablePadding: false,
    label: 'Name (Organization ID)',
    sort: true,
  },
  {
    id: 'orgType',
    align: 'left',
    disablePadding: false,
    label: 'Organization Type',
    sort: true,
  },
  {
    id: 'primaryContact',
    align: 'left',
    disablePadding: false,
    label: 'Primary Contact',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'userCount',
    align: 'left',
    disablePadding: false,
    label: 'User Count',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const organizationWiseUsersListOverviewHeaderRows = [
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Client Name',
    sort: true,
  },
  {
    id: 'email',
    align: 'left',
    disablePadding: false,
    label: 'Email',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'designation',
    align: 'left',
    disablePadding: false,
    label: 'Designation',
    sort: true,
  },
  {
    id: 'role',
    align: 'left',
    disablePadding: false,
    label: 'Role',
    sort: true,
  },
  {
    id: 'status',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
];

export const orderListOverviewHeaderRows = [
  {
    id: 'date',
    align: 'left',
    disablePadding: false,
    label: t("label:dateCreated"),
    sort: true,
  },
  {
    id: 'id',
    align: 'left',
    disablePadding: false,
    label: 'Order ID',
    sort: true,
  },
  {
    id: 'name',
    align: 'left',
    disablePadding: false,
    label: 'Customer Name',
    sort: true,
  },
  {
    id: 'dueDate',
    align: 'left',
    disablePadding: false,
    label: 'Payment link due date',
    sort: true,
  },
  {
    id: 'phone',
    align: 'left',
    disablePadding: false,
    label: 'Phone No.',
    sort: true,
  },
  {
    id: 'amount',
    align: 'right',
    disablePadding: false,
    label: 'Amount',
    sort: true,
  },
  {
    id: 'stage',
    align: 'right',
    disablePadding: false,
    label: 'Status',
    sort: true,
  },
  {
    id: 'refundResend',
    align: 'right',
    disablePadding: false,
    label: '',
    sort: true,
  },
  {
    id: 'cancel',
    align: 'right',
    disablePadding: false,
    label: '',
    sort: true,
  },
];