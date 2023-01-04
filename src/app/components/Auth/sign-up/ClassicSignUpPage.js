import { yupResolver } from "@hookform/resolvers/yup";
import LanguageIcon from "@mui/icons-material/Language";
import { Box, Hidden, InputLabel, MenuItem, Paper, Select, SvgIcon } from "@mui/material";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { changeLanguage } from 'app/store/i18nSlice';
import MuiPhoneNumber from "material-ui-phone-number";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import "../../../../styles/colors.css";
import AuthService from "../../../data-access/services/authService";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import AuthMobileHeader from "../Layout/authMobileHeader";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  organizationid: yup
    .string().matches(/\b\d{9}\b/, { message: 'Must be 9 digits', excludeEmptyString: true })
    .required("You must enter your Organization ID"),
  companyname: yup.string().required("You must enter your Company Name"),
  name: yup.string().required("You must enter your name"),
  phonenumber: yup.string().required("You must enter your Phone Number"),
  organizationtype: yup.string().required("You must select type"),
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  // password: yup
  //   .string()
  //   .required("Please enter your password.")
  //   .min(8, "Password is too short - should be 8 chars minimum."),
  // passwordConfirm: yup
  //   .string()
  //   .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptTermsConditions: yup
    .boolean()
    .oneOf([true], "The terms and conditions must be accepted."),
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
  const { t } = useTranslation()

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  function onSubmit(values) {
    AuthService.userRegistration(values)
      .then((response) => {
        if (response?.status_code === 201) {
          navigate("/under-review");
        } else {
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
      });
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
      .catch((e) => { });
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

  const handleLanguageChange = (lng) => {
    dispatch(changeLanguage(lng));
  }

  return (
    <div className="flex flex-col flex-auto items-center justify-around sm:justify-center md:p-32 bg-ccc">
      <Paper className="flex w-11/12 md:w-auto min-h-auto rounded-xl sm:rounded-2xl custom-drop-shadow overflow-hidden max-w-screen-lg">
        <div className="w-full md:w-auto py-32 pb-60 md:pb-auto p-16 sm:p-56 md:p-48 ltr:border-r-1 rtl:border-l-1">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-32">
            <div className="col-span-1 md:col-span-4">
              <AuthMobileHeader isShow={true} />
              <div className="flex justify-between items-center">
                <div className="header4 mt-32 sm:mt-0">{t("label:registration")}</div>
                <Hidden smDown>
                  <Select
                    sx={{ height: 36 }}
                    defaultValue="English"
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
                          <div className="my-auto">{value}</div>
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
                        {option.label}
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
                          error={!!errors.organizationid}
                          helperText={errors?.organizationid?.message}
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
                          helperText={errors?.companyname?.message}
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
                            {errors?.organizationtype?.message}
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
                        helperText={errors?.name?.message}
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
                        helperText={errors?.phonenumber?.message}
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
                        helperText={errors?.email?.message}
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
                        helperText={errors?.designation?.message}
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
                          <p>
                            {t("label:iAcceptThe")}{" "}
                            <span className="text-primary-500">
                              {t("label:tnc")}
                            </span>{" "}
                            {t("label:ofFrontPaymentGo")}
                          </p>
                        }
                        control={<Checkbox size="small" {...field} />}
                      />
                      <FormHelperText>
                        {errors?.acceptTermsConditions?.message}
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
            <div className="col-span-1 md:col-span-2">
              <div className="border-1 border-MonochromeGray-50 rounded-2">
                <div className="subtitle2 bg-primary-25 p-16 ">
                  {t("label:howMuchItCost")}  ?
                </div>
                <Typography className="px-32 py-10 body2">
                  {t("label:howMuchItCostMessage")}
                  {/*Arcu ultrices vel ullamcorper ipsum vitae in in massa.*/}
                  {/*Habitasse quisque amet, metus, donec risus, molestie ipsum,*/}
                  {/*sed tristique. Egestas vitae dignissim lectus mauris.*/}
                  {/*Facilisis non ante id nisl amet, nunc. Quis felis nisi,*/}
                  {/*dignissim lacus, consectetur egestas id lectus nunc. Malesuada*/}
                  {/*elementum maecenas scelerisque porttitor purus diam*/}
                  {/*condimentum pretium neque. Consequat nunc pulvinar neque,*/}
                  {/*velit facilisis quam mi vel.*/}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default ClassicSignUpPage;
