import React, {useState} from 'react';
import Button from '@mui/material/Button';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from "react-i18next";
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CancelIcon from '@mui/icons-material/Cancel';
import RedoIcon from '@mui/icons-material/Redo';
import PaymentsIcon from '@mui/icons-material/Payments';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import UndoIcon from '@mui/icons-material/Undo';

const ReservationDropdown = (props) => {
    const { t } = useTranslation();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    let menuItem;

    if(props.status.toLowerCase() === 'sent') {
        menuItem = (
            <>
            <MenuItem>
                <ListItemIcon>
                    <RedoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:resendOrder")}</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:cancelOrder")}</ListItemText>
            </MenuItem>
            </>
        );
    } else if(props.status.toLowerCase() === 'reserved') {
        menuItem = (
            <>
            <MenuItem>
                <ListItemIcon>
                    <CreditCardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:chargeFromCard")}</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <PaymentsIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:capturePayments")}</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <UndoIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:refundFromReservations")}</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <DoneAllIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:completeOrder")}</ListItemText>
            </MenuItem>
            <MenuItem>
                <ListItemIcon>
                    <CancelIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t("label:cancelOrder")}</ListItemText>
            </MenuItem>
            </>
        );
    } 
    

    return (
        <>
            <div>
                <Button
                    id="reservation-morevert"
                    aria-controls={open ? 'reservation-dropdown' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >   
                    <MoreVertIcon />
                </Button>

                <Menu
                    id="reservation-dropdown"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                    'aria-labelledby': 'reservation-morevert',
                    }}
                >
                    {menuItem}
                </Menu>
            </div>
        </>
    );
};

export default ReservationDropdown;