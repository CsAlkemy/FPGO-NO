import React from 'react'
import { Button } from '@mui/material'
import CallOutlinedIcon from '@mui/icons-material/CallOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';

const contact = () => {
    return (
        <div className='mt-auto'>
            <div className="flex items-center mt-16 space-x-12 gap-1 justify-between">
                <Button
                    variant="text"
                    className="body4 rounded-4 important-monogrom w-fit px-20 hover:bg-MonochromeGray-50"
                    href="tel:38809440"
                    startIcon={<CallOutlinedIcon />}
                >
                    38 80 94 40
                </Button>
                <Button
                    variant="text"
                    className="body4 rounded-4  w-fit hover:bg-MonochromeGray-50 important-monogrom"
                    href={`mailto:kundeservice@frontpayment.no`}
                    
                    startIcon={<EmailOutlinedIcon />}
                >
                    kundeservice@frontpayment.no
                </Button>
            </div>
            <div className="flex items-center w-full mt-12 gap-3 justify-between">
                <Button
                    variant="text"
                    className="body4 rounded-4 important-monogrom w-fit hover:bg-MonochromeGray-50 shadow-0"
                    href="https://goo.gl/maps/uvew5un7Te2aGi7r6"
                    target={'_blank'}
                    startIcon={<RoomOutlinedIcon />}
                >
                    Luramyrveien 65, 4313 Sandnes
                </Button>
                <Button
                    variant="text"
                    className="body4 rounded-4 important-monogrom w-fit hover:bg-MonochromeGray-50 shadow-0"
                    href="https://frontpayment.no/"
                    target={'_blank'}
                    startIcon={<LanguageOutlinedIcon />}
                >
                    frontpayment.no
                </Button>
            </div>
        </div>
    )
}

export default contact