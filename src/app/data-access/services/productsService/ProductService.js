import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class ProductService {
  productsList = async (isSkipIsAuthenticated) => {
    console.log("aaa ps isSkipIsAuthenticated", isSkipIsAuthenticated);
    return new Promise((resolve, reject) => {
      if (!isSkipIsAuthenticated){
        return AuthService.axiosRequestHelper()
          .then((status) => {
            if (status) {
              const URL = `${EnvVariable.BASEURL}/products/list`;
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
                        id: row.productId,
                        name: row.name,
                        type: row.type,
                        category: row.categories
                          ? row.categories.length === 1
                            ? row.categories
                            : row.categories.map((row, index) => {
                                return row.length - 1 === index
                                  ? row
                                  : row + ", ";
                              })
                          : null,
                        unit: row.unit,
                        pricePerUnit: row.price,
                        taxRate: row.tax,
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
      }
      else {
        console.log("aaa ps isSkipIsAuthenticated block");
        const URL = `${EnvVariable.BASEURL}/products/list`;
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
                  id: row.productId,
                  name: row.name,
                  type: row.type,
                  category: row.categories
                    ? row.categories.length === 1
                      ? row.categories
                      : row.categories.map((row, index) => {
                        return row.length - 1 === index
                          ? row
                          : row + ", ";
                      })
                    : null,
                  unit: row.unit,
                  pricePerUnit: row.price,
                  taxRate: row.tax,
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
            } else reject("Something went wrong");
          })
          .catch((e) => {
            if (e?.response?.data?.status_code === 404) resolve(e.response.data)
            reject(e?.response?.data?.message)
          });
      }
    });
  };

  mapProductsList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        id: row.productId,
        name: row.name,
        type: row.type,
        category: row.categories
          ? row.categories.length === 1
            ? row.categories
            : row.categories.map((row, index) => {
              return row.length - 1 === index
                ? row
                : row + ", ";
            })
          : null,
        unit: row.unit,
        pricePerUnit: row.price,
        taxRate: row.tax,
        status: row.status,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  }

  prepareCreateProductPayload = (params)=> {
    const categoryUuids = params.assignedCategories
      ? params.assignedCategories.map((product) => {
        return `${product.uuid}`;
      })
      : null;

    return  {
      // type: type === 1 ? "Good" : "Service",
      type: "Good",
      productId: params.productID,
      name: params.productName,
      description: params.description,
      unit: params.unit,
      price: params.price,
      manufacturerId: params?.manufacturer ? params?.manufacturer : null,
      categoryUuids,
      taxRate: params.tax,
      cost: params.cost ? params.cost : null,
    };
  }

  createProduct = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/products/create`;

            const categoryUuids = params.assignedCategories
              ? params.assignedCategories.map((product) => {
                  return `${product.uuid}`;
                })
              : null;

            const data = {
              // type: type === 1 ? "Good" : "Service",
              type: "Good",
              productId: params.productID,
              name: params.productName,
              description: params.description,
              unit: params.unit,
              price: params.price,
              manufacturerId: params?.manufacturer ? params?.manufacturer : null,
              categoryUuids,
              taxRate: params.tax,
              cost: params.cost ? params.cost : null,
            };
            return axios
              .post(URL, data)
              .then((response) => {
                if (response?.data?.status_code === 201) {
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

  productDetailsByUUID = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/products/details/${uuid}`;
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
    });
  };

  prepareUpdateProductPayload = (uuid, type, params)=> {
    const categoryUuids = params.assignedCategories
      ? params.assignedCategories.map((product) => {
        return `${product.uuid}`;
      })
      : null;

    return {
      uuid,
      type: type === 1 ? "Good" : "Service",
      productId: params.productID,
      name: params.productName,
      description: params.description,
      unit: params.unit,
      price: params.price,
      manufacturerId: type === 1 ? params.manufacturer : "Test",
      categoryUuids,
      taxRate: params.tax,
      cost: params.cost ? params.cost : null,
    };
  }

  updateProductByUUID = async (uuid, type, params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/products/update/${uuid}`;

            const categoryUuids = params.assignedCategories
              ? params.assignedCategories.map((product) => {
                  return `${product.uuid}`;
                })
              : null;

            const data = {
              type: type === 1 ? "Good" : "Service",
              productId: params.productID,
              name: params.productName,
              description: params.description,
              unit: params.unit,
              price: params.price,
              manufacturerId: type === 1 ? params.manufacturer : "Test",
              categoryUuids,
              taxRate: params.tax,
              cost: params.cost ? params.cost : null,
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

  inactiveProductByUUID = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/products/change/status/${uuid}`;
            return axios
              .put(URL)
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
}

const instance = new ProductService();
export default instance;
