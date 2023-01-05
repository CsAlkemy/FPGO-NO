import { yupResolver } from '@hookform/resolvers/yup';
import {
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
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { useSnackbar } from 'notistack';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BsFillCheckCircleFill, BsQuestionCircle } from 'react-icons/bs';
import { FiMinus } from 'react-icons/fi';
import { IoMdAdd } from 'react-icons/io';
import { MdOutlineAdd, MdRemoveCircle } from 'react-icons/md';
import PhoneInput from 'react-phone-input-2';
import { useNavigate } from 'react-router-dom';
import CustomersService from '../../../data-access/services/customersService/CustomersService';
import DiscardConfirmModal from '../../common/confirmDiscard';
import FAQs from '../../common/faqs';
import { CreateCorporateDefaultValue, validateSchema } from '../utils/helper';
import { useTranslation } from 'react-i18next';
import { LoadingButton } from '@mui/lab';
import { useCreateCorporateCustomerMutation } from 'app/store/api/apiSlice';

const createCorporateCustomer = () => {
  const { t } = useTranslation()
  const [sameAddress, setSameAddress] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [expandedPanel2, setExpandedPanel2] = React.useState(false);
  const [findOrg, setFindOrg] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingfind, setLoadingfind] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [createCorporateCustomer] = useCreateCorporateCustomerMutation();
  const [countries, setCountries] = React.useState([
    {
      title: "Norway",
      name: "norway",
    },
    {
      title: "Sweden",
      name: "sweden",
    },
  ]);
  const [addContactIndex, setAddContactIndex] = React.useState(
    Object.keys(CreateCorporateDefaultValue.contact)
  );
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // form
  const { control, formState, handleSubmit, reset, getValues, watch, setValue } =
    useForm({
      mode: "onChange",
      CreateCorporateDefaultValue,
      resolver: yupResolver(validateSchema),
    });

  const { isValid, dirtyFields, touchedFields, errors } = formState;

  const watchStreet = watch("billingAddress");
  const watchCity = watch("billingCity");
  const watchZip = watch("billingZip");
  const watchCountry = watch("billingCountry");

  const onSubmit = (values) => {
    setLoading(true)
    const preparedPayload =
      CustomersService.prepareCreateCorporateCustomerPayload(values, sameAddress);
    createCorporateCustomer(preparedPayload).then((response) => {
      if (response?.data?.status_code === 201) {
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        navigate("/customers/customers-list");
        setLoading(false);
      } else if (response?.error?.data?.status_code === 417) {
        enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
        setLoading(false);
      }
    });
    // CustomersService.createCorporateCustomer(values, sameAddress)
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
  // form end

  const getOrganizationDetailsHanddler = (id) => {
    if (id.length > 0) {
      setLoadingfind(true)
      CustomersService.getOrganizationDetailsByUUID(id)
        .then((response) => {
          if (response?.status_code === 200) {
            CreateCorporateDefaultValue.organizationID = id;
            CreateCorporateDefaultValue.OrganizationName = response.data?.name;
            CreateCorporateDefaultValue.billingAddress =
              response.data?.billingAddress.streetAddress;
            CreateCorporateDefaultValue.billingCity =
              response.data.billingAddress.city;
            CreateCorporateDefaultValue.billingCountry =
              response.data.billingAddress.country === "Norge"
                ? "norway"
                : response.data.billingAddress.country;
            CreateCorporateDefaultValue.billingZip =
              response.data.billingAddress.zip;
            reset({ ...CreateCorporateDefaultValue })
            enqueueSnackbar(response.message, { variant: "success" });
            setLoadingfind(false)
          }
        })
        .catch((error) => {
          enqueueSnackbar("Data Retrieve Failed", { variant: "error" });
          reset();
          setLoadingfind(false)
        });
    }
  };

  // dynamic input form
  const addNewContact = () => {
    setAddContactIndex([...addContactIndex, addContactIndex.length]);
  };
  const onDelete = (index) => {
    setAddContactIndex(addContactIndex.filter((i) => i !== index));
  };

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white p-0 md:px-20">
          <form name="loginForm" noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className=" header-click-to-action">
              <div className="header-text header6">{t("label:newCorporateCustomer")}</div>
              <div className="button-container-product">
                <Button
                  color="secondary"
                  variant="outlined"
                  className="button-outline-product"
                  type="reset"
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
                >
                  {t("label:createCustomer")}
                </LoadingButton>
             
              </div>
            </div>
            <div className="main-layout-product">
              <div className="col-span-1 md:col-span-4 bg-white">
                <div className=" subtitle3  header-bg-900-product flex flex-row items-center gap-10">
                  {t("label:primaryInformation")}
                  {dirtyFields.organizationID &&
                    dirtyFields.OrganizationName &&
                    dirtyFields.orgEmail &&
                    dirtyFields.primaryPhoneNumber &&
                    dirtyFields.billingAddress &&
                    dirtyFields.billingZip &&
                    dirtyFields.billingCity &&
                    dirtyFields.billingCountry ? (
                    <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                  ) : (
                    <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                  )}
                </div>
                <div className="my-32 px-10 md:px-16">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-10 w-full md:w-3/4">
                    <Controller
                      name="organizationID"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:organizationId")}
                          className="col-span-1 md:col-span-2"
                          type="number"
                          autoComplete="off"
                          error={!!errors.organizationID}
                          helperText={errors?.organizationID?.message}
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                    <LoadingButton
                      variant="contained"
                      color="secondary"
                      className="col-span-1 w-full button2 rounded-4 h-fit mt-7"
                      aria-label="Confirm"
                      size="large"
                      type="button"
                      loading={loadingfind}
                      loadingPosition="center"
                      onClick={() => {
                        setFindOrg(true);
                        getOrganizationDetailsHanddler(
                          getValues("organizationID")
                        );
                      }}
                    >
                      {t("label:findOrganization")}
                    </LoadingButton>
                    
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 px-10 sm:px-16 mt-32 gap-20">
                  <Controller
                    name="OrganizationName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:organizationName")}
                        className='bg-white'
                        type='text'
                        autoComplete='off'
                        error={!!errors.OrganizationName}
                        helperText={errors?.OrganizationName?.message}
                        variant='outlined'
                        fullWidth
                        required
                        value={field.value || ''}
                      // inputlabelprops={{
                      //   shrink:
                      //     !!field.value || touchedFields.OrganizationName,
                      // }}
                      />
                    )}
                  />
                  <Controller
                    name="orgEmail"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:emailId")}
                        className="bg-white"
                        type={t("label:email")}
                        autoComplete="off"
                        error={!!errors.orgEmail}
                        helperText={errors?.orgEmail?.message}
                        variant="outlined"
                        required
                        value={field.value || ''}
                        fullWidth

                      />
                    )}
                  />
                  <div className="mt-10">
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
                            value={field.value || ''}
                            countryCodeEditable={false}
                            specialLabel={`${t("label:phone")}*`}
                          // onBlur={handleOnBlurGetDialCode}

                          />
                          <FormHelperText>
                            {errors?.primaryPhoneNumber?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                  </div>
                </div>
                <div className="form-pair-three-by-one px-10 md:px-16">
                  <div className="col-span-3">
                    <Controller
                      name="billingAddress"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:streetAddress")}
                          type='text'
                          autoComplete='off'
                          error={!!errors.billingAddress}
                          helperText={errors?.billingAddress?.message}
                          variant='outlined'
                          fullWidth
                          required
                          value={field.value || ''}

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
                          helperText={errors?.billingZip?.message}
                          variant="outlined"
                          fullWidth
                          required
                          value={field.value || ''}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="form-pair-input gap-x-20 px-10 md:px-16">
                  <Controller
                    name="billingCity"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:city")}
                        type='text'
                        autoComplete='off'
                        error={!!errors.billingCity}
                        helperText={errors?.billingCity?.message}
                        variant='outlined'
                        fullWidth
                        required
                        value={field.value || ''}

                      />
                    )}
                  />
                  <Controller
                    name="billingCountry"
                    control={control}
                    render={({ field }) => (
                      <FormControl
                        error={!!errors.billingCountry}
                        fullWidth
                      >
                        <InputLabel id='billingCountry'>
                          {t("label:country")}*
                        </InputLabel>
                        <Select
                          {...field}
                          labelId='billingCountry'
                          id='select'
                          label={t("label:country")}
                          required
                          value={field.value || ''}

                        >
                          {countries.length ? (
                            countries.map((country, index) => {
                              return (
                                <MenuItem
                                  key={index}
                                  value={country.name}
                                >
                                  {country.title}
                                </MenuItem>
                              );
                            })
                          ) : (
                            <MenuItem key={1} value={"norway"}>
                              Norway
                            </MenuItem>
                          )}
                        </Select>
                        <FormHelperText>
                          {errors?.billingCountry?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                </div>
                <div className="my-20">
                  <Accordion className={`bg-primary-25 shadow-0 border-0 ${!expanded ? "bg-primary-25" : "bg-primary-700"}`}>
                    <AccordionSummary
                      expandIcon={
                        !expanded ? (
                          <IoMdAdd className="icon-size-20" />
                        ) : (
                          <FiMinus className={`icon-size-20 ${!expanded ? "" : "text-white"}`} />
                        )
                      }
                      onClick={() => setExpanded(!expanded)}
                      id="panel1a-header"
                    >
                      <div className={`subtitle3 flex flex-row items-center gap-10 ${!expanded ? 'text-MonochromeGray-700' : 'text-white'}`}>
                        {t("label:shippingInformation")}
                        {sameAddress === true || dirtyFields.shippingAddress &&
                          dirtyFields.shippingZip &&
                          dirtyFields.shippingCity &&
                          dirtyFields.shippingCountry ? (
                          <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                        ) : (
                          <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
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
                                    name="jason"
                                    color="secondary"
                                  />
                                }
                                label={t("label:sameAsBillingAddress")}
                                labelPlacement="start"
                                disabled={
                                  // findOrg
                                  //   ? getValues("primaryPhoneNumber") === "" ||
                                  //   getValues("orgEmail") === "" ||
                                  //   getValues("billingAddress") === "" ||
                                  //   getValues("billingZip") === "" ||
                                  //   getValues("billingCity") === ""
                                  !(
                                    watchStreet &&
                                    watchCity &&
                                    watchZip &&
                                    watchCountry
                                    // dirtyFields.billingAddress &&
                                    // dirtyFields.billingZip &&
                                    // dirtyFields.billingCity &&
                                    // dirtyFields.billingCountry
                                  )

                                }
                              />
                            </div>
                          </div>
                          {!sameAddress &&

                            (findOrg
                              ? !(
                                getValues("primaryPhoneNumber") === "" ||
                                getValues("orgEmail") === "" ||
                                getValues("billingAddress") === "" ||
                                getValues("billingZip") === "" ||
                                getValues("billingCity") === ""
                              )
                              : watchStreet &&
                              watchCity &&
                              watchZip &&
                              watchCountry) && (
                              <div className="">
                                <div className="form-pair-three-by-one mt-0-i">
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
                                            errors?.shippingAddress?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.shippingAddress,
                                          }}
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
                                          autoComplete="off"
                                          disabled={sameAddress}
                                          error={!!errors.shippingZip}
                                          helperText={
                                            errors?.shippingZip?.message
                                          }
                                          variant="outlined"
                                          fullWidth
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.shippingZip,
                                          }}
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
                                          errors?.shippingCity?.message
                                        }
                                        variant="outlined"
                                        fullWidth
                                        inputlabelprops={{
                                          shrink:
                                            !!field.value ||
                                            touchedFields.shippingCity,
                                        }}
                                      />
                                    )}
                                  />
                                  <Controller
                                    name="shippingCountry"
                                    control={control}
                                    render={({ field }) => (
                                      <FormControl
                                        error={!!errors.shippingCountry}
                                        fullWidth
                                      >
                                        <InputLabel id="demo-simple-select-label">
                                          {t("label:country")}
                                        </InputLabel>
                                        <Select
                                          {...field}
                                          labelId="demo-simple-select-label"
                                          id="demo-simple-select"
                                          label={t("label:country")}
                                          disabled={sameAddress}
                                          inputlabelprops={{
                                            shrink:
                                              !!field.value ||
                                              touchedFields.shippingCountry,
                                          }}
                                        >
                                          {countries.map((country, index) => (
                                            <MenuItem
                                              key={index}
                                              value={country.name}
                                            >
                                              {country.title}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                        <FormHelperText>
                                          {errors?.shippingCountry?.message}
                                        </FormHelperText>
                                      </FormControl>
                                    )}
                                  />
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion className={`${!expandedPanel2 ? "bg-primary-25" : "bg-primary-700"
                    } mt-20 bg-primary-25 shadow-0 border-0 custom-accordion`}>
                    <AccordionSummary
                      expandIcon={
                        !expandedPanel2 ? (
                          <IoMdAdd className="icon-size-20" />
                        ) : (
                          <FiMinus className={`icon-size-20 ${!expandedPanel2 ? "" : "text-white"}`} />
                        )
                      }
                      onClick={() => setExpandedPanel2(!expandedPanel2)}
                      id="panel2a-header"
                    >
                      <div className={`subtitle3  flex gap-10 my-auto ${!expandedPanel2
                        ? "text-MonochromeGray-700"
                        : "text-white"
                        }`}
                      >{t("label:additionalContacts")}
                        {dirtyFields.fullName &&
                          dirtyFields.designation &&
                          dirtyFields.phone &&
                          dirtyFields.email &&
                          dirtyFields.notes ? (
                          <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                        ) : (
                          <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                        )}
                      </div>
                    </AccordionSummary>
                    <AccordionDetails className="bg-white px-10 md:px-16">
                      <div className="w-full">
                        <div className="billing-address-head no-padding-x my-14">
                          {t("label:primaryContact")}
                          {dirtyFields.fullName &&
                            dirtyFields.designation &&
                            dirtyFields.phone &&
                            dirtyFields.email &&
                            dirtyFields.notes ? (
                            <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                          ) : (
                            <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                          )}
                        </div>
                        <div className="">
                          <div className="form-pair-input gap-x-20">
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
                                  helperText={errors?.fullName?.message}
                                  variant="outlined"
                                  fullWidth
                                // inputlabelprops={{
                                //   shrink:
                                //     !!field.value || touchedFields.fullName,
                                // }}
                                />
                              )}
                            />
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
                                  helperText={errors?.designation?.message}
                                  variant="outlined"
                                  fullWidth
                                // inputlabelprops={{
                                //   shrink:
                                //     !!field.value ||
                                //     touchedFields.designation,
                                // }}
                                />
                              )}
                            />
                          </div>
                          <div className="form-pair-input gap-x-20">
                            <Controller
                              name="phone"
                              control={control}
                              render={({ field }) => (
                                <FormControl error={!!errors.phone} fullWidth>
                                  <PhoneInput
                                    {...field}
                                    className={
                                      errors.phone
                                        ? "input-phone-number-field border-1 rounded-md border-red-300"
                                        : "input-phone-number-field"
                                    }
                                    country="no"
                                    enableSearch
                                    autocompleteSearch
                                    countryCodeEditable={false}
                                    specialLabel={t("label:phone")}
                                  // onBlur={handleOnBlurGetDialCode}
                                  // inputlabelprops={{
                                  //   shrink:
                                  //     !!field.value || touchedFields.phone,
                                  // }}
                                  />
                                  <FormHelperText>
                                    {errors?.billingPhoneNumber?.message}
                                  </FormHelperText>
                                </FormControl>
                              )}
                            />
                            <Controller
                              name="email"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label={t("label:email")}
                                  type="email"
                                  autoComplete="off"
                                  error={!!errors.email}
                                  helperText={errors?.email?.message}
                                  variant="outlined"
                                  fullWidth
                                // inputlabelprops={{
                                //   shrink:
                                //     !!field.value || touchedFields.email,
                                // }}
                                />
                              )}
                            />
                          </div>
                          <div className="w-full sm:w-3/4">
                            <Controller
                              name="notes"
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  multiline
                                  rows={5}
                                  label={t("label:notes")}
                                  type="text"
                                  autoComplete="off"
                                  error={!!errors.notes}
                                  helperText={errors?.notes?.message}
                                  variant="outlined"
                                  fullWidth
                                // inputlabelprops={{
                                //   shrink:
                                //     !!field.value || touchedFields.notes,
                                // }}
                                />
                              )}
                            />
                          </div>
                        </div>
                        {addContactIndex.map((index) => (
                          <div key={`contact:${index}`}>
                            <div className="flex justify-between items-center no-padding-x mt-48 border-b-1 border-MonochromeGray-25">
                              <div className="billing-address-head no-padding-x">
                                {t("label:contact")} {index + 1}
                                {dirtyFields.fullName &&
                                  dirtyFields.designation &&
                                  dirtyFields.phone &&
                                  dirtyFields.email &&
                                  dirtyFields.notes ? (
                                  <BsFillCheckCircleFill className="icon-size-20 text-teal-300" />
                                ) : (
                                  <BsFillCheckCircleFill className="icon-size-20 text-MonochromeGray-50" />
                                )}
                              </div>
                              <button
                                className="flex justify-center items-center gap-10 button2 my-auto"
                                type="button"
                                onClick={() => onDelete(index)}
                              >
                                <MdRemoveCircle className="icon-size-20 text-red-500" />
                                {t("label:removeContact")}
                              </button>
                            </div>
                            <div className="">
                              <div className="form-pair-input gap-x-20">
                                <Controller
                                  name={`contact[${index}].fullName`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:fullName")}
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors?.fullName}
                                      helperText={errors?.fullName}
                                      variant="outlined"
                                      fullWidth
                                    // inputlabelprops={{
                                    //   shrink:
                                    //     !!field.value ||
                                    //     touchedFields.contact[index].fullName,
                                    // }}
                                    />
                                  )}
                                />
                                <Controller
                                  name={`contact[${index}].designation`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:designation")}
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors?.designation}
                                      helperText={errors?.designation?.message}
                                      variant="outlined"
                                      fullWidth
                                    // inputlabelprops={{
                                    //   shrink:
                                    //     !!field.value ||
                                    //     touchedFields.contact[index]
                                    //       .designation,
                                    // }}
                                    />
                                  )}
                                />
                              </div>
                              <div className="form-pair-input gap-x-20">
                                <Controller
                                  name={`contact[${index}].phone`}
                                  control={control}
                                  render={({ field }) => (
                                    <FormControl
                                      error={!!errors?.phone}
                                      fullWidth
                                    >
                                      <PhoneInput
                                        {...field}
                                        className={
                                          errors?.phone
                                            ? "input-phone-number-field border-1 rounded-md border-red-300"
                                            : "input-phone-number-field"
                                        }
                                        country="no"
                                        enableSearch
                                        autocompleteSearch
                                        countryCodeEditable={false}
                                        specialLabel={t("label:phone")}
                                      // onBlur={handleOnBlurGetDialCode}
                                      // inputlabelprops={{
                                      //   shrink:
                                      //     !!field.value ||
                                      //     touchedFields.contact[index].phone,
                                      // }}
                                      />
                                      <FormHelperText>
                                        {errors?.phone?.message}
                                      </FormHelperText>
                                    </FormControl>
                                  )}
                                />
                                <Controller
                                  name={`contact[${index}].email`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      label={t("label:email")}
                                      type="email"
                                      autoComplete="off"
                                      // error={!!errors?.contact[index]?.email}
                                      // helperText={errors?.contact[index]?.email?.message}
                                      variant="outlined"
                                      fullWidth
                                    // inputlabelprops={{
                                    //   shrink:
                                    //     !!field.value ||
                                    //     touchedFields.contact[index].email,
                                    // }}
                                    />
                                  )}
                                />
                              </div>
                              <div className="w-full sm:w-3/4">
                                <Controller
                                  name={`contact[${index}].notes`}
                                  control={control}
                                  render={({ field }) => (
                                    <TextField
                                      {...field}
                                      multiline
                                      rows={5}
                                      label={t("label:notes")}
                                      type="text"
                                      autoComplete="off"
                                      error={!!errors?.notes}
                                      helperText={errors?.message}
                                      variant="outlined"
                                      fullWidth
                                    // inputlabelprops={{
                                    //   shrink:
                                    //     !!field.value ||
                                    //     touchedFields.contact[index].notes,
                                    // }}
                                    />
                                  )}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="text"
                          className="flex justify-center items-center gap-10 mt-48 button2"
                          onClick={() => addNewContact()}
                          disabled={addContactIndex.length >= 3}
                        >
                          <MdOutlineAdd className="icon-size-24 text-teal-300" />
                          {t("label:addAnotherContact")}
                        </Button>
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
        defaultValue={CreateCorporateDefaultValue}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};

export default createCorporateCustomer;
