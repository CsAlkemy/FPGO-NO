import {
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import FormHelperText from "@mui/material/FormHelperText";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCreditCheckTypeAndId } from "app/store/credit-check/creditCheck";
import React from "react";
import FAQs from "../../common/faqs";
import PhoneInput from "react-phone-input-2";
import CreditCheckService from "../../../data-access/services/creditCheckService/CreditCheckService";
import { BsQuestionCircle } from "react-icons/bs";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from 'react-i18next';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  personalId: yup
          .string()
          .matches(/^[0-9]+$/, { message: 'P number must be number', excludeEmptyString: true })
          .required('P Number is required')
          .nullable().transform((o, c) => o === '' ? null : c)
          .min(11, 'Must be exactly 11 numbers')
          .max(11, 'Must be exactly 11 numbers'),
  trems: yup
    .bool()
    .required("You need to accept the terms and conditions")
    .oneOf([true], "You need to accept the terms and conditions"),
});

export default function CreditCheckPrivateClient() {
  const {t} = useTranslation()
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const creditCheckedId = useSelector(
    (state) => state.creditcheck.creditCheckInfo.id
  );

  const defaultValues = {
    personalId: "",
    phoneNumber: "47",
    acceptTermsConditions: false,
  };

  function onSubmit(data) {
    setLoading(true);
    CreditCheckService.creditCheckPrivate(data)
      .then((response) => {
        if (response?.status_code === 200) {
          dispatch(
            setCreditCheckTypeAndId({
              type: "private",
              id: data.personalId,
            })
          );
          response?.message ? enqueueSnackbar(response?.message, { variant: "success" }) : "";
          setLoading(false);
          setIsSuccess(true);
        } else {
          enqueueSnackbar(response, { variant: "error" });
          setLoading(false);
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
        setLoading(false);
      });
  }

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  return (
    <>
      <div className="create-product-container">
        <div className="inside-div-product">
          <div className="rounded-sm bg-white p-0 md:px-20">
            <form name="loginForm" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className=" header-click-to-action">
                <div className="header-text header6">
                  {t("label:creditCheckPrivateClient")}
                </div>
                {!isSuccess && (
                  <div className=" flex flex-col sm:flex-row gap-20 justify-end w-full sm:w-auto ">
                    <Link to={"/credit-check/credit-checks-list"}>
                      <Button
                        color="secondary"
                        variant="text"
                        className="button2 text-center"
                      >
                        {t("label:cancel")}
                      </Button>
                    </Link>
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      loadingPosition="center"
                      variant="contained"
                      color="secondary"
                      className="font-semibold rounded-4 w-full sm:w-auto min-w-[140px]"
                    >
                      {t("label:confirm")}
                    </LoadingButton>
                  </div>
                )}
              </div>
              {!isSuccess && (
                <div className="main-layout-product ">
                  <div className="col-span-1 md:col-span-4 bg-white">
                    <div className="w-full md:w-3/5 my-20 sm:my-36 px-10 md:px-0 flex flex-col gap-44 justify-center items-center">
                      <Controller
                        name="personalId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:personalId")}
                            type="text"
                            error={!!errors.personalId}
                            helperText={errors?.personalId?.message}
                            variant="outlined"
                            required
                            fullWidth
                          />
                        )}
                      />
                      <Controller
                        name="phoneNumber"
                        control={control}
                        render={({ field }) => (
                          <FormControl error={!!errors.phoneNumber} fullWidth>
                            <PhoneInput
                              {...field}
                              className={
                                errors.phoneNumber
                                  ? "input-phone-number-field border-1 rounded-md border-red-300"
                                  : "input-phone-number-field"
                              }
                              country="no"
                              enableSearch
                              autocompleteSearch
                              countryCodeEditable={false}
                              specialLabel={t("label:phoneNumber")}
                            //onBlur={handleOnBlurGetDialCode}
                            />
                            <FormHelperText>
                              {errors?.phoneNumber?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </div>
                    <div className="mt-48 mb-16">
                      <Controller
                        name="trems"
                        type="checkbox"
                        control={control}
                        render={({
                          field: { onChange, value, onBlur, ref },
                        }) => (
                          <FormControl error={!!errors.trems} required>
                            <FormControlLabel
                              style={{ display: "table" }}
                              control={
                                <div style={{ display: "table-cell" }}>
                                  <Checkbox
                                    checked={value}
                                    onBlur={onBlur}
                                    onChange={(ev) => onChange(ev.target.checked)}
                                    inputRef={ref}
                                    required
                                    defaultValue={false}
                                  />
                                </div>
                              }
                              label={
                                <div className="">
                                  {t("label:privateCreditCheckTnc")}
                                </div>
                              }
                            />
                            <FormHelperText>
                              {errors?.trems?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:block border-1 border-MonochromeGray-25 bg-white">
                    <FAQs />
                  </div>
                </div>
              )}
              {isSuccess && (
                <div className="flex justify-center items-center bg-MonochromeGray-25 rounded-8 p-20 w-full my-20 min-h-200">
                  <div className="flex flex-col justify-center items-center gap-20 my-32">
                    <div className="text-center header5">
                      {t("label:requestSuccessful")}
                    </div>
                    <div className="text-center body2 w-auto sm:w-2/3">
                      {`${t("label:yourCreditCheckRequestFor")} ${t("label:privateClient")} ${creditCheckedId} ${t("label:hasBeenSuccessfullySent")}. ${t("label:youCanTrackTheStatusOfThisRequestOnTheCreditCheckPage")}.`}
                    </div>
                    <Link to={"/credit-check/credit-checks-list"}>
                      <Button
                        color="secondary"
                        variant="contained"
                        className="button2 rounded-4 w-full sm:w-auto"
                      >
                        {t("label:goToCreditCheck")}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
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
      </div>
    </>
  );
}
