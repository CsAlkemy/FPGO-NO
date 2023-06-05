import TableCell from "@mui/material/TableCell";
import OverviewStatus from "../status/OverviewStatus";
import {
  approvalListOverviewFPAdmin,
  businessAdminUsersOverview,
  categoriesListOverview,
  clientOrdersListOverview,
  clientsListOverview,
  creditChecksListOverview,
  customerOrdersListOverview,
  customersListOverview,
  failedPaymentsListOverview,
  fpAdminUsersOverview,
  ordersListOverview,
  organizationWiseUsersOverview,
  payoutReportsListOverview,
  productsListOverview,
  refundRequestsOverview,
  reservationListOverview,
  subscriptionsListOverview,
  userListOverview,
} from "./TablesName";
import Skeleton from "@mui/material/Skeleton";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import RedoIcon from "@mui/icons-material/Redo";
import UndoIcon from "@mui/icons-material/Undo";
import CancelIcon from "@mui/icons-material/Cancel";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { withStyles } from "@mui/styles";
import { useState } from "react";
import { ClickAwayListener } from "@mui/base";
import Box from "@mui/material/Box";
import OrderModal from "../../salesManagement/order/popupModal/orderModal";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import { DoneAll } from "@mui/icons-material";
import DiscardConfirmModal from "../../common/confirmDiscard";
import { useTranslation } from "react-i18next";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import SendInvoiceModal from "../../salesManagement/quickOrder/sendInvoiceModal";
import ReservationDropdown from "../../salesManagement/reservations/dropdown";

export default function OverViewMainTableBody(props) {
  const { t } = useTranslation();
  const [openHigh, setOpenHigh] = useState(false);
  const [openModerate, setOpenModerate] = useState(false);
  const [openLow, setOpenLow] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [headerTitle, setHeaderTitle] = useState();
  const user = useSelector(selectUser);
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
    if (decision === "subscriptionRefund") setHeaderTitle("subscriptionRefund");
    if (decision === "subscriptionCancel") setHeaderTitle("Cancel Subscription");
  };
  const handleSendInvoiceModalOpen = () => {
    setEditOpen(true);
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

  const quickOrderSendInvoiceSX = {
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

  switch (props.tableName) {
    case userListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case clientsListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case approvalListOverviewFPAdmin:
      return props.rowDataFields.map((rdt) => {
        return (
          <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
            {props.row ? props.row[rdt] : <Skeleton variant="text" />}
          </TableCell>
        );
      });
    case productsListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else if (rdt === "pricePerUnit") {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? (
                ThousandSeparator(props.row[rdt])
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case categoriesListOverview:
      return props.rowDataFields.map((rdt) => {
        return rdt === "noOfProducts" ? (
          <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
            {props.row ? props.row[rdt] : <Skeleton variant="text" />}
          </TableCell>
        ) : (
          <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
            {props.row ? props.row[rdt] : <Skeleton variant="text" />}
          </TableCell>
        );
      });
    case customersListOverview:
      return props.rowDataFields.map((rdt) => {
        switch (rdt) {
          case "name":
            if (props.row.status === "Active") {
              return props.row.type === "Corporate" ? (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <div className="flex items-center gap-7">
                    <LocationCityIcon className=" text-[#50C9B1]" />
                    {props.row[rdt]}
                  </div>
                </TableCell>
              ) : (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <div className="flex items-center gap-7">
                    <PersonIcon className="text-[#68C7E7]" />
                    {props.row[rdt]}
                  </div>
                </TableCell>
              );
            } else {
              return props.row.type === "Corporate" ? (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <div className="flex items-center gap-7">
                    <LocationCityIcon style={{ color: "#C6C7C7" }} />
                    {props.row[rdt]}
                  </div>
                </TableCell>
              ) : (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <div className="flex items-center gap-7">
                    <PersonIcon className="" style={{ color: "#C6C7C7" }} />
                    {props.row[rdt]}
                  </div>
                </TableCell>
              );
            }
          case "lastOrderAmount":
            return (
              <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
                {props.row ? (
                  ThousandSeparator(props.row[rdt])
                ) : (
                  <Skeleton variant="text" />
                )}
              </TableCell>
            );
          default:
            return (
              <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                {props.row ? props.row[rdt] : <Skeleton variant="text" />}
              </TableCell>
            );
        }
      });
    case customerOrdersListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "stage") {
          switch (props.row.stage) {
            case "paid":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Paid"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "expired":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Expired"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "invoiced":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Invoiced"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "cancelled":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Cancelled"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "refunded":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refunded"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "refund pending":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refund Pending"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "partial refunded":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Partial Refunded"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "completed":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Completed"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reminder sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reminder Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "sent to debt collection":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Debt Collection"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "unpaid":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Unpaid"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "overdue":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Overdue"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "overpayment":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Overpayment"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reminder":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reminder"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "collection":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Collection"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "credited":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Credited"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "converted to account":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Converted to Account"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
          }
        } else if (rdt === "amount") {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? (
                ThousandSeparator(props.row[rdt])
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else if (rdt === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("refund")}
                >
                  <UndoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title="Send Invoice"
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  sx={quickOrderSendInvoiceSX}
                  onClick={() => handleSendInvoiceModalOpen()}
                >
                  <ReceiptLongOutlinedIcon style={{ paddingBottom: "3px" }} />
                </Box>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              {/*<OverviewStatus name="Invoiced" />*/}
            </TableCell>
          );
        } else if (rdt === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F7F7F7" }}
                  sx={cancelBoxSX}
                  onClick={() => handleModalOpen("cancel")}
                >
                  <CancelIcon style={{ paddingBottom: "3px" }} />
                </Box>
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
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title={`Resend Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
            ></TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case creditChecksListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.scoreStatus === "low" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="center">
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
            </TableCell>
          ) : props.row.scoreStatus === "moderate" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="center">
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
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="center">
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
            </TableCell>
          );
        } else if (rdt === "customerName") {
          return props.row.type === "Private" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <div className="flex gap-7 items-center">
                <PersonIcon className="text-[#68C7E7]" />
                {props.row ? props.row[rdt] : <Skeleton variant="text" />}
              </div>
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <div className="flex gap-7 items-center">
                <LocationCityIcon className="text-[#50C9B1]" />
                {props.row ? props.row[rdt] : <Skeleton variant="text" />}
              </div>
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case fpAdminUsersOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case businessAdminUsersOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case organizationWiseUsersOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case ordersListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "stage") {
          switch (props.row.stage) {
            case "paid":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Paid"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "expired":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Expired"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "invoiced":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Invoiced"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "cancelled":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Cancelled"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "refunded":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refunded"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "refund pending":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refund Pending"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "partial refunded":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Partial Refunded"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "completed":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Completed"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reminder sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reminder Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "sent to debt collection":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Debt Collection"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "unpaid":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Unpaid"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "overdue":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Overdue"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "overpayment":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Overpayment"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reminder":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reminder"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "collection":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Collection"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "credited":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Credited"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "converted to account":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Converted to Account"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
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
        } else if (rdt === "amount") {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? (
                ThousandSeparator(props.row[rdt])
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else if (rdt === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
                refundRequestsCount={props.refundRequestCount}
                setRefundRequestsCount={props.setRefundRequestsCount}
              />
            </TableCell>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("refund")}
                >
                  <UndoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title="Send Invoice"
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  sx={quickOrderSendInvoiceSX}
                  onClick={() => handleSendInvoiceModalOpen()}
                >
                  <ReceiptLongOutlinedIcon style={{ paddingBottom: "3px" }} />
                </Box>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              {/*<OverviewStatus name="Invoiced" />*/}
            </TableCell>
          );
        } else if (rdt === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F7F7F7" }}
                  sx={cancelBoxSX}
                  onClick={() => handleModalOpen("cancel")}
                >
                  <CancelIcon style={{ paddingBottom: "3px" }} />
                </Box>
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
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              style={{ padding: "5px" }}
            >
              <CustomTooltip
                disableFocusListener
                title={`Resend Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
            ></TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
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
      return props.rowDataFields.map((rdt) => {
        if (rdt === "stage") {
          switch (props.row.stage) {
            case "refund pending":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refund Pending"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "accepted":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Accepted"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "rejected":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Rejected"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
          }
        } else if (rdt === "amount") {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? (
                ThousandSeparator(props.row[rdt])
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else if (rdt === "approveAction") {
          return props.row.approveAction === "refund pending" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title="Approve Request"
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => setOpenApprove(true)}
                >
                  <DoneAll
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
              </CustomTooltip>
              {/*<OrderModal*/}
              {/*  open={open}*/}
              {/*  setOpen={setOpen}*/}
              {/*  headerTitle={headerTitle}*/}
              {/*  orderId={props.row.id}*/}
              {/*  orderName={props.row.name}*/}
              {/*  orderAmount={props.row.amount}*/}
              {/*  customerPhone={props.row.phone}*/}
              {/*  customerEmail={props.row.email}*/}
              {/*/>*/}
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
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              {/*<OverviewStatus name="Invoiced" />*/}
            </TableCell>
          );
        } else if (rdt === "cancel") {
          return (
            props.row.isCancel && (
              <TableCell
                key={`${props.row.uuid}-${rdt}`}
                align="right"
                style={{ padding: "5px" }}
              >
                <CustomTooltip
                  disableFocusListener
                  title="Reject Refund Request"
                  TransitionComponent={Zoom}
                  placement="bottom-start"
                  enterDelay={300}
                >
                  <Box
                    component="span"
                    className="py-8 px-4"
                    // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F7F7F7" }}
                    sx={cancelBoxSX}
                    onClick={() => handleModalOpen("reject")}
                  >
                    <CancelIcon style={{ paddingBottom: "3px" }} />
                  </Box>
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
              </TableCell>
            )
          );
          // : (
          //     <TableCell
          //       key={`${props.row.uuid}-${rdt}`}
          //       align="right"
          //     ></TableCell>
          //   );
        } else if (rdt === "orderAmount" || rdt === "refundAmount") {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? (
                ThousandSeparator(props.row[rdt])
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
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
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          switch (props.row.status) {
            case "paid":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Paid"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "expired":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Expired"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "invoiced":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Invoiced"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "cancelled":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Cancelled"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "refunded":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refunded"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "refund pending":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Refund Pending"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "partial refunded":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Partial Refunded"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "completed":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Completed"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reminder sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reminder Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "sent to debt collection":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Debt Collection"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "unpaid":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Unpaid"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "overdue":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Overdue"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "overpayment":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Overpayment"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reminder":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reminder"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "collection":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Collection"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "credited":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Credited"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "converted to account":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Converted to Account"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
          }
        } else if (rdt === "amount") {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? (
                ThousandSeparator(props.row[rdt])
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case reservationListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          switch (props.row.status) {
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "expired":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Expired"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "cancelled":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Cancelled"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "completed":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Completed"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "reserved":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Reserved"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
          }
        } else if (
          rdt === "reservedAmount" ||
          rdt === "amountPaid" ||
          rdt === "amountInBank"
        ) {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? (
                `${t("label:nok")} ${ThousandSeparator(props.row[rdt])}`
              ) : (
                <Skeleton variant="text" />
              )}
            </TableCell>
          );
        } else if (rdt === "options") {
          return user.role[0] === FP_ADMIN ? (
            ""
          ) : props.row.status.toLowerCase() === "completed" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={t("label:refundFromReservations")}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4 hover:border-primary-500"
                  sx={resendRefundBoxSX}
                  onClick={() => {
                    handleModalOpen("refundReservations");
                    setAmountBank(props.row.amountInBank);
                  }}
                >
                  <UndoIcon style={{ paddingBottom: "3px" }} />
                </Box>
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
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="center">
              <ReservationDropdown data={props.row} />
            </TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case subscriptionsListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "stage") {
          switch (props.row.stage) {
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "ongoing":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="On Going"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "completed":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Completed"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "cancelled":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Cancelled"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
          }
        } else if (rdt === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("subscriptionRefund")}
                >
                  <UndoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                orderType={"SUBSCRIPTION"}
                headerTitle={headerTitle}
                orderId={props.row.orderUuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title="Send Invoice"
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  sx={quickOrderSendInvoiceSX}
                  onClick={() => handleSendInvoiceModalOpen()}
                >
                  <ReceiptLongOutlinedIcon style={{ paddingBottom: "3px" }} />
                </Box>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              {/*<OverviewStatus name="Invoiced" />*/}
            </TableCell>
          );
        } else if (rdt === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F7F7F7" }}
                  sx={cancelBoxSX}
                  onClick={() => handleModalOpen("subscriptionCancel")}
                >
                  <CancelIcon style={{ paddingBottom: "3px" }} />
                </Box>
              </CustomTooltip>
              <OrderModal
                open={open}
                setOpen={setOpen}
                headerTitle={headerTitle}
                orderId={props.row.orderUuid}
                subscriptionUuid={props.row.uuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
              />
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
              />
            </TableCell>
          ) : (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
            ></TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case failedPaymentsListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "stage") {
          switch (props.row.stage) {
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Sent"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "ongoing":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="On Going"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "completed":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Completed"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
            case "cancelled":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="center"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus
                    name="Cancelled"
                    translationKey={props.row.translationKey}
                  />
                </TableCell>
              );
          }
        } else if (rdt === "refundResend") {
          return props.row.refundResend === "Resend" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
              </CustomTooltip>
            </TableCell>
          ) : props.row.refundResend === "Refund" &&
            user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("refund")}
                >
                  <UndoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
              </CustomTooltip>
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title="Send Invoice"
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  sx={quickOrderSendInvoiceSX}
                  onClick={() => handleSendInvoiceModalOpen()}
                >
                  <ReceiptLongOutlinedIcon style={{ paddingBottom: "3px" }} />
                </Box>
              </CustomTooltip>
              <SendInvoiceModal
                editOpen={editOpen}
                setEditOpen={setEditOpen}
                customerInfo={props.row}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              {/*<OverviewStatus name="Invoiced" />*/}
            </TableCell>
          );
        } else if (rdt === "cancel") {
          return props.row.isCancel && user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title="Cancel Order"
                TransitionComponent={Zoom}
                placement="bottom-start"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F7F7F7" }}
                  sx={cancelBoxSX}
                  onClick={() => handleModalOpen("cancel")}
                >
                  <CancelIcon style={{ paddingBottom: "3px" }} />
                </Box>
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
            </TableCell>
          ) : props.row.enableSendInvoice && user.role[0] !== FP_ADMIN ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title={`${props.row.refundResend} Order`}
                TransitionComponent={Zoom}
                placement="bottom"
                enterDelay={300}
              >
                <Box
                  component="span"
                  className="py-8 px-4"
                  // sx={{border: "1px solid #838585", borderRadius: "10px", backgroundColor: "#F2FAFD" }}
                  sx={resendRefundBoxSX}
                  onClick={() => handleModalOpen("resend")}
                >
                  <RedoIcon
                    style={{ paddingBottom: "3px" }}
                    // onClick={() => }
                  />
                </Box>
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
            </TableCell>
          ) : (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
            ></TableCell>
          );
        } else {
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="left"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
    case payoutReportsListOverview:
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <OverviewStatus
                name="Active"
                translationKey={props.row.translationKey || "active"}
              />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <OverviewStatus
                name="Inactive"
                translationKey={props.row.translationKey || "inactive"}
              />
            </TableCell>
          );
        } else {
          return (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }
      });
  }
}
