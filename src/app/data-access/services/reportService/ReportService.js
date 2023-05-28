import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class ReportService {
  getPayoutsListByYear = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/reports/${params.orgId}/payouts/${params.year}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  let d;
                  d = response.data.data.map((row) => {
                    return {
                      folder: row?.folder || null,
                      files: row?.files || null,
                    };
                  });
                  resolve(d);
                } else if (
                  response.data.status_code === 200 &&
                  !response.data.is_data
                ) {
                  resolve([]);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                if (e?.response?.data?.status_code === 404)
                  resolve([]);
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  getPayoutsListByMonth = (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/reports/${params.orgId}/payouts/${params.year}/lists/${params.month}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  let d;
                  d = response.data.data.map((row) => {
                    return {
                      dateAdded: row?.date || null,
                      fileName: row?.name || null,
                      fileFormat: row?.fileFormat || "PDF",
                      url: row?.url || null,
                      isDownload: true,
                    };
                  });
                  resolve(d);
                } else if (
                  response.data.status_code === 200 &&
                  !response.data.is_data
                ) {
                  resolve([]);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                if (e?.response?.data?.status_code === 404)
                  resolve(e.response.data);
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  getDownloadableFile = (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/reports/${params.orgId}/payouts/${params.year}/lists/${params.month}/${params.fileName}.pdf`;
            return axios
              .get(URL, {responseType: "blob"})
              .then((response) => {
                if (
                  response?.status === 200
                ) {
                  resolve(response.data)
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                reject("somethingWentWrong");
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  getVatReportCsvData = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/reports/${params.orgId}/vatinfo/${params.startTime}/${params.endTime}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  let d;
                  d = response.data.data.map((row) => {
                    return {
                      status : row?.status || "",
                      orderId : row.orderId || "",
                      orderDate : row.orderDate || "",
                      dueDate : row.dueDate || "",
                      customerName : row.customerName || "",
                      customerId : row.customerId || "",
                      bookKeepingAccount : row.bookKeepingAccount || "",
                      productAmount : row.productAmount || "",
                      vat : row.vat || "",
                      vatCode : row?.vatCode === "0" || row?.vatCode ? `=""${row.vatCode}""` : "",
                      paymentType : row.paymentType || "",
                      description : row.description || "",
                      productNumber : row.productNumber || "",
                      creditCheck : row.creditCheck || "",
                    };
                  });
                  resolve(d);
                } else if (
                  response.data.status_code === 200 &&
                  !response.data.is_data
                ) {
                  resolve([]);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                if (e?.response?.data?.status_code === 404)
                  resolve([]);
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };
}

const instance = new ReportService();
export default instance;