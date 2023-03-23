export const EnvVariable = {
  BASEURL:
    // window.location.hostname === "13.53.82.155" ||
    window.location.hostname === "dev.frontpayment.no" ||
    window.location.hostname === "localhost"
      ? `${process.env.REACT_APP_PUBLIC_BASE_API_URL_DEV}`
      : window.location.hostname === "stg.frontpayment.no" // || window.location.hostname === "13.53.82.155"
      ? `${process.env.REACT_APP_PUBLIC_BASE_API_URL_STG}`
      : window.location.hostname === "demo.frontpayment.no"
      ? `${process.env.REACT_APP_PUBLIC_BASE_API_URL_DEMO}`
      : window.location.hostname === "go.frontpayment.no"
      ? `${process.env.REACT_APP_PUBLIC_BASE_API_URL_PROD}`
      : "",
  USER_MANAGEMENT: `${process.env.REACT_APP_PUBLIC_API_URL_USER_MANAGEMENT}`,
};

export const SecretKey = process.env.REACT_APP_PUBLIC_SCRTKY;
