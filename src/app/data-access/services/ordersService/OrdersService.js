import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";
import { FP_ADMIN } from "../../../utils/user-roles/UserRoles";
import { ThousandSeparator } from "../../../utils/helperFunctions";

class OrdersService {
  //Not using - Shifted RTK-Query
  ordersList = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/list`;
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
                      date: row.dateCreated,
                      id: row.orderUuid,
                      name: row.name,
                      dueDate: row.paymentLinkDueDate,
                      phone: phone ? "+" + phone[phone.length - 1] : null,
                      email: row?.email ? row?.email : null,
                      amount: row.amount,
                      stage: row?.status ? row?.status.toLowerCase() : null,
                      // stage: "Partial Refunded",
                      refundResend:
                        row.status.toLowerCase() === "sent"
                          ? "Resend"
                          : row.status.toLowerCase() === "paid" ||
                            row.status.toLowerCase() === "partial refunded" ||
                            row.status.toLowerCase() === "invoiced"
                          ? "Refund"
                          : null,
                      isCancel: row.status.toLowerCase() === "sent",
                      // refundResend: "Resend",
                      // isCancel: true,
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

  mapOrderList = (data) => {
    let d;
    d = data.map((row) => {
      const preparePhone =
        row.countryCode && row.msisdn ? row.countryCode + row.msisdn : null;
      const phone = preparePhone ? preparePhone.split("+") : null;

      //On the fly get the order is expired or not
      const dueDate = row.paymentLinkDueDate;
      const splitedTimeAndDate = dueDate.split(", ");
      const splitedDates = splitedTimeAndDate[1].split(".");
      const formatedDate = `${splitedTimeAndDate[0]} ${splitedDates[1]}.${splitedDates[0]}.${splitedDates[2]}`;
      const dueDateTimeStamp = new Date(formatedDate).getTime();
      const currentTimeStamp = new Date().getTime();
      const isExpired =
        row.status.toLowerCase() === "sent" &&
        dueDateTimeStamp < currentTimeStamp;

      return {
        uuid: row.orderUuid,
        date: row.dateCreated,
        id: row.orderUuid,
        name: row.name,
        dueDate: row.paymentLinkDueDate,
        phone: phone ? "+" + phone[phone.length - 1] : null,
        email: row?.email ? row?.email : null,
        amount: ThousandSeparator(row.amount),
        stage: row?.status
          ? isExpired
            ? "expired"
            : row.status.toLowerCase()
          : null,
        // stage: "Partial Refunded",
        refundResend: isExpired
          ? null
          : row.status.toLowerCase() === "sent"
          ? "Resend"
          : row.status.toLowerCase() === "paid" ||
            row.status.toLowerCase() === "partial refunded" ||
            row.status.toLowerCase() === "refund pending"
          ? // || row.status.toLowerCase() === "invoiced"
            "Refund"
          : null,
        isCancel: !isExpired && row.status.toLowerCase() === "sent",
        // refundResend: "Resend",
        // isCancel: true,
      };
    });
    return d;
  };

  prepareCreateOrderPayload = (params) => {
    const products =
      params.order.length &&
      params.order
        .filter(
          (ordr) =>
            ordr.productName !== undefined &&
            ordr.quantity !== undefined &&
            ordr.rate !== undefined &&
            ordr.tax !== undefined &&
            ordr.productName !== null &&
            ordr.quantity !== null &&
            ordr.rate !== null &&
            ordr.tax !== null &&
            ordr.productName !== "" &&
            ordr.quantity !== "" &&
            ordr.rate !== "" &&
            ordr.tax !== ""
        )
        .map((order) => {
          //Decimal comma to dot separator conversion logic
          const rate = order.rate;
          const splitedRate = rate.toString().includes(",")
            ? rate.split(",")
            : rate;
          const dotFormatRate =
            typeof splitedRate === "object"
              ? `${splitedRate[0]}.${splitedRate[1]}`
              : splitedRate;
          const floatRate = parseFloat(dotFormatRate);

          return {
            name: order?.productName ? order?.productName : null,
            productId: order.productID,
            quantity: order.quantity,
            // rate: order.rate,
            rate: floatRate,
            discount: order?.discount ? order?.discount : 0,
            tax: order.tax,
            amount:
              order.quantity && order.rate
                ? parseInt(order.quantity) * parseFloat(floatRate) -
                  parseFloat(order?.discount ? order.discount : 0)
                : null,
          };
        });

    const billingAddress =
      params.billingAddress ||
      params.billingZip ||
      params.billingCity ||
      params.billingCountry
        ? {
            street: params.billingAddress ? params.billingAddress : null,
            zip: params.billingZip ? params.billingZip : null,
            city: params.billingCity ? params.billingCity : null,
            country: params.billingCountry ? params.billingCountry : null,
          }
        : null;
    const invoiceReferences =
      params.referenceNumber ||
      params.internalReference ||
      params.customerReference ||
      params.customerNotes ||
      params.termsConditions ||
      params.receiptNo
        ? {
            referenceNo: params.referenceNumber ? params.referenceNumber : null,
            internalReference: params.internalReference
              ? params.internalReference
              : null,
            customerReference: params.customerReference
              ? params.customerReference
              : null,
            customerNotes: params.customerNotes ? params.customerNotes : null,
            receiptNo: params.receiptNo ? params.receiptNo : null,
            tnc: params.termsConditions ? params.termsConditions : null,
          }
        : null;
    const internalReferences =
      params.referenceNumber ||
      params.internalReference ||
      params.customerReference ||
      params.customerNotes ||
      params.termsConditions ||
      params.receiptNo
        ? {
            referenceNo: params.referenceNumber ? params.referenceNumber : null,
            notes: params.customerNotes ? params.customerNotes : null,
          }
        : null;
    const primaryPhoneNumber = params.primaryPhoneNumber.split("+");
    return {
      products: {
        ...products,
      },
      orderSummary: params.orderSummary,
      orderDate: this.prepareDate(params.orderDate),
      // dueDateForPaymentLink: this.prepareDate(params.dueDatePaymentLink),
      dueDateForPaymentLink: isNaN(
        `${new Date(params.dueDatePaymentLink).getTime() / 1000}`
      )
        ? `${new Date(parseInt(params.dueDatePaymentLink)) / 1000}`
        : `${new Date(params.dueDatePaymentLink).getTime() / 1000}`,
      // dueDateForInvoice: this.prepareDate(params.dueDateInvoice),
      sendOrderBy: {
        sms: params.orderBy === "sms",
        email: params.orderBy === "email",
        invoice: params.orderBy === "invoice",
      },
      isCreditCheckAvailable: params.isCeditCheck,
      customerDetails: {
        type: params.customerType,
        countryCode: primaryPhoneNumber
          ? "+" + primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
          : null,
        msisdn: primaryPhoneNumber
          ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
          : null,
        email: params.email,
        name: params.customerName,
        personalNumber:
          params.customerType === "private"
            ? params.orgorPID
              ? params.orgorPID
              : null
            : null,
        organizationId:
          params.customerType === "corporate"
            ? params.orgorPID
              ? params.orgorPID
              : null
            : null,
        address: billingAddress,
      },
      invoiceReferences,
      internalReferences,
    };
  };

  prepareResendOrderPayload = (params) => {
    const phone = params?.phone ? params.phone.split("+") : null;
    const msisdn = phone ? phone[phone.length - 1].slice(2) : null;
    const countryCode = phone
      ? "+" + phone[phone.length - 1].slice(0, 2)
      : null;

    return {
      uuid: params.uuid,
      countryCode: params?.checkPhone && countryCode ? countryCode : null,
      msisdn: params?.checkPhone && msisdn ? msisdn : null,
      email: params?.checkEmail ? params?.email : null,
    };
  };

  //Not using - Shifted RTK-Query
  createOrder = async (params) => {
    const products =
      params.order.length &&
      params.order
        .filter(
          (ordr) =>
            ordr.productName !== undefined &&
            ordr.quantity !== undefined &&
            ordr.rate !== undefined &&
            ordr.tax !== undefined &&
            ordr.productName !== null &&
            ordr.quantity !== null &&
            ordr.rate !== null &&
            ordr.tax !== null &&
            ordr.productName !== "" &&
            ordr.quantity !== "" &&
            ordr.rate !== "" &&
            ordr.tax !== ""
        )
        .map((order) => {
          return {
            name: order?.productName ? order?.productName : null,
            productId: order.productID,
            quantity: order.quantity,
            rate: order.rate,
            discount: order?.discount ? order?.discount : 0,
            tax: order.tax,
            amount:
              order.quantity && order.rate
                ? parseInt(order.quantity) * parseFloat(order.rate) -
                  parseFloat(order?.discount ? order.discount : 0)
                : null,
          };
        });

    const billingAddress =
      params.billingAddress ||
      params.billingZip ||
      params.billingCity ||
      params.billingCountry
        ? {
            street: params.billingAddress ? params.billingAddress : null,
            zip: params.billingZip ? params.billingZip : null,
            city: params.billingCity ? params.billingCity : null,
            country: params.billingCountry ? params.billingCountry : null,
          }
        : null;
    const invoiceReferences =
      params.referenceNumber ||
      params.internalReference ||
      params.customerReference ||
      params.customerNotes ||
      params.termsConditions ||
      params.receiptNo
        ? {
            referenceNo: params.referenceNumber ? params.referenceNumber : null,
            internalReference: params.internalReference
              ? params.internalReference
              : null,
            customerReference: params.customerReference
              ? params.customerReference
              : null,
            customerNotes: params.customerNotes ? params.customerNotes : null,
            receiptNo: params.receiptNo ? params.receiptNo : null,
            tnc: params.termsConditions ? params.termsConditions : null,
          }
        : null;
    const internalReferences =
      params.referenceNumber ||
      params.internalReference ||
      params.customerReference ||
      params.customerNotes ||
      params.termsConditions ||
      params.receiptNo
        ? {
            referenceNo: params.referenceNumber ? params.referenceNumber : null,
            notes: params.customerNotes ? params.customerNotes : null,
          }
        : null;
    const primaryPhoneNumber = params.primaryPhoneNumber.split("+");
    const data = {
      products: {
        ...products,
      },
      orderSummary: params.orderSummary,
      orderDate: this.prepareDate(params.orderDate),
      // dueDateForPaymentLink: this.prepareDate(params.dueDatePaymentLink),
      dueDateForPaymentLink: isNaN(
        `${new Date(params.dueDatePaymentLink).getTime() / 1000}`
      )
        ? `${new Date(parseInt(params.dueDatePaymentLink)) / 1000}`
        : `${new Date(params.dueDatePaymentLink).getTime() / 1000}`,
      // dueDateForInvoice: this.prepareDate(params.dueDateInvoice),
      sendOrderBy: {
        sms: params.orderBy === "sms",
        email: params.orderBy === "email",
        invoice: params.orderBy === "invoice",
      },
      isCreditCheckAvailable: params.isCeditCheck,
      customerDetails: {
        type: params.customerType,
        countryCode: primaryPhoneNumber
          ? "+" + primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
          : null,
        msisdn: primaryPhoneNumber
          ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
          : null,
        email: params.email,
        name: params.customerName,
        personalNumber:
          params.customerType === "private"
            ? params.orgorPID
              ? params.orgorPID
              : null
            : null,
        organizationId:
          params.customerType === "corporate"
            ? params.orgorPID
              ? params.orgorPID
              : null
            : null,
        address: billingAddress,
      },
      invoiceReferences,
      internalReferences,
    };

    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/create`;
            return axios
              .post(URL, data)
              .then((response) => {
                if (response?.data?.status_code === 201) {
                  resolve(response.data);
                } else reject("somethingWentWrong");
              })
              .catch((e) => {
                reject(e?.response?.data?.message);
              });
          } else reject([]);
        })
        .catch((e) => {
          reject("somethingWentWrong");
        });
    });
  };

  updateOrder = async (params) => {
    const billingAddress =
      params.billingAddress ||
      params.billingZip ||
      params.billingCity ||
      params.billingCountry
        ? {
            street: params.billingAddress ? params.billingAddress : null,
            zip: params.billingZip ? params.billingZip : null,
            city: params.billingCity ? params.billingCity : null,
            country: params.billingCountry ? params.billingCountry : null,
          }
        : null;
    const primaryPhoneNumber = params.phone.split("+");

    const data = {
      customerDetails: {
        // isExisting: !params.isNewCustomer,
        // uuid: !params.isNewCustomer ? params?.customerUuid : null,
        type: params.customerType,
        countryCode: primaryPhoneNumber
          ? "+" + primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
          : null,
        msisdn: primaryPhoneNumber
          ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
          : null,
        email: params.email,
        name: params.customerName,
        personalNumber:
          params.customerType === "private" ? params.orgIdOrPNumber : null,
        organizationId:
          params.customerType === "corporate" ? params.orgIdOrPNumber : null,
        address: { ...billingAddress },
      },
      // billingAddress,
      submitPayment: {
        via: params.paymentMethod,
        currency: "NOK",
      },
    };

    const config = {
      headers: {
        Authorization: `Bearer QXNrZUFtYXJNb25WYWxvTmVpO01vbkFtYXJLZW1vbktlbW9uS29yZQ==`,
      },
    };
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/orders/update/${params.orderUuid}`;
      return axios
        .post(URL, data, config)
        .then((response) => {
          // if (response?.data?.status_code === 202) {
          if (response?.data?.status_code === 202) {
            resolve(response.data);
          } else reject("somethingWentWrong");
        })
        .catch((e) => {
          // reject(e?.response?.data?.message)
          reject(e?.response?.data?.message);
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

  getOrdersDetailsByUUID = (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/details/${uuid}`;
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

  getOrdersDetailsByUUIDPayment = (uuid) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/orders/details/${uuid}`;
      const config = {
        headers: {
          Authorization: `Bearer QXNrZUFtYXJNb25WYWxvTmVpO01vbkFtYXJLZW1vbktlbW9uS29yZQ==`,
        },
      };

      return (
        axios
          .get(URL, config)
          // .get(URL)
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
          })
      );
    });
  };

  getPaymentLinkOpenStatus = (uuid) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/orders/viewed/${uuid}`;
      const config = {
        headers: {
          Authorization: `Bearer QXNrZUFtYXJNb25WYWxvTmVpO01vbkFtYXJLZW1vbktlbW9uS29yZQ==`,
        },
      };

      return (
        axios
          .get(URL, config)
          // .get(URL)
          .then((response) => {
            if (response?.data?.status_code === 202) {
              resolve(response.data);
            } else reject("somethingWentWrong");
          })
          .catch((e) => {
            if (e?.response?.data?.status_code === 111)
              resolve(e.response.data);
            reject(e?.response?.data?.message);
          })
      );
    });
  };

  //Not using - Shifted RTK-Query
  resendOrder = (params) => {
    const phone = params?.phone ? params.phone.split("+") : null;
    const msisdn = phone ? phone[phone.length - 1].slice(2) : null;
    const countryCode = phone
      ? "+" + phone[phone.length - 1].slice(0, 2)
      : null;

    const body = {
      countryCode: params?.checkPhone && countryCode ? countryCode : null,
      msisdn: params?.checkPhone && msisdn ? msisdn : null,
      email: params?.checkEmail ? params?.email : null,
    };

    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/resend/${params.uuid}`;
            return axios
              .post(URL, body)
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

  //Not using - Shifted RTK-Query
  cancelOrder = (params) => {
    const body = {
      cancellationNote: params?.cancellationNote
        ? params.cancellationNote
        : null,
    };
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/cancel/${params.uuid}`;
            return axios
              .post(URL, body)
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

  //Not using - Shifted RTK-Query
  refundOrder = (params) => {
    const body = {
      isPartial: params.isPartial,
      amount: parseFloat(params.refundAmount),
    };

    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/refund/${params.uuid}`;
            return axios
              .post(URL, body)
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

  exportOrderList = async (uuidToken) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL =
              uuidToken === FP_ADMIN
                ? `${EnvVariable.BASEURL}/orders/export`
                : `${EnvVariable.BASEURL}/orders/export/${uuidToken}`;
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
                      Ordrenr: row?.orderNumber ? row?.orderNumber : "-",
                      Client: row?.clientName ? row?.clientName : "-",
                      InvoiceNumber: row?.invoiceNumber
                        ? row?.invoiceNumber
                        : "-",
                      Kunde: row?.customerName ? row?.customerName : "-",
                      KundeType: row?.customerType ? row?.customerType : "-",
                      Betalingsmetode: row?.paymentMethod
                        ? row?.paymentMethod
                        : "-",
                      ImportedDate: row?.orderDate ? row?.orderDate : "-",
                      SMSDate: row?.smsDate ? row?.smsDate : "-",
                      Bestillingstid: row?.paymentDate ? row?.paymentDate : "-",
                      Total: row?.amount ? row?.amount : "-",
                      Status: row?.status ? row?.status : "-",
                    };
                  });
                  // d.status_code = 200;
                  // d.is_data = true;
                  resolve(d);
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
    });
  };

  getOrdersLogByUUID = async (uuid) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/log/${uuid}`;
            return axios
              .get(URL)
              .then((response) => {
                if (
                  response?.data?.status_code === 200 &&
                  response?.data?.is_data
                ) {
                  resolve(response?.data);
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

  mapRefundRequestsList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        date: row.dateRequested,
        id: row.orderId,
        clientName: row.clientName,
        customerName: row.customerName,
        orderAmount: row.orderAmount,
        refundAmount: row.refundAmount,
        stage: row?.status ? row?.status.toLowerCase() : null,
        approveAction: row?.status ? row?.status.toLowerCase() : null,
        isCancel: row?.status.toLowerCase() === "refund pending",
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  refundRequests = async () => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/refund/list/all`;
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
                      date: row.dateRequested,
                      id: row.orderId,
                      clientName: row.clientName,
                      customerName: row.customerName,
                      orderAmount: row.orderAmount,
                      refundAmount: row.refundAmount,
                      stage: row?.status ? row?.status.toLowerCase() : null,
                      approveAction: row?.status
                        ? row?.status.toLowerCase()
                        : null,
                      isCancel: row?.status.toLowerCase() === "pending",
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

  refundRequestDecision = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const URL = `${EnvVariable.BASEURL}/orders/refund/decision/${params.orderUuid}`;
            return axios
              .post(URL, params)
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

  requestRefundApproval = async (params) => {
    return new Promise((resolve, reject) => {
      return AuthService.axiosRequestHelper()
        .then((status) => {
          if (status) {
            const payload = {
              isPartial: params?.isPartial,
              amount: params?.refundAmount,
              message: params?.message,
            };
            const URL = `${EnvVariable.BASEURL}/orders/refund/request/approval/${params.uuid}`;
            return axios
              .post(URL, payload)
              .then((response) => {
                if (response?.data?.status_code === 201) {
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
}

const instance = new OrdersService();
export default instance;
