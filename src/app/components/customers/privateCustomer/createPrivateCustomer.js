import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import { useSnackbar } from "notistack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsFillCheckCircleFill, BsQuestionCircle } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { IoMdAdd } from "react-icons/io";
import PhoneInput from "react-phone-input-2";
import { useNavigate } from "react-router-dom";
import CustomersService from "../../../data-access/services/customersService/CustomersService";
import DiscardConfirmModal from "../../common/confirmDiscard";
import FAQs from "../../common/faqs";
import { PrivateDefaultValue, validateSchemaPrivate } from "../utils/helper";
import {
  useCreatePrivateCustomerMutation,
  useGetCustomersListQuery,
} from "app/store/api/apiSlice";
import CountrySelect from "../../common/countries";

const createPrivateCustomer = () => {
  const { t } = useTranslation();
  const [sameAddress, setSameAddress] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [createPrivateCustomer] = useCreatePrivateCustomerMutation();

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // form
  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    PrivateDefaultValue,
    resolver: yupResolver(validateSchemaPrivate),
  });
  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (values) => {
    setLoading(true);
    const preparedPayload =
      CustomersService.prepareCreatePrivateCustomerPayload(values, sameAddress);
    createPrivateCustomer(preparedPayload).then((response) => {
      if (response?.data?.status_code === 201) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), { variant: "success" });
        navigate("/customers/customers-list");
        setLoading(false);
      } else if (response?.error?.data?.status_code === 417) {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
        setLoading(false);
      }
    });
    // CustomersService.createPrivateCustomer(values, sameAddress)
    //   .then((response) => {
    //     if (response?.status_code === 201) {
    //       enqueueSnackbar(response.message, { variant: "success" });
    //       navigate("/customers/customers-list");
    //       setLoading(false)
    //     } else if (response?.status_code === 417) {
    //       enqueueSnackbar(response.error[0], { variant: "error" });
    //       setLoading(false)
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //     setLoading(false)
    //   });
  };

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white p-0 md:px-20">
          <form name="loginForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className=" header-click-to-action">
              <div className="header-text header6">
                {t("label:newPrivateCustomer")}
              </div>
              <div className="button-container-product ">
                <Button
                  color="secondary"
                  type="button"
                  variant="outlined"
                  className="font-semibold rounded-4 border-2 hover:border-2 hover:border-MonochromeGray-50 border-MonochromeGray-50 w-full sm:w-auto"
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
                  {t("label:createCustomer")}
                </LoadingButton>
              </div>
            </div>
            <div className="main-layout-product">
              <div className="col-span-1 md:col-span-4 bg-white">
                <div className="  subtitle3 header-bg-900-product flex flex-row items-center gap-10">
                  {t("label:primaryInformation")}
                  {dirtyFields.primaryPhoneNumber &&
                  dirtyFields.customerEmail &&
                  dirtyFields.customerName &&
                  dirtyFields.billingAddress &&
                  dirtyFields.billingZip &&
                  dirtyFields.billingCity &&
                  dirtyFields.billingCountry ? (
                    <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                  ) : (
                    <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-32 px-10 md:px-16">
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
                          specialLabel={`${t("label:phone")}*`}
                          // onBlur={handleOnBlurGetDialCode}
                        />
                        <FormHelperText>
                          {errors?.primaryPhoneNumber?.message ? t(`validation:${errors?.primaryPhoneNumber?.message}`) : ""}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="customerEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:emailId")}
                        className="bg-white"
                        type="email"
                        autoComplete="off"
                        error={!!errors.customerEmail}
                        helperText={errors?.customerEmail?.message ? t(`validation:${errors?.customerEmail?.message}`) : ""}
                        variant="outlined"
                        fullWidth
                        required
                      />
                    )}
                  />
                  <Controller
                    name="customerName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:customerName")}
                        className="bg-white"
                        type="text"
                        autoComplete="off"
                        error={!!errors.customerName}
                        helperText={errors?.customerName?.message ? t(`validation:${errors?.customerName?.message}`) : ""}
                        variant="outlined"
                        fullWidth
                        required
                      />
                    )}
                  />
                  {/*<Controller*/}
                  {/*  name="pNumber"*/}
                  {/*  control={control}*/}
                  {/*  render={({ field }) => (*/}
                  {/*    <TextField*/}
                  {/*      {...field}*/}
                  {/*      label={t("label:pNumber")}*/}
                  {/*      className="w-full md:w-3/5"*/}
                  {/*      type="number"*/}
                  {/*      autoComplete="off"*/}
                  {/*      error={!!errors.pNumber}*/}
                  {/*      helperText={errors?.pNumber?.message ? t(`validation:${errors?.pNumber?.message}`) : ""}*/}
                  {/*      variant="outlined"*/}
                  {/*      //fullWidth*/}
                  {/*    />*/}
                  {/*  )}*/}
                  {/*/>*/}
                </div>
                <div className="px-10 md:px-16">
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
                            helperText={errors?.billingAddress?.message ? t(`validation:${errors?.billingAddress?.message}`) : ""}
                            variant="outlined"
                            fullWidth
                            required
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
                            helperText={errors?.billingZip?.message ? t(`validation:${errors?.billingZip?.message}`) : ""}
                            variant="outlined"
                            fullWidth
                            required
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
                          helperText={errors?.billingCity?.message ? t(`validation:${errors?.billingCity?.message}`) : ""}
                          variant="outlined"
                          fullWidth
                          required
                        />
                      )}
                    />
                    <CountrySelect
                      control={control}
                      name={"billingCountry"}
                      label={"Country"}
                      placeholder={"country"}
                      required={true}
                      error={errors.billingCountry}
                    />
                  </div>
                </div>
                <div className="my-20">
                  <Accordion
                    className={`${
                      !expanded ? "bg-primary-25" : "bg-primary-700"
                    } mt-20 bg-primary-25 shadow-0 border-0 custom-accordion`}
                  >
                    <AccordionSummary
                      expandIcon={
                        !expanded ? (
                          <IoMdAdd className="icon-size-20" />
                        ) : (
                          <FiMinus
                            className={`icon-size-20 ${
                              !expanded ? "" : "text-white"
                            }`}
                          />
                        )
                      }
                      onClick={() => setExpanded(!expanded)}
                      id="panel1a-header"
                    >
                      <div
                        className={`subtitle3 flex gap-10 justify-center items-center ${
                          !expanded ? "text-MonochromeGray-700" : "text-white"
                        }`}
                      >
                        {t("label:shippingInformation")}
                        {sameAddress ||
                        (dirtyFields.shippingAddress &&
                          dirtyFields.shippingZip &&
                          dirtyFields.shippingCity &&
                          dirtyFields.shippingCountry) ? (
                          <BsFillCheckCircleFill className="icon-size-16 text-teal-300" />
                        ) : (
                          <BsFillCheckCircleFill className="icon-size-16 text-MonochromeGray-50" />
                        )}
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className="bg-white px-10 md:px-16">
                      <div className="shipping-information">
                        <div className="w-full">
                          <div className="flex justify-between items-center billing-address-head no-padding-x">
                            <div className="billing-address-right">
                              <FormControlLabel
                                className="font-bold ml-0"
                                control={
                                  <Switch
                                    onChange={() =>
                                      setSameAddress(!sameAddress)
                                    }
                                    checked={sameAddress}
                                    name="jason"
                                    color="secondary"
                                  />
                                }
                                label={t("label:sameAsBillingAddress")}
                                labelPlacement="start"
                                disabled={
                                  !(
                                    dirtyFields.billingAddress &&
                                    dirtyFields.billingZip &&
                                    dirtyFields.billingCity &&
                                    dirtyFields.billingCountry
                                  )
                                }
                              />
                            </div>
                          </div>
                          {!sameAddress &&
                            dirtyFields.billingAddress &&
                            dirtyFields.billingZip &&
                            dirtyFields.billingCity &&
                            dirtyFields.billingCountry && (
                              <div className="">
                                <div className="form-pair-three-by-one">
                                  <div className="col-span-3">
                                    <Controller
                                      name="shippingAddress"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:streetAddress")}
                                          type="text"
                                          autoComplete="off"
                                          disabled={sameAddress}
                                          error={!!errors.shippingAddress}
                                          helperText={
                                            errors?.shippingAddress?.message ? t(`validation:${errors?.shippingAddress?.message}`) : ""
                                          }
                                          variant="outlined"
                                          fullWidth
                                        />
                                      )}
                                    />
                                  </div>
                                  <div className="col-span-1">
                                    <Controller
                                      name="shippingZip"
                                      className="col-span-1"
                                      control={control}
                                      render={({ field }) => (
                                        <TextField
                                          {...field}
                                          label={t("label:zipCode")}
                                          type="number"
                                          onWheel={event => { event.target.blur()}}
                                          autoComplete="off"
                                          disabled={sameAddress}
                                          error={!!errors.shippingZip}
                                          helperText={
                                            errors?.shippingZip?.message ? t(`validation:${errors?.shippingZip?.message}`) : ""
                                          }
                                          variant="outlined"
                                          fullWidth
                                        />
                                      )}
                                    />
                                  </div>
                                </div>
                                <div className="form-pair-input gap-x-20">
                                  <Controller
                                    name="shippingCity"
                                    control={control}
                                    render={({ field }) => (
                                      <TextField
                                        {...field}
                                        label={t("label:city")}
                                        type="text"
                                        autoComplete="off"
                                        disabled={sameAddress}
                                        error={!!errors.shippingCity}
                                        helperText={
                                          errors?.shippingCity?.message ? t(`validation:${errors?.shippingCity?.message}`) : ""
                                        }
                                        variant="outlined"
                                        fullWidth
                                      />
                                    )}
                                  />
                                  <CountrySelect
                                    control={control}
                                    name={"shippingCountry"}
                                    label={"country"}
                                    placeholder={"country"}
                                    required={false}
                                    error={errors.shippingCountry}
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
              <div className="col-span-2 hidden md:block border-1 border-MonochromeGray-25">
                <FAQs />
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <div className="fixed bottom-0 right-0 mr-20 mb-20 block md:hidden "> */}
      <div className="fixed bottom-0 right-0 mr-20 mb-20 hidden ">
        <Button
          color="secondary"
          variant="contained"
          className="rounded-full custom-button-shadow bg-primary-50 text-primary-800 button2 hover:bg-primary-25"
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          startIcon={<BsQuestionCircle />}
        >
          {t("label:faqs")}
        </Button>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          PaperProps={{
            sx: { width: "70%" },
          }}
        >
          <FAQs />
        </Drawer>
      </div>
      <DiscardConfirmModal
        open={open}
        defaultValue={PrivateDefaultValue}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};
export default createPrivateCustomer;
