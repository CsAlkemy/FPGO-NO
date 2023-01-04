import { Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const index = () => {
  return (
    <div className="flex gap-10">
      <Link to={"/customers/corporate"}>
        <Button
          className="px-10 m-20 rounded-4"
          variant="contained"
          color="secondary"
        >
          Go to corporate customer
        </Button>
      </Link>
      <Link to={"/customers/private"}>
        <Button
          className="px-10 m-20 rounded-4"
          variant="contained"
          color="secondary"
        >
          Go to Private customer
        </Button>
      </Link>
    </div>
  );
};

export default index;
