import * as yup from 'yup';

export const validateSchema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  // designation: yup.string().required('You must enter your designation'),
  organization: yup.string().required('You must enter your organization'),
  //subClient: yup.string().required('You must select your sub client'),
  branch: yup.string().required('You must select your branch'),
  role: yup.string().required('You must select your role'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  currentPassword: yup
    .string()
    .required('Please enter your current password.')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

// Validate schema for ClientAdmin
export const validateSchemaCreateBranchAdmin = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  branch: yup.string().required('You must select your branch'),
  // designation: yup.string().required("You must enter your designation"),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});
export const validateSchemaCreateCompanyAdmin = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  preferredLanguage: yup.string().required("You must select your preferred language"),
  password: yup
    .string()
    .required('Please enter your password.')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'Password must be at least 8-15 digits and contain number and alphabets.'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

// end of validate schema for ClientAdmin

// Validate schema for FpAdmin
export const validateSchemaCreateBusinessAdmin = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  preferredLanguage: yup.string().required("You must select your preferred language"),
  password: yup
    .string()
    .required('Please enter your password.')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'Password must be at least 8-15 digits and contain number and alphabets.'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

export const validateSchemaGeneralAdmin = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  organization: yup.string().required('You must enter your organization'),
  preferredLanguage: yup.string().required("You must select your preferred language"),
  password: yup
    .string()
    .required('Please enter your password.')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'Password must be at least 8-15 digits and contain number and alphabets.'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

// end of validate schema for FpAdmin

// Validate schema for SubClientAdmin
export const schemaSubClientCreateBranch = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  branch: yup.string().required('You must select your branch'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});
export const schemaSubClientCreateGeneralUser = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  phoneNumber: yup.string().required('You must enter your phone number'),
  branch: yup.string(), // .required('You must select your branch'),
  password: yup
    .string()
    .required('Please enter your password.')
    .min(8, 'Password is too short - must be at least 8 chars.'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

// end of validate schema for SubClientAdmin

// validate schema for userProfile
export const schemaUserProfile = yup.object().shape({
  fullName: yup.string().required('You must enter your name'),
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  phoneNumber : yup.string().required('You must enter your phone number'),
  organization : yup.string().required('You must enter your organization'),
  role : yup.string().required('You must enter your role'),
  // preferredLanguage : yup.string().required('You must select your preferred language'),
});

export const schemaUserProfileFpAdmin = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  //phoneNumber: yup.string().required('You must enter your phone number'),
  organization: yup.string().required('You must enter your organization'),
  // designation: yup.string().required("You must enter your designation"),
  role: yup.string().required('You must select your role'),
  branch: yup.string().required('You must select your branch'),
  // preferredLanguage : yup.string().required('You must select your preferred language'),
});
export const schemaUserProfileFpAdminSubClient = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  fullName: yup.string().required('You must enter your name'),
  //phoneNumber: yup.string().required('You must enter your phone number'),
  organization: yup.string().required('You must enter your organization'),
  // designation: yup.string().required("You must enter your designation"),
  role: yup.string().required('You must select your role'),
  branch: yup.string().required('You must select your branch'),
  userID: yup.string().required('You must select your user ID'),
});

export const schemaUserProfileResetPass = yup.object().shape({
  password: yup
    .string()
    .required('Please enter your password.')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'Password must be at least 8-15 digits and contain number and alphabets.'
    ),
  currentPassword: yup.string().required('Please enter your current password'),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
  }),
});

export const schemaUserProfileResetPassUserDetails = yup.object().shape({
  password: yup
    .string()
    .required('Please enter your password.')
    .matches(
      /^(?=.*\d)[A-Za-z\d@$!%*?&~]{8,}$/,
      'Password must be at least 8-15 digits and contain number and alphabets.'
    ),
  confirmpassword: yup.string().when('password', {
    is: (val) => !!(val && val.length > 0),
    then: yup.string().oneOf([yup.ref('password')], 'Both password need to be the same'),
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
