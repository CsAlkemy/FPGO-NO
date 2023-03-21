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
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import DiscardConfirmModal from "../../common/confirmDiscard";
import {
  CreateOrderDefaultValue,
  validateSchemaCreateOrderCorporate,
  validateSchemaCreateOrderCorporateOrderBySms,
  validateSchemaCreateOrderPrivate,
  validateSchemaCreateOrderPrivateOrderByEmail,
} from "../utils/helper";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import { useCreateOrderMutation } from "app/store/api/apiSlice";
import UtilsServices from "../../../data-access/utils/UtilsServices";
import AuthService from "../../../data-access/services/authService";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { es, nn, nb } from "date-fns/locale";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const createOrder = () => {
  const { t } = useTranslation();
  const userInfo = UtilsServices.getFPUserData();
  const [open, setOpen] = React.useState(false);
  const [expanded1, setExpanded1] = React.useState(false);
  const [expanded0, setExpanded0] = React.useState(false);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [expandedPanel2, setExpandedPanel2] = React.useState(false);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [selectedFromList, setSelectedFromList] = useState(null);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [customDateDropDown, setCustomDateDropDown] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recheckSchema, setRecheckSchema] = useState(true);
  const [itemLoader, setItemLoader] = useState(false);
  const [customerSearchBoxLength, setCustomerSearchBoxLength] = useState(0);
  const [customerSearchBy, setCustomerSearchBy] = useState(undefined);
  const [createOrder, response] = useCreateOrderMutation();
  setCustomDateDropDown;
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
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
  let schema = activeSchema();
  useEffect(() => {
    schema = activeSchema();
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
    trigger,
    setError,
    setFocus,
    clearErrors,
  } = useForm({
    mode: "all",
    CreateOrderDefaultValue,
    // reValidateMode: "onChange",
    resolver: yupResolver(schema),
  });
  const watchAllFields = watch();

  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const searchCustomerOnFocus = (e) => {
    const searchByPhone =
      customersList.filter((customer) =>
        customer.phone.startsWith(e.target.value)
      ) || [];
    const searchByName =
      customersList.filter((customer) =>
        customer.name.toLowerCase().startsWith(e.target.value.toLowerCase())
      ) || [];
    setCustomerSearchBy(
      searchByName.length ? "name" : searchByPhone.length ? "phone" : undefined
    );
    setCustomerSearchBoxLength(e.target.value.length);
  };

  const onSubmit = (values) => {
    setLoading(true);
    subTotal = (subTotal / 2).toFixed(2);
    totalTax = (totalTax / 2).toFixed(2);
    totalDiscount = (totalDiscount / 2).toFixed(2);
    grandTotal = (grandTotal / 2).toFixed(2);
    const data = OrdersService.prepareCreateOrderPayload({
      ...values,
      ...customData,
      orderSummary: {
        subTotal,
        totalTax,
        totalDiscount,
        grandTotal,
      },
    });
    createOrder(data).then((response) => {
      setLoading(false);
      if (response?.data?.status_code === 201) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), {
          variant: "success",
        });
        navigate(`/sales/orders-list`);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
        });
      }
    });
    // .then((response) => {
    //   if (response?.status_code === 201) {
    //     enqueueSnackbar(response.message, { variant: "success" });
    //     navigate(`/sales/orders-list`);
    //   }
    // })
    // .catch((e) => {
    //   enqueueSnackbar(e, { variant: "error" });
    // });
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
    //%%%%%%%%%%%%%%%%%%%%%%
    //Vat Exclusive Calculation
    //----------------------------------------
    // const total =
    //   parseInt(watchQuantity) * parseFloat(watchRate) -
    //   parseFloat(watchDiscount) +
    //   (parseInt(watchQuantity) * parseFloat(watchRate) -
    //     parseFloat(watchDiscount)) *
    //   (watchTax / 100);
    // const subTotalCalculation = parseInt(watchQuantity) * parseFloat(watchRate);
    // const totalTaxCalculation =
    //   (parseInt(watchQuantity) * parseFloat(watchRate) -
    //     parseFloat(watchDiscount)) *
    //   (watchTax / 100);
    // const grandTotalCalculation =
    //   parseInt(watchQuantity) * parseFloat(watchRate) -
    //   parseFloat(watchDiscount) +
    //   (parseInt(watchQuantity) * parseFloat(watchRate) -
    //     parseFloat(watchDiscount)) *
    //   (watchTax / 100);
    // if (watchTax) defaultTaxValue = watchTax;
    // if (subTotalCalculation)
    //   subTotal = subTotal + parseFloat(subTotalCalculation);
    // if (totalTaxCalculation) totalTax = totalTax + totalTaxCalculation;
    // if (watchDiscount)
    //   totalDiscount = totalDiscount + parseFloat(watchDiscount);
    // if (grandTotalCalculation) grandTotal = grandTotal + grandTotalCalculation;
    //%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    // Vat Inclusive Calculation
    // Subtotal : (Qty*Rate*100%)/(100+Tax)%
    // Tax : subtotal * (tax/100)
    //Amount : (Rate * Qty) - discount
    //Discount : Sum of discounts
    //Grand Total : Sum of amounts
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

  const addNewOrder = () => {
    // setAddOrderIndex([...addOrderIndex, addOrderIndex.length]);
    setItemLoader(true);
    setAddOrderIndex([...addOrderIndex, Math.max(...addOrderIndex) + 1]);
    setValue(`order[${Math.max(...addOrderIndex) + 1}].productName`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].productID`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].quantity`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].rate`, "");
    setValue(`order[${Math.max(...addOrderIndex) + 1}].discount`, "");
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
    setValue(`order[${index}].discount`, "");
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
    // addNewOrder()
    // addOrderIndex.length > 1
    //   ? setAddOrderIndex(addOrderIndex.filter((i) => i !== index))
    //   : setAddOrderIndex([...addOrderIndex]);
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
          ? watchOrderDate.getDate() + 1
          : new Date().getDate() + 1
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
                  searchString: row?.name + " ( " + row?.phone + " )",
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
    // ProductService.productsList()
    //   .then((res) => {
    //     console.log("aaa pl t");
    //     let data = [];
    //     if (res?.status_code === 200 && res.length) {
    //       res
    //         .filter((r) => r.status === "Active")
    //         .map((row) => {
    //           return data.push({
    //             uuid: row.uuid,
    //             name: row.name,
    //             id: row.id,
    //             price: row.pricePerUnit,
    //             tax: row.taxRate,
    //           });
    //         });
    //     }
    //     setProductsList(data);
    //   })
    //   .catch((e) => {
    //   });
  }, []);

  //EXperiment
  // useEffect(() => {
  //   if (userInfo?.user_data?.organization?.uuid){
  //     ClientService.vateRatesList(userInfo?.user_data?.organization?.uuid)
  //       .then((res) => {
  //         if (res?.status_code === 200) {
  //           setTaxes(res?.data);
  //         }else{
  //           setTaxes([])
  //         }
  //       })
  //       .catch((e) => {
  //         setTaxes([])
  //       });
  //   }
  // }, []);

  // useEffect(() => {
  //   console.log("addOrderIndex : ", addOrderIndex);
  // }, [addOrderIndex]);

  //EXperiment
  // useEffect(() => {
  //   CustomersService.customersList()
  //     .then((res) => {
  //       let data = [];
  //       if (res?.status_code === 200 && res.length) {
  //         res
  //           .filter((item) => {
  //             return item.status === "Active";
  //           })
  //           .map((row) => {
  //             return data.push({
  //               uuid: row.uuid,
  //               name: row?.name ? row?.name : null,
  //               orgOrPNumber: row?.orgIdOrPNumber ? row?.orgIdOrPNumber : null,
  //               email: row?.email ? row?.email : null,
  //               phone: row?.phone ? row?.phone : null,
  //               type: row.type,
  //               street: row?.street,
  //               city: row?.city,
  //               zip: row?.zip,
  //               country: row?.country,
  //               searchString : row?.name+" ( "+row?.phone+" )"
  //             });
  //           });
  //       }
  //       setCustomersList(data);
  //     })
  //     .catch((e) => {
  //     });
  // }, []);

  // useEffect(() => {
  //   let selectedProduct;
  //   if (watchProductName) {
  //     selectedProduct = productsList.filter((item) => {
  //       return item.uuid === watchProductName.uuid;
  //     });
  //     setSelectedProductId(true);
  //   }
  // }, [watchProductName]);

  // const handleDueDatePickerClose = () => {
  //   setValue("dueDatePaymentLink", watchDueDatePaymentLink);
  //   setDatePickerOpen(false);
  // };

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

  return (
    <div className="create-product-container">
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          color: "#0088AE",
          background: "white",
        }}
        open={itemLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="inside-div-product">
        <div className="rounded-sm bg-white p-0 md:px-20">
          <form
            name="createOrderForm"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className=" header-click-to-action ">
              <div className="header-text header6  flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                {t("label:createOrder")}
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
                  {/*<Button*/}
                  {/*  color="secondary"*/}
                  {/*  variant="contained"*/}
                  {/*  className="font-semibold rounded-4 w-full sm:w-auto"*/}
                  {/*  type="submit"*/}
                  {/*  // disabled={!(isValid && customData.paymentMethod.length)}*/}
                  {/*  disabled={!isValid}*/}
                  {/*  startIcon={<SendIcon />}*/}
                  {/*>*/}
                  {/*  {t("label:sendOrder")}*/}
                  {/*</Button>*/}
                  <LoadingButton
                    color="secondary"
                    variant="contained"
                    className="font-semibold rounded-4 w-full sm:w-auto"
                    type="submit"
                    // disabled={!(isValid && customData.paymentMethod.length)}
                    disabled={!isValid}
                    startIcon={<SendIcon />}
                    loading={loading}
                    loadingPosition="center"
                  >
                    {t("label:createOrder")}
                  </LoadingButton>
                </div>
              </Hidden>
            </div>
            <Hidden smUp>
              <div className="px-10">
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
                        Add Item
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
                                if (data) {
                                  if (data?.name) {
                                    setValue(
                                      `order[${index}].productName`,
                                      data.name
                                    );
                                    setValue(
                                      `order[${index}].productID`,
                                      data.id
                                    );
                                    setValue(
                                      `order[${index}].rate`,
                                      data.price
                                    );
                                    setValue(`order[${index}].tax`, data.tax);
                                    disableCurrentProductRow(index);

                                    const watchRate = watch(
                                      `order[${index}].rate`
                                    );
                                    const watchTax = watch(
                                      `order[${index}].tax`
                                    );
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
                                        watchRate &&
                                        watchTax &&
                                        i !== index &&
                                        watchName ===
                                          watch(`order[${i}].productName`) &&
                                        watchId ===
                                          watch(`order[${i}].productID`) &&
                                        watchRate ===
                                          watch(`order[${i}].rate`) &&
                                        watchTax === watch(`order[${i}].tax`)
                                      ) {
                                        let quantityNum = isNaN(
                                          parseInt(
                                            watch(`order[${i}].quantity`)
                                          )
                                        )
                                          ? 1
                                          : parseInt(
                                              watch(`order[${i}].quantity`)
                                            );
                                        setValue(
                                          `order[${i}].quantity`,
                                          quantityNum + 1
                                        );
                                        // onDelete(index);
                                        onSameRowAction(index);
                                        enqueueSnackbar(
                                          `Same product found in Row ${
                                            i + 1
                                          } and ${index + 1}, merged together!`,
                                          { variant: "success" }
                                        );
                                      }
                                    }
                                  } else
                                    setValue(
                                      `order[${index}].productName`,
                                      data ? data : ""
                                    );
                                } else {
                                  setValue(`order[${index}].productName`, "");
                                  setValue(`order[${index}].productID`, "");
                                  setValue(`order[${index}].rate`, "");
                                  setValue(`order[${index}].tax`, "");
                                  enableCurrentProductRow(index);
                                }
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
                                // helperText={
                                //   errors?.order?.[index]?.quantity?.message
                                // }
                                // error={!!errors.quantity}
                                // helperText={errors?.quantity?.message}
                                variant="outlined"
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
                                // helperText={errors?.order?.[index]?.rate?.message}
                                variant="outlined"
                                required
                                value={field.value || ""}
                                fullWidth
                                disabled={disableRowIndexes.includes(index)}
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
                                >
                                  <InputLabel id="demo-simple-select-outlined-label-type">
                                    Tax
                                  </InputLabel>
                                  <Select
                                    {...field}
                                    labelId="demo-simple-select-outlined-label-type"
                                    id="demo-simple-select-outlined"
                                    label="Tax"
                                    value={field.value || ""}
                                    defaultValue={defaultTaxValue}
                                    className="col-span-1"
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
                                  className="bg-white custom-input-height"
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
                        <div className="flex justify-between subtitle1 pt-20 border-t-1 border-MonochromeGray-50">
                          <div>{t("label:total")}</div>
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
                          Remove Item
                        </Button>
                      </div>
                    ))}
                    <div className="bg-MonochromeGray-50 p-20 subtitle2 text-MonochromeGray-700">
                      {/*TODO: joni vai please add grandtotal here*/}
                      {t("label:grandTotal")} : {t("label:nok")} {grandTotal}
                    </div>
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
                              if (data) {
                                if (data?.name) {
                                  setValue(
                                    `order[${index}].productName`,
                                    data.name
                                  );
                                  setValue(
                                    `order[${index}].productID`,
                                    data.id
                                  );
                                  setValue(`order[${index}].rate`, data.price);
                                  setValue(`order[${index}].tax`, data.tax);
                                  disableCurrentProductRow(index);

                                  const watchRate = watch(
                                    `order[${index}].rate`
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
                                      watchRate &&
                                      watchTax &&
                                      i !== index &&
                                      watchName ===
                                        watch(`order[${i}].productName`) &&
                                      watchId ===
                                        watch(`order[${i}].productID`) &&
                                      watchRate === watch(`order[${i}].rate`) &&
                                      watchTax === watch(`order[${i}].tax`)
                                    ) {
                                      let quantityNum = isNaN(
                                        parseInt(watch(`order[${i}].quantity`))
                                      )
                                        ? 1
                                        : parseInt(
                                            watch(`order[${i}].quantity`)
                                          );
                                      setValue(
                                        `order[${i}].quantity`,
                                        quantityNum + 1
                                      );
                                      onSameRowAction(index);
                                      enqueueSnackbar(
                                        `Same product found in Row ${
                                          i + 1
                                        } and ${index + 1}, merged together!`,
                                        { variant: "success" }
                                      );
                                    }
                                  }
                                } else
                                  setValue(
                                    `order[${index}].productName`,
                                    data ? data : ""
                                  );
                              } else {
                                setValue(`order[${index}].productName`, "");
                                setValue(`order[${index}].productID`, "");
                                setValue(`order[${index}].rate`, "");
                                setValue(`order[${index}].tax`, "");
                                enableCurrentProductRow(index);
                              }
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
                        name={`order[${index}].quantity`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            className="bg-white custom-input-height"
                            type="number"
                            autoComplete="off"
                            error={!!errors?.order?.[index]?.quantity}
                            // helperText={
                            //   errors?.order?.[index]?.quantity?.message
                            // }
                            variant="outlined"
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
                            disabled={disableRowIndexes.includes(index)}
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
                            error={!!errors.discount}
                            helperText={errors?.discount?.message}
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
                                defaultValue={defaultTaxValue}
                                className="custom-select-create-order"
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
                  Add Item
                </Button>
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
                                  ? new Date().setDate(new Date().getDate() + 1)
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
                  <div></div>
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
                            customData?.orderBy === "sms"
                              ? "create-order-capsule-button-active"
                              : "create-order-capsule-button"
                          }`}
                          startIcon={
                            <CheckIcon
                              className={
                                customData?.orderBy === "sms"
                                  ? "text-primary-500 icon-size-20"
                                  : "icon-size-20"
                              }
                            />
                          }
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
                          startIcon={
                            <CheckIcon
                              className={
                                customData?.orderBy === "email"
                                  ? "text-primary-500 icon-size-20"
                                  : "icon-size-20"
                              }
                            />
                          }
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
                        <Button
                          variant="outlined"
                          className={`body2 ${
                            customData?.orderBy === "invoice"
                              ? "create-order-capsule-button-active"
                              : "create-order-capsule-button"
                          }`}
                          startIcon={
                            <CheckIcon
                              className={
                                customData?.orderBy === "invoice"
                                  ? "text-primary-500 icon-size-20"
                                  : "icon-size-20"
                              }
                            />
                          }
                          onClick={() => {
                            setCustomData({
                              ...customData,
                              orderBy: "invoice",
                              isCeditCheck: false,
                              paymentMethod: ["invoice"],
                            });
                          }}
                        >
                          {t("label:invoice")}
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* <div className="send-order-by mt-20">
                    <div className="caption2 text-MonochromeGray-300">
                      Payment Methods*{" "}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-20 w-full md:w-3/4 my-32">
                      <Button
                        variant="outlined"
                        className={`body2 ${
                          customData?.paymentMethod.includes("visa")
                            ? "create-order-capsule-active"
                            : "create-order-capsule"
                        }`}
                        startIcon={
                          <CheckIcon
                            className={
                              customData?.paymentMethod.includes("visa")
                                ? "text-primary-500 icon-size-20"
                                : "icon-size-20"
                            }
                          />
                        }
                        onClick={() => {
                          customData?.paymentMethod.includes("visa")
                            ? setCustomData({
                                ...customData,
                                paymentMethod: customData.paymentMethod.filter(
                                  (pm) => pm !== "visa"
                                ),
                                isCeditCheck: false,
                              })
                            : setCustomData({
                                ...customData,
                                paymentMethod: [
                                  ...customData.paymentMethod,
                                  "visa",
                                ],
                                isCeditCheck: false,
                              });
                        }}
                        disabled={customData.orderBy === "invoice"}
                      >
                        Visa
                      </Button>
                      <Button
                        variant="outlined"
                        className={`body2 px-10 ${
                          customData?.paymentMethod.includes("mastercard")
                            ? "create-order-capsule-active"
                            : "create-order-capsule"
                        }`}
                        startIcon={
                          <CheckIcon
                            className={
                              customData?.paymentMethod.includes("mastercard")
                                ? "text-primary-500 icon-size-20"
                                : "icon-size-20"
                            }
                          />
                        }
                        onClick={() => {
                          customData?.paymentMethod.includes("mastercard")
                            ? setCustomData({
                                ...customData,
                                paymentMethod: customData.paymentMethod.filter(
                                  (pm) => pm !== "mastercard"
                                ),
                                isCeditCheck: false,
                              })
                            : setCustomData({
                                ...customData,
                                paymentMethod: [
                                  ...customData.paymentMethod,
                                  "mastercard",
                                ],
                                isCeditCheck: false,
                              });
                        }}
                        disabled={customData.orderBy === "invoice"}
                      >
                        Mastercard
                      </Button>
                      <Button
                        variant="outlined"
                        className={`body2 ${
                          customData?.paymentMethod.includes("vipps")
                            ? "create-order-capsule-active"
                            : "create-order-capsule"
                        }`}
                        startIcon={
                          <CheckIcon
                            className={
                              customData?.paymentMethod.includes("vipps")
                                ? "text-primary-500 icon-size-20"
                                : "icon-size-20"
                            }
                          />
                        }
                        onClick={() => {
                          customData?.paymentMethod.includes("vipps")
                            ? setCustomData({
                                ...customData,
                                paymentMethod: customData.paymentMethod.filter(
                                  (pm) => pm !== "vipps"
                                ),
                                isCeditCheck: false,
                              })
                            : setCustomData({
                                ...customData,
                                paymentMethod: [
                                  ...customData.paymentMethod,
                                  "vipps",
                                ],
                                isCeditCheck: false,
                              });
                        }}
                        disabled={customData.orderBy === "invoice"}
                      >
                        VIPPS
                      </Button>
                      <Button
                        variant="outlined"
                        className={`body2 ${
                          customData?.paymentMethod.includes("invoice")
                            ? "create-order-capsule-active"
                            : "create-order-capsule"
                        }`}
                        startIcon={
                          <CheckIcon
                            className={
                              customData?.paymentMethod.includes("invoice")
                                ? "text-primary-500 icon-size-20"
                                : "icon-size-20"
                            }
                          />
                        }
                        onClick={() => {
                          customData.orderBy === "sms" ||
                          customData.orderBy === "email"
                            ? customData?.paymentMethod.includes("invoice")
                              ? setCustomData({
                                  ...customData,
                                  paymentMethod:
                                    customData.paymentMethod.filter(
                                      (pm) => pm !== "invoice"
                                    ),
                                  isCeditCheck: false,
                                })
                              : setCustomData({
                                  ...customData,
                                  paymentMethod: [
                                    ...customData.paymentMethod,
                                    "invoice",
                                  ],
                                })
                            : setCustomData({
                                ...customData,
                                paymentMethod: [
                                  ...customData.paymentMethod,
                                  "invoice",
                                ],
                                isCeditCheck: false,
                              });
                        }}
                      >
                        Invoice
                      </Button>
                    </div>
                  </div> */}
                  <div className="send-order-by mt-20">
                    <div className="subtitle3 text-MonochromeGray-500">
                      {t("label:creditCheckFlagOrderPage")}
                    </div>
                    <div className="body3 text-MonochromeGray-300">
                      {t("label:creditCheckDetailsOrderPage")}
                    </div>
                    <div className="send-order-credit-check">
                      <div className="flex gap-20 w-full md:w-3/4 my-32">
                        <Button
                          variant="outlined"
                          className={`body2 ${
                            customData?.isCeditCheck === true
                              ? "create-order-capsule-button-active"
                              : "create-order-capsule-button"
                          }`}
                          onClick={() => {
                            setCustomData({
                              ...customData,
                              isCeditCheck: true,
                            });
                          }}
                          disabled={
                            !(
                              (customData.orderBy === "sms" ||
                                customData.orderBy === "email") &&
                              customData.paymentMethod.includes("invoice")
                            )
                          }
                        >
                          {t("label:yes")}
                        </Button>
                        <Button
                          variant="outlined"
                          className={`body2 ${
                            customData?.isCeditCheck === false
                              ? "create-order-capsule-button-active"
                              : "create-order-capsule-button"
                          }`}
                          onClick={() => {
                            setCustomData({
                              ...customData,
                              isCeditCheck: false,
                            });
                          }}
                        >
                          {t("label:no")}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="accordion-for-customer-details">
                    <Accordion
                      className={`${
                        !expandedPanel2 ? "bg-primary-25" : "bg-primary-700"
                      } mt-20 bg-primary-25 shadow-0 border-0 custom-accordion`}
                    >
                      <AccordionSummary
                        expandIcon={
                          !expandedPanel2 ? (
                            <IoMdAdd className="icon-size-20" />
                          ) : (
                            <FiMinus
                              className={`icon-size-20 ${
                                !expandedPanel2 ? "" : "text-white"
                              }`}
                            />
                          )
                        }
                        onClick={() => setExpandedPanel2(!expandedPanel2)}
                        id="panel2a-header"
                      >
                        <div
                          className={`subtitle3  flex gap-10 my-auto items-center ${
                            !expandedPanel2
                              ? "text-MonochromeGray-700"
                              : "text-white"
                          }`}
                        >
                          <div className="my-auto mt-2">
                            {t("label:customerDetails")}
                          </div>

                          <span>
                            {(dirtyFields.primaryPhoneNumber &&
                              dirtyFields.email &&
                              dirtyFields.customerName &&
                              dirtyFields.billingAddress &&
                              dirtyFields.billingZip &&
                              dirtyFields.billingCity &&
                              dirtyFields.billingCountry &&
                              dirtyFields.orgorPID) ||
                            dirtyFields.searchCustomer ? (
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
                                getOptionLabel={(option) => option.searchString}
                                className=""
                                fullWidth
                                onChange={(_, data) => {
                                  if (data) {
                                    clearErrors(["pNumber", "orgID"]);
                                    setRecheckSchema(false);
                                    setCustomerSearchBy(undefined);
                                    setCustomerSearchBoxLength(0);
                                    setValue("primaryPhoneNumber", data.phone);
                                    setValue("email", data.email);
                                    setValue("customerName", data.name);
                                    data.type === "Corporate"
                                      ? setValue("orgID", data.orgOrPNumber)
                                      : setValue("pNumber", data.orgOrPNumber);
                                    setValue("billingAddress", data.street);
                                    setValue("billingZip", data.zip);
                                    setValue("billingCity", data.city);
                                    setValue("billingCountry", data.country);
                                    data.type === "Corporate"
                                      ? setCustomData({
                                          ...customData,
                                          customerType: "corporate",
                                        })
                                      : setCustomData({
                                          ...customData,
                                          customerType: "private",
                                        });
                                    // data.type === "Corporate"
                                    //   ? setSelectedFromList("Corporate")
                                    //   : setSelectedFromList("Private");
                                  } else {
                                    setValue("primaryPhoneNumber", "");
                                    setValue("email", "");
                                    setValue("customerName", "");
                                    setValue("orgID", "");
                                    setValue("pNumber", "");
                                    setValue("billingAddress", "");
                                    setValue("billingZip", "");
                                    setValue("billingCity", "");
                                    setValue("billingCountry", "");
                                    // setSelectedFromList(null);
                                  }
                                  return onChange(data);
                                }}
                                renderOption={(props, option, { selected }) => (
                                  <MenuItem {...props}>
                                    {/*{`${option.name}`}*/}
                                    {customerSearchBy ? (
                                      <div>
                                        {customerSearchBy === "name" &&
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
                                    //className='custom-input-height-div'
                                    inputRef={ref}
                                    onChange={searchCustomerOnFocus}
                                    // placeholder="Search by Name or Phone Number"
                                    placeholder={t(
                                      "label:searchByNameOrPhoneNo"
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
                                // setValue("orgID", "");
                                // setValue("pNumber", "");
                              }}
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
                                // setValue("orgID", "");
                                // setValue("pNumber", "");
                              }}
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
                                    // specialLabel={
                                    //   customData.customerType === "corporate"
                                    //     ? t("label:phone")
                                    //     : `${t("label:phone")}*`
                                    // }
                                    specialLabel={`${t("label:phone")}*`}
                                    // onBlur={handleOnBlurGetDialCode}
                                    value={field.value || ""}
                                  />
                                  <FormHelperText>
                                    {errors?.email?.message
                                      ? t(
                                          `validation:${errors?.email?.message}`
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
                                  // required={
                                  //   customData.customerType === "corporate" ||
                                  //   customData.orderBy === "email"
                                  // }
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
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:organizationId")}
                                      type="number"
                                      autoComplete="off"
                                      error={!!errors.orgID}
                                      required
                                      helperText={
                                        errors?.orgID?.message
                                          ? t(
                                              `validation:${errors?.orgID?.message}`
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
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:pNumber")}
                                      type="number"
                                      autoComplete="off"
                                      error={!!errors.pNumber}
                                      helperText={
                                        errors?.pNumber?.message
                                          ? t(
                                              `validation:${errors?.pNumber?.message}`
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
                              {/*<Controller*/}
                              {/*  name="orgorPID"*/}
                              {/*  control={control}*/}
                              {/*  render={({ field }) => (*/}
                              {/*    <TextField*/}
                              {/*      {...field}*/}
                              {/*      label={*/}
                              {/*        customData.customerType === "private"*/}
                              {/*          ? t("label:pNumber")*/}
                              {/*          : t("label:organizationId")*/}
                              {/*      }*/}
                              {/*      type="number"*/}
                              {/*      autoComplete="off"*/}
                              {/*      error={!!errors.orgorPID}*/}
                              {/*      required={*/}
                              {/*        customData.customerType === "corporate"*/}
                              {/*      }*/}
                              {/*      helperText={*/}
                              {/*        errors?.orgorPID?.message*/}
                              {/*          ? t(*/}
                              {/*              `validation:${errors?.orgorPID?.message}`*/}
                              {/*            )*/}
                              {/*          : ""*/}
                              {/*      }*/}
                              {/*      variant="outlined"*/}
                              {/*      fullWidth*/}
                              {/*      value={field.value || ""}*/}
                              {/*    />*/}
                              {/*  )}*/}
                              {/*/>*/}
                            </div>
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
                                control={control}
                                render={({ field }) => (
                                  <FormControl
                                    error={!!errors.billingCountry}
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
                                      {errors?.billingCity?.message
                                        ? t(
                                            `validation:${errors?.billingCity?.message}`
                                          )
                                        : ""}
                                      {errors?.billingCountry?.message}
                                    </FormHelperText>
                                  </FormControl>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <div className="my-20">
                      <Accordion
                        className={`${
                          !expanded0 ? "bg-primary-25" : "bg-primary-700"
                        }  bg-primary-25 shadow-0 border-0 custom-accordion`}
                      >
                        <AccordionSummary
                          expandIcon={
                            !expanded0 ? (
                              <IoMdAdd className="icon-size-20" />
                            ) : (
                              <FiMinus
                                className={`icon-size-20 ${
                                  !expanded0 ? "" : "text-white"
                                }`}
                              />
                            )
                          }
                          onClick={() => setExpanded0(!expanded0)}
                          id="panel1a-header"
                        >
                          <div
                            className={`subtitle3  flex gap-10 my-auto ${
                              !expanded0
                                ? "text-MonochromeGray-700"
                                : "text-white"
                            }`}
                          >
                            {t("label:invoiceReferences")}
                            <span>
                              {dirtyFields.referenceNumber &&
                              dirtyFields.customerReference &&
                              dirtyFields.receiptNo &&
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
                                          ? t(
                                              `validation:${errors?.receiptNo?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      inputlabelprops={{
                                        shrink:
                                          !!field.value ||
                                          touchedFields.receiptNo,
                                      }}
                                    />
                                  )}
                                />
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32 my-32">
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
                              </div>
                            </div>
                          </div>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                    <div className="my-20">
                      <Accordion
                        className={`${
                          !expanded1 ? "bg-primary-25" : "bg-primary-700"
                        }  bg-primary-25 shadow-0 border-0 custom-accordion`}
                      >
                        <AccordionSummary
                          expandIcon={
                            !expanded1 ? (
                              <IoMdAdd className="icon-size-20" />
                            ) : (
                              <FiMinus
                                className={`icon-size-20 ${
                                  !expanded1 ? "" : "text-white"
                                }`}
                              />
                            )
                          }
                          onClick={() => setExpanded1(!expanded1)}
                          id="panel1a-header"
                        >
                          <div
                            className={`subtitle3  flex gap-10 my-auto ${
                              !expanded1
                                ? "text-MonochromeGray-700"
                                : "text-white"
                            }`}
                          >
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-32 my-20">
                                <Controller
                                  name="internalReferenceNo"
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:internalReferenceNo")}
                                      type="number"
                                      autoComplete="off"
                                      error={!!errors.internalReferenceNo}
                                      helperText={
                                        errors?.internalReferenceNo?.message
                                          ? t(
                                              `validation:${errors?.internalReferenceNo?.message}`
                                            )
                                          : ""
                                      }
                                      variant="outlined"
                                      fullWidth
                                      inputlabelprops={{
                                        shrink:
                                          !!field.value ||
                                          touchedFields.internalReferenceNo,
                                      }}
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
                                      autoComplete="off"
                                      error={!!errors.customerNotesInternal}
                                      helperText={
                                        errors?.customerNotesInternal?.message
                                          ? t(
                                              `validation:${errors?.customerNotesInternal?.message}`
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
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </div>
                  <Hidden smDown>
                    <div className="flex justify-end items-end mt-32">
                      {/*<Button*/}
                      {/*  color="secondary"*/}
                      {/*  variant="contained"*/}
                      {/*  className="font-semibold rounded-4 w-full sm:w-auto"*/}
                      {/*  type="submit"*/}
                      {/*  startIcon={<SendIcon />}*/}
                      {/*  disabled={!(isValid)}*/}
                      {/*>*/}
                      {/*  {t("label:sendOrder")}*/}
                      {/*</Button>*/}
                      <LoadingButton
                        color="secondary"
                        variant="contained"
                        className="font-semibold rounded-4 w-full sm:w-auto"
                        type="submit"
                        // disabled={!(isValid && customData.paymentMethod.length)}
                        disabled={!isValid}
                        startIcon={<SendIcon />}
                        loading={loading}
                        loadingPosition="center"
                      >
                        {t("label:createOrder")}
                      </LoadingButton>
                    </div>
                  </Hidden>
                </div>
              </div>
              <div className="col-span-2 mx-10 sm:mx-0">
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
                        {ThousandSeparator(subTotal.toFixed(2) / 2)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center  my-20">
                      <div className="subtitle3 text-MonochromeGray-700">
                        {t("label:tax")}
                      </div>
                      <div className="body3 text-MonochromeGray-700">
                        {t("label:nok")}{" "}
                        {ThousandSeparator(totalTax.toFixed(2) / 2)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center  my-20">
                      <div className="subtitle3 text-MonochromeGray-700">
                        {t("label:discount")}
                      </div>
                      <div className="body3 text-MonochromeGray-700">
                        {t("label:nok")}{" "}
                        {ThousandSeparator(totalDiscount.toFixed(2) / 2)}
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
                        {ThousandSeparator(grandTotal.toFixed(2) / 2)}
                      </div>
                    </div>
                  </div>
                  <div className="mt-10 mb-20 body3 px-32">
                    {t("label:orderSummaryDetails")}
                  </div>
                </div>
              </div>
              <Hidden smUp>
                <div className="flex justify-end items-end mt-32 mb-44 mx-10 sm:mx-0">
                  {/*<Button*/}
                  {/*  color="secondary"*/}
                  {/*  variant="contained"*/}
                  {/*  className="font-semibold rounded-4 w-full sm:w-auto"*/}
                  {/*  type="submit"*/}
                  {/*  startIcon={<SendIcon />}*/}
                  {/*  // disabled={!(isValid && customData.paymentMethod.length)}*/}
                  {/*  disabled={!isValid}*/}
                  {/*>*/}
                  {/*  {t("label:sendOrder")}*/}
                  {/*</Button>*/}
                  <LoadingButton
                    color="secondary"
                    variant="contained"
                    className="font-semibold rounded-4 w-full sm:w-auto"
                    type="submit"
                    // disabled={!(isValid && customData.paymentMethod.length)}
                    disabled={!isValid}
                    startIcon={<SendIcon />}
                    loading={loading}
                    loadingPosition="center"
                  >
                    {t("label:createOrder")}
                  </LoadingButton>
                </div>
              </Hidden>
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
                {/*<Button*/}
                {/*  color="secondary"*/}
                {/*  variant="contained"*/}
                {/*  type="submit"*/}
                {/*  className="rounded-full bg-primary-500 button2 py-5"*/}
                {/*  disabled={!isValid}*/}
                {/*  sx={{*/}
                {/*    "&.Mui-disabled": {*/}
                {/*      background: "#eaeaea",*/}
                {/*      color: "#c0c0c0"*/}
                {/*    }*/}
                {/*  }}*/}
                {/*  startIcon={<RedoIcon />}*/}
                {/*>*/}
                {/*  {t("label:sendOrder")}*/}
                {/*</Button>*/}
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
                  {t("label:createOrder")}
                </LoadingButton>
              </div>
            </Hidden>
          </form>
        </div>
      </div>

      <DiscardConfirmModal
        open={open}
        defaultValue={CreateOrderDefaultValue}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};

export default createOrder;
