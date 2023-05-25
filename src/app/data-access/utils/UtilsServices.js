import React from "react";
import CryptoJS from "crypto-js";
import { SecretKey } from "./EnvVariables";

class UtilsServices {
  SecretSalt = "CodeCoffeeCo";
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

  preparePhoneNumber = (phone)=> {
    if (phone.toString().startsWith("+47") || phone.toString().startsWith("+")){
      return `${phone}`
    } else if (phone.toString().startsWith("0047") && phone.length === 12){
      return `+${phone.toString().slice(2)}`
    } else if ((!phone.toString().startsWith("+47") || !phone.toString().startsWith("+")) && phone.toString().length === 8){
      return `+47${phone}`
    } else if (!!phone || phone.toString().length){
      return `+${phone}`
    }
  }

  prepareDate = (paramDate) => {
    //TODO: Set date ex: 12 Sep, 2022
    const date = new Date(paramDate);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const year = date.getFullYear();

    return `${day} ${monthName}, ${year}`;
  };
}

const instance = new UtilsServices();
export default instance;
