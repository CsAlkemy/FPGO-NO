import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-input-2";
import {FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField,} from "@mui/material";
import {useSnackbar} from "notistack";
import {useNavigate} from "react-router-dom";
import {schemaUserProfile, schemaUserProfileFpAdmin,} from "../utils/helper";
import UserService from "../../../data-access/services/userService/UserService";
import {useSelector} from "react-redux";
import {selectUser} from "app/store/userSlice";
import {BUSINESS_ADMIN, FP_ADMIN,} from "../../../utils/user-roles/UserRoles";
import {useTranslation} from "react-i18next";
import {useUpdateUserMutation} from "app/store/api/apiSlice";
import AuthService from "../../../data-access/services/authService";

const defaultValues = {
  email: "",
  fullName: "",
  phoneNumber: "47",
  designation: "",
  role: "",
  organization: "",
  subClient: "",
  branch: "",
  userID: "",
  preferredLanguage: "",
};

const fpAdminProfileForm = ({ submitRef, role, userProfile, setIsDirty  }) => {
  const { t } = useTranslation();
  const [roleList, setRoleList] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const [isUserID, setIsUserID] = React.useState(true);
  const [dialCode, setDialCode] = React.useState("47");
  const [organizationsList, setOrganizationsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const Location = window.location.href;
  const [languageList, setLanguageList] = useState([
    { title: "English", value: "en" },
    { title: "Norwegian", value: "no" },
  ]);
  const [updateUser] = useUpdateUserMutation();

  const schema =
    isUserID === true ? schemaUserProfile : schemaUserProfileFpAdmin;
  const handleOnBlurGetDialCode = (value, data, event) => {
    setDialCode(data?.dialCode);
  };

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors, isDirty } = formState;

  useEffect(()=>{
      setIsDirty(isDirty)
  },[isDirty])
  function onSubmit(values) {
    const phoneNumber = values?.phoneNumber
      ? values.phoneNumber.split("+")
      : null;
    const msisdn = phoneNumber
      ? phoneNumber[phoneNumber.length - 1].slice(2)
      : null;
    const countryCode = phoneNumber
      ? "+" + phoneNumber[phoneNumber.length - 1].slice(0, 2)
      : null;
    const userData = {
      uuid: userProfile?.uuid,
      name: values?.fullName,
      email: values?.email,
      countryCode,
      msisdn,
      organizationUuid: values?.organization || null,
      userRoleSlug: values?.role,
      designation: values?.designation,
      preferredLanguage: values?.preferredLanguage
        ? values?.preferredLanguage
        : null,
    };
    updateUser(userData).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
      }
    });
  }

  React.useEffect(() => {
    defaultValues.email = userProfile?.email ? userProfile.email : "";
    defaultValues.fullName = userProfile?.name ? userProfile.name : "";
    defaultValues.phoneNumber =
      userProfile?.countryCode && userProfile?.msisdn
        ? userProfile.countryCode + userProfile.msisdn
        : "47";
    defaultValues.designation = userProfile?.designation
      ? userProfile?.designation
      : "";
    defaultValues.role = userProfile["userRoleDetails"]?.slug
      ? userProfile["userRoleDetails"].slug
      : "";
    defaultValues.organization =
      (role === 0 && userProfile["userRoleDetails"].slug === FP_ADMIN) ||
      role === 1
        ? "Front Payment AS"
        : userProfile["organizationDetails"]?.uuid
        ? userProfile["organizationDetails"]?.uuid
        : "";
    defaultValues.preferredLanguage = userProfile?.preferredLanguage
      ? userProfile.preferredLanguage
      : "";
    // defaultValues.branch = userProfile['organizationDetails']?.name
    reset({ ...defaultValues });

    if (isLoading) {
      AuthService.axiosRequestHelper().then((isAuthenticated) => {
        UserService.userRoleList(true)
          .then((response) => {
            if (response?.status_code === 200 && response?.is_data === true) {
              setRoleList(response.data);
            } else if (response?.is_data === false) {
              setRoleList([]);
            } else {
              enqueueSnackbar(t(`message:noRoleFound`), { variant: "warning" });
            }
          })
          .catch((error) => {});

        UserService.organizationsList(true)
          .then((response) => {
            if (response?.status_code === 200 && response?.is_data) {
              setOrganizationsList(response.data);
              setIsLoading(false);
            } else if (response?.is_data === false) {
              setOrganizationsList([]);
            } else {
              enqueueSnackbar(t(`message:noOrganizationFound`),{ variant: "warning" });
            }
          })
          .catch((error) => {});
      });
    }

    // UserService.userRoleList().then((response) => {
    //   if (response?.status_code === 200 && response?.is_data === true) {
    //     setRoleList(response.data);
    //   } else if (response?.is_data === false) {
    //     setRoleList([]);
    //   } else {
    //     enqueueSnackbar("No role found", { variant: "warning" });
    //   }
    // });

    // UserService.organizationsList()
    //   .then((response) => {
    //     if (response?.status_code === 200 && response?.is_data) {
    //       setOrganizationsList(response.data);
    //       setIsLoading(false);
    //     } else if (response?.is_data === false) {
    //       setOrganizationsList([]);
    //     } else {
    //       enqueueSnackbar("No Organization found", { variant: "warning" });
    //     }
    //   })
    //   .catch((error) => {});
    // return ()=> {
    //   localStorage.removeItem("userProfile")
    // }
  }, [Location, isLoading]);

  return (
    <>
      <form name="createUserForm" noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col justify-center w-full mt-32 mb-20 px-0 md:px-14">
          <div className="form-pair-input mb-0-i">
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  // disabled={true}
                  label={t("label:emailId")}
                  // disabled={role === 1 || role === 4 || role === 5}
                  disabled={true}
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
                <FormControl error={!!errors.phoneNumber} required fullWidth>
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
                      ? t(`helperText:${errors?.phoneNumber?.message}`)
                      : ""}
                  </FormHelperText>
                </FormControl>
              )}
            />

            {role === 0 &&
              userProfile["userRoleDetails"].slug !== FP_ADMIN &&
              role !== 1 && (
                <Controller
                  name="organization"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      error={!!errors.organization}
                      required
                      fullWidth
                    >
                      <InputLabel id="demo-simple-select-label-org">
                        {t("label:organization")}
                      </InputLabel>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label-org"
                        id="demo-simple-select"
                        label="Organization"
                        disabled={
                          user.role[0] === BUSINESS_ADMIN ||
                          userProfile["userRoleDetails"].slug === FP_ADMIN ||
                          role !== 0
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
                    </FormControl>
                  )}
                />
              )}
            {((role === 0 &&
              userProfile["userRoleDetails"].slug === FP_ADMIN) ||
              role === 1) && (
              <Controller
                name="organization"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("label:organization")}
                    type="text"
                    autoComplete="off"
                    error={!!errors.organization}
                    helperText={
                      errors?.organization?.message
                        ? t(`helperText:${errors?.organization?.message}`)
                        : ""
                    }
                    variant="outlined"
                    fullWidth
                    // defaultValue={"Front Payment AS"}
                    disabled
                  />
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
                      ? t(`helperText:${errors?.designation?.message}`)
                      : ""
                  }
                  variant="outlined"
                  fullWidth
                />
              )}
            />
            <Controller
              name="role"
              control={control}
              disabled={
                role === 1 ||
                role === 4 ||
                role === 5 ||
                (role === 0 && userProfile["userRoleDetails"].slug === FP_ADMIN)
              }
              render={({ field }) => (
                <FormControl error={!!errors.role} required fullWidth>
                  <InputLabel id="demo-simple-select-label-role">
                    {t("label:role")}
                  </InputLabel>
                  <Select
                    {...field}
                    labelId="demo-simple-select-label-role"
                    id="demo-simple-select"
                    label="Role"
                    disabled={
                      role === 1 ||
                      role === 5 ||
                      role === 4 ||
                      (role === 0 &&
                        userProfile["userRoleDetails"].slug === FP_ADMIN)
                    }
                  >
                    {(role === 1 &&
                      roleList.length > 0 &&
                      user.role[0] === FP_ADMIN) ||
                    (role === 0 &&
                      userProfile["userRoleDetails"].slug === FP_ADMIN) ? (
                      roleList.map((item, index) => {
                        return (
                          <MenuItem key={index} value={item.slug}>
                            {item.title}
                          </MenuItem>
                        );
                      })
                    ) : roleList.length > 0 ? (
                      roleList
                        .filter((num) => {
                          return num.hierarchy >= 2;
                        })
                        .map((item, index) => {
                          return (
                            <MenuItem key={index} value={item.slug}>
                              {item.title}
                            </MenuItem>
                          );
                        })
                    ) : (
                      <MenuItem disabled>{t("label:noRoleFound")}</MenuItem>
                    )}
                  </Select>
                  <FormHelperText>
                    {errors?.role?.message
                      ? t(`helperText:${errors?.role?.message}`)
                      : ""}
                  </FormHelperText>
                </FormControl>
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
                            {t(`label:${item?.title.toLowerCase()}`)}
                        </MenuItem>
                      );
                    })}
                  </Select>
                  <FormHelperText>
                    {errors.preferredLanguage?.message ? t(`helperText:${errors.preferredLanguage?.message}`) : ""}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </div>
        </div>
        <button ref={submitRef} type="submit" style={{ display: "none" }} />
      </form>
    </>
  );
};

export default fpAdminProfileForm;
