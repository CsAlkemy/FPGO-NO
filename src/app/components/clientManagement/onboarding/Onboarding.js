import { yupResolver } from "@hookform/resolvers/yup";
import {
  RemoveCircleOutline,
  Search,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import { DesktopDatePicker, LoadingButton } from "@mui/lab";
import {
  Backdrop,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";
import { RiCheckDoubleLine } from "react-icons/ri";
import PhoneInput from "react-phone-input-2";
import { useNavigate, useParams } from "react-router-dom";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import ConfirmModal from "../../common/confirmmationDialog";
import {
  defaultValueOnBoard,
  validateSchemaCreateClient,
  validateSchemaCreateClientAdministration,
  validateSchemaOnBoard,
  validateSchemaOnBoardAdministration,
} from "../utils/helper";
import { useOnboardClientMutation } from "app/store/api/apiSlice";

const Onboarding = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [dialCode, setDialCode] = React.useState();
  const [hide, setHide] = React.useState(true);
  const [clientType, setClientType] = React.useState(1); // 1 for client, 2 for sub-client
  const [sameAddress, setSameAddress] = React.useState(false);
  const [addVatIndex, setAddVatIndex] = React.useState([0]);
  const [uploadDocuments, setUploadDocuments] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [recheckSchema, setRecheckSchema] = useState(false);
  const [ownerRef, setOwnerRef] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const params = useParams();
  const [plan, setPlan] = React.useState(1);
  const [currency, setCurrency] = React.useState({
    currency: "Norwegian Krone",
    code: "NOK",
  });
  const [customApticInfoData, setCustomApticInfoData] = useState("purchase");
  const [isVatIconGreen, setIsVatIconGreen] = useState(false);

  const navigate = useNavigate();
  const plansPrice = ["200", "350", "500"];
  const [orgTypeList, setOrgTypeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardClient] = useOnboardClientMutation();

  let schema =
    customApticInfoData === "purchase"
      ? validateSchemaOnBoard
      : validateSchemaOnBoardAdministration;
  useEffect(() => {
    if (recheckSchema) {
      if (customApticInfoData === "purchase") {
        clearErrors(["creditLimitCustomer"]);
        setValue("creditLimitCustomer", "", { shouldValidate: true });
        setError(
          "creditLimitCustomer",
          { type: "focus" },
          { shouldFocus: true }
        );
      } else {
        setValue("creditLimitCustomer", "", { shouldValidate: true });
        clearErrors(["creditLimitCustomer"]);
      }
    }
  }, [customApticInfoData]);
  // form
  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
    watch,
    clearErrors,
    setError,
  } = useForm({
    mode: "onChange",
    defaultValueOnBoard,
    resolver: yupResolver(schema),
  });

  const addNewVat = () => {
    setAddVatIndex([...addVatIndex, addVatIndex.length]);
    changeVatRateIcon(Math.max(...addVatIndex) + 1);
  };

  const onDelete = (index) => {
    addVatIndex.length > 1
      ? setAddVatIndex(addVatIndex.filter((i) => i !== index))
      : setAddVatIndex([...addVatIndex]);

    setValue(`vat[${index}].vatName`, "");
    setValue(`vat[${index}].vatValue`, "");
    setValue(`vat[${index}].bookKeepingReference`, "");
    changeVatRateIcon(index, true);
  };

  useEffect(() => {
    if (isLoading) {
      ClientService.clientDetails(params.uuid)
        .then((res) => {
          setInfo(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          navigate("/clients/approval-list");
          enqueueSnackbar(t(`message:${error}`), { variant: "error" });
          setIsLoading(false);
        });
      ClientService.organizationTypeList()
        .then((res) => {
          if (res?.status_code === 200 && res?.is_data) {
            setOrgTypeList(res.data);
            setIsLoading(false);
          } else if (res?.is_data === false) {
            setOrgTypeList([]);
            setIsLoading(false);
          } else {
            enqueueSnackbar("No Org Type found", { variant: "warning" });
          }
        })
        .catch((e) => {
          enqueueSnackbar("No Org Type found", { variant: "warning" });
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    if (!!info) {
      defaultValueOnBoard.id = info?.organizationDetails?.id
        ? info?.organizationDetails?.id
        : "";
      defaultValueOnBoard.clientName = info?.organizationDetails?.name
        ? info?.organizationDetails?.name
        : "";
      defaultValueOnBoard.organizationType = info?.organizationDetails?.type
        ? info?.organizationDetails?.type
        : "";
      defaultValueOnBoard.email = info?.primaryContactDetails?.email
        ? info?.primaryContactDetails?.email
        : "";
      defaultValueOnBoard.designation = info?.primaryContactDetails?.designation
        ? info?.primaryContactDetails?.designation
        : "";
      defaultValueOnBoard.fullName = info?.primaryContactDetails?.name
        ? info?.primaryContactDetails?.name
        : "";
      defaultValueOnBoard.primaryPhoneNumber =
        info?.primaryContactDetails?.countryCode &&
        info?.primaryContactDetails?.msisdn
          ? info?.primaryContactDetails?.countryCode +
            info?.primaryContactDetails?.msisdn
          : "";
      reset({ ...defaultValueOnBoard });
    }
  }, [info]);

  const handleOnBlurGetDialCode = (value, data, event) => {
    setDialCode(data?.dialCode);
  };

  const handleClickShowPassword = () => {
    setHide(!hide);
  };

  const handleFileUpload = (event) => {
    const { files } = event.target;
    const file = files[0];
    if (uploadDocuments.length < 3) {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target.result;
          setUploadDocuments([
            ...uploadDocuments,
            {
              name: file.name,
              type: file.type,
              data: dataUrl,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const { isValid, dirtyFields, errors, isDirty } = formState;

  const onSubmit = (values) => {
    const primaryPhoneNumber = values?.primaryPhoneNumber
      ? values.primaryPhoneNumber.split("+")
      : null;
    const billingPhoneNumber = values?.billingPhoneNumber
      ? values.billingPhoneNumber.split("+")
      : null;
    const shippingPhoneNumber = values?.shippingPhoneNumber
      ? values.shippingPhoneNumber.split("+")
      : null;

    const msisdn = primaryPhoneNumber
      ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
      : null;
    const countryCode = primaryPhoneNumber
      ? "+" + primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
      : null;
    const bl_msisdn = billingPhoneNumber
      ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
      : null;
    const bl_countryCode = billingPhoneNumber
      ? "+" + billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
      : null;
    const sh_msisdn = shippingPhoneNumber
      ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
      : null;
    const sh_countryCode = shippingPhoneNumber
      ? "+" + shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
      : null;

    const vatRates = values.vat.length
      ? values.vat
          .filter((v) => v.vatValue)
          .map((vat) => {
            return {
              uuid: null,
              name: vat.vatName ? vat.vatName : null,
              value: parseFloat(vat.vatValue),
              isActive: true,
              bookKeepingReference: vat?.bookKeepingReference
                ? vat.bookKeepingReference
                : null,
            };
          })
      : null;

    const onBoardingData = {
      uuid: params.uuid,
      organizationDetails: {
        name: values.clientName,
        id: values.id,
        type: values?.organizationType ? values?.organizationType : null,
        brandId: null,
        groupId: null,
      },
      primaryContactDetails: {
        uuid: info.primaryContactDetails.uuid,
        name: values.fullName,
        email: values.email,
        designation: values?.designation ? values?.designation : null,
        countryCode,
        msisdn,
      },
      contractDetails: {
        // startDate: new Date(),
        // endDate: values.contactEndDate,
        startDate: ClientService.prepareDate(new Date()),
        endDate: ClientService.prepareDate(values.contactEndDate),
        commissionRate: parseFloat(values.commision),
        smsCost: parseFloat(values.smsCost),
        emailCost: parseFloat(values.emailCost),
        creditCheckCost: parseFloat(values.creditCheckCost),
        ehfCost: parseFloat(values.ehfCost),
        // documentLink: "https://www.w3.org/Provider/Style/dummy.html",
      },
      addresses: {
        0: {
          type: "billing",
          countryCode: bl_countryCode,
          msisdn: bl_msisdn,
          email: values.billingEmail,
          street: values.billingAddress,
          zip: values.zip,
          city: values.city,
          country: values.country,
        },
      },
      bankInformation: {
        name: values.bankName,
        accountNumber: `${values.accountNumber}`,
        iban: values.IBAN,
        swiftCode: values.SWIFTCode,
      },
      apticInformation: {
        // username: values.APTICuserName,
        // password: values.APTICpassword,
        // fpReference: values.fpReference,
        // creditLimit: values.creditLimit,
        // b2bInvoiceFee: values.B2BInvoiceFee,
        // b2cInvoiceFee: values.B2CInvoiceFee,
        isPurchasable: customApticInfoData === "purchase",
        username: values.APTICuserName,
        password: values.APTICpassword,
        name: values.name,
        fpReference: values.fpReference,
        creditLimit:
          customApticInfoData === "purchase"
            ? parseFloat(values.creditLimitCustomer)
            : null,
        costLimitForCustomer:
          customApticInfoData === "purchase"
            ? parseFloat(values.costLimitforCustomer)
            : null,
        costLimitForOrder:
          customApticInfoData === "purchase"
            ? parseFloat(values.costLimitforOrder)
            : null,
        invoiceWithRegress:
          customApticInfoData === "purchase"
            ? parseFloat(values.invoicewithRegress)
            : null,
        invoiceWithoutRegress:
          customApticInfoData === "purchase"
            ? parseFloat(values.invoicewithoutRegress)
            : null,
        // creditLimit: parseFloat(values.creditLimitCustomer),
        // costLimitForCustomer: parseFloat(values.costLimitforCustomer),
        // costLimitForOrder: parseFloat(values.costLimitforOrder),
        // invoiceWithRegress: parseFloat(values.invoicewithRegress),
        // invoiceWithoutRegress: parseFloat(values.invoicewithoutRegress),
        backOfficeUsername: values.APTIEngineCuserName,
        backOfficePassword: values.APTIEnginePassword,
        b2bInvoiceFee: parseFloat(values.fakturaB2B),
        b2cInvoiceFee: parseFloat(values.fakturaB2C),
        isCustomerOwnerReference: ownerRef,
      },
      settings: {
        currencies: [
          {
            code: currency.code,
            isBaseCurrency: true,
          },
          // {
          //     code: "BDT",
          //     isBaseCurrency: false
          // }
        ],
        vatRates,
        // vatRates : [
        //     {
        //         name : "Zero",
        //         value : 0,
        //         bookKeepingReference : null,
        //     }
        // ]
      },
    };
    if (sameAddress) {
      onBoardingData.addresses[1] = {
        type: "Shipping",
        countryCode: bl_countryCode,
        msisdn: bl_msisdn,
        email: values.billingEmail,
        street: values.billingAddress,
        zip: values.zip,
        city: values.city,
        country: values.country,
      };
    } else if (!sameAddress) {
      onBoardingData.addresses[1] = {
        type: "Shipping",
        countryCode: sh_countryCode,
        msisdn: sh_msisdn,
        email: values.shippingEmail,
        street: values.shippingAddress,
        zip: values.shippingZip,
        city: values.shippingCity,
        country: values.shippingCountry,
      };
    }
    if (plan === 1) {
      onBoardingData.contractDetails.planTag = "Plan 1";
      onBoardingData.contractDetails.planPrice = parseFloat(plansPrice[0]);
    } else if (plan === 2) {
      onBoardingData.contractDetails.planTag = "Plan 2";
      onBoardingData.contractDetails.planPrice = parseFloat(plansPrice[1]);
    } else {
      onBoardingData.contractDetails.planTag = "Plan 3";
      onBoardingData.contractDetails.planPrice = parseFloat(plansPrice[2]);
    }
    setLoading(true);

    onboardClient(onBoardingData).then((response) => {
      // if (res?.status_code === 201) {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(`${params.uuid} Onboarded Successfully`, {
          variant: "success",
          autoHideDuration: 3000,
        });
        navigate("/clients/clients-list");
        setLoading(false);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
        });
      }
      setLoading(false);
    });
  };
  // end form

  const changeVatRateIcon = (index, lessCheck = false) => {
    const watchVateName = watch(`vat[${index}].vatName`) || null;
    const watchVateValue = watch(`vat[${index}].vatValue`) || null;
    if (!lessCheck) {
      if (watchVateName && watchVateValue) {
        setIsVatIconGreen(true);
      } else setIsVatIconGreen(false);
    } else {
      const watchVateName =
        !watch(
          `order[${
            index -
            (addVatIndex[addVatIndex.indexOf(index)] -
              addVatIndex[addVatIndex.indexOf(index) - 1])
          }].vatName`
        ) || null;
      const watchVateValue =
        !watch(
          `order[${
            index -
            (addVatIndex[addVatIndex.indexOf(index)] -
              addVatIndex[addVatIndex.indexOf(index) - 1])
          }].vatValue`
        ) || null;
      if (watchVateName && watchVateValue) {
        setIsVatIconGreen(true);
      } else setIsVatIconGreen(false);
    }
  };

  return (
    <div>
      <div className="flex flex-1 flex-col items-center justify-center">
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
      </div>

      {!isLoading && !!info && (
        <div className="flex flex-col flex-auto min-w-0 bg-MonochromeGray-25 max-w-screen-xl">
          <div className="flex-auto p-20 sm:p-0 w-full mx-auto bg-white">
            <div className="rounded-sm bg-white p-0 md:p-20">
              <form
                name="loginForm"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className=" header-click-to-action">
                  <div className="header-text header6">
                    {t("label:registrationRequest")} ( {params?.uuid} )
                  </div>
                  <div className="flex gap-10 w-full justify-between sm:w-auto">
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      className="rounded-4 button2"
                      aria-label="Confirm"
                      size="large"
                      type="submit"
                      startIcon={
                        <RiCheckDoubleLine className="icon-size-20 mr-0 md:mr-5" />
                      }
                      loading={loading}
                      loadingPosition="center"
                      disabled={!isValid}
                    >
                      {t("label:approveClient")}
                    </LoadingButton>
                    {/*<Button*/}
                    {/*  color="secondary"*/}
                    {/*  type="submit"*/}
                    {/*  variant="contained"*/}
                    {/*  startIcon={*/}
                    {/*    <RiCheckDoubleLine className="icon-size-20 mr-0 md:mr-5" />*/}
                    {/*  }*/}
                    {/*  className="font-semibold rounded-4"*/}
                    {/*>*/}
                    {/*  {t("label:approveClient")}*/}
                    {/*</Button>*/}
                    <Button
                      color="secondary"
                      onClick={() => setOpen(true)}
                      variant="outlined"
                      startIcon={
                        <MdDeleteOutline className="icon-size-20 mr-0 md:mr-5" />
                      }
                      className="font-semibold rounded-4"
                    >
                      {t("label:deleteRequest")}
                    </Button>
                  </div>
                </div>
                <div className="p-5 md:px-20">
                  <div className="client-details">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:clientDetails")}
                      {dirtyFields.organizationID &&
                      dirtyFields.clientName &&
                      dirtyFields.organizationType ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="px-16">
                      <div className="client-details-container w-full sm:w-11/12">
                        <Controller
                          name="id"
                          control={control}
                          className="w-10/12"
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:organizationId")}
                              type="number"
                              autoComplete="off"
                              error={!!errors.id}
                              helperText={
                                errors?.id?.message
                                  ? t(`validation:${errors?.id?.message}`)
                                  : ""
                              }
                              variant="outlined"
                              required
                              fullWidth
                            />
                          )}
                        />
                        <Controller
                          name="clientName"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:clientName")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.clientName}
                              helperText={
                                errors?.clientName?.message
                                  ? t(
                                      `validation:${errors?.clientName?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              required
                              fullWidth
                            />
                          )}
                        />
                        <Controller
                          name="organizationType"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              error={!!errors.organizationType}
                              fullWidth
                            >
                              <InputLabel id="demo-simple-select-label">
                                {t("label:organizationType")}
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label={t("label:organizationType")}
                                defaultValue={
                                  info.organizationDetails?.type
                                    ? info.organizationDetails?.type
                                    : ""
                                }
                              >
                                {orgTypeList.length ? (
                                  orgTypeList.map((item, index) => {
                                    return (
                                      <MenuItem key={index} value={item}>
                                        {item}
                                      </MenuItem>
                                    );
                                  })
                                ) : (
                                  <MenuItem disabled>
                                    {" "}
                                    {t("label:noOrganizationFound")}
                                  </MenuItem>
                                )}
                              </Select>
                              <FormHelperText>
                                {errors?.organizationType?.message
                                  ? t(
                                      `validation:${errors?.organizationType?.message}`
                                    )
                                  : ""}
                              </FormHelperText>
                            </FormControl>
                          )}
                        />
                        {/*<Controller*/}
                        {/*  name="organizationType"*/}
                        {/*  control={control}*/}
                        {/*  render={({ field }) => (*/}
                        {/*    <TextField*/}
                        {/*      {...field}*/}
                        {/*      label="Organization Type"*/}
                        {/*      */}
                        {/*      type="text"*/}
                        {/*      autoComplete="off"*/}
                        {/*      error={!!errors.organizationType}*/}
                        {/*      helperText={errors?.organizationType?.message}*/}
                        {/*      variant="outlined"*/}
                        {/*      fullWidth*/}
                        {/*    />*/}
                        {/*  )}*/}
                        {/*/>*/}
                        {clientType === 2 && (
                          <Controller
                            name="parentClientName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label="Parent Client Name"
                                type="text"
                                autoComplete="off"
                                error={!!errors.parentClientName}
                                helperText={
                                  errors?.parentClientName?.message
                                    ? t(
                                        `validation:${errors?.parentClientName?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton edge="end">
                                        <Search />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="primary-contact-details">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex justify-between items-center">
                      <div className="flex gap-10 items-center">
                        {t("label:primaryContactDetails")}
                        {dirtyFields.fullName &&
                        dirtyFields.primaryPhoneNumber &&
                        dirtyFields.email ? (
                          <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                        ) : (
                          <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                        )}
                      </div>
                    </div>
                    <div className="px-16">
                      <div className="client-details-container">
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
                                  ? t(`validation:${errors?.fullName?.message}`)
                                  : ""
                              }
                              variant="outlined"
                              required
                              fullWidth
                            />
                          )}
                        />
                        <Controller
                          name="primaryPhoneNumber"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              error={!!errors.primaryPhoneNumber}
                              required
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
                                onBlur={handleOnBlurGetDialCode}
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
                            />
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
                                  ? t(`validation:${errors?.email?.message}`)
                                  : ""
                              }
                              variant="outlined"
                              required
                              fullWidth
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="contract-details">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:contractDetails")}
                      {dirtyFields.contactEndDate &&
                      dirtyFields.commision &&
                      dirtyFields.smsCost &&
                      dirtyFields.emailCost &&
                      dirtyFields.creditCheckCost &&
                      dirtyFields.ehfCost ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="px-16">
                      <div className="create-user-roles caption2">
                        {t("label:choosePlan")}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-x-10 gap-y-7 mt-10">
                        <button
                          type="button"
                          className={
                            plan === 1
                              ? "create-user-role-button-active"
                              : "create-user-role-button"
                          }
                          onClick={() => setPlan(1)}
                        >
                          {t("label:plan1")}
                        </button>
                        <button
                          type="button"
                          className={
                            plan === 2
                              ? "create-user-role-button-active"
                              : "create-user-role-button"
                          }
                          onClick={() => setPlan(2)}
                        >
                          {t("label:plan2")}
                        </button>
                        <button
                          type="button"
                          className={
                            plan === 3
                              ? "create-user-role-button-active"
                              : "create-user-role-button"
                          }
                          onClick={() => setPlan(3)}
                        >
                          {t("label:plan3")}
                        </button>
                      </div>
                      <div className="contract-details-container w-full sm:w-11/12">
                        <Controller
                          name="contactEndDate"
                          control={control}
                          render={({ field: { onChange, value, onBlur } }) => (
                            <DesktopDatePicker
                              label={t("label:contractEndDate")}
                              mask=""
                              inputFormat="dd.MM.yyyy"
                              value={value}
                              onChange={onChange}
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
                                  type="date"
                                  error={!!errors.contactEndDate}
                                  helperText={
                                    errors?.contactEndDate?.message
                                      ? t(
                                          `validation:${errors?.contactEndDate?.message}`
                                        )
                                      : ""
                                  }
                                />
                              )}
                            />
                          )}
                        />
                        <Controller
                          name="commision"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:commissionRate")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.commision}
                              helperText={
                                errors?.commision?.message
                                  ? t(
                                      `validation:${errors?.commision?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              required
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    %
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        <Controller
                          name="smsCost"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:smsCost")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.smsCost}
                              helperText={
                                errors?.smsCost?.message
                                  ? t(`validation:${errors?.smsCost?.message}`)
                                  : ""
                              }
                              variant="outlined"
                              required
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    {t("label:kr")}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        <Controller
                          name="emailCost"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:emailCost")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.emailCost}
                              helperText={
                                errors?.emailCost?.message
                                  ? t(
                                      `validation:${errors?.emailCost?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    {t("label:kr")}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        <Controller
                          name="creditCheckCost"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:creditCheckCost")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.creditCheckCost}
                              helperText={
                                errors?.creditCheckCost?.message
                                  ? t(
                                      `validation:${errors?.creditCheckCost?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    {t("label:kr")}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                        <Controller
                          name="ehfCost"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:ehfCost")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.ehfCost}
                              helperText={
                                errors?.ehfCost?.message
                                  ? t(`validation:${errors?.ehfCost?.message}`)
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="start">
                                    {t("label:kr")}
                                  </InputAdornment>
                                ),
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="billing-information">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:billingAndShippingInfo")}
                      {dirtyFields.billingPhoneNumber &&
                      dirtyFields.billingEmail &&
                      dirtyFields.billingAddress &&
                      dirtyFields.zip &&
                      dirtyFields.city &&
                      dirtyFields.country ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10 w-full md:w-3/4">
                      <div className="billing-address-head mt-10">
                        {t("label:billingAddress")}
                        {dirtyFields.billingPhoneNumber &&
                        dirtyFields.billingEmail &&
                        dirtyFields.billingAddress &&
                        dirtyFields.zip &&
                        dirtyFields.city &&
                        dirtyFields.country ? (
                          <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                        ) : (
                          <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                        )}
                      </div>
                      <div className="px-16">
                        <div className="form-pair-input gap-x-20">
                          <Controller
                            name="billingPhoneNumber"
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                error={!!errors.billingPhoneNumber}
                                required
                                fullWidth
                              >
                                <PhoneInput
                                  {...field}
                                  className={
                                    errors.billingPhoneNumber
                                      ? "input-phone-number-field border-1 rounded-md border-red-400"
                                      : "input-phone-number-field"
                                  }
                                  country="no"
                                  enableSearch
                                  autocompleteSearch
                                  countryCodeEditable={false}
                                  specialLabel={`${t("label:phone")}*`}
                                  onBlur={handleOnBlurGetDialCode}
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
                            name="billingEmail"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:email")}
                                type="email"
                                autoComplete="off"
                                error={!!errors.billingEmail}
                                helperText={
                                  errors?.billingEmail?.message
                                    ? t(
                                        `validation:${errors?.billingEmail?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                              />
                            )}
                          />
                        </div>
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
                                  required
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                          <div className="col-span-1">
                            <Controller
                              name="zip"
                              className="col-span-1"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:zipCode")}
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.zip}
                                  helperText={
                                    errors?.zip?.message
                                      ? t(`validation:${errors?.zip?.message}`)
                                      : ""
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                        </div>
                        <div className="form-pair-input gap-x-20">
                          <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:city")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.city}
                                helperText={
                                  errors?.city?.message
                                    ? t(`validation:${errors?.city?.message}`)
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="country"
                            control={control}
                            render={({ field }) => (
                              <FormControl
                                error={!!errors.country}
                                required
                                fullWidth
                              >
                                <InputLabel id="demo-simple-select-label">
                                  {t("label:country")}
                                </InputLabel>
                                <Select
                                  {...field}
                                  labelId="demo-simple-select-label-country"
                                  id="demo-simple-select"
                                  label={t("label:country")}
                                  defaultValue=""
                                >
                                  <MenuItem value="norway">Norway</MenuItem>
                                  <MenuItem value="denmark">Denmark</MenuItem>
                                  <MenuItem value="sweden">Sweden</MenuItem>
                                </Select>
                                <FormHelperText>
                                  {errors?.country?.message
                                    ? t(
                                        `validation:${errors?.country?.message}`
                                      )
                                    : ""}
                                </FormHelperText>
                              </FormControl>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shipping-information">
                    <div className="p-10 w-full md:w-3/4">
                      <div className="flex justify-between items-center billing-address-head">
                        <div className="billing-address-head">
                          {t("label:shippingAddress")}
                          {(dirtyFields.shippingPhoneNumber &&
                            dirtyFields.shippingEmail &&
                            dirtyFields.shippingAddress &&
                            dirtyFields.shippingZip &&
                            dirtyFields.shippingCity &&
                            dirtyFields.shippingCountry) ||
                          sameAddress ? (
                            <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                          ) : (
                            <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                          )}
                        </div>
                        <div className="billing-address-right">
                          <FormControlLabel
                            className="font-bold"
                            control={
                              <Switch
                                onChange={() => setSameAddress(!sameAddress)}
                                name="jason"
                                color="secondary"
                              />
                            }
                            label={t("label:sameAsBillingAddress")}
                            labelPlacement="start"
                            disabled={
                              !(
                                dirtyFields.billingPhoneNumber &&
                                dirtyFields.billingEmail &&
                                dirtyFields.billingAddress &&
                                dirtyFields.zip &&
                                dirtyFields.city &&
                                dirtyFields.country
                              )
                            }
                          />
                        </div>
                      </div>
                      {!sameAddress &&
                        dirtyFields.billingPhoneNumber &&
                        dirtyFields.billingEmail &&
                        dirtyFields.billingAddress &&
                        dirtyFields.zip &&
                        dirtyFields.city &&
                        dirtyFields.country && (
                          <div className="px-16">
                            <div className="form-pair-input gap-x-20">
                              <Controller
                                // name={
                                //   sameAddress === true
                                //     ? "billingPhoneNumber"
                                //     : "shippingPhoneNumber"
                                // }
                                name="shippingPhoneNumber"
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    error={!!errors.shippingPhoneNumber}
                                    // required
                                    fullWidth
                                  >
                                    <PhoneInput
                                      {...field}
                                      className={
                                        errors.shippingPhoneNumber
                                          ? "input-phone-number-field border-1 rounded-md border-red-300"
                                          : "input-phone-number-field"
                                      }
                                      country="no"
                                      enableSearch
                                      disabled={sameAddress}
                                      autocompleteSearch
                                      countryCodeEditable={false}
                                      specialLabel={t("label:phone")}
                                      onBlur={handleOnBlurGetDialCode}
                                    />
                                    <FormHelperText>
                                      {errors?.shippingPhoneNumber?.message
                                        ? t(
                                            `validation:${errors?.shippingPhoneNumber?.message}`
                                          )
                                        : ""}
                                    </FormHelperText>
                                  </FormControl>
                                )}
                              />
                              <Controller
                                name="shippingEmail"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label={t("label:email")}
                                    type="email"
                                    autoComplete="off"
                                    disabled={sameAddress}
                                    error={!!errors.shippingEmail}
                                    helperText={
                                      errors?.shippingEmail?.message
                                        ? t(
                                            `validation:${errors?.shippingEmail?.message}`
                                          )
                                        : ""
                                    }
                                    variant="outlined"
                                    // required
                                    fullWidth
                                  />
                                )}
                              />
                            </div>
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
                                          ? t(
                                              `validation:${errors?.shippingAddress?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      // required
                                      fullWidth
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
                                      // required
                                      fullWidth
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
                                    // required
                                    fullWidth
                                  />
                                )}
                              />
                              <Controller
                                name="shippingCountry"
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    error={!!errors.shippingCountry}
                                    // required
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
                                      defaultValue=""
                                    >
                                      <MenuItem value="" />
                                      <MenuItem value="norway">Norway</MenuItem>
                                      <MenuItem value="denmark">
                                        Denmark
                                      </MenuItem>
                                      <MenuItem value="sweden">Sweden</MenuItem>
                                    </Select>
                                    <FormHelperText>
                                      {errors?.shippingCountry?.message
                                        ? t(
                                            `validation:${errors?.shippingCountry?.message}`
                                          )
                                        : ""}
                                    </FormHelperText>
                                  </FormControl>
                                )}
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                  <div className="bank-information">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:bankInfo")}
                      {dirtyFields.bankName &&
                      dirtyFields.accountNumber &&
                      dirtyFields.IBAN &&
                      dirtyFields.SWIFTCode ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10 w-full md:w-3/4">
                      <div className="px-16">
                        <div className="form-pair-input">
                          <Controller
                            name="bankName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:bankName")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.bankName}
                                helperText={
                                  errors?.bankName?.message
                                    ? t(
                                        `validation:${errors?.bankName?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton edge="end">
                                        <Search />
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          <Controller
                            name="accountNumber"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:accountNumber")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.accountNumber}
                                helperText={
                                  errors?.accountNumber?.message
                                    ? t(
                                        `validation:${errors?.accountNumber?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="IBAN"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:iban")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.IBAN}
                                helperText={
                                  errors?.IBAN?.message
                                    ? t(`validation:${errors?.IBAN?.message}`)
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="SWIFTCode"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:swiftCode")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.SWIFTCode}
                                helperText={
                                  errors?.SWIFTCode?.message
                                    ? t(
                                        `validation:${errors?.SWIFTCode?.message}`
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
                  </div>
                  <div className="APTIC-information">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:apticInformation")}
                      {dirtyFields.APTICuserName &&
                      dirtyFields.name &&
                      dirtyFields.fpReference &&
                      dirtyFields.creditLimitCustomer ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10">
                      <div className="search-customer-order-create-type my-32 px-16">
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-10 gap-y-7 mt-10">
                          <button
                            type="button"
                            className={`${
                              customApticInfoData === "administration"
                                ? "create-user-role-button-active"
                                : "create-user-role-button"
                            }`}
                            onClick={() => {
                              setCustomApticInfoData("administration");
                              setRecheckSchema(true);
                            }}
                          >
                            {t("label:administration")}
                          </button>
                          <button
                            type="button"
                            className={`${
                              customApticInfoData === "purchase"
                                ? "create-user-role-button-active"
                                : "create-user-role-button"
                            }`}
                            onClick={() => {
                              setCustomApticInfoData("purchase");
                              setRecheckSchema(true);
                            }}
                          >
                            {t("label:purchase")}
                          </button>
                        </div>
                      </div>
                      <div className="px-16">
                        <div className="form-pair-input w-full md:w-3/4">
                          <Controller
                            name="APTICuserName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:userName")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.APTICuserName}
                                helperText={
                                  errors?.APTICuserName?.message
                                    ? t(
                                        `validation:${errors?.APTICuserName?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="APTICpassword"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:password")}
                                type={!hide ? "text" : "password"}
                                autoComplete="off"
                                error={!!errors.APTICpassword}
                                helperText={
                                  errors?.APTICpassword?.message
                                    ? t(
                                        `validation:${errors?.APTICpassword?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                      >
                                        {!hide ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="form-pair-input w-full md:w-3/4">
                          <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:name")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.name}
                                helperText={
                                  errors?.name?.message
                                    ? t(`validation:${errors?.name?.message}`)
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="fpReference"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:fpReference")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.fpReference}
                                helperText={
                                  errors?.fpReference?.message
                                    ? t(
                                        `validation:${errors?.fpReference?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                              />
                            )}
                          />
                        </div>
                        {customApticInfoData === "purchase" && (
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-20 gap-y-40 my-40 w-full md:w-3/4">
                            <Controller
                              name="creditLimitCustomer"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:creditLimitForClient")}
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.creditLimitCustomer}
                                  helperText={
                                    errors?.creditLimitCustomer?.message
                                      ? t(
                                          `validation:${errors?.creditLimitCustomer?.message}`
                                        )
                                      : ""
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">
                                        {t("label:nok")}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                            <Controller
                              name="costLimitforCustomer"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:costLimitForCustomer")}
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.costLimitforCustomer}
                                  helperText={
                                    errors?.costLimitforCustomer?.message
                                      ? t(
                                          `validation:${errors?.costLimitforCustomer?.message}`
                                        )
                                      : ""
                                  }
                                  variant="outlined"
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">
                                        {t("label:nok")}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                            <Controller
                              name="costLimitforOrder"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:costLimitForOrder")}
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.costLimitforOrder}
                                  helperText={
                                    errors?.costLimitforOrder?.message
                                      ? t(
                                          `validation:${errors?.costLimitforOrder?.message}`
                                        )
                                      : ""
                                  }
                                  variant="outlined"
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">
                                        {t("label:nok")}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                            <Controller
                              name="invoicewithRegress"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:invoiceWithRegress")}
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.invoicewithRegress}
                                  helperText={
                                    errors?.invoicewithRegress?.message
                                      ? t(
                                          `validation:${errors?.invoicewithRegress?.message}`
                                        )
                                      : ""
                                  }
                                  variant="outlined"
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">
                                        {t("label:nok")}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                            <Controller
                              name="invoicewithoutRegress"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:invoiceWithoutRegress")}
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.invoicewithoutRegress}
                                  helperText={
                                    errors?.invoicewithoutRegress?.message
                                      ? t(
                                          `validation:${errors?.invoicewithoutRegress?.message}`
                                        )
                                      : ""
                                  }
                                  variant="outlined"
                                  s
                                  fullWidth
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="start">
                                        {t("label:nok")}
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="Back Office Account for APTIC Engine">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:backOfficeAccountForApticEngine")}
                      {dirtyFields.APTIEngineCuserName ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10">
                      <div className="px-16">
                        <div className="form-pair-input w-full md:w-3/4">
                          <Controller
                            name="APTIEngineCuserName"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:userName")}
                                type="text"
                                autoComplete="off"
                                error={!!errors.APTIEngineCuserName}
                                helperText={
                                  errors?.APTIEngineCuserName?.message
                                    ? t(
                                        `validation:${errors?.APTIEngineCuserName?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                              />
                            )}
                          />
                          <Controller
                            name="APTIEnginePassword"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:password")}
                                type={!hide ? "text" : "password"}
                                autoComplete="off"
                                error={!!errors.APTIEnginePassword}
                                helperText={
                                  errors?.APTIEnginePassword?.message
                                    ? t(
                                        `validation:${errors?.APTIEnginePassword?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                required
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        edge="end"
                                      >
                                        {!hide ? (
                                          <VisibilityOff />
                                        ) : (
                                          <Visibility />
                                        )}
                                      </IconButton>
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </div>
                        <div className="py-10"></div>
                        <div className="create-user-roles caption2 mt-10">
                          {t("label:customerOwnerReferenceFilter")}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-10 gap-y-7 mt-10">
                          <button
                            type="button"
                            className={
                              ownerRef === true
                                ? "create-user-role-button-active"
                                : "create-user-role-button"
                            }
                            onClick={() => setOwnerRef(true)}
                          >
                            {t("label:yes")}
                          </button>
                          <button
                            type="button"
                            className={
                              ownerRef === false
                                ? "create-user-role-button-active"
                                : "create-user-role-button"
                            }
                            onClick={() => setOwnerRef(false)}
                          >
                            {t("label:no")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="Currency">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:currency")}
                      {currency.code.length > 0 ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10">
                      <div className="px-16">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 w-full md:w-3/4 my-20">
                          <div
                            className={`min-h-56 rounded-4 cursor-pointer p-20 border-1 border-MonochromeGray-50 ${
                              //TODO:Add proper logic here
                              currency.code === "NOK"
                                ? "border-2 border-main"
                                : "border-1 border-MonochromeGray-50"
                            }`}
                            onClick={() =>
                              setCurrency({
                                code: "NOK",
                                currency: "Norwegian Krone",
                              })
                            }
                          >
                            <div className="subtitle2 text-MonochromeGray-700">
                              {t("label:nok")}
                            </div>
                            <div className="body2 text-MonochromeGray-300">
                              {t("label:norwegianKrone")}
                            </div>
                          </div>
                          <div
                            className={`min-h-56 rounded-4 cursor-pointer p-20 border-1 border-MonochromeGray-50 ${
                              //TODO:Add proper logic here
                              currency.code === "SEK"
                                ? "border-2 border-main"
                                : "border-1 border-MonochromeGray-50"
                            }`}
                            onClick={() =>
                              setCurrency({
                                code: "SEK",
                                currency: "Swedish Krona",
                              })
                            }
                          >
                            <div className="subtitle2 text-MonochromeGray-700">
                              {t("label:sek")}
                            </div>
                            <div className="body2 text-MonochromeGray-300">
                              {t("label:swedishKrona")}
                            </div>
                          </div>
                          <div
                            className={`min-h-56 rounded-4 cursor-pointer p-20 border-1 border-MonochromeGray-50 ${
                              //TODO:Add proper logic here
                              currency.code === "DKK"
                                ? "border-2 border-main"
                                : "border-1 border-MonochromeGray-50"
                            }`}
                            onClick={() =>
                              setCurrency({
                                code: "DKK",
                                currency: "Danish Krone",
                              })
                            }
                          >
                            <div className="subtitle2 text-MonochromeGray-700">
                              {t("label:dkk")}
                            </div>
                            <div className="body2 text-MonochromeGray-300">
                              {t("label:danishKrone")}
                            </div>
                          </div>
                          <div
                            className={`min-h-56 rounded-4 cursor-pointer p-20 border-1 border-MonochromeGray-50 ${
                              //TODO:Add proper logic here
                              currency.code === "EUR"
                                ? "border-2 border-main"
                                : "border-1 border-MonochromeGray-50"
                            }`}
                            onClick={() =>
                              setCurrency({
                                code: "EUR",
                                currency: "European Euro",
                              })
                            }
                          >
                            <div className="subtitle2 text-MonochromeGray-700">
                              {t("label:eur")}
                            </div>
                            <div className="body2 text-MonochromeGray-300">
                              {t("label:europeanEuro")}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="vat rate">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:vatRate")}
                      {defaultValueOnBoard.vat.length > 0 || isVatIconGreen ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10">
                      <div className="px-16">
                        <div className="product-list">
                          <div className="my-10 grid grid-cols-12 product-list-grid-container-height bg-primary-25 mb-10 subtitle3 gap-10 px-10 w-full md:w-3/4">
                            <div className="my-auto text-MonochromeGray-500 col-span-4">
                              {t("label:name")}
                            </div>
                            <div className="my-auto text-right text-MonochromeGray-500 col-span-3">
                              {`Value (%)`}
                            </div>
                            <div className="my-auto text-MonochromeGray-500 col-span-4">
                              {t("label:bookKeepingReference")}
                            </div>
                            <div className="my-auto col-span-1 text-MonochromeGray-500">
                              {" "}
                            </div>
                          </div>
                          {addVatIndex.map((index) => (
                            <div
                              key={index}
                              className="grid grid-cols-12 subtitle3 gap-10 px-14 w-full md:w-3/4 my-20"
                            >
                              <div className="my-auto col-span-4">
                                <Controller
                                  name={`vat[${index}].vatName`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      onKeyUp={() => changeVatRateIcon(index)}
                                      {...field}
                                      type="text"
                                      autoComplete="off"
                                      className="bg-white custom-input-height"
                                      error={!!errors.vatName}
                                      helperText={errors?.vatName?.message}
                                      variant="outlined"
                                      required
                                      fullWidth
                                    />
                                  )}
                                />
                              </div>
                              <div className="my-auto text-right col-span-3">
                                <Controller
                                  name={`vat[${index}].vatValue`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      onKeyUp={() => changeVatRateIcon(index)}
                                      type="number"
                                      className="text-right  custom-input-height"
                                      autoComplete="off"
                                      error={!!errors.vatValue}
                                      helperText={errors?.vatValue?.message}
                                      variant="outlined"
                                      required
                                      fullWidth
                                      inputProps={{
                                        style: { textAlign: "right" },
                                      }}
                                    />
                                  )}
                                />
                              </div>
                              <div className="my-auto col-span-4">
                                <Controller
                                  name={`vat[${index}].bookKeepingReference`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      type="text"
                                      className="bg-white custom-input-height"
                                      autoComplete="off"
                                      error={
                                        !!errors?.vat?.[index]
                                          ?.bookKeepingReference
                                      }
                                      helperText={
                                        errors?.bookKeepingReference?.message
                                      }
                                      variant="outlined"
                                      required
                                      fullWidth
                                    />
                                  )}
                                />
                              </div>
                              <div className="my-auto col-span-1 text-right">
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => onDelete(index)}
                                  disabled={index === Math.min(...addVatIndex)}
                                >
                                  <RemoveCircleOutline className="icon-size-20 text-red-500" />
                                </IconButton>
                              </div>
                              {/* <div className="my-auto col-span-1 text-right">
                          <Controller
                            name={`vat[${index}].vatActive`}
                            type="checkbox"
                            control={control}
                            render={({ field: { onChange, value, ref, onBlur } }) => (
                              <FormControl required error={!!errors.Switch}>
                                <Switch
                                color="secondary"
                                  checked={value}
                                  onBlur={onBlur}
                                  onChange={(ev) => onChange(ev.target.checked)}
                                  inputRef={ref}
                                  required
                                />
                                <FormHelperText>{errors?.Switch?.message}</FormHelperText>
                              </FormControl>
                            )}
                          />
                          </div> */}
                            </div>
                          ))}
                          <Button
                            className="mt-10 px-10 rounded-4 button2 text-MonochromeGray-700 custom-add-button-color"
                            startIcon={<AddIcon />}
                            onClick={() => addNewVat()}
                            disabled={addVatIndex.length >= 4 ? true : false}
                          >
                            {t("label:addItem")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="Invoice Fee Category">
                    <div className="create-user-form-header subtitle3 bg-m-grey-25 text-MonochromeGray-700 tracking-wide flex gap-10 items-center">
                      {t("label:invoiceFeeCategory")}
                      {dirtyFields.fakturaB2B && dirtyFields.fakturaB2C ? (
                        <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                      ) : (
                        <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                      )}
                    </div>
                    <div className="p-10">
                      <div className="px-16">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-20 w-full md:w-3/4 my-32">
                          <Controller
                            name="fakturaB2B"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:fakturaB2b")}
                                type="number"
                                autoComplete="off"
                                error={!!errors.fakturaB2B}
                                helperText={
                                  errors?.fakturaB2B?.message
                                    ? t(
                                        `validation:${errors?.fakturaB2B?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      {t("label:nok")}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                          <Controller
                            name="fakturaB2C"
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:fakturaB2c")}
                                type="number"
                                autoComplete="off"
                                error={!!errors.fakturaB2C}
                                helperText={
                                  errors?.fakturaB2C?.message
                                    ? t(
                                        `validation:${errors?.fakturaB2C?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                required
                                fullWidth
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="start">
                                      {t("label:nok")}
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          {!!info && (
            <ConfirmModal
              open={open}
              setOpen={setOpen}
              header={`${t(
                "label:areYouSureThatYouWouldLikeToDeleteRegistrationMadeBy"
              )} ${info?.primaryContactDetails?.name} (${
                info?.organizationDetails?.id
              })?`}
              subText={t("label:onceConfirmedThisActionCannotBeReverted")}
              uuid={info?.organizationDetails?.uuid}
              refKey="deleteClient"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Onboarding;
