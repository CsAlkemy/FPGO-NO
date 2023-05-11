import { ro } from "date-fns/locale";

class ReservationService {

  prepareCreateReservationPayload = (params) => {
    //console.log(params);
    const products =
      params.order.length &&
      params.order
        .filter(
          (ordr) =>
            ordr.productName !== undefined &&
            ordr.reservationAmount !== undefined &&
            ordr.tax !== undefined &&
            ordr.productName !== null &&
            ordr.reservationAmount !== null &&
            ordr.tax !== null &&
            ordr.productName !== "" &&
            ordr.reservationAmount !== "" &&
            ordr.tax !== ""
        )
        .map((order) => {
          //Decimal comma to dot separator conversion logic
          const rate = order.reservationAmount;
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
            //quantity: order.quantity,
            // rate: order.rate,
            rate: floatRate,
            //discount: order?.discount ? order?.discount : 0,
            tax: order.tax,
            amount: floatRate
          };
        });

    const billingAddress =
      params.street ||
      params.zip ||
      params.city ||
      params.country
        ? {
          street: params.street ? params.street : null,
          zip: params.zip ? params.zip : null,
          city: params.city ? params.city : null,
          country: params.country ? params.country : null,
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
    const primaryPhoneNumber = params.phone.split("+");
    const userID = params.uuid ? params.uuid : '';
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
        email: params.orderBy === "email"
      },
      //isCreditCheckAvailable: params.isCeditCheck,
      customerDetails: {
        uuid: userID,
        type: params.customerType,
        countryCode: primaryPhoneNumber
          ? "+" + primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(0, 2)
          : null,
        msisdn: primaryPhoneNumber
          ? primaryPhoneNumber[primaryPhoneNumber.length - 1].slice(2)
          : null,
        email: params.email,
        name: params.name,
        personalNumber:
          params.customerType === "private"
            ? params?.orgOrPNumber
              ? params.orgOrPNumber
              : null
            : null,
        organizationId:
          params.customerType === "corporate"
            ? params?.orgOrPNumber
              ? params.orgOrPNumber
              : null
            : null,
        address: billingAddress,
      },
      //invoiceReferences,
      //internalReferences,
      referenceNo: params.referenceNumber,
      customerReference: params.customerReference,
      customerNotes: params.customerNotes,
      tnc: params.termsConditions
    };
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

  mapReservationList = (data) => {
    let lists;
    lists = data.map(row => {
      const preparePhone = row.countryCode && row.msisdn ? row.countryCode + row.msisdn : null;

      return {
        uuid: row.reservationUuid,
        id: row.reservationUuid,
        date: row.dateCreated,
        phone: preparePhone,
        email: row.email,
        isPaid: row.isPaid,
        clientName: row.clientName ?? null,
        customer: row.customerName,
        amountPaid: row.amountPaid,
        amountInBank: row.amountInBank,
        reservedAmount: row.reservedAmount,
        remainingAmount: row.remainingCaptureRunway ?? null,
        status: row.status.toLowerCase(),
        translationKey: row.translationKey
      }
    });

    return lists;
  };

}

const instance = new ReservationService();
export default instance;