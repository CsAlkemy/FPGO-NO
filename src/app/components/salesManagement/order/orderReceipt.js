import React, {createRef, useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectUser} from "app/store/userSlice";
import PaymentHeader from "../payment/paymentHeader";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import {useSnackbar} from "notistack";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import Pdf from "react-to-pdf";
import {ThousandSeparator} from "../../../utils/helperFunctions";
import {LoadingButton} from "@mui/lab";

const orderReceipt = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const param = useParams();
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);
  const ref = createRef();
  useEffect(() => {
    OrdersService.getOrdersDetailsByUUIDPayment(param.uuid)
      .then((response) => {
        if (response?.status_code === 200 && response?.is_data) {
          setOrderDetails(response.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        enqueueSnackbar(t(`message:${e}`), { variant: "error" });
      });
  }, [isLoading]);

  return (
    <div className="my-10 mx-auto">
      <div className="flex flex-auto mx-auto min-w-0 max-w-screen-xl">
        <div className="flex justify-between w-full max-w-lg">
          <p></p>
          <Pdf
            targetRef={ref}
            filename={`kvittering_${orderDetails?.organizationDetails?.name}_${orderDetails?.orderUuid}.pdf`}
            // x={0.5}
            // y={0.5}
          >
            {({ toPdf }) => (
              <div>
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  className="button2 rounded-4 mb-20 hover:bg-MonochromeGray-25 hover:text-MonochromeGray-700"
                  size="large"
                  loading={loading}
                  onClick={() => {
                    toPdf();
                    setLoading(true);
                    setTimeout(() => {
                      setLoading(false);
                    }, [1000]);
                  }}
                  loadingPosition="center"
                >
                  {t("label:ExportToPdf")}
                </LoadingButton>
              </div>
            )}
          </Pdf>
        </div>
      </div>
      <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl">
        <div
          className="flex-auto  w-full  border-1 border-MonochromeGray-50 max-w-lg"
          ref={ref}
        >
          {/*md:w-3/4 lg:w-2/3 xl:w-7/12*/}
          <div className="order-receipt-container">
            <PaymentHeader />
            <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center pt-48 pb-20 border-b-1 border-MonochromeGray-50">
              <div className="subtitle1 text-MonochromeGray-700">
                {t("label:transactionReceipt")}
              </div>
              <div className="subtitle3 text-MonochromeGray-700 flex justify-end">
                {t("label:orderId")}:{" "}
                {orderDetails?.orderUuid ? orderDetails?.orderUuid : "-"}
              </div>
            </div>

            <div className="flex gap-20 pt-20 justify-between">
              <div className="text-MonochromeGray-700 body3 flex flex-col gap-5">
                <div>
                  {t("label:customer")}:
                  {orderDetails?.customerDetails?.name
                    ? orderDetails?.customerDetails?.name
                    : "-"}
                </div>
                <div>
                  {t("label:address")}:
                  {orderDetails?.customerDetails?.address &&
                  orderDetails?.customerDetails?.address?.street
                    ? orderDetails?.customerDetails?.address?.street + ", "
                    : "-, "}{" "}
                  <br />{" "}
                  {orderDetails?.customerDetails?.address &&
                  orderDetails?.customerDetails?.address?.zip
                    ? orderDetails?.customerDetails?.address?.zip
                    : "-"}{" "}
                  {orderDetails?.customerDetails?.address &&
                  orderDetails?.customerDetails?.address?.city
                    ? orderDetails?.customerDetails?.address?.city + ", "
                    : "-, "}{" "}
                  {orderDetails?.customerDetails?.address &&
                  orderDetails?.customerDetails?.address?.country
                    ? orderDetails?.customerDetails?.address?.country
                    : "-"}
                </div>
                <div className="mt-20">
                  {t("label:orderDate")}:{" "}
                  {orderDetails?.orderDate ? orderDetails?.orderDate : "-"}
                </div>
                <div>
                  {t("label:paymentDueDate")}:
                  {orderDetails?.paymentLinkDueDate
                    ? orderDetails?.paymentLinkDueDate
                    : "-"}
                </div>
              </div>
              <div className="text-MonochromeGray-700 body3 flex flex-col gap-5">
                <div>
                  {orderDetails?.organizationDetails?.name
                    ? orderDetails?.organizationDetails?.name
                    : "-"}
                </div>
                <div>
                  {orderDetails?.organizationDetails?.billingAddress &&
                  orderDetails?.organizationDetails?.billingAddress?.street
                    ? orderDetails?.organizationDetails?.billingAddress?.street
                    : "-"}
                </div>
                <div>
                  {orderDetails?.organizationDetails?.billingAddress &&
                  orderDetails?.organizationDetails?.billingAddress.zip
                    ? orderDetails?.organizationDetails?.billingAddress.zip
                    : "-"}{" "}
                  {orderDetails?.organizationDetails?.billingAddress &&
                  orderDetails?.organizationDetails?.billingAddress?.city
                    ? orderDetails?.organizationDetails?.billingAddress?.city +
                      ", "
                    : "-"}{" "}
                  {orderDetails?.organizationDetails?.billingAddress &&
                  orderDetails?.organizationDetails?.billingAddress?.country
                    ? orderDetails?.organizationDetails?.billingAddress?.country
                    : "-"}
                </div>
                <div>
                  {t("label:phoneNumber")} :{" "}
                  {orderDetails?.organizationDetails?.billingAddress &&
                  orderDetails?.organizationDetails?.billingAddress
                    ?.countryCode &&
                  orderDetails?.organizationDetails?.billingAddress?.msisdn
                    ? orderDetails?.organizationDetails?.billingAddress
                        ?.countryCode +
                      orderDetails?.organizationDetails?.billingAddress?.msisdn
                    : "-, "}
                </div>
                <div>
                  {t("label:email")}. :{" "}
                  {orderDetails?.organizationDetails?.billingAddress &&
                  orderDetails?.organizationDetails?.billingAddress?.email
                    ? orderDetails?.organizationDetails?.billingAddress?.email
                    : "-, "}
                </div>
              </div>
            </div>
            <div className="order-receipt-table subtitle3 mt-20 border-b-1 border-MonochromeGray-300">
              <div className="my-auto py-16 px-10 ">
                {t("label:productName")}
              </div>
              <div className="my-auto py-16 px-10">{t("label:qty")}</div>
              <div className="my-auto py-16 px-10 text-right">
                {t("label:rate")}
              </div>
              <div className="my-auto py-16 px-10 text-right">
                {t("label:tax")}
              </div>
              <div className="my-auto py-16 px-10 text-right">
                {t("label:amount")}
              </div>
            </div>
            {orderDetails?.productList && orderDetails?.productList.length
              ? orderDetails?.productList.map((row, index) => (
                  <div
                    key={index}
                    className="order-receipt-table body4 border-b-1 border-MonochromeGray-50"
                  >
                    <div className="my-auto py-16 px-10 ">{row.name}</div>
                    <div className="my-auto py-16 px-10">{row.quantity}</div>
                    <div className="my-auto py-16 px-10 text-right">
                      { ThousandSeparator(row.rate) }
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      {row.tax}
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      { ThousandSeparator(row.amount) }
                    </div>
                  </div>
                ))
              : ""}
            <div className="grid grid-cols-1 sm:grid-cols-3 my-10">
              <div className="col-span-2"></div>
              <div className="px-32 bg-white">
                <div className="flex justify-between items-center  my-20 body4 text-MonochromeGray-700">
                  <div>{t("label:subTotal")}</div>
                  <div>
                    {orderDetails?.orderSummary &&
                    orderDetails?.orderSummary?.subTotal
                      ? ThousandSeparator(orderDetails?.orderSummary?.subTotal)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
                <div className="flex justify-between items-center  my-20">
                  <div>{t("label:discount")}</div>
                  <div>
                    {orderDetails?.orderSummary &&
                    orderDetails?.orderSummary?.discount
                      ? ThousandSeparator(orderDetails?.orderSummary?.discount)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
                <div className="flex justify-between items-center  my-20 border-b-1 border-MonochromeGray-300">
                  <div>{t("label:tax")}</div>
                  <div>
                    {orderDetails?.orderSummary &&
                    orderDetails?.orderSummary?.tax
                      ? ThousandSeparator(orderDetails?.orderSummary?.tax)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
                <div className="flex justify-between items-center  mb-20 body4 font-700">
                  <div>{t("label:grandTotal")}</div>
                  <div>
                    {orderDetails?.orderSummary &&
                    orderDetails?.orderSummary?.grandTotal
                      ? ThousandSeparator(orderDetails?.orderSummary?.grandTotal)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
              </div>
            </div>
            {orderDetails?.invoiceReferences &&
              (orderDetails?.invoiceReferences?.customerNotes ||
                orderDetails?.invoiceReferences?.termsAndCondition ||
                orderDetails?.invoiceReferences?.referenceNumber ||
                orderDetails?.invoiceReferences?.customerReference) && (
                <div className="flex flex-col gap-10 mb-32">
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:customerNotes")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.customerNotes
                        ? orderDetails?.invoiceReferences?.customerNotes
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:tnc")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.termsAndCondition
                        ? orderDetails?.invoiceReferences?.termsAndCondition
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:referenceNo")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.referenceNumber
                        ? orderDetails?.invoiceReferences?.referenceNumber
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:customerReference")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {orderDetails?.invoiceReferences &&
                      orderDetails?.invoiceReferences?.customerReference
                        ? orderDetails?.invoiceReferences?.customerReference
                        : "-"}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default orderReceipt;
