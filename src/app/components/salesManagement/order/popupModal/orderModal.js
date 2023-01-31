import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
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
import { setOverviewMainTableDataSlice } from "app/store/overview-table/overviewTableSlice";
import {
  OrderModalDefaultValue,
  validateSchemaOrderResendModal,
  validateSchemaOrderCancelModal,
  validateSchemaOrderRefundModal,
  validateSchemaMoreThanFiveThousand,
} from "../../utils/helper";
import { useTranslation } from "react-i18next";
import {
  useCancelOrderMutation,
  useRefundOrderMutation, useRefundRequestDecisionMutation, useRequestRefundApprovalMutation,
  useResendOrderMutation,
} from 'app/store/api/apiSlice';

const OrderModal = (props) => {
  const { t } = useTranslation();
  const {
    open,
    setOpen,
    headerTitle,
    orderId,
    orderName,
    orderAmount,
    customerPhone,
    customerEmail,
  } = props;
  const [refundType, setRefundType] = React.useState("partial");
  const [checkEmail, setCheckEmail] = React.useState(false);
  const [checkPhone, setCheckPhone] = React.useState(false);
  const [flag, setFlag] = React.useState(false);
  const [flagMessage, setFlagMessage] = useState("");
  const [refundOrder] = useRefundOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [resendOrder] = useResendOrderMutation();
  const [requestRefundApproval] = useRequestRefundApprovalMutation();
  const [refundRequestDecision] = useRefundRequestDecisionMutation();

  const label = { inputProps: { "aria-label": "Checkbox" } };
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClose = () => {
    setOpen(false);
    if (flag) setFlag(false);
    setFlagMessage("");
  };
  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    OrderModalDefaultValue,
    resolver: yupResolver(
      headerTitle === "Resend Order"
        ? validateSchemaOrderResendModal
        : headerTitle === "Cancel Order" || headerTitle === "Reject Request"
        ? validateSchemaOrderCancelModal
        : flag
        ? validateSchemaMoreThanFiveThousand
        : validateSchemaOrderRefundModal
    ),
  });
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    OrderModalDefaultValue.phone = customerPhone ? customerPhone : "";
    OrderModalDefaultValue.email = customerEmail ? customerEmail : "";
    reset({ ...OrderModalDefaultValue });
  }, []);

  const onSubmit = (values) => {
    const data = {
      ...values,
      uuid: orderId,
      checkPhone,
      checkEmail,
    };
    if (flag) {
      const payload = {
        isPartial: refundType === "partial",
        amount: values?.refundAmount,
        message: flagMessage,
        uuid: orderId
      };
      requestRefundApproval(payload)
        .then((response) => {
          if (response?.data?.status_code === 201) {
            enqueueSnackbar(response?.data?.message, { variant: "success" });
          } else if (response?.error) {
            enqueueSnackbar(response?.error?.data?.message, {
              variant: "error",
            });
          }
          setOpen(false);
          setFlag(false);
        });
    } else if (headerTitle === "Resend Order") {
      const preparedPayload = OrdersService.prepareResendOrderPayload(data);
      resendOrder(preparedPayload).then((res) => {
        if (res?.data?.status_code === 202) {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
        }
        if (window.location.pathname === "/create-order/details")
          navigate(`/sales/orders-list`);
        // else window.location.reload();
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      });
    } else if (headerTitle === "Cancel Order") {
      cancelOrder(data).then((res) => {
        if (res?.data?.status_code === 202) {
          enqueueSnackbar(res?.data?.message, { variant: "success" });
        }
        if (window.location.pathname === "/create-order/details")
          navigate(`/sales/orders-list`);
        // else window.location.reload();
        setTimeout(() => {
          setOpen(false);
        }, 1000);
      });
    } else if (headerTitle === "Send Refund") {
      refundOrder({ ...data, isPartial: refundType === "partial" }).then(
        (response) => {
          if (response?.data?.status_code === 202) {
            enqueueSnackbar(response?.data?.message, { variant: "success" });
          } else if (response?.error) {
            if (response?.error?.data?.status_code === 400) {
              setFlagMessage(response?.error?.data?.message);
              setFlag(true);
              enqueueSnackbar(response?.error?.data?.message, {
                variant: "error",
              });
            }
          }
        }
      );
    } else if (headerTitle === "Reject Request") {
      const params = {
        orderUuid: orderId,
        amount: orderAmount,
        isApproved: false,
        note: values?.cancellationNote,
      };
      refundRequestDecision(params)
        .then((response) => {
          if (response?.data?.status_code === 202) {
            enqueueSnackbar(response?.data?.message, { variant: "success" });
          } else if (response?.error) {
            enqueueSnackbar(response?.error?.data?.message, {
              variant: "error",
            });
          }
          setOpen(false);
          setFlag(false);
        });
    }
  };

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
            {headerTitle === "moreThanThreeRefundAttempts" || flag
              ? "Request for Refund Approval"
              : headerTitle}
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
                        {t("label:orderId")}: {orderId ? orderId : "-"}
                      </div>
                    </div>
                    <div className="header6 text-MonochromeGray-700">
                      {t("label:nok")} {orderAmount ? orderAmount : "-"}
                    </div>
                  </div>
                )}
              <form
                name="modalForm"
                noValidate
                onSubmit={handleSubmit(onSubmit)}
                className="pt-32"
              >
                {(headerTitle === "Cancel Order" ||
                  headerTitle === "Reject Request") && (
                  <Controller
                    name="cancellationNote"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        multiline
                        rows={5}
                        label={t("label:cancellationNote")}
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
                )}
                {headerTitle === "Resend Order" && (
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
                {headerTitle === "Send Refund" && !flag && (
                  <div>
                    <div className="caption2">{t("label:refundType")}</div>
                    <div className="grid grid-cols-2 justify-between items-center gap-20 mt-20 mb-36">
                      <Button
                        variant="outlined"
                        className={`body2 ${
                          refundType === "full"
                            ? "create-order-capsule-button-active"
                            : "create-order-capsule-button"
                        }`}
                        onClick={() => {
                          setRefundType("full");
                          setValue("refundAmount", orderAmount);
                        }}
                      >
                        {t("label:fullRefund")}
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
                        {t("label:partialRefund")}
                      </Button>
                    </div>
                    <Controller
                      name="refundAmount"
                      className="mt-32"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:refundAmount")}
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
                {flag && <div>{flagMessage}</div>}
                <div className="flex justify-end items-center mb-32  mt-32 pt-20 border-t-1 border-MonochromeGray-50">
                  <Button
                    onClick={handleClose}
                    variant="text"
                    className="text-main font-semibold"
                  >
                    {t("label:cancel")}
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    className="rounded-4 font-semibold"
                    type="submit"
                    //onClick={()=> {}}
                    disabled={
                      headerTitle === "Resend Order" &&
                      checkEmail === false &&
                      checkPhone === false
                    }
                  >
                    {headerTitle === "Resend Order"
                      ? t("label:resendOrder")
                      : headerTitle === "moreThanThreeRefundAttempts" || flag
                      ? t("label:requestRefund")
                      : t("label:confirm")}
                  </Button>
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
