
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

import { useNavigate} from "react-router-dom";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const ReservationDetails = () => {
    const { t } = useTranslation();

    const [value, setValue] = React.useState("2");
    const [loading, setLoading] = useState(false);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <>
            <div className="reservation-details-page">
                <div className="reserv-header-click-to-action">
                    <div className=" header-click-to-action">
                        <div className="flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                            <div className="header-text header6  flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                            {t("label:reservationDetails")}
                            </div>
                            <span className="bg-pending rounded-4 px-16 py-4 body3 ml-10">
                                {t("label:sent")}
                            </span>
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
                                loading={loading}
                                loadingPosition="center"
                            >
                                {t("label:resendOrder")}
                            </LoadingButton>
                            </div>
                        </Hidden>
                    </div>
                </div>

                <div className="my-20 custom-tab-order-details">
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
                            OrderLog
                        </TabPanel>
                        <TabPanel value="2" className="py-20 px-0">
                            order info
                        </TabPanel>
                    </TabContext>
                </div>
            </div>
        </>
    );
};

export default ReservationDetails;