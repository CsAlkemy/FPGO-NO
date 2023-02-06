import * as yup from "yup";
export const validateSchemaCreateOrderPrivate = yup.object().shape({
  orderDate: yup.string().required("You must enter Order Date"),
  dueDatePaymentLink: yup
    .string()
    .required("You must enter Payment Link due date"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  primaryPhoneNumber: yup.string().required("You must enter phone number"),
  // dueDatePaymentLink: yup.string()
  //   .when( "orderDate",
  //     (orderDate, field)=> orderDate ? field.required() : field
  //   )
  orgorPID: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'P number must be number', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(11, 'Must be exactly 11 numbers')
    .max(11, 'Must be exactly 11 numbers'),
  email: yup
    .string()
    .required("You must enter email address")
    .email("Must be valid email"),
  billingAddress: yup.string().required("You must enter street address"),
  billingZip: yup.string().required("Enter ZIP"),
  billingCity: yup.string().required("You must enter city"),
  billingCountry: yup.string().required("You must enter country"),
  customerName: yup.string().required("You must enter customer name"),
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
          then: yup.string().required("").matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup.string().required("").matches(/^[0-9]+$/),
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
  orderDate: yup.string().required("You must enter Order Date"),
  dueDatePaymentLink: yup
    .string()
    .required("You must enter Payment Link due date"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  primaryPhoneNumber: yup.string().required("You must enter phone number"),
  email: yup
    .string()
    .required("You must enter email address"),
  orgorPID: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'P number must be number', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(11, 'Must be exactly 11 numbers')
    .max(11, 'Must be exactly 11 numbers'),
  billingAddress: yup.string().required("You must enter street address"),
  billingZip: yup.string().required("Enter ZIP"),
  billingCity: yup.string().required("You must enter city"),
  billingCountry: yup.string().required("You must enter country"),
  customerName: yup.string().required("You must enter customer name"),
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
          then: yup.string().required("").matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup.string().required("").matches(/^[0-9]+$/),
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
  orderDate: yup.string().required("You must enter Order Date"),
  dueDatePaymentLink: yup
    .string()
    .required("You must enter Payment Link due date"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  orgorPID: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'Must be number', excludeEmptyString: true })
    .required('You must enter organization id')
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(9, 'Must be exactly 9 numbers')
    .max(9, 'Must be exactly 9 numbers'),
  email: yup
    .string()
    .required("You must enter email address")
    .email("Must be valid email"),
  billingAddress: yup.string().required("You must enter street address"),
  billingZip: yup.string().required("Enter ZIP"),
  billingCity: yup.string().required("You must enter city"),
  billingCountry: yup.string().required("You must enter country"),
  customerName: yup.string().required("You must enter customer name"),
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
          then: yup.string().required("").matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup.string().required("").matches(/^[0-9]+$/),
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
  orderDate: yup.string().required("You must enter Order Date"),
  dueDatePaymentLink: yup
    .string()
    .required("You must enter Payment Link due date"),
  // dueDateInvoice: yup.string().required("You must enter Invoice due date"),
  orgorPID: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'Must be number', excludeEmptyString: true })
    .required('You must enter Organization ID')
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(9, 'Must be exactly 9 numbers')
    .max(9, 'Must be exactly 9 numbers'),
  customerName: yup.string().required("You must enter customer name"),
  email: yup
    .string()
    .required("You must enter email address")
    .email("Must be valid email"),
  primaryPhoneNumber: yup
    .string()
    .required("You must enter phone number as selected Order by SMS"),
  billingAddress: yup.string().required("You must enter street address"),
  billingZip: yup.string().required("Enter ZIP"),
  billingCity: yup.string().required("You must enter city"),
  billingCountry: yup.string().required("You must enter country"),
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
          then: yup.string().required("").matches(/^[0-9]+$/),
          // otherwise: yup.string()
        })
      ),
      rate: yup.lazy(() =>
        yup.string().when(["productName", "quantity", "tax"], {
          is: (productName, quantity, tax) => productName || quantity || tax,
          // is: "",
          then: yup.string().required("").matches(/^[0-9]+$/),
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
  phone: yup.string().required('You must enter phone'),
  email: yup.string().required('You must enter email address').email('Must be valid email'),
  orgIdOrPNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'org number must be number', excludeEmptyString: true })
    .required('You must enter organization id')
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(9, 'Must be exactly 9 numbers')
    .max(9, 'Must be exactly 9 numbers'),
  billingAddress: yup.string().required("You must enter street address"),
  billingZip: yup.string().required("You must enter zip code"),
  billingCity: yup.string().required("You must enter your city"),
  billingCountry: yup.string().required("You must enter country"),

});
export const validateSchemaPaymentCheckout = yup.object().shape({
  phone: yup.string().required('You must enter phone'),
  email: yup.string().required('You must enter email address').email('Must be valid email'),
  orgIdOrPNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'P number must be number', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(11, 'Must be exactly 11 numbers')
    .max(11, 'Must be exactly 11 numbers'),
  billingAddress: yup.string().required("You must enter street address"),
  billingZip: yup.string().required("You must enter zip code"),
  billingCity: yup.string().required("You must enter your city"),
  billingCountry: yup.string().required("You must enter country"),

});
export const validateSchemaCreditCheckForCheckout = yup.object().shape({
  orgIdCreditCheck: yup.string().required('You must enter the credit check ID')
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
  orgIdCreditCheck: ""
};
export const OrderModalDefaultValue = {
  phone: "",
  email: "",
  cancellationNote: "",
  refundAmount: "",
};

export const validateSchemaOrderResendModal = yup.object().shape({
  phone: yup.string().required('You must enter the phone')
});
export const validateSchemaOrderCancelModal = yup.object().shape({
  cancellationNote: yup.string().max(200, "Must be 200 characters or less").required('You must enter the Cancellation Note')
});
export const validateSchemaOrderRefundModal = yup.object().shape({
  refundAmount: yup.string().required('You must enter the Refund amount')
});
export const validateSchemaMoreThanFiveThousand = yup.object().shape({
  cancellationNote: yup.string().notRequired()
});