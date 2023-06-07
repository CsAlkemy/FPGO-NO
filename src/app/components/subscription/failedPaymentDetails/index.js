import { Cancel, RedoOutlined } from "@mui/icons-material";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Backdrop, Button, CircularProgress, Hidden, Tab } from "@mui/material";
import { Box } from "@mui/system";
import { selectUser } from "app/store/userSlice";
import React, { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
// import OrderModal from "../popupModal/orderModal";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";

import FailedPaymentInformation from "./failedPaymentInformation";
import FailedPaymentLog from "./failedPaymentLog";
import SubscriptionsService from "../../../data-access/services/subscriptionsService/SubscriptionsService";

const OrderLog = lazy(() => import("./failedPaymentLog"));

const subscriptionDetails = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("2");
  const [headerTitle, setSetHeaderTitle] = React.useState("");
  const [info, setInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();
  const queryParams = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleResendRefundOrder = () => {
    setOpen(true);
    // setSetHeaderTitle(value === "3" ? "Refund Order" : "Resend Order");
    setSetHeaderTitle(
      info.subscription.status &&
        info.subscription.status.toLowerCase() === "paid"
        ? "Refund Order"
        : "Resend Order"
    );
  };

  const handleCancelOrder = () => {
    setOpen(true);
    setSetHeaderTitle("Cancel Subscription");
  };

  useEffect(() => {
    if (isLoading) {
      SubscriptionsService.getFailedPaymentDetailsByUUID(queryParams.uuid)
        .then((res) => {
          let info = res?.data;
          setInfo(info);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error)
            // navigate("/sales/orders-list");
            enqueueSnackbar(t(`message:${error}`), { variant: "error" });
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  return (
    <div>
      {!!isLoading && (
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
            color: "#0088AE",
            background: "white",
          }}
          open={true}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {!isLoading && (
        <div className="create-product-container">
          <div className="inside-div-product">
            <div className="rounded-sm bg-white p-0 md:px-20">
              <div className=" header-click-to-action">
                <div className="flex items-start justify-start w-full sm:w-auto px-16 sm:px-0">
                  <div className="flex flex-col gap-5">
                    <div className="header-text header6 ">
                      {t("label:failedPaymentDetails")}
                    </div>
                    <div className="subtitle3 text-MonochromeGray-300">
                      Subscription ID: {queryParams.uuid}
                    </div>
                  </div>

                  <span
                    className={`my-5 ${
                      info.details.status.toLowerCase() === "paid"
                        ? "bg-confirmed"
                        : info.details.status.toLowerCase() === "sent" ||
                          info.details.status.toLowerCase() ===
                            "refund pending" ||
                          info.details.status.toLowerCase() ===
                            "partial refunded" ||
                          info.details.status.toLowerCase() === "refunded"
                        ? "bg-pending"
                        : info.details.status.toLowerCase() === "invoiced"
                        ? "bg-invoiced"
                        : "bg-rejected"
                    } rounded-4 px-16 py-4 body3 ml-10`}
                  >
                    {t(`label:${info.details.translationKey}`)}
                  </span>
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
                        label={t("label:orderLog")}
                        className="subtitle3"
                        value="1"
                      />
                      <Tab
                        label={t("label:orderInformation")}
                        className="subtitle3"
                        value="2"
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1">
                    <FailedPaymentLog logs={info.logs} details={info.details} />
                  </TabPanel>
                  <TabPanel value="2" className="p-0">
                    <FailedPaymentInformation info={info.details || []} />
                  </TabPanel>
                </TabContext>
              </div>
            </div>
          </div>
          <Hidden smUp>
            <div className="fixed bottom-0 grid grid-cols-1 justify-center items-center gap-10 w-full mb-10 mt-10 px-20">
              {info.details.status &&
                info.details.status.toLowerCase() === "sent" && (
                  <Button
                    color="secondary"
                    variant="outlined"
                    className="bg-white text-MonochromeGray-700 button2 shadow-5 border-0"
                    onClick={() => handleCancelOrder()}
                    startIcon={<Cancel className="text-red-400" />}
                    disabled={user.role[0] === FP_ADMIN}
                  >
                    {t("label:cancelOrder")}
                  </Button>
                )}
              {((info.details.status &&
                info.details.status.toLowerCase() === "sent") ||
                (info.details.status &&
                  info.details.status.toLowerCase() === "paid") ||
                (info.details.status &&
                  info.details.status.toLowerCase() === "invoiced")) && (
                <Button
                  color="secondary"
                  variant="contained"
                  className="rounded-full bg-primary-500 button2 py-5"
                  type="submit"
                  //disabled = {isValid ? true: false }
                  disabled={user.role[0] === FP_ADMIN}
                  startIcon={
                    (info.details.status &&
                      info.details.status.toLowerCase() === "paid") ||
                    (info.details.status &&
                      info.details.status.toLowerCase() === "invoiced") ? (
                      <UTurnLeftIcon className="rotate-90" />
                    ) : (
                      <RedoOutlined />
                    )
                  }
                  onClick={() => handleResendRefundOrder()}
                >
                  {(info.details.status &&
                    info.details.status.toLowerCase() === "paid") ||
                  (info.details.status &&
                    info.details.status.toLowerCase() === "invoiced")
                    ? t("label:refundOrder")
                    : t("label:resendOrder")}
                </Button>
              )}
            </div>
          </Hidden>
        </div>
      )}
    </div>
  );
};

export default subscriptionDetails;
