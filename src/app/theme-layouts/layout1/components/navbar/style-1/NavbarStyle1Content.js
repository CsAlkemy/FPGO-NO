import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { memo } from 'react';
import Logo from '../../../../shared-components/Logo';
import NavbarToggleButton from '../../../../shared-components/NavbarToggleButton';
import Navigation from '../../../../shared-components/Navigation';
import { Button, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { FP_ADMIN } from '../../../../../utils/user-roles/UserRoles';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { useTranslation } from 'react-i18next';
import { selectFuseCurrentSettings } from 'app/store/fuse/settingsSlice';
import { navbarCloseMobile } from 'app/store/fuse/navbarSlice';

const Root = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  color: theme.palette.text.primary,
  '& ::-webkit-scrollbar-thumb': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.24)' : 'rgba(255, 255, 255, 0.24)'
    }`,
  },
  '& ::-webkit-scrollbar-thumb:active': {
    boxShadow: `inset 0 0 0 20px ${
      theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.37)' : 'rgba(255, 255, 255, 0.37)'
    }`,
  },
}));

const StyledContent = styled(FuseScrollbars)(({ theme }) => ({
  overscrollBehavior: 'contain',
  overflowX: 'hidden',
  overflowY: 'auto',
  WebkitOverflowScrolling: 'touch',
  backgroundRepeat: 'no-repeat',
  backgroundSize: '100% 40px, 100% 10px',
  backgroundAttachment: 'local, scroll',
}));

function NavbarStyle1Content(props) {
  const navigate = useNavigate();
  const user = useSelector(selectUser)
  const { t } = useTranslation()
  const dispatch = useDispatch();

  const settings = useSelector(selectFuseCurrentSettings);
  const { config } = settings.layout;

  return (
    <Root className={clsx('flex flex-auto flex-col overflow-hidden h-full', props.className)}>
      <div className="flex flex-row items-center shrink-0 h-48 md:h-72 px-20">
        <div className="flex flex-1 mx-4">
          <Logo />
        </div>

        <NavbarToggleButton className="w-40 h-40 p-0" />
      </div>
      {
        !settings.layout.config.navbar.folded && (
          <Button
            startIcon={<AddIcon />}
            color="secondary"
            variant="outlined"
            className="button-outline-product flex justify-center items-center custom-position-for-nav-button mt-20 mb-10"
            onClick={()=> {
              navigate(`/quick-order`)
              dispatch(navbarCloseMobile());
            }}
            disabled={user.role[0] === FP_ADMIN}
          >
            {t("label:quickOrder")}
          </Button>
        )
      }
      {
        !!settings.layout.config.navbar.folded && (
          <IconButton aria-label="fingerprint" color="secondary" className="rounded-4 mx-10"
                      onClick={()=> navigate(`/quick-order`)}
                      disabled={user.role[0] === FP_ADMIN}
          >
            <AddIcon />
          </IconButton>
        )
      }

      <StyledContent
        className="flex flex-1 flex-col min-h-0"
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        {/* <UserNavbarHeader /> */}

        <Navigation layout="vertical" />
        {/*<div className="flex flex-0 items-center justify-center py-48 opacity-10">*/}
        {/*  <img className="w-full max-w-64" src="assets/images/logo/Go.svg" alt="footer logo" />*/}
        {/*</div>*/}
      </StyledContent>
    </Root>
  );
}

export default memo(NavbarStyle1Content);
