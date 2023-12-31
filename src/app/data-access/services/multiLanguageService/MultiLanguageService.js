import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";

class MultiLanguageService {
  translations = async () => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.PROD_BASE_URL}/translations`;
      return axios
        .get(URL)
        .then((response) => {
          if (
            response?.data?.status_code === 200 &&
            response?.data?.is_data
          ) {
            resolve(response.data);
          } else if (
            response.data.status_code === 200 &&
            !response.data.is_data
          ) {
            resolve([]);
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject(e?.response?.data?.message)
        });
    });
  };
}

const instance = new MultiLanguageService();
export default instance;
