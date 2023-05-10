import { yupResolver } from "@hookform/resolvers/yup";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { BsQuestionCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../../data-access/services/categoryService/CategoryService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import DiscardConfirmModal from "../../common/confirmDiscard";
import FAQs from "../../common/faqs";
import {
  defaultValueCreateProduct,
  validateSchemaProductCreate,
} from "../utils/helper";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import { useCreateProductMutation } from "app/store/api/apiSlice";
import UtilsServices from "../../../data-access/utils/UtilsServices";
import AuthService from "../../../data-access/services/authService";
import CustomersService from "../../../data-access/services/customersService/CustomersService";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const createProducts = (onSubmit = () => {}) => {
  const info = UtilsServices.getFPUserData();
  const { t } = useTranslation();
  // const [productType, setProductType] = React.useState(1);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [taxes, setTaxes] = React.useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();

  const [categoriesList, setCategoriesList] = useState([]);
  // form
  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    defaultValueCreateProduct,
    resolver: yupResolver(validateSchemaProductCreate),
  });
  const { isValid, dirtyFields, errors } = formState;
  const onRawSubmit = (values) => {
    setLoading(true);
    const preparedPaload = ProductService.prepareCreateProductPayload(values);
    createProduct(preparedPaload).then((response) => {
      if (response?.data?.status_code === 201) {
        enqueueSnackbar(t(`message:${response?.data?.message}`), {
          variant: "success",
        });
        navigate("/products/products-list");
        setLoading(false);
      } else {
        enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
          variant: "error",
        });
      }
    });
    // ProductService.createProduct(values)
    //   .then((res) => {
    //     if (res?.status_code === 201) {
    //       enqueueSnackbar(res.message, { variant: "success" });
    //       navigate("/products/products-list");
    //       setLoading(false)
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //     setLoading(false)
    //   });
  };
  // form end

  useEffect(() => {
    AuthService.axiosRequestHelper().then((isAuthenticated) => {
      CategoryService.categoryList(true)
        .then((res) => {
          let data = [];
          if (res?.status_code === 200) {
            res.map((row) => {
              return data.push({ uuid: row.uuid, name: row.name });
            });
          }
          setCategoriesList(data);
        })
        .catch((e) => {});
      if (info?.user_data?.organization?.uuid) {
        ClientService.vateRatesList(info?.user_data?.organization?.uuid, true)
          .then((res) => {
            if (res?.status_code === 200) {
              setTaxes(res?.data);
            } else {
              setTaxes([]);
            }
          })
          .catch((e) => {
            setTaxes([]);
          });
      }
    });
  }, []);

  {
    /*useEffect(() => {*/
  }
  //   if (info?.user_data?.organization?.uuid) {
  //     ClientService.vateRatesList(info?.user_data?.organization?.uuid)
  //       .then((res) => {
  {
    /*        if (res?.status_code === 200) {*/
  }
  //           setTaxes(res?.data);
  //         } else {
  //           setTaxes([]);
  //         }
  //       })
  //       .catch((e) => {
  //         setTaxes([]);
  //       });
  //   }
  // }, []);

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white p-0 md:px-20">
          <form
            name="createProductForm"
            noValidate
            onSubmit={handleSubmit(onRawSubmit)}
          >
            <div className=" header-click-to-action">
              <div className="header-text header6">
                {t("label:createProduct")}
              </div>
              <div className="button-container-product">
                <Button
                  color="secondary"
                  variant="outlined"
                  className="button-outline-product"
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
                  disabled={!isValid}
                >
                  {t("label:createProduct")}
                </LoadingButton>
              </div>
            </div>
            <div className="main-layout-product">
              <div className="col-span-1 md:col-span-4 bg-white">
                {/*<div>*/}
                <div className="create-user-form-header subtitle3 bg-m-grey-25">
                  {t("label:productDetails")}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 px-10 py-32 gap-20">
                  <div className="col-span-1 ">
                    <Controller
                      name="productID"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:productId")}
                          className="bg-white"
                          type="text"
                          autoComplete="off"
                          error={!!errors.productID}
                          helperText={
                            errors?.productID?.message
                              ? t(`validation:${errors?.productID?.message}`)
                              : ""
                          }
                          variant="outlined"
                          required
                          fullWidth
                        />
                      )}
                    />
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <Controller
                      name="productName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:productName")}
                          className="bg-white"
                          type="text"
                          autoComplete="off"
                          error={!!errors.productName}
                          helperText={
                            errors?.productName?.message
                              ? t(`validation:${errors?.productName?.message}`)
                              : ""
                          }
                          variant="outlined"
                          fullWidth
                          required
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 px-10 mb-32 gap-20">
                  <Controller
                    name="price"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:pricePerUnit")}
                        className="bg-white"
                        autoComplete="off"
                        error={!!errors.price}
                        type='number'
                        helperText={
                          errors?.price?.message
                            ? t(`validation:${errors?.price?.message}`)
                            : ""
                        }
                        variant="outlined"
                        fullWidth
                        required
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              {t("label:kr")}
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                  <Controller
                    name="unit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:unit")}
                        className="bg-white"
                        type="text"
                        autoComplete="off"
                        error={!!errors.unit}
                        helperText={
                          errors?.unit?.message
                            ? t(`validation:${errors?.unit?.message}`)
                            : ""
                        }
                        variant="outlined"
                        fullWidth
                      />
                    )}
                  />
                  <Controller
                    name="manufacturer"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label={t("label:manufacturedId")}
                        className="bg-white"
                        type="text"
                        autoComplete="off"
                        error={!!errors.manufacturer}
                        helperText={
                          errors?.manufacturer?.message
                            ? t(`validation:${errors?.manufacturer?.message}`)
                            : ""
                        }
                        variant="outlined"
                        fullWidth
                        // disabled={productType === 2 ? true : false}
                      />
                    )}
                  />
                </div>
                <div className="px-10 mt gap-x-20 mb-32">
                  <div className="w-full sm:w-2/3">
                    <Controller
                      control={control}
                      name="assignedCategories"
                      render={({ field: { ref, onChange, ...field } }) => (
                        <Autocomplete
                          multiple
                          options={categoriesList}
                          disableCloseOnSelect
                          getOptionLabel={(option) => option.name}
                          onChange={(_, data) => onChange(data)}
                          renderOption={(props, option, { selected }) => (
                            <li {...props}>
                              <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                              />
                              {`${option.name}`}
                            </li>
                          )}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              {...field}
                              inputRef={ref}
                              placeholder={t(
                                "label:searchCategoryToAssignThisProduct"
                              )}
                            />
                          )}
                        />
                      )}
                    />
                  </div>
                </div>
                <div className="px-10 mt gap-x-20 mb-32">
                  <div className="w-full sm:w-2/3">
                    <Controller
                      name="description"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          rows={5}
                          label={t("label:productDescription")}
                          type="text"
                          autoComplete="off"
                          error={!!errors.description}
                          helperText={
                            errors?.description?.message
                              ? t(`validation:${errors?.description?.message}`)
                              : ""
                          }
                          variant="outlined"
                          fullWidth
                        />
                      )}
                    />
                  </div>
                </div>
                <div>
                  <div className="create-user-form-header subtitle3 bg-m-grey-25">
                    {t("label:salesInformation")}
                  </div>
                  <div className="grid grid-cols-1 w-full sm:w-2/3  px-10 my-32 gap-20">
                    <Controller
                      name="tax"
                      control={control}
                      render={({ field }) => (
                        <FormControl error={!!errors.tax} required fullWidth>
                          <InputLabel id="tax">{t("label:taxRate")}</InputLabel>
                          <Select
                            {...field}
                            labelId="tax"
                            id="tax"
                            label="Tax Rate"
                            //defaultValue={0}
                          >
                            {taxes && taxes.length ? (
                              taxes.map((tax, index) =>
                                tax.status === "Active" ? (
                                  <MenuItem key={index} value={tax.value}>
                                    {tax.value}
                                  </MenuItem>
                                ) : (
                                  <MenuItem
                                    key={index}
                                    value={tax.value}
                                    disabled
                                  >
                                    {tax.value}
                                  </MenuItem>
                                )
                              )
                            ) : (
                              <MenuItem key={0} value={0}>
                                0
                              </MenuItem>
                            )}
                          </Select>
                          <FormHelperText>
                            {errors?.tax?.message
                              ? t(`validation:youMustSelectTax`)
                              : ""}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                    {/*<Controller*/}
                    {/*  name="cost"*/}
                    {/*  control={control}*/}
                    {/*  render={({ field }) => (*/}
                    {/*    <TextField*/}
                    {/*      {...field}*/}
                    {/*      label={t("label:costPerUnit")}*/}
                    {/*      className="bg-white"*/}
                    {/*      type="number"*/}
                    {/*      autoComplete="off"*/}
                    {/*      error={!!errors.cost}*/}
                    {/*      helperText={*/}
                    {/*        errors?.cost?.message*/}
                    {/*          ? t(`validation:${errors?.cost?.message}`)*/}
                    {/*          : ""*/}
                    {/*      }*/}
                    {/*      variant="outlined"*/}
                    {/*      fullWidth*/}
                    {/*      InputProps={{*/}
                    {/*        endAdornment: (*/}
                    {/*          <InputAdornment position="end">*/}
                    {/*            {t("label:kr")}*/}
                    {/*          </InputAdornment>*/}
                    {/*        ),*/}
                    {/*      }}*/}
                    {/*    />*/}
                    {/*  )}*/}
                    {/*/>*/}
                  </div>
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
          type="button"
          className="rounded-full custom-button-shadow bg-primary-50 text-primary-800 button2 hover:bg-primary-25"
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          startIcon={<BsQuestionCircle />}
        >
          {t("label:FAQs")}
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
        defaultValue={defaultValueCreateProduct}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};
export default createProducts;
