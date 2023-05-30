import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import OverviewTableHeader from "../../overview/overviewTable/OverviewTableHeader";
import TableBody from "@mui/material/TableBody";
import _ from "@lodash";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import { useState } from "react";
import { CircularProgress, Link, TablePagination } from "@mui/material";
import { useTranslation } from "react-i18next";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import Zoom from "@mui/material/Zoom";
import Box from "@mui/material/Box";
import RedoIcon from "@mui/icons-material/Redo";
import { withStyles } from "@mui/styles";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import ReportService from "../../../data-access/services/reportService/ReportService";

export default function PayoutReports(props) {
  const { t } = useTranslation();
  const data = props.data;
  const urlData = props.urlData;
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();
  const payoutsMonthViewTableHeaderRows = [
    {
      id: "dateAdded",
      align: "left",
      disablePadding: false,
      label: t("label:dateAdded"),
      sort: true,
    },
    {
      id: "fileName",
      align: "left",
      disablePadding: false,
      label: t("label:fileName"),
      sort: true,
    },
    {
      id: "fileFormat",
      align: "right",
      disablePadding: false,
      label: t("label:fileFormat"),
      sort: true,
    },
    ,
    {
      id: "action",
      align: "center",
      disablePadding: false,
      label: "",
      sort: false,
    },
  ];

  const [sortOrder, setSortOrder] = useState({
    direction: "asc",
    id: null,
  });

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

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
  };

  const CustomTooltip = withStyles({
    tooltip: {
      backgroundColor: "#323434",
      color: "#FFFFFF",
      borderRadius: "8px",
    },
  })(Tooltip);

  const downloadButtonBoxSx = {
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

  const downloadPayoutFile = (fileName) => {
    setFileName(fileName);
    setIsLoading(true);
    const preparedParam = {
      orgId: urlData.orgId,
      year: urlData.year,
      month: urlData.month,
      fileName,
    };
    ReportService.getDownloadableFile(preparedParam)
      .then((res) => {
        const url = window.URL.createObjectURL(new Blob([res]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${fileName}.pdf`);
        document.body.appendChild(link);
        link.click();
        setIsLoading(false);
        link.remove();
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {/*<div className="payouts-header">*/}
      {/*  <Header isDate={false} />*/}
      {/*</div>*/}
      {!!data && (
        <div>
          <TableContainer className="px-20" key={1}>
            <Table stickyHeader className="min-w-xl" aria-label="sticky table">
              {/*<TablePagination*/}
              {/*  className="shrink-0"*/}
              {/*  component="div"*/}
              {/*  count={data.length}*/}
              {/*  rowsPerPage={rowsPerPage}*/}
              {/*  page={page}*/}
              {/*  backIconButtonProps={{*/}
              {/*    "aria-label": "Previous Page",*/}
              {/*  }}*/}
              {/*  nextIconButtonProps={{*/}
              {/*    "aria-label": "Next Page",*/}
              {/*  }}*/}
              {/*  onPageChange={handleChangePage}*/}
              {/*  onRowsPerPageChange={handleChangeRowsPerPage}*/}
              {/*  rowsPerPageOptions={[]}*/}
              {/*/>*/}
              <TableHead>
                <OverviewTableHeader
                  sortOrder={sortOrder}
                  onRequestSort={handleRequestSort}
                  headerRows={payoutsMonthViewTableHeaderRows}
                />
              </TableHead>
              {!!data && data.length ? (
                <TableBody className="body-3">
                  {_.orderBy(data, [sortOrder?.id], [sortOrder.direction])
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <TableRow
                        className="cursor-pointer hover:bg-MonochromeGray-25"
                        key={`002`}
                      >
                        <TableCell key={`001`} align="left">
                          {row.dateAdded}
                        </TableCell>
                        <TableCell key={`001`} align="left">
                          {row.fileName}
                        </TableCell>
                        <TableCell key={`001`} align="right" className="pr-36">
                          {t(`label:${row.fileFormat}`)}
                        </TableCell>
                        <TableCell key={`001`} align="center">
                          {(!isLoading ||
                            !fileName ||
                            fileName !== row.fileName) && (
                            <CustomTooltip
                              disableFocusListener
                              title={t("label:downloadReport")}
                              TransitionComponent={Zoom}
                              placement="bottom"
                              enterDelay={300}
                            >
                              <Box
                                component="span"
                                className="py-8 px-4 downloadButton"
                                sx={downloadButtonBoxSx}
                                onClick={() => downloadPayoutFile(row.fileName)}
                              >
                                <FileDownloadIcon
                                  style={{ paddingBottom: "3px" }}
                                />
                              </Box>
                            </CustomTooltip>
                          )}
                          {isLoading && fileName === row.fileName && (
                            <CircularProgress
                              style={{ padding: "5px", color: "#0088AE" }}
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              ) : (
                <TableBody>
                  <TableRow>
                    <TableCell
                      colSpan={payoutsMonthViewTableHeaderRows.length}
                      align="center"
                    >
                      <Typography className="subtitle3">
                        {t("label:dataNotFound")}
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </div>
      )}
    </>
  );
}