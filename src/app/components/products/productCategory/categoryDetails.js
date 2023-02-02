import { yupResolver } from "@hookform/resolvers/yup";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete, Backdrop,
  Button,
  Checkbox, CircularProgress, MenuItem,
  TextField,
} from '@mui/material';
import { selectUser } from 'app/store/userSlice';
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import CategoryService from "../../../data-access/services/categoryService/CategoryService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import { FP_ADMIN } from '../../../utils/user-roles/UserRoles';
import ConfirmModal from "../../common/confirmmationDialog";
import { defaultValue, validateSchema } from "../utils/helper";
import { useUpdateCategoryMutation } from 'app/store/api/apiSlice';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const createCategory = (onSubmit = () => { }) => {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false);
  const [productsList, setProductsList] = useState([]);
  const [defaultProductList, setDefaultProductList] = useState([]);
  // const info = JSON.parse(localStorage.getItem("tableRowDetails"));
  const [info, setInfo] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const user = useSelector(selectUser);
  const [updateCategory] = useUpdateCategoryMutation()
  // form
  const { control, formState, handleSubmit, reset, setValue } = useForm({
    mode: "onChange",
    defaultValue,
    resolver: yupResolver(validateSchema),
  });
  const { isValid, dirtyFields, errors } = formState;
  const onRawSubmit = (values) => {
    if (
      localStorage.getItem("defaultPdList") &&
      JSON.parse(localStorage.getItem("defaultPdList")).length
    ) {
      let updatedAssignToProducts = [];
      updatedAssignToProducts = values.assignToProducts.concat(
        JSON.parse(localStorage.getItem("defaultPdList"))
      );
      values.assignToProducts = updatedAssignToProducts;
    }
    setLoading(true)
    const preparedPayload = CategoryService.prepareUpdateCategoryPayload(params.id, values);
    updateCategory(preparedPayload)
      .then((response)=> {
        if (response?.data?.status_code === 202) {
          enqueueSnackbar(`Updated Successfully`, {
            variant: "success",
            autoHideDuration: 3000,
          });
          navigate("/categories/categories-list");
          setLoading(false)
        } else {
          enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
        }
      })
    // CategoryService.updateCategoryByUUID(info.uuid, values)
    //   .then((response) => {
    //     if (response?.status_code === 202) {
    //       enqueueSnackbar(`Updated Successfully`, {
    //         variant: "success",
    //         autoHideDuration: 3000,
    //       });
    //       navigate("/categories/categories-list");
    //       setLoading(false)
    //     }
    //   })
    //   .catch((e) => {
    //     console.log("E : ", e);
    //     setLoading(false)
    //   });
  };

  useEffect(() => {
    ProductService.productsList()
      .then((res) => {
        let data = [];
        if (res?.status_code === 200) {
          res.filter((r) => r.status === "Active")
            .map((row) => {
              return data.push({ uuid: row.uuid, name: row.name, id: row.id });
            });
        }
        setProductsList(data);
        // setIsLoading(false);
      })
      .catch((e) => {
        console.log("E : ", e);
      });

    CategoryService.categoryDetailsByUUID(params.id)
      .then((response) => {
        if (response.data.productList) {
          let pL = [];
          response.data.productList.map((row) => {
            return pL.push({
              uuid: row.uuid,
              name: row.name,
              id: row.productId,
            });
          });
          localStorage.setItem("defaultPdList", JSON.stringify(pL));
        } else localStorage.setItem("defaultPdList", "");
        // localStorage.setItem(
        //   "tableRowDetails",
        //   JSON.stringify(response.data)
        // );
        setInfo(response?.data)

        defaultValue.name = info?.name ? info?.name : "";
        defaultValue.description = info?.description ? info?.description : "";
        defaultValue.assignToProducts = info?.productList ? info?.productList : "";
        reset({ ...defaultValue });
        setIsLoading(false)
      })
      .catch((error) => {
        console.log("E : ", error);
        setIsLoading(false)
      });

    return () => {
      localStorage.removeItem("tableRowDetails");
      localStorage.removeItem("defaultPdList");
    };
  }, [isLoading]);

  return (
    <div>
      <Backdrop
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 2,
          color: '#0088AE',
          background: 'white',
        }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {
        !isLoading && (
          <div className="create-product-container">
            <div className="inside-div-product">
              <div className="rounded-sm bg-white p-0 md:px-20">
                <form
                  name="loginForm"
                  noValidate
                  onSubmit={handleSubmit(onRawSubmit)}
                >
                  <div className=" header-click-to-action">
                    <div className="header-text header6">{t("label:createCategory")}</div>
                    <div className="button-container-product">
                      <Button
                        color="secondary"
                        type="reset"
                        variant="outlined"
                        className="button-outline-product"
                        onClick={() => setOpen(true)}
                        startIcon={<DeleteOutlineIcon className="icon-size-20" />}
                        disabled={user.role[0] === FP_ADMIN}
                      >
                        {t("label:delete")}
                      </Button>
                      <LoadingButton
                        variant="contained"
                        color="secondary"
                        className=" w-full rounded-4 button2"
                        aria-label="Confirm"
                        size="large"
                        type="submit"
                        loading={loading}
                        disabled={user.role[0] === FP_ADMIN}
                        loadingPosition="center"
                      >
                        {t("label:updateCategory")}
                      </LoadingButton>

                    </div>
                  </div>
                  <div className="main-layout-product">
                    <div className="col-span-1 md:col-span-4 bg-white">
                      <div className="create-user-form-header subtitle3 bg-m-grey-25">
                        {t("label:categoryDetails")}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-40 px-10 my-32">
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t("label:name")}
                              className="bg-white col-span-2"
                              type="text"
                              autoComplete="off"
                              error={!!errors.name}
                              helperText={errors?.name?.message}
                              variant="outlined"
                              fullWidth
                              required
                              value={field.value || ''}
                            />
                          )}
                        />
                        <Controller
                          name="description"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              multiline
                              className="col-span-2"
                              rows={5}
                              label={t("label:description")}
                              type="text"
                              autoComplete="off"
                              error={!!errors.description}
                              helperText={errors?.description?.message}
                              variant="outlined"
                              fullWidth
                              value={field.value || ''}
                            />
                          )}
                        />
                      </div>

                      <div>
                        <div className="create-user-form-header subtitle3 bg-m-grey-25">
                          {t("label:assignToProducts")}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 px-10 my-32 gap-20">
                          <div className="col-span-1 sm:col-span-2">
                            <Controller
                              control={control}
                              name="assignToProducts"
                              render={({ field: { ref, onChange, ...field } }) => (
                                <Autocomplete
                                  multiple
                                  options={productsList}
                                  disableCloseOnSelect
                                  getOptionLabel={(option) =>
                                    `${option.name} ( ${option.id} )`
                                  }
                                  onChange={(_, data) => {
                                    if (localStorage.getItem("defaultPdList")) {
                                      let newLDP = [];
                                      for (let i = 0; i < data.length; i++) {
                                        if (
                                          JSON.parse(
                                            localStorage.getItem("defaultPdList")
                                          ).filter((d) => d.uuid === data[i].uuid)
                                            .length
                                        ) {
                                          newLDP.push(data[i]);
                                        }
                                      }
                                      localStorage.setItem(
                                        "defaultPdList",
                                        JSON.stringify(newLDP)
                                      );
                                    }
                                    return onChange(data);
                                  }}
                                  defaultValue={
                                    localStorage.getItem("defaultPdList")
                                      ? JSON.parse(
                                        localStorage.getItem("defaultPdList")
                                      )
                                      : []
                                  }
                                  renderOption={(props, option, { selected }) =>
                                    localStorage.getItem("defaultPdList") &&
                                    JSON.parse(
                                      localStorage.getItem("defaultPdList")
                                    ).filter((d) => d.uuid === option.uuid && d.status === "Active").length ? (
                                      <MenuItem {...props} disabled={true}>
                                        <Checkbox
                                          icon={icon}
                                          checkedIcon={checkedIcon}
                                          style={{ marginRight: 8 }}
                                          checked={
                                            JSON.parse(
                                              localStorage.getItem("defaultPdList")
                                            ).filter((d) => d.uuid === option.uuid)
                                              .length
                                          }
                                        />
                                        {`${option.name} ( ${option.id} )`}
                                      </MenuItem>
                                    ) : (
                                      <li {...props}>
                                        <Checkbox
                                          icon={icon}
                                          checkedIcon={checkedIcon}
                                          style={{ marginRight: 8 }}
                                          checked={selected}
                                        />
                                        {`${option.name} ( ${option.id} )`}
                                      </li>
                                    )
                                  }
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      {...field}
                                      inputRef={ref}
                                      placeholder={t("label:searchProductToAssignThisCategory")}
                                    />
                                  )}
                                />
                              )}
                            />
                          </div>
                        </div>
                        {/* <div className='px-10'>
                    <div className="create-user-roles caption2">
                      Added Products
                    </div>
                    <div className='flex gap-10'>
                      <Chip
                        label="Playstation 4 Limited Edition (with games)"
                        //onClick={handleClick}
                        onDelete={()=>  console.log('delete')}
                        className='bg-primary-50'
                      />
                      <Chip
                        label="Item 2"
                        //onClick={handleClick}
                        onDelete={()=>  console.log('delete')}
                        className='bg-primary-50'
                      />
                      <Chip
                        label="Random item 100"
                        //onClick={handleClick}
                        onDelete={()=>  console.log('delete')}
                        className='bg-primary-50'
                      />

                    </div>
                  </div> */}
                      </div>
                    </div>
                    <div className="col-span-2 hidden md:block border-1 border-MonochromeGray-25">
                      {/* <FAQs /> */}
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <ConfirmModal
              open={open}
              setOpen={setOpen}
              header={t("label:areYouSureYouWantToDeleteThisCategory")}
              subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
              uuid={params.id}
              refKey="category"
            />
          </div>
        )
      }
    </div>
  );
};
export default createCategory;