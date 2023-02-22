import { Cancel, RedoOutlined } from "@mui/icons-material";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Backdrop, Button, CircularProgress, Hidden, Tab } from "@mui/material";
import { Box } from "@mui/system";
import { selectUser } from "app/store/userSlice";
import React, { lazy, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FP_ADMIN } from "../../../../utils/user-roles/UserRoles";
import OrderModal from "../popupModal/orderModal";
import { useTranslation } from "react-i18next";
import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";

import OrderInformation from "../orderDetails/orderInformation";

const OrderLog = lazy(() => import("../orderDetails/orderLog"));
const OrderReceipt = lazy(() => import("../orderDetails/orderReceipt"));

const createOrder = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("1");
  const [headerTitle, setSetHeaderTitle] = React.useState("");
  const [info, setInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();
  const queryParams = useParams();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleResendRefundOrder = () => {
    setOpen(true);
    // setSetHeaderTitle(value === "3" ? "Refund Order" : "Resend Order");
    setSetHeaderTitle(
      info.status.toLowerCase() === "paid" ? "Refund Order" : "Resend Order"
    );
  };

  const handleCancelOrder = () => {
    setOpen(true);
    setSetHeaderTitle("Cancel Order");
  };

  useEffect(() => {
    if (isLoading) {
      OrdersService.getOrdersDetailsByUUID(queryParams.uuid)
        .then((res) => {
          setInfo(res?.data);
          setIsLoading(false);
        })
        .catch((error) => {
          if (error) navigate("/sales/orders-list");
          enqueueSnackbar(error, { variant: "error" });
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
                <div className="flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                  <div className="header-text header6 ">
                    {t("label:orderDetails")}
                  </div>
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
                    {info.status.charAt(0).toUpperCase() +
                      info.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <Hidden smDown>
                  <div className="button-container-product">
                    {info.status.toLowerCase() === "sent" && (
                      <Button
                        color="secondary"
                        variant="outlined"
                        className="button-outline-product text-MonochromeGray-700"
                        onClick={() => handleCancelOrder()}
                        startIcon={<Cancel className="text-red-400" />}
                        disabled={user.role[0] === FP_ADMIN}
                      >
                        {t("label:cancelOrder")}
                      </Button>
                    )}
                    {(info.status.toLowerCase() === "sent" ||
                      info.status.toLowerCase() === "paid") && (
                      <Button
                        color="secondary"
                        variant="contained"
                        className="font-semibold rounded-4 w-full sm:w-auto"
                        type="submit"
                        //disabled = {isValid ? true: false }
                        disabled={user.role[0] === FP_ADMIN}
                        startIcon={
                          info.status.toLowerCase() === "paid" ? (
                            <UTurnLeftIcon className="rotate-90" />
                          ) : (
                            <RedoOutlined />
                          )
                        }
                        onClick={() => handleResendRefundOrder()}
                      >
                        {info.status.toLowerCase() === "paid"
                          ? t("label:refundOrder")
                          : t("label:resendOrder")}
                      </Button>
                    )}
                  </div>
                </Hidden>
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
                        label="Order Information"
                        className="subtitle3"
                        value="1"
                      />
                      <Tab label="Order Log" className="subtitle3" value="2" />
                      <Tab
                        label="Order Receipt"
                        className="subtitle3"
                        value="3"
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="1" className="py-20 px-0">
                    <OrderInformation info={info} />
                  </TabPanel>
                  <TabPanel value="2">
                    <OrderLog info={info} />
                  </TabPanel>
                  <TabPanel value="3" className="py-20 px-0">
                    <OrderReceipt info={info} />
                  </TabPanel>
                </TabContext>
              </div>
            </div>
          </div>
          <Hidden smUp>
            <div className="fixed bottom-0 grid grid-cols-1 justify-center items-center gap-10 w-full mb-10 mt-10 px-20">
              {info.status.toLowerCase() === "sent" && (
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
              {(info.status.toLowerCase() === "sent" ||
                info.status.toLowerCase() === "paid" ||
                info.status.toLowerCase() === "invoiced") && (
                <Button
                  color="secondary"
                  variant="contained"
                  className="rounded-full bg-primary-500 button2 py-5"
                  type="submit"
                  //disabled = {isValid ? true: false }
                  disabled={user.role[0] === FP_ADMIN}
                  startIcon={
                    info.status.toLowerCase() === "paid" ||
                    info.status.toLowerCase() === "invoiced" ? (
                      <UTurnLeftIcon className="rotate-90" />
                    ) : (
                      <RedoOutlined />
                    )
                  }
                  onClick={() => handleResendRefundOrder()}
                >
                  {info.status.toLowerCase() === "paid" ||
                  info.status.toLowerCase() === "invoiced"
                    ? t("label:refundOrder")
                    : t("label:resendOrder")}
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
            orderAmount={info.orderSummary.grandTotal}
            customerPhone={
              info.customerDetails.countryCode && info.customerDetails.msisdn
                ? info.customerDetails.countryCode + info.customerDetails.msisdn
                : ""
            }
            customerEmail={info.customerDetails.email}
          />
        </div>
      )}
    </div>
  );
};

export default createOrder;
