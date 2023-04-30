import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {
  subscriptionsListOverview
} from "../../../components/overview/overviewTable/TablesName";
import {
  subscriptionsListOverviewRowDataFields
} from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useTranslation } from 'react-i18next';
import { useGetCustomersListQuery, useGetOrdersListQuery } from 'app/store/api/apiSlice';
import Hidden from '@mui/material/Hidden';
import SubscriptionsService from "../../../data-access/services/subscriptionsService/SubscriptionsService";

export default function SubscriptionsListOverview() {
  const {t} = useTranslation()
  const tabPanelsLabel = [t("label:all"), t("label:sent"), t("label:onGoing"), t("label:completed"), t("label:cancelled")];
  const tabs = [0, 1, 2, 3, 4];
  const headerSubtitle = t("label:allSubscriptions");
  const headerButtonLabel = t("label:createSubscription");
  const dispatch = useDispatch();
  const subscriptionsList = useSelector((state) => state.overviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();
  // const {data, isFetching, isLoading, isSuccess, isError, error, refetch} = useGetCustomersListQuery();
  const subscriptionsListHeaderRows = [
    {
      id: 'date',
      align: 'left',
      disablePadding: false,
      label: t("label:dateCreated"),
      sort: true,
    },
    {
      id: 'id',
      align: 'left',
      disablePadding: false,
      label: t("label:subscriptionId"),
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
      id: 'paymentsMade',
      align: 'left',
      disablePadding: false,
      label: t("label:paymentsMade"),
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
      id: 'stage',
      align: 'center',
      disablePadding: false,
      label: t("label:status"),
      sort: true,
    },
    {
      id: "refundResend",
      align: "right",
      disablePadding: false,
      label: "",
      sort: false,
    },
    {
      id: "cancel",
      align: "right",
      disablePadding: false,
      label: "",
      sort: false,
    },
  ];

  // useEffect(()=> {
  //   refetch()
  // },[])

  // const preparedData = data?.is_data ?  SubscriptionsService.mapSubscriptionsList(data.data) : []
  const preparedData = SubscriptionsService.mapSubscriptionsList([
    {
      uuid : "ODR4238196457",
      date : "12.08.2022",
      id : "3852300", //From table body, sending id as uuid, need to set uuid as id at api res or change the row.id to row.uuid
      name : "Gudmund Tharaldson",
      countryCode : "+47",
      msisdn : "990 65 708",
      paymentsMade : "0/12",
      amount : "10,000",
      status : "SENT",
      isPaid : false,
      translationKey : "sent"
    },
    {
      uuid : "ODR4238196457",
      date : "12.08.2022",
      id : "3725688",
      name : "Norske Skogindustrier ASA",
      countryCode : "+47",
      msisdn : "990 65 708",
      paymentsMade : "6/6",
      amount : "10,000",
      status : "Completed",
      isPaid : true,
      translationKey : "completed"
    },
    {
      uuid : "ODR4238196457",
      date : "12.08.2022",
      id : "4896116",
      name : "Norske ConocoPhillips AS",
      countryCode : "+47",
      msisdn : "990 65 708",
      paymentsMade : "21/36",
      amount : "10,000",
      status : "On Going",
      isPaid : true,
      translationKey : "onGoing"
    },
    {
      uuid : "ODR4238196457",
      date : "12.08.2022",
      id : "4233735",
      name : "Trond Hoyland",
      countryCode : "+47",
      msisdn : "990 65 708",
      paymentsMade : "0/3",
      amount : "10,000",
      status : "Cancelled",
      isPaid : false,
      translationKey : "cancelled"
    },
    {
      uuid : "ODR4238196457",
      date : "12.08.2022",
      id : "3146789",
      name : "ConocoPhillips Norge",
      countryCode : "+47",
      msisdn : "990 65 708",
      paymentsMade : "6/12",
      amount : "10,000",
      status : "Cancelled",
      isPaid : true,
      translationKey : "cancelled"
    },
  ])

  return (
    <>
      <Hidden smUp>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={subscriptionsListOverview}
          headerRows={subscriptionsListHeaderRows}
          // tableData={data?.is_data ? preparedData : []}
          tableData={preparedData}
          rowDataFields={subscriptionsListOverviewRowDataFields}
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          // isLoading={isFetching}
          isLoading={false}
          isMobileScreen={true}
        />
      </Hidden>
      <Hidden smDown>
        <OverviewMainTable
          headerSubtitle={headerSubtitle}
          headerButtonLabel={headerButtonLabel}
          tableName={subscriptionsListOverview}
          headerRows={subscriptionsListHeaderRows}
          tableData={preparedData}
          rowDataFields={subscriptionsListOverviewRowDataFields}
          tabPanelsLabel={tabPanelsLabel}
          tabs={tabs}
          // isLoading={isFetching}
          isLoading={false}
          isMobileScreen={false}
        />
      </Hidden>
    </>
  );
}
