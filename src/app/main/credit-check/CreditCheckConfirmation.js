import { Paper, Typography, Button, Divider } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion';
import '../../../styles/colors.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function CreditCheckConfirmation() {
    const clientInfo = useSelector((state) => state.creditcheck.creditCheckInfo);
    const clientTypeTest = 'Corporate' // 'Private'
    // const clientTypeTest = 'Private' // 'Corporate'
    // const clientRegNo = ' 837231221 ';
    // const clientPersonalNo = ' +47 990 65 331 ';

    // const [clientRegNo, setClientRegNo] = useState('837231221');
    // const [clientPersonalNo, setClientPersonalNo] = useState('+47 990 65 331');
    // const [clientType, setClientType] = useState(clientTypeTest)

    useEffect(() => {
    }, [clientInfo]);

    return (
        <>
            <div className="flex w-full py-16 px-24">
                <Typography
                    component={motion.span}
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.2 } }}
                    delay={300}
                    className="flex text-24 font-extrabold tracking-tight"
                >
                    Credit Check ({clientInfo.type === 'corporate' ? "Corporate" : "Private"} Client)
                </Typography>
                <div className="flex flex-1 justify-end space-x-8 w-full sm:w-auto">
                    <Button
                        color="secondary"
                        variant="text"
                        className='rounded-md'
                        disabled
                    >
                        Cancel
                    </Button>

                    <Button
                        color="secondary"
                        variant="contained"
                        className='text-m-surface rounded-md'
                        id="basic-button"
                        disabled
                    >
                        Confirm
                    </Button>
                </div>
            </div>
            <Divider />
            <div>

                <Paper className="p-64 px-64 m-48 bg-m-grey-25 rounded-sm flex flex-col items-center content-center">
                    <Typography variant='h5' className='justify-self-center font-medium'>
                        Request Successful
                    </Typography>
                    {clientInfo.type === 'corporate' ?
                        <>
                            <Typography className='md:mt-16 px-64'>
                                Your Credit Check request for Corporate Client <strong>{clientInfo.id}</strong> has been successfully sent.
                            </Typography>
                            <Typography className='md:mb-40 px-64'>
                                You can track the status of this request on the Credit Check page.
                            </Typography>
                        </>
                        :
                        <>
                            <Typography className='md:mt-16 px-64'>
                                Your Credit Check request for Private Client <strong>{clientInfo.id}</strong> has been successfully sent.
                            </Typography>
                            <Typography className='md:mb-40 px-64'>
                                You can track the status of this request on the Credit Check page.
                            </Typography>
                        </>
                    }

                    <Link className="login-page-no-underline" to="/credit-check">
                        <Button variant="contained"
                            type="text"
                            size="large"
                            className="flex-auto rounded-md text-13 font-500 px-64"
                            color="secondary"
                        >
                            Go to Credit Check Page
                        </Button>
                    </Link>
                </Paper>
            </div>
        </>
    )
}
