import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useLocation, useParams } from 'react-router-dom';
import * as Yup from "yup";
import AuthService from "../../../data-access/services/authService";
import Contact from '../Layout/contact';
import AuthLayout from "../Layout/layout";
import AuthMobileHeader from "../Layout/authMobileHeader";
import { useTranslation } from 'react-i18next';
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {changeLanguage} from "app/store/i18nSlice";
/**
 * Form Validation Schema
 */
const schema = Yup.object().shape({
  password: Yup.string()
    .required("pleaseEnterYourPassword")
    .matches(
      /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "passwordCombinationRules"
    ),
  confirmpassword: Yup.string().when("password", {
    is: (val) => !!(val && val.length > 0),
    then: Yup.string().oneOf(
      [Yup.ref("password")],
      "bothPasswordNeedToBeTheSame"
    ),
  }),
});

const defaultValues = {
  password: "",
  confirmpassword: "",
};

function ResetPasswordPage() {
  const [isSend, setIsSend] = React.useState(false);
  const [hide, setHide] = React.useState(true);
  const location = useLocation();
  const loginToken = new URLSearchParams(location.search).get("loginToken");
  const accessToken = new URLSearchParams(location.search).get("accessToken");
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const { enqueueSnackbar } = useSnackbar();
  const params = useParams();
  const {t} = useTranslation()

  const onSubmit = async (values) => {
    AuthService.resetPassword(values.confirmpassword, params.token)
      .then((response) => {
        if (response?.status_code === 202) {
          setIsSend(true)
          localStorage.clear()
        } else {
        }
      })
      .catch((error) => {
        enqueueSnackbar(t(`message:${error}`), { variant: "error" });
      });
    reset(defaultValues);
    // setIsSend(true)
  };
  useEffect(() => {
    dispatch(changeLanguage("no"));
  }, []);

  const handleClickShowPassword = () => {
    setHide(!hide);
  };

  return (
    <AuthLayout>
    <AuthMobileHeader isShow = {true} />
      {!!isSend === false && (
        <div className="w-full px-0 sm:px-20 mx-auto mt-32">
          <div className="header4 text-left sm:text-center mb-5">{t("label:setNewPassword")}</div>
          <div className="body2 text-left sm:text-center pb-7">
            {t("label:setNewPasswordValidationMessage")}
            {/*Your password must be between 8-15 digits and contain both*/}
            {/*numbers and alphabets.*/}
          </div>
          <form
            name="resetPassForm"
            noValidate
            className="flex flex-col justify-center w-full mt-48"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label={t("label:password")}
                  type={!hide ? "text" : "password"}
                  error={!!errors.password}
                  helperText={errors?.password?.message ? t(`validation:${errors?.password?.message}`) : ""}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {!hide ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
            <Controller
              name="confirmpassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label={t("label:confirmPassword")}
                  type={!hide ? "text" : "password"}
                  error={!!errors.confirmpassword}
                  helperText={errors?.confirmpassword?.message ? t(`validation:${errors?.confirmpassword?.message}`) : ""}
                  variant="outlined"
                  required
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="start">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {!hide ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16 rounded-md button2 button-min-height"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              {t("label:updatePassword")}
            </Button>
          </form>
        </div>
      )}
      {!isSend === true && (
        <Contact />
      )}
      {!!isSend === true && (
        <div className="w-full max-w-320 sm:w-320 mx-auto  h-full bg-grey-50 rounded-md p-10 flex justify-end items-center">
          <div className="flex flex-col pb-92">
            <div className="header4 text-center mb-5">
              {t("label:passwordUpdatedSuccessfully")}!
            </div>
            <Link to="/login">
              <Button
                variant="contained"
                color="secondary"
                className=" w-full mt-16 rounded-md button2 button-min-height"
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

export default ResetPasswordPage;
