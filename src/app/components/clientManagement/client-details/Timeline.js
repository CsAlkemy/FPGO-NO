import CheckIcon from "@mui/icons-material/Check";
import React, { useEffect, useState } from "react";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Timeline from "@mui/lab/Timeline";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import { useTranslation } from "react-i18next";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { Skeleton, TextField } from "@mui/material";
import { DesktopDatePicker } from "@mui/lab";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import CustomersService from "../../../data-access/services/customersService/CustomersService";

const TimelineLog = () => {
  const { t } = useTranslation();
  const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = React.useState(true);
  const [defaultTimeline, setDefaultTimeline] = React.useState(true);
  const [summary, setSummary] = useState([]);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(
      `${new Date().getMonth() + 1}.01.${new Date().getFullYear()} 00:00:00`
    )
  );

  const handleDateChange = (date) => {
    setIsFetching(true);
    setDefaultTimeline(false);
    const prepareSelectedDate = `${new Date(date).getMonth() + 1}.01.${new Date(
      date
    ).getFullYear()} 00:00:00`;
    // setSelectedDate(date);
    const timeStamp = new Date(prepareSelectedDate).getTime() / 1000;
    setSelectedDate(prepareSelectedDate);
    ClientService.getClientTimelineByUUID(
      info?.organizationDetails?.uuid,
      timeStamp
    )
      .then((res) => {
        const summary = res?.data.filter((d) => d?.summary);
        setSummary(summary[0].summary);
        const filteredLogs = res?.data.filter((d) => !d?.summary);
        setLogs(filteredLogs);
        setIsFetching(false);
      })
      .catch((e) => {
        setLogs([]);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (defaultTimeline) {
      const prepareSelectedDate = `${
        new Date().getMonth() + 1
      }.01.${new Date().getFullYear()} 00:00:00`;
      // setSelectedDate(date);
      const timeStamp = new Date(prepareSelectedDate).getTime() / 1000;
      ClientService.getClientTimelineByUUID(
        info?.organizationDetails?.uuid,
        timeStamp
      )
        .then((res) => {
          setSummary(res?.data?.summary ? res?.data?.summary : []);
          setLogs(res?.data?.timeline ? res?.data?.timeline : []);
          setIsFetching(false);
        })
        .catch((e) => {
          setLogs([]);
          setIsFetching(false);
        });
    }
  }, [isFetching]);
  console.log(logs.length);

  return (
    <div className="mb-32 md:mb-0 w-full sm:w-4/5">
      <div className="mb-20 mt-10 flex justify-end">
        <DesktopDatePicker
          inputFormat="MM.yyyy"
          views={["year", "month"]}
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} type="date" />}
        />
      </div>
      <div className="p-5 bg-MonochromeGray-25 rounded-8 mb-32">
        <div className="bg-white grid grid-cols-2 sm:grid-cols-4 gap-5 rounded-4">
          <div className="border-r-1 border-MonochromeGray-50 p-10">
            <div className="subtitle3 text-MonochromeGray-300">
              {t("label:noOfOrders")}
            </div>
            <div className="body1 text-MonochromeGray-700 mt-5">
              {summary?.orderCount}
            </div>
          </div>
          <div className="border-r-1 border-MonochromeGray-50 p-10">
            <div className="subtitle3 text-MonochromeGray-300">
              {t("label:noOfSMSSent")}
            </div>
            <div className="body1 text-MonochromeGray-700 mt-5">
              {summary?.smsCount}
            </div>
          </div>
          <div className="border-r-1 border-MonochromeGray-50 p-10">
            <div className="subtitle3 text-MonochromeGray-300">
              {t("label:noOfCreditChecks")}
            </div>
            <div className="body1 text-MonochromeGray-700 mt-5">
              {summary?.creditCheckCount}
            </div>
          </div>
          <div className="p-10">
            <div className="subtitle3 text-MonochromeGray-300">
              {t("label:noOfEHFs")}
            </div>
            <div className="body1 text-MonochromeGray-700 mt-5">
              {summary?.ehfCount}
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
          {logs.map((log, index) => {
            return (
              <TimelineItem>
                <TimelineSeparator>
                  {log.slug === "order-sent-by-ehf" ||
                  log.slug === "order-sent-by-invoice" ||
                  log.slug === "credit-check-performed" ||
                  log.slug === "email-sent" ||
                  (log.slug === "sms-sent" && log.type === "Payment Link") ||
                  log.slug === "client-information-updated" ? (
                    <TimelineDot className="bg-orderLog-success">
                      <CheckIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  ) : log.slug === "sms-sent" &&
                    log.type === "Order Cancellation" ? (
                    <TimelineDot className="bg-orderLog-warning">
                      <PriorityHighIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  ) : (
                    <TimelineDot color="warning">
                      <PriorityHighIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  )}
                  {index + 1 < logs.length && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <div className="ml-5 mt-10 mb-10">
                    <div className="subtitle3 text-MonochromeGray-700">
                      {log.title}
                    </div>
                    {log.datetime && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:date")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.datetime}
                        </div>
                      </div>
                    )}
                    {log.orderUuid && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:orderId")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.orderUuid}
                        </div>
                      </div>
                    )}
                    {log.sentTo && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:sentTo")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.sentTo}
                        </div>
                      </div>
                    )}
                    {log.refundAmount && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:refundAmount")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.refundAmount}
                        </div>
                      </div>
                    )}
                    {log.actionBy && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:actionBy")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.actionBy}
                        </div>
                      </div>
                    )}
                    {log.paymentMethod && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:paymentMethod")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.paymentMethod}
                        </div>
                      </div>
                    )}
                    {log.note && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:note")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.note}
                        </div>
                      </div>
                    )}
                    {log.type && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:types")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.type}
                        </div>
                      </div>
                    )}
                    {log?.personalOrBusinessNumber &&
                    log?.personalOrBusinessNumber.length === 9 ? (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:orgId")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log?.personalOrBusinessNumber}
                        </div>
                      </div>
                    ) : log?.personalOrBusinessNumber &&
                      log?.personalOrBusinessNumber.length === 11 ? (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:pNumber")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log?.personalOrBusinessNumber}
                        </div>
                      </div>
                    ) : (
                      ""
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
              <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />
            </div>
          </div>
          <div className="flex gap-10">
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex flex-col">
              <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: "1rem" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineLog;
