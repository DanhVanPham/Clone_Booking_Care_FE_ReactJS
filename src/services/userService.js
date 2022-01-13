import axios from "../axios";

const handleLogin = async (email, password) => {
  return await axios.post("/api/login", {
    email,
    password,
  });
};

const getAllUsers = async (inputId) => {
  console.log(inputId);
  return await axios.get(`/api/get-all-users?id=${inputId}`);
};

const createNewUserService = async (data) => {
  return await axios.post(`/api/create-new-user`, {
    email: data.email,
    password: data.password,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    gender: 1,
    roleId: 1,
    phoneNumber: "",
  });
};

const createNewUserReduxService = async (data) => {
  return await axios.post(`/api/create-new-user`, data);
};

const editUserService = async (data) => {
  return await axios.put(`/api/edit-user`, {
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender,
    roleId: data.roleId,
    positionId: data.positionId,
    avatar: data.avatar,
  });
};

const deleteUserService = async (userId) => {
  return await axios.delete(`/api/delete-user`, {
    data: {
      id: userId,
    },
  });
};

const getAllCodeService = async (inputType) => {
  return await axios.get(`/api/v1/allcode?type=${inputType}`);
};

const getTopDoctorHomeService = async (limit = 10) => {
  return await axios.get(`/api/v1/top-doctor-home?limit=${limit}`);
};

const getAllDoctorService = async (nameSearch) => {
  return await axios.get(`/api/v1/get-all-doctors?nameSearch=${nameSearch}`);
};

const saveDetailDoctorService = async (data) => {
  return await axios.post(`/api/v1/save-infor-doctor`, data);
};

const getDoctorDetailByIdService = async (id) => {
  return await axios.get(`/api/v1/get-detail-doctor?id=${id}`);
};

const saveBulkScheduleDoctor = async (data) => {
  return await axios.post("/api/v1/bulk-create-schedule", data);
};

const getScheduleDoctor = async (data) => {
  return await axios.get(
    `/api/v1/get-schedule-by-doctor?id=${data.id}&time=${data.time}`
  );
};

const getScheduleDoctorByDate = async (doctorId, date) => {
  return await axios.get(
    `/api/v1/get-schedule-doctor-by-date?doctorId=${doctorId}&date=${date}`
  );
};

const getDoctorExtraInforById = async (doctorId) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-extra-infor-doctor-by-id?doctorId=${doctorId}`
  );
};

const getProfileDoctorById = async (doctorId) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-profile-doctor-by-id?doctorId=${doctorId}`
  );
};

const postPatientBookAppointment = async (data) => {
  return await axios.post("/api/v1/patient-book-appointment", data);
};

const postVerifyPatientBookAppointment = async (data) => {
  return await axios.post("/api/v1/verify-book-appointment", data);
};

const createNewSpecialtyService = async (data) => {
  return await axios.post("/api/v1/create-new-specialties", data);
};

const getAllSpecialty = async () => {
  return await axios.get(`http://localhost:8081/api/v1/get-specialty`);
};

const getSpecialtyByIdService = async (specialtyId) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-specialty-by-id?specialtyId=${specialtyId}`
  );
};

const getAllDoctorBySpecialtyIdService = async (specialtyId) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-all-doctor-by-specialty?specialtyId=${specialtyId}`
  );
};

const getAllDoctorBySpecialtyAndLocationService = async (
  specialtyId,
  provinceId
) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-all-doctor-by-location-and-specialty?specialtyId=${specialtyId}&provinceId=${provinceId}`
  );
};

const createNewClinicService = async (data) => {
  return await axios.post("/api/v1/create-new-clinic", data);
};

const getAllClinicsService = async () => {
  return await axios.get(`http://localhost:8081/api/v1/get-clinics`);
};

const getClinicByIdService = async (clinicId) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-detail-clinic-by-id?clinicId=${clinicId}`
  );
};

const getListPatientForDoctorService = async (doctorId, date) => {
  return await axios.get(
    `http://localhost:8081/api/v1/get-list-patient-for-doctor?doctorId=${doctorId}&date=${date}`
  );
};

const sendRemedyService = async (data) => {
  return await axios.post(`http://localhost:8081/api/v1/send-remedy`, data);
};
export {
  handleLogin,
  getAllUsers,
  createNewUserService,
  createNewUserReduxService,
  deleteUserService,
  editUserService,
  getAllCodeService,
  getTopDoctorHomeService,
  getAllDoctorService,
  saveDetailDoctorService,
  getDoctorDetailByIdService,
  saveBulkScheduleDoctor,
  getScheduleDoctor,
  getScheduleDoctorByDate,
  getDoctorExtraInforById,
  getProfileDoctorById,
  postPatientBookAppointment,
  postVerifyPatientBookAppointment,
  createNewSpecialtyService,
  getAllSpecialty,
  getSpecialtyByIdService,
  getAllDoctorBySpecialtyIdService,
  getAllDoctorBySpecialtyAndLocationService,
  createNewClinicService,
  getAllClinicsService,
  getClinicByIdService,
  getListPatientForDoctorService,
  sendRemedyService,
};
