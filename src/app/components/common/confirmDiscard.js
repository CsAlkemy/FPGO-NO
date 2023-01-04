import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const confirmDiscard = (props) => {
    const navigate = useNavigate();
  const {t} = useTranslation()
    
    const {title, open, setOpen, reset, subTitle, defaultValue, route} = props;
    const handleClose = () => {
        setOpen(false);
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
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="modeal-text"
            >
              {subTitle}
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
              onClick={()=> {
                handleClose();
                setTimeout(()=>{
                  //commented the reset as Nafees Vaiya only want to back previous screen by clicking discard(15-12-2022)
                  // reset({...defaultValue})
                    navigate(route)
                }, 500);
                }}
            >
              {t("label:confirm")}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  )
}

export default confirmDiscard
