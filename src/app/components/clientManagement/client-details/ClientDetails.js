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
import { useNavigate, useParams } from "react-router-dom";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import ConfirmModal from "../../common/confirmmationDialog";
import {
  defaultValue,
  validateSchema,
  validateSchemaAdministration,
  validateSchemaCreateClient,
  validateSchemaCreateClientAdministration,
} from "../utils/helper";
import Orders from "./Orders";
import Timeline from "./Timeline";
import {
  useUpdateClientMutation,
  useUpdateClientStatusMutation,
} from "app/store/api/apiSlice";
import FrontPaymentPhoneInput from "../../common/frontPaymentPhoneInput";
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
  const [initialIsPurchasable, setInitialIsPurchasable] = useState("purchase");
  const [initialCurrency, setInitialCurrency] = useState({
    currency: "Norwegian Krone",
    code: "NOK",
  });
  const [uploadDocuments, setUploadDocuments] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const sameAddressRef = useRef(null);
  const [info, setInfo] = useState([]);
  const [tabValue, setTabValue] = React.useState("1");
  const [addVatIndex, setAddVatIndex] = React.useState([0, 1, 2, 3, 4]);
  const [ownerRef, setOwnerRef] = React.useState(true);
  const [recheckSchema, setRecheckSchema] = React.useState(false);
  const [updateClient] = useUpdateClientMutation();
  const [updateClientStatus] = useUpdateClientStatusMutation();
  const [customApticInfoData, setCustomApticInfoData] = useState("purchase");
  const [dialCodePrimary, setDialCodePrimary] = useState();
  const [dialCodeBilling, setDialCodeBilling] = useState();
  const [dialCodeShipping, setDialCodeShipping] = useState();
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

  let schema =
    customApticInfoData === "purchase"
      ? validateSchema
      : validateSchemaAdministration;
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
    trigger,
  } = useForm({
    mode: "onChange",
    defaultValue,
    resolver: yupResolver(schema),
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
          if (info?.apticInformation?.isPurchasable)
            setCustomApticInfoData("purchase");
          else setCustomApticInfoData("administration");

          setInitialIsPurchasable(
            info?.apticInformation?.isPurchasable
              ? "purchase"
              : "administration"
          );

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
          defaultValue.partnerName = info?.organizationDetails?.partnerName
            ? info.organizationDetails.partnerName
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
          setDialCodePrimary(info.primaryContactDetails?.countryCode);
          setValue(
            "primaryPhoneNumber",
            info.primaryContactDetails?.countryCode +
              info.primaryContactDetails?.msisdn || null
          );
          defaultValue.designation = info?.primaryContactDetails?.designation
            ? info.primaryContactDetails?.designation
            : "";
          defaultValue.email = info?.primaryContactDetails?.email
            ? info.primaryContactDetails?.email
            : "";
          defaultValue.contactStartDate = info?.contractDetails?.startDate
            ? info.contractDetails.startDate
            : "";
          defaultValue.planPrice = info?.contractDetails?.planPrice
            ? info.contractDetails.planPrice
            : "";
          defaultValue.commision =
            info?.contractDetails?.commissionRate === 0
              ? 0
              : info?.contractDetails?.commissionRate
              ? info.contractDetails.commissionRate
              : "";
          defaultValue.smsCost =
            info?.contractDetails?.smsCost === 0
              ? 0
              : info?.contractDetails?.smsCost
              ? info.contractDetails.smsCost
              : "";
          defaultValue.emailCost =
            info?.contractDetails?.emailCost === 0
              ? 0
              : info?.contractDetails?.emailCost
              ? info.contractDetails.emailCost
              : "";
          defaultValue.creditCheckCost =
            info?.contractDetails?.creditCheckCost === 0
              ? 0
              : info?.contractDetails?.creditCheckCost
              ? info.contractDetails.creditCheckCost
              : "";
          defaultValue.ehfCost =
            info?.contractDetails?.ehfCost === 0
              ? 0
              : info?.contractDetails?.ehfCost
              ? info.contractDetails.ehfCost
              : "";
          if (!!info.addresses) {
            defaultValue.billingPhoneNumber =
              info?.addresses["billing"]?.countryCode &&
              info.addresses["billing"].msisdn
                ? info.addresses["billing"].countryCode +
                  info.addresses["billing"].msisdn
                : "";
            setDialCodeBilling(info.addresses["billing"].countryCode);
            setValue(
              "billingPhoneNumber",
              info.addresses["billing"].countryCode +
                info.addresses["billing"].msisdn || null
            );
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
            setDialCodeShipping(info.addresses["shipping"].countryCode);
            setValue(
              "shippingPhoneNumber",
              info.addresses["shipping"].countryCode +
                info.addresses["shipping"].msisdn || null
            );
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
          defaultValue.bankAccountCode = info?.bankInformation?.accountCode
            ? info?.bankInformation?.accountCode
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
          defaultValue.accountCode = info?.apticInformation?.accountCode
            ? info?.apticInformation?.accountCode
            : "";
          defaultValue.refundReference = info?.apticInformation?.refundReference
            ? info?.apticInformation?.refundReference
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
          defaultValue.b2bAccountCode = info?.apticInformation?.b2bAccountCode
            ? info?.apticInformation?.b2bAccountCode
            : "";
          defaultValue.b2cAccountCode = info?.apticInformation?.b2cAccountCode
            ? info?.apticInformation?.b2cAccountCode
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

          if (info?.settings?.currencies && info?.settings?.currencies.length) {
            setCurrency({
              code: info?.settings?.currencies[0].code || "NOK",
              currency:
                info?.settings?.currencies[0].code === "NOK"
                  ? "Norwegian Krone"
                  : info?.settings?.currencies[0].code === "SEK"
                  ? "Swedish Krona"
                  : info?.settings?.currencies[0].code === "DKK"
                  ? "Danish Krone"
                  : info?.settings?.currencies[0].code === "EUR"
                  ? "European Euro"
                  : "Norwegian Krone",
            });
            setInitialCurrency({
              code: info?.settings?.currencies[0].code || "NOK",
              currency:
                info?.settings?.currencies[0].code === "NOK"
                  ? "Norwegian Krone"
                  : info?.settings?.currencies[0].code === "SEK"
                  ? "Swedish Krona"
                  : info?.settings?.currencies[0].code === "DKK"
                  ? "Danish Krone"
                  : info?.settings?.currencies[0].code === "EUR"
                  ? "European Euro"
                  : "Norwegian Krone",
            });
          }

          reset({ ...defaultValue });
          if (info?.settings?.vatRates && info?.settings?.vatRates.length) {
            for (let i = 0; i < info?.settings?.vatRates.length; i++) {
              setValue(
                `vat[${i}].vatCode`,
                info?.settings?.vatRates[`${i}`].vatCode
              );
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

  useEffect(() => {
    if (!!info) {
      if (!!info.addresses) {
        defaultValue.country = info?.addresses["billing"]?.country
          ? info.addresses["billing"].country
          : "";
      }
      reset({ ...defaultValue });
      if (info?.settings?.vatRates && info?.settings?.vatRates.length) {
        for (let i = 0; i < info?.settings?.vatRates.length; i++) {
          setValue(
            `vat[${i}].vatCode`,
            info?.settings?.vatRates[`${i}`].vatCode
          );
          setValue(`vat[${i}].vatName`, info?.settings?.vatRates[`${i}`].name);
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
    }
  }, [info]);

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
    const msisdn = values?.primaryPhoneNumber
      ? values?.primaryPhoneNumber.slice(dialCodePrimary?.length)
      : null;
    const countryCode = dialCodePrimary ? dialCodePrimary : null;
    const bl_msisdn = values?.billingPhoneNumber
      ? values?.billingPhoneNumber.slice(dialCodeBilling?.length)
      : null;
    const bl_countryCode = dialCodeBilling ? dialCodeBilling : null;
    const sh_msisdn = values?.shippingPhoneNumber
      ? values?.shippingPhoneNumber.slice(dialCodeShipping?.length)
      : null;
    const sh_countryCode = dialCodeShipping ? dialCodeShipping : null;

    const vatRates = values.vat.length
      ? values.vat
          .filter((v) => v.vatValue >= 0)
          .map((vat, index) => {
            return {
              uuid:
                info?.settings?.vatRates &&
                info?.settings?.vatRates[index]?.uuid
                  ? info?.settings?.vatRates[index]?.uuid
                  : null,
              vatCode: vat?.vatCode || null,
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
        partnerName: values?.partnerName ? values.partnerName : null,
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
        startDate: ClientService.prepareDate(values.contactStartDate),
        endDate: ClientService.prepareDate(new Date()),
        planPrice: parseFloat(values.planPrice),
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
        accountCode: values?.bankAccountCode || null,
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
        accountCode: values?.accountCode || null,
        refundReference: values?.refundReference || null,
        backOfficeUsername: values.APTIEngineCuserName,
        backOfficePassword: values.APTIEnginePassword,
        b2bInvoiceFee: parseFloat(values.fakturaB2B),
        b2cInvoiceFee: parseFloat(values.fakturaB2C),
        b2bAccountCode: values.b2bAccountCode,
        b2cAccountCode: values.b2cAccountCode,
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
    setLoading(true);
    updateClient(clientUpdatedData).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(`${params.uuid} Updated Successfully`, {
          variant: "success",
          autoHideDuration: 3000,
        });
        navigate("/clients/clients-list");
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
          autoHideDuration: 3000,
        });
      }
      setLoading(false);
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
                    {info?.length !== 0 && (
                      <div>
                        {info?.status === "Active" ? (
                          <span className=" ml-5 bg-confirmed rounded-4 px-16 py-4 body3">
                            {t("label:active")}
                          </span>
                        ) : (
                          <span className="bg-rejected ml-5 rounded-4 px-16 py-4 body3">
                            {t("label:inactive")}
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
                      {info.status === "Inactive"
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
                      disabled={
                        (!isDirty &&
                          sameAddress === initialSameAddressRef &&
                          initialIsPurchasable === customApticInfoData &&
                          initialCurrency.code === currency.code) ||
                        !isValid
                      }
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
                          label={t("label:clientInformation")}
                          className="subtitle3"
                          value="1"
                        />
                        <Tab
                          label={t("label:clientTimeline")}
                          className="subtitle3"
                          value="2"
                        />
                        <Tab
                          label={t("label:clientOrders")}
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
                                    onWheel={(event) => {
                                      event.target.blur();
                                    }}
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
                              <Controller
                                name="partnerName"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label={t("label:partnerName")}
                                    type="text"
                                    autoComplete="off"
                                    error={!!errors.partnerName}
                                    helperText={
                                      errors?.partnerName?.message
                                        ? t(
                                            `validation:${errors?.partnerName?.message}`
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
                              <FrontPaymentPhoneInput
                                control={control}
                                defaultValue="no"
                                disable={false}
                                error={errors.primaryPhoneNumber}
                                label="phone"
                                name="primaryPhoneNumber"
                                required={true}
                                trigger={trigger}
                                setValue={setValue}
                                setDialCode={setDialCodePrimary}
                              />
                              {/*<Controller*/}
                              {/*  name="primaryPhoneNumber"*/}
                              {/*  control={control}*/}
                              {/*  render={({ field }) => (*/}
                              {/*    <FormControl*/}
                              {/*      error={!!errors.primaryPhoneNumber}*/}
                              {/*      required*/}
                              {/*      fullWidth*/}
                              {/*    >*/}
                              {/*      <PhoneInput*/}
                              {/*        {...field}*/}
                              {/*        className={*/}
                              {/*          errors.primaryPhoneNumber*/}
                              {/*            ? "input-phone-number-field border-1 rounded-md border-red-300"*/}
                              {/*            : "input-phone-number-field"*/}
                              {/*        }*/}
                              {/*        country="no"*/}
                              {/*        enableSearch*/}
                              {/*        autocompleteSearch*/}
                              {/*        countryCodeEditable={false}*/}
                              {/*        specialLabel={`${t("label:phone")}*`}*/}
                              {/*        onBlur={handleOnBlurGetDialCode}*/}
                              {/*      />*/}
                              {/*      <FormHelperText>*/}
                              {/*        {errors?.primaryPhoneNumber?.message*/}
                              {/*          ? t(*/}
                              {/*              `validation:${errors?.primaryPhoneNumber?.message}`*/}
                              {/*            )*/}
                              {/*          : ""}*/}
                              {/*      </FormHelperText>*/}
                              {/*    </FormControl>*/}
                              {/*  )}*/}
                              {/*/>*/}
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
                            {dirtyFields.planPrice &&
                            dirtyFields.commision &&
                            dirtyFields.smsCost ? (
                              <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                            ) : (
                              <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                            )}
                          </div>
                          <div className="px-16">
                            <div className="contract-details-container w-full sm:w-11/12">
                              <Controller
                                name="contactStartDate"
                                control={control}
                                render={({
                                  field: { onChange, value, onBlur },
                                }) => (
                                  <DesktopDatePicker
                                    label={t("label:contractStartDate")}
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
                                        error={!!errors.contactStartDate}
                                        helperText={
                                          errors?.contactStartDate?.message
                                            ? t(
                                                `validation:${errors?.contactStartDate?.message}`
                                              )
                                            : ""
                                        }
                                      />
                                    )}
                                  />
                                )}
                              />
                              <Controller
                                name="planPrice"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label={t("label:monthlyPlanFee")}
                                    type="text"
                                    required
                                    autoComplete="off"
                                    error={!!errors.planPrice}
                                    helperText={
                                      errors?.planPrice?.message
                                        ? t(
                                            `validation:${errors?.planPrice?.message}`
                                          )
                                        : ""
                                    }
                                    variant="outlined"
                                    value={
                                      field.value === 0 ? 0 : field.value || ""
                                    }
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
                                name="commision"
                                control={control}
                                render={({ field }) => (
                                  <TextField
                                    {...field}
                                    label={t("label:commissionRate")}
                                    type="text"
                                    autoComplete="off"
                                    required
                                    error={!!errors.commision}
                                    helperText={
                                      errors?.commision?.message
                                        ? t(
                                            `validation:${errors?.commision?.message}`
                                          )
                                        : ""
                                    }
                                    variant="outlined"
                                    value={
                                      field.value === 0 ? 0 : field.value || ""
                                    }
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
                                    required
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
                                    value={
                                      field.value === 0 ? 0 : field.value || ""
                                    }
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
                                    value={
                                      field.value === 0 ? 0 : field.value || ""
                                    }
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
                                    value={
                                      field.value === 0 ? 0 : field.value || ""
                                    }
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
                                        ? t(
                                            `validation:${errors?.ehfCost?.message}`
                                          )
                                        : ""
                                    }
                                    variant="outlined"
                                    fullWidth
                                    value={
                                      field.value === 0 ? 0 : field.value || ""
                                    }
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
                                <FrontPaymentPhoneInput
                                  control={control}
                                  defaultValue="no"
                                  disable={false}
                                  error={errors.billingPhoneNumber}
                                  label="phone"
                                  name="billingPhoneNumber"
                                  required={true}
                                  trigger={trigger}
                                  setValue={setValue}
                                  setDialCode={setDialCodeBilling}
                                />
                                {/*<Controller*/}
                                {/*  name="billingPhoneNumber"*/}
                                {/*  control={control}*/}
                                {/*  render={({ field }) => (*/}
                                {/*    <FormControl*/}
                                {/*      error={!!errors.billingPhoneNumber}*/}
                                {/*      required*/}
                                {/*      fullWidth*/}
                                {/*    >*/}
                                {/*      <PhoneInput*/}
                                {/*        {...field}*/}
                                {/*        className={*/}
                                {/*          errors.billingPhoneNumber*/}
                                {/*            ? "input-phone-number-field border-1 rounded-md border-red-300"*/}
                                {/*            : "input-phone-number-field"*/}
                                {/*        }*/}
                                {/*        country="no"*/}
                                {/*        enableSearch*/}
                                {/*        autocompleteSearch*/}
                                {/*        countryCodeEditable={false}*/}
                                {/*        specialLabel={`${t("label:phone")}*`}*/}
                                {/*        onBlur={handleOnBlurGetDialCode}*/}
                                {/*      />*/}
                                {/*      <FormHelperText>*/}
                                {/*        {errors?.billingPhoneNumber?.message*/}
                                {/*          ? t(*/}
                                {/*              `validation:${errors?.billingPhoneNumber?.message}`*/}
                                {/*            )*/}
                                {/*          : ""}*/}
                                {/*      </FormHelperText>*/}
                                {/*    </FormControl>*/}
                                {/*  )}*/}
                                {/*/>*/}
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
                                      helperText={
                                        errors?.billingEmail?.message
                                          ? t(
                                              `validation:${errors?.billingEmail?.message}`
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
                                        onWheel={(event) => {
                                          event.target.blur();
                                        }}
                                        autoComplete="off"
                                        value={field.value || ""}
                                        error={!!errors.zip}
                                        helperText={
                                          errors?.zip?.message
                                            ? t(
                                                `validation:${errors?.zip?.message}`
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
                                      helperText={
                                        errors?.city?.message
                                          ? t(
                                              `validation:${errors?.city?.message}`
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
                                    <FrontPaymentPhoneInput
                                      control={control}
                                      defaultValue="no"
                                      disable={false}
                                      error={errors.shippingPhoneNumber}
                                      label="phone"
                                      name="shippingPhoneNumber"
                                      required={false}
                                      trigger={trigger}
                                      setValue={setValue}
                                      setDialCode={setDialCodeShipping}
                                    />
                                    {/*<Controller*/}
                                    {/*  name="shippingPhoneNumber"*/}
                                    {/*  control={control}*/}
                                    {/*  render={({ field }) => (*/}
                                    {/*    <FormControl*/}
                                    {/*      error={!!errors.shippingPhoneNumber}*/}
                                    {/*      // required*/}
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
                                    {/*        autocompleteSearch*/}
                                    {/*        countryCodeEditable={false}*/}
                                    {/*        specialLabel={t("label:phone")}*/}
                                    {/*        onBlur={handleOnBlurGetDialCode}*/}
                                    {/*      />*/}
                                    {/*      <FormHelperText>*/}
                                    {/*        {errors?.shippingPhoneNumber*/}
                                    {/*          ?.message*/}
                                    {/*          ? t(*/}
                                    {/*              `validation:${errors?.shippingPhoneNumber?.message}`*/}
                                    {/*            )*/}
                                    {/*          : ""}*/}
                                    {/*      </FormHelperText>*/}
                                    {/*    </FormControl>*/}
                                    {/*  )}*/}
                                    {/*/>*/}
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
                                            value={field.value || ""}
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
                                            onWheel={(event) => {
                                              event.target.blur();
                                            }}
                                            autoComplete="off"
                                            value={field.value || ""}
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
                                          value={field.value || ""}
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
                                      value={field.value || ""}
                                      autoComplete="off"
                                      error={!!errors.IBAN}
                                      helperText={
                                        errors?.IBAN?.message
                                          ? t(
                                              `validation:${errors?.IBAN?.message}`
                                            )
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
                                      value={field.value || ""}
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
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-20 gap-y-40 w-full">
                                <Controller
                                  name="bankAccountCode"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:accountCode")}
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.bankAccountCode}
                                      helperText={
                                        errors?.bankAccountCode?.message
                                          ? t(
                                              `validation:${errors?.bankAccountCode?.message}`
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
                                  // disabled
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
                                  // disabled
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
                                      value={field.value || ""}
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
                                      value={field.value || ""}
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
                                      value={field.value || ""}
                                      error={!!errors.name}
                                      helperText={
                                        errors?.name?.message
                                          ? t(
                                              `validation:${errors?.name?.message}`
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
                              {customApticInfoData === "administration" && (
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-20 gap-y-40 w-full">
                                  <Controller
                                    name="accountCode"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:accountCode")}
                                        type="text"
                                        autoComplete="off"
                                        error={!!errors.accountCode}
                                        helperText={
                                          errors?.accountCode?.message
                                            ? t(
                                                `validation:${errors?.accountCode?.message}`
                                              )
                                            : ""
                                        }
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                  <Controller
                                    name="refundReference"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:refundReference")}
                                        type="text"
                                        autoComplete="off"
                                        error={!!errors.refundReference}
                                        helperText={
                                          errors?.refundReference?.message
                                            ? t(
                                                `validation:${errors?.refundReference?.message}`
                                              )
                                            : ""
                                        }
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                </div>
                              )}
                              {customApticInfoData === "purchase" && (
                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-x-20 gap-y-32 w-full md:w-3/4">
                                  <Controller
                                    name="accountCode"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:accountCode")}
                                        type="text"
                                        autoComplete="off"
                                        error={!!errors.accountCode}
                                        helperText={
                                          errors?.accountCode?.message
                                            ? t(
                                                `validation:${errors?.accountCode?.message}`
                                              )
                                            : ""
                                        }
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                  <Controller
                                    name="creditLimitCustomer"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:creditLimitForClient")}
                                        type="number"
                                        onWheel={(event) => {
                                          event.target.blur();
                                        }}
                                        value={field.value || ""}
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
                                        onWheel={(event) => {
                                          event.target.blur();
                                        }}
                                        value={field.value || ""}
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
                                        onWheel={(event) => {
                                          event.target.blur();
                                        }}
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
                                        onWheel={(event) => {
                                          event.target.blur();
                                        }}
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
                                        onWheel={(event) => {
                                          event.target.blur();
                                        }}
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
                                  <Controller
                                    name="refundReference"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:refundReference")}
                                        type="text"
                                        autoComplete="off"
                                        error={!!errors.refundReference}
                                        helperText={
                                          errors?.refundReference?.message
                                            ? t(
                                                `validation:${errors?.refundReference?.message}`
                                              )
                                            : ""
                                        }
                                        variant="outlined"
                                        fullWidth
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
                                      value={field.value || ""}
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
                                      value={field.value || ""}
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
                                  <div className="my-auto text-MonochromeGray-500 col-span-2">
                                    {t("label:vatCode")}
                                  </div>
                                  <div className="my-auto text-MonochromeGray-500 col-span-4">
                                    {t("label:name")}
                                  </div>
                                  <div className="my-auto text-right text-MonochromeGray-500 col-span-2">
                                    {"Value (%)"}
                                  </div>
                                  <div className="my-auto text-MonochromeGray-500 col-span-3">
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
                                    <div className="my-auto col-span-2">
                                      <Controller
                                        name={`vat[${index}].vatCode`}
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            // onKeyUp={() => changeVatRateIcon(index)}
                                            {...field}
                                            type="text"
                                            autoComplete="off"
                                            className="bg-white custom-input-height"
                                            error={!!errors.vatCode}
                                            helperText={
                                              errors?.vatCode?.message
                                            }
                                            variant="outlined"
                                            required
                                            fullWidth
                                          />
                                        )}
                                      />
                                    </div>
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
                                                ? t(
                                                    `validation:${errors?.vatName?.message}`
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
                                    <div className="my-auto text-right col-span-2">
                                      <Controller
                                        name={`vat[${index}].vatValue`}
                                        control={control}
                                        render={({ field }) => (
                                          <TextField
                                            {...field}
                                            type="number"
                                            onWheel={(event) => {
                                              event.target.blur();
                                            }}
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
                                                ? t(
                                                    `validation:${errors?.vatValue?.message}`
                                                  )
                                                : ""
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
                                    <div className="my-auto col-span-3">
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
                                                ? t(
                                                    `validation:${errors?.bookKeepingReference?.message}`
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-20 w-full md:w-1/2 my-32">
                                <Controller
                                  name="b2bAccountCode"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:accountCode")}
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.b2bAccountCode}
                                      helperText={
                                        errors?.b2bAccountCode?.message
                                          ? t(
                                              `validation:${errors?.b2bAccountCode?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                    />
                                  )}
                                />
                                <Controller
                                  name="fakturaB2B"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:fakturaB2b")}
                                      type="number"
                                      onWheel={(event) => {
                                        event.target.blur();
                                      }}
                                      autoComplete="off"
                                      error={!!errors.fakturaB2B}
                                      hhelperText={
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
                                  name="b2cAccountCode"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:accountCode")}
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors.b2cAccountCode}
                                      helperText={
                                        errors?.b2cAccountCode?.message
                                          ? t(
                                              `validation:${errors?.b2cAccountCode?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
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
                                      onWheel={(event) => {
                                        event.target.blur();
                                      }}
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
