import { yupResolver } from "@hookform/resolvers/yup";
import { ClickAwayListener } from "@mui/base";
import { Search } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Cancel from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import EventIcon from "@mui/icons-material/Event";
import RedoIcon from "@mui/icons-material/Redo";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import SendIcon from "@mui/icons-material/Send";
import {
  DesktopDatePicker,
  DesktopDateTimePicker,
  LoadingButton,
} from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Hidden,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import DiscardConfirmModal from "../../common/confirmDiscard";
import {
  CreateOrderDefaultValue,
  validateSchemaCreateOrderCorporate,
  validateSchemaCreateOrderCorporateOrderBySms,
  validateSchemaCreateOrderPrivate,
  validateSchemaCreateOrderPrivateOrderByEmail,
} from "../utils/helper";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import { useCreateOrderMutation } from "app/store/api/apiSlice";
import UtilsServices from "../../../data-access/utils/UtilsServices";
import AuthService from "../../../data-access/services/authService";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { es, nn, nb } from "date-fns/locale";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const ReservationCreate = () => {
    const { t } = useTranslation();
  const userInfo = UtilsServices.getFPUserData();
  const [open, setOpen] = React.useState(false);
  const [expanded1, setExpanded1] = React.useState(false);
  const [expanded0, setExpanded0] = React.useState(false);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [expandedPanel2, setExpandedPanel2] = React.useState(false);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedFromList, setSelectedFromList] = useState(null);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [customDateDropDown, setCustomDateDropDown] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recheckSchema, setRecheckSchema] = useState(true);
  const [itemLoader, setItemLoader] = useState(false);
  const [customerSearchBoxLength, setCustomerSearchBoxLength] = useState(0);
  const [customerSearchBy, setCustomerSearchBy] = useState(undefined);
  const [createOrder, response] = useCreateOrderMutation();
  setCustomDateDropDown;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let grandTotal = 0;
  let amount = 0;
  const date = new Date();
  const [customData, setCustomData] = React.useState({
    orderBy: "sms",
    paymentMethod: ["visa", "mastercard", "vipps", "invoice"],
    isCeditCheck: false,
    customerType: "private",
  });
  const [countries, setCountries] = React.useState([
    {
      title: "Norway",
      name: "norway",
    },
    {
      title: "Sweden",
      name: "sweden",
    },
  ]);

  const [addOrderIndex, setAddOrderIndex] = React.useState([0, 1, 2]);
  // const [addOrderIndex, setAddOrderIndex] = React.useState([ 0 ]);

  const [taxes, setTaxes] = React.useState([]);

  const activeSchema = () => {
    if (
      (customData.orderBy === "sms" && customData.customerType === "private") ||
      (customData.orderBy === "invoice" &&
        customData.customerType === "private")
    )
      return validateSchemaCreateOrderPrivate;
    else if (
      customData.orderBy === "email" &&
      customData.customerType === "private"
    )
      return validateSchemaCreateOrderPrivateOrderByEmail;
    else if (
      (customData.orderBy === "email" &&
        customData.customerType === "corporate") ||
      (customData.orderBy === "invoice" &&
        customData.customerType === "corporate")
    )
      return validateSchemaCreateOrderCorporate;
    else if (
      customData.orderBy === "sms" &&
      customData.customerType === "corporate"
    )
      return validateSchemaCreateOrderCorporateOrderBySms;
  };
  let schema = activeSchema();
  useEffect(() => {
    schema = activeSchema();
    if (recheckSchema) {
      if (customData.customerType === "corporate") {
        clearErrors(["pNumber", "orgID"]);
        setValue("orgID", "", { shouldValidate: true });
        setError("orgID", { type: "focus" }, { shouldFocus: true });
      } else {
        setValue("pNumber", "", { shouldValidate: true });
        clearErrors(["pNumber", "orgID"]);
      }
    }
  }, [customData.customerType]);

  const {
    control,
    formState,
    handleSubmit,
    getValues,
    reset,
    watch,
    setValue,
    resetField,
    getFieldState,
    trigger,
    setError,
    setFocus,
    clearErrors,
  } = useForm({
    mode: "all",
    CreateOrderDefaultValue,
    // reValidateMode: "all",
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const searchCustomerOnFocus = (e) => {
    const searchByPhone =
      customersList.filter((customer) =>
        customer.phone.startsWith(e.target.value)
      ) || [];
    const searchByName =
      customersList.filter((customer) =>
        customer?.name && customer.name.toLowerCase().startsWith(e.target.value.toLowerCase())
      ) || [];
    setCustomerSearchBy(
      searchByName.length ? "name" : searchByPhone.length ? "phone" : undefined
    );
    setCustomerSearchBoxLength(e.target.value.length);
  };

  const onSubmit = (values) => {
    setLoading(true);
    subTotal = (subTotal / 2).toFixed(2);
    totalTax = (totalTax / 2).toFixed(2);
    totalDiscount = (totalDiscount / 2).toFixed(2);
    grandTotal = (grandTotal / 2).toFixed(2);
    const data = OrdersService.prepareCreateOrderPayload({
      ...values,
      ...customData,
      orderSummary: {
        subTotal,
        totalTax,
        totalDiscount,
        grandTotal,
      },
    });
    createOrder(data).then((response) => {
      setLoading(false);
      if (response?.data?.status_code === 201) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), {
          variant: "success",
        });
        navigate(`/sales/orders-list`);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
        });
      }
    });
  };

  let defaultTaxValue;

  const disableCurrentProductRow = (index) => {
    setDisableRowIndexes([...disableRowIndexes, index]);
  };
  const enableCurrentProductRow = (ind) => {
    setDisableRowIndexes(disableRowIndexes.filter((item) => item !== ind));
  };
  const productWiseTotal = (index) => {
    const watchQuantity = watch(`order[${index}].quantity`);
    const watchRate = watch(`order[${index}].rate`);
    const watchDiscount = watch(`order[${index}].discount`) || 0;
    const watchTax = watch(`order[${index}].tax`);
    const watchName = watch(`order[${index}].productName`);
    const watchId = watch(`order[${index}].productID`);

    // Vat Inclusive Calculation
    // Subtotal : (Qty*Rate*100%)/(100+Tax)%
    // Tax : subtotal * (tax/100)
    //Amount : (Rate * Qty) - discount
    //Discount : Sum of discounts
    //Grand Total : Sum of amounts
    let rate, splitedRate, dotFormatRate, floatRate;
    if (!!watchRate) {
      rate = watchRate;
      splitedRate = rate.toString().includes(",") ? rate.split(",") : rate;
      dotFormatRate =
        typeof splitedRate === "object"
          ? `${splitedRate[0]}.${splitedRate[1]}`
          : splitedRate;
      floatRate = parseFloat(dotFormatRate);
    }

    const total =
      parseInt(watchQuantity) * floatRate - parseFloat(watchDiscount);
    const subTotalCalculation =
      (parseInt(watchQuantity) * floatRate) / ((100 + watchTax) / 100);
    const totalTaxCalculation = subTotalCalculation
      ? (subTotalCalculation * (watchTax / 100)) / 2
      : 0;

    if (totalTaxCalculation) totalTax = totalTax + totalTaxCalculation;
    if (subTotalCalculation)
      subTotal = subTotal + parseFloat(subTotalCalculation);
    if (totalTaxCalculation) totalTax = totalTax + totalTaxCalculation;
    if (watchDiscount)
      totalDiscount = totalDiscount + parseFloat(watchDiscount);
    if (total) grandTotal = grandTotal + total;
    if (total > 0) {
      return ` ${total}`;
    }
  };

  const addNewOrder = () => {
    // setAddOrderIndex([...addOrderIndex, addOrderIndex.length]);
    setItemLoader(true);
    setAddOrderIndex([...addOrderIndex, Math.max(...addOrderIndex) + 1]);
    setValue(`order[${Math.max(...addOrderIndex) + 1}].productName`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].productID`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].quantity`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].rate`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].discount`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].tax`, "");
    setTimeout(() => {
      setItemLoader(false);
    }, [500]);
  };
  const onDelete = (index) => {
    setItemLoader(true);
    //resetField(``)
    setValue(`order[${index}].productName`, "");
    setValue(`order[${index}].productID`, "");
    setValue(`order[${index}].quantity`, "");
    setValue(`order[${index}].rate`, "");
    setValue(`order[${index}].discount`, "");
    setValue(`order[${index}].tax`, "");
    enableCurrentProductRow(index);
    addOrderIndex.length > 1
      ? setAddOrderIndex(addOrderIndex.filter((i) => i !== index))
      : setAddOrderIndex([...addOrderIndex]);
    setTimeout(() => {
      setItemLoader(false);
    }, [500]);
  };
  const onSameRowAction = (index) => {
    setValue(`order[${index}].productName`, "");
    resetField(`order[${index}].productName`);
    resetField(`order[${index}].productID`);
    resetField(`order[${index}].quantity`);
    resetField(`order[${index}].rate`);
    resetField(`order[${index}].discount`);
    resetField(`order[${index}].tax`);

    setValue(`order[${index}].productName`, "");
    setValue(`order[${index}].productID`, "");
    setValue(`order[${index}].quantity`, "");
    setValue(`order[${index}].rate`, "");
    setValue(`order[${index}].discount`, "");
    setValue(`order[${index}].tax`, "");
    enableCurrentProductRow(index);
  };

  const watchOrderDate = watch(`orderDate`)
    ? watch(`orderDate`)
    : setValue("orderDate", new Date());
  const watchDueDatePaymentLink = watch(`dueDatePaymentLink`);

  useEffect(() => {
    setValue(
      "dueDatePaymentLink",
      new Date().setDate(
        watchOrderDate && watchOrderDate.getDate() >= new Date().getDate()
          ? watchOrderDate.getDate() + 2
          : new Date().getDate() + 2
      )
    );
  }, [watch(`orderDate`)]);

  useEffect(() => {
    AuthService.axiosRequestHelper().then((isAuthenticated) => {
      ProductService.productsList(true)
        .then((res) => {
          let data = [];
          if (res?.status_code === 200 && res.length) {
            res
              .filter((r) => r.status === "Active")
              .map((row) => {
                return data.push({
                  uuid: row.uuid,
                  name: row.name,
                  id: row.id,
                  price: row.pricePerUnit,
                  tax: row.taxRate,
                });
              });
          }
          setProductsList(data);
        })
        .catch((e) => {
          setProductsList([]);
        });
      CustomersService.customersList(true)
        .then((res) => {
          let data = [];
          if (res?.status_code === 200 && res.length) {
            res
              .filter((item) => {
                return item.status === "Active";
              })
              .map((row) => {
                return data.push({
                  uuid: row.uuid,
                  name: row?.name ? row?.name : null,
                  orgOrPNumber: row?.orgIdOrPNumber
                    ? row?.orgIdOrPNumber
                    : null,
                  email: row?.email ? row?.email : null,
                  phone: row?.phone ? row?.phone : null,
                  type: row.type,
                  street: row?.street,
                  city: row?.city,
                  zip: row?.zip,
                  country: row?.country,
                  searchString: row?.name + " ( " + row?.phone + ` - ${row.type} )`,
                });
              });
          }
          setCustomersList(data);
        })
        .catch((e) => {
          setCustomersList([]);
        });
      if (userInfo?.user_data?.organization?.uuid) {
        ClientService.vateRatesList(
          userInfo?.user_data?.organization?.uuid,
          true
        )
          .then((res) => {
            if (res?.status_code === 200) {
              setTaxes(res?.data);
            } else {
              setTaxes([]);
            }
          })
          .catch((e) => {
            setTaxes([]);
          });
      }
    });
  }, []);

  const pnameOnBlur = (e) => {
    if (!e.target.value.length) {
      resetField(`${e.target.name}`);
    }
  };

  const prepareDate = (dayCount, dateRef) => {
    const date = new Date(
      dateRef === 1
        ? watchOrderDate && watchOrderDate.getDate() >= new Date().getDate()
          ? watchOrderDate
          : new Date()
        : watchDueDatePaymentLink
    );
    const lastDayOfMonthCalculation = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    );
    const lastDayOfMonth = lastDayOfMonthCalculation.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const day = parseInt(date.getDate()) + parseInt(dayCount);
    const updatedDay = day > lastDayOfMonth ? day - lastDayOfMonth : day;
    const nextMonth = day > lastDayOfMonth;
    const monthIndex = nextMonth ? date.getMonth() + 1 : date.getMonth();
    const monthName = monthNames[monthIndex];
    const year = date.getFullYear();
    return new Date(
      `${updatedDay}. ${monthName}.${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    );
  };

    return (
        <>
          <form
            name="createReservationForm"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
        >
              <div className="reservation-create-form">
                <div className="reserv-header-click-to-action">
                  <div className=" header-click-to-action">
                      <div className="header-text header6  flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                      Create Reservation
                      </div>
                      <Hidden smDown>
                          <div className="button-container-product">
                          <Button
                              color="secondary"
                              variant="outlined"
                              className="button-outline-product"
                              onClick={() => setOpen(true)}
                          >
                              {t("label:discard")}
                          </Button>
                          <LoadingButton
                              color="secondary"
                              variant="contained"
                              className="font-semibold rounded-4 w-full sm:w-auto"
                              type="submit"
                              // disabled={!(isValid && customData.paymentMethod.length)}
                              disabled={!isValid}
                              startIcon={<SendIcon />}
                              loading={loading}
                              loadingPosition="center"
                          >
                              {t("label:sendOrder")}
                          </LoadingButton>
                          </div>
                      </Hidden>
                  </div>
                </div>
                <div className="main-content-wrap px-28">
                  <div className="search-customer-order-create my-32">
                      <Controller
                      control={control}
                      name="searchCustomer"
                      render={({
                          field: { ref, onChange, ...field },
                      }) => (
                          <Autocomplete
                          freeSolo
                          options={customersList}
                          //forcePopupIcon={<Search />}
                          getOptionLabel={(option) => option.searchString}
                          className=""
                          fullWidth
                          onChange={(_, data) => {
                              if (data) {
                              clearErrors(["pNumber", "orgID"]);
                              setRecheckSchema(false);
                              setCustomerSearchBy(undefined);
                              setCustomerSearchBoxLength(0);
                              setValue("primaryPhoneNumber", data.phone);
                              setValue("email", data.email);
                              setValue("customerName", data.name);
                              data.type === "Corporate"
                                  ? setValue("orgID", data.orgOrPNumber)
                                  : setValue("pNumber", data.orgOrPNumber);
                              setValue("billingAddress", data.street);
                              setValue("billingZip", data.zip);
                              setValue("billingCity", data.city);
                              setValue("billingCountry", data.country);
                              data.type === "Corporate"
                                  ? setCustomData({
                                      ...customData,
                                      customerType: "corporate",
                                  })
                                  : setCustomData({
                                      ...customData,
                                      customerType: "private",
                                  });
                              // data.type === "Corporate"
                              //   ? setSelectedFromList("Corporate")
                              //   : setSelectedFromList("Private");
                              } else {
                              setValue("primaryPhoneNumber", "");
                              setValue("email", "");
                              setValue("customerName", "");
                              setValue("orgID", "");
                              setValue("pNumber", "");
                              setValue("billingAddress", "");
                              setValue("billingZip", "");
                              setValue("billingCity", "");
                              setValue("billingCountry", "");
                              // setSelectedFromList(null);
                              }
                              return onChange(data);
                          }}
                          renderOption={(props, option, { selected }) => (
                              <MenuItem {...props}>
                              {/*{`${option.name}`}*/}
                              {customerSearchBy ? (
                                  <div>
                                  {customerSearchBy === "name" && option?.name &&
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
                                  {customerSearchBy === "phone" &&
                                  customerSearchBoxLength > 0 ? (
                                      <div>
                                      <span
                                          style={{ color: "#0088AE" }}
                                      >{`${option.phone.slice(
                                          0,
                                          customerSearchBoxLength
                                      )}`}</span>
                                      <span>{`${option.phone.slice(
                                          customerSearchBoxLength
                                      )}`}</span>
                                      </div>
                                  ) : (
                                      <div>{`${option.phone}`}</div>
                                  )}
                                  </div>
                              ) : (
                                  <div>
                                  <div>{`${option.name}`}</div>
                                  <div>{`${option.phone}`}</div>
                                  </div>
                              )}
                              </MenuItem>
                          )}
                          renderInput={(params) => (
                              <TextField
                              id="searchBox"
                              {...params}
                              {...field}
                              //className='custom-input-height-div'
                              inputRef={ref}
                              onChange={searchCustomerOnFocus}
                              // placeholder="Search by Name or Phone Number"
                              placeholder="Search customers by name or phone number"
                              // InputProps={{
                              //     startAdornment: (
                              //         <InputAdornment position="end">
                              //           <Search />
                              //         </InputAdornment>
                              //     ),
                              // }}
                              />
                          )}
                          />
                      )}
                      />
                  </div>

                  <div className="create-order-date-container">
                    <div className="flex flex-col gap-5">
                      <Controller
                        name="orderDate"
                        control={control}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <DesktopDatePicker
                            label={t("label:orderDate")}
                            mask=""
                            inputFormat="dd.MM.yyyy"
                            value={!value ? new Date() : value}
                            required
                            // onChange={onChange}
                            onChange={onChange}
                            minDate={new Date().setDate(
                              new Date().getDate() - 30
                            )}
                            maxDate={new Date().setDate(
                              new Date().getDate() + 30
                            )}
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
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                onBlur={onBlur}
                                required
                                type="date"
                                error={!!errors.orderDate}
                                helperText={
                                  errors?.orderDate?.message
                                    ? t(
                                        `validation:${errors?.orderDate?.message}`
                                      )
                                    : ""
                                }
                                sx={{
                                  svg: { color: "#69C77E" },
                                }}
                              />
                            )}
                          />
                        )}
                      />
                      {/*<Tooltip*/}
                      {/*  placement="bottom"*/}
                      {/*  title="Sagittis risus quis lacus, lacus. Molestie enim, eleifend massa semper risus amet justo diam enim. Enim turpis ornare non nisl morbi mauris at habitant."*/}
                      {/*>*/}
                      {/*  <div className="flex gap-5 body4 text-primary-500 cursor-pointer">*/}
                      {/*    <ErrorIcon className="icon-size-14 my-auto " />*/}
                      {/*    {t("label:whatIsThis")}*/}
                      {/*  </div>*/}
                      {/*</Tooltip>*/}
                    </div>
                    <div className="flex flex-col gap-5">
                      <Controller
                        name="dueDatePaymentLink"
                        control={control}
                        render={({ field: { onChange, value, onBlur } }) => (
                          <ClickAwayListener
                            onClickAway={() =>
                              datePickerOpen
                                ? setDatePickerOpen(false)
                                : setCustomDateDropDown(false)
                            }
                          >
                            <div className="create-order-due-date w-full">
                              <DesktopDateTimePicker
                                label={t("label:dueDateForPaymentLink")}
                                // inputFormat="dd MMM, yyyy HH:mm"
                                mask=""
                                inputFormat="dd.MM.yyyy HH:mm"
                                autoFocus
                                ampm={false}
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
                                disableOpenPicker
                                value={
                                  !value
                                    ? new Date().setDate(new Date().getDate() + 2)
                                    : value
                                  // : value
                                }
                                required
                                open={datePickerOpen}
                                disabled={!watchOrderDate}
                                minDate={
                                  watchOrderDate
                                    ? new Date().setDate(
                                        watchOrderDate.getDate() + 1
                                      )
                                    : new Date().setDate(
                                        new Date().getDate() - 30
                                      )
                                }
                                disablePast={true}
                                onChange={(_) => {
                                  let utc =
                                    _.getTime() + _.getTimezoneOffset() * 60000;
                                  let nd = new Date(
                                    utc + 3000000 * new Date().getTimezoneOffset()
                                  );
                                  return onChange(_);
                                  // return onChange(nd)
                                }}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    onBlur={onBlur}
                                    type="date"
                                    required
                                    fullWidth
                                    onFocus={() =>
                                      setCustomDateDropDown(!customDateDropDown)
                                    }
                                    error={!!errors.dueDatePaymentLink}
                                    helperText={
                                      errors?.dueDatePaymentLink?.message
                                        ? t(
                                            `validation:${errors?.dueDatePaymentLink?.message}`
                                          )
                                        : ""
                                    }
                                    sx={{
                                      svg: {
                                        color: "#E7AB52",
                                        cursor: "pointer",
                                      },
                                    }}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment
                                          position="end"
                                          onClick={() =>
                                            setCustomDateDropDown(true)
                                          }
                                        >
                                          <EventIcon />
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                )}
                              />
                              {customDateDropDown && (
                                <div
                                  className="absolute bg-white max-h-min rounded-4 shadow-4 w-9/12 z-999"
                                  // onMouseLeave={() =>
                                  //   setCustomDateDropDown(!customDateDropDown)
                                  // }
                                  onClick={() => setCustomDateDropDown(false)}
                                >
                                  <ul className="">
                                    <li
                                      className="body2 py-14 px-10 cursor-pointer hover:bg-primary-50"
                                      onClick={() =>
                                        setValue(
                                          "dueDatePaymentLink",
                                          prepareDate(1, 1)
                                        )
                                      }
                                    >
                                      {t("label:inTwentyFourHour")}
                                    </li>
                                    <li
                                      className="body2 py-14 px-10 cursor-pointer hover:bg-primary-50"
                                      onClick={() =>
                                        setValue(
                                          "dueDatePaymentLink",
                                          prepareDate(3, 1)
                                        )
                                      }
                                    >
                                      {t("label:inThreeDays")}
                                    </li>
                                    <li
                                      className="body2 py-14 px-10 cursor-pointer hover:bg-primary-50"
                                      onClick={() =>
                                        setValue(
                                          "dueDatePaymentLink",
                                          prepareDate(7, 1)
                                        )
                                      }
                                    >
                                      {t("label:inSevenDays")}
                                    </li>
                                    <li
                                      className="body2 py-14 px-10 cursor-pointer hover:bg-primary-50"
                                      onClick={() =>
                                        setValue(
                                          "dueDatePaymentLink",
                                          prepareDate(15, 1)
                                        )
                                      }
                                    >
                                      {t("label:inFifteenDays")}
                                    </li>
                                  </ul>
                                  <div
                                    className="flex justify-between items-center py-14 px-10 hover:bg-MonochromeGray-50 cursor-pointer"
                                    onClick={() =>
                                      setDatePickerOpen(!datePickerOpen)
                                    }
                                  >
                                    <div className="flex items-center">
                                      <div className="button2">
                                        {t("label:customDate")}
                                      </div>
                                      <CheckIcon className="icon-size-14 text-teal-500" />
                                    </div>
                                    <ArrowForwardIosIcon className="icon-size-20 self-end" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </ClickAwayListener>
                        )}
                      />
                      {/*<Tooltip*/}
                      {/*  placement="bottom"*/}
                      {/*  title="Sagittis risus quis lacus, lacus. Molestie enim, eleifend massa semper risus amet justo diam enim. Enim turpis ornare non nisl morbi mauris at habitant."*/}
                      {/*>*/}
                      {/*  <div className="flex gap-5 body4 text-primary-500 cursor-pointer">*/}
                      {/*    <ErrorIcon className="icon-size-14 my-auto " />*/}
                      {/*    {t("label:whatIsThis")}*/}
                      {/*  </div>*/}
                      {/*</Tooltip>*/}
                    </div>
                    <div className="flex flex-col gap-5">
                      <Controller
                        name="referenceNumber"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:referenceNo")}
                            type="number"
                            autoComplete="off"
                            error={!!errors.referenceNumber}
                            helperText={
                              errors?.referenceNumber?.message
                                ? t(
                                    `validation:${errors?.referenceNumber?.message}`
                                  )
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                            inputlabelprops={{
                              shrink:
                                !!field.value ||
                                touchedFields.referenceNumber,
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-5">
                      <Controller
                        name="customerReference"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:customerReference")}
                            type="text"
                            autoComplete="off"
                            error={!!errors.customerReference}
                            helperText={
                              errors?.customerReference?.message
                                ? t(
                                    `validation:${errors?.customerReference?.message}`
                                  )
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                            inputlabelprops={{
                              shrink:
                                !!field.value ||
                                touchedFields.customerReference,
                            }}
                          />
                        )}
                      />
                    </div>
                    <div></div>
                  </div>

                  <div className="create-order-send-order-conf">
                    <div className="send-order-by">
                      <div className="caption2 text-MonochromeGray-300">
                        {t("label:sendOrderBy")}
                      </div>
                      <div className="create-order-radio">
                        <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-20 w-full md:w-3/4 my-32 mt-10">
                          <Button
                            variant="outlined"
                            className={`body2 ${
                              customData?.orderBy === "sms"
                                ? "create-order-capsule-button-active"
                                : "create-order-capsule-button"
                            }`}
                            onClick={() => {
                              !customData.paymentMethod.includes("invoice")
                                ? setCustomData({
                                    ...customData,
                                    orderBy: "sms",
                                    isCeditCheck: false,
                                  })
                                : setCustomData({
                                    ...customData,
                                    orderBy: "sms",
                                  });
                            }}
                          >
                            {t("label:sms")}
                          </Button>
                          <Button
                            variant="outlined"
                            className={`body2 ${
                              customData?.orderBy === "email"
                                ? "create-order-capsule-button-active"
                                : "create-order-capsule-button"
                            }`}
                            onClick={() => {
                              !customData.paymentMethod.includes("invoice")
                                ? setCustomData({
                                    ...customData,
                                    orderBy: "email",
                                    isCeditCheck: false,
                                  })
                                : setCustomData({
                                    ...customData,
                                    orderBy: "email",
                                  });
                            }}
                          >
                            {t("label:email")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Hidden smDown>
                    <div className="product-list">
                      <div className="my-10 product-list-grid-container product-list-grid-container-height bg-primary-25 subtitle3 gap-10 px-10">
                        <div className="my-auto text-MonochromeGray-500">
                        Item Name
                        </div>
                        <div className="my-auto text-MonochromeGray-500">
                          {t("label:productIdOptional")}
                        </div>
                        <div className="my-auto text-right text-MonochromeGray-500">
                        Reservation Amount
                        </div>
                        <div className="my-auto text-center text-MonochromeGray-500">
                          {t("label:tax")}
                        </div>
                        <div className="my-auto text-right text-MonochromeGray-500">
                        Total Reservation
                        </div>
                        <div className="my-auto"></div>
                      </div>
                      {addOrderIndex.map((index) => (
                        <div
                          key={`order:${index}`}
                          className="mt-20 product-list-grid-container gap-10 px-5"
                        >
                          <div className="my-auto">
                            <Controller
                              control={control}
                              required
                              name={`order[${index}].productName`}
                              render={({ field: { ref, onChange, ...field } }) => (
                                <Autocomplete
                                  disabled={
                                    index === 0 ||
                                    index === Math.min(...addOrderIndex)
                                      ? false
                                      : !watch(
                                          `order[${
                                            index -
                                            (addOrderIndex[
                                              addOrderIndex.indexOf(index)
                                            ] -
                                              addOrderIndex[
                                                addOrderIndex.indexOf(index) - 1
                                              ])
                                          }].productName`
                                        )
                                  }
                                  freeSolo
                                  autoSelect
                                  options={productsList}
                                  onBlur={pnameOnBlur}
                                  // forcePopupIcon={<Search />}
                                  getOptionLabel={(option) =>
                                    option?.name ? option.name : option ? option : ""
                                  }
                                  size="small"
                                  //className="custom-input-height"
                                  onChange={(_, data) => {
                                    if (data) {
                                      if (data?.name) {
                                        setValue(
                                          `order[${index}].productName`,
                                          data.name
                                        );
                                        setValue(
                                          `order[${index}].productID`,
                                          data.id
                                        );
                                        const preparedPrice = data.price
                                          .toString()
                                          .includes(".")
                                          ? `${data.price.toString().split(".")[0]},${
                                              data.price.toString().split(".")[1]
                                            }`
                                          : data.price;
                                        setValue(
                                          `order[${index}].rate`,
                                          preparedPrice
                                        );
                                        setValue(`order[${index}].tax`, data.tax);
                                        disableCurrentProductRow(index);

                                        const watchRate = watch(
                                          `order[${index}].rate`
                                        );
                                        const watchTax = watch(`order[${index}].tax`);
                                        const watchName = watch(
                                          `order[${index}].productName`
                                        );
                                        const watchId = watch(
                                          `order[${index}].productID`
                                        );

                                        for (
                                          let i = 0;
                                          i < addOrderIndex.length;
                                          i++
                                        ) {
                                          if (
                                            watchName &&
                                            watchId &&
                                            watchRate &&
                                            watchTax &&
                                            i !== index &&
                                            watchName ===
                                              watch(`order[${i}].productName`) &&
                                            watchId ===
                                              watch(`order[${i}].productID`) &&
                                            watchRate === watch(`order[${i}].rate`) &&
                                            watchTax === watch(`order[${i}].tax`)
                                          ) {
                                            let quantityNum = isNaN(
                                              parseInt(watch(`order[${i}].quantity`))
                                            )
                                              ? 1
                                              : parseInt(
                                                  watch(`order[${i}].quantity`)
                                                );
                                            setValue(
                                              `order[${i}].quantity`,
                                              quantityNum + 1
                                            );
                                            onSameRowAction(index);
                                            enqueueSnackbar(
                                              `Same product found in Row ${
                                                i + 1
                                              } and ${index + 1}, merged together!`,
                                              { variant: "success" }
                                            );
                                          }
                                        }
                                      } else
                                        setValue(
                                          `order[${index}].productName`,
                                          data ? data : ""
                                        );
                                    } else {
                                      setValue(`order[${index}].productName`, "");
                                      setValue(`order[${index}].productID`, "");
                                      setValue(`order[${index}].rate`, "");
                                      setValue(`order[${index}].tax`, "");
                                      enableCurrentProductRow(index);
                                    }
                                    return onChange(data);
                                  }}
                                  renderOption={(props, option, { selected }) => (
                                    <MenuItem
                                      {...props}
                                      key={option.uuid}
                                    >{`${option.name}`}</MenuItem>
                                  )}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      {...field}
                                      className="custom-input-height"
                                      inputRef={ref}
                                      // error={!!errors?.order?.[index]?.productName}
                                      // helperText={errors?.order?.[index]?.productName?.message}
                                    />
                                  )}
                                />
                              )}
                            />
                          </div>
                          <div className="my-auto ">
                            <Controller
                              name={`order[${index}].productID`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Product ID"
                                  className="bg-white custom-input-height"
                                  type="text"
                                  autoComplete="off"
                                  error={!!errors.productID}
                                  helperText={errors?.productID?.message}
                                  variant="outlined"
                                  fullWidth
                                  disabled={disableRowIndexes.includes(index)}
                                />
                              )}
                            />
                          </div>
                          <div className="my-auto">
                            <Controller
                              name={`order[${index}].discount`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Discount"
                                  className="bg-white custom-input-height"
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.discount}
                                  helperText={errors?.discount?.message}
                                  variant="outlined"
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                          <div className="my-auto">
                            {!disableRowIndexes.includes(index) ? (
                              <Controller
                                name={`order[${index}].tax`}
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    error={!!errors?.order?.[index]?.tax}
                                    required
                                    fullWidth
                                  >
                                    <Select
                                      {...field}
                                      labelId="tax"
                                      id="tax"
                                      sx={{ height: 44 }}
                                      defaultValue={defaultTaxValue}
                                      className="custom-select-create-order pt-8 mt-1"
                                      disabled={disableRowIndexes.includes(index)}
                                    >
                                      {taxes && taxes.length ? (
                                        taxes.map((tax, index) =>
                                          tax.status === "Active" ? (
                                            <MenuItem key={index} value={tax.value}>
                                              {tax.value}
                                            </MenuItem>
                                          ) : (
                                            <MenuItem
                                              key={index}
                                              value={tax.value}
                                              disabled
                                            >
                                              {tax.value}
                                            </MenuItem>
                                          )
                                        )
                                      ) : (
                                        <MenuItem key={0} value={0}>
                                          0
                                        </MenuItem>
                                      )}
                                    </Select>
                                    <FormHelperText>
                                      {errors?.order?.[index]?.tax?.message}
                                    </FormHelperText>
                                  </FormControl>
                                )}
                              />
                            ) : (
                              <Controller
                                name={`order[${index}].tax`}
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    //label="Discount"
                                    className="bg-white custom-input-height"
                                    // type="text"
                                    type="number"
                                    autoComplete="off"
                                    error={!!errors?.order?.[index]?.tax}
                                    helperText={errors?.order?.[index]?.tax?.message}
                                    variant="outlined"
                                    required
                                    disabled={disableRowIndexes.includes(index)}
                                    fullWidth
                                  />
                                )}
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
                              />
                            )}
                          </div>
                          <div className="my-auto">
                            <div className="body3 text-right">
                              {t("label:nok")}{" "}
                              {ThousandSeparator(productWiseTotal(index))}
                            </div>
                          </div>
                          <div className="my-auto">
                            <IconButton
                              aria-label="delete"
                              onClick={() => onDelete(index)}
                            >
                              <RemoveCircleOutlineIcon className="icon-size-20 text-red-500" />
                            </IconButton>
                          </div>
                        </div>
                      ))}
                      <Button
                        className="mt-20 rounded-4 button2 text-MonochromeGray-700 custom-add-button-color"
                        startIcon={<AddIcon />}
                        onClick={() => addNewOrder()}
                        disabled={addOrderIndex.length >= 20 ? true : false}
                      >
                        {t(`label:addItem`)}
                      </Button>
                      <hr className=" mt-20 border-half-bottom" />
                    </div>
                  </Hidden>

                  <hr className="mt-20 border-half-bottom" />

                  <div className="grid grid-cols-1 md:grid-cols-6 my-20">
                    <div className="customer-section col-span-1 md:col-span-4">
                      <div className="my-32">
                        <Controller
                          name="customerNotes"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              rows={5}
                              label={t("label:customerNotes")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.customerNotes}
                              helperText={
                                errors?.customerNotes?.message
                                  ? t(
                                      `validation:${errors?.customerNotes?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                            />
                          )}
                        />
                        <div className="my-32">
                          <Controller
                            name="termsConditions"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                multiline
                                rows={5}
                                label={t("label:tnc")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.termsConditions}
                                helperText={
                                  errors?.termsConditions?.message
                                    ? t(
                                        `validation:${errors?.termsConditions?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-span-2 mx-10 sm:mx-0">
                      <div className="border-MonochromeGray-25">
                        <div className="px-14">
                          <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 my-20">
                            <div className="subtitle3 text-MonochromeGray-700">
                            Total Reservation
                            </div>
                            <div className="body3 text-MonochromeGray-700">
                              {t("label:nok")}{" "}
                              {ThousandSeparator(grandTotal.toFixed(2) / 2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
          </form>
        </>
    );
};

export default ReservationCreate;