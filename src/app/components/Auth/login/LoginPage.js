import { yupResolver } from "@hookform/resolvers/yup";
import _ from "@lodash";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useEffect, useRef } from "react";
import { AutoTabProvider } from "react-auto-tab";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import AuthService from "../../../data-access/services/authService";
import AuthLayout from "../Layout/layout";
import TimeCounter from "./utils/timeCounter";
import Contact from "../Layout/contact";
import AuthMobileHeader from "../Layout/authMobileHeader";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { BUSINESS_ADMIN, FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import { selectUser } from "app/store/userSlice";

const LoginPage = () => {
  const [isCode, setIsCode] = React.useState(false);
  const [resend, setResend] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [OTP, setOTP] = React.useState("");
  const [one, setOne] = React.useState(false);
  const [two, setTwo] = React.useState(false);
  const [three, setThree] = React.useState(false);
  const [four, setFour] = React.useState(false);
  const [five, setFive] = React.useState(false);

  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const inputRef = useRef();

  const [resendClicked, setResendClicked] = React.useState(false);

  const [data, setData] = React.useState({
    email: "",
    password: "",
    remember: false,
    showPassword: false,
  });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // yup schema
  const schema = yup.object().shape({
    email: yup
      .string()
      .email("youMustEnterAValidEmail")
      .required("youMustEnterAEmail"),
    password: yup.string().required("pleaseEnterYourPassword"),
  });

  // default form values
  const defaultValues = {
    email: "",
    password: "",
    remember: true,
  };

  // form controler
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    const handleEnterKey = (event) => {
      if (event.key === "Enter" && one && two && three && four && five) {
        inputRef.current.click();
      }
    };
    document.addEventListener("keydown", handleEnterKey);
    return () => {
      document.removeEventListener("keydown", handleEnterKey);
    };
  }, [one, two, three, four, five]);

  // handle submit
  const onSubmit = async (values) => {
    setLoading(true);
    const cred = {
      loginToken: values.email,
      password: values.password,
    };
    localStorage.setItem("cred", JSON.stringify(cred));
    AuthService.sendOtp(cred)
      .then((response) => {
        if (response[0]?.status_code === 201) {
          setData(values);
          setOTP(response[1]);
          setIsCode(true);
          setLoading(false);
          enqueueSnackbar(t(`message:${response[0].message}`), { variant: "success" });
        } else {
          enqueueSnackbar(t(`message:${response[0].message}`), { variant: "error" });
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
        enqueueSnackbar(t(`message:${e}`), { variant: "error" });
      });
  };

  const submitOTP = (e) => {
    setLoading(true);
    e.preventDefault();
    const otp = `${e.target[0].value}${e.target[1].value}${e.target[2].value}${e.target[3].value}${e.target[4].value}`;
    const loginToken = JSON.parse(localStorage.getItem("cred")).loginToken;
    AuthService.verifyOtp(loginToken, otp)
      .then((response) => {
        if (response?.status_code === 201) {
          user[0] === FP_ADMIN || user[0] === BUSINESS_ADMIN
            ? navigate("/dashboard")
            : navigate("/sales/orders-list");
        }
      })
      .catch((error) => {
        enqueueSnackbar(t(`message:${error}`), { variant: "error" });
        setLoading(false);
      });
  };

  const resendOTP = () => {
    const cred = JSON.parse(localStorage.getItem("cred"));
    AuthService.sendOtp(cred).then((response) => {
      if (response[0]?.status_code === 201) {
        setOTP(response[1]);
        setIsCode(true);
        setLoading(false);
      } else {
        enqueueSnackbar(response, { variant: "error" });
        setLoading(false);
      }
    });
  };

  const handleClickShowPassword = () => {
    setData({
      ...data,
      showPassword: !data.showPassword,
    });
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("cred");
    };
  }, []);

  return (
    <AuthLayout>
      <AuthMobileHeader isShow={isCode} />
      {!isCode === true && (
        <form
          name="loginForm"
          noValidate
          className="flex flex-col justify-center w-full px-0 md:px-20 mt-32"
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
                autoComplete="off"
                error={!!errors.email}
                helperText={
                  errors?.email?.message
                    ? t(`validation:${errors?.email?.message}`)
                    : ""
                }
                variant="outlined"
                required
                fullWidth
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-24"
                label={t("label:password")}
                type={data.showPassword ? "text" : "password"}
                error={!!errors.password}
                helperText={
                  errors?.password?.message
                      ? t(`validation:${errors?.password?.message}`)
                      : ""
                }
                variant="outlined"
                required
                autoComplete="off"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label={t("label:tooglePasswordVisibility")}
                        onClick={handleClickShowPassword}
                        edge="end"
                      >
                        {data.showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
            {/*<div className="invisible">*/}
            {/*  <Controller*/}
            {/*    name="remember"*/}
            {/*    control={control}*/}
            {/*    render={({ field }) => (*/}
            {/*      <FormControl>*/}
            {/*        <FormControlLabel*/}
            {/*          className="caption2 text-MonochromeGray-300"*/}
            {/*          label={t("label:rememberMe")}*/}
            {/*          control={<Checkbox size="small" {...field} />}*/}
            {/*        />*/}
            {/*      </FormControl>*/}
            {/*    )}*/}
            {/*  />*/}
            {/*</div>*/}

            <Link
              className="login-page-no-underline caption2 text-primary-500"
              to="/forgot-password"
            >
              {t("label:forgotPassword")}?
            </Link>
          </div>

          <LoadingButton
            variant="contained"
            color="secondary"
            className=" w-full mt-16 rounded-4 button2 button-min-height"
            aria-label="Log in"
            disabled={_.isEmpty(dirtyFields) || !isValid}
            type="submit"
            size="large"
            loading={loading}
            loadingPosition="center"
          >
            {t("label:login")}
          </LoadingButton>
          <div className="flex flex-col text-center justify-center items-center mt-32 mb-16 font-medium">
            <div className="mb-4 body3">{t("label:dontHaveAnAccount")}?</div>
            <Link
              className="login-page-no-underline button2 text-primary-500"
              to="/sign-up"
            >
              {t("label:registerNow")}
            </Link>
          </div>
        </form>
      )}
      {!isCode === true && <Contact />}
      {!!isCode === true && (
        <div className="w-full mx-auto px-0 sm:px-20">
          <div className="flex flex-col pb-92">
            <form onSubmit={submitOTP}>
              <div className="header4 text-left sm:text-center mb-5 mt-32">
                {t("label:securityCode")}
              </div>
              <div className="body2 mt-10 text-left sm:text-center pb-60">
                {t(
                  "label:aFiveDigitCodeSentToYourEmailPleaseTypeTheCodeToContinue"
                )}
              </div>
              {window.location.hostname === "demo.frontpayment.no" && (
                <div className="body2 mt-10 text-left sm:text-center pb-60">
                  {`OTP : ${OTP}`}
                </div>
              )}
              <AutoTabProvider className="grid grid-cols-5 gap-4">
                <input
                  name="input1"
                  className="twofactor-input-box text-center"
                  maxLength={1}
                  tabbable="true"
                  // onChange={(e) => handleInputChange(e, 0)}
                  onBlur={(e) =>
                    e.target.value ? setOne(true) : setOne(false)
                  }
                  onChange={(e) =>
                    e.target.value ? setOne(true) : setOne(false)
                  }
                  onFocus={(e) =>
                    e.target.value ? setOne(true) : setOne(false)
                  }
                  onPaste={(e) =>
                    e.target.value ? setOne(true) : setOne(false)
                  }
                />
                <input
                  className="twofactor-input-box text-center"
                  maxLength={1}
                  tabbable="true"
                  onBlur={(e) =>
                    e.target.value ? setTwo(true) : setTwo(false)
                  }
                  onChange={(e) =>
                    e.target.value ? setTwo(true) : setTwo(false)
                  }
                  onFocus={(e) =>
                    e.target.value ? setTwo(true) : setTwo(false)
                  }
                  onPaste={(e) =>
                    e.target.value ? setTwo(true) : setTwo(false)
                  }
                  // onChange={(e) => handleInputChange(e, 1)}
                />
                <input
                  className="twofactor-input-box text-center"
                  maxLength={1}
                  tabbable="true"
                  // onChange={(e) => handleInputChange(e, 2)}
                  onBlur={(e) =>
                    e.target.value ? setThree(true) : setThree(false)
                  }
                  onChange={(e) =>
                    e.target.value ? setThree(true) : setThree(false)
                  }
                  onFocus={(e) =>
                    e.target.value ? setThree(true) : setThree(false)
                  }
                  onPaste={(e) =>
                    e.target.value ? setThree(true) : setThree(false)
                  }
                />
                <input
                  className="twofactor-input-box text-center"
                  maxLength={1}
                  tabbable="true"
                  // onChange={(e) => handleInputChange(e, 3)}
                  onBlur={(e) =>
                    e.target.value ? setFour(true) : setFour(false)
                  }
                  onChange={(e) =>
                    e.target.value ? setFour(true) : setFour(false)
                  }
                  onFocus={(e) =>
                    e.target.value ? setFour(true) : setFour(false)
                  }
                  onPaste={(e) =>
                    e.target.value ? setFour(true) : setFour(false)
                  }
                />
                <input
                  className="twofactor-input-box text-center"
                  maxLength={1}
                  tabbable="true"
                  // onChange={(e) => handleInputChange(e, 4)}
                  onBlur={(e) =>
                    e.target.value ? setFive(true) : setFive(false)
                  }
                  onChange={(e) =>
                    e.target.value ? setFive(true) : setFive(false)
                  }
                  onFocus={(e) =>
                    e.target.value ? setFive(true) : setFive(false)
                  }
                  onPaste={(e) =>
                    e.target.value ? setFive(true) : setFive(false)
                  }
                />
              </AutoTabProvider>
              <div className="flex justify-between py-40 text-16 font-semibold">
                <div>
                  {t("label:timeRemaining")}
                  <TimeCounter
                    initialMinute={1}
                    initialSeconds={30}
                    setResend={setResend}
                    resendClicked={resendClicked}
                    setResendClicked={setResendClicked}
                  />
                </div>
                <a
                  className={
                    resend === true
                      ? "cursor-pointer text-primary-500"
                      : "cursor-pointer text-MonochromeGray-300 opacity-50 pointer-events-none"
                  }
                  onClick={() => {
                    resendOTP();
                    setResendClicked(true);
                  }}
                >
                  {t("label:resendCode")}
                </a>
              </div>
              <LoadingButton
                variant="contained"
                color="secondary"
                className=" w-full mt-16 rounded-4 button2 button-min-height"
                aria-label="Confirm"
                size="large"
                type="submit"
                ref={inputRef}
                loading={loading}
                disabled={!(one && two && three && four && five)}
                loadingPosition="center"
              >
                {t("label:confirm")}
              </LoadingButton>
            </form>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default LoginPage;
