import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import {Drawer, Hidden, IconButton, ListItem, ListItemButton,} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import {selectUser} from "app/store/userSlice";
import {useSnackbar} from "notistack";
import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import AuthService from "../../data-access/services/authService";
import {changeLanguage, selectCurrentLanguageId} from "app/store/i18nSlice";
import {useTranslation} from "react-i18next";

function UserMenu(props) {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [userMenu, setUserMenu] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const currentLanguage = useSelector(selectCurrentLanguageId);
  const dispatch = useDispatch();

  const userMenuClick = (event) => {
    setUserMenu(event.currentTarget);
  };

  const userMenuClose = () => {
    setUserMenu(null);
  };
  //
  const signOut = () => {
    AuthService.logout();
    userMenuClose();
    // navigate("/dashboard")
  };
  const myProfile = () => {
    navigate("/my-profile", {
      state: {
        userId: user.data.uuid,
      },
    });
    userMenuClose();
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const languages = [
    {
      value: "en",
      label: "English",
      src: "assets/images/flags/english.png",
      isActive: currentLanguage === "en",
    },
    {
      value: "no",
      label: "Norwegian",
      src: "assets/images/flags/Norway.png",
      isActive: currentLanguage === "no",
    },
  ];

  const handleLanguageChange = (lng) => {
    dispatch(changeLanguage(lng));
  };

  const list = (anchor) => (
    <Box
      sx={{ width: 240 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            className="hover:bg-primary-50"
            onClick={() => {
              myProfile();
            }}
          >
            <ListItemIcon>{<PersonOutlineOutlinedIcon />}</ListItemIcon>
            <ListItemText className="body2" primary={"My Profile"} />
          </ListItemButton>
        </ListItem>
        <ListItem
          disablePadding
          className="hover:bg-primary-50"
          onClick={() => {
            signOut();
          }}
        >
          <ListItemButton>
            <ListItemIcon>{<LogoutOutlinedIcon />}</ListItemIcon>
            <ListItemText className="body2" primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider className="hidden" />
      <div className="subtitle2 mb-10 mt-40 text-MonochromeGray-300 px-16">
        Language
      </div>
      <List>
        {languages.map((Language, index) => (
          <ListItem
            key={index}
            disablePadding
            className={`${
              Language.isActive === true ? "bg-primary-50" : ""
            } mx-16 mt-5`}
            onClick={() => handleLanguageChange(Language.value)}
          >
            <ListItemButton>
              <ListItemIcon>{<img src={Language.src}></img>}</ListItemIcon>
              <ListItemText>
                {t(`label:${Language.label.toLowerCase()}`)}
              </ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Hidden smDown>
        <Button
          className="min-h-40 max-w-200 px-0 md:px-16 py-0 md:py-6 rounded-4 flex justify-between items-center"
          onClick={userMenuClick}
          color="inherit"
        >
          <div className="md:flex flex-col mx-4 items-end">
            <Typography
              component="span"
              className="text-left font-semibold flex subtitle3"
            >
              {user.data.displayName}
            </Typography>
            <Typography
              className="text-11 text-left font-medium capitalize body4"
              color="text.secondary"
            >
              {user?.role[0] ? user.role[0].split("-")[0] : ""}{" "}
              <span>{user?.role[0] ? user.role[0].split("-")[1] : ""}</span>
            </Typography>
          </div>
          <FuseSvgIcon className="text-48" size={24} color="action">
            material-outline:arrow_drop_down
          </FuseSvgIcon>
        </Button>
      </Hidden>
      <Hidden smUp>
        <IconButton
          aria-label="fingerprint"
          className="bg-primary-50 mx-5"
          color="secondary"
          onClick={() => setIsDrawerOpen(true)}
        >
          <PersonIcon className="icon-size-20" />
        </IconButton>
      </Hidden>
      <Hidden smUp>
        <Drawer
          anchor="right"
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(!isDrawerOpen);
          }}
          PaperProps={{
            sx: { width: "70%" },
          }}
        >
          {list("right")}
        </Drawer>
      </Hidden>

      <Hidden smDown>
        <Popover
          open={Boolean(userMenu)}
          anchorEl={userMenu}
          onClose={userMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          classes={{
            paper: "p-8 max-w-200",
          }}
        >
          {
            <div className="max-w-200">
              <MenuItem
                // component={Link}
                // to="/apps/profile"
                onClick={() => {
                  myProfile();
                }}
                role="button"
              >
                <ListItemIcon className="max-w-200">
                  <FuseSvgIcon>heroicons-outline:user-circle</FuseSvgIcon>
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </MenuItem>
              <MenuItem
                // component={NavLink}
                // to="/sign-out"
                onClick={() => {
                  signOut();
                }}
              >
                <ListItemIcon className="max-w-200">
                  <FuseSvgIcon>heroicons-outline:logout</FuseSvgIcon>
                </ListItemIcon>
                <ListItemText primary="Sign out" />
              </MenuItem>
            </div>
          }
        </Popover>
      </Hidden>
    </>
  );
}

export default UserMenu;
