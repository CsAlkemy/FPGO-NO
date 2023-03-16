import {DesktopDatePicker} from "@mui/lab";
import {Backdrop, Button, CircularProgress, TextField} from "@mui/material";
import {Controller, useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import PaymentMethodsPie from "./PaymentMethodsPie";
import OrderStatusPie from "./OrderStatusPie";
import CustomersPie from "./CustomersPie";
import RevenuePerDay from "./RevenuePerDayChart";
import {StatTiles} from "./StatTiles";
import TopCustomers from "./TopCustomers";
import DashboardService from "../../data-access/services/dashboard/DashboardService";

export default function Dashboard() {
  const { t } = useTranslation();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDefault, setIsDefault] = useState(true);
  const currentDate = new Date();
  const prepareStartDate = `${currentDate.getMonth() + 1}, ${
    currentDate.getDate() - (currentDate.getDate() - 1)
  }, ${currentDate.getFullYear()}`;
  const defaultStartDate = `${currentDate.getMonth() + 1}, ${
    currentDate.getDate() - (currentDate.getDate() - 1)
  }, ${currentDate.getFullYear()}`;
  const defaultEndDate = `${
    currentDate.getMonth() + 1
  }, ${currentDate.getDate()}, ${currentDate.getFullYear()}, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const startDate = new Date(prepareStartDate).getTime() / 1000;
  const [fromDate, setFromDate] = useState(
    new Date(defaultStartDate).getTime() / 1000
  );
  const [toDate, setToDate] = useState(
    new Date(defaultEndDate).getTime() / 1000
  );
  // const startDate = new Date(1667278800).getTime()

  const { control, formState, handleSubmit, reset, setValue, watch } = useForm({
    mode: "onChange",
    // defaultValue,
    // resolver: yupResolver(validateSchema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const watchCheckIn = watch("checkIn") || new Date(defaultStartDate);
  const watchCheckOut = watch("checkOut") || new Date(defaultEndDate);

  useEffect(() => {
    // http://dev-api.frontpayment.no/api/v1/dashboard/1669831200/1670495519
    // let currentDate = new Date();
    // let prepareStartDate = `${currentDate.getMonth()+1}, ${currentDate.getDay()-(currentDate.getDay() - 1)}, ${currentDate.getFullYear()}`
    // let startDate = new Date(prepareStartDate).getTime()/1000
    if (isDefault && isLoading) {
      DashboardService.getDashboardAnalyticsData({
        startDate,
        endDate: (new Date().getTime() / 1000).toFixed(),
      })
        .then((response) => {
          if (response?.status_code === 200 && response?.is_data) {
            setAnalyticsData(response?.data);
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  const getSelectedRangeAnalyticsData = () => {
    setIsDefault(false);
    setIsLoading(true);
    const checkIn = new Date(watchCheckIn).getTime() / 1000;
    const checkOut = new Date(watchCheckOut).getTime() / 1000;
    DashboardService.getDashboardAnalyticsData({
      startDate: checkIn,
      endDate: checkOut,
    })
      .then((response) => {
        if (response?.status_code === 200 && response?.is_data) {
          setAnalyticsData(response?.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const disableBeforeOfStartDate = (date) => {
    const paramDate = date.getTime() / 1000;
    return fromDate > paramDate;
  };

  const disableAfterOfEndDate = (date) => {
    const paramDate = date.getTime() / 1000;
    return toDate < paramDate;
  };

  return (
    <div>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          color: "#0088AE",
          background: "white",
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {!isLoading && (
        <div className="w-full py-32 px-24 md:px-32 max-w-screen-xl">
          <div className="flex flex-col md:flex-row gap-y-20 justify-between">
            <div className="header6">{t("label:dashboard")}</div>
            <div className="flex items-center flex-col md:flex-row gap-y-20 gap-10">
              <div className="flex items-center gap-10">
                <Controller
                  name="checkIn"
                  control={control}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <DesktopDatePicker
                      mask=""
                      // label='Check In'
                      inputFormat="dd.MM.yyyy"
                      value={value || new Date(defaultStartDate)}
                      onChange={(date) => {
                        setFromDate(date.getTime() / 1000);
                        return onChange(date);
                      }}
                      PopperProps={{
                        sx: {
                          "& .MuiCalendarPicker-root .MuiButtonBase-root.MuiPickersDay-root": {
                            borderRadius: '8px',
                            "&.Mui-selected": {
                              backgroundColor: "#c9eee7",
                              color: "#323434",
                            }
                          }
                        }
                      }}
                      disableFuture
                      shouldDisableDate={disableAfterOfEndDate}
                      renderInput={(params) => (
                        <TextField {...params} onBlur={onBlur} type="date" />
                      )}
                    />
                  )}
                />
                {t("label:to")}
                <Controller
                  name="checkOut"
                  control={control}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <DesktopDatePicker
                      // label='Check Out'
                      mask=""
                      inputFormat="dd.MM.yyyy"
                      value={value || new Date(defaultEndDate)}
                      // onChange={onChange}
                      onChange={(date) => {
                        setToDate(date.getTime() / 1000);
                        return onChange(date);
                      }}
                      PopperProps={{
                        sx: {
                          "& .MuiCalendarPicker-root .MuiButtonBase-root.MuiPickersDay-root": {
                            borderRadius: '8px',
                            "&.Mui-selected": {
                              backgroundColor: "#c9eee7",
                              color: "#323434",
                            }
                          }
                        }
                      }}
                      disableFuture
                      shouldDisableDate={disableBeforeOfStartDate}
                      renderInput={(params) => (
                        <TextField {...params} onBlur={onBlur} type="date" />
                      )}
                    />
                  )}
                />
              </div>
              <Button
                variant="contained"
                color="secondary"
                className="rounded-4 w-full md:w-auto"
                onClick={() => getSelectedRangeAnalyticsData()}
              >
                {t("label:apply")}
              </Button>
            </div>
          </div>
          <div className="my-20">
            <StatTiles datas={analyticsData} />
          </div>
          <div className="my-20">
            <RevenuePerDay datas={analyticsData} />
          </div>
          <div className="my-20">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-20 w-full">
              <PaymentMethodsPie datas={analyticsData} />{" "}
              <OrderStatusPie datas={analyticsData} />{" "}
              <CustomersPie datas={analyticsData} />
              {/* <GenderWidget />
          <AgeWidget />
          <LanguageWidget /> */}
            </div>
          </div>
          <div className="my-20 grid grid-cols-1 sm:grid-cols-1 gap-20">
            {/*<CostsTile datas={analyticsData} />*/}
            <TopCustomers datas={analyticsData} />
          </div>
        </div>
      )}
    </div>
  );
}
