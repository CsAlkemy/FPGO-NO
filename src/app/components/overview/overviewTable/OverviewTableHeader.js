import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableSortLabel from "@mui/material/TableSortLabel";
import Tooltip from "@mui/material/Tooltip";
import { lighten } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Button, Divider } from "@mui/material";
import { useState } from "react";
import {
  clientOrdersListOverview,
  customerOrdersListOverview,
  ordersListOverview,
  refundRequestsOverview,
} from './TablesName';

function OverviewTableHeader(props) {
  const createSortHandler = (property) => (event) => {
    props.onRequestSort(event, property);
  };

  return (
    <TableRow>
      {props.headerRows.map((row) => {
        return (props.tableRef === ordersListOverview ||
          props.tableRef === refundRequestsOverview ||
        props.tableRef === clientOrdersListOverview ||
          props.tableRef === customerOrdersListOverview) &&
          (row.id === "stage" || row.id === "status") ? (
          <TableCell
            className="pl-36"
            key={row.id}
            align={row.align}
            sortDirection={
              props.sortOrder.id === row.id ? props.sortOrder.direction : false
            }
            sx={{ borderBottom: 1, borderColor: "#E9EAEB" }}
          >
            {row.sort && (
              <Tooltip
                title="Sort"
                placement={
                  row.align === "right" ? "bottom-end" : "bottom-start"
                }
                enterDelay={300}
              >
                <TableSortLabel
                  active={props.sortOrder.id === row.id}
                  direction={props.sortOrder.direction}
                  onClick={createSortHandler(row.id)}
                  className="subtitle3"
                >
                  {row.label}
                </TableSortLabel>
              </Tooltip>
            )}
          </TableCell>
        ) : (
          <TableCell
            // className="p-4 md:p-16"
            key={row.id}
            align={row.align}
            sortDirection={
              props.sortOrder.id === row.id ? props.sortOrder.direction : false
            }
            sx={{ borderBottom: 1, borderColor: "#E9EAEB" }}
          >
            {row.sort && (
              <Tooltip
                title="Sort"
                placement={
                  row.align === "right" ? "bottom-end" : "bottom-start"
                }
                enterDelay={300}
              >
                <TableSortLabel
                  active={props.sortOrder.id === row.id}
                  direction={props.sortOrder.direction}
                  onClick={createSortHandler(row.id)}
                  className="subtitle3"
                >
                  {row.label}
                </TableSortLabel>
              </Tooltip>
            )}
          </TableCell>
        );
      }, this)}
    </TableRow>
  );
}

export default OverviewTableHeader;
