import TableCell from "@mui/material/TableCell";
import OverviewStatus from "../status/OverviewStatus";
import {
  approvalListOverviewFPAdmin,
  categoriesListOverview,
  clientsListOverview,
  creditChecksListOverview,
  customersListOverview,
  userListOverview,
  productsListOverview,
  fpAdminUsersOverview,
  businessAdminUsersOverview,
  organizationWiseUsersOverview,
  ordersListOverview,
  customerOrdersListOverview,
  refundRequestsOverview,
  clientOrdersListOverview,
  reservationListOverview,
  subscriptionsListOverview,
  failedPaymentsListOverview,
  payoutReportsListOverview,
} from "./TablesName";
import ApartmentIcon from "@mui/icons-material/Apartment";
import StoreIcon from "@mui/icons-material/Store";
import Skeleton from "@mui/material/Skeleton";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import CancelIcon from "@mui/icons-material/Cancel";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Fade from "@mui/material/Fade";
import { withStyles } from "@mui/styles";
import { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import Box from "@mui/material/Box";
import OrderModal from "../../salesManagement/order/popupModal/orderModal";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import { Button } from "@mui/material";
import { CharCont, ThousandSeparator } from "../../../utils/helperFunctions";
import { useTranslation } from "react-i18next";
import DiscardConfirmModal from "../../common/confirmDiscard";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SendInvoiceModal from "../../salesManagement/quickOrder/sendInvoiceModal";
import ReservationDropdown from "../../salesManagement/reservations/dropdown";

export default function OverViewResponsiveBody(props) {
  const [openHigh, setOpenHigh] = useState(false);
  const [openModerate, setOpenModerate] = useState(false);
  const [openLow, setOpenLow] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [headerTitle, setHeaderTitle] = useState();
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const [amountBank, setAmountBank] = useState(null);

  const handleTooltipClose = () => {
    setOpenHigh(false);
    setOpenModerate(false);
    setOpenLow(false);
  };

  const handleTooltipOpen = (tooltip) => {
    if (tooltip === "high") setOpenHigh(true);
    else if (tooltip === "moderate") setOpenModerate(true);
    else if (tooltip === "low") setOpenLow(true);
  };

  const handleModalOpen = (decision) => {
    setOpen(true);
    setAmountBank(null);
    if (decision === "cancel") setHeaderTitle("Cancel Order");
    if (decision === "resend") setHeaderTitle("Resend Order");
    if (decision === "refund") setHeaderTitle("Send Refund");
    if (decision === "reject") setHeaderTitle("Reject Refund Request");
    if (decision === "subscriptionCancel") setHeaderTitle("Cancel Subscription");
    if (decision === "refundReservations")
      setHeaderTitle("Refund from Reservation");
  };
  const handleSendInvoiceModalOpen = () => {
    setOpen(true);
  };

  const CustomTooltip = withStyles({
    tooltip: {
      backgroundColor: "#323434",
      color: "#FFFFFF",
      borderRadius: "8px",
    },
  })(Tooltip);

  const resendRefundBoxSX = {
    border: "1px solid #E8E8E8",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    color: "#C6C7C7",
    "&:hover": {
      border: "1px solid #838585",
      borderRadius: "10px",
      backgroundColor: "#F2FAFD",
      color: "#0088AE",
    },
  };

  const cancelBoxSX = {
    border: "1px solid #E8E8E8",
    borderRadius: "10px",
    backgroundColor: "#FFFFFF",
    color: "#C6C7C7",
    "&:hover": {
      border: "1px solid #838585",
      borderRadius: "10px",
      backgroundColor: "#F7F7F7",
      color: "#F36562",
    },
  };

  switch (props.tableName) {
    case userListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case clientsListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case approvalListOverviewFPAdmin:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case productsListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case categoriesListOverview:
      return props.headerRows.map((rdt) => {
        return (
          <div className="grid grid-cols-2 justify-between items-center">
            <div className="subtitle3 text-primary-900">
              {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
              {rdt.label}
            </div>
            <div className="body3 text-MonochromeGray-700">
              {props.row[rdt.id]}
            </div>
          </div>
        );
      });
    case customersListOverview:
      return props.headerRows.map((rdt) => {
        switch (rdt.id) {
          case "name":
            if (props.row.status === "Active") {
              return props.row.type === "Corporate" ? (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700 flex items-center gap-5">
                    <LocationCityIcon className="text-[#50C9B1]" />
                    {CharCont(props.row[rdt.id], 10)}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700  flex items-center gap-5">
                    <PersonIcon className="text-[#68C7E7]" />
                    {CharCont(props.row[rdt.id], 10)}
                  </div>
                </div>
              );
            } else {
              return props.row.type === "Corporate" ? (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700  flex items-center gap-5">
                    <LocationCityIcon className="text-MonochromeGray-100" />
                    {CharCont(props.row[rdt.id], 10)}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">{rdt.label}</div>
                  <div className="body3 text-MonochromeGray-700  flex items-center gap-5">
                    <PersonIcon className="text-MonochromeGray-100" />
                    {CharCont(props.row[rdt.id], 10)}
                  </div>
                </div>
              );
            }
          case "lastOrderAmount":
            return (
              <div className="grid grid-cols-2 justify-between items-center">
                <div className="subtitle3 text-primary-900">
                  {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                  {rdt.label}
                </div>
                <div className="body3 text-MonochromeGray-700">
                  {props.row[rdt.id]}
                </div>
              </div>
            );
          case "email":
            return (
              <div className="grid grid-cols-2 justify-between items-center">
                <div className="subtitle3 text-primary-900">
                  {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                  {rdt.label}
                </div>
                <div className="body3 text-MonochromeGray-700 truncate">
                  {props.row[rdt.id]}
                </div>
              </div>
            );
          default:
            return (
              <div className="grid grid-cols-2 justify-between items-center">
                <div className="subtitle3 text-primary-900">
                  {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                  {rdt.label}
                </div>
                <div className="body3 text-MonochromeGray-700">
                  {props.row[rdt.id]}
                </div>
              </div>
            );
        }
      });
    case customerOrdersListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "stage") {
          switch (props.row.stage) {
            case "paid":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Paid"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "sent":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "expired":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Expired"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "invoiced":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Invoiced"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "cancelled":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Cancelled"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "refunded":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Refunded"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "refund pending":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Refund Pending"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "Partial Refunded":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Partial Refunded"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "completed":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Completed"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reminder sent":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Reminder Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "sent to debt collection":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Debt Collection"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "overdue":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Overdue"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "overpayment":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Overpayment"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reminder":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Reminder"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "collection":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Collection"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "credited":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Credited"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "converted to account":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Converted to Account"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
          // return props.row.stage === "paid" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Paid" />
          //   </TableCell>
          // ) : props.row.stage === "sent" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Sent" />
          //   </TableCell>
          // ) : props.row.stage === "expired" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Expired" />
          //   </TableCell>
          // ) : props.row.stage === "invoiced" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Invoiced" />
          //   </TableCell>
          // ) : props.row.stage === "cancelled" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Cancelled" />
          //   </TableCell>
          // ) : (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     {/*<OverviewStatus name="Cancelled" />*/}
          //   </TableCell>
          // );
        } else if (rdt.id === "amount") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div
                className="body3 text-MonochromeGray-700"
                onClick={() => {
                  props.rowClickAction(props.row);
                }}
              >
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.uuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<UndoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("refund")}
                >
                  {t("label:refundOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.uuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ReceiptLongOutlinedIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => setEditOpen(true)}
                >
                  {t("label:sendInvoice")}
                </Button>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ReceiptLongOutlinedIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleSendInvoiceModalOpen()}
                >
                  {t("label:sendInvoice")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ReceiptLongOutlinedIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleSendInvoiceModalOpen()}
                >
                  {t("label:sendInvoice")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else if (rdt.id === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Button
                  Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon className="text-red-500" />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100 text-MonochromeGray-900"
                  onClick={() => handleModalOpen("cancel")}
                >
                  {t("label:cancelOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.uuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
        // return rdt.includes("amount") || rdt.includes("stage") ? (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
        // :
        // (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
      });
    case creditChecksListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          return props.row.scoreStatus === "low" ? (
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <div>
                    <CustomTooltip
                      onClose={handleTooltipClose}
                      open={openLow}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={props.row.status}
                      TransitionComponent={Zoom}
                      placement="left"
                      enterDelay={300}
                    >
                      <InfoIcon
                        onClick={() => handleTooltipOpen("low")}
                        style={{ color: "#70C985", marginRight: "25px" }}
                      />
                    </CustomTooltip>
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          ) : props.row.scoreStatus === "moderate" ? (
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <div>
                    <CustomTooltip
                      onClose={handleTooltipClose}
                      open={openModerate}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={props.row.status}
                      TransitionComponent={Zoom}
                      placement="left"
                      enterDelay={300}
                    >
                      <InfoIcon
                        onClick={() => handleTooltipOpen("moderate")}
                        style={{ color: "#E7AB52", marginRight: "25px" }}
                      />
                    </CustomTooltip>
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <div>
                    <CustomTooltip
                      onClose={handleTooltipClose}
                      open={openHigh}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      title={props.row.status}
                      TransitionComponent={Zoom}
                      placement="left"
                      enterDelay={300}
                    >
                      <InfoIcon
                        onClick={() => handleTooltipOpen("high")}
                        style={{ color: "#EC6B68", marginRight: "25px" }}
                      />
                    </CustomTooltip>
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          );
        } else if (rdt.id === "customerName") {
          return props.row.type === "Private" ? (
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <div className="flex gap-7 items-center">
                  <PersonIcon className="text-[#68C7E7]" />
                  {props.row ? (
                    CharCont(props.row[rdt.id], 10)
                  ) : (
                    <Skeleton variant="text" />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <div className="flex gap-7 items-center">
                  <LocationCityIcon className="text-[#50C9B1]" />
                  {props.row ? (
                    CharCont(props.row[rdt.id], 10)
                  ) : (
                    <Skeleton variant="text" />
                  )}
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case fpAdminUsersOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {" "}
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case businessAdminUsersOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {" "}
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case organizationWiseUsersOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {" "}
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate ">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case ordersListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "stage") {
          switch (props.row.stage) {
            case "paid":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Paid"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "sent":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "expired":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Expired"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "invoiced":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Invoiced"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "cancelled":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Cancelled"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "refunded":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Refunded"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "refund pending":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Refund Pending"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "partial refunded":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Partial Refunded"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "completed":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Completed"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reminder sent":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Reminder Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "sent to debt collection":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Debt Collection"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "unpaid":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Unpaid"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "overdue":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Overdue"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "overpayment":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Overpayment"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reminder":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Reminder"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "collection":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Collection"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "credited":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Credited"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "converted to account":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Converted to Account"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
          // return props.row.stage === "paid" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Paid" />
          //   </TableCell>
          // ) : props.row.stage === "sent" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Sent" />
          //   </TableCell>
          // ) : props.row.stage === "expired" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Expired" />
          //   </TableCell>
          // ) : props.row.stage === "invoiced" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Invoiced" />
          //   </TableCell>
          // ) : props.row.stage === "cancelled" ? (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     <OverviewStatus name="Cancelled" />
          //   </TableCell>
          // ) : (
          //   <TableCell
          //     key={`${props.row.uuid}-${rdt}`}
          //     align="right"
          //     onClick={() => {
          //       props.rowClickAction(props.row);
          //     }}
          //   >
          //     {/*<OverviewStatus name="Cancelled" />*/}
          //   </TableCell>
          // );
        } else if (rdt.id === "amount") {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<UndoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("refund")}
                >
                  {t("label:refundOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ReceiptLongOutlinedIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => setEditOpen(true)}
                >
                  {t("label:sendInvoice")}
                </Button>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
                // headerTitle={headerTitle}
                // orderId={props.row.id}
                // orderName={props.row.name}
                // orderAmount={props.row.amount}
                // customerPhone={props.row.phone}
                // customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else if (rdt.id === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Button
                  Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon className="text-red-500" />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100 text-MonochromeGray-900"
                  onClick={() => handleModalOpen("cancel")}
                >
                  {t("label:cancelOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
        // return rdt.includes("amount") || rdt.includes("stage") ? (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
        // :
        // (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
      });
    case refundRequestsOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "stage") {
          switch (props.row.stage) {
            case "refund pending":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Refund Pending"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "accepted":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Accepted"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "rejected":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Rejected"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
        } else if (rdt.id === "amount") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div
                className="body3 text-MonochromeGray-700"
                onClick={() => {
                  props.rowClickAction(props.row);
                }}
              >
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "approveAction") {
          return props.row.approveAction === "refund pending" ? (
            <>
              <CustomTooltip
                disableFocusListener
                title="Approve Request"
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => setOpenApprove(true)}
                >
                  {t("label:accept")}
                </Button>
              </CustomTooltip>
              <DiscardConfirmModal
                open={openApprove}
                // defaultValue={defaultValueCreateClient}
                setOpen={setOpenApprove}
                // reset={reset}
                modalRef="confirmRefundRequestApprove"
                values={{
                  amount: props.row.refundAmount,
                  orderUuid: props.row.id,
                }}
                title={t("label:areYouSureYouWantToApproveThisRefund")}
                subTitle={t("label:onceConfirmedThisActionCannotBeReverted")}
                route={0}
              />
            </>
          ) : (
            ""
          );
        } else if (rdt.id === "cancel") {
          return props.row.isCancel ? (
            <>
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Button
                  Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon className="text-red-500" />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100 text-MonochromeGray-900"
                  onClick={() => handleModalOpen("reject")}
                >
                  {t("label:reject")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.customerName}
                orderAmount={props.row.refundAmount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else if (rdt === "orderAmount" || rdt === "refundAmount") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
        // return rdt.includes("amount") || rdt.includes("stage") ? (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
        // :
        // (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
      });
    case clientOrdersListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          switch (props.row.status) {
            case "paid":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Paid"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "sent":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "expired":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Expired"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "invoiced":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Invoiced"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "cancelled":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Cancelled"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "refunded":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Refunded"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "refund pending":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Refund Pending"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "partial refunded":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Partial Refunded"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "completed":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Completed"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reminder sent":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Reminder Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "sent to debt collection":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Debt Collection"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "unpaid":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Unpaid"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "overdue":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Overdue"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "overpayment":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Overpayment"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reminder":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Reminder"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "collection":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Collection"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "credited":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Credited"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "converted to account":
              return (
                <div className="grid grid-cols-2 justify-between items-center">
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div
                    className="body3 text-MonochromeGray-700"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus
                      name="Converted to Account"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
        } else if (rdt.id === "amount") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div
                className="body3 text-MonochromeGray-700"
                onClick={() => {
                  props.rowClickAction(props.row);
                }}
              >
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
        // return rdt.includes("amount") || rdt.includes("stage") ? (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
        // :
        // (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
      });
    case payoutReportsListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });

    case reservationListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "status") {
          switch (props.row.status) {
            case "sent":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "expired":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Expired"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "reserved":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Reserved"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "cancelled":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Cancelled"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "completed":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Completed"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
        } else if (
          rdt.id === "reservedAmount" ||
          rdt.id === "amountPaid" ||
          rdt.id === "amountInBank"
        ) {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">{rdt.label}</div>
              <div className="body3 text-MonochromeGray-700">
                {t("label:nok")} {ThousandSeparator(props.row[rdt.id])}
              </div>
            </div>
          );
        } else if (rdt.id === "options") {
          return user.role[0] === FP_ADMIN ? (
            ""
          ) : props.row.status.toLowerCase() === "completed" ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={t("label:refundFromReservations")}
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<UndoIcon />}
                  className="rounded-4 border-1 hover:bg-white border-MonochromeGray-100 text-MonochromeGray-100 hover:text-primary-500"
                  onClick={() => {
                    handleModalOpen("refundReservations");
                    setAmountBank(props.row.amountInBank);
                  }}
                >
                  {t("label:refundFromReservation")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.customer}
                orderAmount={props.row.reservedAmount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
                amountInBank={amountBank}
              />
            </>
          ) : (
            <>
              <ReservationDropdown data={props.row} />
            </>
          );
        } else {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">{rdt.label}</div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
    case subscriptionsListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "stage") {
          switch (props.row.stage) {
            case "sent":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "on going":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="On Going"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "cancelled":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Cancelled"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "completed":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Completed"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
        } else if (rdt.id === "amount") {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.orderUuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
                refundRequestsCount={props.refundRequestCount}
                setRefundRequestsCount={props.setRefundRequestsCount}
              />
            </>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<UndoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("refund")}
                >
                  {t("label:refundOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                orderType={"SUBSCRIPTION"}
                headerTitle={headerTitle}
                orderId={props.row.orderUuid}
                subscriptionUuid={props.row.uuid}
                refundCycle={props.row.refundCycles}
                tableName={props.tableName}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else if (rdt.id === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Button
                  Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon className="text-red-500" />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100 text-MonochromeGray-900"
                  onClick={() => handleModalOpen("subscriptionCancel")}
                >
                  {t("label:cancelOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                orderType={"SUBSCRIPTION"}
                refundCycle={props.row.refundCycles}
                headerTitle={headerTitle}
                orderId={props.row.orderUuid}
                subscriptionUuid={props.row.uuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
        // return rdt.includes("amount") || rdt.includes("stage") ? (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
        // :
        // (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
      });
    case failedPaymentsListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "stage") {
          switch (props.row.stage) {
            case "sent":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Sent"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "on going":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="On Going"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "cancelled":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Cancelled"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
            case "completed":
              return (
                <div
                  className="grid grid-cols-2 justify-between items-center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <div className="subtitle3 text-primary-900">
                    {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                    {rdt.label}
                  </div>
                  <div className="body3 text-MonochromeGray-700">
                    <OverviewStatus
                      name="Completed"
                      translationKey={props.row.translationKey}
                    />
                  </div>
                </div>
              );
          }
        } else if (rdt.id === "amount") {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<UndoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("refund")}
                >
                  {t("label:refundOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<ReceiptLongOutlinedIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => setEditOpen(true)}
                >
                  {t("label:sendInvoice")}
                </Button>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
                // headerTitle={headerTitle}
                // orderId={props.row.id}
                // orderName={props.row.name}
                // orderAmount={props.row.amount}
                // customerPhone={props.row.phone}
                // customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else if (rdt.id === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Button
                  Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<CancelIcon className="text-red-500" />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100 text-MonochromeGray-900"
                  onClick={() => handleModalOpen("cancel")}
                >
                  {t("label:cancelOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <>
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<RedoIcon />}
                  className="rounded-4 button2 border-1 border-MonochromeGray-100"
                  onClick={() => handleModalOpen("resend")}
                >
                  {t("label:resendOrder")}
                </Button>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.id}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </>
          ) : (
            ""
          );
        } else {
          return (
            <div
              className="grid grid-cols-2 justify-between items-center"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
        // return rdt.includes("amount") || rdt.includes("stage") ? (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
        // :
        // (
        //   <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
        //     {props.row ? props.row[rdt] : <Skeleton variant="text" />}
        //   </TableCell>
        // )
      });
    case payoutReportsListOverview:
      return props.headerRows.map((rdt) => {
        if (rdt.id === "email") {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700 truncate">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        } else if (rdt.id === "status") {
          return props.row.status === "Active" ? (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Active" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                <OverviewStatus name="Inactive" />
              </div>
            </div>
          );
        } else {
          return (
            <div className="grid grid-cols-2 justify-between items-center">
              <div className="subtitle3 text-primary-900">
                {/*{rdt.charAt(0).toUpperCase() + rdt.slice(1).toLowerCase()}*/}
                {rdt.label}
              </div>
              <div className="body3 text-MonochromeGray-700">
                {props.row[rdt.id]}
              </div>
            </div>
          );
        }
      });
  }
}
