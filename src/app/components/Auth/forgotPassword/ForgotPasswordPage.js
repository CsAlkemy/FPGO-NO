import history from "@history";
import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Hidden, MenuItem, Select, SvgIcon, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import LanguageIcon from '@mui/icons-material/Language';
import { Link } from "react-router-dom";
import * as yup from "yup";
import AuthService from "../../../data-access/services/authService";
import AuthLayout from "../Layout/layout";
import AuthMobileHeader from "../Layout/authMobileHeader";
import { useTranslation } from 'react-i18next';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
});

const defaultValues = {
  email: "",
};

function ForgotPasswordPage() {
  const [isSend, setIsSend] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const { enqueueSnackbar } = useSnackbar();
  const {t} = useTranslation()

  // async (values)=>
  const onSubmit = async (values) => {
    setLoading(true);
    AuthService.forgotPassword(values)
      .then((response) => {
        if (response?.status === 201) {
          setIsSend(true);
          setTimeout(() => {
            history.push("/login");
          }, 3000);
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
    reset(defaultValues);
  };

  const languages = [
    {
      value: "English",
      label: "en"
    },
    {
      value: "Norwegian",
      label: "no"
    },
  ];
  return (
    <AuthLayout>
      <AuthMobileHeader isShow = {true} />
      {!!isSend === false && (
        <div className="w-full px-0 sm:px-20 mx-auto">
          <div className="text-left sm:text-center mb-5 header4 mt-40">{t("label:resetPassword")}</div>
          <div className=" text-left sm:text-center pb-7 body2">
            {t("label:pleaseTypeInYourEmailToHetPasswordResetLink")}
          </div>
          <form
            name="forgotPassForm"
            noValidate
            className="flex flex-col justify-center w-full mt-48"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label={t("label:email")}
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <LoadingButton
              variant="contained"
              color="secondary"
              className=" w-full mt-16 rounded-4 button2 button-min-height"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
              loading={loading}
              loadingPosition="center"
            >
              {t("label:confirmReset")}
            </LoadingButton>
            <div className="flex flex-col text-center justify-center items-center mt-32 mb-16 font-medium">
              <Link
                className="login-page-no-underline button2 text-primary-500"
                to="/login"
              >
                {t("label:backToLogin")}
              </Link>
            </div>
          </form>
        </div>
      )}
      {!!isSend === true && (
        <div className="w-full max-w-320 sm:w-320 mt-32 sm:mt-0 mx-auto  h-full bg-grey-50 rounded-md p-28 flex justify-end items-center">
          <div className="flex flex-col pb-92">
            <div className="header4 text-center mb-5">
              {t("label:passwordResetLinkSent")}
            </div>
            <div className="body2 text-center pb-60">
              {t("label:aLinkHasBeenSentToYourEmailIdForResettingYourPassword")}
            </div>
            <Link to="/login">
              <Button
                variant="contained"
                color="secondary"
                className=" w-full mt-16 rounded-md"
                aria-label="Confirm"
                size="large"
              >
                {t("label:goToLogin")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
