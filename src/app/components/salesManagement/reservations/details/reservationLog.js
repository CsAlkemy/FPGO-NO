import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import { Hidden, Skeleton, Button } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import CancelIcon from "@mui/icons-material/Cancel";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";
import RefundIcon from "../../../../icons/RefundReservation";
import ChargeCardIcon from "../../../../icons/ChargeFromCard";
import CapturePaymentIcon from "../../../../icons/CapturePayment";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import PaymentsIcon from "@mui/icons-material/Payments";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import {
  CharCont,
  ThousandSeparator,
  DayDiffFromToday,
} from "../../../../utils/helperFunctions";
//import {ThousandSeparator} from "../../../../utils/helperFunctions";

import { selectUser } from "app/store/userSlice";
import { useSelector } from "react-redux";
import { FP_ADMIN } from "../../../../utils/user-roles/UserRoles";

const ReservationLog = ({
  info,
  logContent,
  amountRefunded,
  handleModalOpen,
}) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const user = useSelector(selectUser);

  useEffect(() => {
    setLogs(logContent);
    //info.status = "reserved";
  }, []);

  return (
    <div className="reservation-log-content pb-32 px-0 grid grid-cols-1 md:grid-cols-6">
      <div className="mb-32 md:mb-0 col-span-1 md:col-span-4">
        <div className="amount-section">
          <div className="amount-section-inner flex flex-wrap">
            <div className="amount-col amount-reserved-col">
              <div className="subtitle3">{t("Label:amountReserved")}</div>
              <div className="subtitle1">
                NOK {ThousandSeparator(info.paymentDetails.reservedAmount)}
              </div>
            </div>
            <div className="amount-col amount-paid-col">
              <div className="subtitle3">{t("Label:amountPaid")}</div>
              <div className="subtitle1">
                NOK {ThousandSeparator(info.formattedAmount.amountPaid)}
              </div>
            </div>
            <div className="amount-col">
              <div className="subtitle3">{t("Label:amountRefunded")}</div>
              <div className="subtitle1">
                NOK {ThousandSeparator(info.formattedAmount.amountRefunded)}
              </div>
            </div>
            <div className="amount-col">
              <div className="subtitle3">{t("Label:amountInBank")}</div>
              <div className="subtitle1">
                NOK {ThousandSeparator(info.formattedAmount.amountInBank)}
              </div>
            </div>
          </div>
        </div>
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
                log.isRefundable =
                  "isRefundable" in log ? log.isRefundable : true;
                return (
                  <TimelineItem key={index}>
                    {/* {log.slug} */}
                    <TimelineSeparator>
                      {log.slug === "order-created" ||
                      log.slug === "order-sent" ||
                      log.slug === "payment-link-sent-to-customer" ||
                      log.slug === "order-resent" ||
                      log.slug === "payment-link-opened" ||
                      log.slug === "partial-refunded" ||
                      log.slug === "refund-sent" ||
                      log.slug === "amount-captured-from-reservation" ||
                      log.slug === "amount-charged-from-card" ||
                      log.slug === "customer-information-updated" ||
                      log.slug === "payment-successful" ||
                      log.slug === "reservation-completed" ? (
                        <TimelineDot className="bg-orderLog-success border-4 border-[#F0F9F2] shadow-0">
                          <CheckIcon className="icon-size-16 text-white" />
                        </TimelineDot>
                      ) : log.slug === "payment-failed" ||
                        log.slug === "order-cancelled" ||
                        log.slug === "reservation-cancelled" ||
                        log.slug === "order-converted-to-invoice" ? (
                        <TimelineDot className="border-4 border-[#FEF0EF] shadow-0 bg-[#F36562]">
                          <PriorityHighIcon className="icon-size-16 text-white" />
                        </TimelineDot>
                      ) : (
                        <TimelineDot className=" bg-[#E7AB52] border-4 border-[#FDF7EE] shadow-0">
                          <PriorityHighIcon className="icon-size-16 text-white" />
                        </TimelineDot>
                      )}
                      {index + 1 < logs.length && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <div className="ml-5 mt-10 mb-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {/* {log.title} */}
                          {t(`label:${_.camelCase(log.slug)}`)}
                          {/* {t(`label:${log.translationKey}`)} */}
                        </div>
                        {log?.datetime && (
                          <div className="flex gap-5">
                            <div className="text-MonochromeGray-300 body4">
                              {t("label:date")}:
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              {log.datetime}
                            </div>
                          </div>
                        )}
                        {log?.sentTo &&
                          (log.slug === "payment-link-sent-to-customer" ||
                            log.slug === "order-resent") && (
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
                              {log.slug === "refund-sent"
                                ? t("label:refundAmount")
                                : t("label:amount")}
                              :{/* {t("label:refundAmount")}: */}
                            </div>
                            <div className="body4 text-MonochromeGray-700">
                              NOK {log.refundAmount}
                            </div>
                          </div>
                        )}
                        {/* {log?.paymentMethod &&
                          log.slug != "amount-captured-from-reservation" && (
                            <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">
                                {t("label:paymentMethod")}:
                              </div>
                              <div className="body4 text-MonochromeGray-700">
                                {log.paymentMethod}
                              </div>
                            </div>
                          )} */}
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
                        {log?.actionBy &&
                          ["order-cancelled", "order-completed"].includes(
                            log.slug
                          ) && (
                            <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">
                                {t("label:actionBy")}:
                              </div>
                              <div className="body4 text-MonochromeGray-700">
                                {log.actionBy}
                              </div>
                            </div>
                          )}
                        {log.slug === "amount-charged-from-card" && (
                          <Button
                            variant="outlined"
                            className="body2 action-button button2 refund-trans-btn"
                            startIcon={
                              <UndoIcon style={{ color: "#0088AE" }} />
                            }
                            disabled={!log.isRefundable}
                            onClick={() =>
                              handleModalOpen(
                                "refundChargeTransection",
                                log.refundAmount,
                                log.note
                              )
                            }
                          >
                            {t("label:refundTransection")}
                          </Button>
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
      <div className="col-span-2 reserve-log-sidebar">
        <div className="border-1 border-MonochromeGray-25">
          <div className="py-16 px-10 bg-primary-25 subtitle2 ">
            {t("label:actions")}
          </div>
          {user.role[0] !== FP_ADMIN && (
            <div className="px-12 bg-white pb-20">
              {/* {info.status} */}
              {info.status.toLowerCase() == "reserved" && (
                <>
                  <Button
                    //color="secondary"
                    variant="outlined"
                    className="body2 action-button button2"
                    startIcon={<CreditCardIcon style={{ color: "#50C9B1" }} />}
                    onClick={() => handleModalOpen("chargeFromCard")}
                    disabled={
                      !info.paymentDetails.reservedAt ||
                      DayDiffFromToday(info.paymentDetails.reservedAt) > 60
                    }
                  >
                    {t("label:chargeFromCard")}
                  </Button>
                  <Button
                    variant="outlined"
                    className="body2 action-button button2"
                    startIcon={<PaymentsIcon style={{ color: "#68C7E7" }} />}
                    onClick={() => handleModalOpen("capturePayments")}
                    disabled={
                      !info.paymentDetails.reservedAt ||
                      DayDiffFromToday(info.paymentDetails.reservedAt) > 7 ||
                      info.paymentDetails.capturedAmount >=
                        info.paymentDetails.reservedAmount
                    }
                  >
                    {t("label:capturePayment")}
                  </Button>
                </>
              )}
              {(info.status.toLowerCase() == "reserved" ||
                info.status.toLowerCase() == "completed") &&
                info.paymentDetails.capturedAmount > 0 && (
                  <Button
                    variant="outlined"
                    className="body2 action-button button2"
                    startIcon={<UndoIcon style={{ color: "#0088AE" }} />}
                    onClick={() => handleModalOpen("refundReservation")}
                    disabled={
                      amountRefunded >= info.paymentDetails.capturedAmount
                    }
                  >
                    {t("label:refundFromReservation")}
                  </Button>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationLog;
