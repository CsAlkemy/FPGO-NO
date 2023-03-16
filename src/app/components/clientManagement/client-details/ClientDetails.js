import { yupResolver } from "@hookform/resolvers/yup";
import { Search, Visibility, VisibilityOff } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  DesktopDatePicker,
  LoadingButton,
  TabContext,
  TabList,
  TabPanel,
} from "@mui/lab";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Hidden,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Tab,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill } from "react-icons/bs";
import PhoneInput from "react-phone-input-2";
import { useNavigate, useParams } from "react-router-dom";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import ConfirmModal from "../../common/confirmmationDialog";
import { defaultValue, validateSchema } from "../utils/helper";
import Orders from "./Orders";
import Timeline from "./Timeline";
import {
  useUpdateClientMutation,
  useUpdateClientStatusMutation,
} from "app/store/api/apiSlice";

const ClientDetails = () => {
  const { t } = useTranslation();
  const [orgTypeList, setOrgTypeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const [dialCode, setDialCode] = React.useState();
  const [hide, setHide] = React.useState(true);
  const [clientType, setClientType] = React.useState(1); // 1 for client, 2 for sub-client
  const [sameAddress, setSameAddress] = React.useState(false);
  const [initialSameAddressRef, setInitialSameAddressRef] = useState(false);
  const [uploadDocuments, setUploadDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const params = useParams();
  const [plan, setPlan] = React.useState(1);
  const navigate = useNavigate();
  const plansPrice = ["200", "350", "500"];
  const sameAddressRef = useRef(null);
  const [info, setInfo] = useState([]);
  const [tabValue, setTabValue] = React.useState("1");
  const [addVatIndex, setAddVatIndex] = React.useState([0, 1, 2, 3, 4]);
  const [ownerRef, setOwnerRef] = React.useState(true);
  const [updateClient] = useUpdateClientMutation();
  const [updateClientStatus] = useUpdateClientStatusMutation();

  const [currency, setCurrency] = React.useState({
    currency: "Norwegian Krone",
    code: "NOK",
  });

  const addNewVat = () => {
    setAddVatIndex([...addVatIndex, addVatIndex.length]);
  };

  const onDelete = (index) => {
    addVatIndex.length > 1
      ? setAddVatIndex(addVatIndex.filter((i) => i !== index))
      : setAddVatIndex([...addVatIndex]);
  };

  // form
  const { control, formState, handleSubmit, reset, setValue, watch } = useForm({
    mode: "onChange",
    defaultValue,
    resolver: yupResolver(validateSchema),
  });
  const billingPhoneNumber = watch("billingPhoneNumber") || "";
  const billingEmail = watch("billingEmail") || "";
  const billingAddress = watch("billingAddress") || "";
  const zip = watch("zip") || "";
  const city = watch("city") || "";
  const country = watch("country") || "";

  const shippingPhoneNumber = watch("shippingPhoneNumber") || "";
  const shippingEmail = watch("shippingEmail") || "";
  const shippingAddress = watch("shippingAddress") || "";
  const shippingZip = watch("shippingZip") || "";
  const shippingCity = watch("shippingCity") || "";
  const shippingCountry = watch("shippingCountry") || "";

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (isLoading) {
      ClientService.clientDetails(params.uuid)
        .then((res) => {
          setInfo(res.data);
          const info = res?.data;
          const planValue = parseInt(
            info?.contractDetails?.planTag?.split(" ")[1]
          );
          if (planValue) {
            if (planValue === 1) {
              setPlan(1)
              // plan1.current.click();
            } else if (planValue === 2) {
              setPlan(2)
              // plan2.current.click();
            } else if (planValue === 3) {
              setPlan(3)
              // plan3.current.click();
            }
          }

          if (
            info?.addresses &&
            info?.addresses["billing"]?.email ===
              info?.addresses["shipping"]?.email &&
            info?.addresses["billing"]?.street ===
              info?.addresses["shipping"]?.street &&
            info?.addresses["billing"]?.zip ===
              info?.addresses["shipping"]?.zip &&
            info?.addresses["billing"]?.city ===
              info?.addresses["shipping"]?.city &&
            info?.addresses["billing"]?.country ===
              info?.addresses["shipping"]?.country
          ) {
            setSameAddress(true);
            setInitialSameAddressRef(true);
          } else {
            setInitialSameAddressRef(false);
            setSameAddress(false);
          }

          defaultValue.id = info?.organizationDetails?.id
            ? info.organizationDetails.id
            : "";
          defaultValue.clientName = info?.organizationDetails?.name
            ? info.organizationDetails.name
            : "";
          defaultValue.organizationType = info?.organizationDetails?.type
            ? info.organizationDetails?.type
            : "";
          defaultValue.fullName = info?.primaryContactDetails?.name
            ? info.primaryContactDetails?.name
            : "";
          defaultValue.primaryPhoneNumber =
            info?.primaryContactDetails?.countryCode &&
            info.primaryContactDetails?.msisdn
              ? info.primaryContactDetails?.countryCode +
                info.primaryContactDetails?.msisdn
              : "";
          defaultValue.designation = info?.primaryContactDetails?.designation
            ? info.primaryContactDetails?.designation
            : "";
          defaultValue.email = info?.primaryContactDetails?.email
            ? info.primaryContactDetails?.email
            : "";
          defaultValue.contactEndDate = info?.contractDetails?.endDate
            ? info.contractDetails.endDate
            : "";
          defaultValue.commision = info?.contractDetails?.commissionRate
            ? info.contractDetails.commissionRate
            : "";
          defaultValue.smsCost = info?.contractDetails?.smsCost
            ? info.contractDetails.smsCost
            : "";
          defaultValue.emailCost = info?.contractDetails?.emailCost
            ? info.contractDetails.emailCost
            : "";
          defaultValue.creditCheckCost = info?.contractDetails?.creditCheckCost
            ? info.contractDetails.creditCheckCost
            : "";
          defaultValue.ehfCost = info?.contractDetails?.ehfCost
            ? info.contractDetails.ehfCost
            : "";
          if (!!info.addresses) {
            defaultValue.billingPhoneNumber =
              info?.addresses["billing"]?.countryCode &&
              info.addresses["billing"].msisdn
                ? info.addresses["billing"].countryCode +
                  info.addresses["billing"].msisdn
                : "";
            defaultValue.billingEmail = info?.addresses["billing"]?.email
              ? info.addresses["billing"].email
              : "";
            defaultValue.billingAddress = info?.addresses["billing"]?.street
              ? info.addresses["billing"].street
              : "";
            defaultValue.zip = info?.addresses["billing"]?.zip
              ? info.addresses["billing"].zip
              : "";
            defaultValue.city = info?.addresses["billing"]?.city
              ? info.addresses["billing"].city
              : "";
            defaultValue.country = info?.addresses["billing"]?.country
              ? info.addresses["billing"].country
              : "";
          }
          if (!!info.addresses && !!info.addresses["shipping"]) {
            defaultValue.shippingPhoneNumber =
              info?.addresses["shipping"]?.countryCode &&
              info?.addresses["shipping"]?.msisdn
                ? info.addresses["shipping"].countryCode +
                  info.addresses["shipping"].msisdn
                : "";
            defaultValue.shippingEmail = info?.addresses["shipping"]?.email
              ? info.addresses["shipping"].email
              : "";
            defaultValue.shippingAddress = info?.addresses["shipping"]?.street
              ? info.addresses["shipping"].street
              : "";
            defaultValue.shippingZip = info?.addresses["shipping"]?.zip
              ? info.addresses["shipping"].zip
              : "";
            defaultValue.shippingCity = info?.addresses["shipping"]?.city
              ? info.addresses["shipping"].city
              : "";
            defaultValue.shippingCountry = info?.addresses["shipping"]?.country
              ? info.addresses["shipping"].country
              : "";
          }
          defaultValue.bankName = info?.bankInformation?.name
            ? info?.bankInformation?.name
            : "";
          defaultValue.accountNumber = info?.bankInformation?.accountNumber
            ? info?.bankInformation?.accountNumber
            : "";
          defaultValue.IBAN = info?.bankInformation?.iban
            ? info?.bankInformation?.iban
            : "";
          defaultValue.SWIFTCode = info?.bankInformation?.swiftCode
            ? info?.bankInformation?.swiftCode
            : "";
          defaultValue.APTICuserName = info?.apticInformation?.username
            ? info?.apticInformation?.username
            : "";
          defaultValue.APTICpassword = info?.apticInformation?.password
            ? info?.apticInformation?.password
            : "";
          defaultValue.name = info?.apticInformation?.name
            ? info?.apticInformation?.name
            : "";
          defaultValue.costLimitforCustomer = info?.apticInformation
            ?.costLimitForCustomer
            ? info?.apticInformation?.costLimitForCustomer
            : "";
          defaultValue.costLimitforOrder = info?.apticInformation
            ?.costLimitForOrder
            ? info?.apticInformation?.costLimitForOrder
            : "";
          defaultValue.invoicewithRegress = info?.apticInformation
            ?.invoiceWithRegress
            ? info?.apticInformation?.invoiceWithRegress
            : "";
          defaultValue.invoicewithoutRegress = info?.apticInformation
            ?.invoiceWithoutRegress
            ? info?.apticInformation?.invoiceWithoutRegress
            : "";
          defaultValue.APTIEngineCuserName = info?.apticInformation
            ?.backOfficeUsername
            ? info?.apticInformation?.backOfficeUsername
            : "";
          defaultValue.APTIEnginePassword = info?.apticInformation
            ?.backOfficePassword
            ? info?.apticInformation?.backOfficePassword
            : "";
          defaultValue.fpReference = info?.apticInformation?.fpReference
            ? info?.apticInformation?.fpReference
            : "";
          defaultValue.creditLimitCustomer = info?.apticInformation?.creditLimit
            ? info?.apticInformation?.creditLimit
            : "";
          defaultValue.fakturaB2B = info?.apticInformation?.b2bInvoiceFee
            ? info?.apticInformation?.b2bInvoiceFee
            : "";
          defaultValue.fakturaB2C = info?.apticInformation?.b2cInvoiceFee
            ? info?.apticInformation?.b2cInvoiceFee
            : "";

          if (
            info?.settings &&
            info?.settings?.vatRates &&
            info?.settings?.vatRates.length >= 2
          ) {
            setAddVatIndex(
              addVatIndex.filter(
                (item, index) => item <= info?.settings?.vatRates.length - 1
              )
            );
          } else {
            setAddVatIndex(addVatIndex.filter((item, index) => item < 1));
          }

          if (info?.settings?.currency && info?.settings?.currency.length) {
            setCurrency({
              code: info?.settings?.currency[0].code,
              currency:
                info?.settings?.currency[0].code === "NOK"
                  ? "Norwegian Krone"
                  : info?.settings?.currency[0].code === "SEK"
                  ? "Swedish Krona"
                  : info?.settings?.currency[0].code === "DKK"
                  ? "Danish Krone"
                  : "European Euro",
            });
          }

          reset({ ...defaultValue });
          if (info?.settings?.vatRates && info?.settings?.vatRates.length) {
            for (let i = 0; i < info?.settings?.vatRates.length; i++) {
              setValue(
                `vat[${i}].vatName`,
                info?.settings?.vatRates[`${i}`].name
              );
              setValue(
                `vat[${i}].vatValue`,
                info?.settings?.vatRates[`${i}`].value
              );
              setValue(
                `vat[${i}].bookKeepingReference`,
                info?.settings?.vatRates[`${i}`].bookKeepingReference
              );
              setValue(
                `vat[${i}].vatActive`,
                info?.settings?.vatRates[`${i}`].status === "Active"
              );
            }
          }
          setIsLoading(false);
        })
        .catch((error) => {
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
          navigate("/clients/clients-list");
          enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        });
    }
    return () => {
      (defaultValue.billingPhoneNumber = "47"),
        (defaultValue.billingEmail = ""),
        (defaultValue.billingAddress = ""),
        (defaultValue.zip = ""),
        (defaultValue.city = ""),
        (defaultValue.country = ""),
        (defaultValue.shippingPhoneNumber = "47"),
        (defaultValue.shippingEmail = ""),
        (defaultValue.shippingAddress = ""),
        (defaultValue.shippingZip = ""),
        (defaultValue.shippingCity = ""),
        (defaultValue.shippingCountry = "");
    };
  }, [isLoading]);

  const handleOnBlurGetDialCode = (value, data, event) => {
    setDialCode(data?.dialCode);
  };

  const handleClickShowPassword = () => {
    setHide(!hide);
  };

  const changeClientStatus = () => {
    updateClientStatus(params.uuid).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(`${params.uuid} Status Changed Successfully`, {
          variant: "success",
          autoHideDuration: 3000,
        });
        navigate("/clients/clients-list");
      } else
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
          autoHideDuration: 3000,
        });
    });
    // ClientService.changeClientStatus(params.uuid)
    //   .then((res) => {
    //     if (res?.status_code === 202) {
    //       enqueueSnackbar(`${params.uuid} Status Changed Successfully`, {
    //         variant: "success",
    //         autoHideDuration: 3000,
    //       });
    //       navigate("/clients/clients-list");
    //     } else
    //       enqueueSnackbar(`somethingWentWrong`, {
    //         variant: "error",
    //         autoHideDuration: 3000,
    //       });
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //   });
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
  // TODO : turn on the flag based on the input field or we can omit that as it got validation

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
          .map((vat, index) => {
            return {
              uuid:
                info?.settings?.vatRates &&
                info?.settings?.vatRates[index]?.uuid
                  ? info?.settings?.vatRates[index]?.uuid
                  : null,
              name: vat.vatName ? vat?.vatName : null,
              value: parseFloat(vat.vatValue),
              isActive: vat?.vatActive ? vat.vatActive : false,
              bookKeepingReference: vat?.bookKeepingReference
                ? vat.bookKeepingReference
                : null,
            };
          })
      : null;

    const clientUpdatedData = {
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
        username: values.APTICuserName,
        password: values.APTICpassword,
        name: values.name,
        fpReference: values.fpReference,
        creditLimit: parseFloat(values.creditLimitCustomer),
        costLimitForCustomer: parseFloat(values.costLimitforCustomer),
        costLimitForOrder: parseFloat(values.costLimitforOrder),
        invoiceWithRegress: parseFloat(values.invoicewithRegress),
        invoiceWithoutRegress: parseFloat(values.invoicewithoutRegress),
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
      clientUpdatedData.addresses[1] = {
        type: "Shipping",
        countryCode: bl_countryCode,
        msisdn: bl_msisdn,
        email: values.billingEmail,
        street: values.billingAddress,
        zip: values.zip,
        city: values.city,
        country: values.country,
      };
    } else {
      clientUpdatedData.addresses[1] = {
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
      clientUpdatedData.contractDetails.planTag = "Plan 1";
      clientUpdatedData.contractDetails.planPrice = parseFloat(plansPrice[0]);
    } else if (plan === 2) {
      clientUpdatedData.contractDetails.planTag = "Plan 2";
      clientUpdatedData.contractDetails.planPrice = parseFloat(plansPrice[1]);
    } else {
      clientUpdatedData.contractDetails.planTag = "Plan 3";
      clientUpdatedData.contractDetails.planPrice = parseFloat(plansPrice[2]);
    }
    setLoading(true);
    updateClient(clientUpdatedData).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(`${params.uuid} Updated Successfully`, {
          variant: "success",
          autoHideDuration: 3000,
        });
        navigate("/clients/clients-list");
        setLoading(false);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
    });
    // ClientService.updateClient(clientUpdatedData, params.uuid)
    //   .then((res) => {
    //     if (res?.status_code === 202) {
    //       enqueueSnackbar(`${params.uuid} Updated Successfully`, {
    //         variant: "success",
    //         autoHideDuration: 3000,
    //       });
    //       navigate("/clients/clients-list");
    //       setLoading(false);
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //     setLoading(false);
    //   });
    // console.log(uploadDocuments);
  };
  // end form

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
        <div className="flex flex-col flex-auto min-w-0 bg-MonochromeGray-25 max-w-screen-xl">
          <div className="flex-auto p-20 sm:p-0 w-full mx-auto bg-white">
            <div className="rounded-sm bg-white p-0 md:px-20">
              <form
                name="loginForm"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className=" header-click-to-action">
                  <div className="header-text header6 flex gap-7">
                    Client Details ({info?.organizationDetails?.uuid})
                    {info?.length !==0 && (
                      <div>
                        {info?.status === "Active" ? (
                          <span className=" ml-5 bg-confirmed rounded-4 px-16 py-4 body3">
                            Active
                          </span>
                        ) : (
                          <span className="bg-rejected ml-5 rounded-4 px-16 py-4 body3">
                            Inactive
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 gap-10 w-full justify-between sm:w-auto mb-5 sm:mb-0">
                    <Button
                      color="secondary"
                      onClick={() => changeClientStatus()}
                      variant="outlined"
                      className="font-semibold rounded-4"
                    >
                      {info.status ==="Inactive"
                        ? t("label:makeActive")
                        : t("label:makeInactive")}
                    </Button>
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      className="rounded-4 button2"
                      aria-label="Confirm"
                      size="large"
                      type="submit"
                      loading={loading}
                      loadingPosition="center"
                      disabled={(!isDirty && sameAddress === initialSameAddressRef)}
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
                          label={ t("label:clientInformation") }
                          className="subtitle3"
                          value="1"
                        />
                        <Tab 
                          label={ t("label:clientTimeline") } 
                          className="subtitle3" 
                          value="2" 
                        />
                        <Tab 
                          label={ t("label:clientOrders") } 
                          className="subtitle3" 
                          value="3" 
                        />
                      </TabList>
                    </Box>
                    <TabPanel value="1" className="py-20 px-10">
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
                                    fullWidth
                                    value={field.value || ""}
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
                                    value={field.value || ""}
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
                                        info.organizationDetails &&
                                        info.organizationDetails?.type
                                          ? info.organizationDetails?.type
                                          : ""
                                      }
                                    >
                                      {orgTypeList.map((item, index) => {
                                        return (
                                          <MenuItem key={index} value={item}>
                                            {item}
                                          </MenuItem>
                                        );
                                      })}
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
                                      value={field.value || ""}
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
                                        ? t(
                                            `validation:${errors?.fullName?.message}`
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
                                    value={field.value || ""}
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
                                        ? t(
                                            `validation:${errors?.email?.message}`
                                          )
                                        : ""
                                    }
                                    variant="outlined"
                                    required
                                    value={field.value || ""}
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
                                render={({
                                  field: { onChange, value, onBlur },
                                }) => (
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
                                        required
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
                                    value={field.value || ""}
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
                                        ? t(
                                            `validation:${errors?.smsCost?.message}`
                                          )
                                        : ""
                                    }
                                    variant="outlined"
                                    required
                                    value={field.value || ""}
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
                                    required
                                    value={field.value || ""}
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
                                    required
                                    fullWidth
                                    value={field.value || ""}
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
                                    helperText={errors?.ehfCost?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    value={field.value || ""}
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
                            {/*<div className="create-user-roles caption2">*/}
                            {/*  {t("label:contractDocument")}*/}
                            {/*</div>*/}
                            {/*<div className="document-preview grid grid-cols-1 sm:grid-cols-3 gap-20 my-20">*/}
                            {/*  {uploadDocuments.map((item, index) => (*/}
                            {/*    <div*/}
                            {/*      key={index}*/}
                            {/*      className="py-16 px-10 border-1 border-MonochromeGray-50 rounded-8 flex justify-between items-center"*/}
                            {/*    >*/}
                            {/*      <div className="flex gap-5">*/}
                            {/*        <BsFileEarmarkMedical className="icon-size-20 text-main" />*/}
                            {/*        {item.name}*/}
                            {/*      </div>*/}
                            {/*      <MdClose className="icon-size-20" />*/}
                            {/*    </div>*/}
                            {/*  ))}*/}
                            {/*</div>*/}
                            {/*<Button*/}
                            {/*  variant="contained"*/}
                            {/*  component="label"*/}
                            {/*  className="rounded-4 font-semibold text-primary-800 bg-primary-25 md:min-w-192 min-w-min"*/}
                            {/*  disabled={uploadDocuments.length >= 3}*/}
                            {/*  startIcon={*/}
                            {/*    <PublishOutlinedIcon className="icon-size-20 mr-5" />*/}
                            {/*  }*/}
                            {/*>*/}
                            {/*  {uploadDocuments?.length > 0*/}
                            {/*    ? t("label:reUploadDocument")*/}
                            {/*    : t("label:uploadFile")}*/}
                            {/*  <input*/}
                            {/*    type="file"*/}
                            {/*    hidden*/}
                            {/*    onChange={(e) => handleFileUpload(e)}*/}
                            {/*  />*/}
                            {/*</Button>*/}
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
                                        {errors?.billingPhoneNumber?.message}
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
                                      defaultValue={
                                        info?.addresses &&
                                        info?.addresses["billing"]?.email
                                          ? info.addresses["billing"].email
                                          : ""
                                      }
                                      error={!!errors.billingEmail}
                                      helperText={errors?.billingEmail?.message}
                                      variant="outlined"
                                      required
                                      value={field.value || ""}
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
                                        value={field.value || ""}
                                        error={!!errors.billingAddress}
                                        helperText={
                                          errors?.billingAddress?.message
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
                                        value={field.value || ""}
                                        error={!!errors.zip}
                                        helperText={errors?.zip?.message}
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.city}
                                      helperText={errors?.city?.message}
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
                                      <InputLabel id="demo-simple-select-label-country">
                                        {t("label:country")}
                                      </InputLabel>
                                      <Select
                                        {...field}
                                        labelId="demo-simple-select-label-country"
                                        id="demo-simple-select-country"
                                        label={t("label:country")}
                                        defaultValue={
                                          info?.addresses &&
                                          info?.addresses["billing"]?.country
                                            ? info.addresses["billing"].country
                                            : ""
                                        }
                                      >
                                        <MenuItem value="norway">
                                          Norway
                                        </MenuItem>
                                        <MenuItem value="denmark">
                                          Denmark
                                        </MenuItem>
                                        <MenuItem value="sweden">
                                          Sweden
                                        </MenuItem>
                                      </Select>
                                      <FormHelperText>
                                        {errors?.country?.message}
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
                            <div className="flex flex-col sm:flex-row justify-start sm:justify-between items-start sm:items-center">
                              <div className="billing-address-head">
                                {t("label:shippingAddress")}
                                {(shippingPhoneNumber &&
                                  shippingEmail &&
                                  shippingAddress &&
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
                                  className="font-bold"
                                  control={
                                    <Switch
                                      onChange={() =>
                                        setSameAddress(!sameAddress)
                                      }
                                      name="jason"
                                      color="secondary"
                                      ref={sameAddressRef}
                                      checked={sameAddress}
                                    />
                                  }
                                  label={t("label:sameAsBillingAddress")}
                                  labelPlacement="start"
                                  disabled={
                                    !billingPhoneNumber ||
                                    !billingEmail ||
                                    !billingAddress ||
                                    !zip ||
                                    !city ||
                                    !country
                                  }
                                />
                              </div>
                            </div>
                            {!sameAddress &&
                              ((billingPhoneNumber &&
                                billingEmail &&
                                billingAddress &&
                                zip &&
                                city &&
                                country) ||
                                shippingPhoneNumber ||
                                shippingEmail ||
                                shippingAddress ||
                                shippingZip ||
                                shippingCity ||
                                shippingCountry ||
                                !info.addresses) && (
                                <div className="px-16">
                                  <div className="form-pair-input gap-x-20">
                                    <Controller
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
                                            autocompleteSearch
                                            countryCodeEditable={false}
                                            specialLabel={t("label:phone")}
                                            onBlur={handleOnBlurGetDialCode}
                                          />
                                          <FormHelperText>
                                            {
                                              errors?.shippingPhoneNumber
                                                ?.message
                                            }
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
                                          value={field.value || ""}
                                          autoComplete="off"
                                          error={!!errors.shippingEmail}
                                          helperText={
                                            errors?.shippingEmail?.message
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
                                            value={field.value || ""}
                                            error={!!errors.shippingAddress}
                                            helperText={
                                              errors?.shippingAddress?.message
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
                                            value={field.value || ""}
                                            error={!!errors.shippingZip}
                                            helperText={
                                              errors?.shippingZip?.message
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
                                          value={field.value || ""}
                                          error={!!errors.shippingCity}
                                          helperText={
                                            errors?.shippingCity?.message
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
                                          <InputLabel id="demo-simple-select-label-shippingCountry">
                                            {t("label:country")}
                                          </InputLabel>
                                          <Select
                                            {...field}
                                            labelId="demo-simple-select-label-shippingCountry"
                                            id="demo-simple-select"
                                            label={t("label:country")}
                                            defaultValue={
                                              info?.addresses &&
                                              info?.addresses["shipping"]
                                                ?.country
                                                ? info.addresses["shipping"]
                                                    .country
                                                : ""
                                            }
                                          >
                                            <MenuItem value="" />
                                            <MenuItem value="norway">
                                              Norway
                                            </MenuItem>
                                            <MenuItem value="denmark">
                                              Denmark
                                            </MenuItem>
                                            <MenuItem value="sweden">
                                              Sweden
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
                                      helperText={errors?.bankName?.message}
                                      variant="outlined"
                                      required
                                      value={field.value || ""}
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.accountNumber}
                                      helperText={
                                        errors?.accountNumber?.message
                                      }
                                      variant="outlined"
                                      required
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.IBAN}
                                      helperText={errors?.IBAN?.message}
                                      variant="outlined"
                                      required
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.SWIFTCode}
                                      helperText={errors?.SWIFTCode?.message}
                                      variant="outlined"
                                      required
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.APTICuserName}
                                      helperText={
                                        errors?.APTICuserName?.message
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
                                      value={field.value || ""}
                                      error={!!errors.APTICpassword}
                                      helperText={
                                        errors?.APTICpassword?.message
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
                                      value={field.value || ""}
                                      error={!!errors.name}
                                      helperText={errors?.name?.message}
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
                                      value={field.value || ""}
                                      error={!!errors.fpReference}
                                      helperText={errors?.fpReference?.message}
                                      variant="outlined"
                                      required
                                      fullWidth
                                    />
                                  )}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-20 gap-y-40 my-40 w-full md:w-3/4">
                                <Controller
                                  name="creditLimitCustomer"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:creditLimitForClient")}
                                      type="number"
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.creditLimitCustomer}
                                      helperText={
                                        errors?.creditLimitCustomer?.message
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.costLimitforCustomer}
                                      helperText={
                                        errors?.costLimitforCustomer?.message
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
                                      value={field.value || ""}
                                      error={!!errors.costLimitforOrder}
                                      helperText={
                                        errors?.costLimitforOrder?.message
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
                                      value={field.value || ""}
                                      error={!!errors.nvoicewithRegress}
                                      helperText={
                                        errors?.nvoicewithRegress?.message
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
                                      value={field.value || ""}
                                      error={!!errors.invoicewithoutRegress}
                                      helperText={
                                        errors?.invoicewithoutRegress?.message
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.APTIEngineCuserName}
                                      helperText={
                                        errors?.APTIEngineCuserName?.message
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
                                      value={field.value || ""}
                                      error={!!errors.APTIEnginePassword}
                                      helperText={
                                        errors?.APTIEnginePassword?.message
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
                            {defaultValue.vat.length > 0 ? (
                              //TODO: i am not sure how to active the check icon here.
                              <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                            ) : (
                              <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                            )}
                          </div>
                          <div className="p-10">
                            {/*<Hidden mdUp>*/}
                            {/*  <div className="px-16 shadow-md rounded-md">*/}
                            {/*    {addVatIndex.map((index) => (*/}
                            {/*      <div*/}
                            {/*        key={index}*/}
                            {/*        className="subtitle3 w-full md:w-3/4 mt-20"*/}
                            {/*      >*/}
                            {/*        <div className="grid grid-cols-1 sm:grid-cols-2 gap-20">*/}
                            {/*          <Controller*/}
                            {/*            name={`vat[${index}].vatName`}*/}
                            {/*            control={control}*/}
                            {/*            render={({ field }) => (*/}
                            {/*              <TextField*/}
                            {/*                {...field}*/}
                            {/*                type="text"*/}
                            {/*                value={field.value || ""}*/}
                            {/*                autoComplete="off"*/}
                            {/*                placeholder={t("label:name")}*/}
                            {/*                className="bg-white"*/}
                            {/*                error={!!errors.vatName}*/}
                            {/*                helperText={*/}
                            {/*                  errors?.vatName?.message*/}
                            {/*                }*/}
                            {/*                variant="outlined"*/}
                            {/*                required*/}
                            {/*                fullWidth*/}
                            {/*              />*/}
                            {/*            )}*/}
                            {/*          />*/}
                            {/*          <Controller*/}
                            {/*            name={`vat[${index}].vatValue`}*/}
                            {/*            control={control}*/}
                            {/*            render={({ field }) => (*/}
                            {/*              <TextField*/}
                            {/*                {...field}*/}
                            {/*                type="number"*/}
                            {/*                value={field.value || ""}*/}
                            {/*                className=""*/}
                            {/*                autoComplete="off"*/}
                            {/*                error={!!errors.vatValue}*/}
                            {/*                helperText={*/}
                            {/*                  errors?.vatValue?.message*/}
                            {/*                }*/}
                            {/*                variant="outlined"*/}
                            {/*                placeholder={t(*/}
                            {/*                  "label:valuePercentage"*/}
                            {/*                )}*/}
                            {/*                required*/}
                            {/*                fullWidth*/}
                            {/*              />*/}
                            {/*            )}*/}
                            {/*          />*/}
                            {/*        </div>*/}

                            {/*        <div className="my-20">*/}
                            {/*          <Controller*/}
                            {/*            name={`vat[${index}].bookKeepingReference`}*/}
                            {/*            control={control}*/}
                            {/*            render={({ field }) => (*/}
                            {/*              <TextField*/}
                            {/*                {...field}*/}
                            {/*                type="text"*/}
                            {/*                value={field.value || ""}*/}
                            {/*                className="bg-white"*/}
                            {/*                autoComplete="off"*/}
                            {/*                placeholder={t(*/}
                            {/*                  "label:bookKeepingReference"*/}
                            {/*                )}*/}
                            {/*                error={*/}
                            {/*                  !!errors?.vat?.[index]*/}
                            {/*                    ?.bookKeepingReference*/}
                            {/*                }*/}
                            {/*                helperText={*/}
                            {/*                  errors?.bookKeepingReference*/}
                            {/*                    ?.message*/}
                            {/*                }*/}
                            {/*                variant="outlined"*/}
                            {/*                required*/}
                            {/*                fullWidth*/}
                            {/*              />*/}
                            {/*            )}*/}
                            {/*          />*/}
                            {/*        </div>*/}
                            {/*        <div className="mt-20 mb-10">*/}
                            {/*          <Controller*/}
                            {/*            name={`vat[${index}].vatActive`}*/}
                            {/*            type="checkbox"*/}
                            {/*            control={control}*/}
                            {/*            render={({*/}
                            {/*              field: {*/}
                            {/*                onChange,*/}
                            {/*                value,*/}
                            {/*                ref,*/}
                            {/*                onBlur,*/}
                            {/*              },*/}
                            {/*            }) => (*/}
                            {/*              <FormControl*/}
                            {/*                required*/}
                            {/*                error={!!errors.Switch}*/}
                            {/*                label={t("label:status")}*/}
                            {/*              >*/}
                            {/*                <Switch*/}
                            {/*                  color="secondary"*/}
                            {/*                  checked={value}*/}
                            {/*                  onBlur={onBlur}*/}
                            {/*                  onChange={(ev) =>*/}
                            {/*                    onChange(ev.target.checked)*/}
                            {/*                  }*/}
                            {/*                  inputRef={ref}*/}
                            {/*                  required*/}
                            {/*                />*/}
                            {/*                <FormHelperText>*/}
                            {/*                  {errors?.Switch?.message}*/}
                            {/*                </FormHelperText>*/}
                            {/*              </FormControl>*/}
                            {/*            )}*/}
                            {/*          />*/}
                            {/*        </div>*/}
                            {/*      </div>*/}
                            {/*    ))}*/}
                            {/*    <Button*/}
                            {/*      className="my-10 px-10 rounded-4 button2 text-MonochromeGray-700 custom-add-button-color"*/}
                            {/*      startIcon={<AddIcon />}*/}
                            {/*      onClick={() => addNewVat()}*/}
                            {/*      disabled={*/}
                            {/*        addVatIndex.length >= 4 ? true : false*/}
                            {/*      }*/}
                            {/*    >*/}
                            {/*      {t("label:addItem")}*/}
                            {/*    </Button>*/}
                            {/*  </div>*/}
                            {/*</Hidden>*/}
                            <div className="px-16">
                              <div className="product-list">
                                <div className="my-10 grid grid-cols-12 product-list-grid-container-height bg-primary-25 mb-10 subtitle3 gap-10 px-10 w-full md:w-3/4">
                                  <div className="my-auto text-MonochromeGray-500 col-span-4">
                                    {t("label:name")}
                                  </div>
                                  <div className="my-auto text-right text-MonochromeGray-500 col-span-3">
                                    {"Value (%)"}
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
                                            {...field}
                                            type="text"
                                            value={field.value || ""}
                                            autoComplete="off"
                                            className="bg-white custom-input-height"
                                            error={!!errors.vatName}
                                            helperText={
                                              errors?.vatName?.message
                                            }
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
                                            type="number"
                                            value={
                                              field.value === 0
                                                ? 0
                                                : field.value || ""
                                            }
                                            className="text-right  custom-input-height"
                                            autoComplete="off"
                                            error={!!errors.vatValue}
                                            helperText={
                                              errors?.vatValue?.message
                                            }
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
                                            value={field.value || ""}
                                            className="bg-white custom-input-height"
                                            autoComplete="off"
                                            error={
                                              !!errors?.vat?.[index]
                                                ?.bookKeepingReference
                                            }
                                            helperText={
                                              errors?.bookKeepingReference
                                                ?.message
                                            }
                                            variant="outlined"
                                            required
                                            fullWidth
                                          />
                                        )}
                                      />
                                    </div>
                                    <div className="my-auto col-span-1 text-right">
                                      <Controller
                                        name={`vat[${index}].vatActive`}
                                        type="checkbox"
                                        control={control}
                                        render={({
                                          field: {
                                            onChange,
                                            value,
                                            ref,
                                            onBlur,
                                          },
                                        }) => (
                                          <FormControl
                                            required
                                            error={!!errors.Switch}
                                          >
                                            <Switch
                                              color="secondary"
                                              checked={value}
                                              onBlur={onBlur}
                                              onChange={(ev) =>
                                                onChange(ev.target.checked)
                                              }
                                              inputRef={ref}
                                              required
                                            />
                                            <FormHelperText>
                                              {errors?.Switch?.message}
                                            </FormHelperText>
                                          </FormControl>
                                        )}
                                      />
                                    </div>
                                  </div>
                                ))}
                                <Button
                                  className="mt-10 px-10 rounded-4 button2 text-MonochromeGray-700 custom-add-button-color"
                                  startIcon={<AddIcon />}
                                  onClick={() => addNewVat()}
                                  disabled={
                                    addVatIndex.length >= 4 ? true : false
                                  }
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
                            {dirtyFields.fakturaB2B &&
                            dirtyFields.fakturaB2C ? (
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
                                      value={field.value || ""}
                                      error={!!errors.fakturaB2B}
                                      helperText={errors?.fakturaB2B?.message}
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
                                      helperText={errors?.fakturaB2C?.message}
                                      variant="outlined"
                                      required
                                      fullWidth
                                      value={field.value || ""}
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
                    </TabPanel>
                    <TabPanel value="2" className="py-20 px-10">
                      <Timeline />
                    </TabPanel>
                    <TabPanel value="3" className="py-20 px-10">
                      <Orders />
                    </TabPanel>
                  </TabContext>
                </div>
              </form>
            </div>
          </div>
          {!!info && (
            <ConfirmModal
              open={open}
              setOpen={setOpen}
              header={`${t(
                "label:areYouSureThatYouWouldLikeToDeleteRegistrationMadeBy "
              )} ${info?.primaryContactDetails?.name} (${
                info?.organizationDetails?.id
              })?`}
              subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
              uuid={info?.organizationDetails?.uuid}
              // refKey='inactiveClient'
              refKey="deleteClient"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ClientDetails;
