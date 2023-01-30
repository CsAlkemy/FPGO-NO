import { yupResolver } from "@hookform/resolvers/yup";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { selectUser } from "app/store/userSlice";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../../data-access/services/categoryService/CategoryService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import {
  defaultValueCreateProduct,
  validateSchemaProductCreate,
} from "../utils/helper";
import { useTranslation } from "react-i18next";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import {
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
} from "app/store/api/apiSlice";
import UtilsServices from "../../../data-access/utils/UtilsServices";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const createProducts = () => {
  const { t } = useTranslation();
  const [productType, setProductType] = React.useState(1);
  const [categoriesList, setCategoriesList] = useState([]);
  const [taxes, setTaxes] = React.useState([]);
  const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const userInfo = UtilsServices.getFPUserData();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const user = useSelector(selectUser);
  const [updateProduct] = useUpdateProductMutation();
  const [updateProductStatus] = useUpdateProductStatusMutation();
  // form
  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    defaultValueCreateProduct,
    resolver: yupResolver(validateSchemaProductCreate),
  });
  const { isValid, dirtyFields, errors } = formState;
  const onRawSubmit = (values) => {
    if (
      localStorage.getItem("defaultCategories") &&
      JSON.parse(localStorage.getItem("defaultCategories")).length
    ) {
      let updatedAssignToCategories = [];
      updatedAssignToCategories = values.assignedCategories.concat(
        JSON.parse(localStorage.getItem("defaultCategories"))
      );
      values.assignedCategories = updatedAssignToCategories;
    }
    const preparedPayload = ProductService.prepareUpdateProductPayload(
      info.uuid,
      productType,
      values
    );
    updateProduct(preparedPayload).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        navigate("/products/products-list");
      } else {
        enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
      }
    });
    // ProductService.updateProductByUUID(info.uuid, productType, values)
    //   .then((response) => {
    //     if (response?.status_code === 202){
    //       enqueueSnackbar(`Updated Successfully`, {
    //         variant: "success",
    //         autoHideDuration: 3000,
    //       });
    //       navigate("/products/products-list");
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("E : ", e);
    //   });
  };
  // form end

  useEffect(() => {
    CategoryService.categoryList()
      .then((res) => {
        let data = [];
        if (res?.status_code === 200) {
          res.map((row) => {
            return data.push({ uuid: row.uuid, name: row.name });
          });
        }
        setCategoriesList(data);
      })
      .catch((e) => {
        console.log("E : ", e);
      });

    // setProductType(info?.type === "Service" ? 2 : 1);
    defaultValueCreateProduct.productID = info?.productId
      ? info?.productId
      : "";
    defaultValueCreateProduct.productName = info?.name ? info?.name : "";
    defaultValueCreateProduct.price = info?.price ? info?.price : "";
    defaultValueCreateProduct.unit = info?.unit ? info?.unit : "";
    defaultValueCreateProduct.manufacturer = info?.manufacturerId
      ? info?.manufacturerId
      : "";
    defaultValueCreateProduct.assignedCategories = info?.categories
      ? info?.categories
      : "";
    defaultValueCreateProduct.description = info?.description
      ? info?.description
      : "";
    defaultValueCreateProduct.tax = info?.taxRate ? info?.taxRate : "";
    defaultValueCreateProduct.cost = info?.cost ? info?.cost : "";
    reset({ ...defaultValueCreateProduct });

    return () => {
      localStorage.removeItem("tableRowDetails");
      localStorage.removeItem("defaultCategories");
    };
  }, []);

  useEffect(() => {
    if (userInfo?.user_data?.organization?.uuid) {
      ClientService.vateRatesList(userInfo?.user_data?.organization?.uuid)
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
  }, []);

  // inactiveProductByUUID
  const changeProductStatus = async () => {
    updateProductStatus(info.uuid).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        navigate("/products/products-list");
      } else {
        enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
      }
    });
    // ProductService.inactiveProductByUUID(info.uuid)
    //   .then((response) => {
    //     if (response?.status_code === 202){
    //       enqueueSnackbar(response.message, {
    //         variant: "success",
    //         autoHideDuration: 3000,
    //       });
    //       navigate("/products/products-list");
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("E : ", e);
    //   });
  };

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white p-0 md:px-20">
          <form
            name="loginForm"
            noValidate
            onSubmit={handleSubmit(onRawSubmit)}
          >
            <div className=" header-click-to-action">
              <div className="flex justify-center items-center gap-10">
                <div className="header-text header6">
                  {t("label:productDetails")}
                </div>
                {info.status === "Active" ? (
                  <div className="bg-confirmed rounded-4 px-16 py-4 body3">
                    {info.status}
                  </div>
                ) : (
                  <div className="bg-rejected rounded-4 px-16 py-4 body3">
                    {info.status}
                  </div>
                )}
              </div>
              <div className="button-container-product">
                <Button
                  color="secondary"
                  type="button"
                  variant="outlined"
                  className="button-outline-product"
                  onClick={() => changeProductStatus()}
                  disabled={user.role[0] === FP_ADMIN}
                >
                  {t("label:make")}{" "}
                  {info.status === t("label:active")
                    ? t("label:inactive")
                    : t("label:active")}
                </Button>
                <Button
                  color="secondary"
                  variant="contained"
                  type="submit"
                  className="font-semibold rounded-4 w-full sm:w-auto"
                  disabled={user.role[0] === FP_ADMIN}
                >
                  {t("label:updateProduct")}
                </Button>
              </div>
            </div>
            <div className="main-layout-product">
              <div className="col-span-1 md:col-span-4 bg-white">
                {/*<div>*/}
                <div className="create-user-form-header subtitle3 bg-m-grey-25">
                  {t("label:productDetails")}
                </div>
                {/*  <div className="p-10">*/}
                {/*    <div className="create-user-roles caption2 mb-0-i">*/}
                {/*      {t("label:productType")}**/}
                {/*    </div>*/}
                {/*  </div>*/}
                {/*  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-10 gap-y-7 mt-10 p-10">*/}
                {/*    <button*/}
                {/*      className={*/}
                {/*        productType === 1*/}
                {/*          ? "create-user-role-button-active"*/}
                {/*          : "create-user-role-button"*/}
                {/*      }*/}
                {/*      onClick={() => {*/}
                {/*        setProductType(1);*/}
                {/*      }}*/}
                {/*      type="button"*/}
                {/*    >*/}
                {/*      {t("label:goods")}*/}
                {/*    </button>*/}
                {/*    <button*/}
                {/*      className={*/}
                {/*        productType === 2*/}
                {/*          ? "create-user-role-button-active"*/}
                {/*          : "create-user-role-button"*/}
                {/*      }*/}
                {/*      onClick={() => {*/}
                {/*        setProductType(2);*/}
                {/*      }}*/}
                {/*      type="button"*/}
                {/*    >*/}
                {/*      {t("label:services")}*/}
                {/*    </button>*/}
                {/*  </div>*/}
                {/*</div>*/}

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
                          helperText={errors?.productID?.message}
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
                          helperText={errors?.productName?.message}
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
                        type="number"
                        autoComplete="off"
                        error={!!errors.price}
                        helperText={errors?.price?.message}
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
                        helperText={errors?.unit?.message}
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
                        helperText={errors?.manufacturer?.message}
                        variant="outlined"
                        fullWidth
                        disabled={productType === 2 ? true : false}
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
                          onChange={(_, data) => {
                            if (localStorage.getItem("defaultCategories")) {
                              let newLDP = [];
                              for (let i = 0; i < data.length; i++) {
                                if (
                                  JSON.parse(
                                    localStorage.getItem("defaultCategories")
                                  ).filter((d) => d.uuid === data[i].uuid)
                                    .length
                                ) {
                                  newLDP.push(data[i]);
                                }
                              }
                              localStorage.setItem(
                                "defaultCategories",
                                JSON.stringify(newLDP)
                              );
                            }
                            return onChange(data);
                          }}
                          defaultValue={
                            localStorage.getItem("defaultCategories")
                              ? JSON.parse(
                                  localStorage.getItem("defaultCategories")
                                )
                              : []
                          }
                          renderOption={(props, option, { selected }) =>
                            localStorage.getItem("defaultCategories") &&
                            JSON.parse(
                              localStorage.getItem("defaultCategories")
                            ).filter((d) => d.uuid === option.uuid).length ? (
                              <MenuItem {...props} disabled={true}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={
                                    JSON.parse(
                                      localStorage.getItem("defaultCategories")
                                    ).filter((d) => d.uuid === option.uuid)
                                      .length
                                  }
                                />
                                {`${option.name}`}
                              </MenuItem>
                            ) : (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {`${option.name}`}
                              </li>
                            )
                          }
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
                          helperText={errors?.description?.message}
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 px-10 my-32 gap-20">
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
                            defaultValue={
                              info?.taxRate === 0
                                ? 0
                                : info?.taxRate
                                ? info?.taxRate
                                : ""
                            }
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
                            {errors?.tax?.message}
                          </FormHelperText>
                        </FormControl>
                      )}
                    />
                    <Controller
                      name="cost"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("label:costPerUnit")}
                          className="bg-white"
                          type="number"
                          autoComplete="off"
                          error={!!errors.cost}
                          helperText={errors?.cost?.message}
                          variant="outlined"
                          fullWidth
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
                  </div>
                </div>
              </div>
              <div className="col-span-2 hidden md:block border-1 border-MonochromeGray-25">
                {/* <FAQs /> */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default createProducts;
