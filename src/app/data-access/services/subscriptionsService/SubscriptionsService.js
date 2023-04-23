import React from "react";
import axios from "axios";
import { EnvVariable } from "../../utils/EnvVariables";
import AuthService from "../authService/AuthService";
import { ThousandSeparator } from "../../../utils/helperFunctions";

class SubscriptionsService {
  mapSubscriptionsList = (data) => {
    let d;
    d = data.map((row) => {
      return {
        uuid: row.uuid,
        id: row.id,
        date: row.date,
        name: row.name,
        phone: row?.countryCode && row?.msisdn ? row.countryCode+row.msisdn : "",
        paymentsMade: row.paymentsMade,
        amount: row.amount,
        stage: row.status.toLowerCase(),
        isPaid: row.isPaid,
        refundResend:
          row.status.toLowerCase() === "sent"
            ? "Resend"
            : row.status.toLowerCase() === "completed" || row.status.toLowerCase() === "cancelled" && row.isPaid
              ? "Refund"
              : null,
        isCancel: row.status.toLowerCase() === "sent",
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
        phone: row?.countryCode && row?.msisdn ? row.countryCode+row.msisdn : "",
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
    const categoryUuids = params.assignedCategories
      ? params.assignedCategories.map((product) => {
        return `${product.uuid}`;
      })
      : null;

    const pricePerUnit = params.price;
    const splitedPrice = pricePerUnit.toString().includes(",") ? pricePerUnit.toString().split(",") : pricePerUnit;
    const dotFormatPrice =
      typeof splitedPrice === "object"
        ? `${splitedPrice[0]}.${splitedPrice[1]}`
        : splitedPrice;
    const floatPrice = parseFloat(dotFormatPrice);
    return {
      // type: type === 1 ? "Good" : "Service",
      type: "Good",
      productId: params.productID,
      name: params.productName,
      description: params.description,
      unit: params.unit,
      price: floatPrice,
      manufacturerId: params?.manufacturer ? params?.manufacturer : null,
      categoryUuids,
      taxRate: params.tax,
      cost: params.cost ? params.cost : null,
    };
  };

  subscriptionDetailsByUUID = async (uuid, isSkipIsAuthenticated) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/products/details/${uuid}`;
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
    const splitedPrice = pricePerUnit.toString().includes(",") ? pricePerUnit.toString().split(",") : pricePerUnit;
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
}

const instance = new SubscriptionsService();
export default instance;
