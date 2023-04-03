import React, {useState, useEffect} from "react";
import {useTranslation} from "react-i18next";
import Hidden from "@mui/material/Hidden";
import OverViewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {reservationOverview} from "../../../components/overview/overviewTable/TablesName";

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
            id: "name",
            align: "left",
            disablePadding: false,
            label: t("label:customerName"),
            sort: true,
        },
    ];

    const preparedData = [];

    useEffect(() => {
        setIsLoading( false );
    }, [isLoading]);

    return (
        <>
            <Hidden smUp>
                <OverViewMainTable 
                    headerSubtitle={headerSubtitle}
                    headerButtonLabel={headerButtonLabel}
                    tableName={reservationOverview}
                    headerRows={overviewHeaderRows}
                    tableData={preparedData}
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
                    tableName={reservationOverview}
                    headerRows={overviewHeaderRows}
                    tableData={preparedData}
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