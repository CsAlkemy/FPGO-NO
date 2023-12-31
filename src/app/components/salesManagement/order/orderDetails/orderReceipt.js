import React, { createRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { useTranslation } from "react-i18next";
import Pdf from "react-to-pdf";
import {CharCont, ThousandSeparator} from "../../../../utils/helperFunctions";
import { LoadingButton } from "@mui/lab";
import {Hidden} from "@mui/material";

const orderReceipt = ({ info }) => {
  const { t } = useTranslation();
  const ref = createRef();
  const [loading, setLoading] = useState(false);

  const user = useSelector(selectUser);

  return (
    <div>
      <div className="flex flex-auto min-w-0 max-w-screen-xl">
        <div className="flex justify-between w-full max-w-lg">
          <p></p>
          <Pdf
            targetRef={ref}
            filename={`kvittering_${info?.organizationDetails?.name}_${info?.orderUuid}.pdf`}
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
      <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl mb-32 md:mb-0">
        <div
          className="flex-auto  w-full border-1 border-MonochromeGray-50 max-w-lg"
          ref={ref}
        >
          {/*md:w-3/4 lg:w-2/3 xl:w-7/12*/}
          <div className="order-receipt-container">
            <img
              className="logo-icon h-48"
              src="assets/images/logo/front-go.svg"
              alt="logo"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-0 justify-between items-center pt-32 pb-20 border-b-1 border-MonochromeGray-50">
              <div className="subtitle1 text-MonochromeGray-700">
                {t("label:transactionReceipt")}
              </div>
              <div className="subtitle3 text-MonochromeGray-700 flex md:justify-end">
                {t("label:orderId")}: {info?.orderUuid ? info?.orderUuid : "-"}
              </div>
            </div>

            <div className="flex gap-20 pt-20 justify-between">
              <div className="text-MonochromeGray-700 body3 flex flex-col gap-10 md:gap-5">
                <div>
                  {t("label:customer")}:{" "}
                  {info?.customerDetails?.name
                    ? info?.customerDetails?.name
                    : "-"}
                </div>
                <div>
                  {t("label:address")}:{" "}
                  {info?.customerDetails?.address &&
                  info?.customerDetails?.address?.street
                    ? info?.customerDetails?.address?.street + ", "
                    : "-, "}{" "}
                  <br />{" "}
                  {info?.customerDetails?.address &&
                  info?.customerDetails?.address?.zip
                    ? info?.customerDetails?.address?.zip
                    : "-"}{" "}
                  {info?.customerDetails?.address &&
                  info?.customerDetails?.address?.city
                    ? info?.customerDetails?.address?.city + ", "
                    : "-, "}{" "}
                  {info?.customerDetails?.address &&
                  info?.customerDetails?.address?.country
                    ? info?.customerDetails?.address?.country
                    : "-"}
                </div>
                <div className="mt-20">
                  {t("label:orderDate")}:{" "}
                  {info?.orderDate ? info?.orderDate : "-"}
                </div>
                <div>
                  {t("label:paymentDueDate")}:{" "}
                  {info?.paymentLinkDueDate ? info?.paymentLinkDueDate : "-"}
                </div>
              </div>
              <div className="text-MonochromeGray-700 body3 flex flex-col gap-10 md:gap-5">
                <div>
                  {info?.organizationDetails?.name
                    ? info?.organizationDetails?.name
                    : "-"}
                </div>
                <div>
                  {info?.organizationDetails?.billingAddress &&
                  info?.organizationDetails?.billingAddress?.street
                    ? info?.organizationDetails?.billingAddress?.street
                    : "-"}
                </div>
                <div>
                  {info?.organizationDetails?.billingAddress &&
                  info?.organizationDetails?.billingAddress.zip
                    ? info?.organizationDetails?.billingAddress.zip
                    : "-"}{" "}
                  {info?.organizationDetails?.billingAddress &&
                  info?.organizationDetails?.billingAddress?.city
                    ? info?.organizationDetails?.billingAddress?.city + ", "
                    : "-"}{" "}
                  {info?.organizationDetails?.billingAddress &&
                  info?.organizationDetails?.billingAddress?.country
                    ? info?.organizationDetails?.billingAddress?.country
                    : "-"}
                </div>
                <div>
                  {t("label:phoneNumber")} :{" "}
                  {info?.organizationDetails?.billingAddress &&
                  info?.organizationDetails?.billingAddress?.countryCode &&
                  info?.organizationDetails?.billingAddress?.msisdn
                    ? info?.organizationDetails?.billingAddress?.countryCode +
                      info?.organizationDetails?.billingAddress?.msisdn
                    : "-, "}
                </div>
                <Hidden smUp>
                  <div>
                    {t("label:email")} :{" "}
                    {info?.organizationDetails?.billingAddress &&
                    info?.organizationDetails?.billingAddress?.email
                        ? CharCont(info?.organizationDetails?.billingAddress?.email, 10)
                        : "-, "}
                  </div>
                </Hidden>
                <Hidden smDown>
                  <div>
                    {t("label:email")} :{" "}
                    {info?.organizationDetails?.billingAddress &&
                    info?.organizationDetails?.billingAddress?.email
                        ? info?.organizationDetails?.billingAddress?.email
                        : "-, "}
                  </div>
                </Hidden>

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
            {info?.productList && info?.productList.length
              ? info.productList.map((row, index) => (
                  <div
                    key={index}
                    className="order-receipt-table body4 border-b-1 border-MonochromeGray-50"
                  >
                    <div className="my-auto py-16 px-10 ">{row.name}</div>
                    <div className="my-auto py-16 px-10">{row.quantity}</div>
                    <div className="my-auto py-16 px-10 text-right">
                      {ThousandSeparator(row.rate)}
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      {row.tax}
                    </div>
                    <div className="my-auto py-16 px-10 text-right">
                      {ThousandSeparator(row.amount)}
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
                    {info?.orderSummary && info?.orderSummary?.subTotal
                      ? ThousandSeparator(info?.orderSummary?.subTotal)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
                <div className="flex justify-between items-center  my-20">
                  <div>{t("label:discount")}</div>
                  <div>
                    {info?.orderSummary && info?.orderSummary?.discount
                      ? ThousandSeparator(info?.orderSummary?.discount)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
                <div className="flex justify-between items-center  my-20 border-b-1 border-MonochromeGray-300">
                  <div>{t("label:tax")}</div>
                  <div>
                    {info?.orderSummary && info?.orderSummary?.tax
                      ? ThousandSeparator(info?.orderSummary?.tax)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
                <div className="flex justify-between items-center  mb-20 body4 font-700">
                  <div>{t("label:grandTotal")}</div>
                  <div>
                    {info?.orderSummary && info?.orderSummary?.grandTotal
                      ? ThousandSeparator(info?.orderSummary?.grandTotal)
                      : "-"}{" "}
                    {t("label:nok")}
                  </div>
                </div>
              </div>
            </div>
            {info?.invoiceReferences &&
              (info?.invoiceReferences?.customerNotes ||
                info?.invoiceReferences?.termsAndCondition ||
                info?.invoiceReferences?.referenceNumber ||
                info?.invoiceReferences?.customerReference) && (
                <div className="flex flex-col gap-10 mb-32">
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:customerNotes")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {info?.invoiceReferences &&
                      info?.invoiceReferences?.customerNotes
                        ? info?.invoiceReferences?.customerNotes
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:tnc")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {info?.invoiceReferences &&
                      info?.invoiceReferences?.termsAndCondition
                        ? info?.invoiceReferences?.termsAndCondition
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:referenceNo")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {info?.invoiceReferences &&
                      info?.invoiceReferences?.referenceNumber
                        ? info?.invoiceReferences?.referenceNumber
                        : "-"}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="body4 text-MonochromeGray-300">
                      {t("label:customerReference")}
                    </div>
                    <div className="body3  text-MonochromeGray-700">
                      {info?.invoiceReferences &&
                      info?.invoiceReferences?.customerReference
                        ? info?.invoiceReferences?.customerReference
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
