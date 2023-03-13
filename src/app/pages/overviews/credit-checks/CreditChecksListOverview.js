import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import { creditChecksListHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import { creditChecksListOverview } from "../../../components/overview/overviewTable/TablesName";
import { creditChecksListRowDataFields } from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import CreditCheckService from "../../../data-access/services/creditCheckService/CreditCheckService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useGetCreditChecksListQuery } from "app/store/api/apiSlice";
import Hidden from '@mui/material/Hidden';

export default function CreditChecksListOverview() {
  const { t } = useTranslation();
  const tabPanelsLabel = [
    t("label:all"),
    t("label:private"),
    t("label:corporate"),
  ];
  const tabs = [0, 1, 2];
  const headerSubtitle = t("label:allCreditCheck");
  const headerButtonLabel = t("label:newCreditCheck");
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const creditCheckList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } =
    useGetCreditChecksListQuery();
  const creditChecksListHeaderRows = [
    {
      id: "date",
      align: "left",
      disablePadding: false,
      label: t("label:date"),
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
      id: "orgIdOrPNumber",
      align: "left",
      disablePadding: false,
      label: t("label:orgIdPNumber"),
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
      id: "defaultProbability",
      align: "left",
      disablePadding: false,
      label: t("label:probabilityToDefault"),
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

  useEffect(() => {
    refetch();
  }, []);

  const preparedData = data?.is_data
    ? CreditCheckService.mapCreditCheckList(data.data)
    : [];

  return (
    <>
      <Hidden smUp>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={creditChecksListOverview}
          headerRows={creditChecksListHeaderRows}
          // tableData={creditCheckList.tableData}
          tableData={data?.is_data ? preparedData : []}
          rowDataFields={creditChecksListRowDataFields}
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
          tableName={creditChecksListOverview}
          headerRows={creditChecksListHeaderRows}
          // tableData={creditCheckList.tableData}
          tableData={data?.is_data ? preparedData : []}
          rowDataFields={creditChecksListRowDataFields}
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
