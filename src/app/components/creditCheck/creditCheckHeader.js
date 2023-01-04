import * as React from "react";
import Input from "@mui/material/Input";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import { Button, Menu, MenuItem } from "@mui/material";
import "../../../styles/colors.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

export default function CreditCheckHeader(props) {
  const {t} = useTranslation()
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const searchText = useSelector(selectOrdersSearchText);
  const searchText = "A";
  const [creditCheckType, setCreditCheckType] = React.useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="flex flex-col sm:flex-row  w-full space-y-8 sm:space-y-0 items-center justify-between py-12 px-24 md:px-32">
      <Typography className="flex header6">All Users</Typography>

      <div className="flex flex-1 items-center justify-end space-x-8 w-full sm:w-auto">
        <Paper
          className="flex items-center w-full sm:max-w-288 space-x-8 px-16 rounded-md border-1 shadow-0"
          sx={{ width: 400 }}
        >
          <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>

          <Input
            placeholder="Search by name, org ID & phone no."
            className=""
            disableUnderline
            fullWidth
            //   value={searchText}
            inputProps={{
              "aria-label": "Search Orders",
            }}
            //   onChange={(ev) => dispatch(setOrdersSearchText(ev))}
          />
        </Paper>
        <div>
          <Button
            color="secondary"
            variant="contained"
            className="rounded-md button2"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            endIcon={<KeyboardArrowDownIcon />}
          >
            New Credit Check
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            className="px-16"
          >
            <MenuItem onClick={handleClose}>
              <Link to="/credit-check/corporate-client">
                For Corporate Client
              </Link>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Link to="/credit-check/private-client">For Private Client</Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
