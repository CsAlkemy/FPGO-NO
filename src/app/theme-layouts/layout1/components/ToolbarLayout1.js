import { ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Hidden from "@mui/material/Hidden";
import Toolbar from "@mui/material/Toolbar";
import clsx from "clsx";
import { memo } from "react";
import { useSelector } from "react-redux";
import {
  selectFuseCurrentLayoutConfig,
  selectToolbarTheme,
} from "app/store/fuse/settingsSlice";
import { selectFuseNavbar } from "app/store/fuse/navbarSlice";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import LanguageSwitcher from "../../shared-components/LanguageSwitcher";
import NavbarToggleButton from "../../shared-components/NavbarToggleButton";
import UserMenu from "../../shared-components/UserMenu";
import {
  BsArrowLeft,
  BsArrowLeftCircle,
  BsArrowRight,
  BsArrowRightCircle,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function ToolbarLayout1(props) {
  const config = useSelector(selectFuseCurrentLayoutConfig);
  const navbar = useSelector(selectFuseNavbar);
  const toolbarTheme = useSelector(selectToolbarTheme);
  const navigate = useNavigate();
  const Location = window.location.hostname;

  const goToPreviousPage = () => {
    history.back();
  };
  const goToNextPage = () => {
    history.forward();
  };

  return (
    <ThemeProvider theme={toolbarTheme}>
      <AppBar
        id="fuse-toolbar"
        className={clsx(
          "flex relative z-20 border-b-1 border-MonochromeGray-50 shadow-none",
          props.className
        )}
        color="default"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? toolbarTheme.palette.background.paper
              : toolbarTheme.palette.background.default,
        }}
        position="static"
      >
        <Toolbar className="p-0 min-h-48 md:min-h-64">
          <div className="flex flex-1 px-16">
            {config.navbar.display && config.navbar.position === "left" && (
              <>
                <Hidden lgDown>
                  {(config.navbar.style === "style-3" ||
                    config.navbar.style === "style-3-dense") && (
                      <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                    )}

                  {config.navbar.style === "style-1" && !navbar.open && (
                    <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                  )}
                </Hidden>

                <Hidden lgUp>
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
                </Hidden>
              </>
            )}
            <Hidden smUp>
              <img className="logo-icon w-full h-36 self-center mb-5" src="assets/images/logo/Go.svg" alt="logo" />
            </Hidden>
            <Hidden smDown>
              <Stack direction="row" className="gap-10">
                <div className="border-1 border-MonochromeGray-50 rounded-full h-40 w-40">
                  <IconButton
                    aria-label="left arrow"
                    className="header-navigation"
                    onClick={() => {
                      goToPreviousPage();
                    }}
                  >
                    <BsArrowLeft className="" />
                  </IconButton>
                </div>
                <div className="border-1 border-MonochromeGray-50 rounded-full h-40 w-40">
                  {/* <IconButton aria-label="right arrow" className='header-navigation-disable' onClick={()=> {goToNextPage()}}> */}
                  <IconButton
                    aria-label="right arrow"
                    className="header-navigation"
                    onClick={() => {
                      goToNextPage();
                    }}
                  >
                    <BsArrowRight />
                  </IconButton>
                </div>
              </Stack>
            </Hidden>
          </div>

          <div className="flex gap-x-5 items-center px-8 h-full overflow-x-auto">
            <Hidden smDown>
              <LanguageSwitcher />
              {(Location === "13.53.82.155" ||
                Location === "13.48.85.3" ||
                Location === "localhost" ||
                Location === "dev.frontpayment.no" ||
                Location === "stg.frontpayment.no") && (
                  <Button
                    className="rounded-md"
                    size="small"
                    variant={"contained"}
                    type='button'
                    style={{
                      backgroundColor:
                        Location === "13.53.82.155" || Location === "dev.frontpayment.no"
                          ? "darkred"
                          : Location === "13.48.85.3" || Location === "stg.frontpayment.no"
                            ? "darkviolet"
                            : "darkblue",
                    }}
                  >
                    <Typography style={{ color: "white" }}>
                      {Location === "13.53.82.155" || Location === "dev.frontpayment.no"
                        ? "DEV"
                        : Location === "13.48.85.3" || Location === "stg.frontpayment.no"
                          ? "STG"
                          : "LOCAL"}
                    </Typography>
                  </Button>
                )}
            </Hidden>

            <Divider orientation="vertical" flexItem />
            <UserMenu />

            {/* <AdjustFontSize /> */}

            {/* <FullScreenToggle /> */}

            {/* <NavigationSearch /> */}

            {/* <Hidden lgUp> */}
            {/*   <ChatPanelToggleButton /> */}
            {/* </Hidden> */}

            {/* <QuickPanelToggleButton /> */}

            {/* <NotificationPanelToggleButton /> */}
          </div>

          {config.navbar.display && config.navbar.position === "right" && (
            <>
              <Hidden lgDown>
                {!navbar.open && (
                  <NavbarToggleButton className="w-40 h-40 p-0 mx-0" />
                )}
              </Hidden>

              <Hidden lgUp>
                <NavbarToggleButton className="w-40 h-40 p-0 mx-0 sm:mx-8" />
              </Hidden>
            </>
          )}
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default memo(ToolbarLayout1);
