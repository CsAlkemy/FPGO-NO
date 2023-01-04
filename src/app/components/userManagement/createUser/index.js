import React, { lazy } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";
import CreateUsers from '../createUsers';
import { useTranslation } from 'react-i18next';

// const CreateFpAdmin = lazy(() => import("./FpAdmin/createFpAdmin"));
// const CreateClientAdmin = lazy(() => import("./ClientAdmin/createClientAdmin"));
// const CreateSubClientAdmin = lazy(() =>
//   import("./SubClientAdmin/createSubClientAdmin")
// );

const index = () => {
  const {t} = useTranslation()
  // const submitRef = React.useRef();
  // const discardRefFpAdmin = React.useRef();
  // const discardRefClientAdmin = React.useRef();
  // const discardRefSubClientAdmin = React.useRef();
  const [role, setRole] = React.useState(1);
  const { userType } = useParams();

  // React.useEffect(() => {
  //   switch (userType) {
  //     case "1":
  //       return setRole(1);
  //     case "2":
  //       return setRole(2);
  //     case "3":
  //       return setRole(3);
  //     default:
  //       return setRole(4);
  //   }
  // }, [userType]);

  return (
    <>
      <div className="flex flex-col flex-auto min-w-0 bg-MonochromeGray-25">
        <div className="flex-auto p-20 sm:p-0 w-full max-w-screen-md bg-white">
          <div className="rounded-sm bg-white p-20">
            <div className=" header-click-to-action">
              <div className="header-text header6">{t("label:createUser")}</div>
              <div className="flex gap-x-10 w-full sm:w-auto">
                <button
                  className="call-to-action-notactive body2"
                  type="button"
                  onClick={() => {
                    role === 1
                      ? discardRefFpAdmin.current.click()
                      : role === 2
                      ? discardRefClientAdmin.current.click()
                      : discardRefSubClientAdmin.current.click();
                  }}
                >
                  {t("label:discard")}
                </button>
                <Button
                  variant="contained"
                  color="secondary"
                  className=" w-full rounded-md font-semibold body2"
                  size="large"
                  onClick={() => submitRef.current.click()}
                >
                  {t("label:createAccount")}
                </Button>
              </div>
            </div>
            <div className="p-0 sm:p-20">
              <div className="create-user-form-header subtitle3 bg-m-grey-25">
                {t("label:userDetails")}
              </div>
              <div className="p-10">
                <div className="create-user-roles caption2">{t("label:userRole")}</div>
                <CreateUsers />
                {/*{role === 1 && (*/}
                {/*  <CreateFpAdmin*/}
                {/*    submitRef={submitRef}*/}
                {/*    discardRefFpAdmin={discardRefFpAdmin}*/}
                {/*  />*/}
                {/*)}*/}
                {/*{role === 2 && (*/}
                {/*  <CreateClientAdmin*/}
                {/*    submitRef={submitRef}*/}
                {/*    discardRefClientAdmin={discardRefClientAdmin}*/}
                {/*  />*/}
                {/*)}*/}
                {/*{role === 3 && (*/}
                {/*  <CreateSubClientAdmin*/}
                {/*    submitRef={submitRef}*/}
                {/*    discardRefSubClientAdmin={discardRefSubClientAdmin}*/}
                {/*  />*/}
                {/*)}*/}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default index;
