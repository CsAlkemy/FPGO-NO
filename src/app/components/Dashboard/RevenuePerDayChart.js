import React, {useState} from "react";
import {useTheme} from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import ReactApexChart from "react-apexcharts";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import {useTranslation} from "react-i18next";
import {ThousandSeparator} from "../../utils/helperFunctions";

// import { selectWidgets } from '../store/widgetsSlice';

function RevenuePerDay(props) {
  const theme = useTheme();
  //   const widgets = useSelector(selectWidgets);
  //   const { series, averageRatio, predictedRatio, overallScore, labels } =
  //     widgets?.visitorsVsPageViews;
  const { t } = useTranslation();
  const { dayCount, revenueChart } = props.datas;
  const [revenueChartData, setRevenueChartData] = useState({
    name: "Revenue",
    data: revenueChart.map((rc) => {
      return { x: rc.date * 1000, y: ThousandSeparator(rc.value) };
    }),
  });

  const calculateHighestRevenue = () => {
    if (revenueChart.length) {
      return ThousandSeparator(
        Math.round(Math.max(...revenueChart.map((data) => data.value)))
      );
    } else return "0";
  };
  const calculateLowestRevenue = () => {
    if (revenueChart.length) {
      return ThousandSeparator(
        Math.round(Math.min(...revenueChart.map((data) => data.value)))
      );
    } else return "0";
  };
  const calculateHighestRevenueDate = () => {
    if (revenueChart.length) {
      const dates = revenueChart.filter(
        (rc) => rc.value === Math.max(...revenueChart.map((data) => data.value))
      );
      return (
        new Date(dates[dates.length - 1].date * 1000).getDate() +
        "." +
        (new Date(dates[dates.length - 1].date * 1000).getMonth() + 1) +
        "." +
        new Date(dates[dates.length - 1].date * 1000).getFullYear()
      );
    } else return "Not Found";
  };
  const calculateLowestRevenueDate = () => {
    if (revenueChart.length) {
      const dates = revenueChart.filter(
        (rc) => rc.value === Math.min(...revenueChart.map((data) => data.value))
      );
      return (
        new Date(dates[dates.length - 1].date * 1000).getDate() +
        "." +
        (new Date(dates[dates.length - 1].date * 1000).getMonth() + 1) +
        "." +
        new Date(dates[dates.length - 1].date * 1000).getFullYear()
      );
    } else return "Not Found";
  };

  const chartOptions = {
    chart: {
      animations: {
        enabled: false,
      },
      fontFamily: "inherit",
      foreColor: "inherit",
      height: "100%",
      type: "area",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [theme.palette.primary.light, theme.palette.primary.light],
    dataLabels: {
      enabled: false,
    },
    fill: {
      colors: [theme.palette.primary.dark, theme.palette.primary.light],
      opacity: 0.5,
    },
    grid: {
      show: false,
      padding: {
        bottom: -40,
        left: 0,
        right: 0,
      },
    },
    legend: {
      show: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    tooltip: {
      followCursor: true,
      theme: "dark",
      x: {
        format: "MMM dd, yyyy",
      },
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      labels: {
        offsetY: -20,
        rotate: 0,
        style: {
          colors: theme.palette.text.secondary,
        },
      },
      tickAmount: 3,
      tooltip: {
        enabled: false,
      },
      type: "datetime",
    },
    yaxis: {
      labels: {
        style: {
          colors: theme.palette.divider,
        },
      },
      max: (max) => max + 250,
      min: (min) => min - 250,
      show: false,
      tickAmount: 5,
    },
  };

  return (
    <Paper className="flex flex-col flex-auto shadow rounded-2xl overflow-hidden">
      <div className="flex items-start justify-between m-24 mb-0">
        <Typography className="header6">{t("label:revenuePerDay")}</Typography>
        <div className="ml-8">
          <Chip
            size="small"
            className="font-medium text-sm"
            label={`${dayCount} ${t("label:days")}`}
          />
        </div>
      </div>
      <div className="flex items-start mt-24 mx-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-42 sm:gap-48 gap-y-32">
          <div className="flex gap-10">
            <div className="p-10 border-1 border-MonochromeGray-50 rounded-6 max-h-56">
              <TrendingUpIcon className="text-[#50C9B1] icon-size-32" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="subtitle2 text-MonochromeGray-300">
                  {t("label:highestRevenueEarned")}
                </div>
              </div>
              <div className="flex items-start mt-8">
                <div className="flex flex-col">
                  <div className="text-2xl text-MonochromeGray-700 font-bold">
                    {calculateHighestRevenue()}
                  </div>
                  <div className="button3 text-MonochromeGray-300">
                    {calculateHighestRevenueDate()}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-10">
            <div className="p-10 border-1 border-MonochromeGray-50 rounded-6 max-h-56">
              <TrendingDownIcon className="text-[#F36562] icon-size-32" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <div className="subtitle2 text-MonochromeGray-300">
                  {t("label:lowestRevenueEarned")}
                </div>
              </div>
              <div className="flex items-start mt-8">
                <div className="flex flex-col">
                  <div className="text-2xl text-MonochromeGray-700 font-bold">
                    {calculateLowestRevenue()}
                  </div>
                  <div className="button3 text-MonochromeGray-300">
                    {calculateLowestRevenueDate()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-auto h-320 mt-12">
        <ReactApexChart
          className="flex-auto w-full h-full"
          options={chartOptions}
          // series={Data}
          series={[revenueChartData]}
          type={chartOptions.chart.type}
          height={chartOptions.chart.height}
        />
      </div>
    </Paper>
  );
}

export default RevenuePerDay;
