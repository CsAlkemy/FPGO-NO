import React from "react";
import { Box, Hidden, MenuItem, Select, SvgIcon } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useDispatch } from "react-redux";
import { changeLanguage } from 'app/store/i18nSlice';

const authMobileHeader = (props) => {
  const { isShow } = props;
  const dispatch = useDispatch();
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

  const handleLanguageChange = (lng)=> {
    dispatch(changeLanguage(lng));
  }

  return (
    <div>
      <Hidden smDown>
        {!isShow === true && (
          <img
            className="w-auto h-full mx-auto max-h-64 mb-52"
            src="assets/images/logo/front-go.svg"
            alt="companylogo"
            loading="lazy"
          />
        )}
      </Hidden>
      <Hidden smUp>
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
              defaultValue="English"
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
      </Hidden>
    </div>
  );
};

export default authMobileHeader;
