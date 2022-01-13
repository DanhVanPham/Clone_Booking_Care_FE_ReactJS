import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageSchedule.scss";
import { FormattedMessage } from "react-intl";
import AsyncSelect from "react-select/async";
import { getAllDoctorService } from "../../../services/userService";
import { LANGUAGES } from "../../../utils/constant";
import DatePicker from "../../../components/Input/DatePicker";
import * as actions from "../../../store/actions";
import _ from "lodash";
import { dateFormat } from "../../../utils/constant";
import { toast } from "react-toastify";
import moment from "moment";
import {
  saveBulkScheduleDoctor,
  getScheduleDoctor,
} from "../../../services/userService";

class ManageSchedule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedDoctor: "",
      optionDoctors: [],
      doctorArr: [],
      currentDate: "",
      rangeTime: [],
    };
  }

  //isSelected: -1 => Has been selected(In Db), 0 => Ready to select, 1 => choosen(not save in db)

  componentDidMount() {
    this.props.fetchAllDoctorService();
    this.props.fetchAllScheduleTime();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listDoctors !== this.props.listDoctors) {
      this.setState(
        {
          doctorArr: this.props.listDoctors,
        },
        () => {
          let listDoctor = this.state.doctorArr;
          if (listDoctor && listDoctor.length > 0) {
            let result = this.buildDataInputSelect(listDoctor);
            this.setState({
              optionDoctors: result,
            });
          }
        }
      );
    }

    if (prevProps.scheduleTime !== this.props.scheduleTime) {
      let data = this.props.scheduleTime;
      if (data && data.length > 0) {
        data = data.map((item) => {
          return { ...item, isSelected: 0 };
        });
      }
      this.setState({
        rangeTime: data,
      });
    }

    if (prevProps.language !== this.props.language) {
      this.props.fetchAllDoctorService();
    }
  }

  buildDataInputSelect = (data) => {
    let result = [];
    let { language } = this.props;
    if (data && data.length > 0) {
      data.forEach((item, index) => {
        let fullName = "";
        if (language === LANGUAGES.VI) {
          fullName = `${item.lastName} ${item.firstName}`;
        } else if (language === LANGUAGES.EN) {
          fullName = `${item.firstName} ${item.lastName}`;
        }
        result.push({
          value: item.id,
          label: fullName,
        });
      });
    }
    return result;
  };

  handleChangeOptions = async (selectedOption) => {
    console.log("SELECT: ", selectedOption);
    let result = await this.fetchScheduleByDoctor(selectedOption.value);
    this.setState({
      selectedDoctor: selectedOption,
      rangeTime: result,
    });
  };

  fetchScheduleByDoctor = async (selectedValue) => {
    let doctorId = selectedValue || 0;
    let time = new Date(this.state.currentDate).getTime() || 1641834000000;
    let result = [...this.state.rangeTime];
    let res = await getScheduleDoctor({
      id: doctorId,
      time: time,
    });

    if (res && res.errCode === 0 && res.data && res.data.length > 0) {
      let data = res.data;
      console.log(result);
      result.map((item) => {
        if (_.find(data, { timeType: item.keyMap })) {
          item.isSelected = -1;
        }
        return item;
      });
    } else {
      result.map((item) => {
        item.isSelected = 0;
        return item;
      });
    }
    console.log("DATA:", result);
    return result;
  };

  loadOptionsByFilter = async (inputValue) => {
    const response = await getAllDoctorService(inputValue);
    this.props.fetchAllDoctorSuccess(response.data);
    const result = this.buildDataInputSelect(response.data);
    return result;
  };

  handleOnChangeDatePicker = async (date) => {
    if (this.state.selectedDoctor && !_.isEmpty(this.state.selectedDoctor)) {
      let result = await this.fetchScheduleByDoctor(
        this.state.selectedDoctor.value || 0
      );
      this.setState({
        rangeTime: result,
      });
    }
    this.setState({
      currentDate: date[0],
    });
  };

  handleOnClickSchedule = (data) => {
    console.log(data);
    let scheduleTime = [...this.state.rangeTime];
    scheduleTime &&
      scheduleTime.length > 0 &&
      scheduleTime.map((item) => {
        if (item.id === data.id) {
          item.isSelected = item.isSelected === 0 ? 1 : 0;
        }
        return item;
      });
    this.setState(
      {
        rangeTime: scheduleTime,
      },
      () => {
        console.log("STATE:", this.state.rangeTime);
      }
    );
  };

  handleSaveSchedule = async () => {
    let { rangeTime, selectedDoctor, currentDate } = this.state;
    let options = {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    };
    if (!selectedDoctor || _.isEmpty(selectedDoctor)) {
      toast.warn("Invalid selected doctor", options);
      return;
    }
    if (!currentDate) {
      toast.warn("Invalid selected date", options);
      return;
    }

    let selectedDate = new Date(currentDate).getTime();

    let selectedScheduleTime =
      rangeTime &&
      rangeTime.length > 0 &&
      rangeTime.filter((item) => item.isSelected === 1);
    if (!selectedScheduleTime || _.isEmpty(selectedScheduleTime)) {
      toast.warn("Invalid selected schedule time", options);
      return;
    }
    let result = [];
    selectedScheduleTime.forEach((time) => {
      let object = {
        doctorId: selectedDoctor.value,
        date: `${selectedDate}`,
        timeType: time.keyMap,
      };
      result.push(object);
    });

    let res = await saveBulkScheduleDoctor({
      arrSchedule: result,
    });
    if (res && res.errCode === 0) {
      toast.success("Save schedule successful.", options);
      let result = await this.fetchScheduleByDoctor(
        this.state.selectedDoctor.value || 0
      );
      this.setState({
        rangeTime: result,
      });
    } else {
      toast.error("Save schedule failed!", options);
    }

    console.log("CHECK:", result);
  };

  render() {
    let { rangeTime } = this.state;
    let { language } = this.props;
    let yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
    return (
      <div className="manage-schedule-container">
        <div className="m-s-title">
          <FormattedMessage id="manage-schedule.title" />
        </div>
        <div className="container">
          <div className="row">
            <div className="col-6 form-group">
              <label htmlFor="">
                <FormattedMessage id="manage-schedule.choose-doctor" />
              </label>
              <AsyncSelect
                cacheOptions
                value={this.state.selectedDoctor}
                onChange={this.handleChangeOptions}
                loadOptions={this.loadOptionsByFilter}
                defaultOptions={this.state.optionDoctors}
                id="select-doctor"
              />
            </div>
            <div className="col-6 form-group">
              <label htmlFor="">
                <FormattedMessage id="manage-schedule.choose-date" />
              </label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnChangeDatePicker}
                value={this.state.currentDate && this.state.currentDate[0]}
                minDate={yesterday}
              />
            </div>
            <div className="col-12 pick-hour-container">
              {rangeTime &&
                rangeTime.length > 0 &&
                rangeTime.map((item) => {
                  return (
                    <button
                      className={
                        item.isSelected === -1
                          ? "btn button-schedule"
                          : item.isSelected === 1
                          ? "btn button-schedule is-active"
                          : "btn button-schedule"
                      }
                      title={
                        item.isSelected === -1 &&
                        "Range time has been selected."
                      }
                      disabled={item.isSelected === -1}
                      key={item.id}
                      onClick={() => this.handleOnClickSchedule(item)}
                    >
                      {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                    </button>
                  );
                })}
            </div>
            <div className="col-12">
              <button
                className="btn btn-primary btn-save-schedule"
                onClick={() => this.handleSaveSchedule()}
              >
                <FormattedMessage id="manage-schedule.save" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    ManageScheduleMenuPath: state.app.ManageScheduleMenuPath,
    isLoggedIn: state.user.isLoggedIn,
    listDoctors: state.admin.listDoctors,
    scheduleTime: state.admin.scheduleTime,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctorService: (nameSearch) =>
      dispatch(actions.fetchAllDoctorService(nameSearch)),
    fetchAllDoctorSuccess: (data) =>
      dispatch(actions.fetchAllDoctorSuccess(data)),
    fetchAllScheduleTime: () => dispatch(actions.fetchAllScheduleTime()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageSchedule);
