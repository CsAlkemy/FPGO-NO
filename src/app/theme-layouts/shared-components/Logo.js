import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { selectFuseCurrentSettings } from 'app/store/fuse/settingsSlice';

const Root = styled('div')(({ theme }) => ({
  '& > .logo-icon': {
    transition: theme.transitions.create(['width', 'height'], {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
  '& > .badge': {
    transition: theme.transitions.create('opacity', {
      duration: theme.transitions.duration.shortest,
      easing: theme.transitions.easing.easeInOut,
    }),
  },
}));

function Logo() {
  const settings = useSelector(selectFuseCurrentSettings);
  const { config } = settings.layout;

  return (
    <Root className="flex items-center">
      {/* <img className="logo-icon w-full h-48" src="assets\images\logo\front-go.svg" alt="logo" /> */}
      {config?.navbar?.folded ? (
        <img className="logo-icon-custom w-full h-48" src="assets/images/logo/Go.svg" alt="logo" />
      ) : (
        <img
          className="logo-icon w-full h-48"
          src="assets/images/logo/front-go.svg"
          alt="logo"
        />
      )}
      <div className="badge flex items-center py-4 px-8 mx-8 rounded">
        <div className="react-text text-12 mx-4 invisible">go</div>
      </div>
    </Root>
  );
}

export default Logo;
