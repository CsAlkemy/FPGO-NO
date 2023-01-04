import { yupResolver } from "@hookform/resolvers/yup";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Checkbox,
  Drawer,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputAdornment,
  TextField
} from "@mui/material";
import { setCreditCheckTypeAndId } from "app/store/credit-check/creditCheck";
import { useSnackbar } from "notistack";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { BsQuestionCircle } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import CreditCheckService from "../../../data-access/services/creditCheckService/CreditCheckService";
import FAQs from "../../common/faqs";
import { useTranslation } from 'react-i18next';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  organizationId: yup
    .number()
    .test(
      "len",
      "Must be exactly 9 characters",
      (val) => val.toString().length === 9
    )
    .typeError("Amount must be a number"),
  // trems: yup
  //   .bool()
  //   .required("You need to accept the terms and conditions")
  //   .oneOf([true], "You need to accept the terms and conditions"),
});

export default function CreditCheckCorporateClient() {
  const {t} = useTranslation()
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const creditCheckedId = useSelector(
    (state) => state.creditcheck.creditCheckInfo.id
  );

  const defaultValues = {
    organizationId: "",
  };
  const onSubmit = (data) => {
    setLoading(true)
    CreditCheckService.creditCheckCorporate(data)
      .then((response) => {
        if (response?.status_code === 200) {
          dispatch(
            setCreditCheckTypeAndId({
              type: "corporate",
              id: data.organizationId,
            })
          );
          response?.message ? enqueueSnackbar(response?.message, { variant: "success" }) : "";
          setLoading(false)
          setIsSuccess(true);
        } else {
          enqueueSnackbar(response, { variant: "error" });
          setLoading(false)
        }
      })
      .catch((error) => {
        enqueueSnackbar(error, { variant: "error" });
        setLoading(false)
      });
  };
  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { isValid, dirtyFields, errors } = formState;
  console.log(errors);

  return (
    <>
      <div className="create-product-container relative">
        <div className="inside-div-product">
          <div className="rounded-sm bg-white p-0 md:px-20">
            <form name="loginForm" noValidate onSubmit={handleSubmit(onSubmit)}>
              <div className=" header-click-to-action">
                <div className="header-text header6">
                  {t("label:creditCheckCorporateClient")}
                </div>
                {!isSuccess && (
                  <div className="flex gap-20 w-full md:w-auto">
                    <Link to={"/credit-check/credit-checks-list"}>
                      <Button
                        color="secondary"
                        variant="text"
                        className="button2"
                        type="button"
                      >
                        {t("label:cancel")}
                      </Button>
                    </Link>
                    <LoadingButton
                      type="submit"
                      loading={loading}
                      loadingPosition="center"
                      variant="contained"
                      color="secondary"
                      className="font-semibold rounded-4 w-full sm:w-auto min-w-[140px]"
                    >
                      {t("label:confirm")}
                    </LoadingButton>
                  </div>
                )}
              </div>
              {!isSuccess && (
                <div className="main-layout-product">
                  <div className="col-span-1 md:col-span-4 bg-white">
                    <div className="w-full md:w-3/5 my-20 sm:my-36 px-10 md:px-0">
                      <Controller
                        name="organizationId"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            label={t("label:organizationId")}
                            type="number"
                            error={!!errors.organizationId}
                            helperText={errors?.organizationId?.message}
                            variant="outlined"
                            required
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="start">
                                  <SearchOutlinedIcon edge="end" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-48 mb-16">
                      {/* <Controller
                        name="trems"
                        type="checkbox"
                        control={control}
                        render={({
                          field: { onChange, value, onBlur, ref },
                        }) => (
                          <FormControl error={!!errors.trems} required style={{ display: 'table' }}>
                            <FormControlLabel
                              style={{ display: "table" }}
                              control={
                                <div style={{ display: "table-cell" }}>
                                  <Checkbox
                                    checked={value}
                                    onBlur={onBlur}
                                    onChange={(ev) => onChange(ev.target.checked)}
                                    inputRef={ref}
                                    required
                                    defaultValue={false}
                                  />
                                </div>
                              }
                              label={
                                <div className="">
                                  I am familiar with the Personal Data Act, which states that there must be a "factual reason" for conducting a credit check of private individuals, and hereby confirm that there is a "factual reason" in this case. Private individuals who are credit checked will receive a copy of the creditcheck. We point out that the outcome of the credit assessment is a snapshot, and can change depending on the individual / company's change in financial circumstances.
                                </div>
                              }
                            />
                            <FormHelperText>
                              {errors?.trems?.message}
                            </FormHelperText>
                          </FormControl>
                        )}
                      /> */}
                    </div>
                  </div>
                  <div className="col-span-2 hidden md:block border-1 border-MonochromeGray-25">
                    <FAQs />
                  </div>
                </div>
              )}
              {isSuccess && (
                <div className="flex justify-center items-center bg-MonochromeGray-25 rounded-8 p-20 w-full my-20 min-h-200">
                  <div className="flex flex-col justify-center items-center gap-20 my-32">
                    <div className="text-center header5">
                      {t("label:requestSuccess")}
                    </div>
                    <div className="text-center body2 w-auto sm:w-2/3">
                      {`${t("label:yourCreditCheckRequestFor")} ${t("label:corporateClient")} ${creditCheckedId} ${t("label:hasBeenSuccessfullySent")}. ${t("label:youCanTrackTheStatusOfThisRequestOnTheCreditCheckPage")}.`}
                    </div>
                    <Link to={"/credit-check/credit-checks-list"}>
                      <Button
                        color="secondary"
                        variant="contained"
                        className="button2 rounded-4 w-full sm:w-auto"
                      >
                        {t("label:goToCreditCheck")}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
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
      </div>
    </>
  );
}
