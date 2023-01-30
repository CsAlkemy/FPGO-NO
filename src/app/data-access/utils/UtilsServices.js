import React from "react";
import CryptoJS from "crypto-js";
import { SecretKey } from "./EnvVariables";

class UtilsServices {
  SecretSalt = "FrontPaymentGO-CodeCoffeeComputer-JS";
  SecretKey = "U2FsdGVkX19uyZQQesYR2y+VGUkSkIf3YxJ6Nfg9r4U=";
  encryptData = (data) => {
    const ecptData = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      this.SecretSalt
    ).toString();

    return ecptData;
  };

  decryptData = (data) => {
    const bytes = CryptoJS.AES.decrypt(data, this.SecretSalt);
    const dcptData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    return dcptData;
  };

  getFPUserData = () => {
    const isLocalData = localStorage.getItem(SecretKey);
    return isLocalData ? this.decryptData(localStorage.getItem(SecretKey)) : null;
  };
}

const instance = new UtilsServices();
export default instance;
