import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";
import { FP_ADMIN, GENERAL_USER } from "../../../utils/user-roles/UserRoles";

class UserService {
  userRoleList = async (isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/users/roles/list`;
      if (isSkipIsAuthenticated) {
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
            reject(e?.response?.data?.message);
          });
      } else {
        return AuthService.axiosRequestHelper()
          .then((status) => {
            if (status) {
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
                  reject(e?.response?.data?.message);
                });
            } else reject("somethingWentWrong");
          })
          .catch((e) => {
            reject("somethingWentWrong");
          });
      }
    });
  };

  organizationsList = async (isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/organizations`;
      if (isSkipIsAuthenticated) {
        return axios
          .get(URL)
          .then((response) => {
            if (response?.data?.status_code === 200) {
              resolve(response.data);
            } else reject("somethingWentWrong");
          })
          .catch((e) => {
            reject(e?.response?.data?.message);
          });
      } else {
        return AuthService.axiosRequestHelper()
          .then((status) => {
            if (status) {
              return axios
                .get(URL)
                .then((response) => {
                  if (response?.data?.status_code === 200) {
                    resolve(response.data);
                  } else reject("somethingWentWrong");
                })
                .catch((e) => {
                  reject(e?.response?.data?.message);
                });
            } else reject("somethingWentWrong");
          })
          .catch((e) => {
            reject("somethingWentWrong");
          });
      }
    });
  };

  managerList = async (id) => {
    return AuthService.axiosRequestHelper()
      .then((status) => {
        if (status) {
          const URL = `${EnvVariable.BASEURL}/users/${id}/business-admin`;
          return axios
            .get(URL)
            .then((response) => {
              return response.data;
            })
            .catch((e) => {
              return e?.response?.data?.message;
            });
        } else return [];
      })
      .catch((e) => {
        return [];
      });
  };

  userList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/list`;
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
                      clientName: row.name,
                      orgId: row?.organizationId ? row.organizationId : "-",
                      clientType: row.userRole,
                      users: row?.users ? row.users : "-",
                      status: row.status,
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
          reject("somethingWentWrong");
        });
    });
  };

  mapFPAdminUsersList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        name: row?.name ? row.name : "-",
        email: row?.email ? row.email : "-",
        phone:
          row?.countryCode && row?.msisdn ? row.countryCode + row.msisdn : "-",
        msisdn: row?.msisdn || "",
        designation: row?.designation ? row.designation : "-",
        status: row?.status,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  fpAdminUsersList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/list/all/fp-admin`;
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
                      name: row?.name ? row.name : "-",
                      email: row?.email ? row.email : "-",
                      phone:
                        row?.countryCode && row?.msisdn
                          ? row.countryCode + row.msisdn
                          : "-",
                      msisdn: row?.msisdn || "",
                      designation: row?.designation ? row.designation : "-",
                      status: row?.status,
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
                // if (e.code === "ERR_NETWORK") return { status_code: 500 };
                // return e?.response?.data?.message;
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

  mapClientOrganizationsSummaryList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        organizationUuid: row.uuid,
        nameOrgId: row.name + " ( " + row.id + " ) ",
        orgType: row.type ? row.type : "-",
        primaryContact:
          row.primaryContactDetails.name +
          " ( " +
          row.primaryContactDetails?.designation +
          " ) ",
        phone:
          row.primaryContactDetails.countryCode +
          row.primaryContactDetails.msisdn,
        msisdn: row.primaryContactDetails?.msisdn || "",
        email: row.primaryContactDetails.email,
        userCount: row.userCount,
        status: row.status,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  businessAdminUsersList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/list/organizations/summary`;
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
                      orgType: row.type ? row.type : "-",
                      primaryContact:
                        row.primaryContactDetails.name +
                        " ( " +
                        row.primaryContactDetails?.designation +
                        " ) ",
                      phone:
                        row.primaryContactDetails.countryCode +
                        row.primaryContactDetails.msisdn,
                      msisdn: row.primaryContactDetails?.msisdn || "",
                      email: row.primaryContactDetails.email,
                      userCount: row.userCount,
                      status: row.status,
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
                // return response.data;
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

  mapOrgWiseUsersList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        name: row?.name ? row.name : "-",
        email: row?.email ? row.email : "-",
        phone:
          row?.countryCode && row?.msisdn ? row.countryCode + row.msisdn : "-",
        msisdn: row?.msisdn || "",
        designation: row?.designation ? row.designation : "-",
        role: row?.userRole ? row.userRole : "-",
        status: row?.status,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  organizationWiseUsersList = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/list/${uuid}`;
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
                      name: row?.name ? row.name : "-",
                      email: row?.email ? row.email : "-",
                      phone:
                        row?.countryCode && row?.msisdn
                          ? row.countryCode + row.msisdn
                          : "-",
                      msisdn: row?.msisdn || "",
                      designation: row?.designation ? row.designation : "-",
                      role: row?.userRole ? row.userRole : "-",
                      status: row?.status,
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
                // return response.data;
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

  getProfileByUUID = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/profile/${uuid}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  changePassword = async (params, uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/change/password/${uuid}`;
            return axios
              .put(URL, params)
              .then((response) => {
                if (response?.data?.status_code === 202) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  updateUserByUUID = async (uuid, params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/update/${uuid}`;
            return axios
              .put(URL, params)
              .then((response) => {
                if (response?.data?.status_code === 202) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  prepareCreateUserByRolePayload = (params, role, dialCode) => {
    const msisdn = params?.phoneNumber
      ? params?.phoneNumber.slice(dialCode.length)
      : null;
    const countryCode = dialCode
      ? dialCode
      : null;

    return {
      role,
      name: params.fullName,
      email: params.email,
      countryCode,
      msisdn,
      organizationUuid:
        role === FP_ADMIN
          ? null
          : params?.organization
          ? params?.organization
          : null,
      designation: params?.designation ? params.designation : null,
      password: params.password,
      sendEmail: params.isSend,
      preferredLanguage: params.preferredLanguage,
      // managerUuid: role === GENERAL_USER ? params.manager : null
    };
  };

  createUserByRole = async (params, role) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/create/${role}`;

            const phoneNumber = params?.phoneNumber
              ? params.phoneNumber.split("+")
              : null;
            const msisdn = phoneNumber
              ? phoneNumber[phoneNumber.length - 1].slice(2)
              : null;
            const countryCode = phoneNumber
              ? "+" + phoneNumber[phoneNumber.length - 1].slice(0, 2)
              : null;

            const body = {
              name: params.fullName,
              email: params.email,
              countryCode,
              msisdn,
              organizationUuid:
                role === FP_ADMIN
                  ? null
                  : params?.organization
                  ? params?.organization
                  : null,
              designation: params?.designation ? params.designation : null,
              password: params.password,
              sendEmail: params.isSend,
              preferredLanguage: params.preferredLanguage,
              // managerUuid: role === GENERAL_USER ? params.manager : null
            };

            return axios
              .post(URL, body)
              .then((response) => {
                if (response?.data?.status_code === 201) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
                resolve(response.data);
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  changeStatusByUUID = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/users/change/status/${uuid}`;
            return axios
              .put(URL)
              .then((response) => {
                if (response?.data?.status_code === 202) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          }
          reject("somethingWentWrong");
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };
}

const instance = new UserService();
export default instance;
