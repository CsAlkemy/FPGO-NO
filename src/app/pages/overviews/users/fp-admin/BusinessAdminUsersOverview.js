import React, { useState, useEffect } from "react";
import "../../../../../styles/colors.css";
import OverviewMainTable from "../../../../components/overview/overviewTable/OverviewMainTable";
import { businessAdminUsersListOverviewHeaderRows } from "../../../../components/overview/overviewTable/HeaderRows";
import { businessAdminUsersOverview } from "../../../../components/overview/overviewTable/TablesName";
import { businessAdminUsersRowDataFields } from "../../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../../../data-access/services/userService/UserService";
import {
  selectOverviewMainTableData,
  setOverviewMainTableDataSlice,
} from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { selectUser } from "app/store/userSlice";
import { useTranslation } from "react-i18next";
import { useGetClientOrganizationsSummaryListQuery } from "app/store/api/apiSlice";

export default function BusinessAdminUsersOverview() {
  const { t } = useTranslation();
  // const [isLoading, setIsLoading] = useState(true);
  const tabPanelsLabel = [
    t("label:all"),
    t("label:active"),
    t("label:inactive"),
  ];
  const tabs = [0, 1, 2];
  const headerSubtitle = t("label:clientsUserSummary");
  const headerButtonLabel = t("label:createUser");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const businessAdminUsers = useSelector(selectOverviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isFetching, isLoading, isSuccess, isError, error, refetch } =
    useGetClientOrganizationsSummaryListQuery();
  const businessAdminUsersListOverviewHeaderRows = [
    {
      id: "nameOrgId",
      align: "left",
      disablePadding: false,
      label: t("label:nameOrganizationId"),
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
    {
      id: "userCount",
      align: "left",
      disablePadding: false,
      label: t("label:userCount"),
      sort: true,
    },
    {
      id: "status",
      align: "right",
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
  ];

  useEffect(() => {
    refetch();
  }, []);

  const preparedData = data?.is_data
    ? UserService.mapClientOrganizationsSummaryList(data.data)
    : [];

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={businessAdminUsersOverview}
      headerRows={businessAdminUsersListOverviewHeaderRows}
      // tableData={businessAdminUsers}
      tableData={data?.is_data ? preparedData : []}
      rowDataFields={businessAdminUsersRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      // isLoading={isLoading}
      isLoading={isFetching}
    />
  );
}
