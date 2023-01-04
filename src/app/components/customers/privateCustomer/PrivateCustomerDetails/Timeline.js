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
import { Skeleton } from "@mui/material";

const TimelineLog = () => {
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
      {logs?.length > 0 ? (
        <Timeline
          sx={{
            "& .MuiTimelineItem-root:before": {
              flex: 0,
              padding: 0,
            },
          }}
        >
          {logs.map((log) => {
            return (
              <TimelineItem>
                <TimelineSeparator>
                  {log.slug === "order-created" || log.slug === "order-sent" || log.slug === "order-resent" || log.slug === "payment-link-open" || log.slug === "refund-sent" || log.slug === "payment-successful" ? (
                    <TimelineDot className="bg-orderLog-success">
                      <CheckIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  ) : log.slug === "payment-failed" || log.slug === "order-converted-to-invoice" ? (
                    <TimelineDot color="warning">
                      <PriorityHighIcon className="icon-size-14 text-white" />
                    </TimelineDot>
                  )
                    : (
                      <TimelineDot className="bg-orderLog-warning">
                        <PriorityHighIcon className="icon-size-14 text-white" />
                      </TimelineDot>
                    )}
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                  <div className="ml-10">
                    <div className="subtitle3 text-MonochromeGray-700">
                      hjhjhj
                    </div>
                    <div className="flex gap-5">
                      <div className="text-MonochromeGray-300 body4">Date:</div>
                      <div className="body4 text-MonochromeGray-700">
                        878:989
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="text-MonochromeGray-300 body4">Sent to:</div>
                      <div className="body4 text-MonochromeGray-700">
                        jj
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="text-MonochromeGray-300 body4">Refund amount:</div>
                      <div className="body4 text-MonochromeGray-700">
                        9878
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="text-MonochromeGray-300 body4">Action by:</div>
                      <div className="body4 text-MonochromeGray-700">
                        ijhhj
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="text-MonochromeGray-300 body4">Payment method:</div>
                      <div className="body4 text-MonochromeGray-700">
                        jhhg
                      </div>
                    </div>
                    <div className="flex gap-5">
                      <div className="text-MonochromeGray-300 body4">Note:</div>
                      <div className="body4 text-MonochromeGray-700">
                        ioiou
                      </div>
                    </div>
                  </div>
                </TimelineContent>
              </TimelineItem>
            );
          })}
        </Timeline>

      ) : (
        <div>
          <div className='flex gap-10 mb-32'>
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex flex-col">
              <Skeleton variant="text" width={400} sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: '1rem' }} />
            </div>
          </div>
          <div className='flex gap-10'>
            <Skeleton variant="circular" width={40} height={40} />
            <div className="flex flex-col">
              <Skeleton variant="text" width={400} sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: '1rem' }} />
              <Skeleton variant="text" width={400} sx={{ fontSize: '1rem' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimelineLog;
