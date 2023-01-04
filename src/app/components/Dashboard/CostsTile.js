import { Chip, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';

const CostsTile = (props) => {
    const {t} = useTranslation()
    const {dayCount, costs} = props.datas;

    return (
        <div className='p-20 border-1 border-MonochromeGray-50 rounded-8'>
            <div className="flex flex-row items-start justify-between">
                <Typography className="subtitle2  truncate">
                    {t("label:costs")}
                </Typography>
                <div className="ml-8">
                    <Chip size="small" className="font-medium text-sm" label={`${dayCount} ${t("label:days")}`} />
                </div>
            </div>
            <div className='mt-10'>
                <div className='grid grid-cols-3 justify-between gap-10 subtitle3 bg-primary-25 p-10'>
                    <div>Type</div>
                    <div className='justify-self-end'>{t("label:quantity")}</div>
                    <div className='justify-self-end'>{t("label:totalCost")}</div>
                </div>
                <div className='flex flex-col gap-5 p-10 body3'>
                    {
                        costs.map((cost)=> {
                            return (
                              <div className='grid grid-cols-3 justify-between gap-10'>
                                  <div className='self-start'> {cost.type}</div>
                                  <div className='justify-self-end'>{cost.quantity}</div>
                                  <div className='justify-self-end'>{t("label:nok")} {cost.total}</div>
                              </div>
                            )
                        })
                    }
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> SMS for payment</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> SMS for payments sss</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> SMS for payment</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                    {/*<div className='grid grid-cols-3 justify-between gap-10'>*/}
                    {/*    <div className='self-start'> Payent</div>*/}
                    {/*    <div className='justify-self-end'>25</div>*/}
                    {/*    <div className='justify-self-end'>NOK 30.00</div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

export default CostsTile