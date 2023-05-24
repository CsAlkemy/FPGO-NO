import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EnvVariable } from "../../data-access/utils/EnvVariables";
import AuthService from "../../data-access/services/authService";
import UtilsServices from "../../data-access/utils/UtilsServices";

let userInfo = UtilsServices.getFPUserData();
const baseQuery = fetchBaseQuery({
  baseUrl: `${EnvVariable.BASEURL}`,
  prepareHeaders: (headers, { getState }) => {
    headers.set(
      "authorization",
      `Bearer ${userInfo?.token_data?.access_token}`
    );
    return headers;
  },
});
const baseQueryWithSaltToken = fetchBaseQuery({
  baseUrl: `${EnvVariable.BASEURL}`,
  prepareHeaders: (headers, { getState }) => {
    headers.set(
      "authorization",
      `Bearer QXNrZUFtYXJNb25WYWxvTmVpO01vbkFtYXJLZW1vbktlbW9uS29yZQ==`
    );
    return headers;
  },
});
const baseQueryWithoutToken = fetchBaseQuery({
  baseUrl: `${EnvVariable.BASEURL}`,
});

const baseQueryWithReAuth = async (args, api, extraOptions) => {
  userInfo = UtilsServices.getFPUserData();
  let result =
    args?.url === `/credit/check/checkout/private` ||
    args?.url === `/credit/check/checkout/corporate`
      ? await baseQueryWithSaltToken(args, api, extraOptions)
      : args?.url === `/auth/registration`
      ? await baseQueryWithoutToken(args, api, extraOptions)
      : await baseQuery(args, api, extraOptions);
  if (
    window.location.hostname === "dev.frontpayment.no" ||
    window.location.hostname === "localhost"
  ) {
    console.log("args : ", args);
    console.log("RESULT : ", result);
  }
  if (result.error && result.error.status === 401) {
    // try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-access-token",
        method: "PUT",
        body: {
          uuid: userInfo.user_data.uuid,
          refreshToken: userInfo.token_data.refresh_token,
        },
      },
      api,
      extraOptions
    );

    if (refreshResult?.data?.status_code === 202 && refreshResult?.data?.data) {
      // =======================
      // store the new token
      AuthService.setSession(refreshResult.data.data.access_token);
      // const userInfo = AuthService.getUserInfo();
      userInfo.token_data = refreshResult.data.data;
      AuthService.setUserInfo(userInfo);
      // =======================
      // store the new token
      // api.dispatch(tokenReceived(refreshResult.data))
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else if (refreshResult?.data?.status_code === 404) {
      // api.dispatch(loggedOut())
      //emit Auto Logout
      AuthService.emit("onAutoLogout");
    } else {
      AuthService.emit("onAutoLogout");
    }
  }
  return result;
};

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  baseQuery: baseQueryWithReAuth,
  tagTypes: [
    "OrdersList, CustomersList, ProductsList, CategoriesList,UsersList",
    "FPAdminUsersList",
    "ClientOrganizationsSummaryList",
    "ApprovedClientsList",
    "ApprovalClientsList",
    "RefundRequestsList",
    "ReservationList",
  ],
  endpoints: (builder) => ({
    getOrdersList: builder.query({
      query: () => "/orders/list",
      providesTags: ["OrdersList"],
    }),
    createOrder: builder.mutation({
      query: (payload) => ({
        url: "/orders/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrdersList"],
    }),
    refundOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders/refund/${payload.uuid}`,
        method: "POST",
        body: {
          isPartial: payload.isPartial,
          amount: parseFloat(payload.refundAmount),
        },
      }),
      invalidatesTags: (result, error, arg, meta) =>
        result ? ["OrdersList", "ReservationList"] : [""],
    }),
    resendOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders/resend/${payload.uuid}`,
        method: "POST",
        body: {
          countryCode: payload.countryCode,
          msisdn: payload.msisdn,
          email: payload.email,
        },
      }),
      invalidatesTags: ["OrdersList", "ReservationList"],
    }),
    cancelOrder: builder.mutation({
      query: (payload) => ({
        url: `/orders/cancel/${payload.uuid}`,
        method: "POST",
        body: {
          cancellationNote: payload?.cancellationNote
            ? payload.cancellationNote
            : null,
        },
      }),
      invalidatesTags: ["OrdersList", "ReservationList"],
    }),
    getCustomersList: builder.query({
      query: () => "/customers/list",
      providesTags: ["CustomersList"],
    }),
    createPrivateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customers/create/private`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    createCorporateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customers/create/corporate`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    updatePrivateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customers/update/private/${payload.customerID}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    updateCorporateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customers/update/corporate/${payload.customerID}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    updateCustomerStatus: builder.mutation({
      query: (uuid) => ({
        url: `/customers/change/status/${uuid}`,
        method: "PUT",
      }),
      invalidatesTags: ["CustomersList"],
    }),
    getProductsList: builder.query({
      query: () => "/products/list",
      providesTags: ["ProductsList"],
    }),
    createProduct: builder.mutation({
      query: (payload) => ({
        url: "/products/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ProductsList"],
    }),
    updateProduct: builder.mutation({
      query: (payload) => ({
        url: `/products/update/${payload.uuid}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ProductsList"],
    }),
    updateProductStatus: builder.mutation({
      query: (uuid) => ({
        url: `/products/change/status/${uuid}`,
        method: "PUT",
      }),
      invalidatesTags: ["ProductsList"],
    }),
    getCategoriesList: builder.query({
      query: () => "/categories/list",
      providesTags: ["CategoriesList"],
    }),
    createCategory: builder.mutation({
      query: (payload) => ({
        url: "/categories/create",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CategoriesList"],
    }),
    updateCategory: builder.mutation({
      query: (payload) => ({
        url: `/categories/update/${payload.uuid}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CategoriesList"],
    }),
    deleteCategory: builder.mutation({
      query: (uuid) => ({
        url: `/categories/delete/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CategoriesList"],
    }),
    getCreditChecksList: builder.query({
      query: () => "/credit/check/list",
      providesTags: ["CreditChecksList"],
    }),
    corporateCreditCheck: builder.mutation({
      query: (payload) => ({
        url: "/credit/check/corporate",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CreditChecksList"],
    }),
    privateCreditCheck: builder.mutation({
      query: (payload) => ({
        url: "/credit/check/private",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CreditChecksList"],
    }),
    paymentScreenCreditCheck: builder.mutation({
      query: (payload) => ({
        url: `/credit/check/checkout/${payload.type}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CreditChecksList"],
    }),
    getUsersList: builder.query({
      query: (uuid) => `/users/list/${uuid}`,
      providesTags: ["UsersList"],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `/users/create/${payload.role}`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["UsersList"],
    }),
    updateUser: builder.mutation({
      query: (payload) => ({
        url: `/users/update/${payload.uuid}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["UsersList"],
    }),
    updateUserStatus: builder.mutation({
      query: (uuid) => ({
        url: `/users/change/status/${uuid}`,
        method: "PUT",
      }),
      invalidatesTags: ["UsersList"],
    }),
    getFPAdminUsersList: builder.query({
      query: () => "/users/list/all/fp-admin",
      providesTags: ["FPAdminUsersList"],
    }),
    getClientOrganizationsSummaryList: builder.query({
      query: () => "/users/list/organizations/summary",
      providesTags: ["ClientOrganizationsSummaryList"],
    }),
    getApprovalClientsList: builder.query({
      query: () => "/clients/list/pending",
      providesTags: ["ApprovalClientsList"],
    }),
    getApprovedClientsList: builder.query({
      query: () => "/clients/list/approved",
      providesTags: ["ApprovedClientsList"],
    }),
    createClient: builder.mutation({
      query: (payload) => ({
        url: "/clients/add",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ApprovedClientsList"],
    }),
    onboardClient: builder.mutation({
      query: (payload) => ({
        url: `/clients/approve/${payload.uuid}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ApprovedClientsList"],
    }),
    updateClient: builder.mutation({
      query: (payload) => ({
        url: `/clients/update/${payload.uuid}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["ApprovedClientsList, ClientOrganizationsSummaryList"],
    }),
    updateClientStatus: builder.mutation({
      query: (uuid) => ({
        url: `/clients/change/status/${uuid}`,
        method: "PUT",
      }),
      invalidatesTags: ["ApprovedClientsList, ClientOrganizationsSummaryList"],
    }),
    deleteClient: builder.mutation({
      query: (uuid) => ({
        url: `/clients/delete/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ApprovalClientsList"],
    }),
    createRegistrationRequest: builder.mutation({
      query: (payload) => ({
        url: "/auth/registration",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ApprovalClientsList"],
    }),
    getRefundRequestsList: builder.query({
      query: () => "/orders/refund/list/all",
      providesTags: ["RefundRequestsList"],
    }),
    refundRequestDecision: builder.mutation({
      query: (params) => ({
        url: `/orders/refund/decision/${params.orderUuid}`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["RefundRequestsList"],
    }),
    requestRefundApproval: builder.mutation({
      query: (params) => ({
        url: `/orders/refund/request/approval/${params.uuid}`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["RefundRequestsList"],
    }),
    createQuickOrder: builder.mutation({
      query: (payload) => ({
        url: "/orders/quick",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["OrdersList"],
    }),
    updateQuickOrderCustomer: builder.mutation({
      query: (payload) => ({
        url: `/orders/update/address/${payload.uuid}`,
        method: "PUT",
        body: payload,
      }),
      // invalidatesTags: ["OrdersList"],
    }),
    orderExportToAptic: builder.query({
      query: (uuid) => `/orders/export/aptic/${uuid}`,
      providesTags: ["OrdersList"],
    }),
    createReservation: builder.mutation({
      query: (payload) => ({
        url: "/reservations/submit",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ReservationList"],
    }),
    getReservationList: builder.query({
      query: () => "/reservations/list",
      providesTags: ["ReservationList"],
    }),
    completeReservation: builder.mutation({
      query: (payload) => ({
        url: `/reservations/complete/${payload.uuid}`,
        method: "PUT",
        body: {
          note: payload?.cancellationNote ? payload.cancellationNote : null,
        },
      }),
      invalidatesTags: ["ReservationList"],
    }),
    capturePayment: builder.mutation({
      query: (payload) => ({
        //url: `/payment/capture/${payload.uuid}`,
        url: `/reservations/capture/${payload.uuid}`,
        method: "POST",
        body: {
          isPartial: payload.isPartial,
          amount: parseFloat(payload.captureAmount),
        },
      }),
      invalidatesTags: (result, error, arg, meta) =>
        result ? ["ReservationList"] : [""],
    }),
    chargeReservation: builder.mutation({
      query: (payload) => ({
        url: `/reservations/charge/${payload.uuid}`,
        method: "POST",
        body: {
          products: payload.products,
          grandTotal: parseFloat(payload.grandTotal),
        },
      }),
      invalidatesTags: (result, error, arg, meta) =>
        result ? ["ReservationList"] : [""],
    }),
    refundFromReservation: builder.mutation({
      query: (payload) => ({
        url: `/orders/refund/${payload.uuid}`,
        method: "POST",
        body: {
          isPartial: false,
          amount: payload.refundableAmount,
        },
      }),
      invalidatesTags: (result, error, arg, meta) =>
        result ? ["ReservationList"] : [""],
    }),
    refundChargedTransection: builder.mutation({
      query: (payload) => ({
        url: `/orders/refund/${payload.uuid}`,
        method: "POST",
        body: {
          isPartial: false,
          amount: payload.refundableAmount,
        },
      }),
      invalidatesTags: (result, error, arg, meta) =>
        result ? ["ReservationList"] : [""],
    }),
  }),
});

export const {
  useGetOrdersListQuery,
  useRefundOrderMutation,
  useCreateOrderMutation,
  useResendOrderMutation,
  useCancelOrderMutation,
  useGetCustomersListQuery,
  useCreatePrivateCustomerMutation,
  useCreateCorporateCustomerMutation,
  useUpdatePrivateCustomerMutation,
  useUpdateCorporateCustomerMutation,
  useUpdateCustomerStatusMutation,
  useGetProductsListQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useUpdateProductStatusMutation,
  useGetCategoriesListQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCreditChecksListQuery,
  useCorporateCreditCheckMutation,
  usePrivateCreditCheckMutation,
  usePaymentScreenCreditCheckMutation,
  useGetUsersListQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useGetFPAdminUsersListQuery,
  useGetClientOrganizationsSummaryListQuery,
  useGetApprovalClientsListQuery,
  useGetApprovedClientsListQuery,
  useCreateClientMutation,
  useOnboardClientMutation,
  useUpdateClientMutation,
  useUpdateClientStatusMutation,
  useDeleteClientMutation,
  useCreateRegistrationRequestMutation,
  useGetRefundRequestsListQuery,
  useRefundRequestDecisionMutation,
  useRequestRefundApprovalMutation,
  useCreateQuickOrderMutation,
  useUpdateQuickOrderCustomerMutation,
  useOrderExportToApticQuery,
  useCreateReservationMutation,
  useGetReservationListQuery,
  useCompleteReservationMutation,
  useCapturePaymentMutation,
  useChargeReservationMutation,
  useRefundFromReservationMutation,
  useRefundChargedTransectionMutation,
} = apiSlice;
