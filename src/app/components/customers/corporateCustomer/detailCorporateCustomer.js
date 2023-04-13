import { yupResolver } from "@hookform/resolvers/yup";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  TextField,
} from "@mui/material";
import { selectUser } from "app/store/userSlice";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdOutlineAdd, MdRemoveCircle } from "react-icons/md";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import {
  CreateCorporateDefaultValue,
  CorporateDetailsDefaultValue,
  validateSchema,
} from "../utils/helper";
import Journal from "./CorporateCustomerDetails/Journal";
import Orders from "./CorporateCustomerDetails/Orders";
import Timeline from "./CorporateCustomerDetails/Timeline";
import {
  useUpdateCorporateCustomerMutation,
  useUpdateCustomerStatusMutation,
} from "app/store/api/apiSlice";
import CountrySelect from "../../common/countries";

const detailCorporateCustomer = (onSubmit = () => {}) => {
  const { t } = useTranslation();
  const queryParams = useParams();
  // const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const [info, setInfo] = useState([]);
  const [sameAddress, setSameAddress] = React.useState(false);
  const [initialSameAddressRef, setInitialSameAddressRef] = useState(false);
  const sameAddRef = useRef(null);
  const [tabValue, setTabValue] = React.useState("1");

  const [loading, setLoading] = React.useState(false);
  const [expanded, setExpanded] = React.useState(true);
  const [expandedPanel2, setExpandedPanel2] = React.useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const addAnotherContactRef = useRef(null);
  const [updateCustomerStatus] = useUpdateCustomerStatusMutation();
  const [countries, setCountries] = React.useState([
    {
      title: "Norway",
      name: "norway",
    },
  ]);
  // const [addContactIndex, setAddContactIndex] = React.useState(
  //   Object.keys(CreateCorporateDefaultValue.contact)
  // );
  // const [addContactIndex, setAddContactIndex] = React.useState(
  //   info?.additionalContactDetails.length-1
  // );
  const [addContactIndex, setAddContactIndex] = React.useState([0, 1, 2]);
  // const [addContactIndex, setAddContactIndex] = React.useState(
  //   Object.keys(CreateCorporateDefaultValue.contact)
  // );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(selectUser);
  const [updateCorporateCustomer] = useUpdateCorporateCustomerMutation();

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // form
  const { control, formState, handleSubmit, reset, setValue, watch } = useForm({
    mode: "onChange",
    CorporateDetailsDefaultValue,
    resolver: yupResolver(validateSchema),
  });
  const { isValid, dirtyFields, errors, isDirty } = formState;

  const billingAddress = watch("billingAddress") || "";
  const zip = watch("billingZip") || "";
  const city = watch("billingCity") || "";
  const country = watch("billingCountry") || "";

  const shippingAddress = watch("shippingAddress") || "";
  const shippingZip = watch("shippingZip") || "";
  const shippingCity = watch("shippingCity") || "";
  const shippingCountry = watch("shippingCountry") || "";

  useEffect(() => {
    if (isLoading) {
      CustomersService.getCustomerDetailsByUUID(queryParams.id)
        .then((response) => {
          setInfo(response?.data);
          CorporateDetailsDefaultValue.customerID = info?.uuid ? info.uuid : "";
          CorporateDetailsDefaultValue.organizationID = info?.organizationId
            ? info.organizationId
            : "";
          CorporateDetailsDefaultValue.orgEmail = info?.email ? info.email : "";
          CorporateDetailsDefaultValue.OrganizationName = info?.name
            ? info.name
            : "";
          CorporateDetailsDefaultValue.primaryPhoneNumber =
            info?.countryCode && info?.msisdn
              ? info.countryCode + info.msisdn
              : "";

          CorporateDetailsDefaultValue.billingAddress = info?.addresses?.billing
            ?.street
            ? info.addresses.billing.street
            : "";
          CorporateDetailsDefaultValue.billingZip = info?.addresses?.billing
            ?.zip
            ? info.addresses.billing.zip
            : "";
          CorporateDetailsDefaultValue.billingCity = info?.addresses?.billing
            ?.city
            ? info.addresses.billing.city
            : "";
          CorporateDetailsDefaultValue.billingCountry = info?.addresses?.billing
            ?.country
            ? info.addresses.billing.country
            : "";

          CorporateDetailsDefaultValue.shippingAddress = info?.addresses
            ?.shipping?.street
            ? info.addresses.shipping?.street
            : "";
          CorporateDetailsDefaultValue.shippingZip = info?.addresses?.shipping
            ?.zip
            ? info.addresses.shipping?.zip
            : "";
          CorporateDetailsDefaultValue.shippingCity = info?.addresses?.shipping
            ?.city
            ? info.addresses.shipping?.city
            : "";
          CorporateDetailsDefaultValue.shippingCountry = info?.addresses
            ?.shipping?.country
            ? info.addresses.shipping?.country
            : "";

          if (
            info?.additionalContactDetails &&
            info?.additionalContactDetails.length
          ) {
            if (
              info?.additionalContactDetails &&
              info?.additionalContactDetails.length >= 2
            ) {
              // for (let i=0; i<info?.additionalContactDetails.length -1; i++){
              //   addNewContact()
              // }
              // ADC
              setAddContactIndex(
                addContactIndex.filter(
                  (item, index) =>
                    item < info?.additionalContactDetails.length - 1
                )
              );
            }
            CorporateDetailsDefaultValue.fullName = info
              ?.additionalContactDetails[0]?.name
              ? info.additionalContactDetails[0].name
              : "";
            CorporateDetailsDefaultValue.designation = info
              ?.additionalContactDetails[0]?.designation
              ? info.additionalContactDetails[0].designation
              : "";
            CorporateDetailsDefaultValue.phone =
              info?.additionalContactDetails[0]?.countryCode &&
              info.additionalContactDetails[0].msisdn
                ? info.additionalContactDetails[0].countryCode +
                  info.additionalContactDetails[0].msisdn
                : "";
            CorporateDetailsDefaultValue.email = info
              ?.additionalContactDetails[0]?.email
              ? info.additionalContactDetails[0].email
              : "";
            CorporateDetailsDefaultValue.notes = info
              ?.additionalContactDetails[0]?.notes
              ? info.additionalContactDetails[0].notes
              : "";
          } else setAddContactIndex([]);
          reset({ ...CorporateDetailsDefaultValue });
          // setValue(`contact[0].fullName`, info.additionalContactDetails[1].name) ;

          if (
            info?.additionalContactDetails &&
            info?.additionalContactDetails.length
          ) {
            for (let i = 0; i < info.additionalContactDetails.length - 1; i++) {
              setValue(
                `contact[${i}].fullName`,
                info.additionalContactDetails[`${i + 1}`].name
              );
              setValue(
                `contact[${i}].designation`,
                info.additionalContactDetails[`${i + 1}`].designation
              );
              setValue(
                `contact[${i}].phone`,
                info.additionalContactDetails[`${i + 1}`].countryCode +
                  info.additionalContactDetails[`${i}`].msisdn
              );
              setValue(
                `contact[${i}].notes`,
                info.additionalContactDetails[`${i + 1}`].notes
              );
              setValue(
                `contact[${i}].email`,
                info.additionalContactDetails[`${i + 1}`].email
              );
            }
          }

          if (
            info?.addresses &&
            info?.addresses?.billing?.street ===
              info?.addresses["shipping"]?.street &&
            info?.addresses?.billing?.zip ===
              info?.addresses["shipping"]?.zip &&
            info?.addresses?.billing?.city ===
              info?.addresses["shipping"]?.city &&
            info?.addresses?.billing?.country ===
              info?.addresses["shipping"]?.country
          ) {
            setSameAddress(true);
            setInitialSameAddressRef(true);
          } else {
            setInitialSameAddressRef(false);
            setSameAddress(false);
          }

          setIsLoading(false);
        })
        .catch((e) => {
          navigate("/customers/customers-list");
          enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        });
    }
    return () => {
      reset({ ...CorporateDetailsDefaultValue });
    };
  }, [isLoading]);

  useEffect(() => {
    if (!!info) {
      CorporateDetailsDefaultValue.customerID = info?.uuid ? info.uuid : "";
      CorporateDetailsDefaultValue.organizationID = info?.organizationId
        ? info.organizationId
        : "";
      CorporateDetailsDefaultValue.orgEmail = info?.email ? info.email : "";
      CorporateDetailsDefaultValue.OrganizationName = info?.name
        ? info.name
        : "";
      CorporateDetailsDefaultValue.primaryPhoneNumber =
        info?.countryCode && info?.msisdn ? info.countryCode + info.msisdn : "";

      CorporateDetailsDefaultValue.billingAddress = info?.addresses?.billing
        ?.street
        ? info.addresses.billing.street
        : "";
      CorporateDetailsDefaultValue.billingZip = info?.addresses?.billing?.zip
        ? info.addresses.billing.zip
        : "";
      CorporateDetailsDefaultValue.billingCity = info?.addresses?.billing?.city
        ? info.addresses.billing.city
        : "";
      CorporateDetailsDefaultValue.billingCountry = info?.addresses?.billing
        ?.country
        ? info.addresses.billing.country
        : "";

      CorporateDetailsDefaultValue.shippingAddress = info?.addresses?.shipping
        ?.street
        ? info.addresses.shipping?.street
        : "";
      CorporateDetailsDefaultValue.shippingZip = info?.addresses?.shipping?.zip
        ? info.addresses.shipping?.zip
        : "";
      CorporateDetailsDefaultValue.shippingCity = info?.addresses?.shipping
        ?.city
        ? info.addresses.shipping?.city
        : "";
      CorporateDetailsDefaultValue.shippingCountry = info?.addresses?.shipping
        ?.country
        ? info.addresses.shipping?.country
        : "";

      if (
        info?.additionalContactDetails &&
        info?.additionalContactDetails.length
      ) {
        if (
          info?.additionalContactDetails &&
          info?.additionalContactDetails.length >= 2
        ) {
          // for (let i=0; i<info?.additionalContactDetails.length -1; i++){
          //   addNewContact()
          // }
          // ADC
          setAddContactIndex(
            addContactIndex.filter(
              (item, index) => item < info?.additionalContactDetails.length - 1
            )
          );
        }
        CorporateDetailsDefaultValue.fullName = info
          ?.additionalContactDetails[0]?.name
          ? info.additionalContactDetails[0].name
          : "";
        CorporateDetailsDefaultValue.designation = info
          ?.additionalContactDetails[0]?.designation
          ? info.additionalContactDetails[0].designation
          : "";
        CorporateDetailsDefaultValue.phone =
          info?.additionalContactDetails[0]?.countryCode &&
          info.additionalContactDetails[0].msisdn
            ? info.additionalContactDetails[0].countryCode +
              info.additionalContactDetails[0].msisdn
            : "";
        CorporateDetailsDefaultValue.email = info?.additionalContactDetails[0]
          ?.email
          ? info.additionalContactDetails[0].email
          : "";
        CorporateDetailsDefaultValue.notes = info?.additionalContactDetails[0]
          ?.notes
          ? info.additionalContactDetails[0].notes
          : "";
      } else setAddContactIndex([]);
      reset({ ...CorporateDetailsDefaultValue });
      // setValue(`contact[0].fullName`, info.additionalContactDetails[1].name) ;

      if (
        info?.additionalContactDetails &&
        info?.additionalContactDetails.length
      ) {
        for (let i = 0; i < info.additionalContactDetails.length - 1; i++) {
          setValue(
            `contact[${i}].fullName`,
            info.additionalContactDetails[`${i + 1}`].name
          );
          setValue(
            `contact[${i}].designation`,
            info.additionalContactDetails[`${i + 1}`].designation
          );
          setValue(
            `contact[${i}].phone`,
            info.additionalContactDetails[`${i + 1}`].countryCode +
              info.additionalContactDetails[`${i}`].msisdn
          );
          setValue(
            `contact[${i}].notes`,
            info.additionalContactDetails[`${i + 1}`].notes
          );
          setValue(
            `contact[${i}].email`,
            info.additionalContactDetails[`${i + 1}`].email
          );
        }
      }

      if (
        info?.addresses &&
        info?.addresses?.billing?.street ===
          info?.addresses["shipping"]?.street &&
        info?.addresses?.billing?.zip === info?.addresses["shipping"]?.zip &&
        info?.addresses?.billing?.city === info?.addresses["shipping"]?.city &&
        info?.addresses?.billing?.country ===
          info?.addresses["shipping"]?.country
      ) {
        setSameAddress(true);
        setInitialSameAddressRef(true);
      } else {
        setInitialSameAddressRef(false);
        setSameAddress(false);
      }
    }
  }, [info]);

  const onRawSubmit = (values) => {
    // onSubmit({
    //   ...values,
    //   contact: Object.values(values.contact),
    // });
    setLoading(true);
    // CustomersService.updateCorporateCustomerByUUID(values, sameAddress, info)
    //   .then((res) => {
    //     if (res?.status_code === 202) {
    //       enqueueSnackbar(res.message, {
    //         variant: "success",
    //         autoHideDuration: 3000,
    //       });
    //       navigate("/customers/customers-list");
    //       setLoading(false)
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("Service call E : ", e);
    //     enqueueSnackbar('Operation failed', { variant: "error" });
    //     setLoading(false)
    //   });
    const preparedPayload =
      CustomersService.prepareUpdateCorporateCustomerPayload(
        values,
        sameAddress,
        info
      );
    updateCorporateCustomer(preparedPayload).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), {
          variant: "success",
        });
        navigate("/customers/customers-list");
        setLoading(false);
      } else if (response?.error?.data?.status_code === 417) {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
        });
        setLoading(false);
      }
    });
  };
  // form end

  // dynamic input form
  const addNewContact = () => {
    setAddContactIndex([...addContactIndex, addContactIndex.length]);
  };
  const onDelete = (index) => {
    setAddContactIndex(addContactIndex.filter((i) => i !== index));
    setValue(`contact[${index}].fullName`, "");
    setValue(`contact[${index}].designation`, "");
    setValue(`contact[${index}].phone`, "");
    setValue(`contact[${index}].notes`, "");
    setValue(`contact[${index}].email`, "");
  };

  const handleMakeInactive = () => {
    updateCustomerStatus(info.uuid).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), {
          variant: "success",
        });
        navigate(`/customers/customers-list`);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
        });
      }
    });
    // CustomersService.makeInactiveCustomerByUUID(info.uuid)
    //   .then((res) => {
    //     if (res?.status_code === 202) {
    //       enqueueSnackbar(res.message, { variant: "success" });
    //       navigate(`/customers/customers-list`);
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("E :", e)
    //     enqueueSnackbar('Operation failed', { variant: "error" });
    //   });
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
        <div className="create-product-container">
          <div className="">
            <div className="rounded-sm bg-white p-0 md:p-20">
              <form
                name="loginForm"
                noValidate
                onSubmit={handleSubmit(onRawSubmit)}
              >
                <div className=" header-click-to-action">
                  <div className="flex justify-center items-center gap-10">
                    <div className="h-36 w-36 rounded-full custom-accent50bg flex justify-center items-center">
                      <LocationCityIcon className="icon-size-20 text-AccentTeal-500" />
                    </div>
                    <div className="header-text header6">
                      {t("label:customerDetails")}
                    </div>
                    {info?.status === "Inactive" ? (
                      <div className="py-3 px-10 bg-rejected rounded-md body3 text-MonochromeGray-700">
                        {t("label:inactive")}
                      </div>
                    ) : (
                      <div className="py-3 px-10 bg-confirmed rounded-md body3 text-MonochromeGray-700">
                        {t("label:active")}
                      </div>
                    )}
                  </div>
                  <div className="button-container-product px-10 sm:px-auto">
                    <Button
                      color="secondary"
                      variant="outlined"
                      className="button-outline-product"
                      type="button"
                      onClick={() => handleMakeInactive()}
                      disabled={user.role[0] === FP_ADMIN}
                    >
                      {info?.status === "Active"
                        ? t("label:makeInactive")
                        : t("label:makeActive")}
                    </Button>
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      className="rounded-4 button2"
                      aria-label="Confirm"
                      size="large"
                      type="submit"
                      loading={loading}
                      disabled={
                        user.role[0] === FP_ADMIN ||
                        (!isDirty && sameAddress === initialSameAddressRef)
                      }
                      loadingPosition="center"
                    >
                      {t("label:update")}
                    </LoadingButton>
                  </div>
                </div>
                <div className="my-20 custom-tab-order-details">
                  <TabContext value={tabValue}>
                    <Box sx={{ background: "#F7F7F7" }}>
                      <TabList
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                        aria-label="lab API tabs example"
                        TabIndicatorProps={{
                          style: { background: "#33A0BE", height: "4px" },
                        }}
                      >
                        <Tab
                          label={t("label:customerInformation")}
                          className="subtitle3"
                          value="1"
                        />
                        <Tab
                          label={t("label:timeline")}
                          className="subtitle3"
                          value="2"
                        />
                        <Tab
                          label={t("label:orders")}
                          className="subtitle3"
                          value="3"
                        />
                        <Tab
                          label={t("label:notes")}
                          className="subtitle3"
                          value="4"
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1" className="py-20 px-10">
                      <div className="main-layout-product">
                        <div className="col-span-1 md:col-span-4 bg-white">
                          <div className="my-20">
                            <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                              {t("label:primaryInformation")}
                              {dirtyFields.billingAddress &&
                              dirtyFields.zip &&
                              dirtyFields.city &&
                              dirtyFields.country ? (
                                <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                              ) : (
                                <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                              )}
                            </div>
                            <div className="px-10 my-20">
                              <div className="grid grid-cols-1 sm:grid-cols-2 w-full md:w-3/4 gap-20 mb-40 mt-10">
                                <Controller
                                  name="customerID"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:customerId")}
                                      className="mb-20 sm:mb-auto"
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.customerID}
                                      helperText={
                                        errors?.customerID?.message
                                          ? t(
                                              `validation:${errors?.customerID?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      required
                                      fullWidth
                                      disabled
                                      value={field.value || ""}
                                    />
                                  )}
                                />
                                <Controller
                                  name={t("label:organizationID")}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label="Organization ID"
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.organizationID}
                                      helperText={
                                        errors?.organizationID?.message
                                          ? t(
                                              `validation:${errors?.organizationID?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      required
                                      fullWidth
                                      value={field.value || ""}
                                      //disabled
                                    />
                                  )}
                                />
                              </div>
                              <div className="form-pair-input mt-20">
                                <Controller
                                  name="OrganizationName"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:organizationName")}
                                      className="bg-white"
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.OrganizationName}
                                      helperText={
                                        errors?.OrganizationName?.message
                                          ? t(
                                              `validation:${errors?.OrganizationName?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      required
                                      value={field.value || ""}
                                      //disabled
                                    />
                                  )}
                                />
                                <Controller
                                  name="orgEmail"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:emailId")}
                                      className="bg-white"
                                      type="email"
                                      autoComplete="off"
                                      error={!!errors.orgEmail}
                                      helperText={
                                        errors?.orgEmail?.message
                                          ? t(
                                              `validation:${errors?.orgEmail?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      required
                                      fullWidth
                                      value={field.value || ""}
                                    />
                                  )}
                                />
                                <Controller
                                  name="primaryPhoneNumber"
                                  control={control}
                                  render={({ field }) => (
                                    <FormControl
                                      error={!!errors.primaryPhoneNumber}
                                      fullWidth
                                    >
                                      <PhoneInput
                                        {...field}
                                        className={
                                          errors.primaryPhoneNumber
                                            ? "input-phone-number-field border-1 rounded-md border-red-300"
                                            : "input-phone-number-field"
                                        }
                                        country="no"
                                        enableSearch
                                        autocompleteSearch
                                        countryCodeEditable={false}
                                        specialLabel={`${t("label:phone")}*`}
                                        // onBlur={handleOnBlurGetDialCode}
                                      />
                                      <FormHelperText>
                                        {errors?.primaryPhoneNumber?.message
                                          ? t(
                                              `validation:${errors?.primaryPhoneNumber?.message}`
                                            )
                                          : ""}
                                      </FormHelperText>
                                    </FormControl>
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="my-20">
                            <div className="corporate-customer-details-form">
                              <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                                {t("label:billingAndShippingInformation")}
                                {dirtyFields.billingAddress &&
                                dirtyFields.zip &&
                                dirtyFields.city &&
                                dirtyFields.country ? (
                                  <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                ) : (
                                  <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                )}
                              </div>
                              <div className="w-full px-7 sm:px-14">
                                <div className="billing-address-head no-padding-x my-14">
                                  {t("label:billingAddress")}
                                  {dirtyFields.billingAddress &&
                                  dirtyFields.zip &&
                                  dirtyFields.city &&
                                  dirtyFields.country ? (
                                    <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                  ) : (
                                    <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                  )}
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
                                                ? t(
                                                    `validation:${errors?.billingAddress?.message}`
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
                                        />
                                      )}
                                    />
                                    <CountrySelect
                                      control={control}
                                      name={"billingCountry"}
                                      label={"country"}
                                      placeholder={"billingCountry"}
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
                                          <InputLabel id="demo-simple-select-label">
                                            {t("label:country")}
                                          </InputLabel>
                                          <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={t("label:country")}
                                            defaultValue={
                                              info?.addresses &&
                                              info?.addresses?.billing &&
                                              info?.addresses?.billing?.country.toLowerCase()
                                            }
                                          >
                                            {countries.map((country, index) => (
                                              <MenuItem
                                                key={index}
                                                value={country.name}
                                              >
                                                {country.title}
                                              </MenuItem>
                                            ))}
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
                              <div className="shipping-information px-7 sm:px-14">
                                <div className="w-full">
                                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center no-padding-x">
                                    <div className="billing-address-head no-padding-x">
                                      {t("label:shippingAddress")}
                                      {(shippingAddress &&
                                        shippingZip &&
                                        shippingCity &&
                                        shippingCountry) ||
                                      sameAddress ? (
                                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                      ) : (
                                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                      )}
                                    </div>
                                    <div className="billing-address-right">
                                      <FormControlLabel
                                        className="subtitle3 -ml-[.2rem] "
                                        control={
                                          <Switch
                                            onChange={() =>
                                              setSameAddress(!sameAddress)
                                            }
                                            checked={sameAddress}
                                            name="jason"
                                            className="subtitle3"
                                            color="secondary"
                                            ref={sameAddRef}
                                          />
                                        }
                                        label={t("label:sameAsBillingAddress")}
                                        labelPlacement="start"
                                      />
                                    </div>
                                  </div>

                                  {!sameAddress && (
                                    <div className="">
                                      <div className="form-pair-three-by-one">
                                        <div className="col-span-3">
                                          <Controller
                                            name="shippingAddress"
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                {...field}
                                                label={t("label:streetAddress")}
                                                type="text"
                                                autoComplete="off"
                                                disabled={sameAddress}
                                                error={!!errors.shippingAddress}
                                                helperText={
                                                  errors?.shippingAddress
                                                    ?.message
                                                    ? t(
                                                        `validation:${errors?.shippingAddress?.message}`
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
                                        <div className="col-span-1">
                                          <Controller
                                            name="shippingZip"
                                            className="col-span-1"
                                            control={control}
                                            render={({ field }) => (
                                              <TextField
                                                {...field}
                                                label={t("label:zipCode")}
                                                type="number"
                                                autoComplete="off"
                                                disabled={sameAddress}
                                                error={!!errors.shippingZip}
                                                helperText={
                                                  errors?.shippingZip?.message
                                                    ? t(
                                                        `validation:${errors?.shippingZip?.message}`
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
                                      <div className="form-pair-input gap-x-20">
                                        <Controller
                                          name="shippingCity"
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              {...field}
                                              label={t("label:city")}
                                              type="text"
                                              autoComplete="off"
                                              disabled={sameAddress}
                                              error={!!errors.shippingCity}
                                              helperText={
                                                errors?.shippingCity?.message
                                                  ? t(
                                                      `validation:${errors?.shippingCity?.message}`
                                                    )
                                                  : ""
                                              }
                                              variant="outlined"
                                              fullWidth
                                              value={field.value || ""}
                                            />
                                          )}
                                        />
                                        <CountrySelect
                                          control={control}
                                          name={"shippingCountry"}
                                          label={"country"}
                                          placeholder={"country"}
                                          required={false}
                                          error={errors.shippingCountry}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                                {t("label:contactInformation")}
                                {true ? (
                                  <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                ) : (
                                  <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                )}
                              </div>
                              <div className="w-full px-7 sm:px-14">
                                <div className="billing-address-head no-padding-x my-14">
                                  {t("label:primaryContact")}
                                  {dirtyFields.fullName &&
                                  dirtyFields.designation &&
                                  dirtyFields.phone &&
                                  dirtyFields.email &&
                                  dirtyFields.notes ? (
                                    <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                  ) : (
                                    <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                  )}
                                </div>
                                <div className="">
                                  <div className="form-pair-input gap-20 mb32ri">
                                    <Controller
                                      name="fullName"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:fullName")}
                                          type="text"
                                          autoComplete="off"
                                          error={!!errors.fullName}
                                          helperText={
                                            errors?.fullName?.message
                                              ? t(
                                                  `validation:${errors?.fullName?.message}`
                                                )
                                              : ""
                                          }
                                          variant="outlined"
                                          fullWidth
                                          value={field.value || ""}
                                        />
                                      )}
                                    />
                                    <Controller
                                      name="designation"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:designation")}
                                          type="text"
                                          autoComplete="off"
                                          error={!!errors.designation}
                                          helperText={
                                            errors?.designation?.message
                                              ? t(
                                                  `validation:${errors?.designation?.message}`
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
                                  <div className="form-pair-input gap-20 mb32ri">
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
                                            enableSearch
                                            autocompleteSearch
                                            countryCodeEditable={false}
                                            specialLabel={t("label:phone")}
                                            // onBlur={handleOnBlurGetDialCode}
                                          />
                                          <FormHelperText>
                                            {errors?.billingPhoneNumber?.message
                                              ? t(
                                                  `validation:${errors?.billingPhoneNumber?.message}`
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
                                          value={field.value || ""}
                                        />
                                      )}
                                    />
                                  </div>
                                  <div className="w-full sm:w-3/4">
                                    <Controller
                                      name="notes"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          multiline
                                          rows={5}
                                          label={t("label:notes")}
                                          type="text"
                                          autoComplete="off"
                                          error={!!errors.notes}
                                          helperText={
                                            errors?.notes?.message
                                              ? t(
                                                  `validation:${errors?.notes?.message}`
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
                                {addContactIndex.map((index) => (
                                  <div key={`contact:${index}`}>
                                    <div className="flex justify-between items-center no-padding-x mt-32 border-b-1 border-MonochromeGray-25">
                                      <div className="billing-address-head no-padding-x">
                                        {t("label:contact")} {index + 1}
                                        {dirtyFields.fullName &&
                                        dirtyFields.designation &&
                                        dirtyFields.phone &&
                                        dirtyFields.email &&
                                        dirtyFields.notes ? (
                                          <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                        ) : (
                                          <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                        )}
                                      </div>
                                      <button
                                        className="flex justify-center items-center gap-10 button2 my-auto"
                                        type="button"
                                        onClick={() => onDelete(index)}
                                      >
                                        <MdRemoveCircle className="icon-size-20 text-red-500" />
                                        {t("label:removeContact")}
                                      </button>
                                    </div>
                                    <div className="">
                                      <div className="form-pair-input gap-x-20">
                                        <Controller
                                          name={`contact[${index}].fullName`}
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              {...field}
                                              label={t("label:fullName")}
                                              type="text"
                                              autoComplete="off"
                                              error={!!errors?.fullName}
                                              helperText={
                                                errors?.fullName
                                                  ? t(
                                                      `validation:${errors?.fullName}`
                                                    )
                                                  : ""
                                              }
                                              variant="outlined"
                                              fullWidth
                                              value={field.value || ""}
                                              // defaultValue={info.additionalContactDetails[index+1] && info.additionalContactDetails[index+1].name ? info.additionalContactDetails[index+1].name : ""}
                                            />
                                          )}
                                        />
                                        <Controller
                                          name={`contact[${index}].designation`}
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              {...field}
                                              label={t("label:designation")}
                                              type="text"
                                              autoComplete="off"
                                              error={!!errors?.designation}
                                              helperText={
                                                errors?.designation?.message
                                                  ? t(
                                                      `validation:${errors?.designation?.message}`
                                                    )
                                                  : ""
                                              }
                                              variant="outlined"
                                              fullWidth
                                              value={field.value || ""}
                                              // defaultValue={info.additionalContactDetails[index+1] && info.additionalContactDetails[index+1].designation ? info.additionalContactDetails[index+1].designation : ""}
                                            />
                                          )}
                                        />
                                      </div>
                                      <div className="form-pair-input gap-x-20">
                                        <Controller
                                          name={`contact[${index}].phone`}
                                          control={control}
                                          render={({ field }) => (
                                            <FormControl
                                              error={!!errors?.phone}
                                              fullWidth
                                            >
                                              <PhoneInput
                                                {...field}
                                                className={
                                                  errors?.phone
                                                    ? "input-phone-number-field border-1 rounded-md border-red-300"
                                                    : "input-phone-number-field"
                                                }
                                                country="no"
                                                enableSearch
                                                autocompleteSearch
                                                countryCodeEditable={false}
                                                specialLabel={t("label:phone")}
                                                // onBlur={handleOnBlurGetDialCode}
                                                // defaultValue={info.additionalContactDetails[index+1] && info.additionalContactDetails[index+1].msisdn ? info.additionalContactDetails[index+1].msisdn : ""}
                                              />
                                              <FormHelperText>
                                                {errors?.phone?.message}
                                              </FormHelperText>
                                            </FormControl>
                                          )}
                                        />
                                        <Controller
                                          name={`contact[${index}].email`}
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              {...field}
                                              label={t("label:email")}
                                              type="email"
                                              autoComplete="off"
                                              // error={!!errors?.contact[index]?.email}
                                              // helperText={errors?.contact[index]?.email?.message}
                                              variant="outlined"
                                              fullWidth
                                              value={field.value || ""}
                                              // defaultValue={info.additionalContactDetails[index+1] && info.additionalContactDetails[index+1].email ? info.additionalContactDetails[index+1].email : ""}
                                            />
                                          )}
                                        />
                                      </div>
                                      <div className="w-full sm:w-3/4">
                                        <Controller
                                          name={`contact[${index}].notes`}
                                          control={control}
                                          render={({ field }) => (
                                            <TextField
                                              {...field}
                                              multiline
                                              rows={5}
                                              label={t("label:notes")}
                                              type="text"
                                              autoComplete="off"
                                              error={!!errors?.notes}
                                              helperText={
                                                errors?.message
                                                  ? t(
                                                      `validation:${errors?.message}`
                                                    )
                                                  : ""
                                              }
                                              variant="outlined"
                                              fullWidth
                                              value={field.value || ""}
                                              // defaultValue={info.additionalContactDetails[index+1] && info.additionalContactDetails[index+1].notes ? info.additionalContactDetails[index+1].notes : ""}
                                            />
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <Button
                                  type="button"
                                  variant="text"
                                  className="flex justify-center items-center gap-10 mt-48 button2"
                                  onClick={() => addNewContact()}
                                  ref={addAnotherContactRef}
                                  disabled={addContactIndex.length >= 3}
                                >
                                  <MdOutlineAdd className="icon-size-24 text-teal-300" />
                                  {t("label:addAnotherContact")}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 hidden">
                          {/* <FAQs /> */}
                        </div>
                      </div>
                    </TabPanel>
                    <TabPanel value="2" className="py-20 px-10">
                      <Timeline />
                    </TabPanel>
                    <TabPanel value="3" className="py-20 px-10">
                      <Orders />
                    </TabPanel>
                    <TabPanel value="4" className="py-20 px-10">
                      <Journal />
                    </TabPanel>
                  </TabContext>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default detailCorporateCustomer;
