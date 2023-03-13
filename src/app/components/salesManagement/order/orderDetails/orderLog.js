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
import {Hidden, Skeleton} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import {CharCont} from "../../../../utils/helperFunctions";

const orderLog = ({ info }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    OrdersService.getOrdersLogByUUID(info.orderUuid)
      .then((res) => {
        let orderData = [];
        let data = res?.data;
        let checkExpired = data.findIndex(item => item.slug === 'order-expired-and-was-not-paid');

        if (info.status.toLowerCase() === 'expired' && checkExpired < 0) {
          orderData.push({
            "title": t("label:orderExpiredAndWasNotPaid"),
            "slug":"order-expired",
            "datetime":info.paymentLinkDueDate,
            "sentTo": null,
            "actionBy":null,
            "note":null,
            "paymentMethod":null,
            "refundAmount":null
          });
        }
        orderData.push(...data);
        
        setLogs(orderData);
        setLoading(false);
      })
      .catch((e) => {
        setLogs([]);
        setLoading(false);
      });
  }, [loading]);

  return (
    <div className="mb-32 md:mb-0">
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
                    log.slug === "payment-successful" ? (
                      <TimelineDot className="bg-orderLog-success border-4 border-[#F0F9F2] shadow-0">
                        <CheckIcon className="icon-size-16 text-white" />
                      </TimelineDot>
                    ) : log.slug === "payment-failed" ||
                      log.slug === "order-converted-to-invoice" ? (
                      <TimelineDot className=' bg-[#E7AB52] border-4 border-[#FDF7EE] shadow-0'>
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
                        {log.title}
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
              <Skeleton variant="text" width={300} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={300} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={300} sx={{ fontSize: "1rem" }} />
            </div>
          </div>
          <div className="flex gap-10">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex flex-col">
              <Skeleton variant="text" width={300} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={300} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={300} sx={{ fontSize: "1rem" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default orderLog;
