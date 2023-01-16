import React, { useState, useEffect } from "react";
import "../../../../../styles/colors.css";
import OverviewMainTable from "../../../../components/overview/overviewTable/OverviewMainTable";
import { approvalListForFPAdminHeaderRows } from "../../../../components/overview/overviewTable/HeaderRows";
import { approvalListOverviewFPAdmin } from "../../../../components/overview/overviewTable/TablesName";
import { approvalListForFPAdminRowDataFields } from "../../../../components/overview/overviewTable/RowDataFields";
import ClientService from "../../../../data-access/services/clientsService/ClientService";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useGetApprovalClientsListQuery } from "app/store/api/apiSlice";

export default function ApprovalListOverview() {
  const { t } = useTranslation();
  const tabPanelsLabel = [
    t("label:all"),
    t("label:today"),
    t("label:thisWeek"),
    t("label:thisMonth"),
  ];
  const tabs = [0, 1, 2, 3, 4];
  const headerSubtitle = t("label:requestedOn");
  const headerButtonLabel = t("label:createClient");
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const approvalList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, isSuccess, isError, error } =
    useGetApprovalClientsListQuery();
  const approvalListForFPAdminHeaderRows = [
    {
      id: "nameOrgId",
      align: "left",
      disablePadding: false,
      label: t("label:nameOrganizationId"),
      sort: true,
    },
    {
      id: "reqOn",
      align: "left",
      disablePadding: false,
      label: t("label:requestedOn"),
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

  // useEffect(() => {
  //   ClientService.approvalList()
  //     .then((res) => {
  //       if (res?.status_code === 200 && res?.is_data) {
  //         dispatch(setOverviewMainTableDataSlice(res));
  //         setIsLoading(false);
  //       } else {
  //         setIsLoading(false);
  //         dispatch(setOverviewMainTableDataSlice([]));
  //       }
  //     })
  //     .catch((e) => {
  //       enqueueSnackbar(e, { variant: "error" });
  //       setIsLoading(false);
  //       dispatch(setOverviewMainTableDataSlice([]));
  //     });
  // }, [isLoading]);

  // if (approvedClientList.tableData.length === 0) {
  //   return (
  //     <Typography color="text.secondary" variant="h5">
  //       No Row found for this Table!
  //     </Typography>
  //   );
  // }

  const preparedData = data?.is_data
    ? ClientService.mapApprovalList(data.data)
    : [];

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={approvalListOverviewFPAdmin}
      headerRows={approvalListForFPAdminHeaderRows}
      // tableData={approvalList.tableData}
      tableData={preparedData}
      rowDataFields={approvalListForFPAdminRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      // isLoading={isLoading}
      isLoading={isFetching}
    />
  );
}
