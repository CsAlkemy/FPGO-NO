import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useTranslation } from "react-i18next";

function Customers(props) {
  const { t } = useTranslation();
  const [awaitRender, setAwaitRender] = useState(true);
  const theme = useTheme();
  const { dayCount, customers } = props.datas;
  const [series] = useState([
    customers?.new ? customers?.new : 0,
    customers?.returning ? customers?.returning : 0,
  ]);
  const [chartSeries] = useState([
    series[0] === 0
      ? 0
      : Math.ceil((series[0] / series.reduce((a, b) => a + b, 0)) * 100),
    series[1] === 0
      ? 0
      : Math.ceil((series[1] / series.reduce((a, b) => a + b, 0)) * 100),
  ]);
  const [labels] = useState(["new", "returning", " ", " "]);

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
      height: "80%",
      type: "donut",
      sparkline: {
        enabled: true,
      },
    },
    colors: ["#2E7D6D", "#81C7B9"],
    labels:
      chartSeries.toString() === [0, 0].toString()
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
          {t("label:customers")}
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
        <ReactApexChart
          className="flex flex-auto items-center justify-center w-full h-full"
          options={chartOptions}
          // series={series}
          series={
            chartSeries.toString() === [0, 0].toString() ? [100] : chartSeries
          }
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
                  {" "}
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
                %{/*15%*/}
              </Typography>
            </div>
          ))}
          <div className="h-96"></div>
        </div>
        <div className="h-40"></div>
      </div>
    </Paper>
  );
}

export default memo(Customers);
