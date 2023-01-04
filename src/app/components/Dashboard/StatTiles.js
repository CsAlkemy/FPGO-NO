import React from 'react'
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentsSharpIcon from '@mui/icons-material/PaymentsSharp';
import { useTranslation } from 'react-i18next';

export const StatTiles = (props) => {
    const {t} = useTranslation()
    const {dayCount, customersCount, ordersCount, totalRevenue, totalRefund} = props.datas

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10'>
            <div className='p-14 border-1 border-MonochromeGray-50 rounded-6'>
                <div className='flex gap-16'>
                    <div className='min-w-52 bg-[#2F80ED1F] rounded-4 flex justify-center items-center'>
                        <BusinessCenterIcon className='text-[#2F80ED]'  />
                    </div>
                    <div className='flex flex-col items-start gap-7'>
                        <div className='subtitle2 text-MonochromeGray-300'>{t("label:newCustomer")}</div>
                        <div className='header6 text-MonochromeGray-700'>{customersCount}</div>
                    </div>
                </div>
            </div>
            <div className='p-14 border-1 border-MonochromeGray-50 rounded-6'>
                <div className='flex gap-16'>
                    <div className='min-w-52 bg-[#8651E01F] rounded-4 flex justify-center items-center'>
                        <ReceiptLongIcon className='text-[#8651E0]'  />
                    </div>
                    <div className='flex flex-col items-start gap-7'>
                        <div className='subtitle2 text-MonochromeGray-300'>{t("label:noOfOrders")}</div>
                        <div className='header6 text-MonochromeGray-700'>{ordersCount}</div>
                    </div>
                </div>
            </div>
            <div className='p-14 border-1 border-MonochromeGray-50 rounded-6'>
                <div className='flex gap-16'>
                    <div className='min-w-52 bg-[#27AE601F] rounded-4 flex justify-center items-center'>
                        <PaymentsSharpIcon className='text-[#27AE60]'  />
                    </div>
                    <div className='flex flex-col items-start gap-7'>
                        <div className='subtitle2 text-MonochromeGray-300'>{t("label:totalRevenue")}</div>
                        <div className='header6 text-MonochromeGray-700'>{t("label:nok")} {Math.round(totalRevenue)}</div>
                    </div>
                </div>
            </div>
            <div className='p-14 border-1 border-MonochromeGray-50 rounded-6'>
                <div className='flex gap-16'>
                    <div className='min-w-52 bg-[#EB57571F] rounded-4 flex justify-center items-center'>
                        <ReceiptIcon className='text-[#EB5757]'  />
                    </div>
                    <div className='flex flex-col items-start gap-7'>
                        <div className='subtitle2 text-MonochromeGray-300'>{t("label:totalRefund")}</div>
                        <div className='header6 text-MonochromeGray-700'>{t("label:nok")} {Math.round(totalRefund)}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}