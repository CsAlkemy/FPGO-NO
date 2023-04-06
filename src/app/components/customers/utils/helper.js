import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  organizationID: yup.string().required("youMustEnterYourOrganizationId").min(9, "idMustBeNineDigit").max(9, "idMustBeNineDigit"),
  orgEmail: yup.string().required("youMustEnterYourEmail").email("youMustEnterAValidEmail"),
  OrganizationName: yup.string().required("youMustEnterYourOrganizationName"),
  primaryPhoneNumber: yup.string().required("youMustEnterYourPhoneNumber")
      .min(8, "enterValidPhoneNumber")
      .max(15, "enterValidPhoneNumber"),
  billingAddress: yup.string().required("youMustEnterYourAddress"),
  billingZip: yup.string().required("enterZIP"),
  billingCity: yup.string().required("youMustEnterYourCity"),
  billingCountry: yup.string().required("youMustSelectYourCountry"),
});
export const validateSchema2 = yup.object().shape({
  organizationID: yup.string().required("youMustEnterYourOrganizationId"),


});
export const validateSchemaUpdatePrivateCustomer = yup.object().shape({
  primaryPhoneNumber: yup.string().required("youMustEnterYourPhoneNumber")
      .min(8, "enterValidPhoneNumber")
      .max(15, "enterValidPhoneNumber"),
  customerEmail: yup.string().required("youMustEnterAEmail").email("youMustEnterAValidEmail"),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'pNumberMustBeNumber', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(11, 'mustBeExactlyElevenNumbers')
    .max(11, 'mustBeExactlyElevenNumbers'),
  billingAddress: yup.string().required('youMustEnterYourAddress'),
  billingZip: yup.string().required('enterZIP'),
  billingCity: yup.string().required('youMustEnterYourCity'),
  billingCountry: yup.string().required('youMustEnterYourCountry'),
});

export const validateSchemaPrivate = yup.object().shape({
  primaryPhoneNumber: yup
    .string()
    .required('youMustEnterYourPhoneNumber')
      .min(8, "enterValidPhoneNumber")
      .max(15, "enterValidPhoneNumber"),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'pNumberMustBeNumber', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === '' ? null : c)
    .min(11, 'mustBeExactlyElevenNumbers')
    .max(11, 'mustBeExactlyElevenNumbers'),
  customerName: yup.string().required('youMustEnterYourPhoneNumber'),
  customerEmail: yup.string().required('youMustEnterAEmail').email('mustBeValidEmail'),
  billingAddress: yup.string().required('youMustEnterYourAddress'),
  billingZip: yup.string().required('enterZIP'),
  billingCity: yup.string().required('youMustEnterYourCity'),
  billingCountry: yup.string().required('youMustSelectYourCountry'),
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

  primaryPhoneNumber: "",
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
