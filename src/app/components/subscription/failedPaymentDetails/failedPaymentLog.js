import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { useTranslation } from "react-i18next";
import React from "react";
import { Hidden, Skeleton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { CharCont } from "../../../utils/helperFunctions";

const orderLog = ({ logs, details }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-6 gap-10">
      <div className="mb-32 md:mb-0 col-span-4">
        {logs?.length > 0 ? (
          <Timeline
            sx={{
              "& .MuiTimelineItem-root:before": {
                flex: 0,
                padding: 0,
              },
            }}
          >
            {logs &&
              logs.map((log, index) => {
                return (
                  <TimelineItem key={index}>
                    <TimelineSeparator>
                      {log.slug === "order-created" ||
                      log.slug === "order-sent" ||
                      log.slug === "order-resent" ||
                      log.slug === "payment-link-opened" ||
                      log.slug === "partial-refunded" ||
                      log.slug === "refund-sent" ||
                      log.slug === "invoice-order-exported" ||
                      log.slug === "customer-information-updated" ||
                      log.slug === "payment-successful" ? (
                        <TimelineDot className="bg-orderLog-success border-4 border-[#F0F9F2] shadow-0">
                          <CheckIcon className="icon-size-16 text-white" />
                        </TimelineDot>
                      ) : log.slug === "payment-failed" ||
                        log.slug === "order-converted-to-invoice" ? (
                        <TimelineDot className=" bg-[#E7AB52] border-4 border-[#FDF7EE] shadow-0">
                          <PriorityHighIcon className="icon-size-16 text-white" />
                        </TimelineDot>
                      ) : (
                        <TimelineDot className="border-4 border-[#FEF0EF] shadow-0 bg-[#F36562]">
                          <PriorityHighIcon className="icon-size-16 text-white" />
                        </TimelineDot>
                      )}
                      {index + 1 < logs.length && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="ml-5 mt-10 mb-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {/*{log.title}*/}
                          {t(`label:${log.translationKey}`)}
                        </div>
                        {log?.date && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:date")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.date}
                            </div>
                          </div>
                        )}
                        {log?.sentTo && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:sentTo")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              <Hidden smUp>
                                <Tooltip title={log.sentTo}>
                                  <div>{CharCont(log.sentTo, 20)}</div>
                                </Tooltip>
                              </Hidden>
                              <Hidden smDown>{log.sentTo}</Hidden>
                            </div>
                          </div>
                        )}
                        {log?.refundAmount && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:refundAmount")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.refundAmount}
                            </div>
                          </div>
                        )}
                        {log?.subscriptionCycle && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:subscriptionCycle")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.subscriptionCycle}
                            </div>
                          </div>
                        )}
                        {log?.actionBy && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:actionBy")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.actionBy}
                            </div>
                          </div>
                        )}
                        {log?.paymentMethod && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:paymentMethod")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.paymentMethod}
                            </div>
                          </div>
                        )}
                        {log?.note && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:note")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.note}
                            </div>
                          </div>
                        )}
                      </div>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
          </Timeline>
        ) : (
          <div>
            <div className="flex gap-10 mb-32">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex flex-col">
                <Skeleton
                  variant="text"
                  width={300}
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  width={300}
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  width={300}
                  sx={{ fontSize: "1rem" }}
                />
              </div>
            </div>
            <div className="flex gap-10">
              <Skeleton variant="circular" width={40} height={40} />
              <div className="flex flex-col">
                <Skeleton
                  variant="text"
                  width={300}
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  width={300}
                  sx={{ fontSize: "1rem" }}
                />
                <Skeleton
                  variant="text"
                  width={300}
                  sx={{ fontSize: "1rem" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="col-span-2 mx-10 sm:mx-0">
        <div className="border-1 border-MonochromeGray-25">
          <div className="py-16 px-10 bg-primary-25 subtitle2 ">
            {t("label:orderSummary")}
          </div>
          <div className="px-32 bg-white">
            <div className="flex justify-between items-center  my-20">
              <div className="subtitle3 text-MonochromeGray-700">
                {t("label:subTotal")}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {t("label:nok")} {details.subTotal || 0}
              </div>
            </div>
            <div className="flex justify-between items-center  my-20">
              <div className="subtitle3 text-MonochromeGray-700">
                {t("label:discount")}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {t("label:nok")} {details.totalDiscount || 0}
              </div>
            </div>
            <div className="flex justify-between items-center  my-20">
              <div className="subtitle3 text-MonochromeGray-700">
                {t("label:tax")}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {t("label:nok")} {details.totalTax || 0}
              </div>
            </div>
          </div>
          <div className="px-14">
            <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 my-20">
              <div className="subtitle3 text-MonochromeGray-700">
                {t("label:payablePerCycle")}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {t("label:nok")} {details.payablePerCycle || 0}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center  my-20 px-32">
            <div className="subtitle3 text-MonochromeGray-700">
              {t("label:subscriptionCycle")}
            </div>
            <div className="body3 text-MonochromeGray-700">7/12</div>
          </div>
          <div className="mt-10 mb-20 body3 px-32">
            {t("label:orderSummaryDetails")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default orderLog;
