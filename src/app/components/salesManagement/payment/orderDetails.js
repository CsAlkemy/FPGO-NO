import { Button, Hidden, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { BsQuestionCircle } from "react-icons/bs";
import PaymentHeader from "./paymentHeader";
import { useNavigate, useParams } from "react-router-dom";
import { Fingerprint } from "@mui/icons-material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { ThousandSeparator } from "../../../utils/helperFunctions";

const orderDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const param = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);

  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  window.addEventListener("scroll", toggleVisible);

  useEffect(() => {
    OrdersService.getPaymentLinkOpenStatus(param.uuid)
      .then((response) => {
        // if (response?.status_code === 202) {
        //   console.log(response?.data);
        // }
        // setIsLoading(false);
      })
      .catch((e) => {});
  }, [isLoading]);

  useEffect(() => {
    OrdersService.getOrdersDetailsByUUIDPayment(param.uuid)
      .then((response) => {
        if (response?.status_code === 200 && response?.is_data) {
          if (response?.data?.status !== "SENT") return navigate("404");
          setOrderDetails(response.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        // enqueueSnackbar(e, { variant: "error" });
        return navigate("404");
      });
  }, [isLoading]);

  return (
    <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl my-32">
      <div className="flex-auto mx-auto  w-full md:w-4/5 lg:w-3/4 xl:w-7/12">
        <div className="order-receipt-container">
          <PaymentHeader />
          <div className="pt-32 pb-20 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="subtitle1 text-MonochromeGray-700 ">
              {t("label:orderDetails")}
            </div>
            <div>
              <div className="subtitle1 text-MonochromeGray-700 ">
                {orderDetails?.customerDetails?.name || "_"}
              </div>
              <div className="subtitle3 text-MonochromeGray-300 my-10">
                {t("label:orderNo")}. {param.uuid}
              </div>
            </div>
            
          </div>
          <Hidden mdDown>
            <div>
              <div className="my-10 product-list-grid-container-payment product-list-grid-container-height bg-primary-25 subtitle3 gap-10 px-10">
                <div className="my-auto text-MonochromeGray-500">SL.</div>
                <div className="my-auto text-MonochromeGray-500">
                  {t("label:productName")}
                </div>
                <div className="my-auto text-MonochromeGray-500">
                  {t("label:productId")}
                </div>
                <div className="my-auto text-right text-MonochromeGray-500">
                  {t("label:qty")}.
                </div>
                <div className="my-auto text-right text-MonochromeGray-500">
                  {t("label:rate")}
                </div>
                <div className="my-auto text-right text-MonochromeGray-500">
                  {t("label:discount")}
                </div>
                <div className="my-auto text-right text-MonochromeGray-500">
                  {t("label:tax")}
                </div>
                <div className="my-auto text-right text-MonochromeGray-500">
                  {t("label:amount")}
                </div>
                <div className="my-auto"></div>
              </div>
              {orderDetails?.productList &&
                orderDetails?.productList.length &&
                orderDetails?.productList.map((row, index) => (
                  <div
                    key={index}
                    className="product-list-grid-container-payment  gap-10 px-10 body4 border-b-1 border-MonochromeGray-50"
                  >
                    <div className="my-auto py-16 px-10 ">{index + 1}.</div>
                    <div className="my-auto py-16 px-10 ">{row.name}</div>
                    <div className="my-auto py-16 px-10">{row.productId}</div>
                    <div className="my-auto py-16 px-10 text-right">
                      {row.quantity}
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      {t("label:nok")} { ThousandSeparator(row.rate) }
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      { ThousandSeparator(row.discount) }
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      { row.tax >0 ? ThousandSeparator(row.tax ) : row.tax } % {t("label:vat")}
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      {t("label:nok")} { ThousandSeparator(row.amount) }
                    </div>
                  </div>
                ))}
            </div>
          </Hidden>
          <Hidden mdUp>
            {orderDetails?.productList &&
              orderDetails?.productList?.length &&
              orderDetails?.productList.map((row, index) => (
                <div
                  key={row.id}
                  className={`p-20 border-1 border-MonochromeGray-100  ${
                    row.id === 1 ? "rounded-t-8" : "border-t-0"
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center subtitle2 text-MonochromeGray-700 pb-10 border-b-1 border-MonochromeGray-50">
                      <div>{index + 1}</div>
                      <div>
                        {t("label:nok")} { ThousandSeparator(row.amount) }
                      </div>
                    </div>
                    <div className="flex flex-col gap-10 mt-20">
                      <div className="grid grid-cols-2 justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:productName")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {row.name}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:productId")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {row.productId}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:quantity")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {row.quantity}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:rate")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")} { ThousandSeparator(row.rate) }
                        </div>
                      </div>

                      <div className="grid grid-cols-2 justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:discount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")} { ThousandSeparator(row.discount) }
                        </div>
                      </div>

                      <div className="grid grid-cols-2 justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          Tax
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          { ThousandSeparator(row.tax) } % {t("label:vat")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Hidden>
          <div className="grid grid-cols-1 md:grid-cols-3 my-32">
            <div className="col-span-2 order-2 md:order-1">
              {orderDetails?.invoiceReferences &&
                (orderDetails?.invoiceReferences?.customerNotes ||
                  orderDetails?.invoiceReferences?.termsAndCondition ||
                  orderDetails?.invoiceReferences?.referenceNumber ||
                  orderDetails?.invoiceReferences?.customerReference) && (
                  <div className="flex flex-col gap-20 mb-32">
                    {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.referenceNumber && (
                        <div className="flex flex-col gap-2">
                          <div className="body4 text-MonochromeGray-300">
                            {t("label:referenceNo")}
                          </div>
                          <div className="body3  text-MonochromeGray-700 w-3/4">
                            {orderDetails?.invoiceReferences?.referenceNumber}
                          </div>
                        </div>
                      )}
                    {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.customerReference && (
                        <div className="flex flex-col gap-2">
                          <div className="body4 text-MonochromeGray-300">
                            {t("label:customerReference")}
                          </div>
                          <div className="body3  text-MonochromeGray-700 w-3/4">
                            {orderDetails?.invoiceReferences?.customerReference}
                          </div>
                        </div>
                      )}
                    {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.receiptNumber && (
                        <div className="flex flex-col gap-2">
                          <div className="body4 text-MonochromeGray-300">
                            {t("label:receiptNo")}
                          </div>
                          <div className="body3  text-MonochromeGray-700 w-3/4">
                            {orderDetails?.invoiceReferences?.receiptNumber}
                          </div>
                        </div>
                      )}
                    {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.customerNotes && (
                        <div className="flex flex-col gap-2">
                          <div className="body4 text-MonochromeGray-300">
                            {t("label:customerNotes")}
                          </div>
                          <div className="body3  text-MonochromeGray-700 w-3/4">
                            {orderDetails?.invoiceReferences?.customerNotes}
                          </div>
                        </div>
                      )}
                    {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.termsAndCondition && (
                        <div className="flex flex-col gap-2">
                          <div className="body4 text-MonochromeGray-300">
                            {t("label:tnc")}
                          </div>
                          <div className="body3  text-MonochromeGray-700 w-3/4">
                            {orderDetails?.invoiceReferences?.termsAndCondition}
                          </div>
                        </div>
                      )}
                  </div>
                )}
            </div>
            <div className="order-1 md:order-2">
              <Hidden mdDown>
                <div className="px-32 bg-white">
                  <div className="flex justify-between items-center  my-20 body4 text-MonochromeGray-700">
                    <div className="body3">{t("label:subTotal")}</div>
                    <div className="body3">
                      {t("label:nok")}{" "}
                      {orderDetails?.orderSummary?.subTotal
                        ? ThousandSeparator(orderDetails?.orderSummary?.subTotal)
                        : 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center  my-20">
                    <div className="body3">{t("label:discount")}</div>
                    <div className="body3">
                      {t("label:nok")}{" "}
                      {orderDetails?.orderSummary?.discount
                        ? ThousandSeparator(orderDetails?.orderSummary?.discount)
                        : 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center  my-20 border-b-1 border-MonochromeGray-300">
                    <div className="body3">{t("label:tax")}</div>
                    <div className="body3">
                      {t("label:nok")}{" "}
                      {orderDetails?.orderSummary?.tax
                        ? ThousandSeparator(orderDetails?.orderSummary?.tax)
                        : 0}
                    </div>
                  </div>
                  <div className="flex justify-between items-center  mb-20 body4 font-700">
                    <div className="body3 font-700" >{t("label:grandTotal")}</div>
                    <div className="body3 font-700">
                      {t("label:nok")}{" "}
                      {orderDetails?.orderSummary?.grandTotal
                        ? ThousandSeparator(orderDetails?.orderSummary?.grandTotal)
                        : ""}
                    </div>
                  </div>
                </div>
              </Hidden>
              <Hidden mdUp>
                <div className="bg-white">
                  <div className="py-16 px-10 bg-primary-25 subtitle2 ">
                    {t("label:orderSummary")}
                  </div>
                  <div className="px-32 bg-white">
                    <div className="flex justify-between items-center  my-20">
                      <div className="subtitle3 text-MonochromeGray-700">
                        {t("label:subTotal")}
                      </div>
                      <div className="body3 text-MonochromeGray-700">
                        {t("label:nok")}{" "}
                        {orderDetails?.orderSummary?.subTotal
                          ? ThousandSeparator(orderDetails?.orderSummary?.subTotal)
                          : ""}
                      </div>
                    </div>
                    <div className="flex justify-between items-center  my-20">
                      <div className="subtitle3 text-MonochromeGray-700">
                        {t("label:tax")}
                      </div>
                      <div className="body3 text-MonochromeGray-700">
                        {t("label:nok")}{" "}
                        {orderDetails?.orderSummary?.tax
                          ? ThousandSeparator(orderDetails?.orderSummary?.tax)
                          : 0}
                      </div>
                    </div>
                    <div className="flex justify-between items-center  my-20">
                      <div className="subtitle3 text-MonochromeGray-700">
                        {t("label:discount")}
                      </div>
                      <div className="body3 text-MonochromeGray-700">
                        {t("label:nok")}{" "}
                        {orderDetails?.orderSummary?.discount
                          ? ThousandSeparator(orderDetails?.orderSummary?.discount)
                          : 0}
                      </div>
                    </div>
                  </div>
                  <div className="px-14">
                    <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 my-20">
                      <div className="subtitle3 text-MonochromeGray-700">
                        {t("label:grandTotal")}
                      </div>
                      <div className="body3 text-MonochromeGray-700">
                        {t("label:nok")}{" "}
                        {orderDetails?.orderSummary?.grandTotal
                          ? ThousandSeparator(orderDetails?.orderSummary?.grandTotal)
                          : ""}
                      </div>
                    </div>
                  </div>
                </div>
              </Hidden>
            </div>
          </div>
          <Hidden mdDown>
            <div className="flex justify-end">
              <Button
                color="secondary"
                variant="contained"
                className="font-semibold rounded-4 bg-primary-500"
                onClick={() => {
                  // navigate('/payment/checkout')
                  navigate(
                    `/order/details/${orderDetails?.orderUuid}/checkout`
                  );
                }}
              >
                {t("label:toCustomerDetails")}
              </Button>
            </div>
          </Hidden>
        </div>
      </div>
      <Hidden mdUp>
        <div className="fixed bottom-0 flex justify-center items-center gap-20 w-full mb-20">
          <Button
            color="secondary"
            variant="contained"
            className="rounded-full bg-primary-500 button2"
            onClick={() => {
              // navigate('/payment/checkout')
              navigate(`/order/details/${orderDetails?.orderUuid}/checkout`);
            }}
          >
            {t("label:toCustomerDetails")}
          </Button>
          <IconButton
            color="secondary"
            className="bg-primary-50 custom-button-shadow focus:bg-blue-200"
            onClick={scrollToTop}
          >
            <KeyboardArrowUpIcon />
          </IconButton>
        </div>
      </Hidden>
    </div>
  );
};

export default orderDetails;
