import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
// import { orderListOverviewHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import { refundRequestsOverview } from '../../../components/overview/overviewTable/TablesName';
import { refundRequestsOverviewRowDataFields } from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { useTranslation } from "react-i18next";

export default function RefundRequestsOverview() {
  const { t } = useTranslation();
  const tabPanelsLabel = [
    t("label:all"),
    t("label:pending"),
    t("label:accepted"),
    t("label:rejected"),
  ];
  const tabs = [0, 1, 2, 3];
  const headerSubtitle = t("label:refundRequests");
  // const headerButtonLabel = t("label:createOrder");
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const ordersList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const refundRequestsOverviewHeaderRows = [
    {
      id: "date",
      align: "left",
      disablePadding: false,
      label: t("label:dateRequested"),
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
      id: "customerName",
      align: "left",
      disablePadding: false,
      label: t("label:customerName"),
      sort: true,
    },
    {
      id: "orderAmount",
      align: "right",
      disablePadding: false,
      label: t("label:orderAmount"),
      sort: true,
    },
    {
      id: "refundAmount",
      align: "right",
      disablePadding: false,
      label: t("label:refundAmount"),
      sort: true,
    },
    {
      id: "stage",
      align: "right",
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
    {
      id: "approveAction",
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
    OrdersService.refundRequests()
      .then((res) => {
        if (res?.status_code === 200 && res?.is_data) {
          dispatch(setOverviewMainTableDataSlice(res));
          setIsLoading(false);
        } else {
          setIsLoading(false);
          dispatch(setOverviewMainTableDataSlice([]));
        }
      })
      .catch((e) => {
        if (isLoading) enqueueSnackbar(e, { variant: "error" });
        setIsLoading(false);
        dispatch(setOverviewMainTableDataSlice([]));
      });
  }, [isLoading]);

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      // headerButtonLabel={headerButtonLabel}
      tableName={refundRequestsOverview}
      headerRows={refundRequestsOverviewHeaderRows}
      tableData={ordersList.tableData}
      rowDataFields={refundRequestsOverviewRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      isLoading={isLoading}
    />
  );
}
