import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  organizationID: yup.string().required("youMustEnterYourOrganizationId").min(9, "idMustBeNineDigit").max(9, "idMustBeNineDigit"),
  orgEmail: yup.string().required("You must enter your Email").email("Please enter a valid email"),
  OrganizationName: yup.string().required("youMustEnterYourOrganizationName"),
  primaryPhoneNumber: yup.string().required("youMustEnterYourPhoneNumber"),
  billingAddress: yup.string().required("You must enter your Address"),
  billingZip: yup.string().required("Enter ZIP code"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("You must select your country"),
});
export const validateSchema2 = yup.object().shape({
  organizationID: yup.string().required("youMustEnterYourOrganizationId"),


});
export const validateSchemaUpdatePrivateCustomer = yup.object().shape({
  customerEmail: yup.string().required("You must enter your Email").email("Please enter a valid email"),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'pNumberMustBeNumber', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(11, 'mustBeExactlyElevenNumbers')
    .max(11, 'mustBeExactlyElevenNumbers'),
  billingAddress: yup.string().required('You must enter your address'),
  billingZip: yup.string().required('Enter ZIP'),
  billingCity: yup.string().required('youMustEnterYourCity'),
  billingCountry: yup.string().required('youMustEnterYourCountry'),
});

export const validateSchemaPrivate = yup.object().shape({
  primaryPhoneNumber: yup
    .string()
    .required('youMustEnterYourPhoneNumber'),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'pNumberMustBeNumber', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === '' ? null : c)
    .min(11, 'mustBeExactlyElevenNumbers')
    .max(11, 'mustBeExactlyElevenNumbers'),
  customerName: yup.string().required('youMustEnterYourPhoneNumber'),
  customerEmail: yup.string().required('You must enter your email').email('mustBeValidEmail'),
  billingAddress: yup.string().required('You must enter your Address'),
  billingZip: yup.string().required('Enter ZIP'),
  billingCity: yup.string().required('youMustEnterYourCity'),
  billingCountry: yup.string().required('You must select your country'),
});

export const CreateCorporateDefaultValue = {
  customerID: "",

  organizationID: "",
  OrganizationName: "",
  orgEmail: "",
  primaryPhoneNumber: "47",
  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",

  shippingPhoneNumber: "47",
  shippingEmail: "",
  shippingAddress: "",
  shippingZip: "",
  shippingCity: "",
  shippingCountry: "",
  fullName: "",
  designation: "",
  phone: "47",
  email: "",
  notes: "",
  contact: [],
};

export const CorporateDetailsDefaultValue = {
  customerID: "",

  organizationID: "",
  OrganizationName: "",
  orgEmail: "",
  primaryPhoneNumber: "47",
  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",

  shippingPhoneNumber: "47",
  shippingEmail: "",
  shippingAddress: "",
  shippingZip: "",
  shippingCity: "",
  shippingCountry: "",
  fullName: "",
  designation: "",
  phone: "47",
  email: "",
  notes: "",
  contact: [],
};

export const PrivateDefaultValue = {
  customerID: "",

  primaryPhoneNumber: "47",
  customerName: "",
  customerEmail: "",
  pNumber: "",

  billingAddress: "",
  billingZip: "",
  billingCity: "",
  billingCountry: "",

  shippingAddress: "",
  shippingZip: "",
  shippingCity: "",
  shippingCountry: "",
};
