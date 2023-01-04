import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {
  categoriesListOverviewHeaderRows,
} from "../../../components/overview/overviewTable/HeaderRows";
import {
  categoriesListOverview,
} from "../../../components/overview/overviewTable/TablesName";
import {
  categoriesListRowDataFields,
} from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import CategoryService from "../../../data-access/services/categoryService/CategoryService";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';

export default function CategoriesListOverview() {
  const {t} = useTranslation()
  const tabPanelsLabel = [t("label:all")];
  const tabs = [0];
  const headerSubtitle = t("label:allCategories");
  const headerButtonLabel = t("label:createCategory");
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const categoryList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const categoriesListOverviewHeaderRows = [
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: t("label:name"),
      sort: true,
    },
    {
      id: 'description',
      align: 'left',
      disablePadding: false,
      label: t("label:description"),
      sort: true,
    },
    {
      id: 'noOfProducts',
      align: 'right',
      disablePadding: false,
      label: t("label:noOfProducts"),
      sort: true,
    }
  ];

  useEffect(() => {
    CategoryService.categoryList()
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
      tableName={categoriesListOverview}
      headerRows={categoriesListOverviewHeaderRows}
      tableData={categoryList.tableData}
      // tableData={categoriesRow}
      rowDataFields={categoriesListRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      isLoading={isLoading}
    />
  );
}
