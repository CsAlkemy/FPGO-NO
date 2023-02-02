import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class ClientService {
  mapApprovalList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        organizationUuid: row.uuid,
        nameOrgId: row.name + " ( " + row.id + " ) ",
        reqOn: row.requestedOn,
        orgType: row.type ? row.type : "-",
        primaryContact:
          row.primaryContactDetails.name +
          (row.primaryContactDetails?.designation
            ? " ( " + row.primaryContactDetails?.designation + " ) "
            : ""),
        phone:
          row.primaryContactDetails.countryCode +
          row.primaryContactDetails.msisdn,
        email: row.primaryContactDetails.email,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };
  approvalList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/list/pending`;
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
                      organizationUuid: row.uuid,
                      nameOrgId: row.name + " ( " + row.id + " ) ",
                      reqOn: row.requestedOn,
                      orgType: row.type ? row.type : "-",
                      primaryContact:
                        row.primaryContactDetails.name +
                        (row.primaryContactDetails?.designation
                          ? " ( " +
                            row.primaryContactDetails?.designation +
                            " ) "
                          : ""),
                      phone:
                        row.primaryContactDetails.countryCode +
                        row.primaryContactDetails.msisdn,
                      email: row.primaryContactDetails.email,
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
                } else reject("Something went wrong");
              })
              .catch((e) => {
                if (e?.response?.data?.status_code === 404)
                  resolve(e.response.data);
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  prepareDate = (paramDate) => {
    //TODO: Set date ex: 12 Sep, 2022
    const date = new Date(paramDate);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const year = date.getFullYear();

    return `${day} ${monthName}, ${year}`;
  };

  mapApprovedClientList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        organizationUuid: row.uuid,
        name: row.name,
        orgId: row.id ? row.id : "-",
        orgType: row.type ? row.type : "-",
        primaryContact:
          row.primaryContactDetails?.name +
          (row.primaryContactDetails?.designation
            ? " ( " + row.primaryContactDetails?.designation + " ) "
            : ""),
        phone:
          row.primaryContactDetails?.countryCode +
          row.primaryContactDetails?.msisdn,
        email: row.primaryContactDetails?.email,
        status: row.status,
        // role: row.userRole,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  approvedClientList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/list/approved`;
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
                      organizationUuid: row.uuid,
                      name: row.name,
                      orgId: row.id ? row.id : "-",
                      orgType: row.type ? row.type : "-",
                      primaryContact:
                        row.primaryContactDetails?.name +
                        (row.primaryContactDetails?.designation
                          ? " ( " +
                            row.primaryContactDetails?.designation +
                            " ) "
                          : ""),
                      phone:
                        row.primaryContactDetails?.countryCode +
                        row.primaryContactDetails?.msisdn,
                      email: row.primaryContactDetails?.email,
                      status: row.status,
                      // role: row.userRole,
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
                } else reject("Something went wrong");
              })
              .catch((e) => {
                if (e?.response?.data?.status_code === 404)
                  resolve(e.response.data);
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  organizationTypeList = async () => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/organizations/type`;
      return axios
        .get(URL)
        .then((response) => {
          if (response?.data?.status_code === 200) {
            resolve(response.data);
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject(e?.response?.data?.message);
        });
    });
  };

  vateRatesList = async (orgUuid) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/clients/vat/list/${orgUuid}`;
      return axios
        .get(URL)
        .then((response) => {
          if (response?.data?.status_code === 200) {
            resolve(response.data);
          } else reject("Something went wrong");
        })
        .catch((e) => {
          console.log("Err : ", e);
          if (e?.response?.data?.status_code === 404) resolve(e.response.data);
          reject(e?.response?.data?.message);
        });
    });
  };

  createClient = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/add`;
            return axios
              .post(URL, params)
              .then((response) => {
                if (response?.data.status_code === 201) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  clientOnboard = async (info, uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/approve/${uuid}`;
            return axios
              .put(URL, info)
              .then((response) => {
                if (response?.data.status_code === 202) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  clientDetails = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/details/${uuid}`;
            return axios
              .get(URL)
              .then((response) => {
                if (response?.data?.status_code === 200) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  updateClient = async (info, uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/update/${uuid}`;
            return axios
              .put(URL, info)
              .then((response) => {
                if (response?.data.status_code === 202) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  deleteClient = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/delete/${uuid}`;
            return axios
              .delete(URL)
              .then((response) => {
                if (response?.status === 204) {
                  resolve(response);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  changeClientStatus = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/change/status/${uuid}`;
            return axios
              .put(URL)
              .then((response) => {
                if (response?.data?.status_code === 202) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  getClientTimelineByUUID = async (uuid, startTime) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/clients/${uuid}/timeline/${startTime}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                // reject(e?.response?.data?.message)
                if (e?.response?.data?.status_code === 404)
                  resolve(e.response.data);
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };
}

const instance = new ClientService();
export default instance;
