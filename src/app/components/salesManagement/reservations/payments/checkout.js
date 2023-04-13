import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Hidden, IconButton } from "@mui/material";
import PaymentHeader from "../../payment/paymentHeader";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { ThousandSeparator } from "../../../../utils/helperFunctions";

const ReservationCheckout = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const param = useParams();
    const [visible, setVisible] = React.useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState([]);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        setIsLoading(false);
        setOrderDetails({uuid: param.uuid});
    }, [isLoading]);

    window.addEventListener("scroll", toggleVisible);

    return (
        <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl my-32">
            <div className="flex-auto mx-auto  w-full md:w-4/5 lg:w-3/4 xl:w-7/12">
                <div className="order-receipt-container">
                    <PaymentHeader />
                    <div className="pt-32 pb-20 flex-row justify-between items-start md:items-center">
                        <div className="header6 text-MonochromeGray-700 ">
                            {t("label:reservationDetails")}
                        </div>
                        <div className="subtitle3 text-MonochromeGray-300 my-10">
                            {t("label:reservationNo")}. {param.uuid}
                        </div>
                    </div>

                    <Hidden mdDown>
                        <div>
                            <div className="my-10 grid grid-cols-6 product-list-grid-container-height bg-primary-25 subtitle3 gap-10 px-10 text-MonochromeGray-500">
                                <div className="my-auto">SL.</div>
                                <div className="my-auto col-span-2">
                                    {t("label:productName")}
                                </div>
                                <div className="my-auto">
                                    {t("label:productId")}
                                </div>
                                <div className="my-auto text-center">
                                    {t("label:tax")}
                                </div>
                                <div className="my-auto text-right">
                                    {t("label:reservationAmount")}
                                </div>
                                <div className="my-auto"></div>
                            </div>
                            
                            <div className="grid grid-cols-6 gap-10 px-10 body4 border-b-1 border-MonochromeGray-50 text-MonochromeGray-700">
                                <div className="my-auto py-16 px-10">1.</div>
                                <div className="my-auto py-16 px-10 col-span-2">Lorem Ipsum</div>
                                <div className="my-auto py-16 px-10">RSV0001</div>
                                <div className="my-auto py-16 px-10 text-center">
                                    { ThousandSeparator(5) } % {t("label:vat")}
                                </div>
                                <div className="my-auto py-16 px-10 text-right">
                                    {t("label:nok")} { ThousandSeparator(12000) }
                                </div>
                            </div>
                            <div className="grid grid-cols-6 gap-10 px-10 body4 border-b-1 border-MonochromeGray-50 text-MonochromeGray-700">
                                <div className="my-auto py-16 px-10 ">2.</div>
                                <div className="my-auto py-16 px-10 col-span-2">Lorem Ipsum</div>
                                <div className="my-auto py-16 px-10">RSV0002</div>
                                <div className="my-auto py-16 px-10 text-center">
                                    { ThousandSeparator(5) } % {t("label:vat")}
                                </div>
                                <div className="my-auto py-16 px-10 text-right">
                                    {t("label:nok")} { ThousandSeparator(12000) }
                                </div>
                            </div>
                        </div>
                    </Hidden>

                    <Hidden mdUp>
                        <div className="p-20 border-1 border-MonochromeGray-100"
                        >
                            <div>
                                <div className="flex justify-between items-center subtitle2 text-MonochromeGray-700 pb-10 border-b-1 border-MonochromeGray-50">
                                    <div>1</div>
                                    <div>
                                    {t("label:nok")} { ThousandSeparator(1200) }
                                    </div>
                                </div>
                                <div className="flex flex-col gap-10 mt-20">
                                    <div className="grid grid-cols-2 justify-between items-center">
                                        <div className="subtitle3 text-MonochromeGray-700">
                                            {t("label:productName")}
                                        </div>
                                        <div className="body3 text-MonochromeGray-700">
                                            Lorem Ipsum
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 justify-between items-center">
                                        <div className="subtitle3 text-MonochromeGray-700">
                                            {t("label:productId")}
                                        </div>
                                        <div className="body3 text-MonochromeGray-700">
                                            RSV0001
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 justify-between items-center">
                                        <div className="subtitle3 text-MonochromeGray-700">
                                            Tax
                                        </div>
                                        <div className="body3 text-MonochromeGray-700">
                                            { ThousandSeparator(15) } % {t("label:vat")}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Hidden>

                    <div className="grid grid-cols-1 md:grid-cols-3 my-32">
                        <div className="col-span-2 order-2 md:order-1">
                            <div className="flex flex-col gap-20 mb-32">
                            <div className="flex flex-col gap-2">
                                    <div className="body4 text-MonochromeGray-300">
                                        {t("label:customerNotes")}
                                    </div>
                                    <div className="body3  text-MonochromeGray-700 w-3/4">
                                        lorem ipsu dolor sit emit.
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="body4 text-MonochromeGray-300">
                                        {t("label:tnc")}
                                    </div>
                                    <div className="body3  text-MonochromeGray-700 w-3/4">
                                        Lorem ipsum dolor sit emi
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="body4 text-MonochromeGray-300">
                                        {t("label:receiptNo")}
                                    </div>
                                    <div className="body3  text-MonochromeGray-700 w-3/4">
                                        3453464
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <div className="body4 text-MonochromeGray-300">
                                        {t("label:customerReference")}
                                    </div>
                                    <div className="body3  text-MonochromeGray-700 w-3/4">
                                        another lorem ipusm dolor
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="order-1 md:order-2">
                            <Hidden mdDown>
                                <div className="bg-white">
                                    <div className="flex justify-between items-center border-b-1 border-MonochromeGray-50 pb-10 mb-20 body4 font-700">
                                        <div>{t("label:grandTotal")}</div>
                                        <div className="px-12">
                                        {t("label:nok")}{" "}
                                        {ThousandSeparator(8000)}
                                        </div>
                                    </div>
                                </div>
                            </Hidden>
                            <Hidden mdUp>
                                <div className="bg-white">
                                    <div className="flex justify-between items-center bg-MonochromeGray-25 py-20 px-16 mb-20 body4 font-700">
                                        <div className="text-MonochromeGray-700">
                                            {t("label:grandTotal")}
                                        </div>
                                        <div className="text-MonochromeGray-700">
                                            {t("label:nok")}{" "}
                                            {ThousandSeparator(8000)}
                                        </div>
                                    </div>
                                </div>
                            </Hidden>
                        </div>
                    </div>
                    <Hidden mdDown>
                        <div className="flex justify-end">
                        <Button
                            color="secondary"
                            variant="contained"
                            className="font-semibold rounded-4 bg-primary-500"
                            onClick={() => {
                                navigate(`/reservations/${orderDetails.uuid}/payment`);
                            }}
                        >
                            {t("label:toCustomerDetails")}
                        </Button>
                        </div>
                    </Hidden>
                </div>
            </div>

            <Hidden mdUp>
                <div className="fixed bottom-0 flex justify-center items-center gap-20 w-full mb-20">
                <Button
                    color="secondary"
                    variant="contained"
                    className="rounded-full bg-primary-500 button2"
                    onClick={() => {
                        navigate(`/reservations/${orderDetails.uuid}/payment`);
                    }}
                >
                    {t("label:toCustomerDetails")}
                </Button>
                <IconButton
                    color="secondary"
                    className="bg-primary-50 custom-button-shadow focus:bg-blue-200"
                    onClick={scrollToTop}
                >
                    <KeyboardArrowUpIcon />
                </IconButton>
                </div>
            </Hidden>
        </div>
    );
};

export default ReservationCheckout;