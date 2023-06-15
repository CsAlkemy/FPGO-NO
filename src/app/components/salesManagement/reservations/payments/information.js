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
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import { useNavigate, useParams } from "react-router-dom";
import PaymentHeader from "../../payment/paymentHeader";
import {
  PaymentDefaultValue,
  validateSchemaPaymentCheckout,
  validateSchemaPaymentCheckoutCorporate,
} from "../../utils/helper";
import { ThousandSeparator } from "../../../../utils/helperFunctions";
import OrderService from "../../../../data-access/services/ordersService/OrdersService";
import CountrySelect from "../../../common/countries";

const PaymentConfirmation = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const reservationUuid = useParams().uuid;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customData, setCustomData] = useState({
    paymentMethod: "vipps",
    isCeditCheck: false,
    isNewCustomer: false,
    customerType: "private",
  });
  const [reservationDetails, setReservationDetails] = useState([]);
  const [updatedData, setUpdatedData] = useState({});
  const [isUpdateData, setIsUpdateData] = useState(false);

  const [countries, setCountries] = useState([
    {
      title: "Norway",
      name: "norway",
    },
    {
      title: "Sweden",
      name: "sweden",
    },
  ]);

  const [paymentMethodList, setPaymentMethodList] = useState([
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
  ]);

  const { control, formState, handleSubmit, getValues, reset, watch } = useForm(
    {
      mode: "onChange",
      PaymentDefaultValue,
      resolver: yupResolver(
        customData.customerType === "private"
          ? validateSchemaPaymentCheckout
          : validateSchemaPaymentCheckoutCorporate
      ),
    }
  );

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const onSubmit = (values) => {
    setOpen(true);
    const data = isUpdateData
      ? {
          ...updatedData,
          ...customData,
          orderUuid: reservationUuid,
          customerUuid: reservationDetails?.customerDetails?.uuid
            ? reservationDetails?.customerDetails?.uuid
            : null,
        }
      : {
          ...values,
          ...customData,
          orderUuid: reservationUuid,
          customerUuid: reservationDetails?.customerDetails?.uuid
            ? reservationDetails?.customerDetails?.uuid
            : null,
        };

    OrderService.updateOrder(data)
      .then((response) => {
        if (
          response?.status_code === 202 &&
          response?.is_data &&
          response?.data?.paymentUrl
        ) {
          setOpen(false);
          localStorage.setItem(
            "reservationConfirmationData",
            JSON.stringify({
              reservationUuid: reservationDetails?.orderUuid,
              sentBy: reservationDetails?.sendOrderBy?.sms ? "sms" : "email",
              phoneOrEmail: reservationDetails?.sendOrderBy?.sms
                ? reservationDetails?.customerDetails?.countryCode +
                  reservationDetails?.customerDetails?.msisdn
                : reservationDetails?.customerDetails?.email,
            })
          );
          window.location.href = `${response?.data?.paymentUrl}`;
        } else if (response?.status_code === 202 && !response?.is_data) {
          navigate(`/reservations/${reservationUuid}/confirmation`);
        }
      })
      .catch((e) => {
        //enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        const isParam = e.includes("Param");
        const message = isParam
          ? `${t(`message:${e.split("Param")[0]}Param`)} ${e.split("Param")[1]}`
          : t(`message:${e}`);
        enqueueSnackbar(message, {
          variant: "error",
        });

        setOpen(false);
      });
  };

  useEffect(() => {
    OrderService.getOrdersDetailsByUUIDPayment(reservationUuid)
      .then((response) => {
        if (response?.status_code === 200 && response?.is_data) {
          if (response?.data?.status !== "SENT") return navigate("404");
          setReservationDetails(response.data);

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
          PaymentDefaultValue.orgIdCreditCheck = response?.data?.customerDetails
            ?.personalNumber
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
        return navigate("404");
      });
  }, [isLoading]);

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
                          : reservationDetails?.customerDetails?.name
                          ? reservationDetails?.customerDetails?.name
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
                          : reservationDetails?.customerDetails?.personalNumber
                          ? reservationDetails?.customerDetails?.personalNumber
                          : "-"}
                      </div>
                      <div className="text-MonochromeGray-700 body2 mt-16">
                        {updatedData?.phone
                          ? updatedData.phone
                          : reservationDetails?.customerDetails?.countryCode &&
                            reservationDetails?.customerDetails?.msisdn
                          ? reservationDetails?.customerDetails?.countryCode +
                            reservationDetails?.customerDetails?.msisdn
                          : "-"}
                      </div>
                      <div className="text-MonochromeGray-700 body2">
                        {updatedData?.email
                          ? updatedData.email
                          : reservationDetails?.customerDetails?.email
                          ? reservationDetails?.customerDetails?.email
                          : "-"}
                      </div>
                      <div className="text-MonochromeGray-700 body2">
                        {updatedData?.billingAddress
                          ? updatedData.billingAddress + ", "
                          : reservationDetails?.customerDetails?.address &&
                            reservationDetails?.customerDetails?.address?.street
                          ? reservationDetails?.customerDetails?.address
                              ?.street + ", "
                          : "-, "}
                        {updatedData?.billingCity
                          ? updatedData.billingCity + ", "
                          : reservationDetails?.customerDetails?.address &&
                            reservationDetails?.customerDetails?.address?.city
                          ? reservationDetails?.customerDetails?.address?.city +
                            " "
                          : "-"}
                        {updatedData?.billingZip
                          ? updatedData.billingZip + ", "
                          : reservationDetails?.customerDetails?.address &&
                            reservationDetails?.customerDetails?.address?.zip
                          ? reservationDetails?.customerDetails?.address?.zip +
                            ", "
                          : "-, "}
                        {updatedData?.billingCountry
                          ? updatedData.billingCountry
                          : reservationDetails?.customerDetails?.address &&
                            reservationDetails?.customerDetails?.address
                              ?.country
                          ? reservationDetails?.customerDetails?.address
                              ?.country
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

                      <DialogContent className="p-10 md:p-40">
                        <div id="customer-information-payment">
                          <div className="bg-white px-5">
                            <div className="search-customer-order-create-type my-32">
                              <div className="flex gap-20 w-full md:w-3/4 mb-32 mt-20">
                                <Button
                                  variant="outlined"
                                  className={`body2 ${
                                    customData?.customerType === "private" ||
                                    (reservationDetails &&
                                      reservationDetails?.customerDetails
                                        ?.type === "Private" &&
                                      !customData?.isNewCustomer)
                                      ? "create-order-capsule-button-active"
                                      : "create-order-capsule-button"
                                  }`}
                                  onClick={() => {
                                    setCustomData({
                                      ...customData,
                                      customerType: "private",
                                    });
                                  }}
                                  disabled={
                                    reservationDetails &&
                                    reservationDetails?.customerDetails
                                      ?.type === "Corporate" &&
                                    !customData?.isNewCustomer
                                  }
                                >
                                  {t("label:private")}
                                </Button>
                                <Button
                                  variant="outlined"
                                  className={`body2 ${
                                    customData?.customerType === "corporate" ||
                                    (reservationDetails &&
                                      reservationDetails?.customerDetails
                                        ?.type === "Corporate" &&
                                      !customData?.isNewCustomer)
                                      ? "create-order-capsule-button-active"
                                      : "create-order-capsule-button"
                                  }`}
                                  onClick={() => {
                                    setCustomData({
                                      ...customData,
                                      customerType: "corporate",
                                    });
                                  }}
                                  disabled={
                                    reservationDetails &&
                                    reservationDetails?.customerDetails
                                      ?.type === "Private" &&
                                    !customData?.isNewCustomer
                                  }
                                >
                                  {t("label:corporate")}
                                </Button>
                              </div>
                            </div>
                            <div className="w-full my-32">
                              <div className="form-pair-input gap-x-20">
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
                                  <Controller
                                    name="orgIdOrPNumber"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={
                                          customData.customerType === "private"
                                            ? t("label:pNumber")
                                            : t("label:organizationId")
                                        }
                                        type="number"
                                        autoComplete="off"
                                        error={!!errors.orgIdOrPNumber}
                                        required={
                                          customData.customerType !== "private"
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
                                name="billingCountry"
                                label={"country"}
                                // placeholder={"country"}
                                required={true}
                                error={errors.billingCountry}
                              />
                              {/* <Controller
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

                        <div className="flex justify-end mt-40">
                          <div className="flex gap-10 items-center">
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
                    </div>
                  </div>

                  <Hidden mdUp>
                    <div className="col-span-2 mt-20">
                      <div className="py-16 px-10 bg-primary-25 subtitle2 ">
                        {t("label:reservationSummary")}
                      </div>

                      <div className="px-14">
                        <div className="flex justify-between items-center py-20 px-16 my-20">
                          <div className="subtitle3 text-MonochromeGray-700">
                            {t("label:totalReservationAmount")}
                          </div>
                          <div className="body3 text-MonochromeGray-700">
                            {t("label:nok")}{" "}
                            {reservationDetails?.orderSummary?.grandTotal
                              ? ThousandSeparator(
                                  reservationDetails?.orderSummary?.grandTotal
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
                      {t("label:reservationSummary")}
                    </div>
                    <div className="px-14">
                      <div className="flex justify-between items-center py-20 px-16 my-20">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:totalReservationAmount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {reservationDetails?.orderSummary?.grandTotal
                            ? ThousandSeparator(
                                reservationDetails?.orderSummary?.grandTotal
                              )
                            : ""}
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
                    onClick={() => {
                      navigate(`/reservations/details/${reservationUuid}`);
                    }}
                  >
                    {t("label:backToReservationDetails")}
                  </Button>
                </Hidden>

                <Button
                  variant="contained"
                  type="submit"
                  className="font-semibold rounded-4 bg-primary-500 text-white hover:text-primary-800 w-full md:w-auto px-40 "
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
                  navigate(`/reservations/${reservationUuid}/checkout`);
                }}
              >
                {t("label:backToReservationDetails")}
              </Button>
              <Button
                color="secondary"
                variant="contained"
                className="rounded-full bg-primary-500 button2 custom-button-shadow px-40"
                type="submit"
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
                <span className="block">
                  {t("label:thisWillOnlyTakeAMoment")}
                </span>
                <span className="flex justify-center items-center my-20">
                  <CircularProgress color="secondary" />
                </span>
              </DialogContentText>
            </DialogContent>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default PaymentConfirmation;
