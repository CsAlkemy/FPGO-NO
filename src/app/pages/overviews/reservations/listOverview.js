import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Hidden from "@mui/material/Hidden";
import {useDispatch, useSelector} from "react-redux";
import OverViewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {reservationListOverview} from "../../../components/overview/overviewTable/TablesName";
import {
    reservationOverviewRowDataFields, 
    reservationOverviewFPAdminRowDataFields
} from "../../../components/overview/overviewTable/RowDataFields"
import { useGetReservationListQuery } from "app/store/api/apiSlice";
import {selectUser} from "app/store/userSlice";
import {FP_ADMIN} from "../../../utils/user-roles/UserRoles";
import ReservationService from "../../../data-access/services/reservationService/reservationService";

const ListOverview = () => {
    const { t } = useTranslation();
    const user = useSelector(selectUser);
    const tabPanelsLabel = [
        t("label:all"),
        t("label:sent"),
        t("label:reserved"),
        t("label:completed"),
        t("label:expired"),
        t("label:cancelled"),
    ];

    const tabs = [0, 1, 2, 3, 4, 5];
    const headerSubtitle = t("label:allReservations");
    const headerButtonLabel = t("label:createReservation");
    const overviewHeaderRows = [
        {
            id: "date",
            align: "left",
            disablePadding: false,
            label: t("label:dateCreated"),
            sort: true,
        },
        {
            id: "id",
            align: "left",
            disablePadding: false,
            label: t("label:reservationId"),
            sort: true,
        },
        {
            id: "customer",
            align: "left",
            disablePadding: false,
            label: t("label:customerName"),
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
            id: "reservedAmount",
            align: "right",
            disablePadding: false,
            label: t("label:reservedAmount"),
            sort: true,
        },
        {
            id: "amountPaid",
            align: "right",
            disablePadding: false,
            label: t("label:amountPaid"),
            sort: true,
        },
        {
            id: "amountInBank",
            align: "right",
            disablePadding: false,
            label: t("label:amountInBank"),
            sort: true,
        },
        {
            id: "status",
            align: "center",
            disablePadding: false,
            label: t("label:status"),
            sort: true,
        },
        {
            id: "options",
            align: "right",
            disablePadding: false,
            label: "",
            sort: false,
        },
    ];

    const overviewHeaderRowsFPAdmin = [
        {
            id: "date",
            align: "left",
            disablePadding: false,
            label: t("label:dateCreated"),
            sort: true,
        },
        {
            id: "id",
            align: "left",
            disablePadding: false,
            label: t("label:reservationId"),
            sort: true,
        },
        {
            id: "clientName",
            align: "left",
            disablePadding: false,
            label: t("label:clientName"),
            sort: true,
        },
        {
            id: "customer",
            align: "left",
            disablePadding: false,
            label: t("label:customerName"),
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
            id: "reservedAmount",
            align: "right",
            disablePadding: false,
            label: t("label:reservedAmount"),
            sort: true,
        },
        {
            id: "amountPaid",
            align: "right",
            disablePadding: false,
            label: t("label:amountPaid"),
            sort: true,
        },
        {
            id: "amountInBank",
            align: "right",
            disablePadding: false,
            label: t("label:amountInBank"),
            sort: true,
        },
        {
            id: "status",
            align: "center",
            disablePadding: false,
            label: t("label:status"),
            sort: true,
        },
        {
            id: "options",
            align: "right",
            disablePadding: false,
            label: "",
            sort: false,
        },
    ];
    const { data, isFetching, isLoading, isSuccess, isError, error, refetch } = useGetReservationListQuery();

    useEffect(() => {
        refetch();
    }, []);

    const preparedData = data?.is_data 
        ? ReservationService.mapReservationList(data.data) : [];

    return (
        <>
            <Hidden smUp>
                <OverViewMainTable 
                    headerSubtitle={headerSubtitle}
                    headerButtonLabel={headerButtonLabel}
                    tableName={reservationListOverview}
                    headerRows={
                        user.role[0] !== FP_ADMIN 
                        ? overviewHeaderRows
                        : overviewHeaderRowsFPAdmin
                    }
                    tableData={preparedData}
                    rowDataFields={
                        user.role[0] !== FP_ADMIN
                        ? reservationOverviewRowDataFields 
                        : reservationOverviewFPAdminRowDataFields
                    }
                    tabPanelsLabel={tabPanelsLabel}
                    tabs={tabs}
                    // isLoading={isLoading}
                    isLoading={isFetching}
                    isMobileScreen={true}
                />
            </Hidden>

            <Hidden smDown>
                <OverViewMainTable 
                    headerSubtitle={headerSubtitle}
                    headerButtonLabel={headerButtonLabel}
                    tableName={reservationListOverview}
                    headerRows={
                        user.role[0] !== FP_ADMIN 
                        ? overviewHeaderRows
                        : overviewHeaderRowsFPAdmin
                    }
                    tableData={preparedData}
                    rowDataFields={
                        user.role[0] !== FP_ADMIN
                        ? reservationOverviewRowDataFields 
                        : reservationOverviewFPAdminRowDataFields
                    }
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

export default ListOverview;