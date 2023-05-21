import { DesktopDatePicker, LoadingButton } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Button,
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
import DiscardConfirmModal from "../../common/confirmDiscard";
import { quickOrderDefaultValue, quickOrderValidation } from "../utils/helper";
import InfoIcon from "@mui/icons-material/Info";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CharCount from "../../common/charCount";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import SendInvoiceModal from "./sendInvoiceModal";
import RedoIcon from "@mui/icons-material/Redo";
import { yupResolver } from "@hookform/resolvers/yup";
import AuthService from "../../../data-access/services/authService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import UtilsServices from "../../../data-access/utils/UtilsServices";
import { useCreateQuickOrderMutation } from "app/store/api/apiSlice";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { useSnackbar } from "notistack";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import { useNavigate } from "react-router-dom";
import FuseUtils from "@fuse/utils";
import { Cancel } from "@mui/icons-material";

const createProducts = () => {
  const { t } = useTranslation();
  const userInfo = UtilsServices.getFPUserData();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [productsList, setProductsList] = useState([]);
  const [customersList, setCustomersList] = useState([]);
  const [searchCustomersList, setSearchCustomersList] = useState([]);
  const [addOrderIndex, setAddOrderIndex] = React.useState([0, 1, 2]);
  const [itemLoader, setItemLoader] = useState(false);
  const [searchCustomerPrefixCountryCode, setSearchCustomerPrefixCountryCode] = useState("+47");
  const [customerSearchBoxDropdownOpen, setCustomerSearchBoxDropdownOpen] =
    useState(false);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [taxes, setTaxes] = React.useState([]);
  const [val, setVal] = useState([]);
  const [newCustomer, setNewCustomer] = useState([]);
  const [customerSearchBoxLength, setCustomerSearchBoxLength] = useState(0);
  const [customerSearchBy, setCustomerSearchBy] = useState(undefined);
  const [createQuickOrder, response] = useCreateQuickOrderMutation();
  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let grandTotal = 0;

  let defaultTaxValue;

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
  const enableCurrentProductRow = (ind) => {
    setDisableRowIndexes(disableRowIndexes.filter((item) => item !== ind));
  };
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [searchText, setSearchText] = useState("");

  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
    watch,
    resetField,
  } = useForm({
    mode: "onChange",
    quickOrderDefaultValue,
    resolver: yupResolver(quickOrderValidation),
  });
  const { isValid, dirtyFields, errors, touchedFields } = formState;

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
                  searchString:
                  // row?.name + " ( " + row?.phone + " )" + row.uuid,
                    row?.phone.toString().slice(3) + row.uuid,
                });
              });
          }
          setCustomersList(data);
          setSearchCustomersList(data);
        })
        .catch((e) => {
          setCustomersList([]);
          setSearchCustomersList([]);
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

  const watchRate = watch(`order[${Math.min(...addOrderIndex)}].rate`) || "";

  const pnameOnBlur = (e) => {
    if (!e.target.value.length) {
      resetField(`${e.target.name}`);
    }
  };
  const onSubmit = (values) => {
    setLoading(true);
    subTotal = (subTotal / 2).toFixed(2);
    totalTax = (totalTax / 2).toFixed(2);
    totalDiscount = (totalDiscount / 2).toFixed(2);
    grandTotal = (grandTotal / 2).toFixed(2);
    const data = OrdersService.prepareCreateQuickOrderPayload({
      ...values,
      orderSummary: {
        subTotal,
        totalTax,
        totalDiscount,
        grandTotal,
      },
      customers: [...val],
    });
    createQuickOrder(data).then((response) => {
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
    // setLoading(false);
  };
  const handleDelete = () => {
    console.info("Clicked.");
  };

  const searchCustomerOnFocus = (e) => {
    setSearchText(e.target.value);

    setCustomerSearchBoxDropdownOpen(false);
    const searchByPhone =
      customersList.filter((customer) =>
        customer.searchString.startsWith(e.target.value)
      ) || [];
    // const searchByName =
    //   customersList.filter(
    //     (customer) =>
    //       customer?.name &&
    //       customer.name.toLowerCase().startsWith(e.target.value.toLowerCase())
    //   ) || [];
    // setSearchCustomersList(
    //   searchByName.length
    //     ? searchByName
    //     : searchByPhone.length
    //     ? searchByPhone
    //     : []
    // );
    // setCustomerSearchBy(
    //   searchByName.length ? "name" : searchByPhone.length ? "phone" : undefined
    // );
    setSearchCustomersList(
      searchByPhone.length
      ? searchByPhone
      : customersList
    );
    setCustomerSearchBy(searchByPhone.length ? "phone" : undefined);
    setCustomerSearchBoxLength(e.target.value.length ? 3+e.target.value.length : e.target.value.length);
    setCustomerSearchBoxDropdownOpen(true);
  };

  const valHtml = val.map((option, index) => {
    // This is to handle new options added by the user (allowed by freeSolo prop).
    const label = option.name || option.phone;
    const isExistingCustomer = option?.name || null;
    return isExistingCustomer ? (
      <Chip
        label={label}
        className="body3 mr-4 mb-4"
        onDelete={() => {
          setVal(val.filter((entry) => entry !== option));
        }}
        sx={{
          backgroundColor: "#E6F3F7",
          "& .MuiChip-deleteIcon": {
            color: "#000",
          },
        }}
      />
    ) : (
      <Chip
        label={label}
        className="body3 mr-4 mb-4"
        onDelete={() => {
          setVal(val.filter((entry) => entry !== option));
        }}
        sx={{
          backgroundColor: "#EFEFEF",
          "& .MuiChip-deleteIcon": {
            color: "#000",
          },
        }}
      />
    );
  });

  const disableCurrentProductRow = (index) => {
    setDisableRowIndexes([...disableRowIndexes, index]);
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

  const watchOrderDate = watch(`orderDate`)
    ? watch(`orderDate`)
    : setValue("orderDate", new Date());
  const watchDueDatePaymentLink = watch(`dueDatePaymentLink`);

  useEffect(() => {
    if (
      watchOrderDate &&
      watchOrderDate.getMonth() === new Date().getMonth() &&
      watchOrderDate.getDate() >= new Date().getDate()
    ) {
      setValue(
        "dueDatePaymentLink",
        new Date().setDate(watchOrderDate.getDate() + 2)
      );
    } else if (
      watchOrderDate &&
      watchOrderDate.getMonth() > new Date().getMonth()
    ) {
      let dueDate = new Date(new Date().setMonth(watchOrderDate.getMonth()));
      dueDate = dueDate.setDate(watchOrderDate.getDate() + 2);
      setValue("dueDatePaymentLink", new Date(dueDate));
    } else if (
      watchOrderDate &&
      (watchOrderDate.getMonth() < new Date().getMonth() ||
        (watchOrderDate.getMonth() === new Date().getMonth() &&
          watchOrderDate.getDate() < new Date().getDate()))
    ) {
      setValue(
        "dueDatePaymentLink",
        new Date().setDate(new Date().getDate() + 2)
      );
    }
  }, [watch(`orderDate`)]);

  const setDueDateMinDate = () => {
    if (
      watchOrderDate &&
      watchOrderDate.getMonth() === new Date().getMonth() &&
      watchOrderDate.getDate() >= new Date().getDate()
    ) {
      return new Date().setDate(watchOrderDate.getDate() + 1);
    } else if (
      watchOrderDate &&
      watchOrderDate.getMonth() > new Date().getMonth()
    ) {
      let dueDate = new Date(new Date().setMonth(watchOrderDate.getMonth()));
      dueDate = dueDate.setDate(watchOrderDate.getDate() + 1);
      return new Date(dueDate);
    } else if (
      watchOrderDate &&
      (watchOrderDate.getMonth() < new Date().getMonth() ||
        (watchOrderDate.getMonth() === new Date().getMonth() &&
          watchOrderDate.getDate() < new Date().getDate()))
    ) {
      return new Date().setDate(new Date().getDate() + 1);
    }
  };

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white">
          <form
            name="quickOrderForm"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className=" header-click-to-action">
              <div className="header-text header6">{t("label:quickOrder")}</div>
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
                  variant="contained"
                  color="secondary"
                  className="rounded-4 button2"
                  aria-label="Confirm"
                  size="large"
                  type="submit"
                  loading={loading}
                  loadingPosition="center"
                  disabled={!isValid || val.length === 0 || !watchRate}
                >
                  {t("label:sendOrder")}
                </LoadingButton>
              </div>
            </div>
            <div className="p-10 md:p-20">
              <Controller
                control={control}
                name="searchCustomer"
                render={({ field: { ref, onChange, ...field } }) => (
                  <Autocomplete
                    open={customerSearchBoxDropdownOpen}
                    multiple
                    disablePortal
                    // freeSolo
                    // filterSelectedOptions
                    options={searchCustomersList}
                    getOptionLabel={(option) => option.searchString}
                    renderTags={() => {}}
                    fullWidth
                    onChange={(e, newValue, reason) => {
                      if (reason !== "removeOption") {
                        setCustomerSearchBy(undefined);
                        setCustomerSearchBoxLength(0);
                        setVal(newValue);
                        setSearchCustomersList(customersList)
                      }
                    }}
                    onInputChange={(event, value) => {
                      setNewCustomer(searchCustomerPrefixCountryCode+value);
                      if (value.length === 0) setCustomerSearchBy(undefined);
                    }}
                    onClose={() => setCustomerSearchBoxDropdownOpen(false)}
                    value={val}
                    noOptionsText={
                      <div className="flex items-center justify-between my-2">
                        <span className="subtitle3 font-600">
                          {t("label:noCustomersFound")}
                        </span>
                        {
                          !isNaN(newCustomer) && (
                            <Button
                              variant="contained"
                              color="secondary"
                              size={"medium"}
                              className="rounded-4 button2 min-w-[104px]"
                              type="button"
                              startIcon={<AddIcon fontSize="small" />}
                              onClick={() => {
                                setVal([
                                  ...val,
                                  { name: "", phone: `${newCustomer}` },
                                ]);
                                setCustomerSearchBoxDropdownOpen(false);
                              }}
                            >
                              {t(`label:add`)}
                            </Button>
                          )
                        }
                      </div>
                    }
                    renderOption={(props, option, { selected }) => (
                      <MenuItem {...props}>
                        {/*{`${option.name}`}*/}
                        {customerSearchBy ? (
                          <div>
                            {customerSearchBy === "phone" &&
                            customerSearchBoxLength > 0 ? (
                              <div>
                                <div>{`${option.name}`}</div>
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
                              </div>
                            ) : (
                              <div>
                                <div>{`${option.name}`}</div>
                                <div>{`${option.phone}`}</div>
                              </div>
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
                        {...params}
                        onChange={searchCustomerOnFocus}
                        onClick={() =>
                          setCustomerSearchBoxDropdownOpen(
                            !customerSearchBoxDropdownOpen
                          )
                        }
                        className="mt-10 w-full sm:w-2/4"
                        placeholder={t("label:searchCustomersByPhoneNo")}
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <div>
                              {searchCustomerPrefixCountryCode}
                            </div>
                          ),
                        }}
                      />
                    )}
                  />
                  // <Autocomplete
                  //   disablePortal
                  //   options={customerData}
                  //   getOptionLabel={(option) => option.label}
                  //   className=""
                  //   fullWidth
                  //   noOptionsText={
                  //     <div className="flex items-center justify-between my-2">
                  //       <span className="subtitle3 font-600">
                  //         No customers found
                  //       </span>
                  //       <Button
                  //         variant="contained"
                  //         color="secondary"
                  //         size={"medium"}
                  //         className="rounded-4 button2 min-w-[104px]"
                  //         type="button"
                  //         startIcon={<AddIcon fontSize="small" />}
                  //         onClick={() => console.log("add")}
                  //       >
                  //         {t(`label:add`)}
                  //       </Button>
                  //     </div>
                  //   }
                  //   onChange={(_, data) => onChange}
                  //   renderOption={(props, option, { selected }) => (
                  //     <MenuItem {...props}>
                  //       <div>
                  //         <div>{option.value}</div>
                  //         <div>{option.label}</div>
                  //       </div>
                  //     </MenuItem>
                  //   )}
                  //   renderInput={(params) => (
                  //     <TextField
                  //       id="searchBox"
                  //       className="mt-10 w-full sm:w-2/4"
                  //       {...params}
                  //       {...field}
                  //       inputRef={ref}
                  //       // onChange={}
                  //       placeholder={t("label:searchByNameOrPhoneNo")}
                  //       error={!!errors.searchCustomer}
                  //       helperText={
                  //         errors?.searchCustomer?.message
                  //           ? t(`validation:${errors?.searchCustomer?.message}`)
                  //           : ""
                  //       }
                  //     />
                  //   )}
                  // />
                )}
              />
              <div className="flex gap-5 m-5 items-center">
                <InfoIcon className="text-primary-500 h-[15px] w-[15px]" />
                <span className="body4 text-m-grey-500">
                  {t("label:multipleCustomersCanBeAdded")}
                </span>
              </div>
              <div className="my-20">
                <Stack direction="row" spacing={1}>
                  {/*<Chip*/}
                  {/*  label="Arlene McCoy"*/}
                  {/*  className="body3"*/}
                  {/*  onDelete={handleDelete}*/}
                  {/*  sx={{*/}
                  {/*    backgroundColor: "#E6F3F7",*/}
                  {/*  }}*/}
                  {/*/>*/}
                  {/*<Chip*/}
                  {/*  label="+47 474 34 668"*/}
                  {/*  className="body3"*/}
                  {/*  onDelete={handleDelete}*/}
                  {/*  sx={{*/}
                  {/*    backgroundColor: "#EFEFEF",*/}
                  {/*  }}*/}
                  {/*/>*/}
                  <div className="selectedTags">{valHtml}</div>
                </Stack>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-20 my-32">
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
                      onChange={onChange}
                      minDate={new Date().setDate(new Date().getDate() - 30)}
                      maxDate={new Date().setDate(new Date().getDate() + 30)}
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
                              ? t(`validation:${errors?.orderDate?.message}`)
                              : ""
                          }
                          sx={{
                            svg: { color: "#E7AB52" },
                          }}
                        />
                      )}
                    />
                  )}
                />
                <Controller
                  name="dueDatePaymentLink"
                  control={control}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <DesktopDatePicker
                      label={t("label:dueDateForPaymentLink")}
                      mask=""
                      inputFormat="dd.MM.yyyy"
                      value={
                        !value
                          ? new Date().setDate(new Date().getDate() + 2)
                          : value
                        // : value
                      }
                      required
                      onChange={onChange}
                      minDate={
                        watchOrderDate
                          ? setDueDateMinDate()
                          : new Date().setDate(new Date().getDate() - 30)
                      }
                      disablePast={true}
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
                          error={!!errors.dueDatePaymentLink}
                          helperText={
                            errors?.dueDatePaymentLink?.message
                              ? t(
                                  `validation:${errors?.dueDatePaymentLink?.message}`
                                )
                              : ""
                          }
                          sx={{
                            svg: { color: "#F36562" },
                          }}
                        />
                      )}
                    />
                  )}
                />
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
                          ? t(`validation:${errors?.referenceNumber?.message}`)
                          : ""
                      }
                      variant="outlined"
                      fullWidth
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
                    />
                  )}
                />
              </div>
              <Hidden smUp>
                <div>
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
                          {t("label:addItem")}
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
                            render={({
                              field: { ref, onChange, ...field },
                            }) => (
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
                                            } and ${
                                              index + 1
                                            }, merged together!`,
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
                                      //value={field.value || ""}
                                      defaultValue={defaultTaxValue}
                                      className="col-span-1"
                                      disabled={disableRowIndexes.includes(
                                        index
                                      )}
                                      inputlabelprops={{
                                        shrink:
                                          !!field.value || touchedFields.tax,
                                      }}
                                    >
                                      {taxes && taxes.length ? (
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
                            {t("label:removeItem")}
                          </Button>
                        </div>
                      ))}
                      <div className="bg-MonochromeGray-50 p-20 subtitle2 text-MonochromeGray-700">
                        {t("label:grandTotal")} : {t("label:nok")}{" "}
                        {ThousandSeparator(grandTotal.toFixed(2) / 2)}
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
                                    const preparedPrice = data.price
                                      .toString()
                                      .includes(".")
                                      ? `${
                                          data.price.toString().split(".")[0]
                                        },${
                                          data.price.toString().split(".")[1]
                                        }`
                                      : data.price;
                                    setValue(
                                      `order[${index}].rate`,
                                      preparedPrice
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
                                helperText={
                                  errors?.order?.[index]?.tax?.message
                                }
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
                        <div
                          className="body3 text-right"
                          onClick={() => setEditOpen(true)}
                        >
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
                    {t("label:addItem")}
                  </Button>
                  <hr className=" mt-20 border-half-bottom" />
                </div>
              </Hidden>
              <div className="grid grid-cols-1 md:grid-cols-6 my-20">
                <div className="col-span-1 md:col-span-3 mt-20 flex flex-col gap-y-20 pb-20 sm:pb-0">
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
                <div className="col-span-1 md:col-span-2">
                  <div className="rounded-8 bg-MonochromeGray-25 p-20">
                    <div className="">
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:subTotal")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {ThousandSeparator(subTotal.toFixed(2) / 2)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:tax")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {ThousandSeparator(totalTax.toFixed(2) / 2)}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:discount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {ThousandSeparator(totalDiscount.toFixed(2) / 2)}
                        </div>
                      </div>
                    </div>
                    <div className=" mx-5 my-10">
                      <hr />
                    </div>
                    <div>
                      <div className="flex justify-between items-center">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:grandTotal")}
                        </div>
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {ThousandSeparator(grandTotal.toFixed(2) / 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Hidden mdUp>
              <div className="fixed bottom-0 grid grid-cols-2 justify-center items-center gap-20 w-full mb-20 px-20 z-50">
                <Button
                  color="secondary"
                  variant="contained"
                  className="bg-white text-MonochromeGray-700 button2 shadow-1 "
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
                  disabled={!isValid || val.length === 0 || !watchRate}
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
        </div>
      </div>
      <DiscardConfirmModal
        open={open}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
      <SendInvoiceModal editOpen={editOpen} setEditOpen={setEditOpen} />
    </div>
  );
};
export default createProducts;
