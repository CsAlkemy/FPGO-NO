import { Button } from '@mui/material';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function Error404Page() {
  return (
    <div className="flex flex-col flex-1 items-center p-16">
      <div className="w-full max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <div>
            <img className="max-h-384 mx-auto mt-40" src="assets/images/etc/404.png" alt="404 banner" />
          </div>
          <Typography
            variant="h1"
            className="mt-48 sm:mt-96 header4 leading-tight md:leading-none text-center"
          >
            OOPS! PAGE NOT FOUND
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
        >
          <Typography
            variant="h5"
            color="text.secondary"
            className="mt-8 subtitle1 tracking-tight text-center"
          >
            The page you requested could not be found.
          </Typography>
        </motion.div>

        <Link className="block font-normal mt-48" to="/">
          <Button variant='contained' color='secondary' className='rounded-4 px-32 button2'>
            Back to Orders
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Error404Page;
