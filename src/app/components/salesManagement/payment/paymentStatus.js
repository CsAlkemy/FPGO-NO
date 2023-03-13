import { CheckCircle } from '@mui/icons-material';
import React, { useState, useEffect } from 'react'
import PaymentHeader from './paymentHeader';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";

const paymentStatus = () => {
  const {t} = useTranslation();
  const queryParams = useParams();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    console.log(queryParams.uuid)
  }, [isLoading]);

    // const [isSuccess, setIsSuccess] = React.useState(false);
  return (
    <div className="flex flex-col flex-auto min-w-0 max-w-screen-xl my-32">
        <div className="flex-auto mx-auto  w-full md:w-4/5 lg:w-3/4 xl:w-7/12">
            <div className='order-receipt-container'>
                <PaymentHeader />
                <div className="mt-32 bg-MonochromeGray-25 px-32 py-56 rounded-8">
                    <div className='flex flex-col justify-center items-center gap-20'>
                        <div>
                        {
                            // isSuccess ?
                            <CheckCircle className='custom-bg-teal-500 icon-size-52' />
                            // :<CancelIcon className='text-red-500 icon-size-52' />
                        }
                        </div>
                        {/*<div className='header5'>Payment {isSuccess? 'Successful':'Failed'}</div>*/}
                        <div className='header5'>{t("label:paymentSuccessful")}</div>
                        <div className='body2 w-full md:w-3/4 mx-auto text-center'>{t("label:paymentSuccessfulMessage")}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default paymentStatus