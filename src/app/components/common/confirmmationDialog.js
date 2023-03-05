import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useSnackbar } from "notistack";
import * as React from "react";
import { useNavigate } from "react-router-dom";
import CategoryService from "../../data-access/services/categoryService/CategoryService";
import ClientService from "../../data-access/services/clientsService/ClientService";
import { useTranslation } from "react-i18next";
import { useDeleteCategoryMutation, useDeleteClientMutation } from 'app/store/api/apiSlice';

export default function ConfirmModal({
  open,
  setOpen,
  header,
  subText,
  uuid,
  refKey,
}) {
  const { t } = useTranslation();
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState("lg");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [deleteCategory] = useDeleteCategoryMutation();
  const [ deleteClient ] = useDeleteClientMutation()

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteAction = () => {
    if (refKey === "category") {
      deleteCategory(uuid).then((response) => {
        if (!response.data) {
          enqueueSnackbar(`Deleted Successfully`, {
            variant: "success",
            autoHideDuration: 3000,
          });
          navigate("/categories/categories-list");
          setOpen(true);
        } else {
          enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
        }
      });
      // CategoryService.deleteCategoryByUUID(uuid)
      //   .then((response) => {
      //     // if (response?.status_code === 204) {
      //     if (response?.status === 204) {
      //       enqueueSnackbar(`Deleted Successfully`, {
      //         variant: "success",
      //         autoHideDuration: 3000,
      //       });
      //       navigate("/categories/categories-list");
      //       setOpen(true);
      //     } else {
      //       enqueueSnackbar(t(`message:${response?.error?.data?.message}`), { variant: "error" });
      //     }
      //     // enqueueSnackbar(`Deleted Successfully`, {
      //     //   variant: "success",
      //     //   autoHideDuration: 3000,
      //     // });
      //     // navigate("/categories/categories-list");
      //     // setOpen(true);
      //   })
      //   .catch((e) => {
      //     console.log("E : ", e);
      //   });
    } else if (refKey === "deleteClient") {
      deleteClient(uuid)
        .then((response) => {
          // if (res?.status_code === 204){
          if (!response.data) {
          // if (res?.status === 204) {
            enqueueSnackbar("Request Deleted", {
              variant: "success",
              autoHideDuration: 3000,
            });
            navigate("/clients/approval-list");
          } else {
            enqueueSnackbar(t(`message:${response?.error?.data?.message}`), {
              variant: "error",
              autoHideDuration: 3000,
            });
          }
        })
      // ClientService.deleteClient(uuid)
      //   .then((res) => {
      //     // if (res?.status_code === 204){
      //     if (res?.status === 204) {
      //       enqueueSnackbar("Request Deleted", {
      //         variant: "success",
      //         autoHideDuration: 3000,
      //       });
      //       navigate("/clients/approval-list");
      //     }
      //   })
      //   .catch((error) => {
      //     enqueueSnackbar(error, { variant: "error" });
      //   });
    }
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="rounded-8"
      >
        <div className="p-16">
          <DialogTitle id="alert-dialog-title" className="modeal-header">
            {header}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="modeal-text"
            >
              {subText}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              variant="text"
              className="text-main font-semibold"
            >
              {t("label:cancel")}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className="rounded-4 font-semibold"
              onClick={deleteAction}
            >
              {t("label:confirmDelete")}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
}
