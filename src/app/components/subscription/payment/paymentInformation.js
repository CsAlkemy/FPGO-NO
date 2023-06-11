import { yupResolver } from "@hookform/resolvers/yup";
import CreateIcon from "@mui/icons-material/Create";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogContentText,
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
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import { useNavigate, useParams } from "react-router-dom";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import {
  PaymentDefaultValue,
  validateSchemaCreditCheckForCheckout,
  validateSchemaPaymentCheckout,
  validateSchemaPaymentCheckoutCorporate,
} from "../utils/helper";
import PaymentHeader from "./paymentHeader";
import { usePaymentScreenCreditCheckMutation } from "app/store/api/apiSlice";
import { LoadingButton } from "@mui/lab";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import CountrySelect from "../../common/countries";
import SubscriptionsService from "../../../data-access/services/subscriptionsService/SubscriptionsService";

const paymentInformation = () => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const orderUuid = useParams().uuid;
  const { enqueueSnackbar } = useSnackbar();
  const [isApproved, setIsApproved] = React.useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const [creditCheckMessage, setCreditCheckMessage] = useState("");
  const [paymentScreenCreditCheck] = usePaymentScreenCreditCheckMutation();
  const [apiLoading, setApiLoading] = React.useState(false);
  const [isCreditChecked, setIsCreditChecked] = React.useState(false);
  const [recheckSchema, setRecheckSchema] = React.useState(false);
  const [customData, setCustomData] = React.useState({
    paymentMethod: "vipps",
    isCeditCheck: false,
    isNewCustomer: false,
    customerType: "private",
  });
  const [updatedData, setUpdatedData] = useState({});
  const [isUpdateData, setIsUpdateData] = useState(false);

  const navigate = useNavigate();

  const [paymentMethodList, setPaymentMethodList] = React.useState([
    {
      id: 1,
      name: "VIPPS",
      logo: "assets/images/payment/viips.png",
    },
    {
      id: 2,
      name: "Visa",
      logo: "assets/images/payment/visa.png",
    },
    {
      id: 3,
      name: "Mastercard",
      logo: "assets/images/payment/master.png",
    },
    {
      id: 4,
      name: "Invoice",
      logo: "assets/images/payment/frontPayment.png",
    },
  ]);
  let schema =
    customData?.customerType === "private"
      ? validateSchemaPaymentCheckout
      : validateSchemaPaymentCheckoutCorporate;
  useEffect(() => {
    schema =
      customData?.customerType === "private"
        ? validateSchemaPaymentCheckout
        : validateSchemaPaymentCheckoutCorporate;
    if (recheckSchema) {
      if (customData?.customerType === "corporate") {
        clearErrors(["orgIdOrPNumber", "orgIdOrPNumber"]);
        setValue("orgIdOrPNumber", "", { shouldValidate: true });
        setError("orgIdOrPNumber", { type: "focus" }, { shouldFocus: true });
      } else {
        setValue("orgIdOrPNumber", "", { shouldValidate: true });
        clearErrors(["orgIdOrPNumber", "orgIdOrPNumber"]);
      }
    }
  }, [customData?.customerType]);

  const {
    control,
    formState,
    handleSubmit,
    getValues,
    reset,
    watch,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    mode: "onChange",
    PaymentDefaultValue,
    resolver: yupResolver(
      customData.isCeditCheck ? validateSchemaCreditCheckForCheckout : schema
    ),
  });

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const onSubmit = (values) => {
    setOpen(true);
    const data = isUpdateData
      ? {
        ...updatedData,
        ...customData,
        orderUuid: orderDetails?.orderNo || "",
        currency: orderDetails?.currency || "",
        customerUuid: orderDetails?.customerDetails?.uuid
          ? orderDetails?.customerDetails?.uuid
          : null,
      }
      : {
        ...values,
        ...customData,
        orderUuid: orderDetails?.orderNo || "",
        currency: orderDetails?.currency || "",
        customerUuid: orderDetails?.customerDetails?.uuid
          ? orderDetails?.customerDetails?.uuid
          : null,
      };

    OrdersService.subscriptionPayNow(data)
      .then((response) => {
        if (
          response?.status_code === 201 &&
          response?.is_data &&
          response?.data?.url
        ) {
          setOpen(false);
          // navigate("/payment/checkout/status");
          // navigate(`${response?.data?.paymentUrl}`);
          localStorage.setItem(
            "orderConfirmationData",
            JSON.stringify({
              orderUuid: orderDetails?.orderUuid,
              sentBy: orderDetails?.sendOrderBy?.sms ? "sms" : "email",
              phoneOrEmail: orderDetails?.sendOrderBy?.sms
                ? orderDetails?.customerDetails?.countryCode +
                orderDetails?.customerDetails?.msisdn
                : orderDetails?.customerDetails?.email,
            })
          );
          window.location.href = `${response?.data?.url}`;
        } else if (response?.status_code === 202 && !response?.is_data) {
          navigate(`'/subscription/payment/details/${orderUuid}/confirmation`);
        }
      })
      .catch((e) => {
        enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        setOpen(false);
      });
    setTimeout(() => {
      setOpen(false);
      navigate("/payment/checkout/status");
    }, 2000);
  };

  useEffect(() => {
    if (
      window.location.pathname.includes("/subscription/payment/details/SUB")
    ) {
      SubscriptionsService.getSubscriptionDetailsByUUIDPayment(orderUuid)
        .then((response) => {
          if (response?.status_code === 200 && response?.is_data) {
            // if (response?.data?.status !== "SENT") return navigate("404");
            setOrderDetails(response.data);
            PaymentDefaultValue.phone =
              response?.data?.customerDetails?.countryCode &&
              response?.data?.customerDetails?.msisdn
                ? response?.data?.customerDetails?.countryCode +
                response?.data?.customerDetails?.msisdn
                : "";
            PaymentDefaultValue.email = response?.data?.customerDetails?.email
              ? response?.data?.customerDetails?.email
              : "";
            PaymentDefaultValue.customerName = response?.data?.customerDetails
              ?.name
              ? response?.data?.customerDetails?.name
              : "";
            PaymentDefaultValue.orgIdOrPNumber = response?.data?.customerDetails
              ?.personalNumber
              ? response?.data?.customerDetails?.personalNumber
              : response?.data?.customerDetails?.organizationId
                ? response?.data?.customerDetails?.organizationId
                : "";
            // PaymentDefaultValue.orgIdCreditCheck = response?.data?.customerDetails
            //   ?.personalNumber
            //   ? response?.data?.customerDetails?.personalNumber
            //   : response?.data?.customerDetails?.organizationId
            //     ? response?.data?.customerDetails?.organizationId
            //     : "";
            //
            PaymentDefaultValue.billingAddress =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.street
                ? response?.data?.customerDetails?.address?.street
                : "";
            PaymentDefaultValue.billingZip =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.zip
                ? response?.data?.customerDetails?.address?.zip
                : "";
            PaymentDefaultValue.billingCity =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.city
                ? response?.data?.customerDetails?.address?.city
                : "";
            PaymentDefaultValue.billingCountry =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.country
                ? response?.data?.customerDetails?.address?.country
                : "";
            setCustomData({
              ...customData,
              customerType:
                response?.data?.customerDetails?.type === "Private"
                  ? "private"
                  : "corporate",
              isCeditCheck: false,
            });
            reset({ ...PaymentDefaultValue });
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          // enqueueSnackbar(e, { variant: "error" });
          return navigate("404");
        });
    } else {
      OrdersService.getOrdersDetailsByUUIDPayment(orderUuid)
        .then((response) => {
          if (response?.status_code === 200 && response?.is_data) {
            if (response?.data?.status !== "SENT") return navigate("404");
            setOrderDetails(response.data);
            PaymentDefaultValue.phone =
              response?.data?.customerDetails?.countryCode &&
              response?.data?.customerDetails?.msisdn
                ? response?.data?.customerDetails?.countryCode +
                response?.data?.customerDetails?.msisdn
                : "";
            PaymentDefaultValue.email = response?.data?.customerDetails?.email
              ? response?.data?.customerDetails?.email
              : "";
            PaymentDefaultValue.customerName = response?.data?.customerDetails
              ?.name
              ? response?.data?.customerDetails?.name
              : "";
            PaymentDefaultValue.orgIdOrPNumber = response?.data?.customerDetails
              ?.personalNumber
              ? response?.data?.customerDetails?.personalNumber
              : response?.data?.customerDetails?.organizationId
                ? response?.data?.customerDetails?.organizationId
                : "";
            PaymentDefaultValue.orgIdCreditCheck = response?.data
              ?.customerDetails?.personalNumber
              ? response?.data?.customerDetails?.personalNumber
              : response?.data?.customerDetails?.organizationId
                ? response?.data?.customerDetails?.organizationId
                : "";

            PaymentDefaultValue.billingAddress =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.street
                ? response?.data?.customerDetails?.address?.street
                : "";
            PaymentDefaultValue.billingZip =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.zip
                ? response?.data?.customerDetails?.address?.zip
                : "";
            PaymentDefaultValue.billingCity =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.city
                ? response?.data?.customerDetails?.address?.city
                : "";
            PaymentDefaultValue.billingCountry =
              response?.data?.customerDetails?.address &&
              response?.data?.customerDetails?.address?.country
                ? response?.data?.customerDetails?.address?.country
                : "";
            setCustomData({
              ...customData,
              customerType:
                response?.data?.customerDetails?.type === "Private"
                  ? "private"
                  : "corporate",
              isCeditCheck: response?.data?.creditCheck
                ? response?.data?.creditCheck
                : false,
            });
            reset({ ...PaymentDefaultValue });
          }
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
          // enqueueSnackbar(e, { variant: "error" });
          return navigate("404");
        });
    }
  }, [isLoading]);

  const handleCreditCheck = () => {
    setApiLoading(true);
    const params = {
      // type : customData?.customerType.toLowerCase(),
      type:
        getValues("orgIdCreditCheck").length === 9 ? "corporate" : "private",
      creditCheckId: getValues("orgIdCreditCheck"),
    };
    const creditCheckPrivateData = {
      personalId: params.creditCheckId,
      type: params.type,
    };
    const creditCheckCorporateData = {
      organizationId: params.creditCheckId,
      type: params.type,
    };
    const preparedPayload =
      params.type === "private"
        ? creditCheckPrivateData
        : creditCheckCorporateData;
    setApiLoading(true);
    paymentScreenCreditCheck(preparedPayload).then((response) => {
      if (response?.data?.data?.isApproved) {
        setIsApproved(true);
        setCreditCheckMessage("Credit check was successful");
        setApiLoading(false);
        setIsCreditChecked(true);
      } else {
        setIsApproved(false);
        setCreditCheckMessage("Credit check was declined");
        setApiLoading(false);
        setIsCreditChecked(false);
      }
    });
    setCustomData({
      ...customData,
      isCeditCheck: true,
    });
  };

  const watchPhone = watch("phone");
  const watchEmail = watch("email");
  const watchName = watch("customerName");
  const watchOrgIdOrPNumber = watch("orgIdOrPNumber");
  const watchStreet = watch("billingAddress");
  const watchZip = watch("billingZip");
  const watchCity = watch("billingCity");
  const watchCountry = watch("billingCountry");

  const handleUpdate = () => {
    setIsUpdateData(true);
    setUpdatedData({
      ...updatedData,
      phone: watchPhone || "",
      email: watchEmail || "",
      customerName: watchName || "",
      orgIdOrPNumber: watchOrgIdOrPNumber || "",
      billingAddress: watchStreet || "",
      billingZip: watchZip || "",
      billingCity: watchCity || "",
      billingCountry: watchCountry || "",
    });
    setEditOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl my-32">
        <form
          name="paymentInfoForm"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex-auto mx-auto  w-full md:w-4/5 lg:w-3/4 xl:w-7/12">
            <div className="order-receipt-container">
              <PaymentHeader />
              <div className="main-layout-product mt-32">
                <div className="col-span-1 md:col-span-4 bg-white">
                  <div className="p-20 rounded-8 border-MonochromeGray-50 border-2 my-40 w-full md:w-3/5">
                    <div className="flex justify-between items-center">
                      <div className="subtitle1 text-MonochromeGray-700">
                        {updatedData?.customerName
                          ? updatedData.customerName
                          : orderDetails?.customerDetails?.name
                            ? orderDetails?.customerDetails?.name
                            : "-"}
                      </div>
                      <div>
                        <IconButton
                          aria-label="delete"
                          className="bg-primary-25"
                          onClick={() => setEditOpen(true)}
                          type="button"
                        >
                          <CreateIcon className="text-primary-500 icon-size-20" />
                        </IconButton>
                      </div>
                    </div>
                    <div className="">
                      <div className="body3 text-MonochromeGray-300">
                        {t("label:pNumber")}:{" "}
                        {updatedData?.orgIdOrPNumber
                          ? updatedData.orgIdOrPNumber
                          : orderDetails?.customerDetails?.personalNumber
                            ? orderDetails?.customerDetails?.personalNumber
                            : "-"}
                      </div>
                      <div className="text-MonochromeGray-700 body2 mt-16">
                        {updatedData?.phone
                          ? updatedData.phone
                          : orderDetails?.customerDetails?.countryCode &&
                          orderDetails?.customerDetails?.msisdn
                            ? orderDetails?.customerDetails?.countryCode +
                            orderDetails?.customerDetails?.msisdn
                            : "-"}
                      </div>
                      <div className="text-MonochromeGray-700 body2">
                        {updatedData?.email
                          ? updatedData.email
                          : orderDetails?.customerDetails?.email
                            ? orderDetails?.customerDetails?.email
                            : "-"}
                      </div>
                      <div className="text-MonochromeGray-700 body2">
                        {updatedData?.billingAddress
                          ? updatedData.billingAddress + ", "
                          : orderDetails?.customerDetails?.address &&
                          orderDetails?.customerDetails?.address?.street
                            ? orderDetails?.customerDetails?.address?.street +
                            ", "
                            : "-, "}
                        {updatedData?.billingCity
                          ? updatedData.billingCity + ", "
                          : orderDetails?.customerDetails?.address &&
                          orderDetails?.customerDetails?.address?.city
                            ? orderDetails?.customerDetails?.address?.city + " "
                            : "-"}
                        {updatedData?.billingZip
                          ? updatedData.billingZip + ", "
                          : orderDetails?.customerDetails?.address &&
                          orderDetails?.customerDetails?.address?.zip
                            ? orderDetails?.customerDetails?.address?.zip + ", "
                            : "-, "}
                        {updatedData?.billingCountry
                          ? updatedData.billingCountry
                          : orderDetails?.customerDetails?.address &&
                          orderDetails?.customerDetails?.address?.country
                            ? orderDetails?.customerDetails?.address?.country
                            : "-"}
                      </div>
                    </div>
                  </div>
                  <Dialog
                    open={editOpen}
                    maxWidth={"md"}
                    onClose={() => setEditOpen(false)}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="rounded-2"
                  >
                    <div className="p-16">
                      <DialogTitle
                        id="alert-dialog-title"
                        className="header6 text-MonochromeGray-700"
                      >
                        {t("label:customerDetails")}
                      </DialogTitle>
                      <DialogContent className="p-5 md:p-40">
                        <div id="customer-information-payment">
                          <div className="bg-white px-5">
                            <div className="search-customer-order-create-type my-32">
                              <div className="flex gap-20 w-full md:w-3/4 mb-32 mt-20 justify-between sm:justify-start">
                                <Button
                                  variant="outlined"
                                  className={`body2 ${
                                    customData?.customerType === "private"
                                      ? "create-order-capsule-button-active"
                                      : "create-order-capsule-button"
                                  }`}
                                  onClick={() => {
                                    setCustomData({
                                      ...customData,
                                      customerType: "private",
                                    });
                                    setRecheckSchema(true);
                                  }}
                                  disabled={
                                    orderDetails.type === "REGULAR" &&
                                    orderDetails?.customerDetails?.type ===
                                    "Corporate"
                                  }
                                  // disabled={
                                  //   orderDetails &&
                                  //   orderDetails?.customerDetails?.type ===
                                  //     "Corporate" &&
                                  //   !customData?.isNewCustomer
                                  // }
                                >
                                  {t("label:private")}
                                </Button>
                                <Button
                                  variant="outlined"
                                  className={`body2 ${
                                    customData?.customerType === "corporate"
                                      ? "create-order-capsule-button-active"
                                      : "create-order-capsule-button"
                                  }`}
                                  onClick={() => {
                                    setCustomData({
                                      ...customData,
                                      customerType: "corporate",
                                    });
                                    setRecheckSchema(true);
                                  }}
                                  disabled={
                                    orderDetails.type === "REGULAR" &&
                                    orderDetails?.customerDetails?.type ===
                                    "Private"
                                  }
                                  // disabled={
                                  //   orderDetails &&
                                  //   orderDetails?.customerDetails?.type ===
                                  //     "Private" &&
                                  //   !customData?.isNewCustomer
                                  // }
                                >
                                  {t("label:corporate")}
                                </Button>
                              </div>
                            </div>
                            <div className="w-full my-32">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-32 mt-10 my0i mb-0 md:mb-32 gap-x-20">
                                <Controller
                                  name="phone"
                                  control={control}
                                  render={({ field }) => (
                                    <FormControl
                                      error={!!errors.phone}
                                      fullWidth
                                    >
                                      <PhoneInput
                                        {...field}
                                        className={
                                          errors.phone
                                            ? "input-phone-number-field border-1 rounded-md border-red-300"
                                            : "input-phone-number-field"
                                        }
                                        country="no"
                                        // enableSearch
                                        // autocompleteSearch
                                        countryCodeEditable={false}
                                        specialLabel={`${t("label:phone")}*`}
                                        value={field.value || ""}
                                      />
                                      <FormHelperText>
                                        {errors?.phone?.message
                                          ? t(
                                            `validation:${errors?.phone?.message}`
                                          )
                                          : ""}
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
                                      className="mb-32 md:mb-auto"
                                      autoComplete="off"
                                      error={!!errors.email}
                                      helperText={
                                        errors?.email?.message
                                          ? t(
                                            `validation:${errors?.email?.message}`
                                          )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      // required={
                                      //   customData.customerType ===
                                      //     "corporate" ||
                                      //   customData.orderBy === "email"
                                      // }
                                      required
                                      value={field.value || ""}
                                    />
                                  )}
                                />
                              </div>
                              <div className="">
                                <div
                                  className={`${
                                    customData.customerType === "corporate"
                                      ? "form-pair-input"
                                      : ""
                                  } gap-x-20 `}
                                >
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
                                            ? t(
                                              `validation:${errors?.customerName?.message}`
                                            )
                                            : ""
                                        }
                                        required
                                        variant="outlined"
                                        fullWidth
                                        value={field.value || ""}
                                      />
                                    )}
                                  />
                                  {customData.customerType === "corporate" && (
                                    <Controller
                                      name="orgIdOrPNumber"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={
                                            t("label:organizationId")
                                            // customData.customerType === "private"
                                            //     ? t("label:pNumber")
                                            //     : t("label:organizationId")
                                          }
                                          type="number"
                                          onWheel={(event) => {
                                            event.target.blur();
                                          }}
                                          autoComplete="off"
                                          error={!!errors.orgIdOrPNumber}
                                          required={
                                            customData.customerType !==
                                            "private"
                                          }
                                          helperText={
                                            errors?.orgIdOrPNumber?.message
                                              ? t(
                                                `validation:${errors?.orgIdOrPNumber?.message}`
                                              )
                                              : ""
                                          }
                                          variant="outlined"
                                          fullWidth
                                          value={field.value || ""}
                                        />
                                      )}
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div id="billing-address-payment">
                          <div className="w-full px-5">
                            <div className="form-pair-three-by-one custom-margin-two-payment">
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
                                          ? t(
                                            `validation:${errors?.billingAddress?.message}`
                                          )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      value={field.value || ""}
                                      required
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
                                          ? t(
                                            `validation:${errors?.billingZip?.message}`
                                          )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      value={field.value || ""}
                                      required
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
                                        ? t(
                                          `validation:${errors?.billingCity?.message}`
                                        )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    value={field.value || ""}
                                    required
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
                              />
                              {/*
                              <Controller
                                name="billingCountry"
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    error={!!errors.billingCountry}
                                    fullWidth
                                  >
                                    <InputLabel id="billingCountry">
                                      {t("label:country")} *
                                    </InputLabel>
                                    <Select
                                      {...field}
                                      labelId="billingCountry"
                                      id="select"
                                      label={t("label:country")}
                                      value={field.value || ""}
                                    >
                                      {countries.length ? (
                                        countries.map((country, index) => {
                                          return (
                                            <MenuItem
                                              key={index}
                                              value={country.name}
                                            >
                                              {country.title}
                                            </MenuItem>
                                          );
                                        })
                                      ) : (
                                        <MenuItem key={0} value="norway">
                                          Norway
                                        </MenuItem>
                                      )}
                                    </Select>
                                    <FormHelperText>
                                      {errors?.billingCountry?.message
                                        ? t(
                                            `validation:${errors?.billingCountry?.message}`
                                          )
                                        : ""}
                                    </FormHelperText>
                                  </FormControl>
                                )}
                              /> */}
                            </div>
                          </div>
                        </div>

                        <div className="flex mt-40 justify-between sm:justify-end  gap-10 items-center">
                          <Button
                            variant="contained"
                            className="font-semibold rounded-4 bg-primary-50 text-primary-800 w-full md:w-auto z-99 px-32"
                            onClick={() => setEditOpen(false)}
                          >
                            {t("label:cancel")}
                          </Button>
                          <Button
                            variant="contained"
                            type="submit"
                            className="font-semibold rounded-4 bg-primary-500 text-white hover:text-primary-800 w-full md:w-auto px-40"
                            // onClick={() => setEditOpen(false)}
                            onClick={() => handleUpdate()}
                            disabled={!isValid}
                          >
                            {t("label:update")}
                          </Button>
                        </div>
                      </DialogContent>
                    </div>
                  </Dialog>
                  <div id="billing-address-payment">
                    <div className="w-full px-5">
                      <div className="caption2 text-MonochromeGray-300 my-20">
                        {t("label:selectPaymentMethod")} *
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4  cursor-pointer justify-between gap-10 md:gap-20 items-center w-full md:w-4/5">
                        {paymentMethodList.map((item) => {
                          return (
                            <div
                              key={item.id}
                              className={`p-10 md:p-20 rounded-6 h-auto md:h-120 flex flex-row-reverse md:flex-col items-center justify-between md:justify-end gap-10 ${
                                customData.paymentMethod ===
                                item.name.toLowerCase()
                                  ? `border-2 border-primary-500`
                                  : `border-1 border-MonochromeGray-50`
                              }`}
                              onClick={() => {
                                setCustomData({
                                  ...customData,
                                  paymentMethod: item.name.toLowerCase(),
                                });
                              }}
                            >
                              <img
                                className={` ${
                                  item.name === "VIPPS"
                                    ? "max-h-16 min-h-16"
                                    : "max-h-32 min-h-32"
                                } md:max-h-48`}
                                src={item.logo}
                                alt={item.name}
                              />
                              <div className="text-center body2  mt-0 md:mt-5">
                                {item.name}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {customData.paymentMethod === "invoice" &&
                        customData.isCeditCheck && (
                          <div className="mt-36 mb-20">
                            <div className="caption2 text-MonochromeGray-300 mb-20">
                              {t("label:informationForCreditCheck")}
                            </div>
                            <div className="flex gap-10 justify-start items-center flex-col md:flex-row gap-y-10 w-full md:w-3/4">
                              <Controller
                                name="orgIdCreditCheck"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label={t("label:orgIdPNumber")}
                                    type="text"
                                    autoComplete="off"
                                    error={!!errors.orgIdCreditCheck}
                                    // helperText={
                                    //   errors?.orgIdCreditCheck?.message
                                    // }
                                    variant="outlined"
                                    fullWidth
                                    value={field.value || ""}
                                  />
                                )}
                              />
                              <LoadingButton
                                variant="contained"
                                color="secondary"
                                className="w-full md:w-auto font-semibold rounded-4 bg-primary-500 text-white hover:text-primary-800"
                                aria-label="Confirm"
                                size="large"
                                type="button"
                                loading={apiLoading}
                                loadingPosition="center"
                                onClick={() => handleCreditCheck()}
                              >
                                {t("label:check")}
                              </LoadingButton>
                            </div>
                            <div
                              className={`${
                                !!isApproved ? "text-green-600" : "text-red-500"
                              } text-MonochromeGray-300 my-8 mx-8`}
                            >
                              {creditCheckMessage}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                  <Hidden mdUp>
                    <div className="col-span-2 mt-20">
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
                            {orderDetails?.orderSummary?.subTotal
                              ? ThousandSeparator(
                                orderDetails?.orderSummary?.subTotal
                              )
                              : ""}
                          </div>
                        </div>
                        <div className="flex justify-between items-center  my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:tax")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {orderDetails?.orderSummary?.tax
                              ? ThousandSeparator(
                                orderDetails?.orderSummary?.tax
                              )
                              : 0}
                          </div>
                        </div>
                        <div className="flex justify-between items-center  my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:discount")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {orderDetails?.orderSummary?.discount
                              ? ThousandSeparator(
                                orderDetails?.orderSummary?.discount
                              )
                              : 0}
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
                            {orderDetails?.orderSummary?.grandTotal
                              ? ThousandSeparator(
                                orderDetails?.orderSummary?.grandTotal
                              )
                              : ""}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Hidden>
                </div>

                <Hidden mdDown>
                  <div className="col-span-2 mt-20">
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
                          {orderDetails?.orderSummary?.subTotal
                            ? ThousandSeparator(
                              orderDetails?.orderSummary?.subTotal
                            )
                            : ""}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-20">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:discount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {orderDetails?.orderSummary?.discount
                            ? ThousandSeparator(
                              orderDetails?.orderSummary?.discount
                            )
                            : 0}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-20">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:tax")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {orderDetails?.orderSummary?.tax
                            ? ThousandSeparator(orderDetails?.orderSummary?.tax)
                            : 0}
                        </div>
                      </div>
                    </div>
                    <div className="px-14">
                      <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 my-20">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:payablePerCycle")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {orderDetails?.payablePerCycle
                            ? ThousandSeparator(orderDetails?.payablePerCycle)
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="px-32 bg-white">
                      <div className="flex justify-between items-center  my-20">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:frequency")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t(`${orderDetails?.frequency}`)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-20">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:repeats")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {orderDetails?.orderSummary?.tax
                            ? ThousandSeparator(orderDetails?.orderSummary?.tax)
                            : 0}{" "}
                          {t("label:times")}
                        </div>
                      </div>
                    </div>
                  </div>
                </Hidden>
              </div>
              <div className="flex justify-between flex-col md:flex-row items-center my-40 gap-y-20">
                <Hidden mdDown>
                  <Button
                    variant="contained"
                    className="font-semibold rounded-4 bg-primary-50 text-primary-800 w-full md:w-auto z-99"
                    onClick={() => navigate(`/order/details/${orderUuid}`)}
                  >
                    {t("label:backToOrderDetails")}
                  </Button>
                </Hidden>
                <Button
                  variant="contained"
                  type="submit"
                  className="font-semibold rounded-4 bg-primary-500 text-white hover:text-primary-800 w-full md:w-auto px-40 "
                  onClick={() =>
                    setCustomData({
                      ...customData,
                      isCeditCheck: false,
                    })
                  }
                  disabled={
                    apiLoading ||
                    (customData.paymentMethod === "invoice" &&
                      ((orderDetails.type.toLowerCase() === "regular" &&
                          orderDetails?.creditCheck &&
                          !isCreditChecked) ||
                        (orderDetails.type.toLowerCase() === "quick" &&
                          !Object.keys(updatedData).length &&
                          !orderDetails?.customerDetails?.address)))
                  }
                >
                  {t("label:payNow")}
                </Button>
              </div>
            </div>
          </div>
          <Hidden mdUp>
            <div className="fixed bottom-0 flex justify-center items-center gap-10 w-full mb-20">
              <Button
                color="secondary"
                variant="contained"
                className="rounded-full font-semibold bg-primary-50 text-primary-800 button2 custom-button-shadow"
                onClick={() => {
                  navigate(`/order/details/${orderUuid}`);
                }}
              >
                {t("label:orderDetails")}
              </Button>
              <Button
                color="secondary"
                variant="contained"
                className="rounded-full bg-primary-500 button2 custom-button-shadow px-40"
                type="submit"
                onClick={() =>
                  setCustomData({
                    ...customData,
                    isCeditCheck: false,
                  })
                }
                disabled={
                  apiLoading ||
                  (customData.paymentMethod === "invoice" &&
                    ((orderDetails.type.toLowerCase() === "regular" &&
                        orderDetails?.creditCheck &&
                        !isCreditChecked) ||
                      (orderDetails.type.toLowerCase() === "quick" &&
                        !Object.keys(updatedData).length &&
                        !orderDetails?.customerDetails?.address)))
                }
              >
                {t("label:payNow")}
              </Button>
            </div>
          </Hidden>
        </form>
      </div>

      <div>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="rounded-8"
        >
          <div className="p-16">
            <DialogTitle id="alert-dialog-title" className="modeal-header">
              {t("label:redirectingYouToThePaymentGateway")}
            </DialogTitle>
            <DialogContent>
              <DialogContentText
                id="alert-dialog-description"
                className="modeal-text"
              >
                <div>{t("label:thisWillOnlyTakeAMoment")}</div>
                <div className="flex justify-center items-center my-20">
                  <CircularProgress color="secondary" />
                </div>
              </DialogContentText>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default paymentInformation;
