import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import "./payouts.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Backdrop,
  Breadcrumbs,
  CircularProgress,
  TextField,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { DesktopDatePicker } from "@mui/lab";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Paper from "@mui/material/Paper";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import InputBase from "@mui/material/InputBase";
import { setSearchText } from "app/store/overview-table/overviewTableDataSearchTextSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import PayoutReports from "./payoutReports";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import ReportService from "../../../data-access/services/reportService/ReportService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function Payouts() {
  const { t } = useTranslation();
  const params = useParams();
  const orgUuid = params.uuid;
  const [isLoading, setIsLoading] = useState(true);
  const [isYearView, setIsYearView] = useState(true);
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const location = useLocation();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(selectUser);
  const orgName =
    location?.state?.orgName || user.user_data.organization.name || "Not found";
  const [dirData, setDirData] = useState([]);
  const [monthViewData, setMonthViewData] = useState([]);
  const [breadCumb, setBreadCumb] = useState([
    {
      title: orgName || "BA",
      navigate: user?.role[0] === FP_ADMIN ? "/reports/payouts-list" : null,
      val: "name",
    },
    {
      title: `${selectedDate.getFullYear()}`,
      navigate: null,
      val: "year",
    },
  ]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleDateChange = (date) => {
    setIsLoading(true);
    setSelectedDate(date);
    setBreadCumb([
      {
        title: orgName,
        navigate: user?.role[0] === FP_ADMIN ? "/reports/payouts-list" : null,
        val: "name",
      },
      {
        title: `${date.getFullYear()}`,
        navigate: null,
        val: "year",
      },
    ]);
    if (isLoading) {
      ReportService.getPayoutsListByYear({
        orgId: orgUuid,
        year: date.getFullYear(),
      })
        .then((response) => {
          setIsLoading(false);
          setDirData(response);
        })
        .catch((e) => {
          enqueueSnackbar(t(`message:${e}`), {
            variant: "error",
            autoHideDuration: 3000,
          });
          setIsLoading(false);
          setDirData([]);
        });
    }
  };

  useEffect(() => {
    if (isLoading) {
      if (isYearView) {
        ReportService.getPayoutsListByYear({
          orgId: orgUuid,
          year: selectedDate.getFullYear(),
        })
          .then((response) => {
            setIsLoading(false);
            setDirData(response.sort((a, b)=> {
              return a.folder- b.folder;
            }));
          })
          .catch((e) => {
            enqueueSnackbar(t(`message:${e}`), {
              variant: "error",
              autoHideDuration: 3000,
            });
            setIsLoading(false);
            setDirData([]);
          });
      }else {
        if (isLoading) {
          ReportService.getPayoutsListByMonth({
            orgId: orgUuid,
            year: selectedDate.getFullYear(),
            month: selectedMonth
          })
            .then((response) => {
              setIsLoading(false);
              setMonthViewData(response);
            })
            .catch((e) => {
              enqueueSnackbar(t(`message:${e}`), {
                variant: "error",
                autoHideDuration: 3000,
              });
              setIsLoading(false);
              setMonthViewData([]);
            });
        }
      }
    }
  }, [isLoading, isYearView]);

  const prepareMonthName = (param) => {
    if (param === "01") return "january";
    else if (param === "02") return "february";
    else if (param === "03") return "march";
    else if (param === "04") return "april";
    else if (param === "05") return "may";
    else if (param === "06") return "june";
    else if (param === "07") return "july";
    else if (param === "08") return "august";
    else if (param === "09") return "september";
    else if (param === "10") return "october";
    else if (param === "11") return "november";
    else if (param === "12") return "december";
  };

  const handleCumbCustomConfig = (param) => {
    if (param && param !== "monthView") {
      navigate(param);
    } else if (!param) {
      setIsYearView(true);
      setBreadCumb([
        {
          title: orgName,
          navigate: user?.role[0] === FP_ADMIN ? "/reports/payouts-list" : null,
          val: "name",
        },
        {
          title: `${selectedDate.getFullYear()}`,
          navigate: null,
          val: "year",
        },
      ]);
    }
  };

  const handleDirectoryClick = (data)=> {
    setIsLoading(true)
    setBreadCumb([
      {
        title: orgName,
        navigate:
          user?.role[0] === FP_ADMIN
            ? "/reports/payouts-list"
            : null,
        val: "name",
      },
      {
        title: `${selectedDate.getFullYear()}`,
        navigate: null,
        val: "year",
      },
      ,
      {
        title: prepareMonthName(data.folder),
        navigate: "monthView",
        val: "month",
      },
    ]);
    setIsYearView(false);
    setSelectedMonth(data.folder);
  }

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
      <div className="payouts-header">
        {/*<Header isDate={true}/>*/}
        <div>
          <div className="header6">{t("label:payouts")}</div>
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {/*{breadcrumbs}*/}
            {breadCumb.map((cumb) => {
              return (
                <span onClick={() => handleCumbCustomConfig(cumb.navigate)} className="cursor-pointer">
                  <p
                    className={`${
                      cumb.val === "name" ||
                      (cumb.val === "year" && !isYearView)
                        ? "payoutBreadCumbSubtitle3Active"
                        : "payoutBreadCumbSubtitle3Regular"
                    }`}
                  >
                    {cumb.title}
                  </p>
                </span>
              );
            })}
          </Breadcrumbs>
        </div>
        {isYearView && (
          <div>
            <DesktopDatePicker
              size="small"
              inputFormat="yyyy"
              views={["year"]}
              components={{
                OpenPickerIcon: ArrowDropDownIcon,
              }}
              value={selectedDate || null}
              onChange={(date) => handleDateChange(date)}
              renderInput={(params) => (
                <TextField size="small" {...params} error={false} type="date" />
              )}
              disableFuture
              // disabled={props.isLoading}
            />
          </div>
        )}
        {!isYearView && (
          <div>
            <Paper className="flex items-center px-10 space-x-8  rounded-md border-1 shadow-0 w-full">
              <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
              <InputBase
                sx={{ ml: 1, flex: 1, width: 320 }}
                placeholder={t("label:searchByName")}
                inputProps={{ "aria-label": "search google maps" }}
                onChange={(ev) => dispatch(setSearchText(ev.target.value))}
              />
            </Paper>
          </div>
        )}
      </div>
      {isYearView && (
        <div className="payouts-bg-container m-16 max-w-7xl">
          <div className="w-1/4">
            <p className="subtitle3 pl-24 pt-24">{dirData.length} {t("label:folders")}</p>
          </div>
          <div className="payouts-parent-container grid grid-cols-2 lg:grid-cols-8 md:grid-cols-8 justify-items-center">
            {dirData.map((data) => {
              return (
                <div
                  className="payouts-container cursor-pointer"
                  onClick={() => {
                    handleDirectoryClick(data)
                  }}
                >
                  <div className="flex flex-col justify-around items-center">
                    <FolderOpenOutlinedIcon
                      color="secondary"
                      sx={{ height: 42, width: 50 }}
                    />
                    <div>
                      <div className="payouts-months">
                        {t(`label:${prepareMonthName(data.folder)}`)}
                      </div>
                      <div className="payouts-count body4">
                        {data.files || 0} {t("label:payouts")}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {!isYearView && <PayoutReports urlData={{
        orgId: orgUuid,
        year: selectedDate.getFullYear(),
        month: selectedMonth,
      }} data={monthViewData}/>}
    </div>
  );
}