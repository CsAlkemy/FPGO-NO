import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  organizationID: yup.string().required("You must enter your organization ID").min(9, "ID must be 9 digit").max(9, "ID must be 9 digit"),
  orgEmail: yup.string().required("You must enter your Email").email("Please enter a valid email"),
  OrganizationName: yup.string().required("You must enter your organization Name"),
  primaryPhoneNumber: yup.string().required("You must enter your phone number"),
  billingAddress: yup.string().required("You must enter your Address"),
  billingZip: yup.string().required("Enter ZIP code"),
  billingCity: yup.string().required("You must enter your city"),
  billingCountry: yup.string().required("You must select your country"),
});
export const validateSchema2 = yup.object().shape({
  organizationID: yup.string().required("You must enter your organization ID"),


});
export const validateSchemaUpdatePrivateCustomer = yup.object().shape({
  customerEmail: yup.string().required("You must enter your Email").email("Please enter a valid email"),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'P number must be number', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === "" ? null : c)
    .min(11, 'Must be exactly 11 numbers')
    .max(11, 'Must be exactly 11 numbers'),
  billingAddress: yup.string().required('You must enter your address'),
  billingZip: yup.string().required('Enter ZIP'),
  billingCity: yup.string().required('You must enter your city'),
  billingCountry: yup.string().required('You must enter your country'),
});

export const validateSchemaPrivate = yup.object().shape({
  primaryPhoneNumber: yup
    .string()
    .required('You must enter your Phone Number'),
  pNumber: yup
    .string()
    .matches(/^[0-9]+$/, { message: 'P number must be number', excludeEmptyString: true })
    .notRequired()
    .nullable().transform((o, c) => o === '' ? null : c)
    .min(11, 'Must be exactly 11 numbers')
    .max(11, 'Must be exactly 11 numbers'),
  customerName: yup.string().required('You must enter your Phone Number'),
  customerEmail: yup.string().required('You must enter your email').email('Must be valid email'),
  billingAddress: yup.string().required('You must enter your Address'),
  billingZip: yup.string().required('Enter ZIP'),
  billingCity: yup.string().required('You must enter your city'),
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
