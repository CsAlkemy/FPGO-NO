import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";

import { yupResolver } from "@hookform/resolvers/yup";
import { Search } from "@mui/icons-material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import {
  DateTimePicker,
  DesktopDatePicker,
  DesktopDateTimePicker,
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
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { ClickAwayListener } from "@mui/base";

import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import CharCount from "../../../common/charCount";
import { ThousandSeparator } from "../../../../utils/helperFunctions";

const ReservationInformation = ({ info }) => {
  const { t } = useTranslation();
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  //const [addOrderIndex, setAddOrderIndex] = React.useState([0, 1, 2]);
  const [customerAddress, setCustomerAddress] = useState("");

  const formattedAddress = (info) => {
    const address = info.customerDetails?.street
      ? info.customerDetails.street +
        ", " +
        info.customerDetails.city +
        " " +
        info.customerDetails.zip +
        ", " +
        info.customerDetails.country
      : "";
  };

  const {
    control,
    formState,
    handleSubmit,
    getValues,
    reset,
    watch,
    setValue,
    resetField,
  } = useForm({
    mode: "onChange",
    //CreateOrderDefaultValue,
    // reValidateMode: "onChange",
    //resolver: yupResolver(schema),
  });
  const watchAllFields = watch();
  const { isValid, dirtyFields, errors, touchedFields } = formState;

  const prepareOrderDate = (param) => {
    const splitedArray = param.split(".");
    const changedDate = `${splitedArray[1]}.${splitedArray[0]}.${splitedArray[2]}`;
    return changedDate;
  };
  const prepareDueDateForPaymentLink = (param) => {
    const splitedArray = param.split(", ");
    const splitedDateArray = splitedArray[1].split(".");
    const changedDate = `${splitedDateArray[1]}.${splitedDateArray[0]}.${splitedDateArray[2]} ${splitedArray[0]}`;
    return changedDate;
  };
  useEffect(() => {
    if (info.customerDetails?.address.street) {
      let address =
        info.customerDetails.address.street +
        ", " +
        info.customerDetails.address.city +
        " " +
        info.customerDetails.address.zip +
        ", " +
        info.customerDetails.address.country;
      setCustomerAddress(address);
    }
  }, [info]);
  const addOrderIndex = Array.from(
    { length: info.productList.length },
    (value, index) => 0 + index
  );

  return (
    <div>
      {!!info && (
        <div className="reservation-details-content">
          {/* {JSON.stringify(info)} */}
          <div className="customer-info-section">
            <div className="selected-customer-info">
              <div className="box">
                <div className="box-header has-icon pr-20">
                  <h5 className="sec-sub-header">
                    {info.customerDetails?.name
                      ? info.customerDetails?.name
                      : ""}
                  </h5>
                </div>
                <p className="body-p">
                  {info.customerDetails?.countryCode &&
                  info.customerDetails?.msisdn
                    ? info.customerDetails?.countryCode +
                      info.customerDetails?.msisdn
                    : "+87"}
                </p>
                <p className="body-p">
                  {info.customerDetails?.email
                    ? info.customerDetails?.email
                    : ""}
                </p>
                <p className="body-p">{customerAddress}</p>
              </div>
            </div>
          </div>

          <div className="create-order-date-container pt-32">
            <div className="flex flex-col gap-5">
              <Controller
                name="reservationDate"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <DesktopDatePicker
                    label={t("label:reservationDate")}
                    // inputFormat="mm.dd.yyyy"
                    mask=""
                    inputFormat="dd.MM.yyyy"
                    // inputFormat="dd.MMM.yyyy"
                    // value={!value ? new Date() : value}
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
                    value={
                      info?.reservationDate
                        ? prepareOrderDate(info?.reservationDate)
                        : ""
                    }
                    // value="30 Nov, 2022"
                    required
                    disabled
                    onChange={onChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        onBlur={onBlur}
                        required
                        type="date"
                        error={!!errors.reservationDate}
                        helperText={errors?.reservationDate?.message}
                        sx={{
                          svg: { color: "#69C77E" },
                        }}
                      />
                    )}
                  />
                )}
              />
            </div>
            <div className="flex flex-col gap-5">
              <Controller
                name="dueDatePaymentLink"
                control={control}
                render={({ field: { onChange, value, onBlur } }) => (
                  <div className="create-order-due-date w-full">
                    <DesktopDateTimePicker
                      label={t("label:dueDateForPaymentLink")}
                      inputFormat="dd.MM.yyyy HH:mm"
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
                      // inputFormat="dd.MMM.yyyy"
                      value={
                        info?.paymentLinkDueDate
                          ? prepareDueDateForPaymentLink(
                              info?.paymentLinkDueDate
                            )
                          : // ? info?.paymentLinkDueDate
                            ""
                      }
                      required
                      //open={datePickerOpen}
                      disabled
                      // minDate={
                      //   watchOrderDate
                      //     ? new Date().setDate(
                      //       watchOrderDate.getDate() + 1
                      //     )
                      //     : new Date().setDate(
                      //       new Date().getDate() - 30
                      //     )
                      // }
                      disablePast={true}
                      onChange={onChange}
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
                          helperText={errors?.dueDatePaymentLink?.message}
                          sx={{
                            svg: { color: "#E7AB52" },
                          }}
                        />
                      )}
                    />
                  </div>
                )}
              />
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
                    variant="outlined"
                    fullWidth
                    disabled
                    value={
                      field.value ||
                      (info.referenceNumber ? info.referenceNumber : "")
                    }
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
                    variant="outlined"
                    fullWidth
                    disabled
                    value={
                      field.value ||
                      (info.customerReference ? info.customerReference : "")
                    }
                  />
                )}
              />
            </div>
            <div></div>
          </div>

          <div className="create-order-send-order-conf">
            <div className="send-order-by">
              <div className="caption2 text-MonochromeGray-300">
                {t("label:sendBy")}*
              </div>
              <div className="create-order-radio">
                <div className="grid grid-cols-2 md:grid-cols-4 justify-between items-center gap-20 w-full md:w-3/4 my-32 mt-10">
                  <Button
                    variant="outlined"
                    className="body2 create-order-capsule-button-active-details"
                  >
                    {t("label:sms")}
                  </Button>
                  <Button
                    variant="outlined"
                    className="create-order-capsule-button"
                    disabled
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
                <AccordionDetails className="bg-white px-0 py-0">
                  <div className="mob-order-product-group">
                    {addOrderIndex.map((index) => (
                      <div
                        className="border-gray p-20 rounded-6 bg-white border-2 border-MonochromeGray-25 my-20 flex flex-col gap-20"
                        key={`order:${index}`}
                      >
                        <Controller
                          control={control}
                          required
                          name={`order[${index}].productName`}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              //label="Product ID"
                              className="bg-white custom-input-height"
                              type="text"
                              autoComplete="off"
                              variant="outlined"
                              fullWidth
                              disabled
                              value={
                                info.productList &&
                                info.productList?.[index]?.name
                                  ? info.productList[index].name
                                  : ""
                              }
                            />
                          )}
                        />
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
                              //error={!!errors.productID}
                              //helperText={errors?.productID?.message}
                              variant="outlined"
                              fullWidth
                              disabled
                              value={
                                info.productList &&
                                info.productList?.[index]?.productId
                                  ? info.productList[index].productId
                                  : ""
                              }
                            />
                          )}
                        />
                        <div className="grid grid-cols-5 gap-20">
                          <Controller
                            name={`order[${index}].reservationAmount`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                className="bg-white custom-input-height col-span-3"
                                type="number"
                                autoComplete="off"
                                variant="outlined"
                                fullWidth
                                disabled
                                value={
                                  info.productList &&
                                  info.productList?.[index]?.rate
                                    ? info.productList[index].rate
                                    : ""
                                }
                              />
                            )}
                          />
                          <Controller
                            name={`order[${index}].tax`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                //label="Discount"
                                className="bg-white custom-input-height col-span-2"
                                // type="text"
                                type="number"
                                autoComplete="off"
                                error={!!errors?.order?.[index]?.tax}
                                helperText={
                                  errors?.order?.[index]?.tax?.message
                                }
                                variant="outlined"
                                required
                                fullWidth
                                disabled
                                value={
                                  info.productList &&
                                  info.productList?.[index]?.tax !== 0
                                    ? info.productList[index]?.tax
                                    : 0
                                }
                              />
                            )}
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-20"></div>
                        <div className="flex justify-between subtitle1 pt-20 border-t-1 border-MonochromeGray-50">
                          <div>{t("label:total")}</div>
                          <div>
                            {info.productList &&
                            info.productList?.[index]?.amount
                              ? ThousandSeparator(
                                  info.productList[index].amount
                                )
                              : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-MonochromeGray-50 p-20 py-12 subtitle2 text-MonochromeGray-700">
                    {/* {t("label:totalReservationAmount")} : {t("label:nok")} {grandTotal} */}
                    {t("label:totalReservationAmount")} : {t("label:nok")}{" "}
                    {info.grandTotal ? ThousandSeparator(info.grandTotal) : 0}
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          //label="Product ID"
                          className="bg-white custom-input-height"
                          type="text"
                          autoComplete="off"
                          //error={!!errors.productName}
                          //helperText={errors?.productName?.message}
                          variant="outlined"
                          fullWidth
                          disabled
                          value={
                            info.productList && info.productList?.[index]?.name
                              ? info.productList[index].name
                              : ""
                          }
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
                          //error={!!errors.productID}
                          //helperText={errors?.productID?.message}
                          variant="outlined"
                          fullWidth
                          disabled
                          value={
                            info.productList &&
                            info.productList?.[index]?.productId
                              ? info.productList[index].productId
                              : ""
                          }
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
                          //error={!!errors.reservationAmount}
                          //helperText={errors?.reservationAmount?.message}
                          variant="outlined"
                          fullWidth
                          disabled
                          value={
                            info.productList && info.productList?.[index]?.rate
                              ? info.productList[index].rate
                              : ""
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="my-auto">
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
                          fullWidth
                          disabled
                          value={
                            info.productList &&
                            info.productList?.[index]?.tax !== 0
                              ? info.productList[index]?.tax
                              : 0
                          }
                        />
                      )}
                    />
                  </div>
                  <div className="my-auto">
                    <div className="body3 text-right">
                      {t("label:nok")}{" "}
                      {info.productList && info.productList?.[index]?.amount
                        ? ThousandSeparator(info.productList[index].amount)
                        : ""}
                    </div>
                  </div>
                </div>
              ))}
              <hr className=" mt-20 border-half-bottom" />
            </div>
          </Hidden>

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
                      variant="outlined"
                      fullWidth
                      disabled
                      value={
                        field.value ||
                        (info.customerNotes ? info.customerNotes : "")
                      }
                    />
                  )}
                />
                <CharCount
                  current={info.customerNotes?.length || 0}
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
                      variant="outlined"
                      fullWidth
                      disabled
                      value={
                        field.value ||
                        (info.termsAndCondition ? info.termsAndCondition : "")
                      }
                    />
                  )}
                />
                <CharCount
                  current={info.termsAndCondition?.length || 0}
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
                        {/* {ThousandSeparator(grandTotal.toFixed(2) / 2)} */}
                        {info.grandTotal
                          ? ThousandSeparator(info.grandTotal)
                          : 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Hidden>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationInformation;
