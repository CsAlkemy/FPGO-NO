import { Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const index = () => {
  return (
    <div className="w-full py-32 px-24 md:px-32">
      <Typography className="flex text-24 md:text-32 font-extrabold tracking-tight">
        Client On Boarding.
      </Typography>
      <div className="mt-32 grid grid-cols-1 md:grid-cols-4 w-full md:w-11/12 mx-auto gap-10 p-20 md:p-0">
        <Link to="onbroding/client/1" className="front-go-button text-white p-52">
          Client
        </Link>
        <Link to="onbroding/subClient/1" className="front-go-button text-white p-52">
          SubClient
        </Link>
      </div>
    </div>
  );
};

export default index;
