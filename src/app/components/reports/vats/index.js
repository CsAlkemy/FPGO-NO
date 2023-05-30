import "./vatReports.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { t } from "i18next";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { Controller, useForm } from "react-hook-form";
import { DesktopDatePicker, LoadingButton } from "@mui/lab";
import { Autocomplete, Button, MenuItem, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import AddIcon from "@mui/icons-material/Add";
import ReportService from "../../../data-access/services/reportService/ReportService";
import { CSVLink } from "react-csv";

export default function VatReports() {
  const params = useParams();
  const orgUuid = params.uuid;
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  // const orgName =
  //   location?.state?.orgName || user.user_data.organization.name || "Not found";
  const { t } = useTranslation();
  const [clientsList, setClientsList] = useState([]);
  const [searchCustomersList, setSearchCustomersList] = useState([]);
  const [isDefault, setIsDefault] = useState(true);
  const currentDate = new Date();
  const prepareEndDate = `${
    currentDate.getDate() < 10
      ? `0${currentDate.getDate() + 1}`
      : currentDate.getDate()
  }${
    currentDate.getMonth() < 10
      ? `0${currentDate.getMonth() + 1}`
      : currentDate.getMonth() + 1
  }${currentDate.getFullYear()}`;
  const prepareStartDate = `${
    currentDate.getDate() - (currentDate.getDate() - 1) < 10
      ? `0${currentDate.getDate() - (currentDate.getDate() - 1)}`
      : currentDate.getDate() - (currentDate.getDate() - 1)
  }${
    currentDate.getMonth() < 10
      ? `0${currentDate.getMonth() + 1}`
      : currentDate.getMonth() + 1
  }${currentDate.getFullYear()}`;
  const defaultStartDate = `${currentDate.getMonth() + 1}, ${
    currentDate.getDate() - (currentDate.getDate() - 1)
  }, ${currentDate.getFullYear()}`;
  const defaultEndDate = `${
    currentDate.getMonth() + 1
  }, ${currentDate.getDate()}, ${currentDate.getFullYear()}, ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
  const [fromDate, setFromDate] = useState(
    new Date(defaultStartDate).getTime() / 1000
  );
  const [toDate, setToDate] = useState(
    new Date(defaultEndDate).getTime() / 1000
  );
  const [preparedStartDate, setPreparedStartDate] = useState(prepareStartDate);
  const [preparedEndDate, setPreparedEndDate] = useState(prepareEndDate);
  const [customerSearchBoxLength, setCustomerSearchBoxLength] = useState(0);
  const [customerSearchBy, setCustomerSearchBy] = useState(undefined);
  const [orgId, setOrgId] = useState("");
  const [orgDetails, setOrgDetails] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const headers = [
    { label: "Order status", key: "status" },
    { label: "OrderID", key: "orderId" },
    { label: "OrderDate", key: "orderDate" },
    { label: "Duedate", key: "dueDate" },
    { label: "Customer name", key: "customerName" },
    { label: "CustomerID", key: "customerId" },
    { label: "Bokføringskonto", key: "bookKeepingAccount" },
    { label: "Beløp in mva", key: "productAmount" },
    { label: "MVA %", key: "vat" },
    { label: "MVA", key: "vatCode" },
    { label: "Type payment", key: "paymentType" },
    { label: "Description", key: "description" },
    { label: "Product number", key: "productNumber" },
    { label: "Credittcheck", key: "creditCheck" },
  ];
  const [isDisable, setIsDisable] = useState(true);
  const downloadCsvRef = useRef(null);
  // const startDate = new Date(1667278800).getTime()

  const { control, formState, handleSubmit, reset, setValue, watch } = useForm({
    mode: "onChange",
    // defaultValue,
    // resolver: yupResolver(validateSchema),
  });
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    if (isLoading) {
      ClientService.approvedClientList()
        .then((response) => {
          let data = [];
          setClientsList(response);
          response
            .filter((item) => {
              return item.status === "Active";
            })
            .map((row) => {
              return data.push({
                uuid: row.uuid,
                name: row?.name ? row?.name : null,
                orgId: row?.orgId || null,
                searchString: row?.name + " ( " + row?.orgId + ")",
              });
            });
          setClientsList(data);
          setSearchCustomersList(data);
        })
        .catch((e) => {
          setClientsList([]);
        });
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const fromD = new Date(fromDate * 1000);
    const toD = new Date(toDate * 1000);
    const oneMonthMax =
      new Date(
        `${
          fromD.getMonth() + 2
        }.${fromD.getDate()}.${fromD.getFullYear()} 00:00`
      ).getTime() / 1000;
    if (toDate > oneMonthMax) setIsDisable(true);
    else setIsDisable(false);
  }, [fromDate, toDate]);

  const disableBeforeOfStartDate = (date) => {
    const paramDate = date.getTime() / 1000;
    const preparedToDate = new Date(fromDate * 1000);
    const oneMonthMax =
      new Date(
        `${
          preparedToDate.getMonth() + 2
        }.${preparedToDate.getDate()}.${preparedToDate.getFullYear()} 00:00`
      ).getTime() / 1000;
    return fromDate > paramDate || paramDate > oneMonthMax;
  };

  const disableAfterOfEndDate = (date) => {
    const paramDate = date.getTime() / 1000;
    return toDate < paramDate;
  };

  const searchCustomerOnFocus = (e) => {
    const searchByOrgId =
      clientsList.filter((customer) =>
        customer.orgId.startsWith(e.target.value)
      ) || [];
    const searchByName =
      clientsList.filter(
        (customer) =>
          customer?.name &&
          customer.name.toLowerCase().startsWith(e.target.value.toLowerCase())
      ) || [];
    setSearchCustomersList(
      searchByName.length
        ? searchByName
        : searchByOrgId.length
          ? searchByOrgId
          : []
    );
    setCustomerSearchBy(
      searchByName.length ? "name" : searchByOrgId.length ? "orgId" : undefined
    );
    setCustomerSearchBoxLength(e.target.value.length);
  };

  const handleExportVatReports = () => {
    const params = {
      orgId:
      // user.role[0] !== FP_ADMIN ? user?.user_data?.organization?.uuid : orgId,
        user.role[0] !== FP_ADMIN
          ? user?.user_data?.organization?.uuid
          : orgDetails.uuid,
      startTime: fromDate,
      endTime: toDate,
    };
    if (!isLoading) {
      setLoading(true);
      ReportService.getVatReportCsvData(params)
        .then((res) => {
          setCsvData(res);
          setTimeout(() => {
            downloadCsvRef.current.link.click();
            setLoading(false);
          }, 500);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <div className="payouts-header">
        <div>
          <div className="header6">{t("label:vatReports")}</div>
          <div className="subtitle3" style={{ color: "#838585" }}>
            {t("label:selectDateRangeToDownloadVatReport")}
          </div>
        </div>
      </div>
      <div className="vat-rates-bg-container m-16 flex justify-center justify-items-center p-16">
        <div className="vat-reports-rang-picker-container rounded-md py-24 px-8">
          {user.role[0] === FP_ADMIN && (
            <div className="w-full">
              <Controller
                control={control}
                name="searchCustomer"
                render={({ field: { ref, onChange, ...field } }) => (
                  <Autocomplete
                    freeSolo
                    options={searchCustomersList}
                    // forcePopupIcon={<Search />}
                    getOptionLabel={(option) => option.searchString}
                    className="px-10"
                    fullWidth
                    onChange={(_, data) => {
                      setCustomerSearchBoxLength(0);
                      if (data) {
                        setOrgDetails(data);
                        setOrgId(data?.uuid || "");
                        setCustomerSearchBy(undefined);
                        setCustomerSearchBoxLength(0);
                        // } else setOrgId("");
                      } else setOrgDetails([]);
                      return onChange(data);
                    }}
                    onInputChange={(event, value) => {
                      if (value.length === 0) setCustomerSearchBy(undefined);
                    }}
                    renderOption={(props, option, { selected }) => (
                      <MenuItem {...props}>
                        {/*{`${option.name}`}*/}
                        {customerSearchBy ? (
                          <div>
                            {customerSearchBy === "orgId" &&
                            option?.orgId &&
                            customerSearchBoxLength > 0 ? (
                              <div>
                                <span
                                  style={{ color: "#0088AE" }}
                                >{`${option.orgId.slice(
                                  0,
                                  customerSearchBoxLength
                                )}`}</span>
                                <span>{`${option.orgId.slice(
                                  customerSearchBoxLength
                                )}`}</span>
                              </div>
                            ) : (
                              <div>{`${option.orgId}`}</div>
                            )}
                            {customerSearchBy === "name" &&
                            customerSearchBoxLength > 0 ? (
                              <div>
                                <span
                                  style={{ color: "#0088AE" }}
                                >{`${option.name.slice(
                                  0,
                                  customerSearchBoxLength
                                )}`}</span>
                                <span>{`${option.name.slice(
                                  customerSearchBoxLength
                                )}`}</span>
                              </div>
                            ) : (
                              <div>{`${option.name}`}</div>
                            )}
                          </div>
                        ) : (
                          <div>
                            <div>{`${option.orgId}`}</div>
                            <div>{`${option.name}`}</div>
                          </div>
                        )}
                      </MenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        id="searchBox"
                        {...params}
                        {...field}
                        // className="px-10"
                        inputRef={ref}
                        onChange={searchCustomerOnFocus}
                        // placeholder="Search by Name or Phone Number"
                        placeholder={t("label:searchByNameOrPhoneNo")}
                        label={t("label:client")}
                        required
                      />
                    )}
                  />
                )}
              />
            </div>
          )}
          <div
            className={`${
              user.role[0] !== FP_ADMIN ? "pb-24" : "py-32"
            } grid grid-cols-1 md:grid-cols-2 sm: pb-12 w-full`}
          >
            <Controller
              name="checkIn"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <DesktopDatePicker
                  mask=""
                  label={t("label:dateFrom")}
                  inputFormat="dd.MM.yyyy"
                  value={value || new Date(defaultStartDate)}
                  onChange={(date) => {
                    setFromDate(date.getTime() / 1000);
                    setPreparedStartDate(
                      `${
                        date.getDate() < 10
                          ? `0${date.getDate()}`
                          : date.getDate()
                      }${
                        date.getMonth() + 1 < 10
                          ? `0${date.getMonth() + 1}`
                          : date.getMonth() + 1
                      }${date.getFullYear()}`
                    );
                    return onChange(date);
                  }}
                  PopperProps={{
                    sx: {
                      "& .MuiCalendarPicker-root .MuiButtonBase-root.MuiPickersDay-root":
                        {
                          borderRadius: "8px",
                          "&.Mui-selected": {
                            backgroundColor: "#c9eee7",
                            color: "#323434",
                          },
                        },
                    },
                  }}
                  disableFuture
                  shouldDisableDate={disableAfterOfEndDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onBlur={onBlur}
                      type="date"
                      className="range-picker"
                    />
                  )}
                />
              )}
            />
            <Controller
              name="checkOut"
              control={control}
              render={({ field: { onChange, value, onBlur } }) => (
                <DesktopDatePicker
                  label={t("label:dateTo")}
                  mask=""
                  inputFormat="dd.MM.yyyy"
                  value={value || new Date(defaultEndDate)}
                  // onChange={onChange}
                  onChange={(date) => {
                    setToDate(date.getTime() / 1000);
                    setPreparedEndDate(
                      `${
                        date.getDate() < 10
                          ? `0${date.getDate()}`
                          : date.getDate()
                      }${
                        date.getMonth() + 1 < 10
                          ? `0${date.getMonth() + 1}`
                          : date.getMonth() + 1
                      }${date.getFullYear()}`
                    );
                    return onChange(date);
                  }}
                  PopperProps={{
                    sx: {
                      "& .MuiCalendarPicker-root .MuiButtonBase-root.MuiPickersDay-root":
                        {
                          borderRadius: "8px",
                          "&.Mui-selected": {
                            backgroundColor: "#c9eee7",
                            color: "#323434",
                          },
                        },
                    },
                  }}
                  disableFuture
                  shouldDisableDate={disableBeforeOfStartDate}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      onBlur={onBlur}
                      type="date"
                      className="range-picker"
                    />
                  )}
                />
              )}
            />
          </div>
          <div className="w-full px-10">
            <LoadingButton
              variant="contained"
              color="secondary"
              className="rounded-4 w-full"
              loading={loading}
              onClick={() => handleExportVatReports()}
              disabled={
                (user.role[0] === FP_ADMIN && !orgDetails.uuid) || isDisable
              }
            >
              {t("label:downloadReport")}
            </LoadingButton>
          </div>
          <div className="w-full px-10 hidden">
            <CSVLink
              data={csvData}
              headers={headers}
              filename={
                user.role[0] !== FP_ADMIN
                  ? `MVA-rapporter_${preparedStartDate}_${preparedEndDate}`
                  : `${orgDetails.name}_MVA-rapporter_${preparedStartDate}_${preparedEndDate}`
              }
              ref={downloadCsvRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
}