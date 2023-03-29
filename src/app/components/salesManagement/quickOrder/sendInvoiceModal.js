import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import PhoneInput from "react-phone-input-2";
import {
  sendInvoiceDefaultValue,
  sendInvoiceValidation,
} from "../utils/helper";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  useGetUsersListQuery,
  useOrderExportToApticQuery,
  useUpdateQuickOrderCustomerMutation
} from "app/store/api/apiSlice";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const SendInvoiceModal = (props) => {
  const { t } = useTranslation();
  const { editOpen, setEditOpen, customerInfo } = props;
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [updateQuickOrderCustomer, response] =useUpdateQuickOrderCustomerMutation();
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
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    sendInvoiceDefaultValue,
    resolver: yupResolver(sendInvoiceValidation),
  });
  const { isValid, errors } = formState;
  const onSubmit = (values) => {
    setLoading(true);
    const  data = OrdersService.prepareUpdateQuickOrderCustomer(values);
    updateQuickOrderCustomer({...data, uuid:customerInfo?.uuid}).then((response) => {
      if (response?.data?.status_code === 202) {
        OrdersService.sendQuickOrderToAptic(customerInfo?.uuid)
          .then((response)=> {
            enqueueSnackbar(t(`message:${response?.message}`), { variant: "success" });
            setLoading(false);
          })
          .catch((e)=> {
            enqueueSnackbar(t(`message:${e}`), { variant: "error" });
            setLoading(false);
          })
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
      }
    });
  };

  useEffect(()=>{
    sendInvoiceDefaultValue.phone = customerInfo?.phone ? customerInfo?.phone : "";
    reset({...sendInvoiceDefaultValue})
  },[editOpen])

  return (
    <div>
      <Dialog
        open={editOpen}
        maxWidth={"sm"}
        onClose={() => setEditOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rounded-0"
        PaperProps={{
          style: { borderRadius: 8 },
        }}
      >
        <div className="p-10">
          <DialogContent className="p-10">
            <div className="p-16 bg-primary-25 text-primary-800 subtitle1">
              {t("label:sendInvoice")}
            </div>
            <div className="flex justify-between mx-10 items-center my-20">
              <div className="flex flex-col gap-5">
                <div className="body2 font-bold text-MonochromeGray-900">
                  {customerInfo?.phone}
                </div>
                <div className="body2 text-MonochromeGray-500">
                  {t("label:orderID")}: {customerInfo?.uuid}
                </div>
              </div>
              <div className="header6">{t("label:nok")} {customerInfo?.amount}</div>
            </div>
            <hr />
            <form
              name="quickOrderForm"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <div id="customer-information-payment">
                <div className="bg-white px-10">
                  <div className="search-customer-order-create-type my-20">
                    <div className="flex gap-20 w-full md:w-3/4">
                      <Button
                        variant="outlined"
                        className="create-order-capsule-button-active items-center my-auto"
                        // onClick={() => {
                        //   setCustomData({
                        //     ...customData,
                        //     customerType: "private",
                        //   });
                        // }}
                      >
                        {t("label:private")}
                      </Button>
                      <Button
                        variant="outlined"
                        className="body2 create-order-capsule-button"
                        // onClick={() => {
                        //   setCustomData({
                        //     ...customData,
                        //     customerType: "corporate",
                        //   });
                        // }}
                        // disabled={
                        //   orderDetails &&
                        //   orderDetails?.customerDetails?.type === "Private" &&
                        //   !customData?.isNewCustomer
                        // }
                      >
                        {t("label:corporate")}
                      </Button>
                    </div>
                  </div>
                  <div className="w-full my-32">
                    <div className="form-pair-input gap-x-20">
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
                              // enableSearch
                              // autocompleteSearch
                              countryCodeEditable={false}
                              specialLabel={`${t("label:phone")}*`}
                              // onBlur={handleOnBlurGetDialCode}
                              disabled={true}
                              value={field.value || ""}
                            />
                            <FormHelperText>
                              {errors?.phone?.message
                                ? t(`validation:${errors?.phone?.message}`)
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
                            className=""
                            autoComplete="off"
                            error={!!errors.email}
                            helperText={
                              errors?.email?.message
                                ? t(`validation:${errors?.email?.message}`)
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                            // required={
                            //   customData.customerType ===
                            //     "corporate" ||
                            //   customData.orderBy === "email"
                            // }
                            required
                            value={field.value || ""}
                          />
                        )}
                      />
                    </div>
                    <div className="">
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
                              required
                              variant="outlined"
                              fullWidth
                              value={field.value || ""}
                            />
                          )}
                        />
                        <Controller
                          name="orgIdOrPNumber"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={"P-Number"}
                              // label={
                              //   customData.customerType === "private"
                              //     ? t("label:pNumber")
                              //     : t("label:organizationId")
                              // }
                              type="number"
                              autoComplete="off"
                              error={!!errors.orgIdOrPNumber}
                              required
                              helperText={
                                errors?.orgIdOrPNumber?.message
                                  ? t(
                                      `validation:${errors?.orgIdOrPNumber?.message}`
                                    )
                                  : ""
                              }
                              variant="outlined"
                              fullWidth
                              value={field.value || ""}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div id="billing-address-payment px-10">
                <div className="w-full px-10">
                  <div className="form-pair-three-by-one custom-margin-two-payment">
                    <div className="col-span-3">
                      <Controller
                        name="streetAddress"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:streetAddress")}
                            type="text"
                            autoComplete="off"
                            error={!!errors.streetAddress}
                            helperText={
                              errors?.streetAddress?.message
                                ? t(
                                    `validation:${errors?.streetAddress?.message}`
                                  )
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                            value={field.value || ""}
                            required
                          />
                        )}
                      />
                    </div>
                    <div className="col-span-1">
                      <Controller
                        name="zipCode"
                        className="col-span-1"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:zipCode")}
                            type="text"
                            autoComplete="off"
                            error={!!errors.zipCode}
                            helperText={
                              errors?.zipCode?.message
                                ? t(`validation:${errors?.zipCode?.message}`)
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                            value={field.value || ""}
                            required
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="form-pair-input gap-x-20">
                    <Controller
                      name="city"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:city")}
                          type="text"
                          autoComplete="off"
                          error={!!errors.city}
                          helperText={
                            errors?.city?.message
                              ? t(`validation:${errors?.city?.message}`)
                              : ""
                          }
                          variant="outlined"
                          fullWidth
                          value={field.value || ""}
                          required
                        />
                      )}
                    />

                    <Controller
                      name="country"
                      control={control}
                      render={({ field }) => (
                        <FormControl error={!!errors.billingCountry} fullWidth>
                          <InputLabel id="country">
                            {t("label:country")} *
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="country"
                            id="select"
                            label={t("label:country")}
                            value={field.value || ""}
                          >
                            {countries.length ? (
                              countries.map((country, index) => {
                                return (
                                  <MenuItem key={index} value={country.name}>
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
                            {errors?.country?.message
                              ? t(`validation:${errors?.country?.message}`)
                              : ""}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-40 px-10">
                <div className="flex gap-10 items-center">
                  <Button
                    variant="contained"
                    className="font-semibold rounded-4 bg-primary-50 text-primary-800 w-full md:w-auto z-99 px-32"
                    onClick={() => setEditOpen(false)}
                  >
                    {t("label:cancel")}
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    className="rounded-4 button2 min-w-[153px] h-full"
                    aria-label="Confirm"
                    size="large"
                    type="submit"
                    loading={loading}
                    loadingPosition="center"
                    disabled={!isValid}
                  >
                    {t("label:send")}
                  </LoadingButton>
                </div>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  );
};

export default SendInvoiceModal;
