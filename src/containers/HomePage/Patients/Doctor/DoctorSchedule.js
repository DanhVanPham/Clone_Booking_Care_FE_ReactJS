import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import moment from "moment";
import localization from "moment/locale/vi";

import { getScheduleDoctorByDate } from "../../../../services/userService";
import "./DoctorSchedule.scss";
import { LANGUAGES } from "../../../../utils/constant";
import { FormattedMessage } from "react-intl";
import BookingModal from "./Modal/BookingModal";
class DoctorSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allDays: [],
      doctorId: "",
      allAvailableTime: [],
      isShowModalBooking: false,
      dataScheduleTimeModal: {},
    };
  }

  async componentDidMount() {
    let allDays = this.buildTimeAvailable();
    this.setState({
      allDays: allDays,
    });

    if (this.props.doctorId) {
      await this.fetchScheduleDoctorByDate(
        this.props.doctorId,
        allDays[0].value
      );
      this.setState({
        doctorId: this.props.doctorId,
      });
    }
  }

  buildTimeAvailable = () => {
    let { language } = this.props;
    let allDays = [];
    for (let i = 0; i < 7; i++) {
      let object = {};
      console.log("LANGUAGE:", language);

      if (language === LANGUAGES.VI) {
        if (i === 0) {
          let labelVi2 = moment(new Date()).format("DD/MM");
          let today = `Hôm nay - ${labelVi2}`;
          object.label = today;
        } else {
          let time = moment(new Date()).add(i, "days").format("dddd - DD/MM");
          object.label =
            time &&
            time.length > 0 &&
            `${time.charAt(0).toUpperCase()}${time.slice(1)} `;
        }
      } else {
        if (i === 0) {
          let labelEn2 = moment(new Date()).format("DD/MM");
          let today = `Today - ${labelEn2}`;
          object.label = today;
        } else {
          object.label = moment(new Date())
            .add(i, "days")
            .locale("en")
            .format("dddd - DD/MM");
        }
      }
      object.value = moment(new Date()).add(i, "days").startOf("day").valueOf();
      allDays.push(object);
    }
    return allDays;
  };

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.language !== this.props.language) {
      let allDays = this.buildTimeAvailable();
      this.setState({
        allDays: allDays,
      });
    }
    if (prevProps.doctorId !== this.props.doctorId) {
      let allDays = this.buildTimeAvailable();
      await this.fetchScheduleDoctorByDate(
        this.props.doctorId,
        allDays[0].value
      );
      this.setState({
        doctorId: this.props.doctorId,
      });
    }
  }

  handleOnChangeDate = async (event) => {
    let date = event.target.value;
    let doctorId = this.state.doctorId;
    console.log("ITEM:", doctorId);

    if (!date || !doctorId) {
      return;
    }
    await this.fetchScheduleDoctorByDate(doctorId, date);
  };

  fetchScheduleDoctorByDate = async (doctorId, date) => {
    let response = await getScheduleDoctorByDate(doctorId, date);
    console.log(response.data);
    if (response.errCode === 0 && response.data) {
      this.setState({
        allAvailableTime: response.data,
      });
    } else {
      this.setState({
        allAvailableTime: [],
      });
    }
  };

  handleClickScheduleTime = (time) => {
    this.handleShowHideModalBooking(true);
    this.setState({
      dataScheduleTimeModal: time,
    });
  };

  handleShowHideModalBooking = (status) => {
    this.setState({
      isShowModalBooking: status,
    });
  };

  render() {
    let { allDays, allAvailableTime, dataScheduleTimeModal } = this.state;
    let { language } = this.props;
    return (
      <>
        <div className="doctor-schedule-container">
          <div className="all-schedule">
            <select
              className="doctor-schedule-select"
              onChange={this.handleOnChangeDate}
            >
              {allDays &&
                allDays.length > 0 &&
                allDays.map((item, index) => {
                  return (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="all-available-time">
            <div className="text-calendar">
              <i className="fas fa-calendar-alt"></i>
              <span>
                <FormattedMessage id="patient.detail-doctor.schedule" />
              </span>
            </div>
            <div className="time-content">
              {allAvailableTime && allAvailableTime.length > 0 ? (
                <>
                  {allAvailableTime.map((item) => {
                    let timeType =
                      item.timeTypeData && language === LANGUAGES.VI
                        ? item.timeTypeData.valueVi
                        : item.timeTypeData.valueEn;
                    return (
                      <button
                        key={item.id}
                        className="time-content-item"
                        onClick={() => this.handleClickScheduleTime(item)}
                      >
                        {timeType}
                      </button>
                    );
                  })}
                  <div className="book-free">
                    <span>
                      <FormattedMessage id="patient.detail-doctor.choose" />{" "}
                      <i className="far fa-hand-point-up"></i>{" "}
                      <FormattedMessage id="patient.detail-doctor.book-free" />
                    </span>
                  </div>
                </>
              ) : (
                <p className="not-found-schedule">
                  <FormattedMessage id="patient.detail-doctor.no-schedule" />
                </p>
              )}
            </div>
          </div>
        </div>
        <BookingModal
          isShowModal={this.state.isShowModalBooking}
          handleBookingModal={this.handleShowHideModalBooking}
          dataTime={dataScheduleTimeModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DoctorSchedule)
);
