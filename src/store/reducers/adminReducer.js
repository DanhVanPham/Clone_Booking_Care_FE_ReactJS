import actionTypes from "../actions/actionTypes";

const initialState = {
  isLoadingGender: false,
  genders: [],
  roles: [],
  positions: [],
  users: [],
  userSelected: {},
  topDoctors: [],
  listDoctors: [],
  scheduleTime: [],

  listPrice: [],
  listPayment: [],
  listProvince: [],
  listSpecialty: [],
  listClinic: [],
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      return {
        ...state,
        isLoadingGender: true,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      return {
        ...state,
        genders: action.data,
        isLoadingGender: false,
      };
    case actionTypes.FETCH_GENDER_FAILED:
      return {
        ...state,
        isLoadingGender: false,
      };
    case actionTypes.FETCH_POSITION_SUCCESS:
      console.log("CHECK POSITION", action.data);
      return {
        ...state,
        positions: action.data,
      };
    case actionTypes.FETCH_POSITION_FAILED:
      return {
        ...state,
        positions: [],
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      return {
        ...state,
        roles: action.data,
      };
    case actionTypes.FETCH_ROLE_FAILED:
      return {
        ...state,
        roles: [],
      };
    case actionTypes.FETCH_ALL_USER_SUCCESS:
      console.log("FETCH ALL USER", action.data);
      return {
        ...state,
        users: action.data,
      };
    case actionTypes.FETCH_ALL_USER_FAILED:
      return {
        ...state,
        users: [],
      };
    case actionTypes.SELECTED_USER:
      return {
        ...state,
        userSelected: action.data,
      };
    case actionTypes.EDIT_USER_EXISTED_SUCCESS:
      return {
        ...state,
        userSelected: {},
      };
    case actionTypes.EDIT_USER_EXISTED_FAILED:
      return {
        ...state,
        userSelected: {},
      };
    case actionTypes.CANCELED_USER_SELECTED:
      return {
        ...state,
        userSelected: {},
      };
    case actionTypes.FETCH_TOP_DOCTOR_SUCCESS:
      return {
        ...state,
        topDoctors: action.data,
      };
    case actionTypes.FETCH_TOP_DOCTOR_FAILED:
      return {
        ...state,
        topDoctors: [],
      };
    case actionTypes.FETCH_ALL_DOCTOR_SUCCESS:
      return {
        ...state,
        listDoctors: action.data,
      };
    case actionTypes.FETCH_ALL_DOCTOR_FAILED:
      return {
        ...state,
        listDoctors: [],
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_SUCCESS:
      return {
        ...state,
        scheduleTime: action.data,
      };
    case actionTypes.FETCH_ALLCODE_SCHEDULE_TIME_FAILED:
      return {
        ...state,
        scheduleTime: [],
      };
    case actionTypes.FETCH_PRICE_SUCCESS:
      return {
        ...state,
        listPrice: action.data,
      };
    case actionTypes.FETCH_PRICE_FAILED:
      return {
        ...state,
        listPrice: [],
      };
    case actionTypes.FETCH_PAYMENT_METHOD_SUCCESS:
      return {
        ...state,
        listPayment: action.data,
      };
    case actionTypes.FETCH_PAYMENT_METHOD_FAILED:
      return {
        ...state,
        listPayment: [],
      };
    case actionTypes.FETCH_PROVINCE_SUCCESS:
      return {
        ...state,
        listProvince: action.data,
      };
    case actionTypes.FETCH_PROVINCE_FAILED:
      return {
        ...state,
        listProvince: [],
      };
    case actionTypes.FETCH_SPECIALTY_SUCCESS:
      return {
        ...state,
        listSpecialty: action.data,
      };
    case actionTypes.FETCH_SPECIALTY_FAILED:
      return {
        ...state,
        listSpecialty: [],
      };
    case actionTypes.FETCH_CLINIC_SUCCESS:
      return {
        ...state,
        listClinic: action.data,
      };
    case actionTypes.FETCH_CLINIC_FAILED:
      return {
        ...state,
        listClinic: [],
      };
    default:
      return state;
  }
};

export default adminReducer;
