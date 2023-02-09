import React, { useState, useEffect } from "react";
import "../../../../../styles/colors.css";
import OverviewMainTable from "../../../../components/overview/overviewTable/OverviewMainTable";
import { organizationWiseUsersListOverviewHeaderRows } from "../../../../components/overview/overviewTable/HeaderRows";
import { organizationWiseUsersOverview } from "../../../../components/overview/overviewTable/TablesName";
import {
  fpAdminRowDataFields,
  organizationWiseUsersRowDataFields,
} from "../../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";

import UserService from "../../../../data-access/services/userService/UserService";
import {
  selectOverviewMainTableData,
  setOverviewMainTableDataSlice,
} from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetUsersListQuery } from "app/store/api/apiSlice";

export default function OrganizationWiseUserList() {
  const { t } = useTranslation();
  // const [isLoading, setIsLoading] = useState(true);
  const tabPanelsLabel = [
    t("label:all"),
    t("label:active"),
    t("label:inactive"),
  ];
  const tabs = [0, 1, 2];
  const headerButtonLabel = t("label:createUser");
  const headerSubtitle = t("label:allUser");
  const dispatch = useDispatch();
  const userList = useSelector(selectOverviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const { data, isFetching, isLoading, isSuccess, isError, error, refetch } =
    useGetUsersListQuery(params.uuid);
  const organizationWiseUsersListOverviewHeaderRows = [
    {
      id: "name",
      align: "left",
      disablePadding: false,
      label: t("label:clientName"),
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
      id: "phone",
      align: "left",
      disablePadding: false,
      label: t("label:phoneNo"),
      sort: true,
    },
    {
      id: "designation",
      align: "left",
      disablePadding: false,
      label: t("label:designation"),
      sort: true,
    },
    {
      id: "role",
      align: "left",
      disablePadding: false,
      label: t("label:role"),
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
    ? UserService.mapOrgWiseUsersList(data.data)
    : [];

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={organizationWiseUsersOverview}
      headerRows={organizationWiseUsersListOverviewHeaderRows}
      // tableData={userList}
      tableData={data?.is_data ? preparedData : []}
      rowDataFields={organizationWiseUsersRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      // isLoading={isLoading}
      isLoading={isFetching}
    />
  );
}
