import * as yup from "yup";
export const validateSchemaCreateOrderPrivate = yup.object().shape({
  orderDate: yup
    .string()
    .typeError("youMustEnterOrderDate")
    .required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup.string().required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  // dueDatePaymentLink: yup.string()
  //   .when( "orderDate",
  //     (orderDate, field)=> orderDate ? field.required() : field
  //   )
  // orgorPID: yup
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "pNumberMustBeNumber",
      excludeEmptyString: true,
    })
    .notRequired()
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(11, "mustBeExactlyElevenNumbers")
    .max(11, "mustBeExactlyElevenNumbers"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["quantity", "rate", "tax"], {
          is: (quantity, rate, tax) => quantity || rate || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      quantity: yup.lazy(() =>
        yup.string().when(["productName", "rate", "tax"], {
          is: (productName, rate, tax) => productName || rate || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "rate"], {
          is: (productName, quantity, rate) => productName || quantity || rate,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
});
export const validateSchemaCreateOrderPrivateOrderByEmail = yup.object().shape({
  orderDate: yup
    .string()
    .typeError("youMustEnterOrderDate")
    .required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup.string().required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  email: yup
    .string()
    .email("youMustEnterAValidEmail")
    .required("youMustEnterAEmail"),
  // orgorPID: yup
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "pNumberMustBeNumber",
      excludeEmptyString: true,
    })
    .notRequired()
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(11, "mustBeExactlyElevenNumbers")
    .max(11, "mustBeExactlyElevenNumbers"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["quantity", "rate", "tax"], {
          is: (quantity, rate, tax) => quantity || rate || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      quantity: yup.lazy(() =>
        yup.string().when(["productName", "rate", "tax"], {
          is: (productName, rate, tax) => productName || rate || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "rate"], {
          is: (productName, quantity, rate) => productName || quantity || rate,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
});

export const validateSchemaCreateOrderCorporate = yup.object().shape({
  orderDate: yup
    .string()
    .typeError("youMustEnterOrderDate")
    .required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup.string().required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  // orgorPID: yup
  orgID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("youMustEnterOrganizationID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "mustBeExactlyNineNumbers")
    .max(9, "mustBeExactlyNineNumbers"),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["quantity", "rate", "tax"], {
          is: (quantity, rate, tax) => quantity || rate || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      quantity: yup.lazy(() =>
        yup.string().when(["productName", "rate", "tax"], {
          is: (productName, rate, tax) => productName || rate || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "rate"], {
          is: (productName, quantity, rate) => productName || quantity || rate,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
});

export const validateSchemaCreateOrderCorporateOrderBySms = yup.object().shape({
  orderDate: yup
    .string()
    .typeError("youMustEnterOrderDate")
    .required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup.string().required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  // orgorPID: yup
  orgID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("youMustEnterOrganizationID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "mustBeExactlyNineNumbers")
    .max(9, "mustBeExactlyNineNumbers"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterPhoneNumberAsSelectedOrderBySMS")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["quantity", "rate", "tax"], {
          is: (quantity, rate, tax) => quantity || rate || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      quantity: yup.lazy(() =>
        yup.string().when(["productName", "rate", "tax"], {
          is: (productName, rate, tax) => productName || rate || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "rate"], {
          is: (productName, quantity, rate) => productName || quantity || rate,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
});

export const CreateOrderDefaultValue = {
  order: [],
  orderDate: "",
  dueDatePaymentLink: "",
  primaryPhoneNumber: "",
  email: "",
  customerName: "",
  // orgorPID : "",
  orgID: "",
  pNumber: "",
  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",
  referenceNumber: "",
  customerReference: "",
  receiptNo: "",
  customerNotes: "",
  termsConditions: "",
  internalReferenceNo: "",
  customerNotesInternal: "",
};

export const validateSchemaPaymentCheckoutCorporate = yup.object().shape({
  phone: yup
    .string()
    .required("youMustEnterYourPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  orgIdOrPNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "organizationIdMustBeNumber",
      excludeEmptyString: true,
    })
    .required("youMustEnterOrganizationID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "mustBeExactlyNineNumbers")
    .max(9, "mustBeExactlyNineNumbers"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
});
export const validateSchemaPaymentCheckout = yup.object().shape({
  phone: yup
    .string()
    .required("youMustEnterYourPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  orgIdOrPNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "pNumberMustBeNumber",
      excludeEmptyString: true,
    })
    .notRequired()
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(11, "mustBeExactlyElevenNumbers")
    .max(11, "mustBeExactlyElevenNumbers"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
});
export const validateSchemaCreditCheckForCheckout = yup.object().shape({
  orgIdCreditCheck: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .typeError("enterValidID")
    .required("youMustEnterTheCreditCheckId")
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "enterValidID")
    .max(11, "enterValidID"),
});

export const PaymentDefaultValue = {
  phone: "",
  email: "",
  customerName: "",
  orgIdOrPNumber: "",
  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",
  orgIdCreditCheck: "",
};
export const OrderModalDefaultValue = {
  phone: "",
  email: "",
  cancellationNote: "",
  refundAmount: "",
  chargeAmount: "",
  captureAmount: "",
  order: [],
};

export const validateSchemaOrderResendModal = yup.object().shape({
  phone: yup
    .string()
    .required("youMustEnterYourPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
});
export const validateSchemaOrderCancelModal = yup.object().shape({
  cancellationNote: yup
    .string()
    .max(200, "cancellationNoteRules")
    .required("youMustEnterTheCancellationNote"),
});
export const validateSchemaOrderRefundModal = yup.object().shape({
  refundAmount: yup.string().required("youMustEnterTheRefundAmount"),
});
export const validateSchemaReservationCaptureModal = yup.object().shape({
  captureAmount: yup.string().required("youMustEnterTheCaptureAmount"),
});
export const validateSchemaReservationRefundModal = yup.object().shape({});
export const validateSchemaMoreThanFiveThousand = yup.object().shape({
  cancellationNote: yup.string().notRequired(),
});

export const sendInvoiceValidation = yup.object().shape({
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "pNumberMustBeNumber",
      excludeEmptyString: true,
    })
    .notRequired()
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(11, "mustBeExactlyElevenNumbers")
    .max(11, "mustBeExactlyElevenNumbers"),
  streetAddress: yup.string().required("youMustEnterYourStreetAddress"),
  zipCode: yup.string().required("enterZIP"),
});

export const sendInvoiceValidationCorporate = yup.object().shape({
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  orgID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("youMustEnterOrganizationID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "mustBeExactlyNineNumbers")
    .max(9, "mustBeExactlyNineNumbers"),
  streetAddress: yup.string().required("youMustEnterYourStreetAddress"),
  zipCode: yup.string().required("enterZIP"),
});
export const sendInvoiceDefaultValue = {
  city: "",
  country: "",
  customerName: "",
  email: "",
  orgIdOrPNumber: "",
  phone: "",
  streetAddress: "",
  zipCode: "",
};

export const quickOrderValidation = yup.object().shape({
  // searchCustomer: yup.string().required("youMustSelectACustomer"),
  orderDate: yup
    .string()
    .typeError("youMustEnterOrderDate")
    .required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup
    .string()
    .required("youMustEnterPaymentLinkDueDate")
    .typeError("youMustEnterPaymentLinkDueDate"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["quantity", "rate", "tax"], {
          is: (quantity, rate, tax) => quantity || rate || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      quantity: yup.lazy(() =>
        yup.string().when(["productName", "rate", "tax"], {
          is: (productName, rate, tax) => productName || rate || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "rate"], {
          is: (productName, quantity, rate) => productName || quantity || rate,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
});
export const quickOrderDefaultValue = {
  searchCustomer: "",
  orderDate: "",
  dueDatePaymentLink: "",
  referenceNumber: "",
  customerReference: "",
  order: [],
  customerNotes: "",
  termsConditions: "",
};

export const validateSchemaCompleteReservationModal = yup.object().shape({
  cancellationNote: yup
    .string()
    .max(200, "completionNoteRules")
    .required("youMustEnterTheCompletionNote"),
});
export const validateSchemaReservationChargeCardModal = yup.object().shape({
  //chargeAmount: yup.string().required("youMustEnterTheChargeAmount"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["reservationAmount", "tax"], {
          is: (reservationAmount, tax) => reservationAmount || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      reservationAmount: yup.lazy(() =>
        yup.string().when(["productName", "tax"], {
          is: (productName, tax) => productName || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "reservationAmount"], {
          is: (productName, reservationAmount) =>
            productName || reservationAmount,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
});

/************* For reservation create *********************/
export const validateSchemaCreateReservation = yup.object().shape({
  orderDate: yup
    .string()
    .typeError("youMustEnterOrderDate")
    .required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup.string().required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  order: yup.array().of(
    yup.object().shape({
      // productName: yup.string().required('name'),
      productName: yup.lazy(() =>
        yup.string().when(["reservationAmount", "tax"], {
          is: (reservationAmount, tax) => reservationAmount || tax,
          // is: "",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
      reservationAmount: yup.lazy(() =>
        yup.string().when(["productName", "tax"], {
          is: (productName, tax) => productName || tax,
          // is: "",
          then: yup
            .string()
            .required("")
            .matches(/^[0-9,]+$/),
          // otherwise: yup.string()
        })
      ),
      tax: yup.lazy(() =>
        yup.string().when(["productName", "reservationAmount"], {
          is: (productName, reservationAmount) =>
            productName || reservationAmount,
          // is:"",
          then: yup.string().required(""),
          // otherwise: yup.string()
        })
      ),
    })
  ),
  customerNotes: yup.string().max(200, ""),
  termsConditions: yup.string().max(200, ""),
});

export const CreateReservationDefaultValue = {
  order: [],
  orderDate: "",
  dueDatePaymentLink: "",
  primaryPhoneNumber: "",
  email: "",
  customerName: "",
  // orgorPID : "",
  orgID: "",
  pNumber: "",
  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",
  referenceNumber: "",
  customerReference: "",
  receiptNo: "",
  customerNotes: "",
  termsConditions: "",
  internalReferenceNo: "",
  customerNotesInternal: "",
};

/************* For customer modal *********************/
export const validateSchemaCustomerPrivate = yup.object().shape({
  primaryPhoneNumber: yup.string().required("youMustEnterYourPhoneNumber"),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "pNumberMustBeNumber",
      excludeEmptyString: true,
    })
    .notRequired()
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(11, "mustBeExactlyElevenNumbers")
    .max(11, "mustBeExactlyElevenNumbers"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  //billingCountry: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
});

export const validateSchemaCustomerPrivateByEmail = yup.object().shape({
  primaryPhoneNumber: yup.string().required("youMustEnterYourPhoneNumber"),
  email: yup
    .string()
    .email("youMustEnterAValidEmail")
    .required("youMustEnterAEmail"),
  // orgorPID: yup
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "pNumberMustBeNumber",
      excludeEmptyString: true,
    })
    .notRequired()
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(11, "mustBeExactlyElevenNumbers")
    .max(11, "mustBeExactlyElevenNumbers"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
});

export const validateSchemaCustomerCorporate = yup.object().shape({
  orgID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("youMustEnterOrganizationID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "mustBeExactlyNineNumbers")
    .max(9, "mustBeExactlyNineNumbers"),
  primaryPhoneNumber: yup.string().required("youMustEnterYourPhoneNumber"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
  customerName: yup.string().required("youMustEnterCustomerName"),
});

export const validateSchemaCustomerCorporateBySms = yup.object().shape({
  orgID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("youMustEnterOrganizationID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "mustBeExactlyNineNumbers")
    .max(9, "mustBeExactlyNineNumbers"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  email: yup.string().required("youMustEnterAEmail").email("mustBeValidEmail"),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterPhoneNumberAsSelectedOrderBySMS"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
});

export const CustomerDefaultValue = {
  primaryPhoneNumber: "",
  email: "",
  customerName: "",
  // orgorPID : "",
  orgID: "",
  pNumber: "",
  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",
};
