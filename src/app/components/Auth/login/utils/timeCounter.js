import * as React from 'react';

const Timer = (props) => {
  const { initialMinute = 0, initialSeconds = 0, setResend, resendClicked, setResendClicked} = props;
  const [minutes, setMinutes] = React.useState(initialMinute);
  const [seconds, setSeconds] = React.useState(initialSeconds);
  React.useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } else {
          setMinutes(minutes - 1);
          setSeconds(59);
        }
      }
      if(minutes === 0 && seconds === 0) {
        setResend(true);
        if(resendClicked === true) {
          setMinutes(1);
          setSeconds(30);
          setResendClicked(false);
          setResend(false)

        }

      }
    }, 1000);
    return () => {
      clearInterval(myInterval);
    };
  });

  return (
    <>
      {minutes === 0 && seconds === 0 ? (
        <span> 0:0 </span>
      ) : (
        <span>
          {' '}
          {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
        </span>
      )}
    </>
  );
};

export default Timer;

