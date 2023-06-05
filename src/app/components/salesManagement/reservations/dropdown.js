import React, { useState } from "react";
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useTranslation } from "react-i18next";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import CancelIcon from "@mui/icons-material/Cancel";
import RedoIcon from "@mui/icons-material/Redo";
import PaymentsIcon from "@mui/icons-material/Payments";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import UndoIcon from "@mui/icons-material/Undo";
import OrderModal from "../order/popupModal/orderModal";

import {
  ThousandSeparator,
  DayDiffFromToday,
} from "../../../utils/helperFunctions";

const ReservationDropdown = (props) => {
  const { data } = props;
  const { t } = useTranslation();
  const Random = Math.random();
  const buttonId = `button-${Random}`;
  const dropdownId = `dropDown-${Random}`;
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [headerTitle, setHeaderTitle] = useState();
  const menuOpen = Boolean(anchorEl);
  const [amountBank, setAmountBank] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(null);

  let refundableAmount = data.capturedAmount - data.amountRefunded;

  //console.log(refundableAmount);
  //console.log(data);
  //data.isPaid = true;
  //data.status = "sent";
  // data.reservedAt = 1679476569;
  // data.reservedAt = 1679735769;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleModalOpen = (decision) => {
    setOpen(true);
    setAnchorEl(null);
    setRemainingAmount(null);
    setAmountBank(null);

    if (decision === "resendReservations") setHeaderTitle("Resend Reservation");
    if (decision === "cancelReservation") setHeaderTitle("Cancel Reservation");
    if (decision === "chargeFromCard") {
      setHeaderTitle("Charge Amount");
      setAmountBank(data.amountInBank);
    }
    if (decision === "capturePayments") {
      setHeaderTitle("Capture Payment");
      setRemainingAmount(data.remainingAmount);
    }
    if (decision === "refundReservation") {
      setHeaderTitle("Refund from Reservation");
      setAmountBank(data.amountInBank);
    }
    if (decision === "completeReservation") {
      setHeaderTitle("Complete Reservation");
      setAmountBank(data.amountInBank);
    }
  };

  let dropDownMenu;

  if (data.status.toLowerCase() === "sent") {
    dropDownMenu = (
      <>
        <Menu
          id={dropdownId}
          anchorEl={anchorEl}
          open={menuOpen}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": buttonId,
          }}
        >
          <MenuItem
            onClick={() => {
              handleModalOpen("resendReservations");
            }}
          >
            <ListItemIcon>
              <RedoIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("label:resendReservation")}</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleModalOpen("cancelReservation")}>
            <ListItemIcon>
              <CancelIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>{t("label:cancelReservation")}</ListItemText>
          </MenuItem>
        </Menu>
        <OrderModal
          open={open}
          setOpen={setOpen}
          headerTitle={headerTitle}
          orderId={data.id}
          orderName={data.customer}
          orderAmount={data.reservationAmount}
          customerPhone={data.phone}
          customerEmail={data.email}
        />
      </>
    );
  } else if (data.status.toLowerCase() === "reserved") {
    if (data.isPaid) {
      dropDownMenu = (
        <>
          <Menu
            id={dropdownId}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": buttonId,
            }}
          >
            <MenuItem
              disabled={
                !data.reservedAt || DayDiffFromToday(data.reservedAt) > 60
              }
              onClick={() => handleModalOpen("chargeFromCard")}
            >
              <ListItemIcon>
                <CreditCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:chargeFromCard")}</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={
                !data.reservedAt ||
                DayDiffFromToday(data.reservedAt) > 7 ||
                data.capturedAmount >= data.reservedAmount
              }
              onClick={() => handleModalOpen("capturePayments")}
            >
              <ListItemIcon>
                <PaymentsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:capturePayments")}</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={refundableAmount <= 0}
              onClick={() => handleModalOpen("refundReservation")}
            >
              <ListItemIcon>
                <UndoIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:refundFromReservations")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleModalOpen("completeReservation")}>
              <ListItemIcon>
                <DoneAllIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:completeReservation")}</ListItemText>
            </MenuItem>
          </Menu>
          <OrderModal
            open={open}
            setOpen={setOpen}
            headerTitle={headerTitle}
            orderId={data.id}
            orderName={data.customer}
            orderAmount={data.reservationAmount}
            customerPhone={data.phone}
            customerEmail={data.email}
            capturedAmount={data.capturedAmount}
            amountInBank={data.amountInBank}
            remainingAmount={data.reservationAmount - data.capturedAmount}
            refundableAmount={refundableAmount}
          />
        </>
      );
    } else {
      dropDownMenu = (
        <>
          <Menu
            id={dropdownId}
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": buttonId,
            }}
          >
            <MenuItem
              disabled={
                !data.reservedAt || DayDiffFromToday(data.reservedAt) > 60
              }
              onClick={() => handleModalOpen("chargeFromCard")}
            >
              <ListItemIcon>
                <CreditCardIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:chargeFromCard")}</ListItemText>
            </MenuItem>
            <MenuItem
              disabled={
                !data.reservedAt ||
                DayDiffFromToday(data.reservedAt) > 7 ||
                data.capturedAmount >= data.reservedAmount
              }
              onClick={() => handleModalOpen("capturePayments")}
            >
              <ListItemIcon>
                <PaymentsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:capturePayments")}</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => handleModalOpen("cancelReservation")}>
              <ListItemIcon>
                <CancelIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t("label:cancelReservation")}</ListItemText>
            </MenuItem>
          </Menu>
          <OrderModal
            open={open}
            setOpen={setOpen}
            headerTitle={headerTitle}
            orderId={data.id}
            orderName={data.customer}
            orderAmount={data.reservationAmount}
            customerPhone={data.phone}
            customerEmail={data.email}
            amountInBank={amountBank}
            remainingAmount={remainingAmount}
          />
        </>
      );
    }
  }

  let dropDownButton;

  if (
    data.status.toLowerCase() == "sent" ||
    data.status.toLowerCase() == "reserved"
  ) {
    dropDownButton = (
      <>
        <Button
          variant="outlined"
          color="secondary"
          id={buttonId}
          aria-controls={menuOpen ? dropdownId : undefined}
          aria-haspopup="true"
          className="sm:w-9 w-full sm:h-9 rounded-lg min-w-0 hover:bg-white border-MonochromeGray-50 text-MonochromeGray-100 hover:text-primary-500 hover:border-primary-200"
          aria-expanded={menuOpen ? "true" : undefined}
          onClick={handleClick}
        >
          <MoreVertIcon />
        </Button>

        {dropDownMenu}
      </>
    );
  }

  return <>{dropDownButton}</>;
};

export default ReservationDropdown;
