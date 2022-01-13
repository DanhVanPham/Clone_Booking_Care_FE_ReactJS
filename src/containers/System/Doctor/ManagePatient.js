import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import DatePicker from "../../../components/Input/DatePicker";
import "./ManagePatient.scss";
import {
  getListPatientForDoctorService,
  sendRemedyService,
} from "../../../services/userService";
import { LANGUAGES } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";
import RemedyModal from "../Doctor/RemedyModal";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
class ManagePatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      time: new Date().setHours(0, 0, 0, 0),
      doctorId: "",
      listPatient: [],
      isOpenRemedyModal: false,
      dataModal: {},
      isShowLoading: false,
    };
  }

  async componentDidMount() {
    if (this.props.user) {
      let doctorId = this.props.user.id || -1;
      let time = new Date().setHours(0, 0, 0, 0);
      await this.fetchListPatientByDoctor(doctorId, time);
      this.setState({
        doctorId: doctorId,
        time: time,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.user !== this.props.user) {
      this.setState({
        doctorId: this.props.user.id || -1,
      });
    }
  }

  fetchListPatientByDoctor = async (doctorId, date) => {
    try {
      let response = await getListPatientForDoctorService(doctorId, date);
      if (response && response.errCode === 0) {
        let data = response.data;
        this.setState({
          listPatient: data || [],
        });
      } else {
        this.setState({
          listPatient: [],
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        listPatient: [],
      });
    }
  };

  handleOnChangeDatePicker = async (date) => {
    let time = date && date[0] && date[0].getTime();
    let { doctorId } = this.state;
    if (time && doctorId) {
      await this.fetchListPatientByDoctor(doctorId, time);
    }
    this.setState({
      currentDate: date[0],
      time: time,
    });
  };

  handleClickConfirm = (item) => {
    console.log("ITEM:", item);
    if (item) {
      let { language } = this.props;
      let fullName =
        language === LANGUAGES.VI
          ? `${item.patientData.lastName} ${item.patientData.firstName}`
          : `${item.patientData.firstName} ${item.patientData.lastName}`;
      let data = {
        doctorId: item.doctorId,
        patientId: item.patientId,
        email: item.patientData.email,
        patientName: fullName,
        timeType: item.timeType,
      };

      this.setState({
        isOpenRemedyModal: true,
        dataModal: data,
      });
    }
  };

  onCloseRemedyModal = () => {
    this.setState({
      isOpenRemedyModal: false,
      dataModal: {},
    });
  };

  sendRemedy = async (data) => {
    console.log(data);
    let { dataModal, time } = this.state;
    if (dataModal) {
      this.setState({
        isShowLoading: true,
      });
      try {
        let res = await sendRemedyService({
          ...data,
          doctorId: dataModal.doctorId,
          patientId: dataModal.patientId,
          timeType: dataModal.timeType,
          language: this.props.language,
          patientName: dataModal.patientName,
        });
        if (res && res.errCode === 0) {
          toast.success(res.errMessage || "Send Remedy successful");
          await this.fetchListPatientByDoctor(dataModal.doctorId, time);
          this.onCloseRemedyModal();
        } else {
          toast.error("Send remedy failed!");
        }
      } catch (e) {
        console.log(e);
        toast.error("Error from the server!");
      } finally {
        this.setState({
          isShowLoading: false,
        });
      }
    }
  };

  render() {
    let { language } = this.props;
    let { currentDate, listPatient, isOpenRemedyModal, dataModal } = this.state;
    return (
      <LoadingOverlay
        active={this.state.isShowLoading}
        spinner
        text="Loading..."
      >
        <div className="manage-patient-container">
          <div className="m-p-title title text-center">
            <FormattedMessage id="manage-patient.title" />
          </div>
          <div className="manage-patient-body row">
            <div className="col-4 form-group">
              <label>
                <FormattedMessage id="manage-patient.choose-date" />
              </label>
              <DatePicker
                className="form-control"
                onChange={this.handleOnChangeDatePicker}
                value={currentDate}
              />
            </div>
            <div className="table-manage-patient col-12">
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th>
                      <FormattedMessage id="manage-patient.order-row" />
                    </th>
                    <th className="text-center">
                      <FormattedMessage id="manage-patient.time-column" />
                    </th>
                    <th className="text-center">
                      <FormattedMessage id="manage-patient.full-name" />
                    </th>
                    <th className="text-center">
                      <FormattedMessage id="manage-patient.address" />
                    </th>
                    <th className="text-center">
                      <FormattedMessage id="manage-patient.gender" />
                    </th>
                    <th className="text-center">
                      <FormattedMessage id="manage-patient.actions" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listPatient && listPatient.length > 0 ? (
                    listPatient.map((item, index) => {
                      return (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item.timeTypeBookingData
                              ? language === LANGUAGES.VI
                                ? item.timeTypeBookingData.valueVi
                                : item.timeTypeBookingData.valueEn
                              : ""}
                          </td>
                          <td className="text-center">
                            {item.patientData
                              ? language === LANGUAGES.VI
                                ? `${item.patientData.lastName} ${item.patientData.firstName}`
                                : `${item.patientData.firstName} ${item.patientData.lastName}`
                              : ""}
                          </td>
                          <td className="text-center">
                            {item.patientData && item.patientData.address}
                          </td>
                          <td className="text-center">
                            {item.patientData && item.patientData.genderData
                              ? language === LANGUAGES.VI
                                ? item.patientData.genderData.valueVi
                                : item.patientData.genderData.valueEn
                              : ""}
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-success"
                              onClick={() => this.handleClickConfirm(item)}
                            >
                              <FormattedMessage id="manage-patient.confirm" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td>
                        <FormattedMessage id="manage-patient.no-data" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <RemedyModal
          isShowModal={isOpenRemedyModal}
          onCloseRemedyModal={this.onCloseRemedyModal}
          dataModal={dataModal}
          sendRemedy={this.sendRemedy}
        />
      </LoadingOverlay>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    user: state.user.userInfo,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ManagePatient)
);
