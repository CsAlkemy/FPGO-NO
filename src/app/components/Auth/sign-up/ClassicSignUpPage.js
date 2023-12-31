import {yupResolver} from "@hookform/resolvers/yup";
import LanguageIcon from "@mui/icons-material/Language";
import {Box, Hidden, InputLabel, MenuItem, Select, SvgIcon,} from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {changeLanguage} from "app/store/i18nSlice";
import MuiPhoneNumber from "material-ui-phone-number";
import {useSnackbar} from "notistack";
import {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";
import {useDispatch} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import * as yup from "yup";
import "../../../../styles/colors.css";
import AuthService from "../../../data-access/services/authService";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import AuthMobileHeader from "../Layout/authMobileHeader";
import {useCreateRegistrationRequestMutation} from "app/store/api/apiSlice";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  organizationid: yup
    .string()
    .matches(/\b\d{9}\b/, {
      message: "mustBeNineDigits",
      excludeEmptyString: true,
    })
    .required("youMustEnterYourOrganizationId"),
  companyname: yup.string().required("youMustEnterYourCompanyName"),
  name: yup.string().required("youMustEnterYourName"),
  phonenumber: yup.string().required("youMustEnterYourPhoneNumber")
      .min(8, "enterValidPhoneNumber")
      .max(15, "enterValidPhoneNumber"),
  organizationtype: yup.string().required("youMustSelectType"),
  email: yup
    .string()
    .email("youMustEnterAValidEmail")
    .required("youMustEnterAEmail"),
  // password: yup
  //   .string()
  //   .required("pleaseEnterYourPassword")
  //   .min(8, "Password is too short - should be 8 chars minimum."),
  // passwordConfirm: yup
  //   .string()
  //   .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptTermsConditions: yup
    .boolean()
    .oneOf([true], "theTermsAndConditionsMustBeAccepted"),
});

const defaultValues = {
  organizationid: "",
  companyname: "",
  organizationtype: "",
  name: "",
  phonenumber: "",
  email: "",
  designation: "",
  // password: "",
  acceptTermsConditions: false,
};

function ClassicSignUpPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [orgTypeList, setOrgTypeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [createRegistrationRequest] = useCreateRegistrationRequestMutation();

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(values) {
    const preparedPayload = AuthService.prepareUserRegistrationPayload(values);
    createRegistrationRequest(preparedPayload).then((response) => {
      if (response?.data?.status_code === 201) {
        navigate("/under-review");
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
      }
    });
    // AuthService.userRegistration(values)
    //   .then((response) => {
    //     if (response?.status_code === 201) {
    //       navigate("/under-review");
    //     } else {
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //   });
    //reset(defaultValues);
  }

  useEffect(() => {
    ClientService.organizationTypeList()
      .then((res) => {
        if (res?.status_code === 200 && res?.is_data) {
          setOrgTypeList(res.data);
          setIsLoading(false);
        }
      })
      .catch((e) => {});
  }, [isLoading]);

  const languages = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Norwegian",
      value: "no",
    },
  ];
  useEffect(() => {
    dispatch(changeLanguage("no"));
  }, []);

  const handleLanguageChange = (lng) => {
    dispatch(changeLanguage(lng));
  };
  return (
    <div className="bg-ccc h-auto md:h-screen my-auto flex flex-col justify-center">
      <div className="w-full p-20 sm:p-0 md:w-2/4 bg-white mx-auto my-auto rounded-0 sm:rounded-xl">
        <div className="p-16 sm:p-56 md:p-48">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-32">
            <div className="col-span-1 md:col-span-6">
              <AuthMobileHeader isShow={true} />
              <div className="flex justify-between items-center">
                <div className="header4 mt-32 sm:mt-10">
                  {t("label:registration")}
                </div>
                <Hidden mdDown>
                  <Select
                    sx={{ height: 36 }}
                    defaultValue="Norwegian"
                    displayEmpty
                    renderValue={(value) => {
                      return (
                        <Box
                          sx={{ display: "flex", gap: 1 }}
                          className="flex justify-start items-start"
                        >
                          <SvgIcon color="primary">
                            <LanguageIcon className="text-MonochromeGray-300" />
                          </SvgIcon>
                          <div className="my-auto">{t(`label:${value.toLowerCase()}`)}</div>
                        </Box>
                      );
                    }}
                  >
                    {languages.map((option) => (
                      <MenuItem
                        key={option.value}
                        value={option.label}
                        onClick={() => handleLanguageChange(option.value)}
                      >
                        {t(`label:${option.label.toLowerCase()}`)}
                      </MenuItem>
                    ))}
                  </Select>
                </Hidden>
              </div>
              <Typography className="bg-gray-100 p-14 my-16 subtitle3 text-MonochromeGray-700">
                {t("label:companyInformation")}
              </Typography>

              <form
                name="registerForm"
                noValidate
                className="my-32"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className=" w-full md:w-10/12">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-x-16">
                    <Controller
                      as={TextField}
                      name="organizationid"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24 col-span-1 md:col-span-2"
                          label={t("label:organizationId")}
                          type="number"
                          onWheel={event => { event.target.blur()}}
                          error={!!errors.organizationid}
                          helperText={errors?.organizationid?.message ? t(`validation:${errors?.organizationid?.message}`) : ""}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                    <Controller
                      name="companyname"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          className="mb-24 col-span-1 md:col-span-3"
                          label={t("label:companyName")}
                          type="companyname"
                          error={!!errors.companyname}
                          helperText={errors?.companyname?.message ? t(`validation:${errors?.companyname?.message}`) : ""}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <Controller
                      name="organizationtype"
                      control={control}
                      render={({ field }) => (
                        <FormControl
                          error={!!errors.organizationtype}
                          fullWidth
                        >
                          <InputLabel id="demo-simple-select-label">
                            {t("label:organizationType")} *
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label={t("label:organizationType")}
                            defaultValue=""
                          >
                            {orgTypeList.map((item, index) => {
                              return (
                                <MenuItem key={index} value={item}>
                                  {item}
                                </MenuItem>
                              );
                            })}
                          </Select>
                          <FormHelperText>
                            {errors?.organizationtype?.message ? t(`validation:${errors?.organizationtype?.message}`) : ""}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
                <Typography className="bg-gray-100 p-14 my-16 subtitle3 text-MonochromeGray-700">
                  {t("label:userInformation")}
                </Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label={t("label:fullName")}
                        type="name"
                        error={!!errors.name}
                        helperText={errors?.name?.message ? t(`validation:${errors?.name?.message}`) : ""}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="phonenumber"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <MuiPhoneNumber
                        className="mb-28 bg-white"
                        label={`${t("label:phone")}*`}
                        type="phonenumber"
                        value={value}
                        onChange={onChange}
                        error={!!errors.phonenumber}
                        helperText={errors?.phonenumber?.message ? t(`validation:${errors?.phonenumber?.message}`) : ""}
                        variant="outlined"
                        id="phonenumber"
                        countryCodeEditable={false}
                        fullWidth
                        defaultCountry="no"
                        onlyCountries={["no"]}
                      />
                    )}
                  />
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
                        helperText={errors?.email?.message ? t(`validation:${errors?.email?.message}`) : ""}
                        variant="outlined"
                        required
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="designation"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        className="mb-24"
                        label={t("label:designation")}
                        type="designation"
                        error={!!errors.designation}
                        helperText={errors?.designation?.message ? t(`validation:${errors?.designation?.message}`) : ""}
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                </div>
                <Controller
                  name="acceptTermsConditions"
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      className="items-center"
                      error={!!errors.acceptTermsConditions}
                    >
                      <FormControlLabel
                        label={
                          <p className="mt-[.25rem]">
                            {t("label:iAcceptThe")}{" "}
                            <span className="text-primary-500">
                              {t("label:tnc")}
                            </span>{" "}
                            {t("label:of")} {" "}
                            {t("label:frontGo")}
                          </p>
                        }
                        control={<Checkbox size="small" {...field} />}
                      />
                      <FormHelperText>
                        {errors?.acceptTermsConditions?.message ? t(`validation:${errors?.acceptTermsConditions?.message}`) : ""}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
                <div className="flex justify-end items-center ">
                  <div className="grid grid-cols-2 gap-x-12 w-full md:w-auto">
                    <Link to="/login">
                      <Button
                        variant="outlined"
                        color="secondary"
                        className="w-full md:w-auto mt-32 rounded-4 font-600 border-MonochromeGray-50"
                      >
                        {t("label:backToLogin")}
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      className="w-full md:w-auto mt-32 rounded-4 font-600"
                    >
                      {t("label:createAccount")}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClassicSignUpPage;
