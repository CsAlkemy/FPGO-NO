import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import AuthMobileHeader from "../Layout/authMobileHeader";

export default function RegistrationConfirmation() {
  return (
    <>
    <div className='p-20'>
    <AuthMobileHeader isShow = {true} />
    </div>
    <div className="flex flex-col flex-auto items-center justify-start sm:justify-center p-10 md:p-32 bg-ccc ">
      <div className="w-full md:w-auto md:pb-auto p-20 m-10 md:m-0 md:p-88 ltr:border-r-1 rtl:border-l-1 bg-ccc sm:bg-white rounded-lg">
        <div className="p-16 md:p-200  bg-ccc flex flex-col gap-20 justify-center items-center">
          <div className="header5 text-center">Account Under Review</div>
          <div className="body2 text-center">
            Your account has been created but it’s currently under review. You will recieve an email
            once your account has been activated.
          </div>
          <Link className="login-page-no-underline" to="/login">
            <Button
              variant="contained"
              type="submit"
              size="large"
              className="flex-auto rounded-md button2 px-64"
              color="secondary"
            >
              Go To Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

{
  /* <Paper className="p-20 mx-64 my-64">
                <Paper className="p-64 px-64 m-48 bg-m-grey-25 rounded-sm flex flex-col items-center">
                    <Typography variant='h5' className='justify-self-center font-medium'>
                        Account Under Review
                    </Typography>
                    <Typography className='md:mt-16 md:mb-56'>
                        Your account has been created but it’s currently under review. You will recieve an email once your account has been activated.
                    </Typography>
                    <Link className="login-page-no-underline" to="/login">
                    <Button variant="contained"
                        type="submit"
                        size="large"
                        className="flex-auto rounded-md text-13 font-500 px-64"
                        color="secondary"
                    >
                            Go To Login
                    </Button>
                        </Link>
                </Paper>
            </Paper> */
}
