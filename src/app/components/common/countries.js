import React from "react";
import { Controller } from "react-hook-form";
import { countryList } from "../../utils/countries";
import { useTranslation } from "react-i18next";
import { Autocomplete, TextField } from "@mui/material";
import { Box } from "@mui/system";

export default function CountrySelect({
  control,
  required,
  name,
  label,
  placeholder,
  error,
  defaultValue,
  disable,
}) {
  const { t } = useTranslation();
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value, onBlur, ref } }) => (
        <Autocomplete
          id="country-select-demo"
          sx={{ width: "auto" }}
          options={countryList}
          autoHighlight
          disabled={disable}
          inputlabelprops={{
            shrink: !!value,
          }}
          value={
            value
              ? value?.charAt(0)?.toUpperCase() + value?.slice(1)
              : value || ""
          }
          onChange={(event, newValue) => {
            onChange(newValue?.label);
          }}
          getOptionLabel={(option) => option["label"] || option}
          // defaultValue={{ code: "NO", label: "Norway", phone: "47" }}
          renderOption={(props, option) => (
            <Box
              component="li"
              sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
              {...props}
            >
              <img
                loading="lazy"
                width="20"
                src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                alt=""
              />
              {option.label}
            </Box>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t(`label:${label}`)}
              required={required}
              // placeholder={t(`label:${placeholder}`)}
              fullWidth
              disabled={disable}
              type="text"
              error={!!error}
              helperText={
                error?.message ? t(`validation:${error?.message}`) : ""
              }
              inputProps={{
                ...params.inputProps,
                autoComplete: "new-password", // disable autocomplete and autofill
              }}
              onBlur={onBlur}
              inputRef={ref}
            />
          )}
        />
      )}
    />
  );
}
