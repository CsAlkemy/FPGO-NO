export const CharCont = (str, length) => {
  if (str) {
    if (str.toString().length > length) {
      return str.substring(0, length) + "...";
    } else {
      return str;
    }
  } else {
    return "";
  }
};

export const ThousandSeparator = (number) => {
  if (number) {
    return Number(number).toLocaleString("ro-RO");
  } else if (number === 0) {
    return 0;
  } else {
    return "";
  }
  if (!!number) {
    let str = number.toString();
    let arr = str.split("");
    let result = [];
    let isNegative = false;
    if (arr[0] === "-") {
      isNegative = true;
      arr.shift();
    }
    let decimalIndex = arr.indexOf(".");
    if (decimalIndex === -1) {
      decimalIndex = arr.length;
    }
    for (let i = decimalIndex - 1, j = 1; i >= 0; i--, j++) {
      result.unshift(arr[i]);
      if (j !== 1 && j % 4 === 0 && i !== 0) {
        result.splice(1, 0, ".");
        j++;
        // result.unshift(".");
      }
    }
    if (decimalIndex !== arr.length) {
      result.push(",");
      for (let i = decimalIndex + 1; i < arr.length; i++) {
        result.push(arr[i]);
      }
    }
    if (isNegative) {
      result.unshift("-");
    }
    return result.join("");
  } else {
    return number;
  }
};
