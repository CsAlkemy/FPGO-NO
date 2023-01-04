import React from "react";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const index = () => {
  return (
    <div className="w-full py-32 px-24 md:px-32">
      <Typography
        component={motion.span}
        initial={{ x: -20 }}
        animate={{ x: 0, transition: { delay: 0.2 } }}
        delay={300}
        className="flex text-24 md:text-32 font-extrabold tracking-tight"
      >
        Edit User.
      </Typography>
      <div className="mt-32 grid grid-cols-1 md:grid-cols-4 w-full md:w-11/12 mx-auto gap-10 p-20 md:p-0">
        <Link
          to={"/user-management/user-profile/1"}
          className="front-go-button text-white p-52"
        >
          Fp Admin
        </Link>
        <Link
          to={"/user-management/user-profile/2"}
          className="front-go-button text-white p-52"
        >
          Client Admin
        </Link>
        <Link
          to={"/user-management/user-profile/3"}
          className="front-go-button text-white p-52"
        >
          SubClient Admin
        </Link>
        <Link
          to={"/user-management/user-profile/4"}
          className="front-go-button text-white p-52"
        >
          General User
        </Link>
      </div>
    </div>
  );
};

export default index;
