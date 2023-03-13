import React from "react";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { useSnackbar } from "notistack";
import { schemaUserProfileResetPass, schemaUserProfileResetPassUserDetails, defaultValues } from "../utils/helper";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import UserService from "../../../data-access/services/userService/UserService";
import AuthService from "../../../data-access/services/authService/AuthService";
import { useTranslation } from 'react-i18next';

const updatePassword = ({role, userProfile}) => {
  const {t} = useTranslation()
  const [hide, setHide] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector(selectUser);

 const schema = role === 0 ? schemaUserProfileResetPassUserDetails : schemaUserProfileResetPass;

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors, isDirty } = formState;
  function onSubmit(values) {
    const param = {
      currentPassword: role === 0 ? null : values.currentPassword,
      password: values.confirmpassword,
    };

    UserService.changePassword(
      param,
      userProfile.uuid
    )
      .then((res) => {
      if (res.status_code === 202) {
        enqueueSnackbar(t(`message:${res?.message}`), {
          variant: "success",
        });
        if (
          user['data'].uuid ===
          userProfile.uuid
        ) {
          AuthService.logout();
        }
      }else enqueueSnackbar(res, { variant: "error" });
    })
      .catch((error) => {
        enqueueSnackbar(t(`message:${error}`), { variant: "error" });
      });

    reset(defaultValues);
  }

  const handleClickShowPassword = () => {
    setHide(!hide);
  };

  return (
    <div className="simple">
      <div className=" change-password-header subtitle2">{t("label:changePassword")}</div>
      <div className="p-20 sm:p-20">
        {t("label:changePasswordValidationRule")}
        {/*Your password must be between 8-15 digits and contain both numbers and*/}
        {/*alphabets.*/}
      </div>
      <form name="createUserForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="p-20 sm:p-20 mb-20">
        {
          role !== 0 && (
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-40"
                  label={t("label:currentPassword")}
                  type={!hide ? "text" : "password"}
                  autoComplete="off"
                  error={!!errors.currentPassword}
                  helperText={errors?.currentPassword?.message ? t(`validation:${errors?.currentPassword?.message}`) : ""}
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
          )
        }
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                className="mb-40"
                label={t("label:newPassword")}
                type={!hide ? "text" : "password"}
                autoComplete="off"
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
                className="mb-40"
                label={t("label:retypeNewPassword")}
                type={!hide ? "text" : "password"}
                autoComplete="off"
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
          <Button type="submit" color="secondary" disabled={!isDirty} variant="contained" className="button2 rounded-4 w-full ">
            {t("label:updatePassword")}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default updatePassword;
