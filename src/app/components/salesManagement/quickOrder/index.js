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
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import DiscardConfirmModal from "../../common/confirmDiscard";
import { defaultValueCreateProduct } from "../../products/utils/helper";
import InfoIcon from "@mui/icons-material/Info";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CharCount from "../../common/charCount";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

const customerData = [
  { name: "The Shawshank Redemption", phone: "+47 1994" },
  { name: "The Godfather", phone: "+47 1994" },
  { name: "The Godfather: Part II", phone: "+47 1994" },
  { name: "The Dark Knight", phone: "+47 1994" },
  { name: "12 Angry Men", phone: "+47 1994" },
  { name: "Schindler's List", phone: "+47 1994" },
  { name: "Pulp Fiction", phone: "+47 1994" },
];

const createProducts = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = React.useState(false);
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [productsList, setProductsList] = useState([]);
  const [addOrderIndex, setAddOrderIndex] = React.useState([0, 1, 2]);
  const [itemLoader, setItemLoader] = useState(false);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [taxes, setTaxes] = React.useState([]);

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
  const disableCurrentProductRow = (index) => {
    setDisableRowIndexes([...disableRowIndexes, index]);
  };
  const enableCurrentProductRow = (ind) => {
    setDisableRowIndexes(disableRowIndexes.filter((item) => item !== ind));
  };

  const [open, setOpen] = React.useState(false);

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
    // defaultValueCreateProduct,
    // resolver: yupResolver(validateSchemaProductCreate),
  });
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const pnameOnBlur = (e) => {
    if (!e.target.value.length) {
      resetField(`${e.target.name}`);
    }
  };
  const onSubmit = (values) => {
    setLoading(true);
    console.log(values);
  };
  const handleDelete = () => {
    console.info("Clicked.");
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
                  disabled={!isValid}
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
                    freeSolo
                    options={customerData}
                    getOptionLabel={(option) => option.name}
                    className=""
                    fullWidth
                    renderOption={(props, option, { selected }) => (
                      <MenuItem {...props}>
                        <div>
                          <div>{option.name}</div>
                          <div>{option.phone}</div>
                        </div>
                      </MenuItem>
                    )}
                    renderInput={(params) => (
                      <TextField
                        id="searchBox"
                        className="mt-10 w-full sm:w-2/4"
                        {...params}
                        {...field}
                        inputRef={ref}
                        // onChange={}
                        placeholder={t("label:searchByNameOrPhoneNo")}
                      />
                    )}
                  />
                )}
              />
              <div className="flex gap-5 m-5 items-center">
                <InfoIcon className="text-primary-500 h-[15px] w-[15px]" />
                <span className="body4 text-m-grey-500">
                  Multiple customers can be added
                </span>
              </div>
              <div className="my-20">
                <Stack direction="row" spacing={1}>
                  <Chip
                    label="Arlene McCoy"
                    className="body3"
                    onDelete={handleDelete}
                    sx={{
                      backgroundColor: "#E6F3F7",
                    }}
                  />
                  <Chip
                    label="+47 474 34 668"
                    className="body3"
                    onDelete={handleDelete}
                    sx={{
                      backgroundColor: "#EFEFEF",
                    }}
                  />
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
                      value={!value ? new Date() : value}
                      required
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
                            render={({
                              field: { ref, onChange, ...field },
                            }) => (
                              <Autocomplete
                                // disabled={
                                //     index === 0 ||
                                //     index === Math.min(...addOrderIndex)
                                //         ? false
                                //         : !watch(
                                //             `order[${
                                //                 index -
                                //                 (addOrderIndex[
                                //                         addOrderIndex.indexOf(index)
                                //                         ] -
                                //                     addOrderIndex[
                                //                     addOrderIndex.indexOf(index) - 1
                                //                         ])
                                //             }].productName`
                                //         )
                                // }
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
                                      value={field.value || ""}
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
                                      <MenuItem key={0} value={0}>
                                        0
                                      </MenuItem>
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
                            <div>{t("label:nok")} 546</div>
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
                        {t("label:grandTotal")} : {t("label:nok")} 50000
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
                              // onChange={(_, data) => {
                              //   if (data) {
                              //     if (data?.name) {
                              //       setValue(
                              //         `order[${index}].productName`,
                              //         data.name
                              //       );
                              //       setValue(
                              //         `order[${index}].productID`,
                              //         data.id
                              //       );
                              //       const preparedPrice = data.price
                              //         .toString()
                              //         .includes(".")
                              //         ? `${data.price.toString().split(".")[0]},${
                              //             data.price.toString().split(".")[1]
                              //           }`
                              //         : data.price;
                              //       setValue(
                              //         `order[${index}].rate`,
                              //         preparedPrice
                              //       );
                              //       setValue(`order[${index}].tax`, data.tax);
                              //       disableCurrentProductRow(index);
                              //
                              //       const watchRate = watch(
                              //         `order[${index}].rate`
                              //       );
                              //       const watchTax = watch(`order[${index}].tax`);
                              //       const watchName = watch(
                              //         `order[${index}].productName`
                              //       );
                              //       const watchId = watch(
                              //         `order[${index}].productID`
                              //       );
                              //
                              //       for (
                              //         let i = 0;
                              //         i < addOrderIndex.length;
                              //         i++
                              //       ) {
                              //         if (
                              //           watchName &&
                              //           watchId &&
                              //           watchRate &&
                              //           watchTax &&
                              //           i !== index &&
                              //           watchName ===
                              //             watch(`order[${i}].productName`) &&
                              //           watchId ===
                              //             watch(`order[${i}].productID`) &&
                              //           watchRate === watch(`order[${i}].rate`) &&
                              //           watchTax === watch(`order[${i}].tax`)
                              //         ) {
                              //           let quantityNum = isNaN(
                              //             parseInt(watch(`order[${i}].quantity`))
                              //           )
                              //             ? 1
                              //             : parseInt(
                              //                 watch(`order[${i}].quantity`)
                              //               );
                              //           setValue(
                              //             `order[${i}].quantity`,
                              //             quantityNum + 1
                              //           );
                              //           onSameRowAction(index);
                              //           enqueueSnackbar(
                              //             `Same product found in Row ${
                              //               i + 1
                              //             } and ${index + 1}, merged together!`,
                              //             { variant: "success" }
                              //           );
                              //         }
                              //       }
                              //     } else
                              //       setValue(
                              //         `order[${index}].productName`,
                              //         data ? data : ""
                              //       );
                              //   } else {
                              //     setValue(`order[${index}].productName`, "");
                              //     setValue(`order[${index}].productID`, "");
                              //     setValue(`order[${index}].rate`, "");
                              //     setValue(`order[${index}].tax`, "");
                              //     enableCurrentProductRow(index);
                              //   }
                              //   return onChange(data);
                              // }}
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
                        <div className="body3 text-right">
                          {t("label:nok")} 45544
                          {/*{ThousandSeparator(productWiseTotal(index))}*/}
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
                          {t("label:nok")} 4848
                          {/*{ThousandSeparator(subTotal.toFixed(2) / 2)}*/}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:tax")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")} 85944
                          {/*{ThousandSeparator(totalTax.toFixed(2) / 2)}*/}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:discount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")} 85859
                          {/*{ThousandSeparator(totalDiscount.toFixed(2) / 2)}*/}
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
                          {t("label:nok")} 70000
                          {/*{ThousandSeparator(grandTotal.toFixed(2) / 2)}*/}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <DiscardConfirmModal
        open={open}
        defaultValue={defaultValueCreateProduct}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};
export default createProducts;
