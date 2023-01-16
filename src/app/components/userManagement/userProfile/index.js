import React, { lazy } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import {
  BRAND_MANAGER,
  BUSINESS_ADMIN,
  FP_ADMIN,
  GENERAL_USER,
  GROUP_MANAGER,
} from "../../../utils/user-roles/UserRoles";
import { Button } from "@mui/material";
import UserService from "../../../data-access/services/userService/UserService";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useUpdateUserStatusMutation } from "app/store/api/apiSlice";

const ProfileForm = lazy(() => import("./profileForm"));
const UpdatePassword = lazy(() => import("./updatePassword"));

const index = () => {
  const { t } = useTranslation();
  const submitRef = React.useRef();

  const [role, setRole] = React.useState(0);
  const { userType } = useParams();
  const user = useSelector(selectUser);
  const Location = window.location.href;
  const { enqueueSnackbar } = useSnackbar();
  const userProfile = JSON.parse(localStorage.getItem("userProfile"));
  const [updateUserStatus] = useUpdateUserStatusMutation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (Location.includes("/my-profile")) {
      switch (user.role[0]) {
        case FP_ADMIN:
          return setRole(1);
        case BRAND_MANAGER:
          return setRole(2);
        case GROUP_MANAGER:
          return setRole(3);
        case BUSINESS_ADMIN:
          return setRole(4);
        case GENERAL_USER:
          return setRole(5);
      }
    } else setRole(0);
  }, [Location]);

  const changeUserStatus = () => {
    updateUserStatus(userProfile.uuid).then((response) => {
      if (response?.data?.status_code === 202) {
        enqueueSnackbar(response?.data?.message, { variant: "success" });
        navigate(-1);
      } else {
        enqueueSnackbar(response?.error?.data?.message, { variant: "error" });
      }
    });
    // UserService.changeStatusByUUID(userProfile.uuid)
    //   .then((response) => {
    //     if (response?.status_code === 202) {
    //       enqueueSnackbar(response?.message, { variant: "success" });
    //     }
    //   })
    //   .catch((error) => {
    //     enqueueSnackbar(error, { variant: "error" });
    //   });
  };

  return (
    <div className="flex flex-col flex-auto min-w-0 bg-MonochromeGray-25 ">
      <div className=" p-20 sm:p-28 w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 justify-between">
          <div className="col-span-1 md:col-span-3 border-1 border-MonochromeGray-50">
            <div className="rounded-sm bg-white p-20 ">
              <div className=" header-click-to-action">
                {role === 0 ? (
                  <div className="flex justify-center items-center gap-10">
                    <div className="header-text header6">
                      {userProfile.uuid}
                    </div>
                    {userProfile?.status === "Active" ? (
                      <div className="bg-confirmed rounded-4 px-16 py-4 body3">
                        {t("label:active")}
                      </div>
                    ) : (
                      <div className="bg-rejected rounded-4 px-16 py-4 body3">
                        {t("label:inactive")}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center gap-10">
                    <div className="header-text header6">
                      {t("label:myProfile")}
                    </div>
                  </div>
                )}
                <div className="flex gap-10 w-full justify-between sm:w-auto">
                  {role === 0 && (
                    <Button
                      color="secondary"
                      onClick={() => changeUserStatus()}
                      variant="outlined"
                      className="font-semibold rounded-4"
                    >
                      {userProfile?.status === "Inactive"
                        ? t("label:makeActive")
                        : t("label:makeInactive")}
                    </Button>
                  )}
                  <Button
                    color="secondary"
                    type="submit"
                    variant="contained"
                    className={`font-semibold rounded-4 px-40 ${
                      role === 0 ? "w-auto" : "w-full"
                    }`}
                    onClick={() => submitRef.current.click()}
                  >
                    {t("label:saveUpdate")}
                  </Button>
                </div>
              </div>
              <div className="p-0 sm:p-20">
                {role === 0 && (
                  <div className="create-user-form-header subtitle3 bg-m-grey-25">
                    {t("label:profileDetails")}
                  </div>
                )}
                {role === 0 && <ProfileForm submitRef={submitRef} role={0} />}
                {role === 1 && <ProfileForm submitRef={submitRef} role={1} />}
                {role === 2 && <ProfileForm submitRef={submitRef} role={2} />}
                {role === 3 && <ProfileForm submitRef={submitRef} role={3} />}
                {role === 4 && <ProfileForm submitRef={submitRef} role={4} />}
                {role === 5 && <ProfileForm submitRef={submitRef} role={5} />}
              </div>
            </div>
          </div>
          <div className="col-span-1 bg-white border-1 border-MonochromeGray-50">
            <UpdatePassword role={role} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default index;
