import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, Button, Hidden, Menu, MenuItem, TextField } from "@mui/material";
import "../../../../styles/colors.css";
import InputBase from "@mui/material/InputBase";
import {
  approvalListOverviewFPAdmin,
  categoriesListOverview,
  clientsListOverview,
  creditChecksListOverview,
  customersListOverview,
  userListOverview,
  productsListOverview,
  ordersListOverview,
  fpAdminUsersOverview,
  businessAdminUsersOverview,
  organizationWiseUsersOverview,
  customerOrdersListOverview,
  refundRequestsOverview,
  clientOrdersListOverview,
  reservationListOverview, subscriptionsListOverview, payoutReportsListOverview, failedPaymentsListOverview
} from "../overviewTable/TablesName";
import { Link, useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { setSearchText } from "app/store/overview-table/overviewTableDataSearchTextSlice";
import { selectUser } from "app/store/userSlice";
import {
  BRAND_MANAGER,
  FP_ADMIN,
  GENERAL_USER,
  GROUP_MANAGER,
} from "../../../utils/user-roles/UserRoles";
import { useEffect, useState } from "react";
import { downloadExcel } from "react-export-table-to-excel";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import { t } from "i18next";
import Select from "@mui/material/Select";
import { writeFile, utils } from "xlsx";
import { DesktopDatePicker } from "@mui/lab";
import ClientService from "../../../data-access/services/clientsService/ClientService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

export default function OverviewHeader(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    dispatch(setSearchText(""));
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    switch (props.tableRef) {
      case userListOverview:
        navigate(`/user-management/create-user`);
        break;
      case clientsListOverview:
        navigate("/client-management/create-client");
        break;
      case approvalListOverviewFPAdmin:
        navigate("/client-management/create-client");
        break;
      case categoriesListOverview:
        navigate("/categories/create-category");
        break;
      case productsListOverview:
        navigate("/products/create");
        break;
      case fpAdminUsersOverview:
        navigate(`/user-management/create-user`);
        break;
      case businessAdminUsersOverview:
        navigate(`/user-management/create-user`);
        break;
      case organizationWiseUsersOverview:
        navigate(`/user-management/create-user`);
        break;
      case ordersListOverview:
        navigate(`/create-order`);
        break;
      case failedPaymentsListOverview:
        navigate(`/subscription/create`);
        break;
      case reservationListOverview:
        navigate(`/create-reservations`);
        break;
      case subscriptionsListOverview:
        navigate(`/subscription/create`);
        break;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleImport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const header = [
    "Ordrenr",
    "Client ID",
    "Client",
    "InvoiceNumber",
    "Kunde",
    "KundeType",
    "Betalingsmetode",
    "ImportedDate",
    "SMSDate",
    "Bestillingstid",
    "Total",
  ];

  const handleExport = async () => {
    if (props.tableRef === ordersListOverview) {
      OrdersService.exportOrderList(
        user.role[0] === FP_ADMIN
          ? FP_ADMIN
          : user?.user_data?.organization?.uuid
          ? user?.user_data?.organization?.uuid
          : false
      )
        .then((response) => {
          let wb = utils.book_new(),
            ws = utils.json_to_sheet(response);
          utils.book_append_sheet(wb, ws, "order list");
          writeFile(wb, `${user.user_data.organization.name}_Order List.xlsx`);
        })
        .catch((e) => {
          enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        });
    } else if (
      [clientsListOverview, approvalListOverviewFPAdmin].includes(
        props.tableRef
      )
    ) {
      ClientService.exportClientLists()
        .then((response) => {
          let wb = utils.book_new(),
            ws = utils.json_to_sheet(response);
          utils.book_append_sheet(wb, ws, "client list");
          writeFile(wb, `Front Payment AS_Klientliste.xlsx`);
        })
        .catch((e) => {
          enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        });
    }
  };

  const filterBy = [
    {
      value: "All",
      label: "all",
    },
    {
      value: "Private",
      label: "pri",
    },
  ];

  const handleDateChange = (date) => {
    if (date.getMonth() !== new Date(props.selectedDate).getMonth())
      props.changeDate(date);
  };

  const getPlaceHolder = () => {
    switch (props.tableRef) {
      case customerOrdersListOverview:
        return t("label:searchByOrderID");
      case ordersListOverview:
        return t("label:searchByOrderIDNamePhoneNo");
      case customersListOverview:
        return t("label:searchByNameOrgIDPhoneNo");
      case creditChecksListOverview:
        return t("label:searchByNameOrgIDPhoneNo");
      case refundRequestsOverview:
        return t("label:searchByOrderIDNamePhoneNo");
      case clientOrdersListOverview:
        return t("label:searchByOrderIDNamePhoneNo");
      case productsListOverview:
        return t("label:searchByProductNameAndID");
      case categoriesListOverview:
        return t("label:searchByCategoryNameAndID");
      case reservationListOverview:
        return t("label:searchByReservationIDNameOrPhoneNo");
      default:
        return t("label:searchByNameEmailPhoneNo");
    }
  };

  return (
    <>
      <Hidden smUp>
        <div className="py-4">
          {props.tableRef === customerOrdersListOverview ||
          props.tableRef === clientOrdersListOverview ? (
            ""
          ) : (
            <div className="subtitle1 text-MonochromeGray-900 my-14">
              {props.headerSubtitle}
            </div>
          )}
          <div>
            <Paper className="flex items-center px-10 space-x-8  rounded-md border-1 shadow-0 w-full mb-20">
              <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={getPlaceHolder()}
                inputProps={{ "aria-label": "search google maps" }}
                onChange={(ev) => dispatch(setSearchText(ev.target.value))}
              />
            </Paper>
          </div>
        </div>
      </Hidden>
      <Hidden smDown>
        <div className="grid grid-cols-1 md:grid-cols-6 py-12 px-0 sm:px-20">
          {props.tableRef !== clientOrdersListOverview &&
            props.tableRef !== payoutReportsListOverview && (
              <Typography className="flex header6 col-span-2 my-14 md:my-0">
                {props.tableRef === customerOrdersListOverview
                  ? ""
                  : props.headerSubtitle}
              </Typography>
            )}
          {props.tableRef === payoutReportsListOverview && (
            <div className="flex flex-col col-span-2 my-14 md:my-0">
              <Typography className="header6">
                {props.tableRef === customerOrdersListOverview
                  ? ""
                  : props.headerSubtitle}
              </Typography>
              <Typography className="subtitle3" style={{ color: "#838585" }}>
                {t("label:selectAClientToViewPayouts")}
              </Typography>
            </div>
          )}
          {props.tableRef === clientOrdersListOverview && (
            <div className="flex header6 col-span-2 my-14 md:my-0">
              <DesktopDatePicker
                size="small"
                inputFormat="MM.yyyy"
                views={["year", "month"]}
                value={props.selectedDate}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    size="small"
                    {...params}
                    error={false}
                    type="date"
                  />
                )}
                disableFuture
                disabled={props.isLoading}
              />
            </div>
          )}
          <div className="flex flex-1 items-center justify-between md:justify-end w-full  col-span-4 gap-10">
            <Paper
              className="flex items-center px-16 space-x-8  rounded-md border-1 shadow-0"
              sx={{ width: 300 }}
            >
              <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={getPlaceHolder()}
                inputProps={{ "aria-label": "search google maps" }}
                onChange={(ev) => dispatch(setSearchText(ev.target.value))}
              />
            </Paper>
            <div className="flex gap-10">
              {[ordersListOverview, clientsListOverview].includes(
                props.tableRef
              ) && (
                <div className="button2">
                  <Button
                    color="secondary"
                    variant="outlined"
                    aria-haspopup="true"
                    onClick={() => handleExport()}
                    className="rounded-md button2 flex-nowrap"
                  >
                    {t("label:export")}
                  </Button>
                </div>
              )}
              {props.tableRef === customersListOverview ? (
                <div>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="rounded-md button2"
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                    disabled={user.role[0] === FP_ADMIN}
                  >
                    {props.headerButtonLabel}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    className="px-16"
                  >
                    <MenuItem onClick={() => navigate(`/customers/private`)}>
                      <AddIcon className="text-[#68C7E7]" />{" "}
                      {t("label:privateCustomer")}
                    </MenuItem>
                    <MenuItem onClick={() => navigate(`/customers/corporate`)}>
                      <AddIcon className="text-[#50C9B1]" />
                      {t("label:corporateCustomer")}
                    </MenuItem>
                  </Menu>
                </div>
              ) : props.tableRef === customerOrdersListOverview ||
                props.tableRef === clientOrdersListOverview ||
                props.tableRef === payoutReportsListOverview ? (
                ""
              ) : props.tableRef === creditChecksListOverview ? (
                <div>
                  <Button
                    color="secondary"
                    variant="contained"
                    className="rounded-md"
                    id="basic-button"
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDownIcon />}
                    disabled={user.role[0] === FP_ADMIN}
                  >
                    {props.headerButtonLabel}
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      "aria-labelledby": "basic-button",
                    }}
                    className="px-16"
                  >
                    <MenuItem
                      onClick={() => navigate(`/credit-check/corporate-client`)}
                    >
                      {t("label:forCorporateClient")}
                    </MenuItem>
                    <MenuItem
                      onClick={() => navigate(`/credit-check/private-client`)}
                    >
                      {t("label:forPrivateClient")}
                    </MenuItem>
                  </Menu>
                </div>
              ) : (
                props.tableRef !== refundRequestsOverview && (
                  <div>
                    <Button
                      color="secondary"
                      variant="contained"
                      aria-haspopup="true"
                      onClick={handleClick}
                      className="rounded-md button2 flex-nowrap"
                      disabled={
                        ((props.tableRef === userListOverview ||
                          props.tableRef === fpAdminUsersOverview ||
                          props.tableRef === businessAdminUsersOverview) &&
                          user.role[0] === GENERAL_USER) ||
                        ((props.tableRef === ordersListOverview ||
                          props.tableRef === productsListOverview ||
                          props.tableRef === categoriesListOverview ||
                          props.tableRef === subscriptionsListOverview ||
                          props.tableRef === failedPaymentsListOverview) &&
                          user.role[0] === FP_ADMIN) ||
                        (props.tableRef === clientsListOverview &&
                          user.role[0] !== FP_ADMIN)
                      }
                    >
                      {props.headerButtonLabel}
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </Hidden>
    </>
  );
}
