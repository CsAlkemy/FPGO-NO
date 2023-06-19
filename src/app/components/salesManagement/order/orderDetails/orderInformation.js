import { yupResolver } from "@hookform/resolvers/yup";
import { Search } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import {
  DateTimePicker,
  DesktopDatePicker,
  DesktopDateTimePicker,
} from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Backdrop,
  Button, Checkbox,
  CircularProgress,
  FormControl, FormControlLabel,
  FormHelperText,
  Hidden,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import {
  CreateOrderDefaultValue,
  validateSchemaCreateOrderCorporate,
  validateSchemaCreateOrderCorporateOrderBySms,
  validateSchemaCreateOrderPrivate,
  validateSchemaCreateOrderPrivateOrderByEmail,
} from "../../utils/helper";
import ProductService from "../../../../data-access/services/productsService/ProductService";
import { useSnackbar } from "notistack";
import CustomersService from "../../../../data-access/services/customersService/CustomersService";
import { ClickAwayListener } from "@mui/base";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import AuthService from "../../../../data-access/services/authService";
import ClientService from "../../../../data-access/services/clientsService/ClientService";
import { ThousandSeparator } from "../../../../utils/helperFunctions";
import CountrySelect from "../../../common/countries";

const OrderInformation = ({ info }) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [expanded1, setExpanded1] = React.useState(true);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(false);
  const [expanded0, setExpanded0] = React.useState(true);
  const [expandedPanel2, setExpandedPanel2] = React.useState(true);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedFromList, setSelectedFromList] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [customDateDropDown, setCustomDateDropDown] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  setCustomDateDropDown;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let grandTotal = 0;
  const date = new Date();
  const [customData, setCustomData] = React.useState({
    orderBy: "sms",
    paymentMethod: ["visa", "mastercard", "vipps", "invoice"],
    isCeditCheck: false,
    isNewCustomer: false,
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
  const [addOrderIndex, setAddOrderIndex] = React.useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ]);

  const [taxVariable, setTaxVariable] = React.useState([
    {
      name: "0% VAT",
      value: 0,
    },
    {
      name: "8% VAT",
      value: 8,
    },
    {
      name: "15% VAT",
      value: 15,
    },
    {
      name: "25% VAT",
      value: 25,
    },
  ]);
  // const info = JSON.parse(localStorage.getItem("tableRowDetails"));

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
  const schema = activeSchema();

  const {
    control,
    formState,
    handleSubmit,
    getValues,
    reset,
    watch,
    setValue,
    resetField,
  } = useForm({
    mode: "onChange",
    CreateOrderDefaultValue,
    // reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const onSubmit = (values) => {
    // const data = {
    //   ...values,
    //   ...customData,
    //   orderSummary: {
    //     subTotal,
    //     totalTax,
    //     totalDiscount,
    //     grandTotal,
    //   },
    // };
    // OrdersService.createOrder(data)
    //   .then((response) => {
    //     if (response?.status_code === 201) {
    //       enqueueSnackbar(response.message, { variant: "success" });
    //       navigate(`/sales/orders-list`);
    //     }
    //   })
    //   .catch((e) => {
    //     enqueueSnackbar(e, { variant: "error" });
    //   });
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
    // const total =  (parseInt(watchQuantity) * parseFloat(watchRate))
    const total =
      parseInt(watchQuantity) * parseFloat(watchRate) -
      parseFloat(watchDiscount) +
      (parseInt(watchQuantity) * parseFloat(watchRate) -
        parseFloat(watchDiscount)) *
        (watchTax / 100);
    const subTotalCalculation = parseInt(watchQuantity) * parseFloat(watchRate);
    const totalTaxCalculation =
      (parseInt(watchQuantity) * parseFloat(watchRate) -
        parseFloat(watchDiscount)) *
      (watchTax / 100);
    const grandTotalCalculation =
      parseInt(watchQuantity) * parseFloat(watchRate) -
      parseFloat(watchDiscount) +
      (parseInt(watchQuantity) * parseFloat(watchRate) -
        parseFloat(watchDiscount)) *
        (watchTax / 100);
    // const total = ((watchQuantity * watchRate) - watchDiscount) * (watchTax/100);
    // setSubTotal(total)
    if (watchTax) defaultTaxValue = watchTax;
    if (subTotalCalculation)
      subTotal = subTotal + parseFloat(subTotalCalculation);
    if (totalTaxCalculation) totalTax = totalTax + totalTaxCalculation;
    if (watchDiscount)
      totalDiscount = totalDiscount + parseFloat(watchDiscount);
    if (grandTotalCalculation) grandTotal = grandTotal + grandTotalCalculation;
    if (total > 0) {
      return `NOK ${total}`;
    }
  };

  const watchProductName = watch(`order[0].productName`);
  const watchOrderDate = watch(`orderDate`);
  const watchDueDatePaymentLink = watch(`dueDatePaymentLink`);
  const watchDueDateInvoice = watch(`dueDateInvoice`);

  useEffect(() => {
    CreateOrderDefaultValue.primaryPhoneNumber =
      info.customerDetails?.countryCode && info.customerDetails?.msisdn
        ? info.customerDetails?.countryCode + info.customerDetails?.msisdn
        : "+47";
    CreateOrderDefaultValue.billingCountry = info?.customerDetails?.address
      ?.country
      ? info?.customerDetails?.address?.country
      : "norway";

    if (
      info?.productList &&
      info?.productList &&
      info?.productList.length >= 2
    ) {
      setAddOrderIndex(
        addOrderIndex.filter(
          (item, index) => item <= info?.productList.length - 1
        )
      );
    } else {
      setAddOrderIndex(addOrderIndex.filter((item, index) => item < 1));
    }
    reset({ ...CreateOrderDefaultValue });

    AuthService.axiosRequestHelper().then((isAuthenticated) => {
      ProductService.productsList(true)
        .then((res) => {
          let data = [];
          if (res?.status_code === 200 && res.length) {
            res.map((row) => {
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
        .catch((e) => setProductsList([]));
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
                });
              });
          }
          setCustomersList(data);
        })
        .catch((e) => setCustomersList([]));
    });
  }, []);

  const handleDueDatePickerClose = () => {
    setValue("dueDatePaymentLink", watchDueDatePaymentLink);
    setDatePickerOpen(false);
  };

  const prepareDate = (dayCount, dateRef) => {
    const date = new Date(
      dateRef === 1 ? watchOrderDate : watchDueDatePaymentLink
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
      `${updatedDay} ${monthName}, ${year} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    );
  };
  const prepareOrderDate = (param) => {
    const splitedArray = param.split(".");
    const changedDate = `${splitedArray[1]}.${splitedArray[0]}.${splitedArray[2]}`;
    return changedDate;
  };
  const prepareDueDateForPaymentLink = (param) => {
    const splitedArray = param.split(", ");
    const splitedDateArray = splitedArray[1].split(".");
    const changedDate = `${splitedDateArray[1]}.${splitedDateArray[0]}.${splitedDateArray[2]} ${splitedArray[0]}`;
    return changedDate;
  };

  return (
    <div>
      {!!info && (
        <div className="create-product-container mb-32 md:mb-0">
          <div className="inside-div-product">
            <div className="rounded-sm bg-white p-0 md:px-20">
              <form
                name="createOrderForm"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <Hidden smUp>
                  <Accordion
                    className={`${
                      !expandedPanelOrder ? "bg-primary-25" : "bg-primary-700"
                    } mt-20 bg-primary-25 shadow-0 border-0 custom-accordion`}
                  >
                    <AccordionSummary
                      expandIcon={
                        !expandedPanelOrder ? (
                          <IoMdAdd className="icon-size-20" />
                        ) : (
                          <FiMinus
                            className={`icon-size-20 ${
                              !expandedPanelOrder ? "" : "text-white"
                            }`}
                          />
                        )
                      }
                      onClick={() => setExpandedPanelOrder(!expandedPanelOrder)}
                      id="panel2a-header"
                    >
                      <div
                        className={`subtitle3  flex gap-10 my-auto ${
                          !expandedPanelOrder
                            ? "text-MonochromeGray-700"
                            : "text-white"
                        }`}
                      >
                        {t("label:orderDetails")}
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className="bg-white px-0">
                      {addOrderIndex.map((index) => (
                        <div
                          className=" p-20 rounded-6 bg-white border-2 border-MonochromeGray-25 my-20 flex flex-col gap-20"
                          key={`order:${index}`}
                        >
                          <Controller
                            name={`order[${index}].productName`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                //label="Product ID"
                                className="bg-white custom-input-height mt-10"
                                type="text"
                                autoComplete="off"
                                error={!!errors.productName}
                                helperText={errors?.productName?.message}
                                variant="outlined"
                                fullWidth
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.name
                                    ? info.productList[index].name
                                    : ""
                                }
                              />
                            )}
                          />
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
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.productId
                                    ? info.productList[index].productId
                                    : ""
                                }
                              />
                            )}
                          />
                          <div className="grid grid-cols-3 gap-20">
                            <Controller
                              name={`order[${index}].quantity`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Qty"
                                  className="bg-white custom-input-height col-span-2"
                                  type="number"
                                  onWheel={(event) => {
                                    event.target.blur();
                                  }}
                                  autoComplete="off"
                                  error={!!errors?.order?.[index]?.quantity}
                                  helperText={
                                    errors?.order?.[index]?.quantity?.message
                                  }
                                  // error={!!errors.quantity}
                                  // helperText={errors?.quantity?.message}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                  defaultValue={
                                    info.productList &&
                                    info.productList?.[index]?.quantity
                                      ? info.productList[index].quantity
                                      : ""
                                  }
                                />
                              )}
                            />
                            <Controller
                              name={`order[${index}].rate`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Rate"
                                  className="bg-white custom-input-height col-span-1"
                                  type="text"
                                  autoComplete="off"
                                  error={!!errors?.order?.[index]?.rate}
                                  helperText={
                                    errors?.order?.[index]?.rate?.message
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                  disabled
                                  defaultValue={
                                    info.productList &&
                                    info.productList?.[index]?.rate
                                      ? ThousandSeparator(
                                          info.productList[index].rate
                                        )
                                      : ""
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-20">
                            <Controller
                              name={`order[${index}].discount`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Discount"
                                  className="bg-white custom-input-height col-span-2"
                                  type="text"
                                  autoComplete="off"
                                  error={!!errors.discount}
                                  helperText={errors?.discount?.message}
                                  variant="outlined"
                                  fullWidth
                                  disabled
                                  defaultValue={
                                    info.productList &&
                                    info.productList?.[index]?.discount
                                      ? info.productList[index].discount
                                      : ""
                                  }
                                />
                              )}
                            />
                            <Controller
                              name={`order[${index}].tax`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Discount"
                                  className="bg-white custom-input-height col-span-1"
                                  // type="text"
                                  type="number"
                                  onWheel={(event) => {
                                    event.target.blur();
                                  }}
                                  autoComplete="off"
                                  error={!!errors?.order?.[index]?.tax}
                                  helperText={
                                    errors?.order?.[index]?.tax?.message
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                  disabled
                                  defaultValue={
                                    info.productList &&
                                    info.productList?.[index]?.tax === 0
                                      ? 0
                                      : info.productList[index]?.tax
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className="flex justify-between subtitle1 py-20 border-t-1 border-MonochromeGray-50">
                            <div>{t("label:total")}</div>
                            <div>
                              {t("label:nok")}{" "}
                              {info.productList &&
                              info.productList?.[index]?.amount
                                ? ThousandSeparator(
                                    info.productList[index].amount
                                  )
                                : ""}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="bg-MonochromeGray-50 p-20 subtitle2 text-MonochromeGray-700">
                        {t("label:grandTotal")} : {t("label:nok")}{" "}
                        {ThousandSeparator(info.orderSummary.grandTotal)}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </Hidden>
                <Hidden smDown>
                  <div className="product-list">
                    <div className="my-10 product-list-grid-container product-list-grid-container-height bg-primary-25 subtitle3 gap-10 px-10">
                      <div className="my-auto text-MonochromeGray-500">
                        {t("label:productName")}
                      </div>
                      <div className="my-auto text-MonochromeGray-500">
                        {t("label:productIdOptional")}
                      </div>
                      <div className="my-auto text-MonochromeGray-500">
                        Qty.
                      </div>
                      <div className="my-auto text-right text-MonochromeGray-500">
                        {t("label:rate")}
                      </div>
                      <div className="my-auto text-right text-MonochromeGray-500">
                        {t("label:discount")}
                      </div>
                      <div className="my-auto text-center text-MonochromeGray-500">
                        {t("label:tax")}
                      </div>
                      <div className="my-auto text-right text-MonochromeGray-500">
                        {t("label:amount")}
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
                            name={`order[${index}].productName`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                //label="Product ID"
                                className="bg-white custom-input-height"
                                type="text"
                                autoComplete="off"
                                error={!!errors.productName}
                                helperText={errors?.productName?.message}
                                variant="outlined"
                                fullWidth
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.name
                                    ? info.productList[index].name
                                    : ""
                                }
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
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.productId
                                    ? info.productList[index].productId
                                    : ""
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="my-auto">
                          <Controller
                            name={`order[${index}].quantity`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                //label="Qty"
                                className="bg-white custom-input-height"
                                type="number"
                                onWheel={(event) => {
                                  event.target.blur();
                                }}
                                autoComplete="off"
                                error={!!errors?.order?.[index]?.quantity}
                                helperText={
                                  errors?.order?.[index]?.quantity?.message
                                }
                                // error={!!errors.quantity}
                                // helperText={errors?.quantity?.message}
                                variant="outlined"
                                fullWidth
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.quantity
                                    ? info.productList[index].quantity
                                    : ""
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="my-auto">
                          <Controller
                            name={`order[${index}].rate`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                //label="Rate"
                                className="bg-white custom-input-height"
                                type="text"
                                autoComplete="off"
                                error={!!errors?.order?.[index]?.rate}
                                helperText={
                                  errors?.order?.[index]?.rate?.message
                                }
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.rate
                                    ? ThousandSeparator(
                                        info.productList[index].rate
                                      )
                                    : ""
                                }
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
                                type="text"
                                autoComplete="off"
                                error={!!errors.discount}
                                helperText={errors?.discount?.message}
                                variant="outlined"
                                fullWidth
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.discount
                                    ? info.productList[index].discount
                                    : ""
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="my-auto">
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
                                onWheel={(event) => {
                                  event.target.blur();
                                }}
                                autoComplete="off"
                                error={!!errors?.order?.[index]?.tax}
                                helperText={
                                  errors?.order?.[index]?.tax?.message
                                }
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                                defaultValue={
                                  info.productList &&
                                  info.productList?.[index]?.tax === 0
                                    ? 0
                                    : info.productList[index]?.tax
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="my-auto">
                          <div className="body3 text-right">
                            {t("label:nok")}{" "}
                            {info.productList &&
                            info.productList?.[index]?.amount
                              ? ThousandSeparator(
                                  info.productList[index].amount
                                )
                              : ""}
                          </div>
                        </div>
                        {/*<div className="my-auto">*/}
                        {/*  <IconButton*/}
                        {/*    aria-label="delete"*/}
                        {/*    onClick={() => onDelete(index)}*/}
                        {/*  >*/}
                        {/*    <RemoveCircleOutlineIcon className="icon-size-20 text-red-500" />*/}
                        {/*  </IconButton>*/}
                        {/*</div>*/}
                      </div>
                    ))}
                    <hr className=" mt-20 border-half-bottom" />
                  </div>
                </Hidden>
                <div className="grid grid-cols-1 md:grid-cols-6 my-20">
                  <div className="col-span-1 md:col-span-4">
                    <div className="create-order-date-container">
                      <div className="flex flex-col gap-5">
                        <Controller
                          name="orderDate"
                          control={control}
                          render={({ field: { onChange, value, onBlur } }) => (
                            <DesktopDatePicker
                              label={t("label:orderDate")}
                              // inputFormat="mm.dd.yyyy"
                              mask=""
                              inputFormat="dd.MM.yyyy"
                              // inputFormat="dd.MMM.yyyy"
                              // value={!value ? new Date() : value}
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
                              value={
                                info?.orderDate
                                  ? prepareOrderDate(info?.orderDate)
                                  : ""
                              }
                              // value="30 Nov, 2022"
                              required
                              disabled
                              onChange={onChange}
                              // minDate={new Date().setDate(
                              //   new Date().getDate() - 30
                              // )}
                              // maxDate={new Date().setDate(
                              //   new Date().getDate() + 30
                              // )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  onBlur={onBlur}
                                  required
                                  type="date"
                                  error={!!errors.orderDate}
                                  helperText={errors?.orderDate?.message}
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
                              onClickAway={handleDueDatePickerClose}
                            >
                              <div className="create-order-due-date w-full">
                                <DesktopDateTimePicker
                                  label={t("label:dueDateForPaymentLink")}
                                  inputFormat="dd.MM.yyyy HH:mm"
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
                                  // inputFormat="dd.MMM.yyyy"
                                  value={
                                    info?.paymentLinkDueDate
                                      ? prepareDueDateForPaymentLink(
                                          info?.paymentLinkDueDate
                                        )
                                      : // ? info?.paymentLinkDueDate
                                        ""
                                  }
                                  required
                                  open={datePickerOpen}
                                  disabled
                                  // minDate={
                                  //   watchOrderDate
                                  //     ? new Date().setDate(
                                  //       watchOrderDate.getDate() + 1
                                  //     )
                                  //     : new Date().setDate(
                                  //       new Date().getDate() - 30
                                  //     )
                                  // }
                                  disablePast={true}
                                  onChange={onChange}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      onBlur={onBlur}
                                      type="date"
                                      required
                                      fullWidth
                                      onFocus={() =>
                                        setCustomDateDropDown(
                                          !customDateDropDown
                                        )
                                      }
                                      error={!!errors.dueDatePaymentLink}
                                      helperText={
                                        errors?.dueDatePaymentLink?.message
                                      }
                                      sx={{
                                        svg: { color: "#E7AB52" },
                                      }}
                                    />
                                  )}
                                />
                                {customDateDropDown && (
                                  <div
                                    className="absolute bg-white max-h-min rounded-4 shadow-4 w-9/12 z-999"
                                    onMouseLeave={() =>
                                      setCustomDateDropDown(!customDateDropDown)
                                    }
                                  >
                                    <ul className="">
                                      <li
                                        className="body2 py-14 px-10"
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
                                        className="body2 py-14 px-10"
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
                                        className="body2 py-14 px-10"
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
                                        className="body2 py-14 px-10"
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
                      <div className="flex flex-col gap-5"></div>
                    </div>
                    <div className="create-order-send-order-conf">
                      <div className="send-order-by">
                        <div className="caption2 text-MonochromeGray-300">
                          {t("label:sendOrderBy")}
                        </div>
                        <div className="body3 text-MonochromeGray-300">
                          {t("label:sendOrderByDetailsMessage")}
                        </div>
                        <div className="create-order-radio">
                          <div className="grid grid-cols-1 md:grid-cols-3 justify-between items-center gap-20 w-full md:w-3/4 my-32">
                            <Button
                              variant="outlined"
                              className={`body2 ${
                                info.sendOrderBy.sms
                                  ? "create-order-capsule-button-active-details"
                                  : "create-order-capsule-button"
                              }`}
                              startIcon={
                                <CheckIcon
                                  className={
                                    info.sendOrderBy.sms
                                      ? "text-primary-500 icon-size-20"
                                      : "icon-size-20"
                                  }
                                />
                              }
                              disabled={!info.sendOrderBy.sms}
                            >
                              {t("label:sms")}
                            </Button>
                            <Button
                              variant="outlined"
                              className={`body2 ${
                                info.sendOrderBy.email
                                  ? "create-order-capsule-button-active-details"
                                  : "create-order-capsule-button"
                              }`}
                              startIcon={
                                <CheckIcon
                                  className={
                                    info.sendOrderBy.email
                                      ? "text-primary-500 icon-size-20"
                                      : "icon-size-20"
                                  }
                                />
                              }
                              disabled={!info.sendOrderBy.email}
                            >
                              {t("label:email")}
                            </Button>
                            <Button
                              variant="outlined"
                              className={`body2 ${
                                info.sendOrderBy.invoice
                                  ? "create-order-capsule-button-active-details"
                                  : "create-order-capsule-button"
                              }`}
                              startIcon={
                                <CheckIcon
                                  className={
                                    info.sendOrderBy.invoice
                                      ? "text-primary-500 icon-size-20"
                                      : "icon-size-20"
                                  }
                                />
                              }
                              disabled={!info.sendOrderBy.invoice}
                            >
                              {t("label:invoice")}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Controller
                          name="invoiceAsPaymentOption"
                          type="checkbox"
                          control={control}
                          render={({ field }) => (
                              <FormControl
                                  error={!!errors.invoiceAsPaymentOption}
                                  required
                              >
                                <FormControlLabel
                                    control={
                                      <div>
                                        <Checkbox
                                            {...field}
                                            defaultChecked={info?.invoiceAsPaymentOption ? info?.invoiceAsPaymentOption : false }
                                            required
                                            disabled
                                        />
                                      </div>
                                    }
                                    label={
                                      <div className="body3">
                                        {t("label:invoiceAsPaymentOption")}
                                      </div>
                                    }
                                />
                                <FormHelperText className="ml-32">
                                  {errors?.invoiceAsPaymentOption?.message
                                      ? t(
                                          `validation:${errors?.invoiceAsPaymentOption?.message}`
                                      )
                                      : ""}
                                </FormHelperText>
                              </FormControl>
                          )}
                      />
                      <div className="send-order-by mt-20">
                        <div className="caption2 text-MonochromeGray-300">
                          {t("label:creditCheckLabel")}
                        </div>
                        <div className="subtitle3 text-MonochromeGray-500">
                          {t("label:creditCheckFlagOrderPage")}
                        </div>
                        <div className="send-order-credit-check">
                          <div className="body3 text-MonochromeGray-300">
                            {t("label:creditCheckDetailsOrderPage")}
                          </div>
                          <div className="flex gap-20 w-full md:w-3/4 my-32">
                            <Button
                              variant="outlined"
                              className={`body2 ${
                                info.creditCheck
                                  ? "create-order-capsule-button-active-details"
                                  : "create-order-capsule-button"
                              }`}
                              disabled={!info.creditCheck}
                            >
                              {t("label:yes")}
                            </Button>
                            <Button
                              variant="outlined"
                              className={`body2 ${
                                !info.creditCheck
                                  ? "create-order-capsule-button-active-details"
                                  : "create-order-capsule-button"
                              }`}
                              disabled={info.creditCheck}
                            >
                              {t("label:no")}
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-for-customer-details">
                        <Accordion className="mt-20 bg-primary-25 shadow-0 border-0 custom-accordion">
                          <AccordionSummary
                            expandIcon={
                              expandedPanel2 ? (
                                <IoMdAdd className="icon-size-20" />
                              ) : (
                                <FiMinus className="icon-size-20" />
                              )
                            }
                            onClick={() => setExpandedPanel2(!expandedPanel2)}
                            id="panel2a-header"
                          >
                            <div className="subtitle3 text-MonochromeGray-700 flex gap-10 my-auto">
                              {t("label:customerDetails")}
                              <span>
                                {dirtyFields.primaryPhoneNumber &&
                                dirtyFields.email &&
                                dirtyFields.customerName &&
                                dirtyFields.orgorPID ? (
                                  <BsFillCheckCircleFill className="icon-size-16 text-teal-300" />
                                ) : (
                                  <BsFillCheckCircleFill className="icon-size-16 text-MonochromeGray-50" />
                                )}
                              </span>
                            </div>
                          </AccordionSummary>
                          <AccordionDetails className="bg-white">
                            <div className="search-customer-order-create my-32">
                              <div className="caption2 text-MonochromeGray-300 mb-20">
                                {t("label:searchExistingCustomer")}
                              </div>

                              <Controller
                                control={control}
                                name="searchCustomer"
                                render={({
                                  field: { ref, onChange, ...field },
                                }) => (
                                  <Autocomplete
                                    freeSolo
                                    options={customersList}
                                    // forcePopupIcon={<Search />}
                                    getOptionLabel={(option) => option.name}
                                    className="custom-input-height"
                                    disabled
                                    fullWidth
                                    onChange={(_, data) => {
                                      if (data) {
                                        setValue(
                                          "primaryPhoneNumber",
                                          data.phone
                                        );
                                        setValue("email", data.email);
                                        setValue("customerName", data.name);
                                        setValue("orgorPID", data.orgOrPNumber);
                                        data.type === "Corporate"
                                          ? setCustomData({
                                              ...customData,
                                              customerType: "corporate",
                                            })
                                          : setCustomData({
                                              ...customData,
                                              customerType: "private",
                                            });
                                        data.type === "Corporate"
                                          ? setSelectedFromList("Corporate")
                                          : setSelectedFromList("Private");
                                      } else {
                                        setValue("primaryPhoneNumber", "");
                                        setValue("email", "");
                                        setValue("customerName", "");
                                        setValue("orgorPID", "");
                                        setSelectedFromList(null);
                                      }
                                      return onChange(data);
                                    }}
                                    renderOption={(
                                      props,
                                      option,
                                      { selected }
                                    ) => (
                                      <MenuItem
                                        {...props}
                                      >{`${option.name}`}</MenuItem>
                                    )}
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        {...field}
                                        //className='custom-input-height-div'
                                        inputRef={ref}
                                        placeholder={t(
                                          `label:searchByNameOrPhoneNo`
                                        )}
                                      />
                                    )}
                                  />
                                )}
                              />
                            </div>
                            <div className="search-customer-order-create-type my-32">
                              <div className="subtitle3 text-MonochromeGray-500">
                                {t("label:customerType")}
                              </div>
                              <div className="flex gap-20 w-full md:w-3/4 mb-32 mt-20">
                                <Button
                                  variant="outlined"
                                  className={`body2 ${
                                    info?.customerDetails?.type === "Private"
                                      ? "create-order-capsule-button-active-details"
                                      : "create-order-capsule-button"
                                  }`}
                                  disabled={
                                    info.customerDetails.type !== "Private"
                                  }
                                >
                                  {t("label:private")}
                                </Button>
                                <Button
                                  variant="outlined"
                                  className={`body2 ${
                                    info?.customerDetails?.type === "Corporate"
                                      ? "create-order-capsule-button-active-details"
                                      : "create-order-capsule-button"
                                  }`}
                                  disabled={
                                    info.customerDetails.type !== "Corporate"
                                  }
                                >
                                  {t("label:corporate")}
                                </Button>
                              </div>
                            </div>
                            <div className="w-full my-32">
                              <div className="form-pair-input gap-x-20">
                                <Controller
                                  name="primaryPhoneNumber"
                                  control={control}
                                  render={({ field }) => (
                                    <FormControl
                                      error={!!errors.primaryPhoneNumber}
                                      fullWidth
                                      disabled
                                      defaultValue={
                                        info.customerDetails?.countryCode &&
                                        info.customerDetails?.msisdn
                                          ? info.customerDetails?.countryCode +
                                            info.customerDetails?.msisdn
                                          : "+87"
                                      }
                                    >
                                      <PhoneInput
                                        {...field}
                                        className={
                                          errors.primaryPhoneNumber
                                            ? "input-phone-number-field border-1 rounded-md border-red-300"
                                            : "input-phone-number-field"
                                        }
                                        country="no"
                                        // enableSearch
                                        // autocompleteSearch
                                        countryCodeEditable={false}
                                        disabled
                                        specialLabel={
                                          customData.customerType ===
                                          "corporate"
                                            ? t("label:phone")
                                            : `${t("label:phone")}*`
                                        }
                                        // onBlur={handleOnBlurGetDialCode}
                                        defaultValue={
                                          info.customerDetails?.countryCode &&
                                          info.customerDetails?.msisdn
                                            ? info.customerDetails
                                                ?.countryCode +
                                              info.customerDetails?.msisdn
                                            : "+88"
                                        }
                                      />
                                      <FormHelperText>
                                        {errors?.primaryPhoneNumber?.message}
                                      </FormHelperText>
                                    </FormControl>
                                  )}
                                />
                                <Controller
                                  name="email"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:email")}
                                      type="email"
                                      autoComplete="off"
                                      error={!!errors.email}
                                      helperText={errors?.email?.message}
                                      variant="outlined"
                                      fullWidth
                                      disabled
                                      required={
                                        customData.customerType ===
                                          "corporate" ||
                                        customData.orderBy === "email"
                                      }
                                      value={
                                        field.value ||
                                        (info.customerDetails?.email
                                          ? info.customerDetails?.email
                                          : "")
                                      }
                                      defaultValue={
                                        info.customerDetails?.email
                                          ? info.customerDetails?.email
                                          : ""
                                      }
                                    />
                                  )}
                                />
                              </div>
                              <div className="mt-32 sm:mt-0">
                                <div className="form-pair-input gap-x-20">
                                  <Controller
                                    name="customerName"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:customerName")}
                                        type="text"
                                        autoComplete="off"
                                        error={!!errors.customerName}
                                        helperText={
                                          errors?.customerName?.message
                                        }
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                        value={
                                          field.value ||
                                          (info.customerDetails?.name
                                            ? info.customerDetails?.name
                                            : "")
                                        }
                                        defaultValue={
                                          info.customerDetails?.name
                                            ? info.customerDetails?.name
                                            : ""
                                        }
                                      />
                                    )}
                                  />
                                  <Controller
                                    name="orgorPID"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={
                                          customData.customerType === "private"
                                            ? t("label:pNumber")
                                            : t("label:organizationId")
                                        }
                                        type="text"
                                        autoComplete="off"
                                        error={!!errors.orgorPID}
                                        required={
                                          customData.customerType ===
                                          "corporate"
                                        }
                                        helperText={errors?.orgorPID?.message}
                                        variant="outlined"
                                        fullWidth
                                        disabled
                                        value={
                                          field.value ||
                                          (info.customerDetails?.type ===
                                          "Private"
                                            ? info.customerDetails
                                                ?.personalNumber
                                              ? info.customerDetails
                                                  ?.personalNumber
                                              : ""
                                            : info.customerDetails
                                                ?.organizationId
                                            ? info.customerDetails
                                                ?.organizationId
                                            : "")
                                        }
                                        defaultValue={
                                          info.customerDetails?.type ===
                                          "Private"
                                            ? info.customerDetails
                                                ?.personalNumber
                                              ? info.customerDetails
                                                  ?.personalNumber
                                              : ""
                                            : info.customerDetails
                                                ?.organizationId
                                            ? info.customerDetails
                                                ?.organizationId
                                            : ""
                                        }
                                      />
                                    )}
                                  />
                                </div>
                                <div className="">
                                  <div className="form-pair-three-by-one">
                                    <div className="col-span-3">
                                      <Controller
                                        name="billingAddress"
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            {...field}
                                            label={t("label:streetAddress")}
                                            type="text"
                                            autoComplete="off"
                                            error={!!errors.billingAddress}
                                            helperText={
                                              errors?.billingAddress?.message
                                            }
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            inputlabelprops={{
                                              shrink:
                                                !!field.value ||
                                                touchedFields.billingAddress,
                                            }}
                                            required={customData.paymentMethod.includes(
                                              "invoice"
                                            )}
                                            value={
                                              field.value ||
                                              (info.customerDetails.address
                                                ?.street
                                                ? info.customerDetails.address
                                                    ?.street
                                                : "")
                                            }
                                            defaultValue={
                                              info.customerDetails.address
                                                ?.street
                                                ? info.customerDetails.address
                                                    ?.street
                                                : ""
                                            }
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="col-span-1">
                                      <Controller
                                        name="billingZip"
                                        className="col-span-1"
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            {...field}
                                            label={t("label:zipCode")}
                                            type="text"
                                            autoComplete="off"
                                            error={!!errors.billingZip}
                                            helperText={
                                              errors?.billingZip?.message
                                            }
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                            inputlabelprops={{
                                              shrink:
                                                !!field.value ||
                                                touchedFields.billingZip,
                                            }}
                                            required={customData.paymentMethod.includes(
                                              "invoice"
                                            )}
                                            value={
                                              field.value ||
                                              (info.customerDetails.address?.zip
                                                ? info.customerDetails.address
                                                    ?.zip
                                                : "")
                                            }
                                            defaultValue={
                                              info.customerDetails.address?.zip
                                                ? info.customerDetails.address
                                                    ?.zip
                                                : ""
                                            }
                                          />
                                        )}
                                      />
                                    </div>
                                  </div>
                                  <div className="form-pair-input gap-x-20">
                                    <Controller
                                      name="billingCity"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:city")}
                                          type="text"
                                          autoComplete="off"
                                          error={!!errors.billingCity}
                                          helperText={
                                            errors?.billingCity?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.billingCity,
                                          }}
                                          required={customData.paymentMethod.includes(
                                            "invoice"
                                          )}
                                          value={
                                            field.value ||
                                            (info.customerDetails.address?.city
                                              ? info.customerDetails.address
                                                  ?.city
                                              : "")
                                          }
                                          defaultValue={
                                            info.customerDetails.address?.city
                                              ? info.customerDetails.address
                                                  ?.city
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                    <CountrySelect
                                      control={control}
                                      name={"billingCountry"}
                                      label={"country"}
                                      // placeholder={"country"}
                                      required={true}
                                      error={errors.billingCountry}
                                      disable={true}
                                    />
                                    {/* 
                                    <Controller
                                      name="billingCountry"
                                      control={control}
                                      render={({ field }) => (
                                        <FormControl
                                          error={!!errors.billingCountry}
                                          fullWidth
                                          disabled
                                        >
                                          <InputLabel id="billingCountry">
                                            {t("label:country")}
                                          </InputLabel>
                                          <Select
                                            {...field}
                                            labelId="billingCountry"
                                            id="select"
                                            label={t("label:country")}
                                            inputlabelprops={{
                                              shrink: !!field.value,
                                            }}
                                            // defaultValue="norway"
                                            required={customData.paymentMethod.includes(
                                              "invoice"
                                            )}
                                            defaultValue={
                                              info.customerDetails.address
                                                ?.country
                                                ? info.customerDetails.address
                                                    ?.country
                                                : ""
                                            }
                                          >
                                            {countries.length ? (
                                              countries.map(
                                                (country, index) => {
                                                  return (
                                                    <MenuItem
                                                      key={index}
                                                      value={country.name}
                                                    >
                                                      {country.title}
                                                    </MenuItem>
                                                  );
                                                }
                                              )
                                            ) : (
                                              <MenuItem key={0} value="norway">
                                                Norway
                                              </MenuItem>
                                            )}
                                          </Select>
                                          <FormHelperText>
                                            {errors?.billingCountry?.message}
                                          </FormHelperText>
                                        </FormControl>
                                      )}
                                    /> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                        <div className="my-20">
                          <Accordion className="bg-primary-25 shadow-0 border-0">
                            <AccordionSummary
                              expandIcon={
                                expanded0 ? (
                                  <IoMdAdd className="icon-size-20" />
                                ) : (
                                  <FiMinus className="icon-size-20" />
                                )
                              }
                              onClick={() => setExpanded0(!expanded0)}
                              id="panel1a-header"
                            >
                              <div className="subtitle3 text-MonochromeGray-700 flex gap-10 my-auto">
                                {t("label:invoiceReferences")}
                                <span>
                                  {dirtyFields.referenceNumber &&
                                  dirtyFields.internalReference &&
                                  dirtyFields.customerReference &&
                                  dirtyFields.customerNotes &&
                                  dirtyFields.termsConditions ? (
                                    <BsFillCheckCircleFill className="icon-size-16 text-teal-300" />
                                  ) : (
                                    <BsFillCheckCircleFill className="icon-size-16 text-MonochromeGray-50" />
                                  )}
                                </span>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails className="bg-white px-10">
                              <div className="w-full">
                                <div className="">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-20 my-20">
                                    <Controller
                                      name="referenceNumber"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:referenceNo")}
                                          type="number"
                                          onWheel={(event) => {
                                            event.target.blur();
                                          }}
                                          autoComplete="off"
                                          error={!!errors.referenceNumber}
                                          helperText={
                                            errors?.referenceNumber?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.referenceNumber,
                                          }}
                                          defaultValue={
                                            info.invoiceReferences
                                              ?.referenceNumber
                                              ? info.invoiceReferences
                                                  ?.referenceNumber
                                              : ""
                                          }
                                        />
                                      )}
                                    />

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
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.customerReference,
                                          }}
                                          defaultValue={
                                            info.invoiceReferences
                                              ?.customerReference
                                              ? info.invoiceReferences
                                                  ?.customerReference
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                    <Controller
                                      name="receiptNo"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:receiptNo")}
                                          type="text"
                                          autoComplete="off"
                                          error={!!errors.receiptNo}
                                          helperText={
                                            errors?.receiptNo?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.receiptNo,
                                          }}
                                          defaultValue={
                                            info.invoiceReferences
                                              ?.receiptNumber
                                              ? info.invoiceReferences
                                                  ?.receiptNumber
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-20 my-20">
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
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          defaultValue={
                                            info.invoiceReferences
                                              ?.customerNotes
                                              ? info.invoiceReferences
                                                  ?.customerNotes
                                              : ""
                                          }
                                        />
                                      )}
                                    />
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
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          defaultValue={
                                            info.invoiceReferences
                                              ?.termsAndCondition
                                              ? info.invoiceReferences
                                                  ?.termsAndCondition
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                        <div className="my-20">
                          <Accordion className="bg-primary-25 shadow-0 border-0">
                            <AccordionSummary
                              expandIcon={
                                expanded1 ? (
                                  <IoMdAdd className="icon-size-20" />
                                ) : (
                                  <FiMinus className="icon-size-20" />
                                )
                              }
                              onClick={() => setExpanded1(!expanded1)}
                              id="panel1a-header"
                            >
                              <div className="subtitle3 text-MonochromeGray-700 flex gap-10 my-auto">
                                {t("label:internalReferences")}
                                <span>
                                  {dirtyFields.internalReferenceNo &&
                                  dirtyFields.customerNotesInternal ? (
                                    <BsFillCheckCircleFill className="icon-size-16 text-teal-300" />
                                  ) : (
                                    <BsFillCheckCircleFill className="icon-size-16 text-MonochromeGray-50" />
                                  )}
                                </span>
                              </div>
                            </AccordionSummary>
                            <AccordionDetails className="bg-white px-10">
                              <div className="w-full">
                                <div className="">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-20 my-20">
                                    <Controller
                                      name="internalReferenceNo"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:internalReferenceNo")}
                                          type="number"
                                          onWheel={(event) => {
                                            event.target.blur();
                                          }}
                                          autoComplete="off"
                                          error={!!errors.internalReferenceNo}
                                          helperText={
                                            errors?.internalReferenceNo?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          disabled
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.internalReferenceNo,
                                          }}
                                          value={
                                            field.value ||
                                            (info.internalReferences
                                              ?.referenceNumber
                                              ? info.internalReferences
                                                  ?.referenceNumber
                                              : "")
                                          }
                                          defaultValue={
                                            info.internalReferences
                                              ?.referenceNumber
                                              ? info.internalReferences
                                                  ?.referenceNumber
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                    <Controller
                                      name="customerNotesInternal"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          multiline
                                          rows={5}
                                          label={t("label:customerNotes")}
                                          type="text"
                                          disabled
                                          autoComplete="off"
                                          error={!!errors.customerNotesInternal}
                                          helperText={
                                            errors?.customerNotesInternal
                                              ?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          value={
                                            field.value ||
                                            (info.internalReferences?.notes
                                              ? info.internalReferences?.notes
                                              : "")
                                          }
                                          defaultValue={
                                            info.internalReferences?.notes
                                              ? info.internalReferences?.notes
                                              : ""
                                          }
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                            </AccordionDetails>
                          </Accordion>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="border-1 border-MonochromeGray-25">
                      <div className="py-16 px-10 bg-primary-25 subtitle2 ">
                        {t("label:orderSummary")}
                      </div>
                      <div className="px-32 bg-white">
                        <div className="flex justify-between items-center  my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:subTotal")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {ThousandSeparator(info.orderSummary.subTotal)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center  my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:tax")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {ThousandSeparator(info.orderSummary.tax)}
                          </div>
                        </div>
                        <div className="flex justify-between items-center  my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:discount")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {ThousandSeparator(info.orderSummary.discount)}
                          </div>
                        </div>
                      </div>
                      <div className="px-14">
                        <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:grandTotal")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {ThousandSeparator(info.orderSummary.grandTotal)}
                          </div>
                        </div>
                      </div>
                      <div className="mt-10 mb-20 body3 px-32">
                        {t("label:orderSummaryDetails")}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderInformation;
