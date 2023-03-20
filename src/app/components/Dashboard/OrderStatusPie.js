import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";
// import { selectWidgets } from '../store/widgetsSlice';

function OrderStatus(props) {
  // const widgets = useSelector(selectWidgets);
  // const { series, labels, uniqueVisitors } = widgets?.newVsReturning;
  const { t } = useTranslation();
  const { dayCount, orderStatus } = props.datas;
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const [series] = useState([
    orderStatus?.paid ? orderStatus?.paid : 0,
    orderStatus?.sent ? orderStatus?.sent : 0,
    orderStatus?.invoiced ? orderStatus?.invoiced : 0,
    orderStatus?.debtCollection ? orderStatus?.debtCollection : 0,
    orderStatus?.partialRefunded ? orderStatus?.partialRefunded : 0,
    orderStatus?.refundPending ? orderStatus?.refundPending : 0,
    orderStatus?.refunded ? orderStatus?.refunded : 0,
  ]);
  const [chartSeries] = useState([
    Math.ceil((series[0] / series.reduce((a, b) => a + b, 0)) * 100),
    Math.ceil((series[1] / series.reduce((a, b) => a + b, 0)) * 100),
    Math.ceil((series[2] / series.reduce((a, b) => a + b, 0)) * 100),
    Math.ceil((series[3] / series.reduce((a, b) => a + b, 0)) * 100),
    Math.ceil((series[4] / series.reduce((a, b) => a + b, 0)) * 100),
    Math.ceil((series[5] / series.reduce((a, b) => a + b, 0)) * 100),
    Math.ceil((series[6] / series.reduce((a, b) => a + b, 0)) * 100),
  ]);
  const [labels] = useState(["paid", "sent", "invoiced", "debtCollection", "partialRefunded", "refundPending", "refunded"]);

  const chartOptions = {
    chart: {
      animations: {
        speed: 400,
        animateGradually: {
          enabled: false,
        },
      },
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "donut",
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#3D388B", "#7067F0", "#524AC9", "#C6C2FF", "#865DFF", "#9C9EFE", "#645CBB"],
    labels:
      chartSeries.toString() === [0, 0, 0, 0, 0, 0, 0].toString()
        ? [t("label:notFound")]
        : labels,
    plotOptions: {
      pie: {
        customScale: 0.9,
        expandOnClick: false,
        donut: {
          size: "60%",
        },
      },
    },
    stroke: {
      colors: [theme.palette.background.paper],
    },
    states: {
      hover: {
        filter: {
          type: "none",
        },
      },
      active: {
        filter: {
          type: "none",
        },
      },
    },
    tooltip: {
      enabled: true,
      fillSeriesColor: false,
      theme: "dark",
      custom: ({ seriesIndex, w }) =>
        `<div class="flex items-center h-32 min-h-32 max-h-23 px-12">
            <div class="w-12 h-12 rounded-full" style="background-color: ${
              w.config.colors[seriesIndex]
            };"></div>
             <div class="ml-8 text-md leading-none">${t(
               `label:${w.config.labels[seriesIndex]}`
             )}:</div>
            <div class="ml-8 text-md font-bold leading-none">${
              w.config.series[seriesIndex]
            }%</div>
        </div>`,
    },
  };

  useEffect(() => {
    setAwaitRender(false);
  }, []);

  if (awaitRender) {
    return null;
  }
  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden p-24">
      <div className="flex flex-row items-start justify-between">
        <Typography className="text-lg font-medium tracking-tight leading-6 truncate">
          {t("label:orderStatus")}
        </Typography>
        <div className="ml-8">
          <Chip
            size="small"
            className="font-medium text-sm"
            label={`${dayCount} ${t("label:days")}`}
          />
        </div>
      </div>

      <div className="flex flex-col flex-auto mt-24 h-192">
      {/*<div className="flex flex-col flex-auto mt-24 h-320">*/}
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          series={
            chartSeries.toString() === [0, 0, 0, 0, 0, 0,0].toString()
              ? [100]
              : chartSeries
          }
          // series={series.reduce((a, b) => a + b, 0) === 0 ? [1] : series }
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
      <div className="mt-32">
        <div className="-my-12 divide-y">
          {series.map((dataset, i) => (
            <div className="grid grid-cols-3 py-12" key={i}>
              <div className="flex items-center">
                <Box
                  className="flex-0 w-8 h-8 rounded-full"
                  sx={{ backgroundColor: chartOptions.colors[i] }}
                />
                <Typography className="ml-12 truncate">
                  {t(`label:${labels[i]}`)}
                </Typography>
              </div>
              <Typography className="font-medium text-right">
                {dataset}
                {/* {((uniqueVisitors * dataset) / 100).toLocaleString('en-US')} */}
              </Typography>
              <Typography className="text-right" color="text.secondary">
                {/*{dataset}%*/}
                {dataset === 0
                  ? 0
                  : Math.ceil(
                      (dataset / series.reduce((a, b) => a + b, 0)) * 100
                    )}
                %
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </Paper>
  );
}

export default memo(OrderStatus);
