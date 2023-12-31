import React, { useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
// import { orderListOverviewHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import { ordersListOverview } from "../../../components/overview/overviewTable/TablesName";
import {
  orderListOverviewFPAdminRowDataFields,
  orderListOverviewRowDataFields,
} from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { useTranslation } from "react-i18next";
import { useGetOrdersListQuery } from "app/store/api/apiSlice";
import Hidden from "@mui/material/Hidden";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import { selectUser } from "app/store/userSlice";

export default function OrdersListOverview() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const tabPanelsLabel = [
    t("label:all"),
    t("label:sent"),
    t("label:paid"),
    t("label:invoiced"),
    t("label:expired"),
  ];
  const tabs = [0, 1, 2, 3, 4];
  const headerSubtitle = t("label:allOrders");
  const headerButtonLabel = t("label:createOrder");
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const ordersList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isFetching, isLoading, isSuccess, isError, error, refetch } =
    useGetOrdersListQuery();
  const orderListOverviewHeaderRows = [
    {
      id: "date",
      align: "left",
      disablePadding: false,
      label: t("label:dateCreated"),
      sort: true,
    },
    {
      id: "id",
      align: "left",
      disablePadding: false,
      label: t("label:orderId"),
      sort: true,
    },
    {
      id: "name",
      align: "left",
      disablePadding: false,
      label: t("label:customerName"),
      sort: true,
    },
    {
      id: "dueDate",
      align: "left",
      disablePadding: false,
      label: t("label:paymentLinkDueDate"),
      sort: true,
    },
    {
      id: "phone",
      align: "left",
      disablePadding: false,
      label: t("label:phoneNo"),
      sort: true,
    },
    {
      id: "amount",
      align: "right",
      disablePadding: false,
      label: t("label:amount"),
      sort: true,
    },
    {
      id: "stage",
      align: "center",
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
    {
      id: "refundResend",
      align: "right",
      disablePadding: false,
      label: "",
      sort: false,
    },
    {
      id: "cancel",
      align: "right",
      disablePadding: false,
      label: "",
      sort: false,
    },
  ];
  const orderListOverviewHeaderRowsFPAdmin = [
    {
      id: "date",
      align: "left",
      disablePadding: false,
      label: t("label:dateCreated"),
      sort: true,
    },
    {
      id: "id",
      align: "left",
      disablePadding: false,
      label: t("label:orderId"),
      sort: true,
    },
    {
      id: "clientName",
      align: "left",
      disablePadding: false,
      label: t("label:clientName"),
      sort: true,
    },
    {
      id: "name",
      align: "left",
      disablePadding: false,
      label: t("label:customerName"),
      sort: true,
    },
    {
      id: "dueDate",
      align: "left",
      disablePadding: false,
      label: t("label:paymentLinkDueDate"),
      sort: true,
    },
    {
      id: "phone",
      align: "left",
      disablePadding: false,
      label: t("label:phoneNo"),
      sort: true,
    },
    {
      id: "amount",
      align: "right",
      disablePadding: false,
      label: t("label:amount"),
      sort: true,
    },
    {
      id: "stage",
      align: "center",
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
    {
      id: "refundResend",
      align: "right",
      disablePadding: false,
      label: "",
      sort: false,
    },
    {
      id: "cancel",
      align: "right",
      disablePadding: false,
      label: "",
      sort: false,
    },
  ];

  useEffect(() => {
    refetch();
  }, []);

  const preparedData = data?.is_data
    ? OrdersService.mapOrderList(data.data)
    : [];

  return (
    <>
      <Hidden smUp>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={ordersListOverview}
          headerRows={
            user.role[0] !== FP_ADMIN
              ? orderListOverviewHeaderRows
              : orderListOverviewHeaderRowsFPAdmin
          }
          // tableData={ordersList.tableData}
          tableData={data?.is_data ? preparedData : []}
          rowDataFields={
            user.role[0] !== FP_ADMIN
              ? orderListOverviewRowDataFields
              : orderListOverviewFPAdminRowDataFields
          }
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          // isLoading={isLoading}
          isLoading={isFetching}
          isMobileScreen={true}
        />
      </Hidden>
      <Hidden smDown>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={ordersListOverview}
          headerRows={
            user.role[0] !== FP_ADMIN
              ? orderListOverviewHeaderRows
              : orderListOverviewHeaderRowsFPAdmin
          }
          // tableData={ordersList.tableData}
          tableData={data?.is_data ? preparedData : []}
          rowDataFields={
            user.role[0] !== FP_ADMIN
              ? orderListOverviewRowDataFields
              : orderListOverviewFPAdminRowDataFields
          }
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          // isLoading={isLoading}
          isLoading={isFetching}
          isMobileScreen={false}
        />
      </Hidden>
    </>
  );
}
