import * as yup from "yup";

export const validateSchema = yup.object().shape({
  id: yup
    .string()
    .min(9, "idShouldBeNineDigit")
    .max(9, "idShouldBeNineDigit")
    .required("youMustEnterYourOrganizationId"),
  clientName: yup.string().required("youMustEnterYourClientName"),
  // organizationType: yup.string().required("You must select your organization type"),
  //parentClientName : yup.string().required("You must enter your parent client name"),
  fullName: yup.string().required("youMustEnterYourName"),
  partnerName: yup.string(),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPrimaryPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  designation: yup.string(),
  email: yup
    .string()
    .required("youMustEnterAEmail")
    .email("youMustEnterAValidEmail"),
  password: yup.string().required("youMustEnterPassword"),

  contactStartDate: yup
    .string()
    .required("youMustEnterYourContactStartDate")
    .typeError("pleaseEnterValidDate"),
  planPrice: yup.string().required("youMustEnterYourMonthlyPlanFee"),
  commision: yup.string().required("youMustEnterYourCommission"),
  smsCost: yup.string().required("youMustEnterYourSmsCost"),
  // emailCost: yup.string().required('youMustEnterYourEmailCost'),
  // creditCheckCost: yup.string().required('youMustEnterYourCreditCheckCost'),
  // ehfCost: yup.string().required('youMustEnterYourEhfCost'),

  contactEndDatep2: yup.string().required("youMustEnterYourContactEndDate"),
  commisionp2: yup.string().required("youMustEnterYourCommission"),
  smsCostp2: yup.string().required("youMustEnterYourSmsCost"),
  emailCostp2: yup.string().required("youMustEnterYourEmailCost"),
  creditCheckCostp2: yup.string().required("youMustEnterYourCreditCheckCost"),
  ehfCostp2: yup.string().required("youMustEnterYourEhfCost"),

  contactEndDatep3: yup.string().required("youMustEnterYourContactEndDate"),
  commisionp3: yup.string().required("youMustEnterYourCommission"),
  smsCostp3: yup.string().required("youMustEnterYourSmsCost"),
  emailCostp3: yup.string().required("youMustEnterYourEmailCost"),
  creditCheckCostp3: yup.string().required("youMustEnterYourCreditCheckCost"),
  ehfCostp3: yup.string().required("youMustEnterYourEhfCost"),

  billingPhoneNumber: yup
    .string()
    .required("youMustEnterYourBillingPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingEmail: yup.string().required("youMustEnterYourBillingEmail"),
  billingAddress: yup.string().required("youMustEnterYourBillingAddress"),
  zip: yup.string().required("youMustEnterYourZip"),
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),
  // shippingPhoneNumber: yup.string().required('You must enter your shipping phone number'),
  // shippingEmail: yup.string().required('You must enter your shipping email'),
  // shippingAddress: yup.string().required('You must enter your shipping address'),
  // shippingZip: yup.string().required('You must enter your shipping zip'),
  // shippingCity: yup.string().required('You must enter your shipping city'),
  // shippingCountry: yup.string().required('You must enter your shipping country'),
  // bankName: yup.string().required('youMustEnterYourBankName'),
  // accountNumber: yup.string()
  //   .required('youMustEnterYourAccountNumber')
  //   .matches(/^(\S+$)/g, 'thisFieldCannotContainBlankspaces'),
  // IBAN: yup.string().required('youMustEnterYourIban'),
  // SWIFTCode: yup.string().required('youMustEnterYourSwiftCode'),

  APTICuserName: yup.string().required("youMustEnterYourApticUserName"),
  APTICpassword: yup.string().required("youMustEnterYourApticPassword"),
  fpReference: yup.string().required("youMustEnterYourFpReference"),
  name: yup.string().required("youMustEnterYourName"),
  creditLimitCustomer: yup
    .string()
    .required("youMustEnterYourCreditLimitForCustomer"),
  APTIEngineCuserName: yup.string().required("youMustEnterUsername"),
  APTIEnginePassword: yup.string().required("youMustEnterPassword"),
  fakturaB2B: yup.string().required("youMustEnterFakturaBTwoB"),
  fakturaB2C: yup.string().required("youMustEnterFakturaBTwoC"),
});

export const validateSchemaAdministration = yup.object().shape({
  id: yup
    .string()
    .min(9, "idShouldBeNineDigit")
    .max(9, "idShouldBeNineDigit")
    .required("youMustEnterYourOrganizationId"),
  clientName: yup.string().required("youMustEnterYourClientName"),
  // organizationType: yup.string().required("You must select your organization type"),
  //parentClientName : yup.string().required("You must enter your parent client name"),
  fullName: yup.string().required("youMustEnterYourName"),
  partnerName: yup.string(),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPrimaryPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  designation: yup.string(),
  email: yup
    .string()
    .required("youMustEnterAEmail")
    .email("youMustEnterAValidEmail"),
  password: yup.string().required("youMustEnterPassword"),

  contactStartDate: yup
    .string()
    .required("youMustEnterYourContactStartDate")
    .typeError("pleaseEnterValidDate"),
  planPrice: yup.string().required("youMustEnterYourMonthlyPlanFee"),
  commision: yup.string().required("youMustEnterYourCommission"),
  smsCost: yup.string().required("youMustEnterYourSmsCost"),
  // emailCost: yup.string().required('youMustEnterYourEmailCost'),
  // creditCheckCost: yup.string().required('youMustEnterYourCreditCheckCost'),
  // ehfCost: yup.string().required('youMustEnterYourEhfCost'),

  contactEndDatep2: yup.string().required("youMustEnterYourContactEndDate"),
  commisionp2: yup.string().required("youMustEnterYourCommission"),
  smsCostp2: yup.string().required("youMustEnterYourSmsCost"),
  emailCostp2: yup.string().required("youMustEnterYourEmailCost"),
  creditCheckCostp2: yup.string().required("youMustEnterYourCreditCheckCost"),
  ehfCostp2: yup.string().required("youMustEnterYourEhfCost"),

  contactEndDatep3: yup.string().required("youMustEnterYourContactEndDate"),
  commisionp3: yup.string().required("youMustEnterYourCommission"),
  smsCostp3: yup.string().required("youMustEnterYourSmsCost"),
  emailCostp3: yup.string().required("youMustEnterYourEmailCost"),
  creditCheckCostp3: yup.string().required("youMustEnterYourCreditCheckCost"),
  ehfCostp3: yup.string().required("youMustEnterYourEhfCost"),

  billingPhoneNumber: yup
    .string()
    .required("youMustEnterYourBillingPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingEmail: yup.string().required("youMustEnterYourBillingEmail"),
  billingAddress: yup.string().required("youMustEnterYourBillingAddress"),
  zip: yup.string().required("youMustEnterYourZip"),
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),
  // shippingPhoneNumber: yup.string().required('You must enter your shipping phone number'),
  // shippingEmail: yup.string().required('You must enter your shipping email'),
  // shippingAddress: yup.string().required('You must enter your shipping address'),
  // shippingZip: yup.string().required('You must enter your shipping zip'),
  // shippingCity: yup.string().required('You must enter your shipping city'),
  // shippingCountry: yup.string().required('You must enter your shipping country'),
  // bankName: yup.string().required('youMustEnterYourBankName'),
  // accountNumber: yup.string()
  //   .required('youMustEnterYourAccountNumber')
  //   .matches(/^(\S+$)/g, 'thisFieldCannotContainBlankspaces'),
  // IBAN: yup.string().required('youMustEnterYourIban'),
  // SWIFTCode: yup.string().required('youMustEnterYourSwiftCode'),

  APTICuserName: yup.string().required("youMustEnterYourApticUserName"),
  APTICpassword: yup.string().required("youMustEnterYourApticPassword"),
  fpReference: yup.string().required("youMustEnterYourFpReference"),
  name: yup.string().required("youMustEnterYourName"),
  // creditLimitCustomer: yup.string().required('youMustEnterYourCreditLimitForCustomer'),
  APTIEngineCuserName: yup.string().required("youMustEnterUsername"),
  APTIEnginePassword: yup.string().required("youMustEnterPassword"),
  fakturaB2B: yup.string().required("youMustEnterFakturaBTwoB"),
  fakturaB2C: yup.string().required("youMustEnterFakturaBTwoC"),
});

export const validateSchemaOnBoard = yup.object().shape({
  id: yup
    .string()
    .min(9, "idShouldBeNineDigit")
    .max(9, "idShouldBeNineDigit")
    .required("youMustEnterYourOrganizationId"),
  clientName: yup.string().required("youMustEnterYourClientName"),
  // organizationType: yup.string().required("You must select your organization type"),
  //parentClientName : yup.string().required("You must enter your parent client name"),
  fullName: yup.string().required("youMustEnterYourName"),
  partnerName: yup.string(),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPrimaryPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  designation: yup.string(),
  email: yup
    .string()
    .required("youMustEnterAEmail")
    .email("youMustEnterAValidEmail"),
  // password: yup.string().required('You must enter your password'),

  contactStartDate: yup
    .string()
    .required("youMustEnterYourContactStartDate")
    .typeError("pleaseEnterValidDate"),
  planPrice: yup.string().required("youMustEnterYourMonthlyPlanFee"),
  commision: yup.string().required("youMustEnterYourCommission"),
  smsCost: yup.string().required("youMustEnterYourSmsCost"),
  // emailCost: yup.string().required('youMustEnterYourEmailCost'),
  // creditCheckCost: yup.string().required('youMustEnterYourCreditCheckCost'),
  // ehfCost: yup.string().required('youMustEnterYourEhfCost'),

  billingPhoneNumber: yup
    .string()
    .required("youMustEnterYourBillingPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingEmail: yup.string().required("youMustEnterYourBillingEmail"),
  billingAddress: yup.string().required("youMustEnterYourBillingAddress"),
  zip: yup.string().required("youMustEnterYourZip"),
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),

  // bankName: yup.string().required('youMustEnterYourBankName'),
  // accountNumber: yup.string()
  //   .required('youMustEnterYourAccountNumber')
  //   .matches(/^(\S+$)/g, 'thisFieldCannotContainBlankspaces'),
  // IBAN: yup.string().required('youMustEnterYourIban'),
  // SWIFTCode: yup.string().required('youMustEnterYourSwiftCode'),

  APTICuserName: yup.string().required("youMustEnterYourApticUserName"),
  APTICpassword: yup.string().required("youMustEnterYourApticPassword"),
  fpReference: yup.string().required("youMustEnterYourFpReference"),
  name: yup.string().required("youMustEnterYourName"),
  creditLimitCustomer: yup
    .string()
    .required("youMustEnterYourCreditLimitForCustomer"),
  APTIEngineCuserName: yup.string().required("youMustEnterUsername"),
  APTIEnginePassword: yup.string().required("youMustEnterPassword"),
  fakturaB2B: yup.string().required("youMustEnterFakturaBTwoB"),
  fakturaB2C: yup.string().required("youMustEnterFakturaBTwoC"),
});

export const validateSchemaOnBoardAdministration = yup.object().shape({
  id: yup
    .string()
    .min(9, "idShouldBeNineDigit")
    .max(9, "idShouldBeNineDigit")
    .required("youMustEnterYourOrganizationId"),
  clientName: yup.string().required("youMustEnterYourClientName"),
  // organizationType: yup.string().required("You must select your organization type"),
  //parentClientName : yup.string().required("You must enter your parent client name"),
  fullName: yup.string().required("youMustEnterYourName"),
  partnerName: yup.string(),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPrimaryPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  designation: yup.string(),
  email: yup
    .string()
    .required("youMustEnterAEmail")
    .email("youMustEnterAValidEmail"),
  // password: yup.string().required('You must enter your password'),

  contactStartDate: yup
    .string()
    .required("youMustEnterYourContactStartDate")
    .typeError("pleaseEnterValidDate"),
  planPrice: yup.string().required("youMustEnterYourMonthlyPlanFee"),
  commision: yup.string().required("youMustEnterYourCommission"),
  smsCost: yup.string().required("youMustEnterYourSmsCost"),
  // emailCost: yup.string().required('youMustEnterYourEmailCost'),
  // creditCheckCost: yup.string().required('youMustEnterYourCreditCheckCost'),
  // ehfCost: yup.string().required('youMustEnterYourEhfCost'),

  billingPhoneNumber: yup
    .string()
    .required("youMustEnterYourBillingPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingEmail: yup.string().required("youMustEnterYourBillingEmail"),
  billingAddress: yup.string().required("youMustEnterYourBillingAddress"),
  zip: yup.string().required("youMustEnterYourZip"),
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),

  // bankName: yup.string().required('youMustEnterYourBankName'),
  // accountNumber: yup.string()
  //     .required('youMustEnterYourAccountNumber')
  //     .matches(/^(\S+$)/g, 'thisFieldCannotContainBlankspaces'),
  // IBAN: yup.string().required('youMustEnterYourIban'),
  // SWIFTCode: yup.string().required('youMustEnterYourSwiftCode'),

  APTICuserName: yup.string().required("youMustEnterYourApticUserName"),
  APTICpassword: yup.string().required("youMustEnterYourApticPassword"),
  fpReference: yup.string().required("youMustEnterYourFpReference"),
  name: yup.string().required("youMustEnterYourName"),
  APTIEngineCuserName: yup.string().required("youMustEnterUsername"),
  APTIEnginePassword: yup.string().required("youMustEnterPassword"),
  fakturaB2B: yup.string().required("youMustEnterFakturaBTwoB"),
  fakturaB2C: yup.string().required("youMustEnterFakturaBTwoC"),
});

export const validateSchemaCreateClient = yup.object().shape({
  id: yup
    .string()
    .min(9, "idShouldBeNineDigit")
    .max(9, "idShouldBeNineDigit")
    .required("youMustEnterYourOrganizationId"),
  clientName: yup.string().required("youMustEnterYourClientName"),
  organizationType: yup.string().required("youMustSelectOrganizationType"),
  fullName: yup.string().required("youMustEnterYourName"),
  partnerName: yup.string(),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPrimaryPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  designation: yup.string(),
  email: yup
    .string()
    .required("youMustEnterAEmail")
    .email("youMustEnterAValidEmail"),

  contactStartDate: yup
    .string()
    .required("youMustEnterYourContactStartDate")
    .typeError("pleaseEnterValidDate"),
  planPrice: yup.string().required("youMustEnterYourMonthlyPlanFee"),
  commision: yup.string().required("youMustEnterYourCommission"),
  smsCost: yup.string().required("youMustEnterYourSmsCost"),
  // emailCost: yup.string().required('youMustEnterYourEmailCost'),
  // creditCheckCost: yup.string().required('youMustEnterYourCreditCheckCost'),
  // ehfCost: yup.string().required('youMustEnterYourEhfCost'),

  billingPhoneNumber: yup
    .string()
    .required("youMustEnterYourBillingPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingEmail: yup
    .string()
    .email("mustBeValidEmail")
    .required("youMustEnterYourBillingEmail"),
  billingAddress: yup.string().required("youMustEnterYourBillingAddress"),
  zip: yup.string().required("youMustEnterYourZip"),
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),
  // bankName: yup.string().required('youMustEnterYourBankName'),
  // accountNumber: yup.string()
  //   .required('youMustEnterYourAccountNumber')
  //   .matches(/^(\S+$)/g, 'thisFieldCannotContainBlankspaces'),
  // SWIFTCode: yup.string().required('youMustEnterYourSwiftCode'),
  // IBAN: yup.string().required('youMustEnterYourIban'),

  APTICuserName: yup.string().required("youMustEnterYourApticUserName"),
  APTICpassword: yup.string().required("youMustEnterYourApticPassword"),
  APTIEnginePassword: yup
    .string()
    .required("youMustEnterYourApticEnginePassword"),
  fpReference: yup.string().required("youMustEnterYourFpReference"),
  name: yup.string().required("youMustEnterYourName"),
  creditLimitCustomer: yup
    .string()
    .required("youMustEnterYourCreditLimitForCustomer"),
  APTIEngineCuserName: yup.string().required("youMustEnterUsername"),
  fakturaB2B: yup.string().required("youMustEnterFakturaBTwoB"),
  fakturaB2C: yup.string().required("youMustEnterFakturaBTwoC"),
});

export const validateSchemaCreateClientAdministration = yup.object().shape({
  id: yup
    .string()
    .min(9, "idShouldBeNineDigit")
    .max(9, "idShouldBeNineDigit")
    .required("youMustEnterYourOrganizationId"),
  clientName: yup.string().required("youMustEnterYourClientName"),
  organizationType: yup.string().required("youMustSelectOrganizationType"),
  fullName: yup.string().required("youMustEnterYourName"),
  partnerName: yup.string(),
  primaryPhoneNumber: yup
    .string()
    .required("youMustEnterYourPrimaryPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  designation: yup.string(),
  email: yup
    .string()
    .required("youMustEnterAEmail")
    .email("youMustEnterAValidEmail"),

  contactStartDate: yup
    .string()
    .required("youMustEnterYourContactStartDate")
    .typeError("pleaseEnterValidDate"),
  planPrice: yup.string().required("youMustEnterYourMonthlyPlanFee"),
  commision: yup.string().required("youMustEnterYourCommission"),
  smsCost: yup.string().required("youMustEnterYourSmsCost"),
  // emailCost: yup.string().required('youMustEnterYourEmailCost'),
  // creditCheckCost: yup.string().required('youMustEnterYourCreditCheckCost'),
  // ehfCost: yup.string().required('youMustEnterYourEhfCost'),

  billingPhoneNumber: yup
    .string()
    .required("youMustEnterYourBillingPhoneNumber")
    .min(8, "enterValidPhoneNumber")
    .max(15, "enterValidPhoneNumber"),
  billingEmail: yup
    .string()
    .email("mustBeValidEmail")
    .required("youMustEnterYourBillingEmail"),
  billingAddress: yup.string().required("youMustEnterYourBillingAddress"),
  zip: yup.string().required("youMustEnterYourZip"),
  city: yup.string().required("youMustEnterYourCity"),
  country: yup.string().required("youMustEnterYourCountry"),
  // bankName: yup.string().required('youMustEnterYourBankName'),
  // accountNumber: yup.string()
  //   .required('youMustEnterYourAccountNumber')
  //   .matches(/^(\S+$)/g, 'thisFieldCannotContainBlankspaces'),
  // SWIFTCode: yup.string().required('youMustEnterYourSwiftCode'),
  // IBAN: yup.string().required('youMustEnterYourIban'),

  APTICuserName: yup.string().required("youMustEnterYourApticUserName"),
  APTICpassword: yup.string().required("youMustEnterYourApticPassword"),
  APTIEnginePassword: yup
    .string()
    .required("youMustEnterYourApticEnginePassword"),
  fpReference: yup.string().required("youMustEnterYourFpReference"),
  name: yup.string().required("youMustEnterYourName"),
  // creditLimitCustomer: yup.string().required('youMustEnterYourCreditLimitForCustomer'),
  APTIEngineCuserName: yup.string().required("youMustEnterUsername"),
  fakturaB2B: yup.string().required("youMustEnterFakturaBTwoB"),
  fakturaB2C: yup.string().required("youMustEnterFakturaBTwoC"),
});

export const defaultValue = {
  id: "",
  clientName: "",
  partnerName: "",
  organizationType: "",
  parentClientName: "",
  fullName: "",
  primaryPhoneNumber: "47",
  designation: "",
  email: "",
  password: "default",

  contactStartDate: null,
  planPrice: "",
  commision: "",
  smsCost: "",
  emailCost: "",
  creditCheckCost: "",
  ehfCost: "",

  contactEndDatep2: new Date(),
  commisionp2: "0",
  smsCostp2: "0",
  emailCostp2: "0",
  creditCheckCostp2: "0",
  ehfCostp2: "0",

  contactEndDatep3: new Date(),
  commisionp3: "0",
  smsCostp3: "0",
  emailCostp3: "0",
  creditCheckCostp3: "0",
  ehfCostp3: "0",

  billingPhoneNumber: "47",
  billingEmail: "",
  billingAddress: "",
  zip: "",
  city: "",
  country: "",
  shippingPhoneNumber: "47",
  shippingEmail: "",
  shippingAddress: "",
  shippingZip: "",
  shippingCity: "",
  shippingCountry: "",
  bankAccountCode: "",
  bankName: "",
  accountNumber: "",
  IBAN: "",
  SWIFTCode: "",

  APTICuserName: "",
  APTICpassword: "",
  name: "",
  fpReference: "",
  accountCode: "",
  refundReference: "",
  creditLimitCustomer: "",
  costLimitforCustomer: "",
  costLimitforOrder: "",
  nvoicewithRegress: "",
  invoicewithoutRegress: "",

  APTIEngineCuserName: "",
  APTIEnginePassword: "",
  vat: [],
  b2bAccountCode: "",
  fakturaB2B: "",
  b2cAccountCode: "",
  fakturaB2C: "",
};

export const defaultValueOnBoard = {
  id: "",
  clientName: "",
  partnerName: "",
  organizationType: "",
  parentClientName: "",
  fullName: "",
  primaryPhoneNumber: "47",
  designation: "",
  email: "",
  password: "default",

  contactStartDate: null,
  planPrice: "",
  commision: "",
  smsCost: "",
  emailCost: "",
  creditCheckCost: "",
  ehfCost: "",

  contactEndDatep2: new Date(),
  commisionp2: "0",
  smsCostp2: "0",
  emailCostp2: "0",
  creditCheckCostp2: "0",
  ehfCostp2: "0",

  contactEndDatep3: new Date(),
  commisionp3: "0",
  smsCostp3: "0",
  emailCostp3: "0",
  creditCheckCostp3: "0",
  ehfCostp3: "0",

  billingPhoneNumber: "",
  billingEmail: "",
  billingAddress: "",
  zip: "",
  city: "",
  country: "",
  shippingPhoneNumber: "47",
  shippingEmail: "",
  shippingAddress: "",
  shippingZip: "",
  shippingCity: "",
  shippingCountry: "",
  bankAccountCode: "",
  bankName: "",
  accountNumber: "",
  IBAN: "",
  SWIFTCode: "",

  APTICuserName: "",
  APTICpassword: "",
  name: "",
  fpReference: "",
  accountCode: "",
  refundReference: "",
  creditLimitCustomer: "",
  costLimitforCustomer: "",
  costLimitforOrder: "",
  nvoicewithRegress: "",
  invoicewithoutRegress: "",

  APTIEngineCuserName: "",
  APTIEnginePassword: "",
  vat: [],
  b2bAccountCode: "",
  fakturaB2B: "",
  b2cAccountCode: "",
  fakturaB2C: "",
};

export const defaultValueCreateClient = {
  id: "",
  clientName: "",
  partnerName: "",
  organizationType: "",
  parentClientName: "",
  fullName: "",
  primaryPhoneNumber: "47",
  designation: "",
  email: "",
  password: "default",

  contactStartDate: null,
  planPrice: "",
  commision: "",
  smsCost: "",
  emailCost: "",
  creditCheckCost: "",
  ehfCost: "",

  contactEndDatep2: new Date(),
  commisionp2: "0",
  smsCostp2: "0",
  emailCostp2: "0",
  creditCheckCostp2: "0",
  ehfCostp2: "0",

  contactEndDatep3: new Date(),
  commisionp3: "0",
  smsCostp3: "0",
  emailCostp3: "0",
  creditCheckCostp3: "0",
  ehfCostp3: "0",

  billingPhoneNumber: "47",
  billingEmail: "",
  billingAddress: "",
  zip: "",
  city: "",
  country: "",
  shippingPhoneNumber: "47",
  shippingEmail: "",
  shippingAddress: "",
  shippingZip: "",
  shippingCity: "",
  shippingCountry: "",
  bankName: "",
  bankAccountCode: "",
  accountNumber: "",
  IBAN: "",
  SWIFTCode: "",

  APTICuserName: "",
  APTICpassword: "",
  name: "",
  fpReference: "",
  accountCode: "",
  refundReference: "",
  creditLimitCustomer: "",
  costLimitforCustomer: "",
  costLimitforOrder: "",
  nvoicewithRegress: "",
  invoicewithoutRegress: "",

  APTIEngineCuserName: "",
  APTIEnginePassword: "",
  vat: [],
  b2bAccountCode: "",
  fakturaB2B: "",
  b2cAccountCode: "",
  fakturaB2C: "",
};
