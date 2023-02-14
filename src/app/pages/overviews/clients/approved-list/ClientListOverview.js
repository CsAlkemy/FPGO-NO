import React, { useState, useEffect } from "react";
import "../../../../../styles/colors.css";
import OverviewMainTable from "../../../../components/overview/overviewTable/OverviewMainTable";
import { clientsListOverviewHeaderRows } from "../../../../components/overview/overviewTable/HeaderRows";
import { clientsListOverview } from "../../../../components/overview/overviewTable/TablesName";
import { clientsListRowDataFields } from "../../../../components/overview/overviewTable/RowDataFields";
import ClientService from "../../../../data-access/services/clientsService/ClientService";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useGetApprovedClientsListQuery } from "app/store/api/apiSlice";

export default function ClientListOverview() {
  const { t } = useTranslation();
  const tabPanelsLabel = [
    t("label:all"),
    t("label:active"),
    t("label:inactive"),
  ];
  const tabs = [0, 1, 2];
  const headerSubtitle = t("label:allClients");
  const headerButtonLabel = t("label:createClient");
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const approvedClientList = useSelector(
    (state) => state.overviewMainTableData
  );
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetApprovedClientsListQuery();
  const clientsListOverviewHeaderRows = [
    {
      id: "name",
      align: "left",
      disablePadding: false,
      label: t("label:name"),
      sort: true,
    },
    {
      id: "orgId",
      align: "left",
      disablePadding: false,
      label: t("label:organizationId"),
      sort: true,
    },
    {
      id: "orgType",
      align: "left",
      disablePadding: false,
      label: t("label:organizationType"),
      sort: true,
    },
    {
      id: "primaryContact",
      align: "left",
      disablePadding: false,
      label: t("label:primaryContact"),
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
      id: "email",
      align: "left",
      disablePadding: false,
      label: t("label:email"),
      sort: true,
    },
  ];

  useEffect(() => {
    refetch();
  }, []);

  const preparedData = data?.is_data
    ? ClientService.mapApprovedClientList(data.data)
    : [];

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={clientsListOverview}
      headerRows={clientsListOverviewHeaderRows}
      // tableData={approvedClientList.tableData}
      tableData={preparedData}
      rowDataFields={clientsListRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      // isLoading={isLoading}
      isLoading={isFetching}
    />
  );
}
