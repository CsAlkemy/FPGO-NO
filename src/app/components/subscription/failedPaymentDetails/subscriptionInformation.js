import { DesktopDatePicker, LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  Hidden,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DiscardConfirmModal from "../../common/confirmDiscard";
import {
  createSubscriptionDefaultValue,
  quickOrderValidation,
} from "../utils/helper";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CharCount from "../../common/charCount";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../../../data-access/services/authService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import UtilsServices from "../../../data-access/utils/UtilsServices";
import { useCreateQuickOrderMutation } from "app/store/api/apiSlice";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { useSnackbar } from "notistack";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import { useNavigate } from "react-router-dom";

const SubscriptionInformation = ({ info, customerInfo }) => {
  const { t } = useTranslation();
  const userInfo = UtilsServices.getFPUserData();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [searchCustomersList, setSearchCustomersList] = useState([]);
  const [addOrderIndex, setAddOrderIndex] = React.useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ]);
  const [itemLoader, setItemLoader] = useState(false);
  const [customerSearchBoxDropdownOpen, setCustomerSearchBoxDropdownOpen] =
    useState(false);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [taxes, setTaxes] = React.useState([]);

  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let grandTotal = 0;

  let defaultTaxValue;

  const [billingFrequency, setBillingFrequency] = React.useState([
    {
      title: "Monthly",
      value: "month",
    },
    {
      title: "weekly",
      value: "week",
    },
    {
      title: "daily",
      value: "day",
    },
  ]);

  const enableCurrentProductRow = (ind) => {
    setDisableRowIndexes(disableRowIndexes.filter((item) => item !== ind));
  };
  const [open, setOpen] = React.useState(false);

  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
    watch,
    resetField,
  } = useForm({
    mode: "onChange",
    createSubscriptionDefaultValue,
    resolver: yupResolver(quickOrderValidation),
  });
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  useEffect(() => {
    // createSubscriptionDefaultValue.billingFrequency = info.frequency || ""
    createSubscriptionDefaultValue.repeatsNoOfTimes = info.repeats || "";
    if (info?.products && info?.products && info?.products.length >= 2) {
      setAddOrderIndex(
        addOrderIndex.filter((item, index) => item <= info?.products.length - 1)
      );
    } else {
      setAddOrderIndex(addOrderIndex.filter((item, index) => item < 1));
    }
    reset({ ...createSubscriptionDefaultValue });
  }, []);

  const pnameOnBlur = (e) => {
    if (!e.target.value.length) {
      resetField(`${e.target.name}`);
    }
  };
  const onSubmit = (values) => {
    //console.log(values);
  };

  const disableCurrentProductRow = (index) => {
    setDisableRowIndexes([...disableRowIndexes, index]);
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

  const productWiseTotal = (index) => {
    const watchQuantity = watch(`order[${index}].quantity`);
    const watchRate = watch(`order[${index}].rate`);
    const watchDiscount = watch(`order[${index}].discount`) || 0;
    const watchTax = watch(`order[${index}].tax`);
    const watchName = watch(`order[${index}].productName`);
    const watchId = watch(`order[${index}].productID`);
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

  console.log("Info : ",info);

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white">
          <form
            name="subscriptionForm"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <div className="my-20">
                <div className="mt-32">
                  <div className="col-span-1 md:col-span-4 bg-white">
                    <div className="p-20 rounded-8 border-MonochromeGray-50 border-2 mb-20 w-full md:w-2/4">
                      <div className="flex justify-between items-center">
                        <div className="subtitle1 text-MonochromeGray-700">
                          {customerInfo?.customerName || ""}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-MonochromeGray-700 body2 mt-16">
                          {customerInfo?.countryCode && customerInfo?.msisdn
                            ? customerInfo?.countryCode + customerInfo?.msisdn
                            : ""}
                        </div>
                        <div className="text-MonochromeGray-700 body2">
                          {customerInfo?.customerEmail || ""}
                        </div>
                        <div className="text-MonochromeGray-700 body2">
                          {customerInfo?.street
                            ? `${customerInfo?.street}, `
                            : ""}{" "}
                          {customerInfo?.city || ""}{" "}
                          {customerInfo?.zip ? `${customerInfo?.zip}, ` : ""}{" "}
                          {customerInfo?.country || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-20 my-32">
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
                      disabled
                      onChange={onChange}
                      minDate={new Date().setDate(new Date().getDate() - 30)}
                      maxDate={new Date().setDate(new Date().getDate() + 30)}
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
                              ? t(`validation:${errors?.orderDate?.message}`)
                              : ""
                          }
                          sx={{
                            svg: { color: "#E7AB52" },
                          }}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="dueDatePaymentLink"
                  control={control}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <DesktopDatePicker
                      label={t("label:dueDateForPaymentLink")}
                      mask=""
                      inputFormat="dd.MM.yyyy"
                      disabled
                      value={
                        !value
                          ? new Date().setDate(new Date().getDate() + 2)
                          : value
                        // : value
                      }
                      required
                      onChange={onChange}
                      disablePast={true}
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
                          error={!!errors.dueDatePaymentLink}
                          helperText={
                            errors?.dueDatePaymentLink?.message
                              ? t(
                                  `validation:${errors?.dueDatePaymentLink?.message}`
                                )
                              : ""
                          }
                          sx={{
                            svg: { color: "#F36562" },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-20 my-32">
                <Controller
                  name="billingFrequency*"
                  control={control}
                  render={({ field }) => (
                    <FormControl error={!!errors.billingFrequency} fullWidth>
                      <InputLabel id="billingFrequency">
                        {t("label:billingFrequency")} *
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="billingFrequency"
                        id="select"
                        label={t("label:billingFrequency")}
                        defaultValue={info?.frequency || "month"}
                        disabled
                        value={field.value}
                        required
                      >
                        {billingFrequency.length ? (
                          billingFrequency.map((frequency, index) => {
                            return (
                              <MenuItem key={index} value={frequency.value}>
                                {t(`label:${frequency.title}`)}
                              </MenuItem>
                            );
                          })
                        ) : (
                          <MenuItem key={0} value={30}>
                            Monthly
                          </MenuItem>
                        )}
                      </Select>
                      <FormHelperText>
                        {errors?.billingFrequency?.message
                          ? t(`validation:${errors?.billingFrequency?.message}`)
                          : ""}
                      </FormHelperText>
                    </FormControl>
                  )}
                />

                <Controller
                  name="repeatsNoOfTimes"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label={t("label:repeatsNoOfTimes")}
                      type="number"
                      required
                      autoComplete="off"
                      disabled
                      error={!!errors.repeatsNoOfTimes}
                      helperText={
                        errors?.repeatsNoOfTimes?.message
                          ? t(`validation:${errors?.repeatsNoOfTimes?.message}`)
                          : ""
                      }
                      defaultValue={info?.repeats || ""}
                      variant="outlined"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="subscriptionEnds"
                  control={control}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <DesktopDatePicker
                      label={t("label:subscriptionEnds")}
                      mask=""
                      inputFormat="dd.MM.yyyy"
                      value={!value ? new Date() : value}
                      required
                      onChange={onChange}
                      minDate={new Date().setDate(new Date().getDate() - 30)}
                      maxDate={new Date().setDate(new Date().getDate() + 30)}
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
                          disabled
                          type="date"
                          error={!!errors.subscriptionEnds}
                          helperText={
                            errors?.subscriptionEnds?.message
                              ? t(
                                  `validation:${errors?.subscriptionEnds?.message}`
                                )
                              : ""
                          }
                          sx={{
                            svg: { color: "#E7AB52" },
                          }}
                        />
                      )}
                    />
                  )}
                />
              </div>
              <div className="send-order-credit-check">
                <div className="caption2 text-MonochromeGray-300 my-10">
                  {t("label:sendOrderBy")}
                </div>
                <div className="body3 text-MonochromeGray-300">
                  {t(
                    "label:sendingBySMSOrInvoiceIncursAnAdditionalCostForEachOrder"
                  )}
                </div>
                <div className="flex gap-20 w-full md:w-3/4 my-32">
                  <Button
                    variant="outlined"
                    className={`${
                      info?.sendOrderViaSms
                        ? "create-order-capsule-button-active"
                        : "create-order-capsule-button"
                    }`}
                    disabled
                  >
                    {t("label:sms")}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled
                    className={`${
                      info?.sendOrderViaEmail
                        ? "create-order-capsule-button-active"
                        : "create-order-capsule-button"
                    }`}
                  >
                    {t("label:email")}
                  </Button>
                </div>
              </div>
              <Hidden smUp>
                <div>
                  <Accordion
                    defaultExpanded={true}
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
                                  info.products &&
                                  info.products?.[index]?.productName
                                    ? info.products[index].productName
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
                                label="Product ID"
                                className="bg-white custom-input-height"
                                type="text"
                                autoComplete="off"
                                error={!!errors.productID}
                                helperText={errors?.productID?.message}
                                variant="outlined"
                                fullWidth
                                disabled={disableRowIndexes.includes(index)}
                                defaultValue={
                                  info?.products &&
                                  info?.products?.[index]?.productId
                                    ? info?.products[index].productId
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
                                  label="Qty"
                                  className="bg-white custom-input-height col-span-2"
                                  type="number"
                                  required
                                  value={field.value || ""}
                                  autoComplete="off"
                                  error={!!errors?.order?.[index]?.quantity}
                                  variant="outlined"
                                  defaultValue={
                                    info?.products &&
                                    info?.products?.[index]?.quantity
                                      ? info?.products[index].quantity
                                      : ""
                                  }
                                  fullWidth
                                />
                              )}
                            />
                            <Controller
                              name={`order[${index}].rate`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Rate"
                                  className="bg-white custom-input-height col-span-1"
                                  autoComplete="off"
                                  error={!!errors?.order?.[index]?.rate}
                                  variant="outlined"
                                  required
                                  value={field.value || ""}
                                  fullWidth
                                  disabled={disableRowIndexes.includes(index)}
                                  defaultValue={
                                    info?.products &&
                                    info?.products?.[index]?.rate
                                      ? info?.products[index].rate
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
                                  label="Discount"
                                  className="bg-white custom-input-height col-span-2"
                                  type="number"
                                  autoComplete="off"
                                  value={field.value || ""}
                                  error={!!errors.discount}
                                  helperText={errors?.discount?.message}
                                  variant="outlined"
                                  fullWidth
                                  defaultValue={
                                    info?.products &&
                                    info?.products?.[index]?.discount
                                      ? info?.products[index].discount
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
                                    info.products &&
                                    info.products?.[index]?.tax === 0
                                      ? 0
                                      : info.products[index]?.tax
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className="flex justify-between subtitle1 pt-20 border-t-1 border-MonochromeGray-50">
                            <div>{t("label:total")}</div>
                            <div>
                              {t("label:nok")}{" "}
                              {info?.products?.[index]?.amount ? ThousandSeparator(info?.products?.[index]?.amount) : 0}
                            </div>
                          </div>
                        </div>
                      ))}
                      {/*<div className="bg-MonochromeGray-50 p-20 subtitle2 text-MonochromeGray-700">*/}
                      {/*  {t("label:grandTotal")} : {t("label:nok")}{" "}*/}
                      {/*  {ThousandSeparator(grandTotal.toFixed(2) / 2)}*/}
                      {/*</div>*/}
                    </AccordionDetails>
                  </Accordion>
                </div>
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
                      {t("label:qty")}.
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
                                info.products &&
                                info.products?.[index]?.productName
                                  ? info.products[index].productName
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
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.productId
                                  ? info.products[index].productId
                                  : ""
                              }
                              disabled
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
                              className="bg-white custom-input-height"
                              type="number"
                              disabled
                              autoComplete="off"
                              error={!!errors?.order?.[index]?.quantity}
                              // helperText={
                              //   errors?.order?.[index]?.quantity?.message
                              // }
                              variant="outlined"
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.quantity
                                  ? info.products[index].quantity
                                  : ""
                              }
                              fullWidth
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
                              autoComplete="off"
                              error={!!errors?.order?.[index]?.rate}
                              // helperText={errors?.order?.[index]?.rate?.message}
                              variant="outlined"
                              required
                              fullWidth
                              defaultValue={
                                info.products && info.products?.[index]?.rate
                                  ? info.products[index].rate
                                  : ""
                              }
                              disabled
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
                              disabled
                              error={!!errors.discount}
                              helperText={errors?.discount?.message}
                              variant="outlined"
                              fullWidth
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.discount
                                  ? info.products[index].discount
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
                              helperText={errors?.order?.[index]?.tax?.message}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.tax === 0
                                  ? 0
                                  : info.products[index]?.tax
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="my-auto">
                        <div className="body3 text-right">
                          {t("label:nok")}{" "}
                          {info?.products?.[index]?.amount ? ThousandSeparator(info?.products?.[index]?.amount) : 0}
                        </div>
                      </div>
                    </div>
                  ))}

                  <hr className=" mt-20 border-half-bottom" />
                </div>
              </Hidden>
              <div className="grid grid-cols-1 md:grid-cols-6 my-20">
                <div className="col-span-1 md:col-span-3 mt-20 flex flex-col gap-y-20 pb-20 sm:pb-0">
                  <div>
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
                          disabled
                          value={info?.customerNote || ""}
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
                    <CharCount
                      current={info?.customerNote?.length || 0}
                      total={200}
                    />
                  </div>

                  <div>
                    <Controller
                      name="termsConditions"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          rows={5}
                          disabled
                          label={t("label:tnc")}
                          type="text"
                          error={!!errors.termsConditions}
                          value={info?.termsAndConditions || ""}
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
                    <CharCount
                      current={info?.termsAndConditions?.length || 0}
                      total={200}
                    />
                  </div>
                </div>
                <div className="col-span-1"></div>
                <div className="col-span-1 md:col-span-2">
                  <div className="rounded-8 bg-MonochromeGray-25 p-20">
                    <div className="">
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:subTotal")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {info?.subTotal
                            ? ThousandSeparator(info?.subTotal)
                            : 0}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:tax")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")} {info?.tax
                          ? ThousandSeparator(info?.tax)
                          : 0}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:discount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")} {info?.discount
                          ? ThousandSeparator(info?.discount)
                          : 0}
                        </div>
                      </div>
                    </div>
                    <div className=" mx-5 my-10">
                      <hr />
                    </div>
                    <div>
                      <div className="flex justify-between items-center my-5">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:payablePerCycle")}
                        </div>
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:nok")} {info?.payablePerCycle ? ThousandSeparator(info?.payablePerCycle) : 0}
                        </div>
                      </div>

                      <div className="flex justify-between items-center my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:frequency")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {info?.frequency === "month"
                            ? t("label:monthly")
                            : info?.frequency === "week"
                            ? t("label:weekly")
                            : t("label:daily")}
                        </div>
                      </div>

                      <div className="flex justify-between items-center my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:repeats")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {info?.repeats || 0} {t("label:times")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <DiscardConfirmModal
        open={open}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};
export default SubscriptionInformation;
