import * as yup from "yup";
export const validateSchemaCreateOrderPrivate = yup.object().shape({
  orderDate: yup.string().required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup
    .string()
    .required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  primaryPhoneNumber: yup.string().required("You must enter phone number"),
  // dueDatePaymentLink: yup.string()
  //   .when( "orderDate",
  //     (orderDate, field)=> orderDate ? field.required() : field
  //   )
  orgorPID: yup
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
  email: yup
    .string()
    .required("You must enter email address")
    .email("mustBeValidEmail"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("Enter ZIP"),
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
  orderDate: yup.string().required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup
    .string()
    .required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  primaryPhoneNumber: yup.string().required("You must enter phone number"),
  email: yup.string().required("You must enter email address"),
  orgorPID: yup
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
  billingZip: yup.string().required("Enter ZIP"),
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
  orderDate: yup.string().required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup
    .string()
    .required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  orgorPID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("You must enter organization id")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "pNumberMustBeNumber")
    .max(9, "pNumberMustBeNumber"),
  email: yup
    .string()
    .required("You must enter email address")
    .email("mustBeValidEmail"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("Enter ZIP"),
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
  orderDate: yup.string().required("youMustEnterOrderDate"),
  dueDatePaymentLink: yup
    .string()
    .required("youMustEnterPaymentLinkDueDate"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  orgorPID: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "Must be number",
      excludeEmptyString: true,
    })
    .required("You must enter Organization ID")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "pNumberMustBeNumber")
    .max(9, "pNumberMustBeNumber"),
  customerName: yup.string().required("youMustEnterCustomerName"),
  email: yup
    .string()
    .required("You must enter email address")
    .email("mustBeValidEmail"),
  primaryPhoneNumber: yup
    .string()
    .required("You must enter phone number as selected Order by SMS"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("Enter ZIP"),
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
};

export const validateSchemaPaymentCheckoutCorporate = yup.object().shape({
  phone: yup.string().required("You must enter phone"),
  email: yup
    .string()
    .required("You must enter email address")
    .email("mustBeValidEmail"),
  orgIdOrPNumber: yup
    .string()
    .matches(/^[0-9]+$/, {
      message: "org number must be number",
      excludeEmptyString: true,
    })
    .required("You must enter organization id")
    .nullable()
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "pNumberMustBeNumber")
    .max(9, "pNumberMustBeNumber"),
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("You must enter zip code"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustEnterYourCountry"),
});
export const validateSchemaPaymentCheckout = yup.object().shape({
  phone: yup.string().required("You must enter phone"),
  email: yup
    .string()
    .required("You must enter email address")
    .email("mustBeValidEmail"),
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
  billingAddress: yup.string().required("youMustEnterYourStreetAddress"),
  billingZip: yup.string().required("You must enter zip code"),
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
      .typeError("Enter valid id")
    .required("youMustEnterTheCreditCheckId")
    .transform((o, c) => (o === "" ? null : c))
    .min(9, "Enter valid id")
    .max(11, "Enter valid id"),
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
};

export const validateSchemaOrderResendModal = yup.object().shape({
  phone: yup.string().required("You must enter the phone"),
});
export const validateSchemaOrderCancelModal = yup.object().shape({
  cancellationNote: yup
    .string()
    .max(200, "cancellationNoteRules")
    .required("You must enter the Cancellation Note"),
});
export const validateSchemaOrderRefundModal = yup.object().shape({
  refundAmount: yup.string().required("youMustEnterTheRefundAmount"),
});
export const validateSchemaMoreThanFiveThousand = yup.object().shape({
  cancellationNote: yup.string().notRequired(),
});
