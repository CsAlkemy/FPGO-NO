import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";
import { ThousandSeparator } from "../../../utils/helperFunctions";
import UtilsServices from "../../utils/UtilsServices";

class SubscriptionsService {
  mapSubscriptionsList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.subscriptionUuid,
        id: row.subscriptionId,
        paymentsMade: `${row?.numberOfOrder || 0}/${row.repeats}`,
        repeats: row.repeats,
        amount: row.amount,
        phone:
          row?.countryCode && row?.msisdn ? row.countryCode + row.msisdn : "",
        currency: row.currency,
        date: row.createdAt,
        name: row.customerName,
        numberOfOrder: row.numberOfOrder,
        // stage: row.status.toLowerCase(),
        stage: (row.status && row.status.toLowerCase()) || "sent",
        isPaid: row.isPaid,
        // refundResend:
        refundResend: "Resend",
        // row.status.toLowerCase() === "sent"
        //   ? "Resend"
        //   : row.status.toLowerCase() === "completed" || row.status.toLowerCase() === "cancelled" && row.isPaid
        //     ? "Refund"
        //     : null,
        // isCancel: row.status.toLowerCase() === "sent",
        isCancel: (row.status && row.status.toLowerCase() === "sent") || false,
        translationKey: row.translationKey,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  mapFailedPaymentsList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        date: row.date,
        orderId: row.orderId,
        name: row.name,
        phone:
          row?.countryCode && row?.msisdn ? row.countryCode + row.msisdn : "",
        subscriptionId: row.subscriptionId,
        amount: row.amount,
        status: row.status.toLowerCase(),
        translationKey: row.translationKey,
      };
    });
    d.status_code = 200;
    d.is_data = true;
    return d;
  };

  prepareCreateSubscriptionPayload = (params) => {
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
    const phone = params?.searchCustomer?.phone.split("+");
    return {
      products: {
        ...products,
      },
      orderSummary: params?.orderSummary || null,
      billingFrequency: `${params?.billingFrequency}`,
      numberOfRepeats: parseInt(params?.repeatsNoOfTimes) || "",
      subscriptionStartDate: UtilsServices.prepareDate(params?.orderDate) || "",
      subscriptionEndsDate:
        UtilsServices.prepareDate(params?.subscriptionEnds) || "",
      dueDateForPaymentLink: isNaN(
        `${new Date(params.dueDatePaymentLink).getTime() / 1000}`
      )
        ? `${new Date(parseInt(params.dueDatePaymentLink)) / 1000}`
        : `${new Date(params.dueDatePaymentLink).getTime() / 1000}`,
      termsAndConditions: params?.termsConditions || "",
      sendOrderBy: {
        sms: params?.sendOrderBy === "sms",
        email: params?.sendOrderBy === "email",
      },
      customerDetails: {
        type: params?.searchCustomer?.type.toLowerCase() || "",
        countryCode: phone ? "+" + phone[phone.length - 1].slice(0, 2) : null,
        msisdn: phone ? phone[phone.length - 1].slice(2) : null,
        email: params?.searchCustomer?.email || "",
        name: params?.searchCustomer?.name || "",
        personalNumber:
          params?.searchCustomer?.type.toLowerCase() === "private"
            ? params?.searchCustomer?.orgOrPNumber
            : null,
        organizationId:
          params?.searchCustomer?.type.toLowerCase() === "corporate"
            ? params?.searchCustomer?.orgOrPNumber
            : null,
        address: {
          street: params?.searchCustomer?.street || "",
          zip: params?.searchCustomer?.zip || "",
          city: params?.searchCustomer?.city || "",
          country: params?.searchCustomer?.country || "",
        },
      },
      customerNotes: params?.customerNotes || "",
    };
  };

  getSubscriptionDetailsByUUID = async (uuid, isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/subscription/details/${uuid}`;
      if (isSkipIsAuthenticated) {
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

  prepareUpdateSubscriptionPayload = (uuid, type, params) => {
    const categoryUuids = params.assignedCategories
      ? params.assignedCategories.map((product) => {
          return `${product.uuid}`;
        })
      : null;

    const pricePerUnit = params.price;
    const splitedPrice = pricePerUnit.toString().includes(",")
      ? pricePerUnit.toString().split(",")
      : pricePerUnit;
    const dotFormatPrice =
      typeof splitedPrice === "object"
        ? `${splitedPrice[0]}.${splitedPrice[1]}`
        : splitedPrice;
    const floatPrice = parseFloat(dotFormatPrice);

    return {
      uuid,
      type: type === 1 ? "Good" : "Service",
      productId: params.productID,
      name: params.productName,
      description: params.description,
      unit: params.unit,
      price: floatPrice,
      manufacturerId: type === 1 ? params.manufacturer : "Test",
      categoryUuids,
      taxRate: params.tax,
      cost: params.cost ? params.cost : null,
    };
  };

  getSubscriptionDetailsByUUIDPayment = (uuid) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/subscription/checkout/details/${uuid}`;
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
}

const instance = new SubscriptionsService();
export default instance;
