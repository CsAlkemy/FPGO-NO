import * as React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useDispatch, useSelector } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Box, Button, Hidden, IconButton, Menu, MenuItem } from "@mui/material";
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
  reservationListOverview,
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
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ClientService from "../../../data-access/services/clientsService/ClientService";

export default function OverviewFloatingButtons(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);
  const [exportTableData, setExportTableData] = useState([]);

  useEffect(() => {
    OrdersService.exportOrderList(
      user.role[0] === FP_ADMIN
        ? FP_ADMIN
        : user?.user_data?.organization?.uuid
        ? user?.user_data?.organization?.uuid
        : false
    )
      .then((response) => {
        setExportTableData(response);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
  }, [loading]);

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
      case reservationListOverview:
        navigate(`/create-reservations`);
        break;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleImport = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const header = [
    "Ordrenr",
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

  const handleExport = () => {
    if (props.tableRef === ordersListOverview) {
      // downloadExcel({
      //   fileName: user.user_data.organization.name + "_Order List",
      //   sheet: "order list",
      //   tablePayload: {
      //     header,
      //     body: exportTableData,
      //   },
      // });
      let wb = utils.book_new(),
        ws = utils.json_to_sheet(exportTableData);
      utils.book_append_sheet(wb, ws, "order list");
      writeFile(wb, `${user.user_data.organization.name}_Order List.xlsx`);
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="fixed bottom-0 flex justify-center items-center gap-20 w-full mb-20">
      {/*<Button*/}
      {/*  color="secondary"*/}
      {/*  variant="contained"*/}
      {/*  className="rounded-full bg-primary-500 button2"*/}
      {/*>*/}
      {/*  Create Customer*/}
      {/*</Button>*/}
      {/*<Select*/}
      {/*  sx={{ height: 36, minWidth: 150, backgroundColor: '#0088AE', color: 'white' }}*/}
      {/*  defaultValue="Private"*/}
      {/*  displayEmpty*/}
      {/*  className="rounded-full button2 text-white"*/}
      {/*  renderValue={(value) => {*/}
      {/*    return (*/}
      {/*      <Box*/}
      {/*        sx={{ display: "flex", gap: 1 }}*/}
      {/*        className="flex justify-start items-start"*/}
      {/*      >*/}
      {/*        <div className="my-auto">{value}</div>*/}
      {/*      </Box>*/}
      {/*    );*/}
      {/*  }}*/}
      {/*>*/}
      {/*  <MenuItem value={'Private'}>Private</MenuItem>*/}
      {/*  <MenuItem value={'Corporate'}>Corporate</MenuItem>*/}
      {/*</Select>*/}
      {[ordersListOverview, clientsListOverview].includes(props.tableRef) && (
        <div className="button2">
          <Button
            color="secondary"
            variant="outlined"
            aria-haspopup="true"
            onClick={() => handleExport()}
            // className="rounded-md button2 flex-nowrap"
            className="bg-white text-MonochromeGray-700 button2 shadow-1 "
            // disabled={user.role[0] === FP_ADMIN}
            disabled={!exportTableData}
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
            className="rounded-full button2 text-white"
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
              <AddIcon /> {t("label:privateCustomer")}
            </MenuItem>
            <MenuItem onClick={() => navigate(`/customers/corporate`)}>
              <AddIcon />
              {t("label:corporateCustomer")}
            </MenuItem>
          </Menu>
        </div>
      ) : props.tableRef === customerOrdersListOverview ? (
        ""
      ) : props.tableRef === creditChecksListOverview ? (
        <div>
          <Button
            color="secondary"
            variant="contained"
            className="rounded-full button2 text-white"
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
            <MenuItem onClick={() => navigate(`/credit-check/private-client`)}>
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
              className="rounded-full button2 text-white"
              disabled={
                ((props.tableRef === userListOverview ||
                  props.tableRef === fpAdminUsersOverview ||
                  props.tableRef === businessAdminUsersOverview) &&
                  user.role[0] === GENERAL_USER) ||
                ((props.tableRef === ordersListOverview ||
                  props.tableRef === productsListOverview ||
                  props.tableRef === categoriesListOverview) &&
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
      <IconButton
        color="secondary"
        className="bg-primary-50 custom-button-shadow focus:bg-blue-200"
        onClick={scrollToTop}
      >
        <KeyboardArrowUpIcon />
      </IconButton>
    </div>
    // <div className="grid grid-cols-1 md:grid-cols-6 py-12 px-20">
    //   <Typography className="flex header6 col-span-3 my-14 md:my-0">
    //     {props.headerSubtitle}
    //   </Typography>
    //   <div className="flex flex-1 items-center justify-between md:justify-end w-full  col-span-3 gap-10">
    //     <Paper
    //       className="flex items-center px-16 space-x-8  rounded-md border-1 shadow-0"
    //       sx={{ width: 300 }}
    //     >
    //       <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
    //       <InputBase
    //         sx={{ ml: 1, flex: 1 }}
    //         placeholder={t("label:searchByNameEmailPhoneNo")}
    //         inputProps={{ "aria-label": "search google maps" }}
    //         onChange={(ev) => dispatch(setSearchText(ev.target.value))}
    //       />
    //     </Paper>
    //     {props.tableRef === ordersListOverview && (
    //       <div className="button2">
    //         <Button
    //           color="secondary"
    //           variant="outlined"
    //           aria-haspopup="true"
    //           onClick={() => handleExport()}
    //           className="rounded-md button2 flex-nowrap"
    //           // disabled={user.role[0] === FP_ADMIN}
    //           disabled={!exportTableData}
    //         >
    //           {t("label:export")}
    //         </Button>
    //       </div>
    //     )}
    //     {props.tableRef === customersListOverview ? (
    //       <div>
    //         <Button
    //           color="secondary"
    //           variant="contained"
    //           className="rounded-md button2"
    //           id="basic-button"
    //           aria-controls={open ? "basic-menu" : undefined}
    //           aria-haspopup="true"
    //           aria-expanded={open ? "true" : undefined}
    //           onClick={handleClick}
    //           endIcon={<KeyboardArrowDownIcon />}
    //           disabled={user.role[0] === FP_ADMIN}
    //         >
    //           {props.headerButtonLabel}
    //         </Button>
    //         <Menu
    //           id="basic-menu"
    //           anchorEl={anchorEl}
    //           open={open}
    //           onClose={handleClose}
    //           MenuListProps={{
    //             "aria-labelledby": "basic-button",
    //           }}
    //           className="px-16"
    //         >
    //           <MenuItem onClick={() => navigate(`/customers/private`)}>
    //             <AddIcon /> {t("label:privateCustomer")}
    //           </MenuItem>
    //           <MenuItem onClick={() => navigate(`/customers/corporate`)}>
    //             <AddIcon />
    //             {t("label:corporateCustomer")}
    //           </MenuItem>
    //         </Menu>
    //       </div>
    //     ) : props.tableRef === creditChecksListOverview ? (
    //       <div>
    //         <Button
    //           color="secondary"
    //           variant="contained"
    //           className="rounded-md"
    //           id="basic-button"
    //           aria-controls={open ? "basic-menu" : undefined}
    //           aria-haspopup="true"
    //           aria-expanded={open ? "true" : undefined}
    //           onClick={handleClick}
    //           endIcon={<KeyboardArrowDownIcon />}
    //           disabled={user.role[0] === FP_ADMIN}
    //         >
    //           {props.headerButtonLabel}
    //         </Button>
    //         <Menu
    //           id="basic-menu"
    //           anchorEl={anchorEl}
    //           open={open}
    //           onClose={handleClose}
    //           MenuListProps={{
    //             "aria-labelledby": "basic-button",
    //           }}
    //           className="px-16"
    //         >
    //           <MenuItem
    //             onClick={() => navigate(`/credit-check/corporate-client`)}
    //           >
    //             {t("label:forCorporateClient")}
    //           </MenuItem>
    //           <MenuItem
    //             onClick={() => navigate(`/credit-check/private-client`)}
    //           >
    //             {t("label:forPrivateClient")}
    //           </MenuItem>
    //         </Menu>
    //       </div>
    //     ) : (
    //       <div>
    //         <Button
    //           color="secondary"
    //           variant="contained"
    //           aria-haspopup="true"
    //           onClick={handleClick}
    //           className="rounded-md button2 flex-nowrap"
    //           disabled={
    //             ((props.tableRef === userListOverview ||
    //               props.tableRef === fpAdminUsersOverview ||
    //               props.tableRef === businessAdminUsersOverview) &&
    //               user.role[0] === GENERAL_USER) ||
    //             ((props.tableRef === ordersListOverview ||
    //               props.tableRef === productsListOverview ||
    //               props.tableRef === categoriesListOverview) &&
    //               user.role[0] === FP_ADMIN) ||
    //             (props.tableRef === clientsListOverview &&
    //               user.role[0] !== FP_ADMIN)
    //           }
    //         >
    //           {props.headerButtonLabel}
    //         </Button>
    //       </div>
    // {/*    )}*/}
    // {/*  </div>*/}
    // {/*</div>*/}
  );
}
