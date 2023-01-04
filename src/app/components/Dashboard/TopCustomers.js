import { Chip, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';

const TopCustomers = (props) => {
    const {t} = useTranslation()
    const {dayCount, topCustomers} = props.datas;
    return (
        <div className='p-20 border-1 border-MonochromeGray-50 rounded-8'>
            <div className="flex flex-row items-start justify-between">
                <Typography className="subtitle2  truncate">
                    {t("label:topCustomers")}
                </Typography>
                <div className="ml-8">
                    <Chip size="small" className="font-medium text-sm" label={`${dayCount} ${t("label:days")}`} />
                </div>
            </div>
            <div className='mt-10'>
                <div className='grid grid-cols-3 justify-between gap-10 subtitle3 bg-primary-25 p-10'>
                    <div>{t("label:name")}</div>
                    <div className='justify-self-end'>{t("label:orders")}</div>
                    <div className='justify-self-end'>{t("label:totalRevenue")}</div>
                </div>
                <div className='flex flex-col gap-5 p-10 body3'>
                    {
                        topCustomers.map((customer)=> {
                            return (
                              <div className='grid grid-cols-3 justify-between gap-10'>
                                  <div className='self-start'> {customer.name}</div>
                                  <div className='justify-self-end'>{customer.orders}</div>
                                  <div className='justify-self-end'>{t("label:nok")} {customer.revenue}</div>
                              </div>
                            )
                        })
                    }
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> Andreasen</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> Benedikte Andreasen</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> Andreasen</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> Andreasen</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

export default TopCustomers