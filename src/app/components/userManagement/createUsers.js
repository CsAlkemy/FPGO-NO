import {yupResolver} from "@hookform/resolvers/yup";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {LoadingButton} from "@mui/lab";
import {
    Button,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import {selectUser} from "app/store/userSlice";
import {useSnackbar} from "notistack";
import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import PhoneInput from "react-phone-input-2";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import UserService from "../../data-access/services/userService/UserService";
import {BUSINESS_ADMIN, FP_ADMIN, GENERAL_USER,} from "../../utils/user-roles/UserRoles";
import DiscardConfirmModal from "../common/confirmDiscard";
import {
    defaultValues,
    validateSchemaCreateBusinessAdmin,
    validateSchemaCreateCompanyAdmin,
    validateSchemaGeneralAdmin,
} from "./utils/helper";
import {useCreateUserMutation} from "app/store/api/apiSlice";
import UtilsServices from "../../data-access/utils/UtilsServices";
import AuthService from "../../data-access/services/authService";

export default function CreateUsers() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const [hide, setHide] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [type, setType] = React.useState(
    user.role[0] === FP_ADMIN ? FP_ADMIN : BUSINESS_ADMIN
  );
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [dialCode, setDialCode] = React.useState();
  const navigate = useNavigate();
  const [roleList, setRoleList] = useState([]);
  const [organizationsList, setOrganizationsList] = useState([]);
  const [languageList, setLanguageList] = useState([
    { title: "English", value: "en" },
    { title: "Norwegian", value: "no" },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const info = UtilsServices.getFPUserData();
  const [createUser] = useCreateUserMutation();

  const schema =
    type === FP_ADMIN
      ? validateSchemaCreateCompanyAdmin
      : type === BUSINESS_ADMIN
      ? validateSchemaCreateBusinessAdmin
      : validateSchemaGeneralAdmin;

  const handleOnBlurGetDialCode = (value, data, event) => {
    setDialCode(data?.dialCode);
  };

  const { control, formState, handleSubmit, reset, getValues, watch } = useForm(
    {
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    defaultValues.organization =
      info?.user_data?.user_role?.slug !== FP_ADMIN &&
      info?.user_data?.organization?.uuid
        ? info?.user_data?.organization?.uuid
        : "";
    reset({ ...defaultValues });

    AuthService.axiosRequestHelper().then((isAuthenticated) => {
      UserService.userRoleList(true)
        .then((response) => {
          if (response?.status_code === 200 && response?.is_data) {
            user.role[0] === BUSINESS_ADMIN
              ? setRoleList(
                  response.data.filter((row) => row.slug !== FP_ADMIN)
                )
              : setRoleList(response.data);
            setIsLoading(false);
          }
        })
        .catch((error) => {});
      UserService.organizationsList(true)
        .then((response) => {
          if (response?.status_code === 200 && response?.is_data) {
            setOrganizationsList(response.data);
            setIsLoading(false);
          }
        })
        .catch((error) => {});
    });
  }, [isLoading]);

  // useEffect(() => {
  //   UserService.organizationsList()
  //     .then((response) => {
  //       if (response?.status_code === 200 && response?.is_data) {
  //         setOrganizationsList(response.data);
  //         setIsLoading(false);
  //       }
  //     })
  //     .catch((error) => {
  //     });
  // }, [isLoading]);

  function onSubmit(values) {
    setLoading(true);
    const preparedPayload = UserService.prepareCreateUserByRolePayload(
      values,
      type
    );
    createUser(preparedPayload).then((response) => {
      if (response?.data?.status_code === 201) {
        enqueueSnackbar("User Created Successfully", {
          variant: "success",
          autoHideDuration: 5000,
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        setLoading(false);
        reset(defaultValues);
        navigate(-1);
      } else {
        setLoading(false);
        enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
      }
    });
    // UserService.createUserByRole(values, type)
    //   .then((response) => {
    //     if (response?.status_code === 201) {
    //       enqueueSnackbar("User Created Successfully", {
    //         variant: "success",
    //         autoHideDuration: 5000,
    //         anchorOrigin: {
    //           vertical: "bottom",
    //           horizontal: "right",
    //         },
    //       });
    //       setLoading(false)
    //       reset(defaultValues);
    //       navigate(-1)
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, {
    //       variant: "error",
    //       autoHideDuration: 5000,
    //       anchorOrigin: {
    //         vertical: "bottom",
    //         horizontal: "right",
    //       },
    //     });
    //     setLoading(false)
    //   });
  }

  const handleClickShowPassword = () => {
    setHide(!hide);
  };

  return (
    <>
      <div className="flex flex-col flex-auto min-w-0 bg-MonochromeGray-25">
        <form
          name="createUserForm"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex-auto p-20 sm:p-0 w-full max-w-screen-md bg-white">
            <div className="rounded-sm bg-white p-0 sm:p-20">
              <div className=" header-click-to-action">
                <div className="header-text header6">
                  {t("label:createUser")}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full sm:w-auto">
                  <Button
                    color="secondary"
                    type="reset"
                    variant="outlined"
                    className="button-outline-product"
                    disabled={
                      Object.keys(dirtyFields).length <= 0 ? true : false
                    }
                    onClick={() => setOpen(true)}
                  >
                    {t("label:discard")}
                  </Button>
                  <LoadingButton
                    variant="contained"
                    color="secondary"
                    className="rounded-4 button2 mb-10 sm:mb-0"
                    aria-label="Confirm"
                    size="large"
                    type="submit"
                    loading={loading}
                    loadingPosition="center"
                  >
                    {t("label:createAccount")}
                  </LoadingButton>
                </div>
              </div>
              <div className="p-0 sm:p-20">
                <div className="create-user-form-header subtitle3 bg-m-grey-25">
                  {t("label:userDetails")}
                </div>
                <div className="p-10">
                  <div className="create-user-roles caption2">
                    {t("label:userRole")}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-7 mt-10">
                    {roleList
                      .filter((role) => {
                        return role.hierarchy !== 2 && role.hierarchy !== 3;
                      })
                      .map((role, index) => {
                        return (
                          <button
                            key={index}
                            type="button"
                            className={
                              type === role.slug
                                ? "create-user-role-button-active"
                                : "create-user-role-button"
                            }
                            onClick={() => {
                              setType(role.slug);
                            }}
                          >
                            {role.title}
                          </button>
                        );
                      })}
                  </div>

                  <div className="flex flex-col justify-center w-full mt-32 mb-32">
                    <div className="form-pair-input">
                      <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:emailId")}
                            type="email"
                            autoComplete="off"
                            error={!!errors.email}
                            helperText={
                              errors?.email?.message
                                ? t(`helperText:${errors?.email?.message}`)
                                : ""
                            }
                            variant="outlined"
                            required
                            fullWidth
                          />
                        )}
                      />
                      <Controller
                        name="fullName"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:fullName")}
                            type="text"
                            autoComplete="off"
                            error={!!errors.fullName}
                            helperText={
                              errors?.fullName?.message
                                ? t(`helperText:${errors?.fullName?.message}`)
                                : ""
                            }
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
                          <FormControl
                            error={!!errors.phoneNumber}
                            required
                            fullWidth
                          >
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
                              specialLabel={`${t("label:phone")}*`}
                              onBlur={handleOnBlurGetDialCode}
                            />
                            <FormHelperText>
                              {errors?.phoneNumber?.message
                                ? t(
                                    `helperText:${errors?.phoneNumber?.message}`
                                  )
                                : ""}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                      {(type === BUSINESS_ADMIN || type === GENERAL_USER) && (
                        <Controller
                          name="organization"
                          control={control}
                          render={({ field }) => (
                            <FormControl
                              error={!!errors.organization}
                              required
                              fullWidth
                            >
                              <InputLabel id="demo-simple-select-label-role">
                                {t("label:organization")}
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="demo-simple-select-label-role"
                                id="demo-simple-select"
                                label={t("label:organization")}
                                placeholder={t("label:organization")}
                                disabled={
                                  user.role[0] === BUSINESS_ADMIN ||
                                  user.role[0] === GENERAL_USER
                                }
                              >
                                {organizationsList.map((item, index) => {
                                  return (
                                    <MenuItem key={index} value={item.uuid}>
                                      {item.name}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                              <FormHelperText>
                                {errors.organization?.message}
                              </FormHelperText>
                            </FormControl>
                          )}
                        />
                      )}
                      <Controller
                        name="designation"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:designation")}
                            type="text"
                            autoComplete="off"
                            error={!!errors.designation}
                            helperText={
                              errors?.designation?.message
                                ? t(
                                    `helperText:${errors?.designation?.message}`
                                  )
                                : ""
                            }
                            variant="outlined"
                            fullWidth
                          />
                        )}
                      />
                      <Controller
                        name="preferredLanguage"
                        control={control}
                        render={({ field }) => (
                          <FormControl
                            error={!!errors.preferredLanguage}
                            required
                            fullWidth
                          >
                            <InputLabel id="demo-simple-select-label-role">
                              {t("label:preferredLanguage")}
                            </InputLabel>
                            <Select
                              {...field}
                              labelId="demo-simple-select-label-role"
                              id="demo-simple-select"
                              label={t("label:preferredLanguage")}
                            >
                              {languageList.map((item, index) => {
                                return (
                                  <MenuItem key={index} value={item.value}>
                                    {item.title}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                            <FormHelperText>
                              {errors.preferredLanguage?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    </div>
                    {/* {( type !== GENERAL_USER) && (
                      <Controller
                        name="isSend"
                        type="checkbox"
                        control={control}
                        render={({ field: { onChange, value, onBlur, ref } }) => (
                          <FormControl error={!!errors.isSend} required>
                            <FormControlLabel
                              label="Send Login Credential via Email"
                              control={
                                <Checkbox
                                  checked={value}
                                  onBlur={onBlur}
                                  onChange={(ev) => onChange(ev.target.checked)}
                                  inputRef={ref}
                                  required
                                />
                              }
                            />
                            <FormHelperText>
                              {errors?.isSend?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      />
                    )

                    } */}
                  </div>
                  <div className="create-user-form-header subtitle3 bg-m-grey-25 my-20 set-password">
                    {t("label:setPassword")}
                  </div>
                  <div className="form-pair-input">
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:newPassword")}
                          type={!hide ? "text" : "password"}
                          autoComplete="off"
                          error={!!errors.password}
                          helperText={
                            errors?.password?.message
                              ? t(`helperText:${errors?.password?.message}`)
                              : ""
                          }
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
                          label={t("label:retypeNewPassword")}
                          type={!hide ? "text" : "password"}
                          autoComplete="off"
                          error={!!errors.confirmpassword}
                          helperText={
                            errors?.confirmpassword?.message
                              ? t(
                                  `helperText:${errors?.confirmpassword?.message}`
                                )
                              : ""
                          }
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      <DiscardConfirmModal
        open={open}
        defaultValue={0}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </>
  );
}
