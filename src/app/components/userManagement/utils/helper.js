import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  // designation: yup.string().required('You must enter your designation'),
  organization: yup.string().required('You must enter your organization'),
  //subClient: yup.string().required('You must select your sub client'),
  branch: yup.string().required('You must select your branch'),
  role: yup.string().required('You must select your role'),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  currentPassword: yup
    .string()
    .required('pleaseEnterYourCurrentPassword.')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

// Validate schema for ClientAdmin
export const validateSchemaCreateBranchAdmin = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  branch: yup.string().required('You must select your branch'),
  // designation: yup.string().required("You must enter your designation"),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});
export const validateSchemaCreateCompanyAdmin = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  preferredLanguage: yup.string().required("youMustSelectYourPreferredLanguage"),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'passwordCombinationRules'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

// end of validate schema for ClientAdmin

// Validate schema for FpAdmin
export const validateSchemaCreateBusinessAdmin = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  organization: yup.string().required('youMustEnterOrganization'),
  preferredLanguage: yup.string().required("youMustSelectYourPreferredLanguage"),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'passwordCombinationRules'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

export const validateSchemaGeneralAdmin = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  organization: yup.string().required('You must enter your organization'),
  preferredLanguage: yup.string().required("youMustSelectYourPreferredLanguage"),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'passwordCombinationRules'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

// end of validate schema for FpAdmin

// Validate schema for SubClientAdmin
export const schemaSubClientCreateBranch = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  branch: yup.string().required('You must select your branch'),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});
export const schemaSubClientCreateGeneralUser = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  branch: yup.string(), // .required('You must select your branch'),
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

// end of validate schema for SubClientAdmin

// validate schema for userProfile
export const schemaUserProfile = yup.object().shape({
  fullName: yup.string().required('youMustEnterYourName'),
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  phoneNumber : yup.string().required('youMustEnterYourPhoneNumber'),
  organization : yup.string().required('youMustEnterYourOrganizationName'),
  role : yup.string().required('youMustEnterYourRole'),
  // preferredLanguage : yup.string().required('youMustSelectYourPreferredLanguage'),
});

export const schemaUserProfileFpAdmin = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  //phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  organization: yup.string().required('youMustEnterOrganization'),
  //organization: yup.string().required('You must enter your organization'),
  // designation: yup.string().required("You must enter your designation"),
  role: yup.string().required('youMustSelectYourRole'),
  branch: yup.string().required('youMustSelectYourBranch'),
  // preferredLanguage : yup.string().required('youMustSelectYourPreferredLanguage'),
});
export const schemaUserProfileFpAdminSubClient = yup.object().shape({
  email: yup.string().email('youMustEnterAValidEmail').required('youMustEnterAEmail'),
  fullName: yup.string().required('youMustEnterYourName'),
  //phoneNumber: yup.string().required('youMustEnterYourPhoneNumber'),
  organization: yup.string().required('You must enter your organization'),
  // designation: yup.string().required("You must enter your designation"),
  role: yup.string().required('You must select your role'),
  branch: yup.string().required('You must select your branch'),
  userID: yup.string().required('You must select your user ID'),
});

export const schemaUserProfileResetPass = yup.object().shape({
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'passwordCombinationRules'
    ),
  currentPassword: yup.string().required('pleaseEnterYourCurrentPassword'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

export const schemaUserProfileResetPassUserDetails = yup.object().shape({
  password: yup
    .string()
    .required('pleaseEnterYourPassword')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'passwordCombinationRules'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'bothPasswordNeedToBeTheSame'),
  }),
});

export const defaultValues = {
  email: '',
  fullName: '',
  phoneNumber: '47',
  password: '',
  designation: '',
  role: '',
  confirmpassword: '',
  currentPassword: '',
  organization: '',
  branch: '',
  userID: '',
  isSend:true,
  preferredLanguage:''
};
