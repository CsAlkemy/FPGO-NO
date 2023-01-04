import React, { useState, useEffect } from "react";
import "../../../../../styles/colors.css";
import OverviewMainTable from "../../../../components/overview/overviewTable/OverviewMainTable";
import { fpAdminUsersListOverviewHeaderRows } from "../../../../components/overview/overviewTable/HeaderRows";
import { fpAdminUsersOverview } from "../../../../components/overview/overviewTable/TablesName";
import { fpAdminUsersRowDataFields } from "../../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import UserService from "../../../../data-access/services/userService/UserService";
import {
  selectOverviewMainTableData,
  setOverviewMainTableDataSlice,
} from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

export default function FpAdminUsersOverview() {
  const {t} = useTranslation()
  const [isLoading, setIsLoading] = useState(true);
  const tabPanelsLabel = [t("label:all"), t("label:active"), t("label:inactive")];
  const tabs = [0, 1, 2];
  // const headerSubtitle = t("label:usersAllFpAdmis");
  const headerSubtitle = t("navigation:fpAdminUsers");
  const headerButtonLabel = t("label:createUser");
  const dispatch = useDispatch();
  const fpAdminUsers = useSelector(selectOverviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const fpAdminUsersListOverviewHeaderRows = [
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: t("label:clientName"),
      sort: true,
    },
    {
      id: 'email',
      align: 'left',
      disablePadding: false,
      label: t("label:email"),
      sort: true,
    },
    {
      id: 'phone',
      align: 'left',
      disablePadding: false,
      label: t("label:phoneNo"),
      sort: true,
    },
    {
      id: 'designation',
      align: 'left',
      disablePadding: false,
      label: t("label:designation"),
      sort: true,
    },
    {
      id: 'status',
      align: 'right',
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
  ];

  useEffect(() => {
    UserService.fpAdminUsersList()
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
        enqueueSnackbar(e, { variant: "error" });
        setIsLoading(false);
        dispatch(setOverviewMainTableDataSlice([]));
      });
  }, [isLoading]);

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={fpAdminUsersOverview}
      headerRows={fpAdminUsersListOverviewHeaderRows}
      tableData={fpAdminUsers}
      rowDataFields={fpAdminUsersRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      isLoading={isLoading}
    />
  );
}
