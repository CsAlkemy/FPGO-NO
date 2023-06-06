import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class CreditCheckService {
  mapCreditCheckList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        // date: row.checked_on,
        date: row.date,
        customerName: row.name,
        orgIdOrPNumber: row.organizationId
          ? row.organizationId
          : row.personalNumber,
        phone:
          row.countryCode && row.msisdn ? row.countryCode + row.msisdn : "",
        // status: row.status,
        status: row.scoreMessage,
        // defaultProbability: row.default_probability,
        defaultProbability: row.defaultProbability,
        // scoreStatus: row.scoreStatus,
        scoreStatus: row.riskLevel.toLowerCase(),
        type: row.type,
      };
    });
    // d.status_code = 200;
    // d.is_data = true;
    return d;
  };

  creditCheckList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/credit/check/list`;
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
                      uuid: row.uuid,
                      // date: row.checked_on,
                      date: row.date,
                      customerName: row.name,
                      orgIdOrPNumber: row.organizationId
                        ? row.organizationId
                        : row.personalNumber,
                      phone:
                        row.countryCode && row.msisdn
                          ? row.countryCode + row.msisdn
                          : "",
                      // status: row.status,
                      status: row.scoreMessage,
                      // defaultProbability: row.default_probability,
                      defaultProbability: row.defaultProbability,
                      // scoreStatus: row.scoreStatus,
                      scoreStatus: row.riskLevel.toLowerCase(),
                      type: row.type,
                    };
                  });
                  d.status_code = 200;
                  d.is_data = true;
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
          return reject("somethingWentWrong");
        });
    });
  };

  prepareCorporateCreditCheckPayload = (params) => {
    return {
      organizationId: `${params.organizationId}`,
    };
  };

  creditCheckCorporate = async (params) => {
    return new Promise((resolve, reject) => {
      const body = {
        organizationId: `${params.organizationId}`,
      };
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/credit/check/corporate`;
            return axios
              .post(URL, body)
              .then((response) => {
                if (response?.data?.status_code === 200) resolve(response.data);
              })
              .catch((e) => {
                e?.response?.data?.error
                  ? reject(e?.response?.data?.error)
                  : reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  preparePrivateCreditCheckPayload = (params) => {
    const phoneNumber = params.phoneNumber.slice(2);
    const phoneCountryCode = "+" + params.phoneNumber.slice(0, 2);
    return {
      personalId: `${params.personalId}`,
      // countryCode:
      //   phoneNumber && phoneCountryCode ? `${phoneCountryCode}` : null,
      // msisdn: phoneNumber && phoneCountryCode ? `${phoneNumber}` : null,
    };
  };

  creditCheckPrivate = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const phoneNumber = params.phoneNumber.slice(2);
            const phoneCountryCode = "+" + params.phoneNumber.slice(0, 2);
            const data = {
              personalId: `${params.personalId}`,
              countryCode:
                phoneNumber && phoneCountryCode ? `${phoneCountryCode}` : null,
              msisdn: phoneNumber && phoneCountryCode ? `${phoneNumber}` : null,
            };

            const URL = `${EnvVariable.BASEURL}/credit/check/private`;
            return axios
              .post(URL, data)
              .then((response) => {
                if (response?.data?.status_code === 200) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                e?.response?.data?.error
                  ? reject(e?.response?.data?.error)
                  : reject(e?.response?.data?.message);
              });
          }
          reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  preparePaymentScreenCreditCheckPayload = (params) => {
    const creditCheckPrivateData = {
      personalId: params.creditCheckId,
      type: params.type,
    };
    const creditCheckCorporateData = {
      organizationId: params.creditCheckId,
      type: params.type,
    };
    return params.type === "private"
      ? creditCheckPrivateData
      : creditCheckCorporateData;
  };

  creditCheckForCheckout = async (params) => {
    return new Promise((resolve, reject) => {
      if (
        params.creditCheckId.length !== 11 &&
        params.creditCheckId.length !== 9
      )
        return reject("Invalid Credit Check Id!");
      // return AuthService.axiosRequestHelper()
      //   .then((status) => {
      //     if (status) {
      //
      //     }
      //     reject("somethingWentWrong");
      //   })
      //   .catch((e) => {
      //     reject("somethingWentWrong");
      //   });
      const creditCheckPrivateData = {
        personalId: params.creditCheckId,
      };
      const creditCheckCorporateData = {
        organizationId: params.creditCheckId,
      };
      const data =
        params.type === "private"
          ? creditCheckPrivateData
          : creditCheckCorporateData;

      const config = {
        headers: {
          Authorization: `Bearer QXNrZUFtYXJNb25WYWxvTmVpO01vbkFtYXJLZW1vbktlbW9uS29yZQ==`,
        },
      };
      const URL = `${EnvVariable.BASEURL}/credit/check/checkout/${params.type}`;
      return axios
        .post(URL, data, config)
        .then((response) => {
          if (response?.data?.status_code === 200) {
            resolve(response.data);
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          e?.response?.data?.error
            ? reject(e?.response?.data?.error)
            : reject(e?.response?.data?.message);
        });
    });
  };
}

const instance = new CreditCheckService();
export default instance;
