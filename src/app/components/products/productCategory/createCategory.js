import { yupResolver } from "@hookform/resolvers/yup";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Button,
  Checkbox, Drawer, TextField
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { BsQuestionCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../../data-access/services/categoryService/CategoryService";
import ProductService from "../../../data-access/services/productsService/ProductService";
import DiscardConfirmModal from "../../common/confirmDiscard";
import FAQs from "../../common/faqs";
import { defaultValue, validateSchema } from "../utils/helper";
import { useCreateCategoryMutation } from 'app/store/api/apiSlice';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const createCategory = () => {
  const { t } = useTranslation()
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [productsList, setProductsList] = useState([]);
  const [createCategory] = useCreateCategoryMutation();
  // form
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValue,
    resolver: yupResolver(validateSchema),
  });
  const { isValid, dirtyFields, errors } = formState;

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
      })
      .catch((e) => {
      });
  }, []);

  const onRawSubmit = (values) => {
    setLoading(true)
    const preparedPayload = CategoryService.prepareCreateCategoryPayload(values)
    createCategory(preparedPayload)
      .then((response)=> {
        if (response?.data?.status_code === 201) {
          enqueueSnackbar(response?.data?.message, { variant: "success" });
          navigate("/categories/categories-list");
          setLoading(false)
        } else {
          enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
        }
      })
    // CategoryService.createCategory(values)
    //   .then((res) => {
    //     if (res?.status_code === 201) {
    //       enqueueSnackbar(res.message, { variant: "success" });
    //       navigate("/categories/categories-list");
    //       setLoading(false)
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //     setLoading(false)
    //   });
  };
  // form end

  return (
    <div className="create-product-container">
      <div className="inside-div-product">
        <div className="rounded-sm bg-white p-0 md:px-20">
          <form
            name="createCategoryForm"
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
                >
                  {t("label:discard")}
                </Button>
                <LoadingButton
                  variant="contained"
                  color="secondary"
                  className=" w-full rounded-4 button2"
                  aria-label="Confirm"
                  size="large"
                  type="submit"
                  loading={loading}
                  loadingPosition="center"
                >
                  {t("label:create")}
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
                        helperText={errors?.name?.message ? t(`helperText:${errors?.name?.message}`) : ""}
                        variant="outlined"
                        fullWidth
                        required
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
                        helperText={errors?.description?.message ? t(`helperText:${errors?.description?.message}`) : ""}
                        variant="outlined"
                        fullWidth
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
                      {/*<Autocomplete*/}
                      {/*  multiple*/}
                      {/*  id="checkboxes-tags-demo"*/}
                      {/*  options={top100Films}*/}
                      {/*  disableCloseOnSelect*/}
                      {/*  getOptionLabel={(option) => option.title}*/}
                      {/*  fullWidth*/}
                      {/*  renderOption={(props, option, { selected }) => (*/}
                      {/*    <li {...props}>*/}
                      {/*      <Checkbox*/}
                      {/*        icon={icon}*/}
                      {/*        checkedIcon={checkedIcon}*/}
                      {/*        style={{ marginRight: 8 }}*/}
                      {/*        checked={selected}*/}
                      {/*      />*/}
                      {/*      {option.title}*/}
                      {/*    </li>*/}
                      {/*  )}*/}
                      {/*  renderInput={(params) => (*/}
                      {/*    <TextField*/}
                      {/*      {...params}*/}
                      {/*      placeholder="Search product to assign this category"*/}
                      {/*    />*/}
                      {/*  )}*/}
                      {/*/>*/}

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
                            onChange={(_, data) => onChange(data)}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox
                                  icon={icon}
                                  checkedIcon={checkedIcon}
                                  style={{ marginRight: 8 }}
                                  checked={selected}
                                />
                                {`${option.name} ( ${option.id} )`}
                              </li>
                            )}
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
        defaultValue={defaultValue}
        setOpen={setOpen}
        reset={reset}
        title={t("label:areYouSureThatYouWouldLikeToDiscardTheProcess")}
        subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
        route={-1}
      />
    </div>
  );
};
export default createCategory;
