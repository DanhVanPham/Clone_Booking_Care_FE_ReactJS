import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import "./ProfileDoctor.scss";
import { getProfileDoctorById } from "../../../../services/userService";
import { LANGUAGES } from "../../../../utils/constant";
import NumberFormat from "react-number-format";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import moment from "moment";
class ProfileDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataProfile: [],
    };
  }

  async componentDidMount() {
    let data = await this.getInforDoctor(this.props.doctorId);
    this.setState({
      dataProfile: data,
    });
  }

  getInforDoctor = async (id) => {
    let result = {};
    if (id) {
      let res = await getProfileDoctorById(id);
      if (res && res.errCode === 0) {
        result = res.data;
      }
    }
    return result;
  };

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.doctorId !== this.props.doctorId) {
      let data = await this.getInforDoctor(this.props.doctorId);
      this.setState({
        dataProfile: data,
      });
    }
  }

  renderTimeBooking = (dataTime) => {
    console.log(dataTime);
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
        let result = `${rangeTime} - ${
          choosenDate.charAt(0).toUpperCase() + choosenDate.slice(1)
        }`;
        return (
          <>
            <div>{result}</div>
            <div>
              <FormattedMessage id="admin.doctor-infor.booking-free" />
            </div>
          </>
        );
      }
    }
    return <></>;
  };

  render() {
    let {
      language,
      isShowPrice,
      isShowDescriptionDoctor,
      dataTime,
      isShowSeeMore,
      isShowLocation,
    } = this.props;
    let { dataProfile } = this.state;
    console.log(dataTime);
    return (
      <div className="profile-doctor-container">
        <div className="intro-doctor">
          <div className="content-left">
            <div
              className="doctor-avatar"
              style={{
                backgroundImage: `url(${dataProfile.image})`,
              }}
            ></div>
            {isShowSeeMore && (
              <div className="see-more-anchor">
                <Link to={`/detail-doctor/${dataProfile.id}`}>
                  <FormattedMessage id="admin.doctor-infor.see-more" />
                </Link>
              </div>
            )}
          </div>
          <div className="content-right">
            <div className="up">
              {language === LANGUAGES.VI
                ? `${
                    dataProfile.positionData && dataProfile.positionData.valueVi
                  } ${dataProfile.lastName} ${dataProfile.firstName}`
                : `${
                    dataProfile.positionData && dataProfile.positionData.valueEn
                  } ${dataProfile.firstName} ${dataProfile.lastName}`}
            </div>
            <div className="down">
              {isShowDescriptionDoctor ? (
                <>
                  {dataProfile.markDownData &&
                    dataProfile.markDownData.description && (
                      <span>
                        {dataProfile.markDownData.description.length > 2000
                          ? `${dataProfile.markDownData.description.slice(
                              0,
                              200
                            )}...`
                          : dataProfile.markDownData.description}
                      </span>
                    )}
                </>
              ) : (
                <>{this.renderTimeBooking(dataTime)}</>
              )}
            </div>
            {isShowLocation && (
              <div className="doctor-location-province">
                <i className="fas fa-map-marker-alt"></i>
                <span>
                  {dataProfile &&
                  dataProfile.doctorInfoData &&
                  dataProfile.doctorInfoData.provinceData
                    ? language === LANGUAGES.VI
                      ? dataProfile.doctorInfoData.provinceData.valueVi
                      : dataProfile.doctorInfoData.provinceData.valueEn
                    : ""}
                </span>
              </div>
            )}
          </div>
        </div>
        {isShowPrice && (
          <div className="content-price">
            <FormattedMessage id="admin.doctor-infor.examination-price" />:
            {"  "}
            {dataProfile &&
            dataProfile.doctorInfoData &&
            dataProfile.doctorInfoData.priceData ? (
              language === LANGUAGES.VI ? (
                <NumberFormat
                  value={dataProfile.doctorInfoData.priceData.valueVi}
                  displayType={"text"}
                  thousandSeparator={true}
                  suffix={"VNĐ"}
                />
              ) : (
                <NumberFormat
                  value={dataProfile.doctorInfoData.priceData.valueEn}
                  displayType={"text"}
                  thousandSeparator={true}
                  prefix={"$"}
                />
              )
            ) : (
              ""
            )}
          </div>
        )}
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
  connect(mapStateToProps, mapDispatchToProps)(ProfileDoctor)
);
