
import SendIcon from "@mui/icons-material/Send";
import RedoIcon from '@mui/icons-material/Redo';
import CancelIcon from '@mui/icons-material/Cancel';
import {
    DesktopDatePicker,
    DesktopDateTimePicker,
    LoadingButton,
    TabContext,
    TabList, 
    TabPanel
} from "@mui/lab";
import { Box } from "@mui/system";
import {
    Button,
    Hidden,
    Tab
  } from "@mui/material";

import { useNavigate, useParams} from "react-router-dom";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import ReservationInformation from "./reservationInformation";

const ReservationDetails = () => {
    const { t } = useTranslation();

    const [value, setValue] = React.useState("2");
    const [isLoading, setIsLoading] = useState(true);
    const [info, setInfo] = useState([]);
    const { enqueueSnackbar } = useSnackbar();
    const queryParams = useParams();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        if (isLoading) {
            OrdersService.getOrdersDetailsByUUID(queryParams.uuid)
        .then((res) => {
          let info = res?.data;
          
          setInfo(info);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error) navigate("/reservations");
          enqueueSnackbar(t(`message:${error}`), { variant: "error" });
          setIsLoading(false);
        });
        }
    }, [isLoading]);
    return (
        <>
            <div className="reservation-details-page">
                <div className="reserv-header-click-to-action">
                    <div className=" header-click-to-action">
                        <div className="flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                            <div className="header-text header6  flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                            {t("label:reservationDetails")}
                            </div>
                            { info.status && (
                            <span
                                className={`${
                                info.status.toLowerCase() === "paid"
                                    ? "bg-confirmed"
                                    : info.status.toLowerCase() === "sent" ||
                                    info.status.toLowerCase() === "refund pending" ||
                                    info.status.toLowerCase() === "partial refunded" ||
                                    info.status.toLowerCase() === "refunded"
                                    ? "bg-pending"
                                    : info.status.toLowerCase() === "invoiced"
                                    ? "bg-invoiced"
                                    : "bg-rejected"
                                } rounded-4 px-16 py-4 body3 ml-10`}
                            >
                                {t(`label:${info.translationKey}`)}
                            </span>
                            )}
                        </div>
                        <Hidden smDown>
                            <div className="button-container-product">
                            <Button
                                color="secondary"
                                variant="outlined"
                                className="button-outline-product text-MonochromeGray-700"
                                startIcon={<CancelIcon style={{fill: "#F36562"}} />}
                                onClick={() => setOpen(true)}
                            >
                                {t("label:cancelReservation")}
                            </Button>
                            <LoadingButton
                                color="secondary"
                                variant="contained"
                                className="font-semibold rounded-4 w-full sm:w-auto"
                                type="submit"
                                // disabled={!(isValid && customData.paymentMethod.length)}
                                //disabled="disabled"
                                startIcon={<RedoIcon />}
                                loading={isLoading}
                                loadingPosition="center"
                            >
                                {t("label:resend")}
                            </LoadingButton>
                            </div>
                        </Hidden>
                    </div>
                </div>

                <div className="main-content-wrap custom-tab-order-details my-20 px-20">
                    <TabContext value={value}>
                        <Box sx={{ background: "#F7F7F7" }}>
                            <TabList
                                onChange={handleChange}
                                aria-label="lab API tabs example"
                                TabIndicatorProps={{
                                    style: { background: "#33A0BE", height: "4px" },
                                }}
                                variant="scrollable"
                                scrollButtons
                                allowScrollButtonsMobile
                            >
                                <Tab 
                                    label={ t("label:orderLog") } 
                                    className="subtitle3" 
                                    value="1" 
                                />
                                <Tab
                                    label={ t("label:orderInformation") }
                                    className="subtitle3"
                                    value="2"
                                />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <div className="reservation-log-content py-32 px-0">
                                
                            </div>
                        </TabPanel>
                        <TabPanel value="2" className="py-32 px-0">
                            <ReservationInformation info={info} />
                        </TabPanel>
                    </TabContext>
                </div>
            </div>
        </>
    );
};

export default ReservationDetails;