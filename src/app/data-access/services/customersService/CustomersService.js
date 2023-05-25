import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";

class CustomersService {
  prepareCreatePrivateCustomerPayload = (params, sameAddress, dialCode) => {
    const primaryPhoneNumber = params?.primaryPhoneNumber
      ? params.primaryPhoneNumber.split("+")
      : null;
    const billingPhoneNumber = params?.billingPhoneNumber
      ? params.billingPhoneNumber.split("+")
      : null;
    const shippingPhoneNumber = params?.shippingPhoneNumber
      ? params.shippingPhoneNumber.split("+")
      : null;
    // const msisdn = params.primaryPhoneNumber
    //   ? params.primaryPhoneNumber.slice(2)
    //   : null;
    // const countryCode = params.primaryPhoneNumber
    //   ? "+" + params.primaryPhoneNumber.slice(0, 2)
    //   : null;
    const msisdn = params?.primaryPhoneNumber
      ? params?.primaryPhoneNumber.slice(dialCode?.length)
      : null;
    const countryCode = dialCode
      ? dialCode
      : null;
    const bl_msisdn = billingPhoneNumber
      ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
      : null;
    const bl_countryCode = billingPhoneNumber
      ? "+" + billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
      : null;
    const sh_msisdn = shippingPhoneNumber
      ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
      : null;
    const sh_countryCode = shippingPhoneNumber
      ? "+" + shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
      : null;

    const URL = `${EnvVariable.BASEURL}/customers/create/private`;

    const addresses0 =
      !bl_msisdn &&
      !bl_countryCode &&
      !params.billingEmail &&
      !params.billingAddress &&
      !params.billingZip &&
      !params.billingCity &&
      !params.billingCountry
        ? null
        : {
            // type: "billing",
            // countryCode: bl_countryCode,
            // msisdn: bl_msisdn,
            // email: params.billingEmail ? params.billingEmail : null,
            street: params.billingAddress ? params.billingAddress : null,
            zip: params.billingZip ? params.billingZip : null,
            city: params.billingCity ? params.billingCity : null,
            country: params.billingCountry ? params.billingCountry : null,
          };
    const addresses1 = sameAddress
      ? {
          // type: "Shipping",
          // countryCode: bl_countryCode,
          // msisdn: bl_msisdn,
          // email: params.billingEmail ? params.billingEmail : null,
          street: params.billingAddress ? params.billingAddress : null,
          zip: params.billingZip ? params.billingZip : null,
          city: params.billingCity ? params.billingCity : null,
          country: params.billingCountry ? params.billingCountry : null,
        }
      : !sh_msisdn &&
        !sh_countryCode &&
        !params?.shippingEmail &&
        !params?.shippingAddress &&
        !params?.shippingZip &&
        !params?.shippingCity &&
        !params?.shippingCountry
      ? null
      : {
          // type: "Shipping",
          // countryCode: sh_countryCode,
          // msisdn: sh_msisdn,
          // email: params.shippingEmail ? params.shippingEmail : null,
          street: params.shippingAddress ? params.shippingAddress : null,
          zip: params.shippingZip ? params.shippingZip : null,
          city: params.shippingCity ? params.shippingCity : null,
          country: params.shippingCountry ? params.shippingCountry : null,
        };

    const mainAddress =
      !addresses0 && !addresses1
        ? null
        : !addresses1 && addresses0
        ? {
            // 0: addresses0,
            billing: { ...addresses0 },
            shipping: { ...addresses0 },
          }
        : {
            // 0: addresses0,
            // 1: addresses1,
            billing: { ...addresses0 },
            shipping: { ...addresses1 },
          };

    return {
      name: params.customerName ? params.customerName : null,
      countryCode: countryCode,
      msisdn: msisdn,
      email: params.customerEmail ? params.customerEmail : null,
      personalNumber: params.pNumber ? `${params.pNumber}` : "",
      addresses: mainAddress,
    };
  };

  createPrivateCustomer = (params, sameAddress) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const primaryPhoneNumber = params?.primaryPhoneNumber
              ? params.primaryPhoneNumber.split("+")
              : null;
            const billingPhoneNumber = params?.billingPhoneNumber
              ? params.billingPhoneNumber.split("+")
              : null;
            const shippingPhoneNumber = params?.shippingPhoneNumber
              ? params.shippingPhoneNumber.split("+")
              : null;
            // const msisdn = params.primaryPhoneNumber
            //   ? params.primaryPhoneNumber.slice(2)
            //   : null;
            // const countryCode = params.primaryPhoneNumber
            //   ? "+" + params.primaryPhoneNumber.slice(0, 2)
            //   : null;
            const msisdn = primaryPhoneNumber
              ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
              : null;
            const countryCode = primaryPhoneNumber
              ? "+" +
                primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
              : null;
            const bl_msisdn = billingPhoneNumber
              ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
              : null;
            const bl_countryCode = billingPhoneNumber
              ? "+" +
                billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
              : null;
            const sh_msisdn = shippingPhoneNumber
              ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
              : null;
            const sh_countryCode = shippingPhoneNumber
              ? "+" +
                shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
              : null;

            const URL = `${EnvVariable.BASEURL}/customers/create/private`;

            const addresses0 =
              !bl_msisdn &&
              !bl_countryCode &&
              !params.billingEmail &&
              !params.billingAddress &&
              !params.billingZip &&
              !params.billingCity &&
              !params.billingCountry
                ? null
                : {
                    // type: "billing",
                    // countryCode: bl_countryCode,
                    // msisdn: bl_msisdn,
                    // email: params.billingEmail ? params.billingEmail : null,
                    street: params.billingAddress
                      ? params.billingAddress
                      : null,
                    zip: params.billingZip ? params.billingZip : null,
                    city: params.billingCity ? params.billingCity : null,
                    country: params.billingCountry
                      ? params.billingCountry
                      : null,
                  };
            const addresses1 = sameAddress
              ? {
                  // type: "Shipping",
                  // countryCode: bl_countryCode,
                  // msisdn: bl_msisdn,
                  // email: params.billingEmail ? params.billingEmail : null,
                  street: params.billingAddress ? params.billingAddress : null,
                  zip: params.billingZip ? params.billingZip : null,
                  city: params.billingCity ? params.billingCity : null,
                  country: params.billingCountry ? params.billingCountry : null,
                }
              : !sh_msisdn &&
                !sh_countryCode &&
                !params?.shippingEmail &&
                !params?.shippingAddress &&
                !params?.shippingZip &&
                !params?.shippingCity &&
                !params?.shippingCountry
              ? null
              : {
                  // type: "Shipping",
                  // countryCode: sh_countryCode,
                  // msisdn: sh_msisdn,
                  // email: params.shippingEmail ? params.shippingEmail : null,
                  street: params.shippingAddress
                    ? params.shippingAddress
                    : null,
                  zip: params.shippingZip ? params.shippingZip : null,
                  city: params.shippingCity ? params.shippingCity : null,
                  country: params.shippingCountry
                    ? params.shippingCountry
                    : null,
                };

            const mainAddress =
              !addresses0 && !addresses1
                ? null
                : !addresses1 && addresses0
                ? {
                    // 0: addresses0,
                    billing: { ...addresses0 },
                    shipping: { ...addresses0 },
                  }
                : {
                    // 0: addresses0,
                    // 1: addresses1,
                    billing: { ...addresses0 },
                    shipping: { ...addresses1 },
                  };

            const data = {
              name: params.customerName ? params.customerName : null,
              countryCode: countryCode,
              msisdn: msisdn,
              email: params.customerEmail ? params.customerEmail : null,
              personalNumber: params.pNumber ? `${params.pNumber}` : "",
              addresses: mainAddress,
            };
            return axios
              .post(URL, data)
              .then((response) => {
                if (response?.data.status_code === 201) {
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

  prepareCreateCorporateCustomerPayload = (params, sameAddress, dialCodePrimary, dialCodePrimaryInfo) => {
    console.log("Dail Code primay",dialCodePrimary);
    const primaryPhoneNumber = params?.primaryPhoneNumber
      ? params.primaryPhoneNumber.split("+")
      : null;
    const billingPhoneNumber = params?.billingPhoneNumber
      ? params.billingPhoneNumber.split("+")
      : null;
    const shippingPhoneNumber = params?.shippingPhoneNumber
      ? params.shippingPhoneNumber.split("+")
      : null;

    const msisdn = params?.primaryPhoneNumber
      ? params?.primaryPhoneNumber.slice(dialCodePrimary?.length)
      : null;
    const countryCode = dialCodePrimary
      ? dialCodePrimary
      : null;
    const bl_msisdn = billingPhoneNumber
      ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
      : null;
    const bl_countryCode = billingPhoneNumber
      ? "+" + billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
      : null;
    const sh_msisdn = shippingPhoneNumber
      ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
      : null;
    const sh_countryCode = shippingPhoneNumber
      ? "+" + shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
      : null;

    const URL = `${EnvVariable.BASEURL}/customers/create/corporate`;

    const addresses0 =
      !bl_msisdn &&
      !bl_countryCode &&
      !params.billingEmail &&
      !params.billingAddress &&
      !params.billingZip &&
      !params.billingCity &&
      !params.billingCountry
        ? null
        : {
            // countryCode: bl_countryCode,
            // msisdn: bl_msisdn,
            // email: params.billingEmail ? params.billingEmail : null,
            street: params.billingAddress ? params.billingAddress : null,
            zip: params.billingZip ? params.billingZip : null,
            city: params.billingCity ? params.billingCity : null,
            country: params.billingCountry ? params.billingCountry : null,
          };

    const addresses1 = sameAddress
      ? {
          // countryCode: bl_countryCode,
          // msisdn: bl_msisdn,
          // email: params.billingEmail ? params.billingEmail : null,
          street: params.billingAddress ? params.billingAddress : null,
          zip: params.billingZip ? params.billingZip : null,
          city: params.billingCity ? params.billingCity : null,
          country: params.billingCountry ? params.billingCountry : null,
        }
      : !sh_msisdn &&
        !sh_countryCode &&
        !params.shippingEmail &&
        !params.shippingAddress &&
        !params.shippingZip &&
        !params.shippingCity &&
        !params.shippingCountry
      ? addresses0
      : {
          // street: params.shippingAddress ? params.shippingAddress : null,
          // zip: params.shippingZip ? params.shippingZip : null,
          // city: params.shippingCity ? params.shippingCity : null,
          // country: params.shippingCountry ? params.shippingCountry : null,
          street: params?.shippingAddress
            ? params.shippingAddress
            : params?.billingAddress,
          zip: params?.shippingZip ? params.shippingZip : params?.billingZip,
          city: params?.shippingCity
            ? params.shippingCity
            : params?.billingCity,
          country: params?.shippingCountry
            ? params.shippingCountry
            : params?.billingCountry,
        };
    const mainAddress =
      !addresses0 && !addresses1
        ? null
        : !addresses1 && addresses0
        ? {
            billing: {
              ...addresses0,
            },
            // shipping: null,
            shipping: {
              ...addresses0,
            },
          }
        : {
            // 0: addresses0,
            // 1: addresses1,
            billing: {
              ...addresses0,
            },
            shipping: {
              ...addresses1,
            },
          };
    const additionalCDs =
      !params?.fullName &&
      !params?.email &&
      !params?.designation &&
      !params?.phone &&
      !params?.notes
        ? null
        : {
            0: {
              name: params.fullName,
              email: params.email,
              designation: params.designation,
              countryCode: "+" + params.phone.slice(0, 2),
              msisdn: params.phone.slice(2),
              note: params.notes,
            },
          };

    const additionalData = params?.contact
      ? params.contact.map((row) => {
          const phone = row?.phone ? row.phone.split("+") : null;

          const msisdn = phone ? phone[phone.length - 1].slice(2) : null;
          const countryCode = phone
            ? "+" + phone[phone.length - 1].slice(0, 2)
            : null;

          return {
            name: row.fullName,
            email: row.email,
            designation: row.designation,
            countryCode,
            msisdn,
            note: row.notes,
          };
        })
      : null;

    if (additionalData) {
      for (let i = 0; i < additionalData.length; i++) {
        additionalCDs[i + 1] = additionalData[i];
      }
    }

    return {
      name: params.OrganizationName ? params.OrganizationName : null,
      countryCode: countryCode ? countryCode : null,
      msisdn: msisdn,
      email: params.orgEmail ? params.orgEmail : null,
      organizationId: params.organizationID ? params.organizationID : null,
      addresses: mainAddress,
      additionalContact: additionalCDs,
    };
  };

  createCorporateCustomer = (params, sameAddress) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const primaryPhoneNumber = params?.primaryPhoneNumber
              ? params.primaryPhoneNumber.split("+")
              : null;
            const billingPhoneNumber = params?.billingPhoneNumber
              ? params.billingPhoneNumber.split("+")
              : null;
            const shippingPhoneNumber = params?.shippingPhoneNumber
              ? params.shippingPhoneNumber.split("+")
              : null;

            const msisdn = primaryPhoneNumber
              ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
              : null;
            const countryCode = primaryPhoneNumber
              ? "+" +
                primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
              : null;
            const bl_msisdn = billingPhoneNumber
              ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
              : null;
            const bl_countryCode = billingPhoneNumber
              ? "+" +
                billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
              : null;
            const sh_msisdn = shippingPhoneNumber
              ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
              : null;
            const sh_countryCode = shippingPhoneNumber
              ? "+" +
                shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
              : null;

            const URL = `${EnvVariable.BASEURL}/customers/create/corporate`;

            const addresses0 =
              !bl_msisdn &&
              !bl_countryCode &&
              !params.billingEmail &&
              !params.billingAddress &&
              !params.billingZip &&
              !params.billingCity &&
              !params.billingCountry
                ? null
                : {
                    // countryCode: bl_countryCode,
                    // msisdn: bl_msisdn,
                    // email: params.billingEmail ? params.billingEmail : null,
                    street: params.billingAddress
                      ? params.billingAddress
                      : null,
                    zip: params.billingZip ? params.billingZip : null,
                    city: params.billingCity ? params.billingCity : null,
                    country: params.billingCountry
                      ? params.billingCountry
                      : null,
                  };

            const addresses1 = sameAddress
              ? {
                  // countryCode: bl_countryCode,
                  // msisdn: bl_msisdn,
                  // email: params.billingEmail ? params.billingEmail : null,
                  street: params.billingAddress ? params.billingAddress : null,
                  zip: params.billingZip ? params.billingZip : null,
                  city: params.billingCity ? params.billingCity : null,
                  country: params.billingCountry ? params.billingCountry : null,
                }
              : !sh_msisdn &&
                !sh_countryCode &&
                !params.shippingEmail &&
                !params.shippingAddress &&
                !params.shippingZip &&
                !params.shippingCity &&
                !params.shippingCountry
              ? null
              : {
                  // countryCode: sh_countryCode,
                  // msisdn: sh_msisdn,
                  // email: params.shippingEmail ? params.shippingEmail : null,
                  street: params.shippingAddress
                    ? params.shippingAddress
                    : null,
                  zip: params.shippingZip ? params.shippingZip : null,
                  city: params.shippingCity ? params.shippingCity : null,
                  country: params.shippingCountry
                    ? params.shippingCountry
                    : null,
                };
            const mainAddress =
              !addresses0 && !addresses1
                ? null
                : !addresses1 && addresses0
                ? {
                    billing: {
                      ...addresses0,
                    },
                    shipping: null,
                  }
                : {
                    // 0: addresses0,
                    // 1: addresses1,
                    billing: {
                      ...addresses0,
                    },
                    shipping: {
                      ...addresses1,
                    },
                  };
            const additionalCDs =
              !params?.fullName &&
              !params?.email &&
              !params?.designation &&
              !params?.phone &&
              !params?.notes
                ? null
                : {
                    0: {
                      name: params.fullName,
                      email: params.email,
                      designation: params.designation,
                      countryCode: "+" + params.phone.slice(0, 2),
                      msisdn: params.phone.slice(2),
                      note: params.notes,
                    },
                  };

            const additionalData = params?.contact
              ? params.contact.map((row) => {
                  const phone = row?.phone ? row.phone.split("+") : null;

                  const msisdn = phone
                    ? phone[phone.length - 1].slice(2)
                    : null;
                  const countryCode = phone
                    ? "+" + phone[phone.length - 1].slice(0, 2)
                    : null;

                  return {
                    name: row.fullName,
                    email: row.email,
                    designation: row.designation,
                    countryCode,
                    msisdn,
                    note: row.notes,
                  };
                })
              : null;

            if (additionalData) {
              for (let i = 0; i < additionalData.length; i++) {
                additionalCDs[i + 1] = additionalData[i];
              }
            }

            const data = {
              name: params.OrganizationName ? params.OrganizationName : null,
              countryCode: countryCode ? countryCode : null,
              msisdn: msisdn,
              email: params.orgEmail ? params.orgEmail : null,
              organizationId: params.organizationID
                ? params.organizationID
                : null,
              addresses: mainAddress,
              additionalContact: additionalCDs,
            };

            return axios
              .post(URL, data)
              .then((response) => {
                if (response?.data.status_code === 201) {
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

  mapCustomersList = (data) => {
    let d;
    d = data.map((row) => {
      const preparePhone =
        row.countryCode && row.msisdn ? row.countryCode + row.msisdn : null;
      const phone = preparePhone ? preparePhone.split("+") : null;
      return {
        uuid: row.uuid,
        type: row.type,
        name: row.name,
        orgIdOrPNumber: row.organizationId
          ? row.organizationId
          : row.personalNumber,
        phone: phone ? "+" + phone[phone.length - 1] : null,
        msisdn: row?.msisdn || '',
        email: row.email,
        lastInvoicedOn: row.lastOrderOn,
        lastOrderAmount: row.lastOrderAmount,
        status: row.status,
        street: row?.billingAddress?.street,
        city: row?.billingAddress?.city,
        zip: row?.billingAddress?.zip,
        country: row?.billingAddress?.country,
      };
    });
    // d.status_code = 200;
    // d.is_data = true;
    return d;
  };

  customersList = async (isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      if (isSkipIsAuthenticated) {
        const URL = `${EnvVariable.BASEURL}/customers/list`;
        return axios
          .get(URL)
          .then((response) => {
            if (
              response?.data?.status_code === 200 &&
              response?.data?.is_data
            ) {
              let d;
              d = response.data.data.map((row) => {
                const preparePhone =
                  row.countryCode && row.msisdn
                    ? row.countryCode + row.msisdn
                    : null;
                const phone = preparePhone ? preparePhone.split("+") : null;
                return {
                  uuid: row.uuid,
                  type: row.type,
                  name: row.name,
                  orgIdOrPNumber: row.organizationId
                    ? row.organizationId
                    : row.personalNumber,
                  phone: phone ? "+" + phone[phone.length - 1] : null,
                  email: row.email,
                  lastInvoicedOn: row.lastOrderOn,
                  lastOrderAmount: row.lastOrderAmount,
                  status: row.status,
                  street: row?.billingAddress?.street,
                  city: row?.billingAddress?.city,
                  zip: row?.billingAddress?.zip,
                  country: row?.billingAddress?.country,
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
            // reject(e?.response?.data?.message)
            if (e?.response?.data?.status_code === 404)
              resolve(e.response.data);
            reject(e?.response?.data?.message);
          });
      } else {
        return AuthService.axiosRequestHelper()
          .then((status) => {
            if (status) {
              const URL = `${EnvVariable.BASEURL}/customers/list`;
              return axios
                .get(URL)
                .then((response) => {
                  if (
                    response?.data?.status_code === 200 &&
                    response?.data?.is_data
                  ) {
                    let d;
                    d = response.data.data.map((row) => {
                      const preparePhone =
                        row.countryCode && row.msisdn
                          ? row.countryCode + row.msisdn
                          : null;
                      const phone = preparePhone
                        ? preparePhone.split("+")
                        : null;
                      return {
                        uuid: row.uuid,
                        type: row.type,
                        name: row.name,
                        orgIdOrPNumber: row.organizationId
                          ? row.organizationId
                          : row.personalNumber,
                        phone: phone ? "+" + phone[phone.length - 1] : null,
                        email: row.email,
                        lastInvoicedOn: row.lastOrderOn,
                        lastOrderAmount: row.lastOrderAmount,
                        status: row.status,
                        street: row?.billingAddress?.street,
                        city: row?.billingAddress?.city,
                        zip: row?.billingAddress?.zip,
                        country: row?.billingAddress?.country,
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
                  // reject(e?.response?.data?.message)
                  if (e?.response?.data?.status_code === 404)
                    resolve(e.response.data);
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

  getOrganizationDetailsByUUID = async (id) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/organization/data/${id}`;
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

  getCustomerDetailsByUUID = async (id) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/details/${id}`;
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

  makeInactiveCustomerByUUID = async (id) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/change/status/${id}`;
            return axios
              .put(URL)
              .then((response) => {
                // if (response?.data.status_code === 200) {
                //   resolve(response.data);
                // }else reject("somethingWentWrong");
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

  prepareUpdatePrivateCustomerPayload = (
    params,
    sameAddress,
    billingUUID,
    shippingUUID,
    dialCode
  ) => {
    const primaryPhoneNumber = params?.primaryPhoneNumber
      ? params.primaryPhoneNumber.split("+")
      : null;
    const billingPhoneNumber = params?.billingPhoneNumber
      ? params.billingPhoneNumber.split("+")
      : null;
    const shippingPhoneNumber = params?.shippingPhoneNumber
      ? params.shippingPhoneNumber.split("+")
      : null;

    const data = {
      customerID: params.customerID,
      name: params.customerName,
      countryCode: dialCode
        ? dialCode
        : null,
      msisdn: params?.primaryPhoneNumber
        ? params?.primaryPhoneNumber.slice(dialCode?.length)
        : null,
      personalNumber: `${params.pNumber !== null ? params.pNumber : ""}`,
      email: params.customerEmail,
      addresses: {
        billing: {
          uuid: billingUUID,
          street: params.billingAddress,
          zip: params?.billingZip,
          city: params.billingCity,
          country: params.billingCountry,
        },
      },
    };

    if (sameAddress) {
      data.addresses["shipping"] = {
        uuid: shippingUUID,
        street: params.billingAddress,
        zip: params?.billingZip,
        city: params.billingCity,
        country: params.billingCountry,
      };
    } else if (!sameAddress) {
      data.addresses["shipping"] = {
        uuid: shippingUUID ? shippingUUID : null,
        street: params.shippingAddress,
        zip: params.shippingZip,
        city: params.shippingCity,
        country: params.shippingCountry,
      };
    }

    return data;
  };

  updatePrivateCustomerByUUID = async (
    params,
    sameAddress,
    billingUUID,
    shippingUUID
  ) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/update/private/${params.customerID}`;

            const primaryPhoneNumber = params?.primaryPhoneNumber
              ? params.primaryPhoneNumber.split("+")
              : null;
            const billingPhoneNumber = params?.billingPhoneNumber
              ? params.billingPhoneNumber.split("+")
              : null;
            const shippingPhoneNumber = params?.shippingPhoneNumber
              ? params.shippingPhoneNumber.split("+")
              : null;

            const data = {
              name: params.customerName,
              countryCode: primaryPhoneNumber
                ? "+" +
                  primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
                : null,
              msisdn: primaryPhoneNumber
                ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
                : null,
              personalNumber: `${
                params.pNumber !== null ? params.pNumber : ""
              }`,
              email: params.customerEmail,
              addresses: {
                billing: {
                  uuid: billingUUID,
                  street: params.billingAddress,
                  zip: params?.billingZip,
                  city: params.billingCity,
                  country: params.billingCountry,
                },
              },
            };

            if (sameAddress) {
              data.addresses["shipping"] = {
                uuid: shippingUUID,
                street: params.billingAddress,
                zip: params?.billingZip,
                city: params.billingCity,
                country: params.billingCountry,
              };
            } else if (!sameAddress) {
              data.addresses["shipping"] = {
                uuid: shippingUUID ? shippingUUID : null,
                street: params.shippingAddress,
                zip: params.shippingZip,
                city: params.shippingCity,
                country: params.shippingCountry,
              };
            }

            return axios
              .put(URL, data)
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

  prepareUpdateCorporateCustomerPayload = (
    params,
    sameAddress,
    detailsInfo,
    dialCode
  ) => {
    const primaryPhoneNumber = params?.primaryPhoneNumber
      ? params.primaryPhoneNumber.split("+")
      : null;
    const billingPhoneNumber = params?.billingPhoneNumber
      ? params.billingPhoneNumber.split("+")
      : null;
    const shippingPhoneNumber = params?.shippingPhoneNumber
      ? params.shippingPhoneNumber.split("+")
      : null;
    const phone = params?.phone ? params.phone.split("+") : null;

    const msisdn = params?.primaryPhoneNumber
      ? params?.primaryPhoneNumber.slice(dialCode?.length)
      : null;
    const countryCode = dialCode
      ? dialCode
      : null;
    const bl_msisdn = billingPhoneNumber
      ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
      : null;
    const bl_countryCode = billingPhoneNumber
      ? "+" + billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
      : null;
    const sh_msisdn = shippingPhoneNumber
      ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
      : null;
    const sh_countryCode = shippingPhoneNumber
      ? "+" + shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
      : null;
    const ad_p_msisdn = phone ? phone[phone.length - 1].slice(2) : null;
    const ad_p_countryCode = phone
      ? "+" + phone[phone.length - 1].slice(0, 2)
      : null;

    const additionalCDs =
      !params.fullName &&
      !params.email &&
      !params.designation &&
      !params.phone &&
      !params.notes
        ? null
        : {
            0: {
              uuid:
                detailsInfo?.additionalContactDetails &&
                detailsInfo?.additionalContactDetails[0]?.uuid
                  ? detailsInfo?.additionalContactDetails[0]?.uuid
                  : null,
              name: params.fullName,
              email: params.email,
              designation: params.designation,
              countryCode: ad_p_countryCode,
              msisdn: ad_p_msisdn,
              note: params.notes,
            },
          };
    const paramsContact = params.contact;
    if (params.contact.length) {
      for (let i = 0; i < params.contact.length; i++) {
        if (
          !paramsContact[i].fullName ||
          !paramsContact[i].designation ||
          !paramsContact[i].email ||
          !paramsContact[i].phone ||
          !paramsContact[i].note
        )
          paramsContact.splice(i, 1);
      }
    }
    const additionalData = paramsContact
      ? paramsContact.map((row) => {
          const phone = row?.phone ? row.phone.split("+") : null;
          const msisdn = phone ? phone[phone.length - 1].slice(2) : null;
          const countryCode = phone
            ? "+" + phone[phone.length - 1].slice(0, 2)
            : null;

          return {
            name: row?.fullName ? row?.fullName : "",
            email: row?.email ? row?.email : "",
            designation: row?.designation ? row?.designation : "",
            countryCode,
            msisdn,
            note: row?.notes ? row?.notes : "",
          };
        })
      : null;

    if (additionalData.length) {
      for (let i = 1; i <= additionalData.length; i++) {
        additionalData[i - 1].uuid =
          detailsInfo.additionalContactDetails &&
          detailsInfo?.additionalContactDetails[i]?.uuid
            ? detailsInfo.additionalContactDetails[i]?.uuid
            : null;
        additionalCDs[i] = additionalData[i - 1];
      }
    }

    const data = {
      customerID: params.customerID,
      name: params.OrganizationName ? params.OrganizationName : null,
      countryCode: countryCode,
      msisdn: msisdn,
      email: params.orgEmail ? params.orgEmail : null,
      organizationId: params.organizationID ? params.organizationID : null,
      addresses: {
        billing: {
          uuid:
            detailsInfo?.addresses && detailsInfo?.addresses?.billing?.uuid
              ? detailsInfo?.addresses?.billing?.uuid
              : null,
          street: params.billingAddress,
          zip: params.billingZip,
          city: params.billingCity,
          country: params.billingCountry,
        },
      },
      // additionalContactDetails: additionalCDs,
      additionalContact: additionalCDs,
    };

    if (sameAddress) {
      data.addresses["shipping"] = {
        // uuid:
        //   detailsInfo?.addresses && detailsInfo?.addresses?.billing?.uuid
        //     ? detailsInfo?.addresses?.billing?.uuid
        //     : null,
        uuid:
          detailsInfo?.addresses && detailsInfo?.addresses?.shipping?.uuid
            ? detailsInfo?.addresses?.shipping?.uuid
            : null,
        street: params.billingAddress,
        zip: params.billingZip,
        city: params.billingCity,
        country: params.billingCountry,
      };
    } else if (!sameAddress) {
      data.addresses["shipping"] = {
        uuid:
          detailsInfo?.addresses && detailsInfo?.addresses?.shipping?.uuid
            ? detailsInfo?.addresses?.shipping?.uuid
            : null,
        street: params.shippingAddress,
        zip: params.shippingZip,
        city: params.shippingCity,
        country: params.shippingCountry,
      };
    }

    return data;
  };

  updateCorporateCustomerByUUID = async (params, sameAddress, detailsInfo) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const primaryPhoneNumber = params?.primaryPhoneNumber
              ? params.primaryPhoneNumber.split("+")
              : null;
            const billingPhoneNumber = params?.billingPhoneNumber
              ? params.billingPhoneNumber.split("+")
              : null;
            const shippingPhoneNumber = params?.shippingPhoneNumber
              ? params.shippingPhoneNumber.split("+")
              : null;
            const phone = params?.phone ? params.phone.split("+") : null;

            const msisdn = primaryPhoneNumber
              ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
              : null;
            const countryCode = primaryPhoneNumber
              ? "+" +
                primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
              : null;
            const bl_msisdn = billingPhoneNumber
              ? billingPhoneNumber[billingPhoneNumber.length - 1].slice(2)
              : null;
            const bl_countryCode = billingPhoneNumber
              ? "+" +
                billingPhoneNumber[billingPhoneNumber.length - 1].slice(0, 2)
              : null;
            const sh_msisdn = shippingPhoneNumber
              ? shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(2)
              : null;
            const sh_countryCode = shippingPhoneNumber
              ? "+" +
                shippingPhoneNumber[shippingPhoneNumber.length - 1].slice(0, 2)
              : null;
            const ad_p_msisdn = phone ? phone[phone.length - 1].slice(2) : null;
            const ad_p_countryCode = phone
              ? "+" + phone[phone.length - 1].slice(0, 2)
              : null;

            const additionalCDs =
              !params.fullName &&
              !params.email &&
              !params.designation &&
              !params.phone &&
              !params.notes
                ? null
                : {
                    0: {
                      uuid:
                        detailsInfo?.additionalContactDetails &&
                        detailsInfo?.additionalContactDetails[0]?.uuid
                          ? detailsInfo?.additionalContactDetails[0]?.uuid
                          : null,
                      name: params.fullName,
                      email: params.email,
                      designation: params.designation,
                      countryCode: ad_p_countryCode,
                      msisdn: ad_p_msisdn,
                      note: params.notes,
                    },
                  };

            const paramsContact = params.contact;
            if (params.contact.length) {
              for (let i = 0; i < params.contact.length; i++) {
                if (
                  !paramsContact[i].fullName ||
                  !paramsContact[i].designation ||
                  !paramsContact[i].email ||
                  !paramsContact[i].phone ||
                  !paramsContact[i].note
                )
                  paramsContact.splice(i, 1);
              }
            }

            const additionalData = paramsContact
              ? paramsContact.map((row) => {
                  const phone = row?.phone ? row.phone.split("+") : null;
                  const msisdn = phone
                    ? phone[phone.length - 1].slice(2)
                    : null;
                  const countryCode = phone
                    ? "+" + phone[phone.length - 1].slice(0, 2)
                    : null;

                  return {
                    name: row?.fullName ? row?.fullName : "",
                    email: row?.email ? row?.email : "",
                    designation: row?.designation ? row?.designation : "",
                    countryCode,
                    msisdn,
                    note: row?.notes ? row?.notes : "",
                  };
                })
              : null;

            if (additionalData.length) {
              for (let i = 1; i <= additionalData.length; i++) {
                additionalData[i - 1].uuid =
                  detailsInfo.additionalContactDetails &&
                  detailsInfo?.additionalContactDetails[i]?.uuid
                    ? detailsInfo.additionalContactDetails[i]?.uuid
                    : null;
                additionalCDs[i] = additionalData[i - 1];
              }
            }

            const data = {
              name: params.OrganizationName ? params.OrganizationName : null,
              countryCode: countryCode,
              msisdn: msisdn,
              email: params.orgEmail ? params.orgEmail : null,
              organizationId: params.organizationID
                ? params.organizationID
                : null,
              addresses: {
                billing: {
                  uuid:
                    detailsInfo?.addresses &&
                    detailsInfo?.addresses?.billing?.uuid
                      ? detailsInfo?.addresses?.billing?.uuid
                      : null,
                  street: params.billingAddress,
                  zip: params.billingZip,
                  city: params.billingCity,
                  country: params.billingCountry,
                },
              },
              // additionalContactDetails: additionalCDs,
              additionalContact: additionalCDs,
            };

            if (sameAddress) {
              data.addresses["shipping"] = {
                uuid:
                  detailsInfo?.addresses &&
                  detailsInfo?.addresses?.billing?.uuid
                    ? detailsInfo?.addresses?.billing?.uuid
                    : null,
                street: params.billingAddress,
                zip: params.billingZip,
                city: params.billingCity,
                country: params.billingCountry,
              };
            } else if (!sameAddress) {
              data.addresses["shipping"] = {
                uuid:
                  detailsInfo?.addresses &&
                  detailsInfo?.addresses?.shipping?.uuid
                    ? detailsInfo?.addresses?.shipping?.uuid
                    : null,
                street: params.shippingAddress,
                zip: params.shippingZip,
                city: params.shippingCity,
                country: params.shippingCountry,
              };
            }
            const URL = `${EnvVariable.BASEURL}/customers/update/corporate/${params.customerID}`;
            return axios
              .put(URL, data)
              .then((response) => {
                if (response?.data.status_code === 202) {
                  resolve(response.data);
                } else reject("Something went wrong 3");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject("Something went wrong 2");
        })
        .catch((e) => {
          reject("Something went wrong 1");
        });
    });
  };

  getCutomerJournals = async (id, startTime) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/journal/${id}/${startTime}`;
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
                // reject(e?.response?.data?.message)
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

  getCustomerTimelineByUUID = async (uuid, startTime) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/${uuid}/timeline/${startTime}`;
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
                // reject(e?.response?.data?.message)
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

  addCustomerJournal = async (id, note) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/journal/${id}`;
            return axios
              .post(URL, { text: note })
              .then((response) => {
                if (response?.data.status_code === 201) {
                  resolve(response?.data);
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

  customerOrdersList = async (id) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/customers/${id}/orders`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  let d;
                  d = response.data.data.map((row) => {
                    const preparePhone =
                      row.countryCode && row.msisdn
                        ? row.countryCode + row.msisdn
                        : null;
                    const phone = preparePhone ? preparePhone.split("+") : null;
                    return {
                      uuid: row.orderUuid,
                      dateCreated: row.dateCreated,
                      orderId: row.orderUuid,
                      paymentLinkDueDate: row.paymentLinkDueDate,
                      name: row.name,
                      dueDate: row.paymentLinkDueDate,
                      phone: phone ? "+" + phone[phone.length - 1] : null,
                      email: row?.email ? row?.email : null,
                      amount: row.amount,
                      stage: row?.status ? row?.status.toLowerCase() : null,
                      // stage: row?.status ? row?.status.toLowerCase() : null,
                      refundResend:
                        row.status.toLowerCase() === "sent"
                          ? "Resend"
                          : row.status.toLowerCase() === "paid" ||
                            row.status.toLowerCase() === "partial refunded"
                          ? // || row.status.toLowerCase() === "invoiced"
                            "Refund"
                          : null,
                      isCancel: row.status.toLowerCase() === "sent",
                      translationKey: row.translationKey,
                      // enableSendInvoice:
                      //   row?.type.toLowerCase() === "quick" &&
                      //   !row?.exportedToAptic &&
                      //   row?.status.toLowerCase() === "expired",
                      enableSendInvoice: row.showExportButton,
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
                // reject(e?.response?.data?.message)
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
}

const instance = new CustomersService();
export default instance;
