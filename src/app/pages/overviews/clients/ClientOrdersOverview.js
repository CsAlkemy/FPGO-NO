import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import { customersListHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import {
  clientOrdersListOverview,
  customerOrdersListOverview,
} from '../../../components/overview/overviewTable/TablesName';
import {
  clientOrdersListRowDataFields,
  customerOrdersListRowDataFields,
} from '../../../components/overview/overviewTable/RowDataFields';
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ClientService from '../../../data-access/services/clientsService/ClientService';

export default function ClientOrdersOverview() {
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
  const clientOrdersList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const clientOrdersListHeaderRows = [
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
      id: "customerName",
      align: "left",
      disablePadding: false,
      label: t("label:customerName"),
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
      id: "phoneNo",
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
      id: "status",
      align: "center",
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
  ];
  const { uuid } = useParams();

  useEffect(() => {
    if (isLoading) {
      // ClientService.getOrdersList(uuid, 1675209600)
      ClientService.getOrdersList("ORG3913394892", "1667890908")
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
    }
  }, [isLoading]);

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={clientOrdersListOverview}
      headerRows={clientOrdersListHeaderRows}
      tableData={clientOrdersList.tableData}
      rowDataFields={clientOrdersListRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      isLoading={isLoading}
    />
  );
}
