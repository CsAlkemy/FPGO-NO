import React from "react";

class UtilsService {
  prepareDate = (dt)=> {
    const month = dt.split(".")[1];
    const date = dt.split(".")[0];
    const year = dt.split(".")[2];
    return `${month}.${date}.${year}`;
  }

  prepareDateAndGetTimestamp = (dt)=> {
    const preparedDate = this.prepareDate(dt);
    return new Date(preparedDate).getTime();
  }
}

const instance = new UtilsService();
export default instance;
