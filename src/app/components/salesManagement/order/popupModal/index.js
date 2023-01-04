import React from 'react'
import { Button } from '@mui/material'
import OrderModal from './orderModal';
import { useTranslation } from 'react-i18next';

const index = () => {
  const {t} = useTranslation()
  const [ open, setOpen ] = React.useState(false);
  const [ headerTitle, setHeaderTitle ] = React.useState ();

  return (
    <>
      <div className=' grid grid-cols-1 md:grid-cols-3  w-full md:w-3/4 gap-10 m-20'>
          <Button
          className='p-20 rounded-0'
          variant='contained'
          onClick={()=> {
            setOpen(true)
            setHeaderTitle('Cancel Order')
          }}
          >
            {t("label:cancelOrder")}
          </Button>
          <Button
          variant='contained'
          className='p-20  rounded-0'
          onClick={()=> {
            setOpen(true)
            setHeaderTitle('Resend Order')
          }}
          >
            {t("label:resendOrder")}
          </Button>
          <Button
          className='p-20  rounded-0'
          variant='contained'
          onClick={()=> {
            setOpen(true)
            setHeaderTitle('Send Refund')
          }}
          >
            {t("label:sendRefund")}
          </Button>
      </div>
      <OrderModal
        open={open}
        setOpen={setOpen}
        headerTitle={headerTitle}
      />
    </>
  )
}

export default index