import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import HomeHeader from "../../../../containers/HomePage/HomeHeader";
import DoctorSchedule from "../Doctor/DoctorSchedule";
import DoctorExtraInfor from "../Doctor/DoctorExtraInfor";
import "./DetailSpecialty.scss";
import ProfileDoctor from "../Doctor/ProfileDoctor";
import {
  getSpecialtyByIdService,
  getAllDoctorBySpecialtyIdService,
  getAllDoctorBySpecialtyAndLocationService,
} from "../../../../services/userService";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { FormattedMessage } from "react-intl";

class DetailSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrDoctorId: [],
      detailSpecialty: {},
      isShowFullDescriptionSpecialty: false,
      specialtyId: "",

      optionsProvince: [],
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      let specialtyId = this.props.match.params.id;
      await this.fetchSpecialtyDetailById(specialtyId);
      await this.fetchAllDoctorBySpecialtyId(specialtyId);
      this.setState({
        specialtyId: specialtyId,
      });
    }
    await this.props.fetchProvinceStart();
  }

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.listProvince !== this.props.listProvince) {
      let result = this.props.listProvince;
      result.unshift({
        id: new Date().getTime(),
        keyMap: "National",
        valueVi: "Toàn quốc",
        valueEn: "Nation Wide",
      });
      this.setState({
        optionsProvince: result,
      });
    }
  }

  fetchSpecialtyDetailById = async (specialtyId) => {
    try {
      let response = await getSpecialtyByIdService(specialtyId);
      if (response && response.errCode === 0) {
        this.setState({
          detailSpecialty: response.data || {},
        });
      } else {
        this.setState({
          detailSpecialty: {},
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  fetchAllDoctorBySpecialtyId = async (specialtyId) => {
    try {
      let response = await getAllDoctorBySpecialtyIdService(specialtyId);
      if (response && response.errCode === 0) {
        let result = [];
        response.data &&
          response.data.length > 0 &&
          response.data.forEach((item) => {
            result.push(item.doctorId);
          });
        this.setState(
          {
            arrDoctorId: result,
          },
          () => {
            console.log(result);
          }
        );
      } else {
        this.setState({
          arrDoctorId: [],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  fetchAllDoctorByProvinceAndSpecialty = async (specialtyId, provinceId) => {
    try {
      let response = await getAllDoctorBySpecialtyAndLocationService(
        specialtyId,
        provinceId
      );
      if (response && response.errCode === 0) {
        let result = [];
        response.data &&
          response.data.length > 0 &&
          response.data.forEach((item) => {
            result.push(item.doctorId);
          });
        this.setState(
          {
            arrDoctorId: result,
          },
          () => {
            console.log(result);
          }
        );
      } else {
        this.setState({
          arrDoctorId: [],
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

  handleOnChangeSelectLocation = async (event) => {
    let key = event.target.value;
    let specialtyId = this.state.specialtyId;
    if (!key || !specialtyId) {
      return;
    }
    key !== "National"
      ? await this.fetchAllDoctorByProvinceAndSpecialty(specialtyId, key)
      : await this.fetchAllDoctorBySpecialtyId(specialtyId);
  };

  render() {
    let { language } = this.props;
    let {
      arrDoctorId,
      detailSpecialty,
      isShowFullDescriptionSpecialty,
      optionsProvince,
    } = this.state;
    console.log("STATE:", arrDoctorId);
    return (
      <div className="detail-specialty-container">
        <HomeHeader isShowBanner={false} />
        <div
          className="detail-specialty-description"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 1)), url(${detailSpecialty.image})`,
          }}
        >
          <div className="container">
            <h1 className="detail-specialty-title">
              {detailSpecialty && detailSpecialty.name}
            </h1>
            <div className="detail-specialty-infor">
              {detailSpecialty && detailSpecialty.descriptionHTML && (
                <span
                  dangerouslySetInnerHTML={{
                    __html: `${
                      !isShowFullDescriptionSpecialty
                        ? detailSpecialty.descriptionHTML.slice(0, 300) + "..."
                        : detailSpecialty.descriptionHTML
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
          <div className="all-province-wrapper">
            <select
              className="all-province-select"
              onChange={this.handleOnChangeSelectLocation}
            >
              {optionsProvince &&
                optionsProvince.length > 0 &&
                optionsProvince.map((item) => {
                  return (
                    <option key={item.id} value={item.keyMap}>
                      {language === LANGUAGES.EN ? item.valueEn : item.valueVi}
                    </option>
                  );
                })}
            </select>
          </div>
          <div className="detail-specialty-doctor-list ">
            {arrDoctorId &&
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
    listProvince: state.admin.listProvince,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchProvinceStart: () => dispatch(actions.fetchProvinceStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(DetailSpecialty)
);
