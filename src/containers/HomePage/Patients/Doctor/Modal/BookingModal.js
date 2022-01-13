import _, { add } from "lodash";
import React, { Component } from "react";
import DatePicker from "../../../../../components/Input/DatePicker";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { Modal } from "reactstrap";
import ProfileDoctor from "../ProfileDoctor";

import "./BookingModal.scss";
import { LANGUAGES } from "../../../../../utils";
import * as actions from "../../../../../store/actions";
import { postPatientBookAppointment } from "../../../../../services/userService";
import { toast } from "react-toastify";
import moment from "moment";

class BookingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      reason: "",
      gender: "",
      doctorId: "",
      date: "",
      timeType: "",

      genderOptions: [],
    };
  }

  handleOnChangeValue = (e, key) => {
    this.setState({
      [key]: e.target.value,
    });
  };

  async componentDidMount() {
    this.props.getGenderStart();
    if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
      console.log("PROPS:", this.props.dataTime);
      let dateTime = this.props.dataTime;
      this.setState({
        date: dateTime.date,
        timeType: dateTime.timeType,
        doctorId: dateTime.doctorId,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.language !== this.props.language) {
    }
    if (prevProps.genders !== this.props.genders) {
      let arrGender = this.props.genders;
      this.setState({
        genderOptions: arrGender,
        gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : "",
      });
    }
    if (prevProps.dataTime !== this.props.dataTime) {
      if (this.props.dataTime && !_.isEmpty(this.props.dataTime)) {
        console.log("PROPS:", this.props.dataTime);
        let dateTime = this.props.dataTime;
        this.setState({
          date: dateTime.date,
          timeType: dateTime.timeType,
          doctorId: dateTime.doctorId,
        });
      }
    }
  }

  handleOnChangeDatePicker = async (date) => {
    this.setState({
      birthDay: date[0],
    });
  };

  buildDoctorName = (dataTime) => {
    let { language } = this.props;
    let doctorName = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      doctorName = dataTime.doctorScheduleData
        ? language === LANGUAGES.VI
          ? `${dataTime.doctorScheduleData.lastName} ${dataTime.doctorScheduleData.firstName}`
          : `${dataTime.doctorScheduleData.firstName} ${dataTime.doctorScheduleData.lastName}`
        : "";
    }
    return doctorName;
  };

  handleConfirmBooking = async () => {
    try {
      let {
        firstName,
        lastName,
        phoneNumber,
        email,
        address,
        reason,
        gender,
        doctorId,
        date,
        timeType,
      } = this.state;
      if (
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !email ||
        !address ||
        !reason ||
        !gender ||
        !doctorId ||
        !date ||
        !timeType
      ) {
        toast.warn("Missing required parameter");
        return;
      }
      let timeString = this.buildTimeBooking(this.props.dataTime);
      let doctorName = this.buildDoctorName(this.props.dataTime);
      let res = await postPatientBookAppointment({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber,
        email: email,
        address: address,
        reason: reason,
        gender: gender,
        doctorId: doctorId,
        date: date,
        timeType: timeType,
        language: this.props.language,
        timeString: timeString,
        doctorName: doctorName || "",
      });
      if (res.errCode === 0) {
        toast.success("Booking a new appointment successed.");
        this.props.handleBookingModal(false);
      } else {
        toast.error(res.errMessage || "Booking a new appointment error!");
      }
    } catch (e) {
      console.log(e);
      toast.error("Booking a new appointment error!");
    }
  };

  buildTimeBooking = (dataTime) => {
    let result = "";
    if (dataTime && !_.isEmpty(dataTime)) {
      let { language } = this.props;
      let rangeTime =
        dataTime.timeTypeData && dataTime.timeTypeData
          ? language === LANGUAGES.VI
            ? dataTime.timeTypeData.valueVi
            : dataTime.timeTypeData.valueEn
          : "";
      let choosenDate = dataTime.date
        ? language === LANGUAGES.VI
          ? moment(new Date(+dataTime.date)).format("dddd - DD/MM/YYYY")
          : moment(new Date(+dataTime.date))
              .locale("en")
              .format("dddd - DD/MM/YYYY")
        : "";
      if (rangeTime && choosenDate) {
        result = `${rangeTime} - ${
          choosenDate.charAt(0).toUpperCase() + choosenDate.slice(1)
        }`;
      }
    }
    return result;
  };

  render() {
    let {
      firstName,
      lastName,
      email,
      phoneNumber,
      address,
      reason,
      gender,
      genderOptions,
    } = this.state;
    let { isShowModal, handleBookingModal, dataTime, language } = this.props;
    let doctorId = dataTime && !_.isEmpty(dataTime) ? dataTime.doctorId : "";
    console.log("STATE:", this.state);
    console.log("PROPS:", this.props.dataTime);

    return (
      <Modal
        isOpen={isShowModal}
        // toggle={() => this.props.handleClickEvent(false)}
        size="lg"
        centered
        backdrop={true}
        className="booking-modal-container"
      >
        <div className="booking-modal-content">
          <div className="booking-modal-header">
            <span className="left">
              <FormattedMessage id="booking-customer.medical-appointment-title" />
            </span>
            <span className="right">
              <i
                className="fas fa-times"
                onClick={() => handleBookingModal(false)}
              ></i>
            </span>
          </div>
          <div className="booking-modal-body container">
            <div className="doctor-infor">
              <ProfileDoctor
                doctorId={doctorId}
                isShowPrice={true}
                dataTime={dataTime}
              />
            </div>
            <div className="row ">
              <div className="col-6 form-group">
                <label htmlFor="firstNamePatient">
                  <FormattedMessage id="booking-customer.firstName-customer" />
                </label>
                <input
                  type="text"
                  id="firstNamePatient"
                  value={firstName}
                  onChange={(e) => this.handleOnChangeValue(e, "firstName")}
                  className="form-control"
                />
              </div>
              <div className="col-6 form-group">
                <label htmlFor="lastNamePatient">
                  <FormattedMessage id="booking-customer.lastName-customer" />
                </label>
                <input
                  type="text"
                  id="lastNamePatient"
                  value={lastName}
                  onChange={(e) => this.handleOnChangeValue(e, "lastName")}
                  className="form-control"
                />
              </div>
              <div className="col-6 form-group">
                <label htmlFor="phoneNumber">
                  <FormattedMessage id="booking-customer.phone-number" />
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  onChange={(e) => this.handleOnChangeValue(e, "phoneNumber")}
                  value={phoneNumber}
                  className="form-control"
                />
              </div>
              <div className="col-6 form-group">
                <label htmlFor="email">
                  <FormattedMessage id="booking-customer.email" />
                </label>
                <input
                  type="email"
                  id="email"
                  onChange={(e) => this.handleOnChangeValue(e, "email")}
                  value={email}
                  className="form-control"
                />
              </div>
              <div className="col-12 form-group">
                <label htmlFor="reason">
                  <FormattedMessage id="booking-customer.reason-examination-customer" />
                </label>
                <input
                  type="text"
                  id="reason"
                  onChange={(e) => this.handleOnChangeValue(e, "reason")}
                  value={reason}
                  className="form-control"
                />
              </div>
              <div className="col-6 form-group">
                <label htmlFor="address">
                  <FormattedMessage id="booking-customer.address" />
                </label>
                <input
                  type="text"
                  id="address"
                  onChange={(e) => this.handleOnChangeValue(e, "address")}
                  value={address}
                  className="form-control"
                />
              </div>
              <div className="col-6 form-group">
                <label htmlFor="gender">
                  <FormattedMessage id="booking-customer.gender" />
                </label>
                <select
                  className="form-control"
                  value={gender}
                  onChange={(e) => this.handleOnChangeValue(e, "gender")}
                >
                  {genderOptions &&
                    genderOptions.map((item, index) => {
                      return (
                        <option key={item.id} value={item.keyMap}>
                          {language === LANGUAGES.EN
                            ? item.valueEn
                            : item.valueVi}
                        </option>
                      );
                    })}
                </select>
              </div>
            </div>
          </div>
          <div className="booking-modal-footer">
            <button
              className="btn btn-secondary btn-booking-cancel"
              onClick={() => handleBookingModal(false)}
            >
              <FormattedMessage id="booking-customer.canceled" />
            </button>
            <button
              className="btn btn-primary btn-bookking-confirm"
              onClick={() => this.handleConfirmBooking()}
            >
              <FormattedMessage id="booking-customer.confirm" />
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(BookingModal)
);
