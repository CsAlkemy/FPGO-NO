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
import { Hidden, Skeleton, TextField } from "@mui/material";
import CustomersService from "../../../../data-access/services/customersService/CustomersService";
import { DesktopDatePicker } from "@mui/lab";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import { CharCont } from "../../../../utils/helperFunctions";

const TimelineLog = () => {
  const { t } = useTranslation();
  // const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const queryParams = useParams();
  const [logs, setLogs] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [defaultTimeline, setDefaultTimeline] = useState(true);
  const [selectedDate, setSelectedDate] = React.useState(
    new Date(
      `${new Date().getMonth() + 1}.09.${new Date().getFullYear()} 00:00:00`
    )
  );

  const handleDateChange = (date) => {
    setIsFetching(true);
    setDefaultTimeline(false);
    let prepareSelectedDate = `${date.getMonth() + 1}.${
      date.getDate() - (date.getDate() - 1)
    }.${date.getFullYear()} ${date.getUTCHours()}:${date.getUTCMinutes()}:${date.getUTCSeconds()}`;

    const startTime = new Date(prepareSelectedDate).getTime() / 1000;

    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let prepareLastDateString = `${
      lastDay.getMonth() + 1
    }.${lastDay.getDate()}.${lastDay.getFullYear()} ${lastDay.getUTCHours()}:${lastDay.getUTCMinutes()}:${lastDay.getUTCSeconds()}`;
    const endTime = new Date(prepareLastDateString).getTime() / 1000;
    setSelectedDate(prepareSelectedDate);
    CustomersService.getCustomerTimelineByUUID(
      queryParams.id,
      startTime,
      endTime
    )
      .then((res) => {
        setLogs(res?.data);
        setIsFetching(false);
      })
      .catch((e) => {
        setLogs([]);
        setIsFetching(false);
      });
  };

  useEffect(() => {
    if (defaultTimeline && isFetching) {
      let currentDate = new Date();
      let prepareDateStringOneYearBeforeCurrentMonth = `${
        currentDate.getMonth() + 1
      }.${currentDate.getDate() - (currentDate.getDate() - 1)}.${
        currentDate.getFullYear() - 1
      } ${currentDate.getUTCHours()}:${currentDate.getUTCMinutes()}:${currentDate.getUTCSeconds()}`;

      let startDate =
        new Date(prepareDateStringOneYearBeforeCurrentMonth).getTime() / 1000;
      CustomersService.getCustomerTimelineByUUID(queryParams.id, startDate)
        .then((res) => {
          setLogs(res?.data);
          setIsFetching(false);
        })
        .catch((e) => {
          setLogs([]);
          setIsFetching(false);
        });
    }
  }, [isFetching]);

  return (
    <div className="mb-32 md:mb-0 w-full sm:w-4/5">
      <div className="mb-20 mt-10 flex justify-end">
        <DesktopDatePicker
          inputFormat="MM.yyyy"
          views={["year", "month"]}
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} error={false} type="date" />
          )}
          disableFuture
        />
      </div>
      {!isFetching && logs?.length > 0 ? (
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
                  {log.slug === "order-created" ||
                  log.slug === "credit-check-performed" ||
                  log.slug === "customer-information-updated" ||
                  log.slug === "order-was-sent" ||
                  log.slug === "order-was-resent" ||
                  log.slug === "payment-link-opened" ||
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

                    {log.sentTo && (
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
                    {log.orderAmount && (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:orderAmount")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log.orderAmount}
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
                    {log?.organizationBusinessId &&
                    log?.organizationBusinessId.length === 9 ? (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:orgId")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log?.organizationBusinessId}
                        </div>
                      </div>
                    ) : log?.organizationBusinessId &&
                      log?.organizationBusinessId.length === 11 ? (
                      <div className="flex gap-5">
                        <div className="text-MonochromeGray-300 body4">
                          {t("label:pNumber")}:
                        </div>
                        <div className="body4 text-MonochromeGray-700">
                          {log?.organizationBusinessId}
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
      ) : !isFetching && logs.length === 0 ? (
        <div className="flex justify-center items-center">
          <p>{t("label:noDataFound")}</p>
        </div>
      ) : isFetching ? (
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
      ) : (
        ""
      )}
    </div>
  );
};

export default TimelineLog;
