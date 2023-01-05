import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { EnvVariable } from "../../data-access/utils/EnvVariables";
import AuthService from "../../data-access/services/authService";

const userInfo = AuthService.getUserInfo();
const baseQuery = fetchBaseQuery({
  baseUrl: `${EnvVariable.BASEURL}`,
  prepareHeaders: (headers, { getState }) => {
    headers.set(
      "authorization",
      `Bearer ${
        JSON.parse(localStorage.getItem("fp_user")).token_data.access_token
      }`
    );
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  console.log("args : ", args);
  console.log("RESULT : ", result);
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
      const userInfo = AuthService.getUserInfo();
      userInfo["token_data"] = refreshResult.data.data;
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
  baseQuery: baseQueryWithReauth,
  tagTypes: ["OrdersList, CustomersList"],
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
      invalidatesTags: ["OrdersList"],
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
      invalidatesTags: ["OrdersList"],
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
      invalidatesTags: ["OrdersList"],
    }),
    getCustomersList: builder.query({
      query: () => "/customer/list",
      providesTags: ["CustomersList"],
    }),
    createPrivateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/create/private`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    createCorporateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/create/corporate`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    updatePrivateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/update/private/${payload.customerID}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
    }),
    updateCorporateCustomer: builder.mutation({
      query: (payload) => ({
        url: `/customer/update/corporate/${payload.customerID}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["CustomersList"],
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
} = apiSlice;
