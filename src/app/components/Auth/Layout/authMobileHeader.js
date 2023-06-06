import React from "react";
import { Box, Hidden, MenuItem, Select, SvgIcon } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch } from "react-redux";
import { changeLanguage } from "app/store/i18nSlice";
import { useTranslation } from "react-i18next";

const authMobileHeader = (props) => {
  const { isShow } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const urlParams = new URLSearchParams(window.location.search);
  const lang = urlParams.get("lang");
  const languages = [
    {
      label: "English",
      value: "en",
    },
    {
      label: "Norwegian",
      value: "no",
    },
  ];

  const handleLanguageChange = (lng) => {
    dispatch(changeLanguage(lng));
  };

  return (
    <div>
      <Hidden mdDown>
        {!isShow === true && (
          <img
            className="w-auto h-full mx-auto max-h-64 mb-52"
            src="assets/images/logo/front-go.svg"
            alt="companylogo"
            loading="lazy"
          />
        )}
      </Hidden>
      <Hidden mdUp>
        <div className="flex justify-between items-center pb-20 border-b-1 border-MonochromeGray-50">
          <img
            className="w-auto h-full max-h-48"
            src="assets/images/logo/front-go.svg"
            alt="companylogo"
            loading="lazy"
          />
          <div>
            <Select
              sx={{ height: 36 }}
              defaultValue={lang === "en" ? "English" : "Norwegian"}
              displayEmpty
              renderValue={(value) => {
                return (
                  <Box
                    sx={{ display: "flex", gap: 1 }}
                    className="flex justify-start items-start"
                  >
                    <SvgIcon color="primary">
                      <LanguageIcon className="text-MonochromeGray-300" />
                    </SvgIcon>
                    <div className="my-auto">
                      {t(`label:${value.toLowerCase()}`)}
                    </div>
                  </Box>
                );
              }}
            >
              {languages.map((option) => (
                <MenuItem
                  key={option.value}
                  value={option.label}
                  onClick={() => handleLanguageChange(option.value)}
                >
                  {t(`label:${option.label.toLowerCase()}`)}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </Hidden>
    </div>
  );
};

export default authMobileHeader;
