import { yupResolver } from "@hookform/resolvers/yup";
import PersonIcon from "@mui/icons-material/Person";
import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Backdrop,
  Box,
  Button, CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  TextField,
} from '@mui/material';
import { selectUser } from "app/store/userSlice";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import {
  PrivateDefaultValue,
  validateSchemaUpdatePrivateCustomer,
} from "../utils/helper";
import Journal from "./PrivateCustomerDetails/Journal";
import Orders from "./PrivateCustomerDetails/Orders";
import Timeline from "./PrivateCustomerDetails/Timeline";
import { useUpdatePrivateCustomerMutation } from "app/store/api/apiSlice";

const detailPrivateCustomer = (onSubmit = () => {}) => {
  const { t } = useTranslation();
  const [sameAddress, setSameAddress] = React.useState(false);
  const queryParams = useParams();
  const [countries, setCountries] = React.useState([
    {
      title: "Norway",
      name: "norway",
    },
  ]);

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const [info, setInfo] = useState([]);
  const user = useSelector(selectUser);
  const sameAddRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = React.useState("1");
  const [updatePrivateCustomer] = useUpdatePrivateCustomerMutation();

  // form
  const { control, formState, handleSubmit, reset, setValue, watch } = useForm({
    mode: "onChange",
    PrivateDefaultValue,
    resolver: yupResolver(validateSchemaUpdatePrivateCustomer),
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
    CustomersService.getCustomerDetailsByUUID(queryParams.id).then((response) => {
      setInfo(response?.data);

      if (
        info?.addresses &&
        info?.addresses?.billing?.street ===
        info?.addresses["shipping"]?.street &&
        info?.addresses?.billing?.zip === info?.addresses["shipping"]?.zip &&
        info?.addresses?.billing?.city === info?.addresses["shipping"]?.city &&
        info?.addresses?.billing?.country === info?.addresses["shipping"]?.country
      ) {
        setSameAddress(true);
      } else setSameAddress(false);

      PrivateDefaultValue.customerID = info?.uuid ? info?.uuid : "";
      PrivateDefaultValue.pNumber = info?.personalNumber
        ? info.personalNumber
        : "";
      PrivateDefaultValue.customerEmail = info?.email ? info.email : "";
      PrivateDefaultValue.customerName = info?.name ? info.name : "";
      PrivateDefaultValue.primaryPhoneNumber =
        info?.countryCode && info?.msisdn ? info.countryCode + info.msisdn : "";
      PrivateDefaultValue.billingAddress = info?.addresses?.billing?.street
        ? info.addresses.billing.street
        : "";
      PrivateDefaultValue.billingZip = info?.addresses?.billing?.zip
        ? info.addresses.billing.zip
        : "";
      PrivateDefaultValue.billingCity = info?.addresses?.billing?.city
        ? info.addresses.billing.city
        : "";
      PrivateDefaultValue.billingCountry = info?.addresses?.billing?.country
        ? info.addresses?.billing.country
        : "";
      PrivateDefaultValue.shippingAddress = info?.addresses?.shipping?.street
        ? info.addresses.shipping?.street
        : "";
      PrivateDefaultValue.shippingZip = info?.addresses?.shipping?.zip
        ? info.addresses.shipping?.zip
        : "";
      PrivateDefaultValue.shippingCity = info?.addresses?.shipping?.city
        ? info.addresses.shipping?.city
        : "";
      PrivateDefaultValue.shippingCountry = info?.addresses?.shipping?.country
        ? info.addresses.shipping?.country
        : "";

      reset({ ...PrivateDefaultValue });

      setIsLoading(false);
    }).catch((e)=> {
      navigate("/customers/customers-list")
      enqueueSnackbar(t(`message:${e}`), {variant: "error"})
    })
  },[isLoading]);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onRawSubmit = (values) => {
    const billingUUID = info?.addresses?.billing?.uuid
      ? info?.addresses?.billing?.uuid
      : "";
    const shippingUUID = info?.addresses?.shipping?.uuid
      ? info?.addresses?.shipping?.uuid
      : "";

    setLoading(true);
    const preparedPayload =
      CustomersService.prepareUpdatePrivateCustomerPayload(
        values,
        sameAddress,
        billingUUID,
        shippingUUID
      );
    updatePrivateCustomer(preparedPayload).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), { variant: "success" });
        navigate("/customers/customers-list");
        setLoading(false);
      } else if (response?.error?.data?.status_code === 417) {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
        setLoading(false);
      }
    });
  };
  // form end
  const handleMakeInactive = () => {
    CustomersService.makeInactiveCustomerByUUID(queryParams.id)
      .then((res) => {
        if (res?.status_code === 202) {
          enqueueSnackbar(res.message, { variant: "success" });
          navigate(`/customers/customers-list`);
        }
      })
      .catch((e) => {
        enqueueSnackbar("Operation failed", { variant: "error" });
      });
  };

  return (
    <div className="">
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          color: '#0088AE',
          background: 'white',
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        !isLoading && (
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
                      <PersonIcon className="icon-size-20 text-accentBlue-500" />
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
                  <div className="button-container-product">
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
                      disabled={user.role[0] === FP_ADMIN || !isDirty}
                      loading={loading}
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
                        aria-label="lab API tabs example"
                        TabIndicatorProps={{
                          style: { background: "#33A0BE", height: "4px" },
                        }}
                        variant="scrollable"
                        scrollButtons
                        allowScrollButtonsMobile
                      >
                        <Tab
                          label={t("label:customerInformation")}
                          className="subtitle3"
                          value="1"
                        />
                        <Tab label={t("label:timeline")}  className="subtitle3" value="2" />
                        <Tab label={t("label:orders")} className="subtitle3" value="3" />
                        <Tab label={t("label:notes")} className="subtitle3" value="4" />
                      </TabList>
                    </Box>
                    <TabPanel value="1" className="py-20 px-10">
                      <div className="main-layout-product">
                        <div className="col-span-1 md:col-span-4 bg-white">
                          <div className="my-20">
                            <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                              {t("label:primaryInformation")}
                              {dirtyFields.customerID &&
                              dirtyFields.primaryPhoneNumber &&
                              dirtyFields.customerName &&
                              dirtyFields.customerEmail &&
                              dirtyFields.pNumber ? (
                                <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                              ) : (
                                <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                              )}
                            </div>
                            <div className="px-10 my-20 ">
                              <div className="grid grid-cols-1 sm:grid-cols-2 w-full md:w-3/4 gap-20 mb-40 ">
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
                                      helperText={errors?.customerID?.message}
                                      variant="outlined"
                                      required
                                      disabled
                                      fullWidth
                                      value={field.value || ''}
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
                                        {errors?.primaryPhoneNumber?.message}
                                      </FormHelperText>
                                    </FormControl>
                                  )}
                                />
                              </div>
                              <div className="form-pair-input mt-20">
                                <Controller
                                  name="customerName"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:customerName")}
                                      className="bg-white"
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.customerName}
                                      helperText={errors?.customerName?.message}
                                      variant="outlined"
                                      fullWidth
                                      value={field.value || ''}
                                    />
                                  )}
                                />
                                <Controller
                                  name="customerEmail"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:emailId")}
                                      className="bg-white"
                                      type="email"
                                      autoComplete="off"
                                      error={!!errors.customerEmail}
                                      helperText={errors?.customerEmail?.message}
                                      variant="outlined"
                                      required
                                      fullWidth
                                      value={field.value || ''}
                                    />
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-3 mt-40">
                                <Controller
                                  name="pNumber"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:pNumber")}
                                      className="bg-white"
                                      type="number"
                                      autoComplete="off"
                                      error={!!errors.pNumber}
                                      helperText={errors?.pNumber?.message}
                                      variant="outlined"
                                      fullWidth
                                      value={field.value || ''}
                                    />
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
                                dirtyFields.billingZip &&
                                dirtyFields.billingCity &&
                                dirtyFields.billingCountry ? (
                                  <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                ) : (
                                  <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                )}
                              </div>
                              <div className="w-full px-7 sm:px-14">
                                <div className="billing-address-head no-padding-x my-14">
                                  {t("label:billingAddress")}
                                  {dirtyFields.billingAddress &&
                                  dirtyFields.billingZip &&
                                  dirtyFields.billingCity &&
                                  dirtyFields.billingCountry ? (
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
                                            }
                                            variant="outlined"
                                            required
                                            fullWidth
                                            value={field.value || ''}
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
                                            helperText={errors?.billingZip?.message}
                                            variant="outlined"
                                            fullWidth
                                            required
                                            value={field.value || ''}
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
                                          helperText={errors?.billingCity?.message}
                                          variant="outlined"
                                          fullWidth
                                          required
                                          value={field.value || ''}
                                        />
                                      )}
                                    />
                                    <Controller
                                      name="billingCountry"
                                      control={control}
                                      render={({ field }) => (
                                        <FormControl
                                          error={!!errors.billingCountry}
                                          fullWidth
                                        >
                                          <InputLabel id="demo-simple-select-label">
                                            {t("label:country")} *
                                          </InputLabel>
                                          <Select
                                            {...field}
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            label={`${t("label:country")}*`}
                                            required
                                            defaultValue={
                                              info?.addresses &&
                                              info?.addresses?.billing &&
                                              info?.addresses?.billing?.country
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
                                            {errors?.billingCountry?.message}
                                          </FormHelperText>
                                        </FormControl>
                                      )}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="shipping-information px-7 sm:px-14">
                                <div className="w-full">
                                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center no-padding-x">
                                    <div className="billing-address-head no-padding-x">
                                      {t("label:shippingAddress")}
                                      {(sameAddress &&
                                        dirtyFields.billingAddress &&
                                        dirtyFields.billingZip &&
                                        dirtyFields.billingCity &&
                                        dirtyFields.billingCountry) ||
                                      (dirtyFields.shippingAddress &&
                                        dirtyFields.shippingZip &&
                                        dirtyFields.shippingCity &&
                                        dirtyFields.shippingCountry) ? (
                                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                      ) : (
                                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                      )}
                                    </div>
                                    <div className="billing-address-right ml-0">
                                      <FormControlLabel
                                        className="font-bold ml-0"
                                        control={
                                          <Switch
                                            onChange={() =>
                                              setSameAddress(!sameAddress)
                                            }
                                            checked={sameAddress}
                                            name="jason"
                                            color="secondary"
                                            ref={sameAddRef}
                                          />
                                        }
                                        label={t("label:sameAsBillingAddress")}
                                        labelPlacement="start"
                                        disabled={
                                          !billingAddress ||
                                          !zip ||
                                          !city ||
                                          !country
                                        }
                                      />
                                    </div>
                                  </div>
                                  {!sameAddress &&
                                    ((billingAddress && zip && city && country) ||
                                      shippingAddress ||
                                      shippingZip ||
                                      shippingCity ||
                                      shippingCountry ||
                                      !info?.addresses) && (
                                      <div className="">
                                        {/*<div className="form-pair-input gap-x-20">*/}
                                        {/*<Controller*/}
                                        {/*  name="shippingPhoneNumber"*/}
                                        {/*  control={control}*/}
                                        {/*  render={({ field }) => (*/}
                                        {/*    <FormControl*/}
                                        {/*      error={!!errors.shippingPhoneNumber}*/}
                                        {/*      fullWidth*/}
                                        {/*    >*/}
                                        {/*      <PhoneInput*/}
                                        {/*        {...field}*/}
                                        {/*        className={*/}
                                        {/*          errors.shippingPhoneNumber*/}
                                        {/*            ? "input-phone-number-field border-1 rounded-md border-red-300"*/}
                                        {/*            : "input-phone-number-field"*/}
                                        {/*        }*/}
                                        {/*        country="no"*/}
                                        {/*        enableSearch*/}
                                        {/*        disabled={sameAddress}*/}
                                        {/*        autocompleteSearch*/}
                                        {/*        countryCodeEditable={false}*/}
                                        {/*        specialLabel={t("label:phone")}*/}
                                        {/*      // onBlur={handleOnBlurGetDialCode}*/}
                                        {/*      />*/}
                                        {/*      <FormHelperText>*/}
                                        {/*        {errors?.shippingPhoneNumber?.message}*/}
                                        {/*      </FormHelperText>*/}
                                        {/*    </FormControl>*/}
                                        {/*  )}*/}
                                        {/*/>*/}
                                        {/*<Controller*/}
                                        {/*  name="shippingEmail"*/}
                                        {/*  control={control}*/}
                                        {/*  render={({ field }) => (*/}
                                        {/*    <TextField*/}
                                        {/*      {...field}*/}
                                        {/*      label={t("label:email")}*/}
                                        {/*      type="email"*/}
                                        {/*      autoComplete="off"*/}
                                        {/*      disabled={sameAddress}*/}
                                        {/*      error={!!errors.shippingEmail}*/}
                                        {/*      helperText={errors?.shippingEmail?.message}*/}
                                        {/*      variant="outlined"*/}
                                        {/*      fullWidth*/}
                                        {/*    />*/}
                                        {/*  )}*/}
                                        {/*/>*/}
                                        {/*</div>*/}
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
                                                    errors?.shippingAddress?.message
                                                  }
                                                  variant="outlined"
                                                  fullWidth
                                                  value={field.value || ''}
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
                                                  }
                                                  variant="outlined"
                                                  fullWidth
                                                  value={field.value || ''}
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
                                                }
                                                variant="outlined"
                                                fullWidth
                                                value={field.value || ''}
                                              />
                                            )}
                                          />
                                          <Controller
                                            name="shippingCountry"
                                            control={control}
                                            render={({ field }) => (
                                              <FormControl
                                                error={!!errors.shippingCountry}
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
                                                  disabled={sameAddress}
                                                  defaultValue={
                                                    info?.addresses &&
                                                    info?.addresses?.shipping &&
                                                    info?.addresses?.shipping
                                                      ?.country
                                                  }
                                                >
                                                  <MenuItem value="" />
                                                  <MenuItem value="norway">
                                                    Norway
                                                  </MenuItem>
                                                </Select>
                                                <FormHelperText>
                                                  {errors?.shippingCountry?.message}
                                                </FormHelperText>
                                              </FormControl>
                                            )}
                                          />
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 hidden">{/* <FAQs /> */}</div>
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
        )
      }
    </div>
  );
};
export default detailPrivateCustomer;
