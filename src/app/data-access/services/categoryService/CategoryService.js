import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class CategoryService {
  mapCategoriesList = (data)=> {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        name: row.name,
        description: row.description,
        noOfProducts: row.productCount,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  }

  categoryList = async (isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/categories/list`;
      if (isSkipIsAuthenticated) {
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
                  name: row.name,
                  description: row.description,
                  noOfProducts: row.productCount,
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
            if (e?.response?.data?.status_code === 404) resolve(e.response.data)
            reject(e?.response?.data?.message)
          });
      } else {
        AuthService.axiosRequestHelper()
          .then((status) => {
            if (status) {
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
                        name: row.name,
                        description: row.description,
                        noOfProducts: row.productCount,
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
                  if (e?.response?.data?.status_code === 404) resolve(e.response.data)
                  reject(e?.response?.data?.message)
                });
            }
            reject("Something went wrong");
          })
          .catch((e) => {
            reject("Something went wrong");
          });
      }
    });
  };

  prepareCreateCategoryPayload = (params)=>{
    const productUuids = params.assignToProducts
      ? params.assignToProducts.map((product) => {
        return `${product.uuid}`;
      })
      : null;

    return  {
      name: params.name,
      description: params.description ? params.description : null,
      productUuids,
    };
  }

  createCategory = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/categories/create`;
            const productUuids = params.assignToProducts
              ? params.assignToProducts.map((product) => {
                  return `${product.uuid}`;
                })
              : null;

            const data = {
              name: params.name,
              description: params.description ? params.description : null,
              productUuids,
            };
            return axios
              .post(URL, data)
              .then((response) => {
                if (response?.data?.status_code === 201) resolve(response.data);
                else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message)
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  categoryDetailsByUUID = async (uuid, isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/categories/details/${uuid}`;
      if (isSkipIsAuthenticated) {
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
            reject(e?.response?.data?.message)
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
                  } else reject("Something went wrong");
                })
                .catch((e) => {
                  reject(e?.response?.data?.message)
                });
            } else reject("Something went wrong");
          })
          .catch((e) => {
            reject("Something went wrong");
          });
      }
    });
  };

  prepareUpdateCategoryPayload = (uuid, params)=> {
    const productUuids = params.assignToProducts
      ? params.assignToProducts.map((product) => {
        return `${product.uuid}`;
      })
      : null;

    return  {
      uuid,
      name: params.name,
      description: params.description ? params.description : null,
      productUuids,
    };
  }

  updateCategoryByUUID = async (uuid, params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/categories/update/${uuid}`;

            const productUuids = params.assignToProducts
              ? params.assignToProducts.map((product) => {
                  return `${product.uuid}`;
                })
              : null;

            const data = {
              name: params.name,
              description: params.description ? params.description : null,
              productUuids,
            };
            return axios
              .put(URL, data)
              .then((response) => {
                if (response?.data?.status_code === 202) {
                  resolve(response.data);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message)
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };

  deleteCategoryByUUID = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/categories/delete/${uuid}`;
            return axios
              .delete(URL)
              .then((response) => {
                // if (response?.data.status_code === 204) {
                if (response?.status === 204) {
                  resolve(response);
                } else reject("Something went wrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message)
              });
          } else reject("Something went wrong");
        })
        .catch((e) => {
          reject("Something went wrong");
        });
    });
  };
}

const instance = new CategoryService();
export default instance;
