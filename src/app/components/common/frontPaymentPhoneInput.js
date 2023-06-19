import React from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { FormControl, FormHelperText } from "@mui/material";
import PhoneInput from "react-phone-input-2";

export default function FrontPaymentPhoneInput({
  control,
  required,
  name,
  label,
  placeholder,
  error,
  defaultValue,
  disable,
  trigger,
  setValue,
  setDialCode,
}) {
  const { t } = useTranslation();

  const handleOnBlurGetDialCode = (value, data, event, fv) => {
    // console.log(name + value);
    // console.log(data);
    setValue(name, `+${value}`);
    trigger(name);
    setDialCode(`+${data?.dialCode}`);
  };
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref, onChange, ...field } }) => (
        <FormControl error={error} required={required} fullWidth>
          <PhoneInput
            {...field}
            className={
              error
                ? "input-phone-number-field border-1 rounded-md border-[#f44336]"
                : "input-phone-number-field"
            }
            country={defaultValue ? defaultValue : "no"}
            enableSearch
            autocompleteSearch
            countryCodeEditable={false}
            disabled={disable ? disable : false}
            specialLabel={`${t(`label:${label}`)} ${required ? "*" : ""}`}
            onChange={handleOnBlurGetDialCode}
          />
          <FormHelperText>
            {error?.message ? t(`validation:${error?.message}`) : ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
