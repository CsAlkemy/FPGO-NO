import { CheckCircle } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import PaymentHeader from "../../payment/paymentHeader";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

const PaymentStatus = () => {
  const { t } = useTranslation();
  const reservationUuid = useParams().uuid;
  const [isLoading, setIsLoading] = useState(true);
  const [sentBy, setSentBy] = useState("");
  const [phoneOrEmail, setPhoneOrEmail] = useState("");

  useEffect(() => {
    const reservationConfirmationData = JSON.parse(
      localStorage.getItem("reservationConfirmationData")
    );
    if (reservationUuid === reservationConfirmationData.reservationUuid) {
      setSentBy(reservationConfirmationData?.sentBy);
      setPhoneOrEmail(reservationConfirmationData?.phoneOrEmail);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl my-32">
      <div className="flex-auto mx-auto  w-full md:w-4/5 lg:w-3/4 xl:w-7/12">
        <div className="order-receipt-container">
          <PaymentHeader />
          <div className="mt-32 bg-MonochromeGray-25 px-32 py-56 rounded-8">
            <div className="flex flex-col justify-center items-center gap-20">
              <div>
                {<CheckCircle className="custom-bg-teal-500 icon-size-52" />}
              </div>
              <div className="header5">
                {t("label:reservationPaymentSuccessful")}
              </div>
              <div className="body2 w-full md:w-3/4 mx-auto text-center">
                {t("label:reservationPaymentSuccessfulMessage", {
                  sentBy: sentBy,
                  phoneOrEmail: phoneOrEmail,
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
