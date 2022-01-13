import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import HomeHeader from "../../HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import "./DetailClinic.scss";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import { getClinicByIdService } from "../../../../services/userService";
import { FormattedMessage } from "react-intl";

class DetailClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      dataClinic: {},
      isShowFullDescriptionSpecialty: false,
      clinicId: "",
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let clinicId = this.props.match.params.id;
      await this.fetchClinicDetailById(clinicId);
      this.setState({
        clinicId: clinicId,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapShot) {}

  fetchClinicDetailById = async (clinicId) => {
    try {
      let response = await getClinicByIdService(clinicId);
      if (response && response.errCode === 0) {
        let data = response.data;
        let resultDoctorId = [];
        if (data && data.length > 0) {
          data.forEach((item) => {
            item.clinicDoctorInfoData &&
              item.clinicDoctorInfoData.doctorId &&
              resultDoctorId.push(item.clinicDoctorInfoData.doctorId);
          });
          this.setState({
            arrDoctorId: resultDoctorId,
            dataClinic: data[0] || {},
          });
        }
      } else {
        this.setState({
          arrDoctorId: [],
          dataClinic: {},
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleChangeStatusShowMoreDescription = (status) => {
    this.setState({
      isShowFullDescriptionSpecialty: status,
    });
  };

  render() {
    let { arrDoctorId, dataClinic, isShowFullDescriptionSpecialty } =
      this.state;
    console.log("STATE Arr DoctorId:", arrDoctorId);
    return (
      <div className="detail-specialty-container">
        <HomeHeader isShowBanner={false} />
        <div
          className="detail-specialty-description"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1)), url(${
              dataClinic && dataClinic.image
            })`,
          }}
        >
          <div className="container">
            <h1 className="detail-specialty-title">
              {dataClinic && dataClinic.name}
            </h1>
            <div className="detail-specialty-infor">
              {dataClinic && dataClinic.descriptionHTML && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${
                      !isShowFullDescriptionSpecialty
                        ? dataClinic.descriptionHTML.slice(0, 300) + "..."
                        : dataClinic.descriptionHTML
                    }`,
                  }}
                ></span>
              )}
              {!isShowFullDescriptionSpecialty ? (
                <span
                  className="specialty-read-more"
                  onClick={() =>
                    this.handleChangeStatusShowMoreDescription(true)
                  }
                >
                  <FormattedMessage id="patient.detail-specialty.read-more" />
                </span>
              ) : (
                <span
                  className="specialty-read-more"
                  onClick={() =>
                    this.handleChangeStatusShowMoreDescription(false)
                  }
                >
                  <FormattedMessage id="patient.detail-specialty.hide-infor" />
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="detail-specialty-doctor-list ">
            {arrDoctorId &&
              arrDoctorId.length > 0 &&
              arrDoctorId.map((item, index) => {
                return (
                  <div className="detail-specialty-doctor-item " key={index}>
                    <div className="detail-specialty-content-left">
                      <div className="doctor-profile">
                        <ProfileDoctor
                          doctorId={item}
                          isShowDescriptionDoctor={true}
                          isShowSeeMore={true}
                          isShowLocation={true}
                        />
                      </div>
                    </div>
                    <div className="detail-specialty-content-right">
                      <div className="doctor-schedule">
                        <DoctorSchedule doctorId={item} />
                      </div>
                      <div className="doctor-extra-infor">
                        <DoctorExtraInfor doctorId={item} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
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
  connect(mapStateToProps, mapDispatchToProps)(DetailClinic)
);
