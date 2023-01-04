import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import { customersListHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import { customerOrdersListOverview } from "../../../components/overview/overviewTable/TablesName";
import { customerOrdersListRowDataFields } from "../../../components/overview/overviewTable/RowDataFields";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

export default function CustomerOrdersOverview() {
  const { t } = useTranslation();
  const tabPanelsLabel = [
    t("label:all"),
    t("label:sent"),
    t("label:paid"),
    t("label:invoiced"),
    t("label:expired"),
  ];
  const tabs = [0, 1, 2, 3, 4];
  const headerSubtitle = t("label:allCustomers");
  const headerButtonLabel = t("label:createCustomer");
  // const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const customersList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const customersListHeaderRows = [
    {
      id: "dateCreated",
      align: "left",
      disablePadding: false,
      label: t("label:dateCreated"),
      sort: true,
    },
    {
      id: "orderId",
      align: "left",
      disablePadding: false,
      label: t("label:orderId"),
      sort: true,
    },
    {
      id: "paymentLinkDueDate",
      align: "left",
      disablePadding: false,
      label: t("label:paymentLinkDueDate"),
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
      align: "right",
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
    {
      id: 'refundResend',
      align: 'right',
      disablePadding: false,
      label: '',
      sort: false,
    },
    {
      id: 'cancel',
      align: 'right',
      disablePadding: false,
      label: '',
      sort: false,
    },
  ];
  const { id } = useParams();

  useEffect(() => {
    CustomersService.customerOrdersList(id)
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
      headerButtonLabel={headerButtonLabel}
      tableName={customerOrdersListOverview}
      headerRows={customersListHeaderRows}
      tableData={customersList.tableData}
      rowDataFields={customerOrdersListRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      isLoading={isLoading}
    />
  );
}
