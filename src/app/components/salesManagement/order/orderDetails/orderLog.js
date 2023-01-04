import CheckIcon from "@mui/icons-material/Check";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import OrdersService from "../../../../data-access/services/ordersService/OrdersService";

const orderLog = () => {
  const { t } = useTranslation();
  const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    OrdersService.getOrdersLogByUUID(info.orderUuid)
      .then((res) => {
        setLogs(res?.data);
        setLoading(false);
      })
      .catch((e) => {
        console.log("E : ", e);
        setLogs([]);
        setLoading(false);
      });
  }, [loading]);

  return (
    <div className="mb-32 md:mb-0">
      <Timeline
        sx={{
          "& .MuiTimelineItem-root:before": {
            flex: 0,
            padding: 0,
          },
        }}
      >
        {logs &&
          logs.map((log) => {
            return (
              <TimelineItem>
                <TimelineSeparator>
                  {log.slug === "order-created" || log.slug === "order-sent"|| log.slug === "order-resent"|| log.slug === "payment-link-open" || log.slug === "refund-sent" || log.slug === "payment-successful" ? (
                    <TimelineDot className="bg-orderLog-success">
                      <CheckIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  ) : log.slug === "payment-failed" || log.slug === "order-converted-to-invoice" ? (
                    <TimelineDot color="warning">
                      <PriorityHighIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  )
                  :(
                    <TimelineDot className="bg-orderLog-warning">
                      <PriorityHighIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  )}
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <div className="ml-10">
                    <div className="subtitle3 text-MonochromeGray-700">
                        {log.title}
                    </div>
                      {
                          log?.datetime && (
                          <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">Date:</div>
                              <div className="body4 text-MonochromeGray-700">
                                  {log.datetime}
                              </div>
                          </div>
                        )
                      }
                      {
                          log?.sentTo && (
                          <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">Sent to:</div>
                              <div className="body4 text-MonochromeGray-700">
                                  {log.sentTo}
                              </div>
                          </div>
                        )
                      }
                      {
                          log?.refundAmount && (
                          <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">Refund amount:</div>
                              <div className="body4 text-MonochromeGray-700">
                                  {log.refundAmount}
                              </div>
                          </div>
                        )
                      }
                      {
                          log?.actionBy && (
                          <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">Action by:</div>
                              <div className="body4 text-MonochromeGray-700">
                                  {log.actionBy}
                              </div>
                          </div>
                        )
                      }
                      {
                        log?.paymentMethod && (
                          <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">Payment method:</div>
                              <div className="body4 text-MonochromeGray-700">
                                  {log.paymentMethod}
                              </div>
                          </div>
                        )
                      }
                      {
                          log?.note && (
                          <div className="flex gap-5">
                              <div className="text-MonochromeGray-300 body4">Note:</div>
                              <div className="body4 text-MonochromeGray-700">
                                  {log.note}
                              </div>
                          </div>
                        )
                      }
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
      </Timeline>
    </div>
  );
};

export default orderLog;
