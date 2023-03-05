import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class DashboardService {
  getDashboardAnalyticsData = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/dashboard/${params.startDate}/${params.endDate}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  resolve(response?.data)
                } else if (
                  response.data.status_code === 200 &&
                  !response.data.is_data
                ) {
                  resolve([]);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                if (e?.response?.data?.status_code === 404) resolve(e.response.data)
                reject(e?.response?.data?.message)
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          return reject("somethingWentWrong");
        });
    });
  };
}

const instance = new DashboardService();
export default instance;
