import actionTypes from "./actionTypes";
import {
  getAllCodeService,
  createNewUserReduxService,
  getAllUsers,
  deleteUserService,
  editUserService,
  getTopDoctorHomeService,
  getAllDoctorService,
  saveDetailDoctorService,
  getAllSpecialty,
  getAllClinicsService,
} from "../../services/userService";

import { toast } from "react-toastify";

// export const fetchGenderStart = () => ({
//   type: actionTypes.FETCH_GENDER_START,
// });

export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_GENDER_START,
      });
      let res = await getAllCodeService("GENDER");
      if (res && res.errCode === 0) {
        dispatch(fetchGenderSuccess(res.data));
      } else {
        dispatch(fetchGenderFailed());
      }
    } catch (e) {
      dispatch(fetchGenderFailed());
      console.log("Fetch Gender start Error", e);
    }
  };
};

export const fetchGenderSuccess = (genderData) => ({
  type: actionTypes.FETCH_GENDER_SUCCESS,
  data: genderData,
});

export const fetchGenderFailed = () => ({
  type: actionTypes.FETCH_GENDER_FAILED,
});

export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_POSITION_START,
      });
      let res = await getAllCodeService("POSITION");

      if (res && res.errCode === 0) {
        dispatch(fetchPositionSuccess(res.data));
      } else {
        dispatch(fetchPositionFailed());
      }
    } catch (e) {
      dispatch(fetchPositionFailed());
      console.log("Fetch Position start Error", e);
    }
  };
};

export const fetchPositionSuccess = (positionData) => ({
  type: actionTypes.FETCH_POSITION_SUCCESS,
  data: positionData,
});

export const fetchPositionFailed = () => ({
  type: actionTypes.FETCH_POSITION_FAILED,
});

export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    try {
      dispatch({
        type: actionTypes.FETCH_ROLE_START,
      });
      let res = await getAllCodeService("ROLE");
      if (res && res.errCode === 0) {
        dispatch(fetchRoleSuccess(res.data));
      } else {
        dispatch(fetchRoleFailed());
      }
    } catch (e) {
      dispatch(fetchRoleFailed());
      console.log("Fetch Role start Error", e);
    }
  };
};

export const fetchRoleSuccess = (roleData) => ({
  type: actionTypes.FETCH_ROLE_SUCCESS,
  data: roleData,
});

export const fetchRoleFailed = () => ({
  type: actionTypes.FETCH_ROLE_FAILED,
});

export const createNewUser = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await createNewUserReduxService(data);
      if (res && res.errCode === 0) {
        toast.success("Create new user success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(getAllUserService());
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(saveUserFailed());
      }
    } catch (e) {
      toast.error("Create new user failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(saveUserFailed());
      console.log("Fetch Create User start Error", e);
    }
  };
};

export const saveUserSuccess = () => ({
  type: actionTypes.CREATE_USER_SUCCESS,
});

export const saveUserFailed = () => ({
  type: actionTypes.CREATE_USER_FAILED,
});

export const getAllUserService = (inputId = "ALL") => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllUsers(inputId);
      if (res && res.errCode === 0) {
        dispatch(getAllUserSuccess(res.users.reverse()));
      } else {
        dispatch(getAllUserFailed());
      }
    } catch (e) {
      dispatch(getAllUserFailed());
      console.log("Fetch Get All User Error", e);
    }
  };
};

export const getAllUserSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_USER_SUCCESS,
  data,
});

export const getAllUserFailed = () => ({
  type: actionTypes.FETCH_ALL_USER_FAILED,
});

export const deleteAUserService = (userId) => {
  return async (dispatch, getState) => {
    try {
      let res = await deleteUserService(userId);
      if (res && res.errCode === 0) {
        toast.success("Delete user success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(getAllUserService());
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(deleteUserFailed());
      }
    } catch (e) {
      toast.error("Delete user failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(deleteUserFailed());
      console.log("Fetch Create User start Error", e);
    }
  };
};

export const deleteUserSuccess = (data) => ({
  type: actionTypes.DELETE_USER_SUCCESS,
  data,
});

export const deleteUserFailed = () => ({
  type: actionTypes.DELETE_USER_FAILED,
});

export const selectedUser = (data) => ({
  type: actionTypes.SELECTED_USER,
  data,
});

export const editAUserService = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await editUserService(data);
      if (res && res.errCode === 0) {
        toast.success("Edit user success", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(editUserSuccess());
        dispatch(getAllUserService());
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(editUserFailed());
      }
    } catch (e) {
      toast.error("Edit user failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(editUserFailed());
      console.log("Fetch Edit User start Error", e);
    }
  };
};

export const editUserSuccess = () => ({
  type: actionTypes.EDIT_USER_EXISTED_SUCCESS,
});

export const editUserFailed = () => ({
  type: actionTypes.EDIT_USER_EXISTED_FAILED,
});

export const canceledUserSelected = () => ({
  type: actionTypes.CANCELED_USER_SELECTED,
});

export const fetchTopDoctor = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getTopDoctorHomeService();
      if (res && res.errCode === 0) {
        dispatch(fetchTopDoctorSuccess(res.data));
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(fetchTopDoctorFailed());
      }
    } catch (e) {
      toast.error("Get top doctor failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(fetchTopDoctorFailed());
      console.log("Fetch Top Doctor start Error", e);
    }
  };
};

export const fetchTopDoctorSuccess = (data) => ({
  type: actionTypes.FETCH_TOP_DOCTOR_SUCCESS,
  data,
});

export const fetchTopDoctorFailed = () => ({
  type: actionTypes.FETCH_TOP_DOCTOR_FAILED,
});

export const fetchAllDoctorService = (nameSearch = "") => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllDoctorService(nameSearch);
      if (res && res.errCode === 0) {
        dispatch(fetchAllDoctorSuccess(res.data));
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(fetchAllDoctorFailed());
      }
    } catch (e) {
      toast.error("Get all doctor failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(fetchAllDoctorFailed());
      console.log("Fetch all Doctor start Error", e);
    }
  };
};

export const fetchAllDoctorSuccess = (data) => ({
  type: actionTypes.FETCH_ALL_DOCTOR_SUCCESS,
  data,
});

export const fetchAllDoctorFailed = () => ({
  type: actionTypes.FETCH_ALL_DOCTOR_FAILED,
});

export const saveDetailDoctor = (data) => {
  return async (dispatch, getState) => {
    try {
      let res = await saveDetailDoctorService(data);
      if (res && res.errCode === 0) {
        dispatch(saveDetailDoctorSuccess());
        toast.success(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch(saveDetailDoctorFailed());
      }
    } catch (e) {
      toast.error("Save detail doctor failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch(saveDetailDoctorFailed());
      console.log("Save detail Doctor start Error", e);
    }
  };
};

export const saveDetailDoctorSuccess = () => ({
  type: actionTypes.SAVE_DETAIL_DOCTOR_SUCCESS,
});

export const saveDetailDoctorFailed = () => ({
  type: actionTypes.SAVE_DETAIL_DOCTOR_FAILED,
});

export const fetchAllScheduleTime = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("TIME");
      if (res && res.errCode === 0) {
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS,
          data: res.data,
        });
      } else {
        toast.error(res.errMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        dispatch({
          type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
        });
      }
    } catch (e) {
      toast.error("Fetch all schedule time failed!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      dispatch({
        type: actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED,
      });
      console.log("Fetch all schedule time start Error", e);
    }
  };
};

export const fetchPriceStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("PRICE");
      if (res && res.errCode === 0) {
        dispatch(fetchPriceSuccess(res.data));
      } else {
        dispatch(fetchPriceFailed());
      }
    } catch (e) {
      dispatch(fetchPriceFailed());
      console.log("Fetch Price start Error", e);
    }
  };
};

export const fetchPriceSuccess = (priceData) => ({
  type: actionTypes.FETCH_PRICE_SUCCESS,
  data: priceData,
});

export const fetchPriceFailed = () => ({
  type: actionTypes.FETCH_PRICE_FAILED,
});

export const fetchPaymentStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("PAYMENT");
      if (res && res.errCode === 0) {
        dispatch(fetchPaymentSuccess(res.data));
      } else {
        dispatch(fetchPaymentFailed());
      }
    } catch (e) {
      dispatch(fetchPaymentFailed());
      console.log("Fetch Payment start Error", e);
    }
  };
};

export const fetchPaymentSuccess = (paymentData) => ({
  type: actionTypes.FETCH_PAYMENT_METHOD_SUCCESS,
  data: paymentData,
});

export const fetchPaymentFailed = () => ({
  type: actionTypes.FETCH_PAYMENT_METHOD_FAILED,
});

export const fetchProvinceStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllCodeService("PROVINCE");
      if (res && res.errCode === 0) {
        dispatch(fetchProvinceSuccess(res.data));
      } else {
        dispatch(fetchProvinceFailed());
      }
    } catch (e) {
      dispatch(fetchProvinceFailed());
      console.log("Fetch Province start Error", e);
    }
  };
};

export const fetchProvinceSuccess = (provinceData) => ({
  type: actionTypes.FETCH_PROVINCE_SUCCESS,
  data: provinceData,
});

export const fetchProvinceFailed = () => ({
  type: actionTypes.FETCH_PROVINCE_FAILED,
});

export const fetchSpecialtyStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllSpecialty();
      if (res && res.errCode === 0) {
        dispatch(fetchSpecialtySuccess(res.data));
      } else {
        dispatch(fetchSpecialtyFailed());
      }
    } catch (e) {
      dispatch(fetchSpecialtyFailed());
      console.log("Fetch Specialty start Error", e);
    }
  };
};

export const fetchSpecialtySuccess = (specialtyData) => ({
  type: actionTypes.FETCH_SPECIALTY_SUCCESS,
  data: specialtyData,
});

export const fetchSpecialtyFailed = () => ({
  type: actionTypes.FETCH_SPECIALTY_FAILED,
});

export const fetchClinicStart = () => {
  return async (dispatch, getState) => {
    try {
      let res = await getAllClinicsService();
      if (res && res.errCode === 0) {
        dispatch(fetchClinicSuccess(res.data));
      } else {
        dispatch(fetchClinicFailed());
      }
    } catch (e) {
      dispatch(fetchClinicFailed());
      console.log("Fetch Clinic start Error", e);
    }
  };
};

export const fetchClinicSuccess = (clinicData) => ({
  type: actionTypes.FETCH_CLINIC_SUCCESS,
  data: clinicData,
});

export const fetchClinicFailed = () => ({
  type: actionTypes.FETCH_CLINIC_FAILED,
});
