import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import { customersListHeaderRows } from "../../../components/overview/overviewTable/HeaderRows";
import { customersListOverview } from "../../../components/overview/overviewTable/TablesName";
import { customersListRowDataFields } from "../../../components/overview/overviewTable/RowDataFields";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import { useDispatch, useSelector } from "react-redux";
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';
import { useGetCustomersListQuery, useGetOrdersListQuery } from 'app/store/api/apiSlice';
import OrdersService from '../../../data-access/services/ordersService/OrdersService';

export default function CustomersListOverview() {
  const {t} = useTranslation()
  const tabPanelsLabel = [t("label:all"), t("label:corporate"), t("label:private"), t("label:active"), t("label:inactive")];
  const tabs = [0, 1, 2, 3, 4];
  const headerSubtitle = t("label:allCustomers");
  const headerButtonLabel = t("label:createCustomer");
  // const [data, setData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const customersList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const {data, isFetching, isLoading, isSuccess, isError, error} = useGetCustomersListQuery()
  const customersListHeaderRows = [
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: t("label:customerName"),
      sort: true,
    },
    {
      id: 'orgIdOrPNumber',
      align: 'left',
      disablePadding: false,
      label: t("label:orgIdPNumber"),
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
      id: 'email',
      align: 'left',
      disablePadding: false,
      label: t("label:email"),
      sort: true,
    },
    {
      id: 'lastInvoicedOn',
      align: 'left',
      disablePadding: false,
      label: t("label:lastInvoicedOn"),
      sort: true,
    },
    {
      id: 'lastOrderAmount',
      align: 'right',
      disablePadding: false,
      label: t("label:lastOrderAmount"),
      sort: true,
    }
  ];

  // useEffect(() => {
  //   CustomersService.customersList()
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
  //       if (isLoading) enqueueSnackbar(e, { variant: "error" });
  //       setIsLoading(false);
  //       dispatch(setOverviewMainTableDataSlice([]));
  //     });
  // }, [isLoading]);

  const preparedData = data?.is_data ?  CustomersService.mapCustomersList(data.data) : []

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitle}
      headerButtonLabel={headerButtonLabel}
      tableName={customersListOverview}
      headerRows={customersListHeaderRows}
      // tableData={customersList.tableData}
      tableData={data?.is_data ? preparedData : []}
      rowDataFields={customersListRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      // isLoading={isLoading}
      isLoading={isFetching}
    />
  );
}
