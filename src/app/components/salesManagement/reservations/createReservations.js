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
import ModeIcon from '@mui/icons-material/Mode';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
//import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
//import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import ReservationService from "../../../data-access/services/reservationService/reservationService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import DiscardConfirmModal from "../../common/confirmDiscard";
import {
  CreateReservationDefaultValue,

  validateSchemaCreateReservation,

  CustomerDefaultValue,
  validateSchemaCustomerCorporate,
  validateSchemaCustomerCorporateBySms,
  validateSchemaCustomerPrivate,
  validateSchemaCustomerPrivateByEmail,
} from "../utils/helper";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import { useCreateReservationMutation, useGetReservationListQuery } from "app/store/api/apiSlice";
import UtilsServices from "../../../data-access/utils/UtilsServices";
import AuthService from "../../../data-access/services/authService";
import CharCount from "../../common/charCount";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { es, nn, nb } from "date-fns/locale";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const ReservationCreate = () => {
    const { t } = useTranslation();
  const userInfo = UtilsServices.getFPUserData();
  //const [open, setOpen] = React.useState(false);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  //const [selectedFromList, setSelectedFromList] = useState(null);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [customDateDropDown, setCustomDateDropDown] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recheckSchema, setRecheckSchema] = useState(true);
  //const [itemLoader, setItemLoader] = useState(false);
  const [customerSearchBoxLength, setCustomerSearchBoxLength] = useState(0);
  const [customerSearchBy, setCustomerSearchBy] = useState(undefined);
  const [createReservation, response] = useCreateReservationMutation();
  /*const {data: reservationList} = useGetReservationListQuery();
  /console.log(reservationList);*/
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [openCreateCustomer, setOpenCreateCustomer] = useState(false);
  const [val, setVal] = useState([]);
  setCustomDateDropDown;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let totalReservation = 0;
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

  //let schema = activeSchema();
  useEffect(() => {
    //schema = activeSchema();
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
    mode: "onChange",
    CreateReservationDefaultValue,
    // reValidateMode: "all",
    resolver: yupResolver(validateSchemaCreateReservation),
  });
  const watchAllFields = watch();

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const activeCustomerSchema = () => {
    if (
      customData.orderBy === "sms" && customData.customerType === "private"
    )
      return validateSchemaCustomerPrivate;
    else if (
      customData.orderBy === "email" &&
      customData.customerType === "private"
    )
      return validateSchemaCustomerPrivateByEmail;
    else if (
      customData.orderBy === "email" &&
        customData.customerType === "corporate"
    )
      return validateSchemaCustomerCorporate;
    else if (
      customData.orderBy === "sms" &&
      customData.customerType === "corporate"
    )
      return validateSchemaCustomerCorporateBySms;
  };
  let customerSchema = activeCustomerSchema();
  useEffect(() => {
    customerSchema = activeCustomerSchema();
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
    control: controlCustomer,
    formState: formStateCustomer,
    handleSubmit: handleSubmitCustomer,
    getValues: getValuesCustomer,
    reset: resetCustomer,
    watch: watchCustomer,
    setValue: setValueCustomer,
    resetField: resetFieldCustomer,
    getFieldState: getFieldStateCustomer,
    trigger: triggerCustomer,
    setError: setErrorCustomer,
    setFocus: setFocusCustomer,
    clearErrors: clearErrorsCustomer,
  } = useForm({
    mode: "all",
    CustomerDefaultValue,
    // reValidateMode: "all",
    resolver: yupResolver(customerSchema),
  });
  const watchAllCustomerFields = watchCustomer();

  const { isValid: isValidCustomer, dirtyFields: dirtyFieldsCustomer, errors: errorsCustomer, touchedFields: touchedFieldsCustomer } = formStateCustomer;
  const onSubmitCustomer = (values) => {
    //console.log(values);
    let customerIDNo = '';
    if( customData.customerType == 'corporate' ){
      customerIDNo = values.orgID;
    } else if( values.pNumber != undefined ){
      customerIDNo = values.pNumber;
    }
    const customerUpData = {
      name: values.customerName,
      orgOrPNumber: customerIDNo,
      email: values.email,
      phone: values.primaryPhoneNumber,
      street: values.billingAddress,
      city: values.billingCity,
      zip: values.billingZip,
      country: values.billingCountry,
      type: customData.customerType
    };
    //console.log(customerUpData);
    setSelectedCustomer(customerUpData);
    clearErrors(["pNumber", "orgID"]);
    setOpenCreateCustomer(false);
  }

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
    //console.log(values);
    //return;
    setLoading(true);
    subTotal = (subTotal / 2).toFixed(2);
    totalTax = (totalTax / 2).toFixed(2);
    totalDiscount = (totalDiscount / 2).toFixed(2);
    grandTotal = (grandTotal / 2).toFixed(2);
    const data = ReservationService.prepareCreateReservationPayload({
      ...values,
      ...customData,
      ...selectedCustomer,
      orderSummary: {
        subTotal,
        totalTax,
        totalDiscount,
        grandTotal,
      },
    });
    createReservation(data).then((response) => {
      setLoading(false);
      if (response?.data?.status_code === 201) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), {
          variant: "success",
        });
        //navigate(`/reservations`);
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
    const watchReservationAmount = watch(`order[${index}].reservationAmount`) || 0;
    const watchTax = watch(`order[${index}].tax`);
    //const watchName = watch(`order[${index}].productName`);
    //const watchId = watch(`order[${index}].productID`);

    let splitedAmount, dotFormatAmount, floatAmount, amount;
    if (!!watchReservationAmount) {
      amount = watchReservationAmount;
      splitedAmount = amount.toString().includes(",") ? amount.split(",") : amount;
      dotFormatAmount =
        typeof splitedAmount === "object"
          ? `${splitedAmount[0]}.${splitedAmount[1]}`
          : splitedAmount;
      floatAmount = parseFloat(dotFormatAmount);
    }

    const total = floatAmount;
    const subTotalCalculation =
    floatAmount / ((100 + watchTax) / 100);
    const totalTaxCalculation = subTotalCalculation
      ? (subTotalCalculation * (watchTax / 100)) / 2
      : 0;

    if (totalTaxCalculation) totalTax = totalTax + totalTaxCalculation;
    if (subTotalCalculation)
      subTotal = subTotal + parseFloat(subTotalCalculation);
    if (totalTaxCalculation) totalTax = totalTax + totalTaxCalculation;
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
    //setValue(`order[${Math.max(...addOrderIndex) + 1}].discount`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].reservationAmount`, "");
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
    //setValue(`order[${index}].discount`, "");
    setValue(`order[${index}].reservationAmount`, "");
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
    //resetField(`order[${index}].quantity`);
    //resetField(`order[${index}].rate`);
    //resetField(`order[${index}].discount`);
    resetField(`order[${index}].reservationAmount`);
    resetField(`order[${index}].tax`);

    setValue(`order[${index}].productName`, "");
    setValue(`order[${index}].productID`, "");
    //setValue(`order[${index}].quantity`, "");
    //setValue(`order[${index}].rate`, "");
    //setValue(`order[${index}].discount`, "");
    setValue(`order[${index}].reservationAmount`, "");
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

  const openCustomarModal = (customerType = '') => {
    if(customerType){
      customerType === "corporate"
      ? setCustomData({
          ...customData,
          customerType: "corporate",
      })
      : setCustomData({
          ...customData,
          customerType: "private",
      });
    }
    setOpenCreateCustomer(true);
  };

  const triggerSelectCustomer = ( customerData ) => {
    if (customerData) {
      clearErrors(["pNumber", "orgID"]);
      setRecheckSchema(false);
      setCustomerSearchBy(undefined);
      setCustomerSearchBoxLength(0);
      setValueCustomer("primaryPhoneNumber", customerData.phone);
      setValueCustomer("email", customerData.email);
      setValueCustomer("customerName", customerData.name);
      customerData.type === "Corporate"
          ? setValueCustomer("orgID", customerData.orgOrPNumber)
          : setValueCustomer("pNumber", customerData.orgOrPNumber);
          setValueCustomer("billingAddress", customerData.street);
          setValueCustomer("billingZip", customerData.zip);
          setValueCustomer("billingCity", customerData.city);
          setValueCustomer("billingCountry", customerData.country);
      if( customerData.type === "Corporate" ){
        setCustomData({
          ...customData,
          customerType: "corporate",
        });
      } else {
        setCustomData({
          ...customData,
          customerType: "private"
        });
      }
      // data.type === "Corporate"
      //   ? setSelectedFromList("Corporate")
      //   : setSelectedFromList("Private");
      setSelectedCustomer(customerData);
      resetField('searchCustomer');
      //console.log(customerData);
    } else {
      setValueCustomer("primaryPhoneNumber", "");
      setValueCustomer("email", "");
      setValueCustomer("customerName", "");
      setValueCustomer("orgID", "");
      setValueCustomer("pNumber", "");
      setValueCustomer("billingAddress", "");
      setValueCustomer("billingZip", "");
      setValueCustomer("billingCity", "");
      setValueCustomer("billingCountry", "");
      // setSelectedFromList(null);
      setSelectedCustomer('');
    }
  }

  const triggerProductSelected = ( index, productData ) => {
    if (productData) {
      if (productData?.name) {
        setValue(
          `order[${index}].productName`,
          productData.name
        );
        setValue(
          `order[${index}].productID`,
          productData.id
        );
        const preparedPrice = productData.price
          .toString()
          .includes(".")
          ? `${productData.price.toString().split(".")[0]},${
            productData.price.toString().split(".")[1]
            }`
          : productData.price;
        setValue(
          `order[${index}].reservationAmount`,
          preparedPrice
        );
        setValue(`order[${index}].tax`, productData.tax);
        disableCurrentProductRow(index);

        const watchResevationAmount = watch(
          `order[${index}].reservationAmount`
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
            watchResevationAmount &&
            watchTax &&
            i !== index &&
            watchName ===
              watch(`order[${i}].productName`) &&
            watchId ===
              watch(`order[${i}].productID`) &&
              watchResevationAmount === watch(`order[${i}].reservationAmount`) &&
            watchTax === watch(`order[${i}].tax`)
          ) {
            onSameRowAction(index);
            enqueueSnackbar(
              `Same product found in Row ${
                i + 1
              } and ${index + 1}`,
              { variant: "error" }
            );
          }
        }
      } else
        setValue(
          `order[${index}].productName`,
          productData ? productData : ""
        );
    } else {
      setValue(`order[${index}].productName`, "");
      setValue(`order[${index}].productID`, "");
      setValue(`order[${index}].reservationAmount`, "");
      setValue(`order[${index}].tax`, "");
      enableCurrentProductRow(index);
    }
  }

  const watchFirstProductName = watch(`order[0].productName`);

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
                      {t("label:createReservation")}
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
                              disabled={!isValid || !selectedCustomer || !watchFirstProductName}
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
                  <div className="customer-info-section">
                    <div className="search-customer-order-create my-32">
                        <Controller
                        control={control}
                        name="searchCustomer"
                        render={({
                            field: { ref, onChange, ...field },
                        }) => (
                            <Autocomplete
                            //freeSolo
                            popupIcon={<Search/>}
                            options={customersList}
                            //value={val || null}
                            //forcePopupIcon={<Search />}
                            getOptionLabel={(option) => option.searchString}
                            className=""
                            fullWidth
                            onChange={(_, data) => {
                              triggerSelectCustomer(data);
                              //setVal('');
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
                                inputRef={ref}
                                onChange={searchCustomerOnFocus}
                                placeholder={t("label:searchByNamePhoneNumber")}
                                // InputProps={{
                                //     startAdornment: (
                                //         <InputAdornment position="end">
                                //           <Search />
                                //         </InputAdornment>
                                //     ),
                                // }}
                                />
                            )}
                            noOptionsText={
                              <div className="flex items-center justify-between my-2">
                                <span className="subtitle3 font-600">
                                  {t("label:noCustomersFound")}
                                </span>
                              </div>
                            }
                            />
                        )}
                        />
                        {/* <span className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                        </span> */}
                    </div>

                    <div className="customer-selection-info pb-20">
                      { !selectedCustomer ? (
                      <div className="no-customer-selected">
                        <div className="box customer-selection-box">
                          <h5 className="sec-sub-header">{t("label:noCustomerSelected")}</h5>
                          <div className="body3 text-MonochromeGray-300">{t("label:selectCustomerOrCreate")}</div>
                          <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-20 w-full mt-20">
                            <Button
                              variant="outlined"
                              className="body3x lg-blue-btn"
                              onClick={ () => openCustomarModal('private')}
                            >
                              {t("label:createPrivateCustomer")}
                            </Button>
                            <Button
                              variant="outlined"
                              className="body3x lg-blue-btn"
                              onClick={ () => openCustomarModal('corporate') }
                            >
                              {t("label:createCorporateCustomer")}
                            </Button>
                          </div>
                        </div>
                      </div>
                      ) : (
                      <div className="selected-customer-info">
                        <div className="box">
                          <div className="box-header has-icon pr-20">
                            <h5 className="sec-sub-header">{ selectedCustomer.name }</h5>
                            <span className="close-icon" 
                              onClick={ () => {
                                triggerSelectCustomer('');
                                const closeIcon = document.querySelectorAll('.search-customer-order-create .MuiAutocomplete-clearIndicator');
                                closeIcon[0].click();
                              } }
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                            </span>
                          </div>
                          <p className="body-p">{ selectedCustomer.phone }</p>
                          <p className="body-p">{ selectedCustomer.email }</p>
                          <p className="body-p">
                            { selectedCustomer.street + ', ' + selectedCustomer.city + ' ' + selectedCustomer.zip + ', ' + selectedCustomer.country }
                          </p>
                          <div className="my-20">
                            <Button
                                variant="outlined"
                                className="body3x lg-blue-btn"
                                startIcon={<ModeIcon />}
                                onClick={ () => openCustomarModal()}
                              >
                                {t("label:editDetails")}
                            </Button>
                          </div>
                        </div>
                      </div>
                      )}
                      
                    </div>
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

                  <Hidden smUp>
                    <div className="mobile-product-list px-10">
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
                          <div className="sticky top-28 z-40">
                            <Button
                              className="mt-20 rounded-4 button2 text-MonochromeGray-700 bg-white w-full border-1 border-MonochromeGray-50 shadow-1"
                              startIcon={<AddIcon className="text-main" />}
                              variant="contained"
                              onClick={() => addNewOrder()}
                              disabled={addOrderIndex.length >= 20 ? true : false}
                            >
                              {t(`label:addItem`)}
                            </Button>
                          </div>
                          {addOrderIndex.map((index) => (
                            <div
                              className=" p-20 rounded-6 bg-white border-2 border-MonochromeGray-25 my-20 flex flex-col gap-20"
                              key={`order:${index}`}
                            >
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
                                    onBlur={pnameOnBlur}
                                    options={productsList}
                                    // forcePopupIcon={<Search />}
                                    getOptionLabel={(option) =>
                                      option?.name
                                        ? option.name
                                        : option
                                        ? option
                                        : ""
                                    }
                                    size="small"
                                    //className="custom-input-height"
                                    onChange={(_, data) => {
                                      triggerProductSelected(index, data);
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
                                        placeholder="Product Name"
                                        {...field}
                                        className="custom-input-height"
                                        inputRef={ref}
                                      />
                                    )}
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
                                    value={field.value || ""}
                                    disabled={disableRowIndexes.includes(index)}
                                  />
                                )}
                              />
                              <div className="grid grid-cols-4 gap-20">
                                
                                <Controller
                                  name={`order[${index}].reservationAmount`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:reservationAmount")}
                                      className="bg-white custom-input-height col-span-2"
                                      autoComplete="off"
                                      error={!!errors?.order?.[index]?.reservationAmount}
                                      // helperText={errors?.order?.[index]?.rate?.message}
                                      variant="outlined"
                                      required
                                      value={field.value || ""}
                                      fullWidth
                                      disabled={disableRowIndexes.includes(index)}
                                    />
                                  )}
                                />

                                {!disableRowIndexes.includes(index) ? (
                                  <Controller
                                    name={`order[${index}].tax`}
                                    control={control}
                                    render={({ field }) => (
                                      <FormControl
                                        error={!!errors?.order?.[index]?.tax}
                                        required
                                        fullWidth
                                        className="col-span-2"
                                      >
                                        <InputLabel id="demo-simple-select-outlined-label-type">
                                          {t(`label:tax`)}
                                        </InputLabel>
                                        <Select
                                          {...field}
                                          labelId="demo-simple-select-outlined-label-type"
                                          id="demo-simple-select-outlined"
                                          label="Tax"
                                          value={field.value || ""}
                                          defaultValue={defaultTaxValue}
                                          className="col-span-2"
                                          disabled={disableRowIndexes.includes(index)}
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value || touchedFields.tax,
                                          }}
                                        >
                                          {!!taxes && taxes.length ? (
                                            taxes.map((tax, index) =>
                                              tax.status === "Active" ? (
                                                <MenuItem
                                                  key={index}
                                                  value={tax.value}
                                                >
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
                                        label="Tax"
                                        className="bg-white custom-input-height col-span-2"
                                        type="number"
                                        autoComplete="off"
                                        error={!!errors?.order?.[index]?.tax}
                                        helperText={
                                          errors?.order?.[index]?.tax?.message
                                        }
                                        variant="outlined"
                                        required
                                        placeholder="Tax"
                                        disabled={disableRowIndexes.includes(index)}
                                        fullWidth
                                      />
                                    )}
                                  />
                                )}
                              </div>
                              <div className="grid grid-cols-3 gap-20">
                                
                                
                              </div>
                              <div className="flex justify-between subtitle1 pt-20 border-t-1 border-MonochromeGray-50">
                                <div>{t("label:totalReservation")}</div>
                                <div>
                                  {t("label:nok")} {productWiseTotal(index)}
                                </div>
                              </div>
                              <Button
                                variant="outlined"
                                color="error"
                                className="w-1/2 text-primary-900 rounded-4 border-1 border-MonochromeGray-50"
                                startIcon={
                                  <RemoveCircleOutlineIcon className="text-red-400" />
                                }
                                onClick={() => onDelete(index)}
                              >
                                {t(`label:removeItem`)}
                              </Button>
                            </div>
                          ))}
                          <div className="bg-MonochromeGray-50 p-20 subtitle2 text-MonochromeGray-700">
                            {/*TODO: joni vai please add grandtotal here*/}
                            {t("label:totalReservationAmount")} : {t("label:nok")} {grandTotal}
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </Hidden>

                  <Hidden smDown>
                    <div className="product-list">
                      <div className="my-10 product-list-grid-container product-list-grid-container-height bg-primary-25 subtitle3 gap-10 px-10">
                        <div className="my-auto text-MonochromeGray-500">
                        {t("label:itemName")}
                        </div>
                        <div className="my-auto text-MonochromeGray-500">
                          {t("label:productIdOptional")}
                        </div>
                        <div className="my-auto text-right text-MonochromeGray-500">
                        {t("label:reservationAmount")}
                        </div>
                        <div className="my-auto text-center text-MonochromeGray-500">
                          {t("label:tax")}
                        </div>
                        <div className="my-auto text-right text-MonochromeGray-500">
                        {t("label:totalReservation")}
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
                                    triggerProductSelected(index, data);
                                    
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
                              name={`order[${index}].reservationAmount`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  //label="Discount"
                                  className="bg-white custom-input-height"
                                  type="number"
                                  autoComplete="off"
                                  error={!!errors.reservationAmount}
                                  helperText={errors?.reservationAmount?.message}
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
                    <div className="customer-section col-span-1 md:col-span-3 mt-20 flex flex-col gap-y-20 pb-20 sm:pb-0">
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
                          current={watch("customerNotes")?.length || 0}
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
                        <CharCount
                          current={watch("termsConditions")?.length || 0}
                          total={200}
                        />
                      </div>
                    </div>
                    <div className="col-span-1"></div>
                    
                    <Hidden smDown>
                      <div className="col-span-1 md:col-span-2">
                        <div className="border-MonochromeGray-25">
                          <div className="px-14">
                            <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 my-20">
                              <div className="subtitle3 text-MonochromeGray-700">
                              {t("label:totalReservationAmount")}
                              </div>
                              <div className="body3 text-MonochromeGray-700">
                                {t("label:nok")}{" "}
                                {ThousandSeparator(grandTotal.toFixed(2) / 2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Hidden>
                  </div>

                </div>
              </div>
              <Hidden mdUp>
                <div className="fixed bottom-0 grid grid-cols-2 justify-center items-center gap-20 w-full mb-20 px-20 z-50">
                  <Button
                    color="secondary"
                    variant="contained"
                    className="bg-white text-MonochromeGray-700 button2 shadow-5 "
                    onClick={() => setOpen(true)}
                    startIcon={<Cancel className="text-red-500" />}
                  >
                    {t("label:discard")}
                  </Button>
                  <LoadingButton
                    color="secondary"
                    variant="contained"
                    type="submit"
                    className="rounded-full bg-primary-500 button2 py-5"
                    disabled={!isValid}
                    sx={{
                      "&.Mui-disabled": {
                        background: "#eaeaea",
                        color: "#c0c0c0",
                      },
                    }}
                    startIcon={<RedoIcon />}
                    loading={loading}
                    loadingPosition="center"
                  >
                    {t("label:sendOrder")}
                  </LoadingButton>
                </div>
              </Hidden>
          </form>
          <div className="modal-container">
            <div className="customer-modal-container">
              
              <Dialog 
                className="create-customer-modal" 
                open={openCreateCustomer} 
                onClose={ () => {
                  setOpenCreateCustomer(false); 
                }}
              >
                <form
                name="customerDataForm"
                noValidate
                onSubmit={handleSubmitCustomer(onSubmitCustomer)}
                >
                <DialogTitle>
                  { selectedCustomer 
                    ? t("label:editCustomerDetails") 
                    : customData.customerType == 'corporate' 
                      ? t("label:createCorporateCustomer") 
                      : t("label:createPrivateCustomer")}
                </DialogTitle>
                <DialogContent>
                  <div className="w-full my-32">
                    <div className="form-pair-input gap-x-20">
                      <Controller
                        name="primaryPhoneNumber"
                        control={controlCustomer}
                        render={({ field }) => (
                          <FormControl
                            error={!!errorsCustomer.primaryPhoneNumber}
                            fullWidth
                          >
                            <PhoneInput
                              {...field}
                              className={
                                errorsCustomer.primaryPhoneNumber
                                  ? "input-phone-number-field border-1 rounded-md border-red-300"
                                  : "input-phone-number-field"
                              }
                              country="no"
                              enableSearch
                              autocompleteSearch
                              countryCodeEditable={false}
                              specialLabel={`${t("label:phone")}*`}
                              // onBlur={handleOnBlurGetDialCode}
                              value={field.value || ""}
                            />
                            <FormHelperText>
                              {errorsCustomer?.primaryPhoneNumber?.message
                                ? t(
                                    `validation:${errorsCustomer?.primaryPhoneNumber?.message}`
                                  )
                                : ""}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                      <Controller
                        name="email"
                        control={controlCustomer}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:email")}
                            type="email"
                            autoComplete="off"
                            error={!!errorsCustomer.email}
                            helperText={
                              errorsCustomer?.email?.message
                                ? t(
                                    `validation:${errorsCustomer?.email?.message}`
                                  )
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                            required
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-32 sm:mt-0">
                      <div className="form-pair-input gap-x-20">
                        <Controller
                          name="customerName"
                          control={controlCustomer}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:customerName")}
                              type="text"
                              autoComplete="off"
                              error={!!errorsCustomer.customerName}
                              helperText={
                                errorsCustomer?.customerName?.message
                                  ? t(
                                      `validation:${errorsCustomer?.customerName?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              required
                              value={field.value || ""}
                            />
                          )}
                        />
                        {customData.customerType === "corporate" && (
                          <Controller
                            name="orgID"
                            control={controlCustomer}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:organizationId")}
                                type="number"
                                autoComplete="off"
                                error={!!errorsCustomer.orgID}
                                required
                                helperText={
                                  errorsCustomer?.orgID?.message
                                    ? t(
                                        `validation:${errorsCustomer?.orgID?.message}`
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
                        {customData.customerType === "private" && (
                          <Controller
                            name="pNumber"
                            control={controlCustomer}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:pNumber")}
                                type="number"
                                autoComplete="off"
                                error={!!errorsCustomer.pNumber}
                                helperText={
                                  errorsCustomer?.pNumber?.message
                                    ? t(
                                        `validation:${errorsCustomer?.pNumber?.message}`
                                      )
                                    : ""
                                }
                                // ref={orgOrPNumberRef}
                                variant="outlined"
                                fullWidth
                                value={field.value || ""}
                              />
                            )}
                          />
                        )}
                      </div>
                    </div>
                    <div className="">
                      <div className="form-pair-three-by-one">
                        <div className="col-span-3">
                          <Controller
                            name="billingAddress"
                            control={controlCustomer}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:streetAddress")}
                                type="text"
                                autoComplete="off"
                                error={!!errorsCustomer.billingAddress}
                                helperText={
                                  errorsCustomer?.billingAddress?.message
                                    ? t(
                                        `validation:${errorsCustomer?.billingAddress?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                inputlabelprops={{
                                  shrink:
                                    !!field.value ||
                                    touchedFields.billingAddress,
                                }}
                                required={customData.paymentMethod.includes(
                                  "invoice"
                                )}
                                value={field.value || ""}
                              />
                            )}
                          />
                        </div>
                        <div className="col-span-1">
                          <Controller
                            name="billingZip"
                            className="col-span-1"
                            control={controlCustomer}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                label={t("label:zipCode")}
                                type="text"
                                autoComplete="off"
                                error={!!errorsCustomer.billingZip}
                                helperText={
                                  errorsCustomer?.billingZip?.message
                                    ? t(
                                        `validation:${errorsCustomer?.billingZip?.message}`
                                      )
                                    : ""
                                }
                                variant="outlined"
                                fullWidth
                                inputlabelprops={{
                                  shrink:
                                    !!field.value ||
                                    touchedFields.billingZip,
                                }}
                                required={customData.paymentMethod.includes(
                                  "invoice"
                                )}
                                value={field.value || ""}
                              />
                            )}
                          />
                        </div>
                      </div>
                      <div className="form-pair-input gap-x-20">
                        <Controller
                          name="billingCity"
                          control={controlCustomer}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:city")}
                              type="text"
                              autoComplete="off"
                              error={!!errorsCustomer.billingCity}
                              helperText={
                                errorsCustomer?.billingCity?.message
                                  ? t(
                                      `validation:${errorsCustomer?.billingCity?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              inputlabelprops={{
                                shrink:
                                  !!field.value ||
                                  touchedFields.billingCity,
                              }}
                              required={customData.paymentMethod.includes(
                                "invoice"
                              )}
                              value={field.value || ""}
                            />
                          )}
                        />

                        <Controller
                          name="billingCountry"
                          control={controlCustomer}
                          render={({ field }) => (
                            <FormControl
                              error={!!errorsCustomer.billingCountry}
                              fullWidth
                            >
                              <InputLabel id="billingCountry">
                                {t("label:country")}*
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="billingCountry"
                                id="select"
                                label={t("label:country")}
                                inputlabelprops={{
                                  shrink: !!field.value,
                                }}
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
                                {errorsCustomer?.billingCountry?.message
                                  ? t(
                                      `validation:${errorsCustomer?.billingCountry?.message}`
                                    )
                                  : ""}
                              </FormHelperText>
                            </FormControl>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions className="dialogue-btn-container">
                  <Button className="body3x lg-blue-btn" variant="outlined" onClick={ () => {setOpenCreateCustomer(false) }}>
                    {t("label:cancel")}
                  </Button>
                  { selectedCustomer ? (
                    <Button 
                      className="body3x lg-blue-btn" 
                      variant="outlined" 
                      //onClick={ () => {setOpenCreateCustomer(false) }}
                      disabled={!isValidCustomer}
                      type="submit"
                    >
                      {t("label:update")}
                    </Button>
                  ) : (
                    <Button 
                      className="body3x lg-blue-btn" 
                      variant="outlined" 
                      //onClick={ () => {setOpenCreateCustomer(false) }}
                      disabled={!isValidCustomer}
                      type="submit"
                    >
                    {t("label:create")}
                    </Button>
                  )}
                </DialogActions>
                </form>
              </Dialog>
            </div>
          </div>
        </>
    );
};

export default ReservationCreate;