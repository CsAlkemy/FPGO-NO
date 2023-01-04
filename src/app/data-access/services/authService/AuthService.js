import FuseUtils from "@fuse/utils/FuseUtils";
import axios from "axios";
import jwtDecode from "jwt-decode";
// import jwtServiceConfig from "./jwtServiceConfig";
import { EnvVariable } from "../../utils/EnvVariables";
import MultiLanguageService from '../multiLanguageService/MultiLanguageService';

/* eslint-disable camelcase */

class AuthService extends FuseUtils.EventEmitter {
  init() {
    // this.setInterceptors();
    // this.setTranslation();
    this.handleAuthentication();
  }

  // setInterceptors = () => {
  //   axios.interceptors.response.use(
  //     (response) => {
  //       return response;
  //     },
  //     (err) => {
  //       return new Promise((resolve, reject) => {
  //         if (
  //           err.response.status === 401 &&
  //           err.config &&
  //           !err.config.__isRetryRequest
  //         ) {
  //           // if you ever get an unauthorized response, logout the user
  //           // this.emit("onAutoLogout", "Invalid access_token");
  //           this.emit("onAutoLogout");
  //           this.setSession(null);
  //         }
  //         throw err;
  //       });
  //     }
  //   );
  // };
  setTranslation = ()=> {
    MultiLanguageService.translations()
      .then((response)=>{
        localStorage.setItem("translation", JSON.stringify(response.data))
      })
      .catch((e)=> {
        console.log(e)
      })
  }

  axiosRequestHelper = () => {
    const userInfo = this.getUserInfo();
    return new Promise((resolve, reject) => {
      if (userInfo){
        if (this.isRefreshTokenValid()) {
          if (this.isAccessTokenValid()) {
            if (userInfo){
              this.isAuthenticated(userInfo?.user_data?.uuid)
                .then((res)=>{
                  resolve(res);
                })
                .catch((e)=> {
                  this.emit("onAutoLogout");
                  reject(false)
                })
            }
          } else if (!this.isAccessTokenValid()) {
            this.refreshAccessToken().then((res) => {
              if (res) {
                if (userInfo){
                  this.isAuthenticated(userInfo.uuid)
                    .then((res)=>{
                      resolve(res);
                    })
                    .catch((e)=> {
                      this.emit("onAutoLogout");
                      reject(false)
                    })
                }
              } else reject(false);
            });
          }
        } else {
          this.emit("onAutoLogout");
          reject(false);
        }
      } else {
        this.emit("onAutoLogout");
        reject(false);
      }
    });
  };

  refreshAccessToken = () => {
    const userInfo = this.getUserInfo();
    const URL = `${EnvVariable.BASEURL}/auth/refresh-access-token`;
    return new Promise((resolve, reject) => {
      if (this.isRefreshTokenValid()) {
        axios
          .put(URL, {
            uuid: userInfo.user_data.uuid,
            refreshToken: userInfo.token_data.refresh_token,
          })
          .then((res) => {
            if (res?.data?.status_code === 202 && res?.data?.data) {
              this.setSession(res.data.data.access_token);
              const userInfo = this.getUserInfo();
              userInfo["token_data"] = res.data.data;
              this.setUserInfo(userInfo);
              resolve(true);
            }reject(false);
          })
          .catch((e) => {
            console.warn((e) => "isRefreshTokenValid E: ", e);
            reject(false);
          });
      } else {
        this.emit("onAutoLogout");
        reject(false);
      }
    });
  };

  handleAuthentication = () => {
    const userInfo = this.getUserInfo();
    // const userId = userInfo["user_data"].uuid;
    // const URL = `${EnvVariable.BASEURL}/auth/is-authenticated/${userId}`;
    // axios
    //   .get(URL)
    //   .then((res) => {
    //     if (res.data.status_code === 200) {
    //       if (this.isAccessTokenValid()) {
    //         this.emit("onAutoLogin", true);
    //       } else if (this.isRefreshTokenValid()) {
    //         this.refreshAccessToken();
    //         this.emit("onAutoLogin", true);
    //       } else {
    //         this.setSession(null);
    //         this.emit("onAutoLogout");
    //       }
    //     }
    //   })
    //   .catch((e) => {
    //     if (this.isRefreshTokenValid()) {
    //       this.refreshAccessToken()
    //         .then((res) => {
    //           this.emit("onAutoLogin");
    //         })
    //         .catch((e) => {
    //           this.emit("onAutoLogout");
    //         });
    //     } else this.emit("onAutoLogout");
    //   });
    if (window.location.pathname.includes("/reset-password/")) {
      this.emit("onAutoLogout");
      localStorage.clear();
    } else if (
      userInfo &&
      userInfo.token_data &&
      userInfo.user_data &&
      this.isRefreshTokenValid()
    ) {
      if (!this.isAccessTokenValid()) {
        return this.refreshAccessToken()
          .then((res) => {
            if (res) {
              const URL = `${EnvVariable.BASEURL}/auth/is-authenticated/${userInfo["user_data"].uuid}`;
              return axios
                .get(URL)
                .then((res) => {
                  if (res.data.status_code === 200) {
                    this.emit("onAutoLogin", true);
                  } else this.emit("onAutoLogout");
                })
                .catch((error) => {
                  this.emit("onAutoLogout");
                });
            } else this.emit("onAutoLogout");
          })
          .catch((e) => {
            this.emit("onAutoLogout");
          });
      } else {
        const URL = `${EnvVariable.BASEURL}/auth/is-authenticated/${userInfo["user_data"].uuid}`;
        return axios
          .get(URL)
          .then((res) => {
            if (res.data.status_code === 200) {
              this.emit("onAutoLogin", true);
            }
          })
          .catch((error) => {
            this.emit("onAutoLogout");
          });
      }
    } else {
      this.emit("onAutoLogout");
    }
  };

  isAuthenticated = (uuid) => {
    const URL = `${EnvVariable.BASEURL}/auth/is-authenticated/${uuid}`;
    return new Promise((resolve, reject)=> {
      axios
        .get(URL)
        .then((res) => {
          if (res.data.status_code === 200) {
            resolve(true)
          } else reject(false)
        })
        .catch((error) => {
          reject(false)
        });
    })
  }

  userRegistration = (data) => {
    const phoneNumber = data.phonenumber.slice(4);
    const phoneCountryCode = data.phonenumber.split(" ")[0];
    const URL = `${EnvVariable.BASEURL}/auth/registration`;
    return new Promise((resolve, reject) => {
      axios
        .post(URL, {
          organizationId: `${data.organizationid}`,
          organizationName: `${data.companyname}`,
          organizationType: data.organizationtype
            ? `${data.organizationtype}`
            : null,
          name: `${data.name}`,
          countryCode: `${phoneCountryCode}`,
          msisdn: `${phoneNumber}`,
          email: `${data.email}`,
          designation: data.designation ? `${data.designation}` : null,
          isTnCAccepted: data.acceptTermsConditions,
        })
        .then((res) => {
          if (res.data.status_code === 201)  resolve(res.data);
          else reject("Something went wrong")
        })
        .catch((e) => {
          reject(e.response.data.errors)
        });
    });
  };

  autoSignIn = () => {
    let userData = {
      role: [],
      data: {
        displayName: "",
        uuid: "",
        photoURL: "",
        email: "",
      },
      token_data: {},
      user_data: {},
    };
    const userInfo = this.getUserInfo();
    if (userInfo) {
      return new Promise((resolve, reject) => {
        this.setSession(userInfo["token_data"].access_token);
        // this.setAutoLoginInfo(cred);
        this.setUserInfo(userInfo);
        userData.role.push(userInfo["user_data"]["user_role"].slug);
        userData = {
          ...userData,
          role: [userInfo["user_data"]["user_role"].slug],
          data: {
            displayName: userInfo["user_data"].name.split(" ")[0],
            uuid: userInfo["user_data"].uuid,
          },
          token_data: userInfo["token_data"],
          user_data: userInfo["user_data"],
        };
        resolve(userData);
        this.emit("onLogin", userData);
      });
    } else return null;
  };
  //
  // updateUserData = (user) => {
  //   return axios.post(jwtServiceConfig.updateUser, {
  //     user,
  //   });
  // };

  setSession = (access_token) => {
    if (access_token) {
      axios.defaults.headers.common.Authorization = `Bearer ${access_token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  };

  setUserInfo = (userInfo) => {
    if (userInfo) {
      localStorage.removeItem("fp_user");
      localStorage.setItem("fp_user", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("fp_user");
    }
  };

  getUserInfo = () => {
    return JSON.parse(localStorage.getItem("fp_user"));
  };

  logout = () => {
    return this.axiosRequestHelper().then((status) => {
      if (status) {
        const userId = JSON.parse(localStorage.getItem("fp_user"))["user_data"]
          .uuid;
        const URL = `${EnvVariable.BASEURL}/auth/logout/${userId}`;
        axios
          .put(URL)
          .then((response) => {
            if (response?.data?.status_code === 202) {
              this.setSession(null);
              this.emit("onLogout", "Logged out");
            }
          })
          .catch((e) => {
            this.emit("onAutoLogout");
          });
      } else this.emit("onAutoLogout");
    });
  };

  verifyOtp = (loginToken, otp) => {
    let userData = {
      role: [],
      data: {
        displayName: "",
        uuid: "",
        photoURL: "",
        email: "",
      },
      token_data: {},
      user_data: {},
      loginRedirectUrl: "",
    };
    const URL = `${EnvVariable.BASEURL}/auth/otp/verify`;
    return new Promise((resolve, reject) => {
      axios
        .post(URL, {
          loginToken: loginToken,
          otp: otp,
        })
        .then((response) => {
          if (response?.data?.status_code === 201 && response?.data?.is_data) {
            this.setSession(response.data.data["token_data"].access_token);
            this.setUserInfo(response.data.data);
            resolve(response.data);
            userData.role.push(
              response.data.data["user_data"]["user_role"].slug
            );
            userData = {
              ...userData,
              role: [response.data.data["user_data"]["user_role"].slug],
              data: {
                displayName: response.data.data["user_data"].name.split(" ")[0],
                uuid: response.data.data["user_data"].uuid,
              },
              token_data: response.data.data["token_data"],
              user_data: response.data.data["user_data"],
              // loginRedirectUrl: "/dashboard",  // FRON536- change redirect URL
              loginRedirectUrl: "/sales/orders-list",
            };
            this.emit("onLogin", userData);
          } else {
            reject(response.data.message);
          }
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  };

  sendOtp = (params) => {
    return new Promise((resolve, reject) => {
      const Location = window.location.hostname;
      const URL = `${EnvVariable.BASEURL}/auth/otp/send`;
      if (
        Location === "localhost" ||
        Location === "13.53.82.155" ||
        Location === "dev.frontpayment.no" ||
        Location === "stg.frontpayment.no" ||
        Location === "demo.frontpayment.no"
      ) {
        return axios
          .post(URL, params)
          .then((response) => {
            if (response?.data?.status_code === 201) {
              return this.bypassOtpForQA(params.loginToken).then((res) => {
                console.warn("OPT : ", res.data.otp);
                resolve([response.data, res.data.otp]);
              });
            }else reject("Something went wrong")
          })
          .catch((error) => {
            reject(error.response.data.message)
          });
      }
      return axios
        .post(URL, params)
        .then((response) => {
          if (response?.data?.status_code === 201) {
            resolve(response.data);
          } else reject("Something went wrong");
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  };

  bypassOtpForQA = (email) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/auth/otp/${email}`;
      return axios
        .get(URL)
        .then((response) => {
          // if (response?.data?.status_code === 200) {
          //   resolve(response.data);
          // } else reject("Something went wrong");
          resolve(response.data);
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  };

  //Forgot Password
  forgotPassword = (email) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/auth/password/forget`;
      return axios
        .post(URL, {
          email: email.email,
        })
        .then((response) => {
          if (response?.data?.status_code === 201) {
            resolve(response);
          } else reject("Something went wrong");
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  };

  resetPassword = (password, token) => {
    return new Promise((resolve, reject) => {
      const URL = `${EnvVariable.BASEURL}/auth/password/reset`;
      return axios
        .post(URL, {
          token,
          password,
        })
        .then((response) => {
          if (response?.data?.status_code === 202) {
            resolve(response.data);
          } else reject("Something went wrong");
        })
        .catch((error) => {
          reject(error.response.data.message);
        });
    });
  };

  isAccessTokenValid = () => {
    const currentTime = Date.now() / 1000;
    const expiresAt = this.getAccessTokenExpiresAt();
    if (expiresAt < currentTime) {
      return false;
    }
    return true;
  };

  isRefreshTokenValid = () => {
    const currentTime = Date.now() / 1000;
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();
    return refreshTokenExpiresAt >= currentTime;
  };

  getAccessTokenExpiresAt = () => {
    return JSON.parse(localStorage.getItem("fp_user"))["token_data"]
      .access_token_expires_at;
  };
  getRefreshTokenExpiresAt = () => {
    return JSON.parse(localStorage.getItem("fp_user"))["token_data"]
      .refresh_token_expires_at;
    // return window.localStorage.getItem("fp_refresh_token_expires_at");
  };
}

const instance = new AuthService();

export default instance;
