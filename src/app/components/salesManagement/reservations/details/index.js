//import SendIcon from "@mui/icons-material/Send";
import RedoIcon from "@mui/icons-material/Redo";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import OrderModal from "../../order/popupModal/orderModal";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import { Box } from "@mui/system";
import { Button, Hidden, Tab, Backdrop, CircularProgress } from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import ReservationInformation from "./reservationInformation";
import ReservationLog from "./reservationLog";
import { selectUser } from "app/store/userSlice";
import { FP_ADMIN } from "../../../../utils/user-roles/UserRoles";

const ReservationDetails = () => {
  const { t } = useTranslation();

  const [value, setValue] = React.useState("2");
  const [isLoading, setIsLoading] = useState(true);
  const [info, setInfo] = useState({ status: "" });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const queryParams = useParams();
  const user = useSelector(selectUser);

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [headerTitle, setHeaderTitle] = useState();
  const [amountBank, setAmountBank] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleModalOpen = (decision) => {
    setOpen(true);
    setAnchorEl(null);
    setRemainingAmount(null);
    setAmountBank(null);

    if (decision === "resendReservations") setHeaderTitle("Resend Reservation");
    if (decision === "cancelReservation") setHeaderTitle("Cancel Reservation");
    if (decision === "chargeFromCard") {
      setHeaderTitle("Charge Amount");
      //setAmountBank(data.amountInBank);
    }
    if (decision === "capturePayments") {
      setHeaderTitle("Capture Payment");
      //setRemainingAmount(data.remainingAmount);
    }
    if (decision === "refundReservation") {
      setHeaderTitle("Refund from Reservation");
      //setAmountBank(data.amountInBank);
    }
    if (decision === "completeReservation") {
      setHeaderTitle("Complete Reservation");
      //setAmountBank(data.amountInBank);
    }
  };

  useEffect(() => {
    if (isLoading) {
      OrdersService.getOrdersDetailsByUUID(queryParams.uuid)
        .then((res) => {
          let info = res?.data;
          //info.status = 'completed';
          //info.status = 'paid';
          //info.isPaid = true;

          setInfo(info);
          setIsLoading(false);
          console.log();
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
        <div className="reservation-details-page">
          <div className="reserv-header-click-to-action">
            <div className=" header-click-to-action">
              <div className="flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                <div className="header-text header6  flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                  {t("label:reservationDetails")}
                </div>
                {info.status && (
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
                  {(info.status.toLowerCase() === "sent" ||
                    (info.status.toLowerCase() === "reserved" &&
                      info?.isPaid == false)) && (
                    <Button
                      color="secondary"
                      variant="outlined"
                      className="button-outline-product text-MonochromeGray-700"
                      startIcon={<CancelIcon style={{ fill: "#F36562" }} />}
                      onClick={() => handleModalOpen("cancelReservation")}
                    >
                      {t("label:cancelReservation")}
                    </Button>
                  )}
                  {info.status.toLowerCase() === "sent" && (
                    <LoadingButton
                      color="secondary"
                      variant="contained"
                      className="font-semibold rounded-4 w-full sm:w-auto"
                      // disabled={!(isValid && customData.paymentMethod.length)}
                      //disabled="disabled"
                      startIcon={<RedoIcon />}
                      loading={isLoading}
                      loadingPosition="center"
                      onClick={() => {
                        handleModalOpen("resendReservations");
                      }}
                    >
                      {t("label:resend")}
                    </LoadingButton>
                  )}
                  {info.status.toLowerCase() === "reserved" &&
                    info?.isPaid == true && (
                      <Button
                        color="secondary"
                        variant="contained"
                        className="font-semibold rounded-4 w-full sm:w-auto"
                        disabled={user.role[0] === FP_ADMIN}
                        startIcon={<DoneAllIcon className="" />}
                        onClick={() => handleModalOpen("completeReservation")}
                      >
                        {t("label:complete")}
                      </Button>
                    )}
                  {info.status.toLowerCase() === "paid" && (
                    <Button
                      color="secondary"
                      variant="contained"
                      className="font-semibold rounded-4 w-full sm:w-auto"
                      type="submit"
                      disabled={user.role[0] === FP_ADMIN}
                      startIcon={<UTurnLeftIcon className="rotate-90" />}
                      onClick={() => handleModalOpen("refundReservation")}
                    >
                      {t("label:refund")}
                    </Button>
                  )}
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
                    label={t("label:reservationLog")}
                    className="subtitle3"
                    value="1"
                  />
                  <Tab
                    label={t("label:reservationDetails")}
                    className="subtitle3"
                    value="2"
                  />
                </TabList>
              </Box>
              <TabPanel value="1">
                <ReservationLog info={info} handleModalOpen={handleModalOpen} />
              </TabPanel>
              <TabPanel value="2" className="py-32 px-0">
                <ReservationInformation info={info} />
              </TabPanel>
            </TabContext>
          </div>

          <Hidden smUp>
            <div className="button-container-product-mobile fixed bottom-0 grid grid-cols-1 justify-center items-center gap-10 w-full mb-10 mt-10 px-20">
              {(info.status.toLowerCase() === "sent" ||
                (info.status.toLowerCase() === "reserved" &&
                  info?.isPaid == false)) && (
                <Button
                  color="secondary"
                  variant="outlined"
                  className="bg-white text-MonochromeGray-700 button2 shadow-5 border-0"
                  startIcon={<CancelIcon style={{ fill: "#F36562" }} />}
                  onClick={() => handleModalOpen("cancelReservation")}
                >
                  {t("label:cancel")}
                </Button>
              )}
              {info.status.toLowerCase() === "sent" && (
                <LoadingButton
                  color="secondary"
                  variant="contained"
                  className="rounded-full bg-primary-500 button2 py-5"
                  // disabled={!(isValid && customData.paymentMethod.length)}
                  //disabled="disabled"
                  startIcon={<RedoIcon />}
                  loading={isLoading}
                  loadingPosition="center"
                  onClick={() => {
                    handleModalOpen("resendReservations");
                  }}
                >
                  {t("label:resend")}
                </LoadingButton>
              )}
              {info.status.toLowerCase() === "reserved" &&
                info?.isPaid == true && (
                  <Button
                    color="secondary"
                    variant="contained"
                    className="rounded-full bg-primary-500 button2 py-5"
                    disabled={user.role[0] === FP_ADMIN}
                    startIcon={<DoneAllIcon className="" />}
                    onClick={() => handleModalOpen("completeReservation")}
                  >
                    {t("label:complete")}
                  </Button>
                )}
              {info.status.toLowerCase() === "paid" && (
                <Button
                  color="secondary"
                  variant="contained"
                  className="font-semibold rounded-4 w-full sm:w-auto"
                  type="submit"
                  disabled={user.role[0] === FP_ADMIN}
                  startIcon={<UTurnLeftIcon className="rotate-90" />}
                  onClick={() => handleModalOpen("refundReservation")}
                >
                  {t("label:refund")}
                </Button>
              )}
            </div>
          </Hidden>
          <OrderModal
            open={open}
            setOpen={setOpen}
            headerTitle={headerTitle}
            orderId={info.orderUuid}
            orderName={info.customerDetails.name}
            //orderAmount={data.reservedAmount}
            customerPhone={
              info.customerDetails.countryCode + info.customerDetails.msisdn
            }
            customerEmail={info.customerDetails.email}
            //amountInBank={amountBank}
            //remainingAmount={remainingAmount}
          />
        </div>
      )}
    </>
  );
};

export default ReservationDetails;
