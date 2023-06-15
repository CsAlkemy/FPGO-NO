import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

export default function FrontPaymentLanguageSelect({
  control,
  required,
  name,
  label,
  error,
  disable,
  value,
    isOrder
}) {
  const { t } = useTranslation();
  const [languageList, setLanguageList] = useState([
    { title: "English", value: "en" },
    { title: "Norwegian", value: "no" },
  ]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl
          error={error}
          required={required}
          disabled={disable || false}
          fullWidth
        >
          <InputLabel id="demo-simple-select-label-role">
            {t(`label:${label}`)}
          </InputLabel>
          {!!isOrder &&(
              <Select
                  {...field}
                  labelId="demo-simple-select-label-role"
                  id="demo-simple-select"
                  label={t("label:preferredLanguage")}
                  value={value}
              >
                {languageList.map((item, index) => {
                  return (
                      <MenuItem key={index} value={item.value}>
                        {t(`label:${item?.title.toLowerCase()}`)}
                      </MenuItem>
                  );
                })}
              </Select>
          )}
          {!isOrder &&(
              <Select
                  {...field}
                  labelId="demo-simple-select-label-role"
                  id="demo-simple-select"
                  label={t("label:preferredLanguage")}
                  defaultValue={value}
              >
                {languageList.map((item, index) => {
                  return (
                      <MenuItem key={index} value={item.value}>
                        {t(`label:${item?.title.toLowerCase()}`)}
                      </MenuItem>
                  );
                })}
              </Select>
          )}

          <FormHelperText>
            {error ? t(`validation:${error?.message}`) : ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}
