import LanguageIcon from "@mui/icons-material/Language";
import {Hidden, MenuItem, Select, SvgIcon} from "@mui/material";
import Box from "@mui/material/Box";
import {changeLanguage} from "app/store/i18nSlice";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {useEffect} from "react";
const AuthLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const languages = [
    {
      label: "Norwegian",
      value: "no",
    },
    {
      label: "English",
      value: "en",
    },
  ];
  useEffect(() => {
    dispatch(changeLanguage("no"));
  }, []);
  const handleLanguageChange = (lng) => {
    dispatch(changeLanguage(lng));
  };

  return (
    <div className="flex flex-col flex-auto items-center justify-start sm:justify-center min-w-0 md:p-32  md:bg-ccc relative">
      <div className="relative z-10 flex w-11/12 md:w-auto min-h-auto max-h-3xl rounded-xl bg-white md:rounded-2xl overflow-hidden h-661 sm:custom-drop-shadow remove-mui-paper-transition">
        <div className="w-full md:w-auto py-32 md:pb-auto px-16 md:px-18">
          <div className="w-full max-w-384 sm:w-360 mx-auto flex flex-col h-full justify-start">
            {children}
          </div>
        </div>
        <Box
          className="relative hidden md:flex flex-auto mt0-5 items-end pt-36 pb-36 pr-112 pl-20 overflow-hidden bg-hero-login h-full w-full bg-no-repeat bg-cover"
          style={{
            backgroundImage: `url(${require("src/images/Auth/Dark.jpg")})`,
          }}
        >
          <div className="z-10 relative w-full max-w-2xl">
            <div className="leading-none text-white">
              <div className="text-32 leading-10 font-normal tracking-wider mb-12">
                {t("label:welcomeTo")}
              </div>
              <div className="text-52 leading-10 font-bold">
                {t("label:frontGo")}
              </div>
            </div>
            <div className="mt-24 body1 text-gray-400 max-w-512 w-512 leading-6 body2">
              {t("label:makeYourPaymentsFastEasyAndSecure")}
            </div>
          </div>
          <Hidden smDown>
            <div className="absolute bottom-32 right-32">
              <div>
                <Select
                  sx={{ height: 36, backgroundColor: "#fff" }}
                  defaultValue="Norwegian"
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
                        <div className="my-auto">{t(`label:${value?.toLowerCase()}`)}</div>
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
        </Box>
      </div>
    </div>
  );
};

export default AuthLayout;
