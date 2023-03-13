import React, { useState, useEffect } from "react";
import "../../../../styles/colors.css";
import OverviewMainTable from "../../../components/overview/overviewTable/OverviewMainTable";
import {
  approvalListForFPAdminHeaderRows,
  clientAdminHeaderRows,
  userListOverviewHeaderRows,
  subClientAdminHeaderRows,
} from "../../../components/overview/overviewTable/HeaderRows";
import {
  clientAdminOverview,
  userListOverview,
  subClientAdminOverview,
} from "../../../components/overview/overviewTable/TablesName";
import {
  clientAdminRowDataFields,
  fpAdminRowDataFields,
  subClientAdminRowDataFields,
} from "../../../components/overview/overviewTable/RowDataFields";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import UserService from "../../../data-access/services/userService/UserService";
import {
  selectOverviewMainTableData,
  setOverviewMainTableDataSlice,
} from "app/store/overview-table/overviewTableSlice";
import { useSnackbar } from "notistack";

function createFPAdminData(clientName, orgId, clientType, users, status) {
  return { clientName, orgId, clientType, users, status };
}
function createClientAdminData(name, email, phone, branch, role, status) {
  return { name, email, phone, branch, role, status };
}
function createSubClientAdminData(name, userId, email, phone, role, status) {
  return { name, userId, email, phone, role, status };
}

const fpAdminRows = [
  createFPAdminData("ABB Holding AS", 933123996, "Client", 28, "Active"),
  createFPAdminData(
    "ABB Holding AS (Trondheim)",
    933123997,
    "Sub Client",
    28,
    "Active"
  ),
  createFPAdminData(
    "ABB Holding AS (Stavangar)",
    933123998,
    "Sub Client",
    28,
    "Inactive"
  ),
  createFPAdminData(
    "ABB Holding AS (Oslo)",
    933123999,
    "Sub Client",
    28,
    "Active"
  ),
  createFPAdminData(
    "Alliance Unichem Norge AS",
    933122223,
    "Client",
    23,
    "Active"
  ),
  createFPAdminData(
    "Alliance Unichem Norge AS (Trondheim)",
    933122224,
    "Sub Client",
    23,
    "Active"
  ),
  createFPAdminData(
    "Alliance Unichem Norge AS (Stavangar)",
    933122225,
    "Sub Client",
    23,
    "Active"
  ),
  createFPAdminData(
    "Alliance Unichem Norge AS (Oslo)",
    933123995,
    "Sub Client",
    23,
    "Active"
  ),
  createFPAdminData("ConocoPhillips Norge", 933123254, "Client", 7, "Active"),
  createFPAdminData(
    "ConocoPhillips Norge (Trondheim)",
    933123993,
    "SubClient",
    7,
    "Inactive"
  ),
  createFPAdminData(
    "ConocoPhillips Norge (Stravangar)",
    933123992,
    "Sub Client",
    7,
    "Active"
  ),
  createFPAdminData(
    "ConocoPhillips Norge (Oslo)",
    933123991,
    "Sub Client",
    7,
    "Active"
  ),
];
const clientAdminRows = [
  createClientAdminData(
    "Arve Tellefsen",
    "arve.tellefsen@pmail.com",
    "+47 914 49 565",
    "Oslo",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble1@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "David Isaksen",
    "david.isaksen1@umail.com",
    "+47 914 49 565",
    "Trondheim",
    "Branch Admin",
    "Inactive"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble2@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble3@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble4@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble5@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "David Isaksen",
    "david.isaksen2@umail.com",
    "+47 914 49 565",
    "Oslo",
    "Branch Admin",
    "Inactive"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble7@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble8@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
  createClientAdminData(
    "Chris Grendahl",
    "audamble9@pmail.com",
    "+47 914 49 565",
    "Stavangar",
    "User",
    "Active"
  ),
];
const subClientAdminRows = [
  createSubClientAdminData(
    "Arve Tellefsen",
    "318327079",
    "arve.tellefsen@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458601",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "David Isaksen",
    "487458602",
    "david.isaksen@umail.com",
    "+47 914 49 565",
    "Branch Admin",
    "Inactive"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458603",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458604",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458605",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458606",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "David Isaksen",
    "487458607",
    "david.isaksen@umail.com",
    "+47 914 49 565",
    "Branch Admin",
    "Inactive"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458608",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458609",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458610",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
  createSubClientAdminData(
    "Chris Grendahl",
    "487458611",
    "audamble6@pmail.com",
    "+47 914 49 565",
    "User",
    "Active"
  ),
];

export default function UserOverviewTable(props) {
  const [isLoading, setIsLoading] = useState(true);

  // const [tableData, setTableData] = useState([])
  // Common for FP Admin, Client Admin, Sub Client so far
  const headerButtonLabel = "Create User";
  const tabPanelsLabel = ["All", "Active", "Inactive"];
  const tabs = [0, 1, 2];
  // FP Admin Table Params
  const fpAdminTableData = fpAdminRows;
  const headerSubtitleFPA = "Users (All Clients)";

  // Client Admin Table Params
  const clientAdminTableData = clientAdminRows;
  const headerSubtitleCA = "All Users";
  // Sub Client Admin Table Params
  const subClientAdminTableData = subClientAdminRows;
  const headerSubtitleSCA = "All Users";
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  // const userList = useSelector((state) => state.overviewMainTableData);
  const userList = useSelector(selectOverviewMainTableData);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    UserService.userList()
      .then((res) => {
        if (res?.status_code === 200 && res?.is_data) {
          dispatch(setOverviewMainTableDataSlice(res));
          setIsLoading(false);
        } else {
          setIsLoading(false);
          dispatch(setOverviewMainTableDataSlice([]));
        }
      })
      .catch((e) => {
        enqueueSnackbar(t(`message:${e}`), { variant: "error" });
        setIsLoading(false);
        dispatch(setOverviewMainTableDataSlice([]));
      });
  }, [isLoading]);

  // useEffect(() => {
  //   if (searchText.length !== 0) {
  //     setData(FuseUtils.filterArrayByString(userList, searchText));
  //     setPage(0);
  //   } else {
  //     setData(orders);
  //   }
  // }, [userList, searchText]);

  return (
    <OverviewMainTable
      headerSubtitle={headerSubtitleFPA}
      headerButtonLabel={headerButtonLabel}
      tableName={userListOverview}
      headerRows={userListOverviewHeaderRows}
      // tableData={fpAdminTableData}
      // tableData={userList.tableData}
      tableData={userList}
      rowDataFields={fpAdminRowDataFields}
      tabPanelsLabel={tabPanelsLabel}
      tabs={tabs}
      isLoading={isLoading}
    />
  );
}
