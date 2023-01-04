import { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import '../../../../styles/colors.css';

export default function UnderReview() {
  const [timer, setTimer] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (timer > 0) setTimer((timer) => timer - 1);
      else navigate('/login');
    }, 1000);
  });

  return (
    <div className="flex flex-col flex-auto items-center sm:justify-center min-w-0 md:p-32">
      <Paper className="flex w-full sm:w-auto min-h-full sm:min-h-auto md:w-full md:max-w-7xl rounded-0 sm:rounded-2xl sm:shadow overflow-hidden h-3xl">
        <div className="w-full sm:w-auto sm:p-48 ltr:border-r-1 rtl:border-l-1 md:w-6/12">
          <Paper className="flex flex-col px-40 items-center bg-m-grey-25 rounded-sm flex flex-col items-center justify-center h-full text-center">
            <Typography variant="h5" className="font-medium">
              Email Validated
            </Typography>
            <Typography className="md:mt-16 md:mb-56">
              Your email has been validated. Please login to your account.
            </Typography>
            <Typography className="text-primary-500">Ridercting to login in {timer}</Typography>
          </Paper>
        </div>

        <Box
          className="relative hidden md:flex mt0-5 flex-auto items-end p-48 overflow-hidden bg-hero-login h-full w-full bg-no-repeat bg-cover"
          style={{ backgroundImage: `url(${require('src/images/Auth/Dark.jpg')})` }}
        >
          <div className="z-10 relative w-full max-w-2xl">
            <div className="leading-none text-white">
              <div className="text-32 font-normal tracking-wider mb-12">Welcome to</div>
              <div className="text-44 font-bold">Front Payment Go</div>
            </div>
            <div className="mt-24 text-lg tracking-tight text-gray-400 max-w-512 leading-6">
              Turpis nulla integer dui tempor mattis. Turpis semper in ante lacus sit interdum. Ut
              commodo donec dictum faucibus.
            </div>
          </div>
        </Box>
      </Paper>
    </div>
  );
}
