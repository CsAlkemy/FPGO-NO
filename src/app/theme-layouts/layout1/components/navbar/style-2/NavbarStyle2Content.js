import FuseScrollbars from "@fuse/core/FuseScrollbars";
import AddIcon from "@mui/icons-material/Add";
import { Button, IconButton } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import { selectFuseCurrentSettings } from 'app/store/fuse/settingsSlice';
import { selectUser } from 'app/store/userSlice';
import clsx from "clsx";
import { memo } from "react";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FP_ADMIN } from '../../../../../utils/user-roles/UserRoles';
import Logo from "../../../../shared-components/Logo";
import NavbarToggleButton from "../../../../shared-components/NavbarToggleButton";
import Navigation from "../../../../shared-components/Navigation";
import { useTranslation } from 'react-i18next';

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  "& ::-webkit-scrollbar-thumb": {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.24)"
        : "rgba(255, 255, 255, 0.24)"
    }`,
  },
  "& ::-webkit-scrollbar-thumb:active": {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === "light"
        ? "rgba(0, 0, 0, 0.37)"
        : "rgba(255, 255, 255, 0.37)"
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: "contain",
  overflowX: "hidden",
  overflowY: "auto",
  WebkitOverflowScrolling: "touch",
  background:
    "linear-gradient(rgba(0, 0, 0, 0) 30%, rgba(0, 0, 0, 0) 30%), linear-gradient(rgba(0, 0, 0, 0.25) 0, rgba(0, 0, 0, 0) 40%)",
  backgroundRepeat: "no-repeat",
  backgroundSize: "100% 40px, 100% 10px",
  backgroundAttachment: "local, scroll",
}));

function NavbarStyle2Content(props) {
  const navigate = useNavigate();
  const user = useSelector(selectUser)
  const { t } = useTranslation()

  const settings = useSelector(selectFuseCurrentSettings);
  const { config } = settings.layout;

  return (
    <Root
      className={clsx(
        "flex flex-auto flex-col overflow-hidden h-full",
        props.className
      )}
    >
      <AppBar
        color="primary"
        position="static"
        className="flex flex-row items-center shrink h-48 md:h-76 min-h-48 md:min-h-76 px-12 shadow-0"
      >
        <div className="flex flex-1 mx-4">
          <Logo />
        </div>
        <NavbarToggleButton className="w-40 h-40 p-0" />
      </AppBar>
      {
        !settings.layout.config.navbar.folded && (
          <Button
            startIcon={<AddIcon />}
            color="secondary"
            variant="outlined"
            className="button-outline-product flex justify-center items-center custom-position-for-nav-button mt-20 mb-10"
            onClick={()=> navigate(`/create-order`)}
            disabled={user.role[0] === FP_ADMIN}
          >
            {t("label:createOrder")}
          </Button>
        )
      }
      {
        !!settings.layout.config.navbar.folded && (
          <IconButton aria-label="fingerprint" color="secondary" className="rounded-4 mx-10"
            onClick={()=> navigate(`/create-order`)}
            disabled={user.role[0] === FP_ADMIN}
          >
            <AddIcon />
          </IconButton>
        )
      }

      <StyledContent
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        
        <Navigation layout="vertical" />
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarStyle2Content);
