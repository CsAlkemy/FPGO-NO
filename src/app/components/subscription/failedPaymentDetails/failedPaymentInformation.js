import { DesktopDatePicker } from "@mui/lab";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Hidden,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  createSubscriptionDefaultValue,
  quickOrderValidation,
} from "../utils/helper";
import { IoMdAdd } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import CharCount from "../../common/charCount";
import { yupResolver } from "@hookform/resolvers/yup";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import utilsService from "../../../data-access/utils/UtilsServices";

const FailedPaymentInformation = ({ info }) => {
  const { t } = useTranslation();
  const [expandedPanelOrder, setExpandedPanelOrder] = React.useState(true);
  const [addOrderIndex, setAddOrderIndex] = React.useState([
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  ]);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [open, setOpen] = React.useState(false);

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    createSubscriptionDefaultValue,
    resolver: yupResolver(quickOrderValidation),
  });
  const { errors } = formState;

  useEffect(() => {
    createSubscriptionDefaultValue.repeatsNoOfTimes = info.repeats || "";
    createSubscriptionDefaultValue.orderDate = info.orderDate || "";
    createSubscriptionDefaultValue.dueDatePaymentLink = info.dueDateForPaymentLink || "";
    if (info?.products && info?.products && info?.products.length >= 2) {
      setAddOrderIndex(
        addOrderIndex.filter((item, index) => item <= info?.products.length - 1)
      );
    } else {
      setAddOrderIndex(addOrderIndex.filter((item, index) => item < 1));
    }
    reset({ ...createSubscriptionDefaultValue });
  }, [info]);
  const onSubmit = (values) => {
    //console.log(values);
  };
  console.log(createSubscriptionDefaultValue);

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white">
          <form
            name="subscriptionForm"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="">
              <div className="my-20">
                <div className="mt-32">
                  <div className="col-span-1 md:col-span-4 bg-white">
                    <div className="p-20 rounded-8 border-MonochromeGray-50 border-2 mb-20 w-full md:w-2/4">
                      <div className="flex justify-between items-center">
                        <div className="subtitle1 text-MonochromeGray-700">
                          {info?.customerName || ""}
                        </div>
                      </div>
                      <div className="">
                        <div className="text-MonochromeGray-700 body2 mt-16">
                          {info?.countryCode && info?.msisdn
                            ? info?.countryCode + info?.msisdn
                            : ""}
                        </div>
                        <div className="text-MonochromeGray-700 body2">
                          {info?.email || ""}
                        </div>
                        <div className="text-MonochromeGray-700 body2">
                          {info?.street ? `${info?.street}, ` : ""}{" "}
                          {info?.city || ""} {info?.zip ? `${info?.zip}, ` : ""}{" "}
                          {info?.country || ""}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                      value={utilsService.prepareDotSeparatedDateDDMMYYYYFromMMDDYYYY(info?.orderDate)|| new Date()}
                      required
                      disabled
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
                      disabled
                      value={value}
                      required
                      onChange={onChange}
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
              </div>
              <div className="send-order-credit-check">
                <div className="caption2 text-MonochromeGray-300 my-10">
                  {t("label:sendOrderBy")}
                </div>
                <div className="body3 text-MonochromeGray-300">
                  {t(
                    "label:sendingBySMSOrInvoiceIncursAnAdditionalCostForEachOrder"
                  )}
                </div>
                <div className="flex gap-20 w-full md:w-3/4 my-32">
                  <Button
                    variant="outlined"
                    className={`${
                      info?.sendOrderViaSms === 1
                        ? "create-order-capsule-button-active"
                        : "create-order-capsule-button"
                    }`}
                    disabled
                  >
                    {t("label:sms")}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled
                    className={`${
                      info?.sendOrderViaEmail === 1
                        ? "create-order-capsule-button-active"
                        : "create-order-capsule-button"
                    }`}
                  >
                    {t("label:email")}
                  </Button>
                </div>
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
                      {addOrderIndex.map((index) => (
                        <div
                          className=" p-20 rounded-6 bg-white border-2 border-MonochromeGray-25 my-20 flex flex-col gap-20"
                          key={`order:${index}`}
                        >
                          <Controller
                            name={`order[${index}].productName`}
                            control={control}
                            render={({ field }) => (
                              <TextField
                                {...field}
                                //label="Product ID"
                                className="bg-white custom-input-height mt-10"
                                type="text"
                                autoComplete="off"
                                error={!!errors.productName}
                                helperText={errors?.productName?.message}
                                variant="outlined"
                                fullWidth
                                disabled
                                defaultValue={
                                  info.products &&
                                  info.products?.[index]?.productName
                                    ? info.products[index].productName
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
                                label="Product ID"
                                className="bg-white custom-input-height"
                                type="text"
                                autoComplete="off"
                                error={!!errors.productID}
                                helperText={errors?.productID?.message}
                                variant="outlined"
                                fullWidth
                                disabled={disableRowIndexes.includes(index)}
                                defaultValue={
                                  info?.products &&
                                  info?.products?.[index]?.productId
                                    ? info?.products[index].productId
                                    : ""
                                }
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
                                  defaultValue={
                                    info?.products &&
                                    info?.products?.[index]?.quantity
                                      ? info?.products[index].quantity
                                      : ""
                                  }
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
                                  defaultValue={
                                    info?.products &&
                                    info?.products?.[index]?.rate
                                      ? info?.products[index].rate
                                      : ""
                                  }
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
                                  defaultValue={
                                    info?.products &&
                                    info?.products?.[index]?.discount
                                      ? info?.products[index].discount
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
                                  className="bg-white custom-input-height col-span-1"
                                  // type="text"
                                  type="number"
                                  onWheel={(event) => {
                                    event.target.blur();
                                  }}
                                  autoComplete="off"
                                  error={!!errors?.order?.[index]?.tax}
                                  helperText={
                                    errors?.order?.[index]?.tax?.message
                                  }
                                  variant="outlined"
                                  required
                                  fullWidth
                                  disabled
                                  defaultValue={
                                    info.products &&
                                    info.products?.[index]?.tax === 0
                                      ? 0
                                      : info.products[index]?.tax
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className="flex justify-between subtitle1 pt-20 border-t-1 border-MonochromeGray-50">
                            <div>{t("label:total")}</div>
                            <div>
                              {t("label:nok")}{" "}
                              {info?.products?.[index]?.amount
                                ? ThousandSeparator(
                                    info?.products?.[index]?.amount
                                  )
                                : 0}
                            </div>
                          </div>
                        </div>
                      ))}
                      {/*<div className="bg-MonochromeGray-50 p-20 subtitle2 text-MonochromeGray-700">*/}
                      {/*  {t("label:grandTotal")} : {t("label:nok")}{" "}*/}
                      {/*  {ThousandSeparator(grandTotal.toFixed(2) / 2)}*/}
                      {/*</div>*/}
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
                          name={`order[${index}].productName`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              //label="Product ID"
                              className="bg-white custom-input-height"
                              type="text"
                              autoComplete="off"
                              error={!!errors.productName}
                              helperText={errors?.productName?.message}
                              variant="outlined"
                              fullWidth
                              disabled
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.productName
                                  ? info.products[index].productName
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
                              error={!!errors.productID}
                              helperText={errors?.productID?.message}
                              variant="outlined"
                              fullWidth
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.productId
                                  ? info.products[index].productId
                                  : ""
                              }
                              disabled
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
                              disabled
                              autoComplete="off"
                              error={!!errors?.order?.[index]?.quantity}
                              // helperText={
                              //   errors?.order?.[index]?.quantity?.message
                              // }
                              variant="outlined"
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.quantity
                                  ? info.products[index].quantity
                                  : ""
                              }
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
                              defaultValue={
                                info.products && info.products?.[index]?.rate
                                  ? info.products[index].rate
                                  : ""
                              }
                              disabled
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
                              disabled
                              error={!!errors.discount}
                              helperText={errors?.discount?.message}
                              variant="outlined"
                              fullWidth
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.discount
                                  ? info.products[index].discount
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
                              onWheel={(event) => {
                                event.target.blur();
                              }}
                              autoComplete="off"
                              error={!!errors?.order?.[index]?.tax}
                              helperText={errors?.order?.[index]?.tax?.message}
                              variant="outlined"
                              required
                              fullWidth
                              disabled
                              defaultValue={
                                info.products &&
                                info.products?.[index]?.tax === 0
                                  ? 0
                                  : info.products[index]?.tax
                              }
                            />
                          )}
                        />
                      </div>
                      <div className="my-auto">
                        <div className="body3 text-right">
                          {t("label:nok")}{" "}
                          {info?.products?.[index]?.amount
                            ? ThousandSeparator(info?.products?.[index]?.amount)
                            : 0}
                        </div>
                      </div>
                    </div>
                  ))}

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
                          disabled
                          value={info?.customerNotes || ""}
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
                      current={info?.customerNote?.length || 0}
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
                          disabled
                          label={t("label:tnc")}
                          type="text"
                          error={!!errors.termsConditions}
                          value={info?.termsAndConditions || ""}
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
                      current={info?.termsAndConditions?.length || 0}
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
                          {info?.subTotal
                            ? ThousandSeparator(info?.subTotal)
                            : 0}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:tax")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {info?.tax ? ThousandSeparator(info?.tax) : 0}
                        </div>
                      </div>
                      <div className="flex justify-between items-center  my-10">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:discount")}
                        </div>
                        <div className="body3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {info?.discount
                            ? ThousandSeparator(info?.discount)
                            : 0}
                        </div>
                      </div>
                    </div>
                    <div className=" mx-5 my-10">
                      <hr />
                    </div>
                    <div>
                      <div className="flex justify-between items-center my-5">
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:payablePerCycle")}
                        </div>
                        <div className="subtitle3 text-MonochromeGray-700">
                          {t("label:nok")}{" "}
                          {info?.payablePerCycle
                            ? ThousandSeparator(info?.payablePerCycle)
                            : 0}
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
    </div>
  );
};
export default FailedPaymentInformation;
