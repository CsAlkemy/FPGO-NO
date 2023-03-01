import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import { producstListHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import { productsListOverview } from "../../../components/overview/overviewTable/TablesName";
import { productsListRowDataFields } from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import ProductService from "../../../data-access/services/productsService/ProductService";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';
import { useGetProductsListQuery } from 'app/store/api/apiSlice';
import Hidden from '@mui/material/Hidden';

export default function ProductOverview() {
  const {t} = useTranslation()
  const tabPanelsLabel = [t("label:all"), t("label:active"), t("label:inactive")];
  const tabs = [0, 1, 2];
  const headerSubtitle = t("label:allProduct");
  const headerButtonLabel = t("label:createProduct");
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const productList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const {data, isFetching, isLoading, isSuccess, isError, error, refetch} = useGetProductsListQuery()
  const producstListHeaderRows = [
    {
      id: 'id',
      align: 'left',
      disablePadding: false,
      label: t("label:productId"),
      sort: true,
    },
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: t("label:productName"),
      sort: true,
    },
    {
      id: 'type',
      align: 'left',
      disablePadding: false,
      label: t("label:type"),
      sort: true,
    },
    {
      id: 'category',
      align: 'left',
      disablePadding: false,
      label: t("label:category"),
      sort: true,
    },
    {
      id: 'unit',
      align: 'left',
      disablePadding: false,
      label: t("label:unit"),
      sort: true,
    },
    {
      id: 'pricePerUnit',
      align: 'left',
      disablePadding: false,
      label: t("label:pricePerUnit"),
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
    refetch();
  }, []);

  const preparedData = data?.is_data ?  ProductService.mapProductsList(data.data) : []

  return (
    <>
      <Hidden smUp>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={productsListOverview}
          headerRows={producstListHeaderRows}
          // tableData={productList.tableData}
          tableData={data?.is_data ? preparedData : []}
          // tableData={productListRows}
          rowDataFields={productsListRowDataFields}
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          isLoading={isFetching}
          // isLoading={isLoading}
          isMobileScreen={true}
        />
      </Hidden>
      <Hidden smDown>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={productsListOverview}
          headerRows={producstListHeaderRows}
          // tableData={productList.tableData}
          tableData={data?.is_data ? preparedData : []}
          // tableData={productListRows}
          rowDataFields={productsListRowDataFields}
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          isLoading={isFetching}
          // isLoading={isLoading}
          isMobileScreen={false}
        />
      </Hidden>
    </>
  );
}
