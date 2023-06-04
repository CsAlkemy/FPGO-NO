import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {
  failedPaymentsListOverview,
  subscriptionsListOverview
} from "../../../components/overview/overviewTable/TablesName";
import {
  failedPaymentsListOverviewRowDataFields,
  subscriptionsListOverviewRowDataFields
} from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';
import { useGetFailedSubscriptionsListQuery, useGetOrdersListQuery } from 'app/store/api/apiSlice';
import Hidden from '@mui/material/Hidden';
import SubscriptionsService from "../../../data-access/services/subscriptionsService/SubscriptionsService";

export default function FailedPaymentsListOverview() {
  const {t} = useTranslation()
  const tabPanelsLabel = [t("label:all"), t("label:paid"), t("label:invoiced"), t("label:debtCollection")];
  const tabs = [0, 1, 2, 3];
  const headerSubtitle = t("label:failedSubscriptionPayments");
  const headerButtonLabel = t("label:createSubscription");
  const dispatch = useDispatch();
  const subscriptionsList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  const {data, isFetching, isLoading, isSuccess, isError, error, refetch} = useGetFailedSubscriptionsListQuery();
  const failedPaymentsListHeaderRows = [
    {
      id: 'date',
      align: 'left',
      disablePadding: false,
      label: t("label:dateCreated"),
      sort: true,
    },
    {
      id: 'orderId',
      align: 'left',
      disablePadding: false,
      label: t("label:orderId"),
      sort: true,
    },
    {
      id: 'name',
      align: 'left',
      disablePadding: false,
      label: t("label:customerName"),
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
      id: 'subscriptionId',
      align: 'left',
      disablePadding: false,
      label: t("label:subscriptionId"),
      sort: true,
    },
    {
      id: 'amount',
      align: 'left',
      disablePadding: false,
      label: t("label:amount"),
      sort: true,
    },
    {
      id: 'status',
      align: 'center',
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    }
  ];

  useEffect(()=> {
    refetch()
  },[])

  const preparedData = data?.is_data ?  SubscriptionsService.mapFailedPaymentsList(data.data) : []
  // const preparedData = SubscriptionsService.mapFailedPaymentsList([
  //   {
  //     uuid : "UUID0001",
  //     date : "12.08.2022",
  //     orderId : "3852300",
  //     name : "Gudmund Tharaldson",
  //     countryCode : "+47",
  //     msisdn : "486 57 844",
  //     subscriptionId : "7107210",
  //     amount : "500",
  //     status : "INVOICED",
  //     translationKey : "invoiced"
  //   },
  //   {
  //     uuid : "UUID0002",
  //     date : "12.08.2022",
  //     orderId : "3725688",
  //     name : "Gudmund Tharaldson",
  //     countryCode : "+47",
  //     msisdn : "486 57 844",
  //     subscriptionId : "5623311",
  //     amount : "578",
  //     status : "Paid",
  //     translationKey : "paid"
  //   },
  //   {
  //     uuid : "UUID0003",
  //     date : "12.08.2022",
  //     orderId : "4896116",
  //     name : "Norske ConocoPhillips AS",
  //     countryCode : "+47",
  //     msisdn : "486 57 844",
  //     subscriptionId : "7607076",
  //     amount : "200",
  //     status : "INVOICED",
  //     translationKey : "invoiced"
  //   },
  //   {
  //     uuid : "UUID0004",
  //     date : "12.08.2022",
  //     orderId : "4233735",
  //     name : "Trond Hoyland",
  //     countryCode : "+47",
  //     msisdn : "486 57 844",
  //     subscriptionId : "8797379",
  //     amount : "2000",
  //     status : "Debt Collection",
  //     translationKey : "debtCollection"
  //   },
  // ])

  return (
    <>
      <Hidden smUp>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={failedPaymentsListOverview}
          headerRows={failedPaymentsListHeaderRows}
          tableData={data?.is_data ? preparedData : []}
          rowDataFields={failedPaymentsListOverviewRowDataFields}
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          isLoading={isFetching}
          isMobileScreen={true}
        />
      </Hidden>
      <Hidden smDown>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={failedPaymentsListOverview}
          headerRows={failedPaymentsListHeaderRows}
          tableData={preparedData}
          rowDataFields={failedPaymentsListOverviewRowDataFields}
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          isLoading={isFetching}
          isMobileScreen={false}
        />
      </Hidden>
    </>
  );
}
