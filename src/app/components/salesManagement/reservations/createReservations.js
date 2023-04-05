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

const ReservationCreate = () => {
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
    getFieldState,
    trigger,
    setError,
    setFocus,
    clearErrors,
  } = useForm({
    mode: "all",
    CreateOrderDefaultValue,
    // reValidateMode: "all",
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
        customer?.name && customer.name.toLowerCase().startsWith(e.target.value.toLowerCase())
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

    return (
        <>
            <div className="inside-div-product">
                <div className="rounded-sm bg-white p-0 md:px-20">
                <form
                    name="createOrderForm"
                    noValidate
                    onSubmit={handleSubmit(onSubmit)}
                >
                        <div className=" header-click-to-action ">
                        <div className="header-text header6  flex items-center justify-start w-full sm:w-auto px-16 sm:px-0">
                        Create Reservation
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
                                disabled={!isValid}
                                startIcon={<SendIcon />}
                                loading={loading}
                                loadingPosition="center"
                            >
                                {t("label:sendOrder")}
                            </LoadingButton>
                            </div>
                        </Hidden>
                        </div>
                        <div className="search-customer-order-create my-32">
                            <Controller
                            control={control}
                            name="searchCustomer"
                            render={({
                                field: { ref, onChange, ...field },
                            }) => (
                                <Autocomplete
                                freeSolo
                                options={customersList}
                                //forcePopupIcon={<Search />}
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
                                    //className='custom-input-height-div'
                                    inputRef={ref}
                                    onChange={searchCustomerOnFocus}
                                    // placeholder="Search by Name or Phone Number"
                                    placeholder="Search customers by name or phone number"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="end">
                                              <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                    />
                                )}
                                />
                            )}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ReservationCreate;