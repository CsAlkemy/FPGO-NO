import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Hidden from "@mui/material/Hidden";
import OverViewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {reservationListOverview} from "../../../components/overview/overviewTable/TablesName";
import {reservationOverviewRowDataFields} from "../../../components/overview/overviewTable/RowDataFields"

const ListOverview = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
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
            label: t("label:customer"),
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

    const preparedData = [
        {
            uuid: "RSV0001",
            id: "RSV0001",
            date: "7 April 2023",
            customer: "Lutfur rahman",
            phone: "+4753247564",
            email: "lutfur@fpgo.no",
            reservedAmount: 12000,
            amountPaid: "0",
            amountInBank: "0",
            remainingAmount: "0",
            status: 'sent',
            translationKey: "Sent"
        },
        {
            uuid: "RSV0002",
            id: "RSV0002",
            date: "6 April 2023",
            customer: "Alkemy Hossain",
            phone: "+4753247564",
            email: "alkemy@fpgo.no",
            reservedAmount: 12000,
            amountPaid: 8000,
            amountInBank: 8000,
            remainingAmount: 4000,
            status: 'completed',
            translationKey: "Completed"
        },
        {
            uuid: "RSV0003",
            id: "RSV0003",
            date: "6 April 2023",
            customer: "Joni Kumar",
            phone: "+4753247564",
            email: "joni@fpgo.no",
            reservedAmount: 12000,
            amountPaid: 8000,
            amountInBank: 8000,
            remainingAmount: 4000,
            status: 'cancelled',
            translationKey: "Cancelled"
        },
        {
            uuid: "RSV00004",
            id: "RSV00004",
            date: "6 April 2023",
            customer: "Alkemy Hossain",
            phone: "+4753247564",
            email: "alkemy@fpgo.no",
            reservedAmount: 12000,
            amountPaid: 8000,
            amountInBank: 8000,
            remainingAmount: 4000,
            status: 'reserved',
            translationKey: "Reserved"
        },
        {
            uuid: "RSV00005",
            id: "RSV00005",
            date: "6 April 2023",
            customer: "Joni Kumar",
            phone: "+4753247564",
            email: "joni@fpgo.no",
            reservedAmount: 12000,
            amountPaid: 8000,
            amountInBank: 8000,
            remainingAmount: 4000,
            status: 'expired',
            translationKey: "Expired"
        }
    ];

    useEffect(() => {
        setIsLoading( false );
    }, [isLoading]);

    return (
        <>
            <Hidden smUp>
                <OverViewMainTable 
                    headerSubtitle={headerSubtitle}
                    headerButtonLabel={headerButtonLabel}
                    tableName={reservationListOverview}
                    headerRows={overviewHeaderRows}
                    tableData={preparedData}
                    rowDataFields={reservationOverviewRowDataFields}
                    tabPanelsLabel={tabPanelsLabel}
                    tabs={tabs}
                    isLoading={isLoading}
                    // isLoading={isFetching}
                    isMobileScreen={true}
                />
            </Hidden>

            <Hidden smDown>
                <OverViewMainTable 
                    headerSubtitle={headerSubtitle}
                    headerButtonLabel={headerButtonLabel}
                    tableName={reservationListOverview}
                    headerRows={overviewHeaderRows}
                    tableData={preparedData}
                    rowDataFields={reservationOverviewRowDataFields}
                    tabPanelsLabel={tabPanelsLabel}
                    tabs={tabs}
                    isLoading={isLoading}
                    // isLoading={isFetching}
                    isMobileScreen={false}
                />
            </Hidden>
        </>
    );
}

export default ListOverview;