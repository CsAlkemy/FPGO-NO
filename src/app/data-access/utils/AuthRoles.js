/**
 * Authorization Roles
 */
const authRoles = {
  fpAdmin: ['fp-admin'],
  brandManager: ['brand-manager'],
  groupManager: ['group-manager'],
  businessAdmin: ['business-admin'],
  user: ['user'],
  allUser : ['fp-admin', 'brand-manager', 'group-manager', 'business-admin', 'user'],
  allUserInclucingUnAuthenticatedUser : ['', 'fp-admin', 'brand-manager', 'group-manager', 'business-admin', 'user'],
  unAuthenticatedUser: [],
};

export default authRoles;
