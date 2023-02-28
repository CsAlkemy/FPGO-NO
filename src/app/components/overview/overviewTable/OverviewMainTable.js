import FuseUtils from "@fuse/utils";
import _ from "@lodash";
import { Hidden, MenuItem, Select, TablePagination } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { selectSearchText } from "app/store/overview-table/overviewTableDataSearchTextSlice";
import { selectUser } from "app/store/userSlice";
import { useSnackbar } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../../../../styles/colors.css";
import OrdersService from "../../../data-access/services/ordersService/OrdersService";
import UserService from "../../../data-access/services/userService/UserService";
import OverviewHeader from "../overviewHeader/overviewHeader";
import OverViewMainTableBody from "./OverViewMainTableBody";
import OverViewResponsiveBody from "./OverViewResponsiveBody";
import OverviewTableHeader from "./OverviewTableHeader";
import TableLoader from "./skeleton-loader/TableLoader";
import {
  approvalListOverviewFPAdmin,
  businessAdminUsersOverview,
  categoriesListOverview,
  clientAdminOverview,
  clientOrdersListOverview,
  clientsListOverview,
  creditChecksListOverview,
  customerOrdersListOverview,
  customersListOverview,
  fpAdminUsersOverview,
  ordersListOverview,
  organizationWiseUsersOverview,
  productsListOverview,
  refundRequestsOverview,
  subClientAdminOverview,
  userListOverview,
} from "./TablesName";
import OverviewFloatingButtons from "../overviewFloatingButtons/OverviewFloatingButtons";
import UtilsService from '../../../utils/UtilsService';

export default function OverviewMainTable(props) {
  const { t } = useTranslation();
  const [value, setValue] = React.useState(0);
  const [page, setPage] = useState(
    localStorage.getItem("pageNo") &&
      localStorage.getItem("tableName") &&
      localStorage.getItem("tableName") === props.tableName
      ? parseInt(localStorage.getItem("pageNo"))
      : 0
  );
  // const pageNumCount = (tableName)=> {
  //   console.log("tableName :",tableName);
  //   return 2;
  // }
  // const [page, setPage] = useState(pageNumCount(props.tableName));
  const [data, setData] = useState(
    props.tableName === refundRequestsOverview
      ? props.tableData.filter(
          (row) => row.stage.toLowerCase() === "refund pending"
        )
      : props.tableData
  );
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filteredData, setFilteredData] = useState([]);
  const [item, setItems] = useState(0);
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { enqueueSnackbar } = useSnackbar();
  const searchText = useSelector(selectSearchText);
  const [refundRequestCount, setRefundRequestCount] = useState(
    localStorage.getItem("refundRequestCount")
  );

  // useEffect(() => {
  //     setData(props.tableData);
  // }, [props.isLoading]);
  useEffect(() => {
    if (searchText.length !== 0) {
      setData(
        FuseUtils.filterArrayByString(
          props.tableName === refundRequestsOverview
            ? filteredData
            : props.tableData,
          searchText
        )
      );
    } else {
      setData(
        props.tableName === refundRequestsOverview && !filteredData.length
          ? props.tableData.filter(
              (row) => row.stage.toLowerCase() === "refund pending"
            )
          : refundRequestsOverview && !!filteredData.length
          ? filteredData
          : props.tableData
      );
    }
  }, [props.isLoading, searchText]);
  const [sortOrder, setSortOrder] = useState({
    direction: "asc",
    id: null,
  });

  const handleTestTableTabPanelsData = (event, newValue) => {
    newValue === 0
      ? setData(props.tableData)
      : newValue === 1
      ? setData(props.tableData.filter((row) => row.status === "Active"))
      : setData(props.tableData.filter((row) => row.status === "Inactive"));
  };

  const handleApprovalListTableTabPanelsData = (event, newValue) => {
    newValue === 0
      ? setData(props.tableData)
      : newValue === 1
      ? setData(
          props.tableData.filter(
            (row) => {
              const preparedDate = new Date(UtilsService.prepareDate(row.reqOn));
              return preparedDate.getDate() === new Date().getDate()
            }
          )
        )
      : newValue === 2
      ? setData(
          props.tableData.filter((row) => {
            let date = new Date();
            let day = new Date(row.reqOn).getDay();
            const preparedDate = new Date(UtilsService.prepareDate(row.reqOn));
            switch (new Date().getDay()) {
              case 0:
                return (
                  preparedDate.getDate() === new Date().getDate()
                );
              case 1:
                date.setDate(date.getDate() - 1);
                return (
                  preparedDate.getDate() <=
                    new Date().getDate() &&
                  preparedDate.getDate() >=
                    date.getDate()
                );
              case 2:
                date.setDate(date.getDate() - 2);
                return (
                  preparedDate.getDate() <=
                  date.getDate() &&
                  preparedDate.getDate() >=
                  date.getDate()
                );
              case 3:
                date.setDate(date.getDate() - 3);
                return (
                  preparedDate.getDate() <=
                  date.getDate() &&
                  preparedDate.getDate() >=
                  date.getDate()
                );
              case 4:
                date.setDate(date.getDate() - 4);
                return (
                  preparedDate.getDate() <=
                  date.getDate() &&
                  preparedDate.getDate() >=
                  date.getDate()
                );
              case 5:
                date.setDate(date.getDate() - 5);
                return (
                  preparedDate.getDate() <=
                  date.getDate() &&
                  preparedDate.getDate() >=
                  date.getDate()
                );
              case 6:
                date.setDate(date.getDate() - 6);
                return (
                  preparedDate.getDate() <=
                  date.getDate() &&
                  preparedDate.getDate() >=
                  date.getDate()
                );
            }
          })
        )
      : setData(
          props.tableData.filter(
            (row) =>{
              const preparedDate = new Date(UtilsService.prepareDate(row.reqOn));
              return preparedDate.getMonth() ===
              new Date().getMonth()
            }
          )
        );
  };

  const clientsListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        // setData(props.tableData.filter((row) => row.role === "client"));
        setData(props.tableData.filter((row) => row.status === "Active"));
        break;
      case 2:
        // setData(props.tableData.filter((row) => row.role === "sub-client"));
        setData(props.tableData.filter((row) => row.status === "Inactive"));
        break;
      // case 3:
      //   setData(props.tableData.filter((row) => row.status === "Active"));
      //   break;
      // case 4:
      //   setData(props.tableData.filter((row) => row.status === "Inactive"));
      //   break;
    }
  };

  const clientOrdersListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(
          props.tableData.filter((row) => row.status.toLowerCase() === "sent")
        );
        break;
      case 2:
        setData(
          props.tableData.filter((row) => row.status.toLowerCase() === "paid")
        );
        break;
      case 3:
        setData(
          props.tableData.filter(
            (row) => row.status.toLowerCase() === "invoiced"
          )
        );
        break;
      case 4:
        setData(
          props.tableData.filter(
            (row) => row.status.toLowerCase() === "expired"
          )
        );
        break;
    }
  };

  const productsListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(props.tableData.filter((row) => row.status === "Active"));
        break;
      case 2:
        setData(props.tableData.filter((row) => row.status === "Inactive"));
        break;
    }
  };

  const categoriesListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
    }
  };

  const customersListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(props.tableData.filter((row) => row.type === "Corporate"));
        break;
      case 2:
        setData(props.tableData.filter((row) => row.type === "Private"));
        break;
      case 3:
        setData(props.tableData.filter((row) => row.status === "Active"));
        break;
      case 4:
        setData(props.tableData.filter((row) => row.status === "Inactive"));
        break;
    }
  };

  const customerOrdersListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(props.tableData.filter((row) => row.stage === "sent"));
        break;
      case 2:
        setData(props.tableData.filter((row) => row.stage === "paid"));
        break;
      case 3:
        setData(props.tableData.filter((row) => row.stage === "invoiced"));
        break;
      case 4:
        setData(props.tableData.filter((row) => row.stage === "expired"));
        break;
    }
  };

  const creditChecksListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(props.tableData.filter((row) => row.type === "Private"));
        break;
      case 2:
        setData(props.tableData.filter((row) => row.type === "Corporate"));
        break;
    }
  };

  const fpAdminUsersListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(props.tableData.filter((row) => row.status === "Active"));
        break;
      case 2:
        setData(props.tableData.filter((row) => row.status === "Inactive"));
        break;
    }
  };

  const organizationWiseUsersListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(props.tableData.filter((row) => row.status === "Active"));
        break;
      case 2:
        setData(props.tableData.filter((row) => row.status === "Inactive"));
        break;
    }
  };

  const ordersListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(props.tableData);
        break;
      case 1:
        setData(
          props.tableData.filter((row) => row.stage.toLowerCase() === "sent")
        );
        break;
      case 2:
        setData(
          props.tableData.filter((row) => row.stage.toLowerCase() === "paid")
        );
        break;
      case 3:
        setData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "invoiced"
          )
        );
        break;
      case 4:
        setData(
          props.tableData
            .map((data) => {
              const dueDate = data.dueDate;
              const splitedTimeAndDate = dueDate.split(", ");
              const splitedDates = splitedTimeAndDate[1].split(".");
              const formatedDate = `${splitedTimeAndDate[0]} ${splitedDates[1]}.${splitedDates[0]}.${splitedDates[2]}`;
              const dueDateTimeStamp = new Date(formatedDate).getTime();
              const currentTimeStamp = new Date().getTime();
              const isExpired = dueDateTimeStamp < currentTimeStamp;
              const statusChanged = data?.status
                ? isExpired
                  ? "expired"
                  : data.status.toLowerCase()
                : null;
              return { ...data, status: statusChanged };
            })
            .filter((row) => row.stage.toLowerCase() === "expired")
        );
        break;
    }
  };

  const refundRequestsListTableTabPanelsData = (event, newValue) => {
    switch (newValue) {
      case 0:
        setData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "refund pending"
          )
        );
        setFilteredData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "refund pending"
          )
        );
        break;
      case 1:
        setData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "accepted"
          )
        );
        setFilteredData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "accepted"
          )
        );
        break;
      case 2:
        setData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "rejected"
          )
        );
        setFilteredData(
          props.tableData.filter(
            (row) => row.stage.toLowerCase() === "rejected"
          )
        );
        break;
      case 3:
        setData(props.tableData);
        setFilteredData(props.tableData);
        break;
    }
  };

  const handleTabChange = (event, newValue) => {
    setPage(0);
    switch (props.tableName) {
      // case "test" for DEV test Purpose
      case "test":
        handleTestTableTabPanelsData(event, newValue);
        break;
      case userListOverview:
        handleTestTableTabPanelsData(event, newValue);
        break;
      case clientAdminOverview:
        handleTestTableTabPanelsData(event, newValue);
        break;
      case subClientAdminOverview:
        handleTestTableTabPanelsData(event, newValue);
        break;
      case approvalListOverviewFPAdmin:
        handleApprovalListTableTabPanelsData(event, newValue);
        break;
      case clientsListOverview:
        clientsListTableTabPanelsData(event, newValue);
        break;
      case clientOrdersListOverview:
        clientOrdersListTableTabPanelsData(event, newValue);
        break;
      case productsListOverview:
        productsListTableTabPanelsData(event, newValue);
        break;
      case categoriesListOverview:
        categoriesListTableTabPanelsData(event, newValue);
        break;
      case customersListOverview:
        customersListTableTabPanelsData(event, newValue);
        break;
      case customerOrdersListOverview:
        customerOrdersListTableTabPanelsData(event, newValue);
        break;
      case creditChecksListOverview:
        creditChecksListTableTabPanelsData(event, newValue);
        break;
      case fpAdminUsersOverview:
        fpAdminUsersListTableTabPanelsData(event, newValue);
        break;
      case organizationWiseUsersOverview:
        organizationWiseUsersListTableTabPanelsData(event, newValue);
        break;
      case ordersListOverview:
        ordersListTableTabPanelsData(event, newValue);
        break;
      case refundRequestsOverview:
        refundRequestsListTableTabPanelsData(event, newValue);
        break;
    }
    setValue(newValue);
  };

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box>{children}</Box>}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  };

  const handleChangePage = (event, value) => {
    setPage(value);
    localStorage.setItem("pageNo", `${value}`);
  };

  const handleRequestSort = (event, property) => {
    const id = property;
    let direction = "desc";

    if (sortOrder.id === property && sortOrder.direction === "desc") {
      direction = "asc";
    }

    setSortOrder({
      direction,
      id,
    });
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const handleTableRowClick = (info) => {
    localStorage.setItem("tableName", `${props.tableName}`);
    switch (props.tableName) {
      case approvalListOverviewFPAdmin:
        // let companyName = info.nameOrgId.split("(")[0];
        // let orgId = info.nameOrgId.split("(")[1].split(")")[0];
        // let name = info.primaryContact.split("(")[0];
        // let designation = info.primaryContact.split("(")[1].split(")")[0];
        // let phone = info.phone.slice(4);
        // ClientService.clientDetails(info.uuid)
        //   .then((res) => {
        // const tableRowDetails = {
        //   orgId: res.data.organizationDetails.id,
        //   clientName: res.data.organizationDetails.name,
        //   orgType: res.data.organizationDetails?.type,
        //   fullName: res.data.,
        //   phone: info.phone,
        //   designation: designation,
        //   email: info.email,
        //   uuid: res.data["primaryContactDetails"].uuid,
        //   tableRef: approvalListOverviewFPAdmin,
        // };
        // localStorage.setItem(
        //   "tableRowDetails",
        //   JSON.stringify(tableRowDetails)
        // );
        // localStorage.setItem("tableRowDetails", JSON.stringify(res.data));
        navigate(`/client-management/onbroading/${info.organizationUuid}`);
        // })
        // .catch((error) => {
        //   enqueueSnackbar(error, { variant: "error" });
        // });
        break;
      case clientsListOverview:
        // ClientService.clientDetails(info.uuid)
        //   .then((res) => {
        //     localStorage.setItem("tableRowDetails", JSON.stringify(res.data));
        navigate(`/client-management/details/${info.uuid}`);
        //   })
        //   .catch((error) => {
        //     enqueueSnackbar(error, { variant: "error" });
        //   });
        break;
      case clientOrdersListOverview:
        navigate(`/create-order/details/${info.uuid}`);
        break;
      case userListOverview:
        navigate(`/user-management/user-profile`, {
          state: {
            userId: info.uuid,
          },
        });
        break;
      case customersListOverview:
        info.type === "Corporate"
          ? navigate(`/customers/corporate/details/${info.uuid}`)
          : navigate(`/customers/private/details/${info.uuid}`);
        break;
      case customerOrdersListOverview:
        navigate(`/create-order/details/${info.uuid}`);
        break;
      case categoriesListOverview:
        navigate(`/category/details/${info.uuid}`);
        break;
      case productsListOverview:
        navigate(`/products/details/${info.uuid}`);
        break;
      case fpAdminUsersOverview:
        navigate(`/user-management/user-profile`, {
          state: {
            userId: info.uuid,
          },
        });
        break;
      case businessAdminUsersOverview:
        navigate(`/users/organization-wise-user-list/${info.uuid}`);
        break;
      case organizationWiseUsersOverview:
        navigate(`/user-management/user-profile`, {
          state: {
            userId: info.uuid,
          },
        });
        break;
      case ordersListOverview:
        navigate(`/create-order/details/${info.uuid}`);
        break;
    }
  };

  return (
    <>
      <Hidden smUp>
        <div className="px-28">
          <OverviewHeader
            headerSubtitle={props.headerSubtitle}
            headerButtonLabel={props.headerButtonLabel}
            tableRef={props.tableName}
            tableData={props.tableData}
          />
          <div className="">
            <div>
              <Select
                sx={{ height: 40 }}
                defaultValue={
                  props.tableName === refundRequestsOverview
                    ? t("label:pending")
                    : t("label:all")
                }
                displayEmpty
                className="w-full min-h-auto"
                renderValue={(value) => {
                  return (
                    <Box
                      sx={{ display: "flex", gap: 1 }}
                      className="flex justify-start items-center mt-4"
                    >
                      <div className="my-auto">{value}</div>
                    </Box>
                  );
                }}
              >
                {props.tabPanelsLabel.map((option, index) => (
                  <MenuItem
                    key={index}
                    value={option}
                    onClick={() => handleTabChange(null, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>
          <div className="my-20 grid grid-cols-2 gap-10 justify-between items-center">
            <div className="subtitle3 text-MonochromeGray-500">
              {props.tableData.length} {t("label:resultsFound")}
            </div>
            <div>
              <Select
                sx={{ height: 40 }}
                defaultValue={t("label:sort")}
                displayEmpty
                className="w-full min-h-auto"
                renderValue={(value) => {
                  return (
                    <Box
                      sx={{ display: "flex", gap: 1 }}
                      className="flex justify-start items-center mt-4"
                    >
                      <div className="my-auto">{value}</div>
                    </Box>
                  );
                }}
              >
                {/*<MenuItem*/}
                {/*  key={"notSelected"}*/}
                {/*  value={"notSelected"}*/}
                {/*  // onClick={() => handleRequestSort(null, option.id)}*/}
                {/*>*/}
                {/*  Select a option to sort*/}
                {/*</MenuItem>*/}
                {props.headerRows
                  .filter(
                    (headerRow) =>
                      headerRow.id !== "refundResend" &&
                      headerRow.id !== "cancel"
                  )
                  .map((option) => (
                    <MenuItem
                      key={option.id}
                      value={option.label}
                      onClick={() => handleRequestSort(null, option.id)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
              </Select>
            </div>
          </div>
          {/*Table Body*/}
          <div className="pb-64 md:pb-auto">
            {data.length ? (
              <div>
                {_.orderBy(data, [sortOrder?.id], [sortOrder.direction])
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <div
                      className="p-20 rounded-8 bg-white custom-overview-shadow border-1 border-MonochromeGray-50 my-12"
                      key={`${row.uuid}`}
                      onClick={() => {
                        if (
                          props.tableName !== ordersListOverview &&
                          props.tableName !== customerOrdersListOverview
                        )
                          handleTableRowClick(row);
                      }}
                    >
                      <div className="flex flex-col gap-10">
                        <OverViewResponsiveBody
                          tableName={props.tableName}
                          row={row}
                          rowDataFields={props.rowDataFields}
                          headerRows={props.headerRows}
                          rowClickAction={handleTableRowClick}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <Typography>Data Not Found</Typography>
            )}
          </div>
        </div>
        <Hidden mdUp>
          <OverviewFloatingButtons
            headerSubtitle={props.headerSubtitle}
            headerButtonLabel={props.headerButtonLabel}
            tableRef={props.tableName}
            tableData={props.tableData}
          />
        </Hidden>
      </Hidden>
      <Hidden smDown>
        <Box sx={{ width: "100%" }}>
          <OverviewHeader
            headerSubtitle={props.headerSubtitle}
            headerButtonLabel={props.headerButtonLabel}
            tableRef={props.tableName}
            changeDate={props.changeDate ? props.changeDate : null}
            selectedDate={props.selectedDate ? props.selectedDate : null}
            setSelectedDate={
              props.setSelectedDate ? props.setSelectedDate : null
            }
          />
          <Box
            sx={{
              backgroundColor: "#F2FAFD",
            }}
            className="mx-20"
          >
            <div className="flex justify-between">
              <Tabs
                value={value}
                onChange={handleTabChange}
                aria-label="basic tabs example"
                TabIndicatorProps={{
                  style: { background: "#33A0BE", height: "4px" },
                }}
              >
                {props.tabPanelsLabel.map((tab) => (
                  <Tab
                    className="body3"
                    key={tab}
                    label={tab}
                    {...a11yProps(tab)}
                  />
                ))}
              </Tabs>
              <TablePagination
                className="shrink-0"
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                backIconButtonProps={{
                  "aria-label": "Previous Page",
                }}
                nextIconButtonProps={{
                  "aria-label": "Next Page",
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[]}
              />
            </div>
          </Box>
          {props.tabs.map((tab) => (
            <TabPanel value={value} index={tab} key={tab}>
              {props.isLoading ? (
                <TableLoader />
              ) : (
                <TableContainer className="px-20" key={tab}>
                  <Table
                    stickyHeader
                    className="min-w-xl"
                    aria-label="sticky table"
                  >
                    <TableHead>
                      <OverviewTableHeader
                        sortOrder={sortOrder}
                        onRequestSort={handleRequestSort}
                        headerRows={props.headerRows}
                        tableRef={props.tableName}
                      />
                    </TableHead>
                    {data.length ? (
                      <TableBody className="body-3">
                        {_.orderBy(data, [sortOrder?.id], [sortOrder.direction])
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((row) => (
                            <TableRow
                              className="cursor-pointer hover:bg-MonochromeGray-25"
                              key={`${row.uuid}-${tab}`}
                              onClick={() => {
                                if (
                                  props.tableName !== ordersListOverview &&
                                  props.tableName !==
                                    customerOrdersListOverview &&
                                  props.tableName !== refundRequestsOverview
                                )
                                  handleTableRowClick(row);
                              }}
                            >
                              <OverViewMainTableBody
                                tableName={props.tableName}
                                row={row}
                                rowDataFields={props.rowDataFields}
                                rowClickAction={handleTableRowClick}
                                refundRequestCount={refundRequestCount}
                                setRefundRequestCount={setRefundRequestCount}
                                page={page}
                                setPage={setPage}
                              />
                            </TableRow>
                          ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <TableRow>
                          <TableCell
                            colSpan={props.headerRows.length}
                            align="center"
                          >
                            <Typography className="subtitle3">
                              Data Not Found!
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              )}
            </TabPanel>
          ))}
        </Box>
      </Hidden>
    </>
  );
}
