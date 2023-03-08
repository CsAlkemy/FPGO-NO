import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AuthMobileHeader from "../Layout/authMobileHeader";

export default function RegistrationConfirmation() {
  const { t } = useTranslation();
  return (
    <>
      <div className="p-20">
        <AuthMobileHeader isShow={true} />
      </div>
      <div className="flex flex-col flex-auto items-center justify-start sm:justify-center p-10 md:p-32 bg-ccc ">
        <div className="w-full md:w-auto md:pb-auto p-20 m-10 md:m-0 md:p-88 ltr:border-r-1 rtl:border-l-1 bg-ccc sm:bg-white rounded-lg">
          <div className="p-16 md:p-200  bg-ccc flex flex-col gap-20 justify-center items-center">
            <div className="header5 text-center">
              {t("label:accountUnderReview")}
            </div>
            <div className="body2 text-center">{t("label:regSuccessMsg")}</div>
            <Link className="login-page-no-underline" to="/login">
              <Button
                variant="contained"
                type="submit"
                size="large"
                className="flex-auto rounded-md button2 px-64"
                color="secondary"
              >
                {t("label:goToLogin")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
