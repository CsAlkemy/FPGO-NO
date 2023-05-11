import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  OrderModalDefaultValue,
  validateSchemaMoreThanFiveThousand,
  validateSchemaOrderCancelModal,
  validateSchemaOrderRefundModal,
  validateSchemaOrderResendModal,
  validateSchemaCompleteReservationModal,
  validateSchemaReservationCaptureCardModal,
} from "../../utils/helper";
import { useTranslation } from "react-i18next";
import {
  useCancelOrderMutation,
  useRefundOrderMutation,
  useRefundRequestDecisionMutation,
  useRequestRefundApprovalMutation,
  useResendOrderMutation,
  useCompleteReservationMutation,
  useCapturePaymentMutation,
} from "app/store/api/apiSlice";
import CharCount from "../../../common/charCount";
import { value } from "lodash/seq";
import { LoadingButton } from "@mui/lab";
import { ThousandSeparator } from "../../../../utils/helperFunctions";
import _ from "lodash";

const OrderModal = (props) => {
  const { t } = useTranslation();
  const {
    open,
    setOpen,
    headerTitle,
    orderId,
    orderIdText = null,
    orderName,
    orderAmount,
    customerPhone,
    customerEmail,
    amountInBank = null,
    remainingAmount = null,
  } = props;
  const [refundType, setRefundType] = React.useState("partial");
  const [checkEmail, setCheckEmail] = React.useState(false);
  const [checkPhone, setCheckPhone] = React.useState(false);
  const [apiLoading, setApiLoading] = React.useState(false);
  const [flag, setFlag] = React.useState(false);
  const [isDisableRefundRequest, setIsDisableRefundRequest] =
    React.useState(false);
  const [flagMessage, setFlagMessage] = useState("");
  const [refundOrder] = useRefundOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [resendOrder] = useResendOrderMutation();
  const [requestRefundApproval] = useRequestRefundApprovalMutation();
  const [refundRequestDecision] = useRefundRequestDecisionMutation();

  const newString = flagMessage.split(":");

  const label = { inputProps: { "aria-label": "Checkbox" } };
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    if (flag) setFlag(false);
    setFlagMessage("");
    setIsDisableRefundRequest(false);
  };
  const {
    control,
    formState,
    handleSubmit,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",
    OrderModalDefaultValue,
    resolver: yupResolver(
      ["Resend Order", "Resend Reservation"].includes(headerTitle)
        ? validateSchemaOrderResendModal
        : headerTitle === "Complete Reservation"
        ? validateSchemaCompleteReservationModal
        : headerTitle === "Charge Amount"
        ? validateSchemaReservationCaptureCardModal
        : [
            "Cancel Order",
            "Reject Refund Request",
            "Cancel Reservation",
          ].includes(headerTitle)
        ? validateSchemaOrderCancelModal
        : flag
        ? validateSchemaMoreThanFiveThousand
        : validateSchemaOrderRefundModal
    ),
  });
  const { isValid, dirtyFields, errors, isSubmitting } = formState;

  useEffect(() => {
    OrderModalDefaultValue.phone = customerPhone ? customerPhone : "";
    OrderModalDefaultValue.email = customerEmail ? customerEmail : "";
    reset({ ...OrderModalDefaultValue });
  }, []);

  const setFullAmount = () => {
    setRefundType("full");
    let amount =
      headerTitle === "Capture Payment"
        ? remainingAmount
        : headerTitle === "Refund from Reservation"
        ? amountInBank
        : orderAmount;
    setValue("refundAmount", amount);
  };

  const onSubmit = (values) => {
    const data = {
      ...values,
      uuid: orderId,
      checkPhone,
      checkEmail,
    };
    if (flag) {
      setApiLoading(true);
      const payload = {
        isPartial: refundType === "partial",
        amount: values?.refundAmount,
        message: flagMessage,
        uuid: orderId,
      };
      requestRefundApproval(payload).then((response) => {
        if (response?.data?.status_code === 201) {
          enqueueSnackbar(t(`message:${response?.data?.message}`), {
            variant: "success",
          });
          // setApiLoading(false);
        } else if (response?.error) {
          enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
            variant: "error",
          });
          // setApiLoading(false);
        }
        setOpen(false);
        setFlag(false);
        setApiLoading(false);
      });
    } else if (headerTitle === "Resend Order") {
      setApiLoading(true);
      const preparedPayload = OrdersService.prepareResendOrderPayload(data);
      resendOrder(preparedPayload).then((res) => {
        if (res?.data?.status_code === 202) {
          enqueueSnackbar(t(`message:${res?.data?.message}`), {
            variant: "success",
          });
          // setApiLoading(false);
        } else
          enqueueSnackbar(t(`message:${res?.error?.data?.message}`), {
            variant: "error",
          });
        if (window.location.pathname === "/create-order/details")
          navigate(`/sales/orders-list`);
        else if (
          window.location.pathname === `/reservations-view/details/${orderId}`
        )
          navigate("/reservations");
        // else window.location.reload();
        setTimeout(() => {
          setOpen(false);
        }, 1000);
        setApiLoading(false);
      });
    } else if (headerTitle === "Cancel Order") {
      setApiLoading(true);
      cancelOrder(data).then((res) => {
        if (res?.data?.status_code === 202) {
          enqueueSnackbar(t(`message:${res?.data?.message}`), {
            variant: "success",
          });
          // setApiLoading(false);
        }
        if (window.location.pathname === "/create-order/details")
          navigate(`/sales/orders-list`);
        else if (
          window.location.pathname === `/reservations-view/details/${orderId}`
        )
          navigate("/reservations");
        // else window.location.reload();
        setTimeout(() => {
          setOpen(false);
        }, 1000);
        setApiLoading(false);
      });
    } else if (
      ["Send Refund", "Refund Order", "Refund from Reservation"].includes(
        headerTitle
      )
    ) {
      setApiLoading(true);
      refundOrder({ ...data, isPartial: refundType === "partial" }).then(
        (response) => {
          if (response?.data?.status_code === 202) {
            enqueueSnackbar(t(`message:${response?.data?.message}`), {
              variant: "success",
            });
            setOpen(false);
            if (window.location.pathname === `/create-order/details/${orderId}`)
              navigate(`/sales/orders-list`);
            else if (
              window.location.pathname ===
              `/reservations-view/details/${orderId}`
            )
              navigate("/reservations");
            // setApiLoading(false);
          } else if (response?.error) {
            if (response?.error?.data?.status_code === 400) {
              if (
                // !response?.error?.data?.message.toLowerCase().includes("admin")
                !(
                  response?.error?.data?.message ===
                    "refundRejectionForWeeklyThresholdExceed" ||
                  response?.error?.data?.message ===
                    "refundRejectionForRequestAmountThresholdExceed"
                )
              ) {
                setIsDisableRefundRequest(true);
              }
              setFlagMessage(response?.error?.data?.message);
              setFlag(true);
              // enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
              //   variant: "error",
              // });
            } else setOpen(false);
            // setApiLoading(false);
          }
          setApiLoading(false);
          // setOpen(false);
        }
      );
    } else if (headerTitle === "Reject Refund Request") {
      const params = {
        orderUuid: orderId,
        amount: orderAmount,
        isApproved: false,
        note: values?.cancellationNote,
      };
      setApiLoading(true);
      refundRequestDecision(params).then((response) => {
        if (response?.data?.status_code === 202) {
          enqueueSnackbar(t(`message:${response?.data?.message}`), {
            variant: "success",
          });
        } else if (response?.error) {
          enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
            variant: "error",
          });
        }
        setOpen(false);
        setFlag(false);
        setApiLoading(false);
      });
    } else if (["Complete Reservation"].includes(headerTitle)) {
      setApiLoading(true);
      completeReservation(data).then((res) => {
        if (res?.data?.status_code === 202) {
          enqueueSnackbar(t(`message:${res?.data?.message}`), {
            variant: "success",
          });
        }
        if (
          window.location.pathname === `/reservations-view/details/${orderId}`
        )
          navigate("/reservations");
        setTimeout(() => {
          setOpen(false);
        }, 1000);
        setApiLoading(false);
      });
    } else if (headerTitle === "Capture Payment") {
      setApiLoading(true);
      capturePayment({ ...data, isPartial: refundType === "partial" }).then(
        (response) => {
          console.log(response?.data);
          setApiLoading(false);
        }
      );
    }
  };
  const headerTitleText =
    headerTitle === "moreThanThreeRefundAttempts" || flag
      ? "requestForRefundApproval"
      : headerTitle;
  const orderIdTextLabel = orderIdText ? orderIdText : t("label:orderId");
  return (
    <div>
      <Dialog
        open={open}
        maxWidth="sm"
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="create-order-dialog"
      >
        <div className="p-10 w-full md:min-w-sm rounded-4">
          <div className="p-16 subtitle1 m-10 bg-primary-50 rounded-6 text-primary-800">
            {t(`label:${_.camelCase(headerTitleText)}`)}
          </div>
          <DialogContent className="p-5 sm:p-10">
            <div className="modeal-text">
              {headerTitle !== "moreThanThreeRefundAttempts" &&
                headerTitle !== "moreThanFiveThousand" &&
                !flag && (
                  <div className="flex justify-between items-center my-10 pb-10 border-b-1 border-MonochromeGray-25">
                    <div className="body2">
                      <div className="text-MonochromeGray-700">
                        {orderName ? orderName : "-"}
                      </div>
                      <div className="text-MonochromeGray-300">
                        {orderIdTextLabel}: {orderId ? orderId : "-"}
                      </div>
                    </div>
                    <div className="header6 text-MonochromeGray-700">
                      {t("label:nok")}{" "}
                      {orderAmount ? ThousandSeparator(orderAmount) : "-"}
                    </div>
                  </div>
                )}

              {(amountInBank || remainingAmount) && (
                <div className="flex justify-between items-center p-8 rounded-4 bg-MonochromeGray-25">
                  <div className="text-MonochromeGray-700">
                    {amountInBank
                      ? t("label:amountInBank")
                      : t("label:remainingAmount")}
                  </div>
                  <div className="text-MonochromeGray-700">
                    {t("label:nok")}{" "}
                    {amountInBank
                      ? ThousandSeparator(amountInBank)
                      : ThousandSeparator(remainingAmount)}
                  </div>
                </div>
              )}

              <form
                name="modalForm"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="pt-32"
              >
                {[
                  "Cancel Order",
                  "Reject Refund Request",
                  "Cancel Reservation",
                  "Complete Reservation",
                ].includes(headerTitle) && (
                  <div>
                    <Controller
                      name="cancellationNote"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          rows={5}
                          label={t(
                            headerTitle === "Reject Refund Request"
                              ? "label:rejectionNote"
                              : headerTitle === "Complete Reservation"
                              ? "label:completionNote"
                              : "label:cancellationNote"
                          )}
                          type="text"
                          autoComplete="off"
                          variant="outlined"
                          error={!!errors.cancellationNote}
                          helperText={errors?.cancellationNote?.message}
                          fullWidth
                          required
                        />
                      )}
                    />
                    <CharCount
                      current={watch("cancellationNote").length}
                      total={200}
                    />
                  </div>
                )}
                {["Resend Order", "Resend Reservation"].includes(
                  headerTitle
                ) && (
                  <div className="flex flex-col gap-32">
                    <div className="flex justify-start items-center border-b-1 border-MonochromeGray-50 pb-20">
                      <Checkbox
                        {...label}
                        onChange={(e) => setCheckPhone(e.target.checked)}
                      />
                      <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.phone} fullWidth>
                            <PhoneInput
                              {...field}
                              className={
                                errors.phone
                                  ? "input-phone-number-field border-1 rounded-md border-red-300"
                                  : "input-phone-number-field"
                              }
                              country="no"
                              enableSearch
                              autocompleteSearch
                              countryCodeEditable={false}
                              specialLabel={`${t("label:phone")}*`}
                              // onBlur={handleOnBlurGetDialCode}
                            />
                            <FormHelperText>
                              {errors?.phone?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="flex justify-start items-center">
                      <Checkbox
                        {...label}
                        onChange={(e) => setCheckEmail(e.target.checked)}
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
                            helperText={errors?.email?.message}
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                    </div>
                  </div>
                )}
                {[
                  "Send Refund",
                  "Refund Order",
                  "Capture Payment",
                  "Refund from Reservation",
                ].includes(headerTitle) &&
                  !flag && (
                    <div>
                      <div className="caption2">{t("label:refundType")}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 justify-between items-center gap-20 mt-20 mb-36">
                        <Button
                          variant="outlined"
                          className={`body2 ${
                            refundType === "full"
                              ? "create-order-capsule-button-active"
                              : "create-order-capsule-button"
                          }`}
                          onClick={setFullAmount}
                        >
                          {headerTitle === "Capture Payment"
                            ? t("label:fullPayment")
                            : t("label:fullRefund")}
                        </Button>
                        <Button
                          variant="outlined"
                          className={`body2 ${
                            refundType === "partial"
                              ? "create-order-capsule-button-active"
                              : "create-order-capsule-button"
                          }`}
                          onClick={() => {
                            setRefundType("partial");
                            setValue("refundAmount", "");
                          }}
                        >
                          {headerTitle === "Capture Payment"
                            ? t("label:partialPayment")
                            : t("label:partialRefund")}
                        </Button>
                      </div>
                      <Controller
                        name="refundAmount"
                        className="mt-32"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={
                              headerTitle === "Capture Payment"
                                ? t("label:amount")
                                : t("label:refundAmount")
                            }
                            type="number"
                            autoComplete="off"
                            variant="outlined"
                            error={!!errors.refundAmount}
                            helperText={errors?.refundAmount?.message}
                            fullWidth
                            required
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  {t("label:nok")}
                                </InputAdornment>
                              ),
                            }}
                            disabled={refundType === "full"}
                          />
                        )}
                      />
                    </div>
                  )}
                {/*{headerTitle === "moreThanThreeRefundAttempts" && (*/}
                {/*  <div>*/}
                {/*    You have exceeded your monthly allowance of 3 refunds.*/}
                {/*    Further refunds have to be approved by the FP Admin.*/}
                {/*  </div>*/}
                {/*)}*/}
                {["Charge Amount"].includes(headerTitle) && (
                  <div>
                    <Controller
                      name="chargeAmount"
                      className="mt-32"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:amount")}
                          type="number"
                          autoComplete="off"
                          variant="outlined"
                          error={!!errors.chargeAmount}
                          helperText={errors?.chargeAmount?.message}
                          fullWidth
                          required
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
                {flag && (
                  <div>
                    {t(`message:${newString[0]}`)} {newString[1] || ""}
                  </div>
                )}
                <div className="flex justify-end items-center gap-32 mb-32  mt-32 pt-20 border-t-1 border-MonochromeGray-50">
                  <Button
                    onClick={handleClose}
                    variant="text"
                    className="text-main font-semibold"
                  >
                    {t("label:cancel")}
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    className="rounded-4 button2 min-w-[153px]"
                    aria-label="Confirm"
                    size="large"
                    type="submit"
                    loading={apiLoading}
                    loadingPosition="center"
                    disabled={
                      isDisableRefundRequest ||
                      (["Resend Order", "Resend Reservation"].includes(
                        headerTitle
                      ) &&
                        checkEmail === false &&
                        checkPhone === false)
                    }
                  >
                    {headerTitle === "Resend Order"
                      ? t("label:resendOrder")
                      : headerTitle === "moreThanThreeRefundAttempts" || flag
                      ? t("label:requestRefund")
                      : t("label:confirm")}
                  </LoadingButton>
                </div>
              </form>
            </div>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default OrderModal;
