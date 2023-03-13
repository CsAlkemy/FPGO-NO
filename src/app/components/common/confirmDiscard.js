import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useSnackbar} from "notistack";
import {useRefundRequestDecisionMutation} from "app/store/api/apiSlice";
import {LoadingButton} from "@mui/lab";
import _ from "lodash";

const confirmDiscard = (props) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [refundRequestDecision] = useRefundRequestDecisionMutation();
  const [apiLoading, setApiLoading] = React.useState(false);

  const {
    title,
    open,
    setOpen,
    reset,
    subTitle,
    defaultValue,
    route,
    modalRef,
    values,
  } = props;
  const handleClose = () => {
    setTimeout(() => {
      //commented the reset as Nafees Vaiya only want to back previous screen by clicking discard(15-12-2022)
      // reset({...defaultValue})
      !(modalRef === "confirmRefundRequestApprove") ? navigate(route) : "";
    }, 500);
    setOpen(false);
  };

  const handleConfirmRefundRequest = () => {
    setApiLoading(true);
    if (modalRef === "confirmRefundRequestApprove") {
      const { orderUuid, amount } = values;
      const params = {
        orderUuid,
        amount,
        isApproved: true,
        note: null,
      };

      refundRequestDecision(params).then((response) => {
        if (response?.data?.status_code === 202) {
          enqueueSnackbar(t(`message:${response?.data?.message}`), {
            variant: "success",
          });
          setApiLoading(false);
        } else if (response?.error) {
          enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
            variant: "error",
          });
          setApiLoading(false);
        }
        setOpen(false);
      });
    }
    setTimeout(() => {
      !(modalRef === "confirmRefundRequestApprove") ? navigate(route) : "";
    }, 500);
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rounded-8"
      >
        <div className="p-16">
          <DialogTitle id="alert-dialog-title" className="modeal-header">
            {t(`label:${_.camelCase(title)}`)}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="modeal-text"
            >
              {t(`label:${_.camelCase(subTitle)}`)}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="text"
              className="text-main font-semibold mr-16"
            >
              {t("label:cancel")}
            </Button>
            <LoadingButton
              variant="contained"
              color="secondary"
              className="rounded-4 button2 min-w-[153px]"
              aria-label="Confirm"
              size="large"
              type="submit"
              loading={apiLoading}
              loadingPosition="center"
              onClick={() =>
                modalRef === "confirmRefundRequestApprove"
                  ? handleConfirmRefundRequest()
                  : handleClose()
              }
            >
              {t("label:confirm")}
            </LoadingButton>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
};

export default confirmDiscard;
