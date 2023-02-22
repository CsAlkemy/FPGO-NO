import React, { useEffect } from "react";
import LanguageIcon from "@mui/icons-material/Language";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, MenuItem } from "@mui/material";
import Select from "@mui/material/Select";
import SvgIcon from "@mui/material/SvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { changeLanguage } from "app/store/i18nSlice";
import { useTranslation } from "react-i18next";
import { selectUser } from "app/store/userSlice";
import i18n from "../../../../i18n";

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

const paymentHeader = () => {
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const checkout = window.location.pathname.includes("/checkout");
  const orderDetails = window.location.pathname.includes("/order/details");

  useEffect(() => {
    if (!checkout && orderDetails) dispatch(changeLanguage("no"));
    else if (checkout && orderDetails && !!localStorage.getItem("language")) {
      dispatch(changeLanguage(localStorage.getItem("language")));
    } else {
      dispatch(changeLanguage("no"));
    }

    return () => {
      localStorage.removeItem("language");
    };
  }, []);

  const handleLanguageChange = (lng) => {
    localStorage.setItem("language", lng);
    dispatch(changeLanguage(lng));
  };

  return (
    <div className="flex justify-between items-center gap-10">
      <img
        className="logo-icon h-48"
        src="assets/images/logo/front-go.svg"
        alt="logo"
      />
      <div>
        <Select
          sx={{ height: 36 }}
          // defaultValue="English"
          defaultValue={
            !checkout && orderDetails
              ? "Norwegian"
              : checkout &&
                orderDetails &&
                !!localStorage.getItem("language") &&
                localStorage.getItem("language") === "en"
              ? "English"
              : "Norwegian"
          }
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
                <div className="my-auto">{value}</div>
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
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </div>
    </div>
  );
};

export default paymentHeader;
