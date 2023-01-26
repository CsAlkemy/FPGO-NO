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
  ordersListOverview, customerOrdersListOverview, refundRequestsOverview,
} from './TablesName';
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
import { DoneAll, UTurnLeft } from '@mui/icons-material';
import { defaultValueCreateClient } from '../../clientManagement/utils/helper';
import DiscardConfirmModal from '../../common/confirmDiscard';
import { useTranslation } from 'react-i18next';

export default function OverViewMainTableBody(props) {
  const { t } = useTranslation()
  const [openHigh, setOpenHigh] = useState(false);
  const [openModerate, setOpenModerate] = useState(false);
  const [openLow, setOpenLow] = useState(false);
  const [open, setOpen] = useState(false);
  const [openApprove, setOpenApprove] = useState(false);
  const [headerTitle, setHeaderTitle] = useState();
  const user = useSelector(selectUser);

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
    if (!(localStorage.getItem("refundRequestCount"))) localStorage.setItem("refundRequestCount", "0")
    setOpen(true);
    if (decision === "cancel") setHeaderTitle("Cancel Order");
    if (decision === "resend") setHeaderTitle("Resend Order");
    if (decision === "refund" && !(localStorage.getItem("refundRequestCount") >=3)) setHeaderTitle("Send Refund")
    if (decision === "refund" && localStorage.getItem("refundRequestCount") >=3) setHeaderTitle("moreThanThreeRefundAttempts")
    if (decision === "reject") setHeaderTitle("Reject Request");
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
      return props.rowDataFields.map((rdt) => {
        if (rdt === "status") {
          return props.row.status === "Active" ? (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus name="Active" />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus name="Inactive" />
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
        return (
          <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
            {props.row ? props.row[rdt] : <Skeleton variant="text" />}
          </TableCell>
        );
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
              <OverviewStatus name="Active" />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus name="Inactive" />
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
                  <LocationCityIcon className="mr-12 text-[#50C9B1]"/>
                  {props.row[rdt]}
                </TableCell>
              ) : (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <PersonIcon className="mr-12 text-[#68C7E7]"/>
                  {props.row[rdt]}
                </TableCell>
              );
            } else {
              return props.row.type === "Corporate" ? (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <LocationCityIcon
                    className="mr-12"
                    style={{ color: "#C6C7C7" }}
                  />
                  {props.row[rdt]}
                </TableCell>
              ) : (
                <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
                  <PersonIcon className="mr-12" style={{ color: "#C6C7C7" }} />
                  {props.row[rdt]}
                </TableCell>
              );
            }
          case "lastOrderAmount":
            return (
              <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
                {props.row ? props.row[rdt] : <Skeleton variant="text" />}
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
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Paid" />
                </TableCell>
              )
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Sent" />
                </TableCell>
              )
            case "expired":
              return (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Expired" />
                  </TableCell>
                )
              )
            case "invoiced":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Invoiced" />
                </TableCell>
              )
            case "cancelled":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Cancelled" />
                  </TableCell>
                )
              )
            case "refunded":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Refunded" />
                  </TableCell>
                )
              )
            case "partial refunded":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Partial Refunded" />
                  </TableCell>
                )
              )
            case "completed":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Completed" />
                  </TableCell>
                )
              )
            case "reminder sent":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Reminder Sent" />
                  </TableCell>
                )
              )
            case "sent to debt collection":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Debt Collection" />
                  </TableCell>
                )
              )
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
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
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
                orderId={props.row.uuid}
                orderName={props.row.name}
                orderAmount={props.row.amount}
                customerPhone={props.row.phone}
                customerEmail={props.row.email}
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
              <PersonIcon className="mr-12" color="secondary" />
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="left">
              <LocationCityIcon className="mr-12" color="secondary" />
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
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
              <OverviewStatus name="Active" />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus name="Inactive" />
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
              <OverviewStatus name="Active" />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus name="Inactive" />
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
              <OverviewStatus name="Active" />
            </TableCell>
          ) : (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <OverviewStatus name="Inactive" />
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
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Paid" />
                </TableCell>
              )
            case "sent":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Sent" />
                </TableCell>
              )
            case "expired":
              return (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Expired" />
                  </TableCell>
                )
              )
            case "invoiced":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Invoiced" />
                </TableCell>
              )
            case "cancelled":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Cancelled" />
                  </TableCell>
                )
              )
            case "refunded":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Refunded" />
                  </TableCell>
                )
              )
            case "partial refunded":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Partial Refunded" />
                  </TableCell>
                )
              )
            case "completed":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Completed" />
                  </TableCell>
                )
              )
            case "reminder sent":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Reminder Sent" />
                  </TableCell>
                )
              )
            case "sent to debt collection":
              return  (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Debt Collection" />
                  </TableCell>
                )
              )
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
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
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
            case "pending":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Pending" />
                </TableCell>
              )
            case "accepted":
              return (
                <TableCell
                  key={`${props.row.uuid}-${rdt}`}
                  align="right"
                  onClick={() => {
                    props.rowClickAction(props.row);
                  }}
                >
                  <OverviewStatus name="Accepted" />
                </TableCell>
              )
            case "rejected":
              return (
                (
                  <TableCell
                    key={`${props.row.uuid}-${rdt}`}
                    align="right"
                    onClick={() => {
                      props.rowClickAction(props.row);
                    }}
                  >
                    <OverviewStatus name="Rejected" />
                  </TableCell>
                )
              )
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
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        } else if (rdt === "approveAction") {
          return props.row.approveAction === "pending" ? (
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
          return props.row.isCancel && (
            <TableCell key={`${props.row.uuid}-${rdt}`} align="right">
              <CustomTooltip
                disableFocusListener
                title="Reject Request"
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
        // : (
        //     <TableCell
        //       key={`${props.row.uuid}-${rdt}`}
        //       align="right"
        //     ></TableCell>
        //   );
        } else if (rdt === "orderAmount" || rdt === "refundAmount"){
          return (
            <TableCell
              key={`${props.row.uuid}-${rdt}`}
              align="right"
              onClick={() => {
                props.rowClickAction(props.row);
              }}
            >
              {props.row ? props.row[rdt] : <Skeleton variant="text" />}
            </TableCell>
          );
        }else {
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
  }
}
