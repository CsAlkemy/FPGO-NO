import React, { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
  IconButton,
  Autocomplete,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import UtilsServices from "../../../../data-access/utils/UtilsServices";
import OrdersService from "../../../../data-access/services/ordersService/OrdersService";
import ProductService from "../../../../data-access/services/productsService/ProductService";
import ClientService from "../../../../data-access/services/clientsService/ClientService";
import ReservationService from "../../../../data-access/services/reservationService/reservationService";

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
  validateSchemaReservationChargeCardModal,
  validateSchemaReservationCaptureModal,
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
import _, { head } from "lodash";

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
  const [completeReservation] = useCompleteReservationMutation();
  const [capturePayment] = useCapturePaymentMutation();

  //const [modalSize, setModalSize] = useState("sm");
  const [addOrderIndex, setAddOrderIndex] = React.useState([0, 1, 2]);
  const [disableRowIndexes, setDisableRowIndexes] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [taxes, setTaxes] = React.useState([]);
  const [itemLoader, setItemLoader] = useState(false);
  const userInfo = UtilsServices.getFPUserData();
  let subTotal = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let grandTotal = 0;

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
    resetField,
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
        ? validateSchemaReservationChargeCardModal
        : headerTitle === "Capture Payment"
        ? validateSchemaReservationCaptureModal
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

    if (userInfo?.user_data?.organization?.uuid) {
      ClientService.vateRatesList(userInfo?.user_data?.organization?.uuid, true)
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
    setValue("captureAmount", amount);
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
    } else if (["Resend Order", "Resend Reservation"].includes(headerTitle)) {
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
        if (window.location.pathname === `/create-order/details/${orderId}`)
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
    } else if (["Cancel Order", "Cancel Reservation"].includes(headerTitle)) {
      setApiLoading(true);
      cancelOrder(data).then((res) => {
        if (res?.data?.status_code === 202) {
          enqueueSnackbar(t(`message:${res?.data?.message}`), {
            variant: "success",
          });
          // setApiLoading(false);
        }
        if (window.location.pathname === `/create-order/details/${orderId}`)
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
          //console.log(response?.data);
          setApiLoading(false);
        }
      );
    } else if (headerTitle === "Charge Amount") {
      grandTotal = (grandTotal / 2).toFixed(2);
      const chargeData = ReservationService.prepareChargeAmountPayload({
        ...values,
        orderSummary: {
          subTotal,
          totalTax,
          totalDiscount,
          grandTotal,
        },
      });
      console.log(chargeData);
    }
  };
  const headerTitleText =
    headerTitle === "moreThanThreeRefundAttempts" || flag
      ? "requestForRefundApproval"
      : headerTitle;
  const orderIdTextLabel = orderIdText ? orderIdText : t("label:orderId");

  const modalSize = headerTitle === "Charge Amount" ? "lg" : "sm";
  const disableCurrentProductRow = (index) => {
    setDisableRowIndexes([...disableRowIndexes, index]);
  };
  const enableCurrentProductRow = (ind) => {
    setDisableRowIndexes(disableRowIndexes.filter((item) => item !== ind));
  };

  const triggerProductSelected = (index, productData) => {
    if (productData) {
      if (productData?.name) {
        setValue(`order[${index}].productName`, productData.name);
        setValue(`order[${index}].productID`, productData.id);
        const preparedPrice = productData.price.toString().includes(".")
          ? `${productData.price.toString().split(".")[0]},${
              productData.price.toString().split(".")[1]
            }`
          : productData.price;
        setValue(`order[${index}].reservationAmount`, preparedPrice);
        setValue(`order[${index}].tax`, productData.tax);
        disableCurrentProductRow(index);

        const watchResevationAmount = watch(
          `order[${index}].reservationAmount`
        );
        const watchTax = watch(`order[${index}].tax`);
        const watchName = watch(`order[${index}].productName`);
        const watchId = watch(`order[${index}].productID`);

        for (let i = 0; i < addOrderIndex.length; i++) {
          if (
            watchName &&
            watchId &&
            watchResevationAmount &&
            watchTax &&
            i !== index &&
            watchName === watch(`order[${i}].productName`) &&
            watchId === watch(`order[${i}].productID`) &&
            watchResevationAmount === watch(`order[${i}].reservationAmount`) &&
            watchTax === watch(`order[${i}].tax`)
          ) {
            onSameRowAction(index);
            enqueueSnackbar(
              `Same product found in Row ${i + 1} and ${index + 1}`,
              { variant: "error" }
            );
          }
        }
      } else
        setValue(`order[${index}].productName`, productData ? productData : "");
    } else {
      setValue(`order[${index}].productName`, "");
      setValue(`order[${index}].productID`, "");
      setValue(`order[${index}].reservationAmount`, "");
      setValue(`order[${index}].tax`, "");
      enableCurrentProductRow(index);
    }
  };
  const productWiseTotal = (index) => {
    const watchReservationAmount =
      watch(`order[${index}].reservationAmount`) || 0;
    const watchTax = watch(`order[${index}].tax`);
    //const watchName = watch(`order[${index}].productName`);
    //const watchId = watch(`order[${index}].productID`);

    let splitedAmount, dotFormatAmount, floatAmount, amount;
    if (!!watchReservationAmount) {
      amount = watchReservationAmount;
      splitedAmount = amount.toString().includes(",")
        ? amount.split(",")
        : amount;
      dotFormatAmount =
        typeof splitedAmount === "object"
          ? `${splitedAmount[0]}.${splitedAmount[1]}`
          : splitedAmount;
      floatAmount = parseFloat(dotFormatAmount);
    }

    const total = floatAmount;
    const subTotalCalculation = floatAmount / ((100 + watchTax) / 100);
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
  const watchFirstProductName = watch(`order[0].productName`);

  const pnameOnBlur = (e) => {
    if (!e.target.value.length) {
      resetField(`${e.target.name}`);
    }
  };
  let defaultTaxValue;

  return (
    <div>
      <Dialog
        open={open}
        maxWidth={modalSize}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className={
          headerTitle == "Charge Amount"
            ? "charge-modal create-order-dialog"
            : "create-order-dialog"
        }
      >
        <div className={"p-10 w-full rounded-4 md:min-w-" + modalSize}>
          <div className="p-16 subtitle1 m-10 bg-primary-50 rounded-6 text-primary-800">
            {t(`label:${_.camelCase(headerTitleText)}`)}
          </div>
          <DialogContent className="p-5 sm:p-10">
            <div className="modeal-text">
              {headerTitle !== "moreThanThreeRefundAttempts" &&
                headerTitle !== "moreThanFiveThousand" &&
                headerTitle !== "Charge Amount" &&
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

              {headerTitle === "Complete Reservation" && (
                <div className="flex justify-between items-center p-8 rounded-4 bg-MonochromeGray-25">
                  <div className="text-MonochromeGray-700">
                    {t("label:amountInBank")}
                  </div>
                  <div className="text-MonochromeGray-700">
                    {t("label:nok")} {ThousandSeparator(amountInBank)}
                  </div>
                </div>
              )}

              {headerTitle === "Refund from Reservation" && (
                <div className="flex justify-between items-center p-8 rounded-4 bg-MonochromeGray-25">
                  <div className="text-MonochromeGray-700">
                    {t("label:refandFromResurvation")}
                  </div>
                  <div className="text-MonochromeGray-700">
                    {t("label:nok")} {ThousandSeparator(remainingAmount)}
                  </div>
                </div>
              )}

              {headerTitle === "Capture Payment" && (
                <div className="flex justify-between items-center p-8 rounded-4 bg-MonochromeGray-25">
                  <div className="text-MonochromeGray-700">
                    {t("label:remainingAmount")}
                  </div>
                  <div className="text-MonochromeGray-700">
                    {t("label:nok")} {ThousandSeparator(remainingAmount)}
                  </div>
                </div>
              )}

              {/* {(amountInBank || remainingAmount) && (
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
              )} */}

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
                      <div className="caption2">
                        {headerTitle === "Capture Payment"
                          ? t("label:paymentType")
                          : t("label:refundType")}
                      </div>
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
                            setValue("captureAmount", "");
                          }}
                        >
                          {headerTitle === "Capture Payment"
                            ? t("label:partialPayment")
                            : t("label:partialRefund")}
                        </Button>
                      </div>
                      {headerTitle === "Capture Payment" ? (
                        <Controller
                          name="captureAmount"
                          className="mt-32"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:amount")}
                              type="number"
                              autoComplete="off"
                              variant="outlined"
                              error={!!errors.captureAmount}
                              helperText={errors?.captureAmount?.message}
                              fullWidth
                              required
                              InputProps={{
                                inputProps: { min: 0, max: 10 },
                                endAdornment: (
                                  <InputAdornment position="start">
                                    {t("label:nok")}
                                  </InputAdornment>
                                ),
                              }}
                              onChange={(e) => {
                                var value = parseInt(e.target.value, 10);
                                if (value > remainingAmount)
                                  value = remainingAmount;
                                setValue("captureAmount", value);
                              }}
                              disabled={refundType === "full"}
                            />
                          )}
                        />
                      ) : (
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
                      )}
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
                    <div className="product-list">
                      <div className="my-10 product-list-grid-container product-list-grid-container-height bg-primary-25 subtitle3 gap-10 px-10">
                        <div className="my-auto text-MonochromeGray-500">
                          {t("label:itemName")}
                        </div>
                        <div className="my-auto text-MonochromeGray-500">
                          {t("label:productIdOptional")}
                        </div>
                        <div className="my-auto text-right text-MonochromeGray-500">
                          {t("label:amount")}
                        </div>
                        <div className="my-auto text-center text-MonochromeGray-500">
                          {t("label:tax")}
                        </div>
                        <div className="my-auto text-right text-MonochromeGray-500">
                          {t("label:total")}
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
                                    triggerProductSelected(index, data);

                                    return onChange(data);
                                  }}
                                  renderOption={(
                                    props,
                                    option,
                                    { selected }
                                  ) => (
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
                                  helperText={
                                    errors?.reservationAmount?.message
                                  }
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
                                      disabled={disableRowIndexes.includes(
                                        index
                                      )}
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
                    </div>
                    <div className="flex justify-between items-center px-12 py-16 mt-20 rounded-4 bg-MonochromeGray-25">
                      <div className="text-MonochromeGray-700">
                        {t("label:grandTotal")}
                      </div>
                      <div className="text-MonochromeGray-700">
                        {t("label:nok")} {ThousandSeparator(grandTotal)}
                      </div>
                    </div>
                  </div>
                )}
                {flag && (
                  <div>
                    {t(`message:${newString[0]}`)} {newString[1] || ""}
                  </div>
                )}
                <div className="button-group flex justify-end items-center gap-32 mb-32  mt-32 pt-20 border-t-1 border-MonochromeGray-50">
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
                        checkPhone === false) ||
                      (["Cancel Reservation", "Complete Reservation"].includes(
                        headerTitle
                      ) &&
                        !watch("cancellationNote")) ||
                      (headerTitle === "Capture Payment" &&
                        !watch("captureAmount")) ||
                      (headerTitle === "Charge Amount" &&
                        !(grandTotal && isValid))
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
