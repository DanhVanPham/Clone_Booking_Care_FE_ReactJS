import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { LANGUAGES } from "../../../../utils/constant";
import { getDoctorExtraInforById } from "../../../../services/userService";
import "./DoctorExtraInfor.scss";
import { FormattedMessage } from "react-intl";
import NumberFormat from "react-number-format";

class DoctorExtraInfor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowDetailInfo: false,
      currentDoctorId: "",
      doctorInfor: {},
    };
  }

  async componentDidMount() {
    if (this.props.doctorId) {
      this.setState({
        currentDoctorId: this.props.doctorId,
      });
      await this.fetchDoctorExtraInfor(this.props.doctorId);
    }
  }

  fetchDoctorExtraInfor = async (doctorId = -1) => {
    try {
      let response = await getDoctorExtraInforById(doctorId);
      if (response && response.errCode === 0 && response.data) {
        this.setState({
          doctorInfor: response.data,
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.doctorId !== this.props.doctorId) {
      this.setState({
        currentDoctorId: this.props.doctorId,
      });
      await this.fetchDoctorExtraInfor(this.props.doctorId);
    }
  }

  showHideDoctorInfoExtra = (status) => {
    this.setState({ isShowDetailInfo: status });
  };

  render() {
    let { language } = this.props;
    let { isShowDetailInfo, doctorInfor } = this.state;
    console.log("DOCTOR INFO:", doctorInfor);
    return (
      <div className="doctor-extra-infor-container">
        <div className="content-up">
          <div className="text-address">
            <FormattedMessage id="admin.doctor-infor.address-clinic" />
          </div>
          <div className="name-clinic">
            {doctorInfor && doctorInfor.nameClinic}
          </div>
          <div className="detail-address">
            {doctorInfor && doctorInfor.addressClinic}
          </div>
        </div>
        <div className="content-down">
          {!isShowDetailInfo ? (
            <div className="title-price">
              <span>
                <FormattedMessage id="admin.doctor-infor.examination-price" />:
              </span>
              <span className="price-number">
                {doctorInfor && doctorInfor.priceData ? (
                  language === LANGUAGES.VI ? (
                    <NumberFormat
                      value={doctorInfor.priceData.valueVi}
                      displayType={"text"}
                      thousandSeparator={true}
                      suffix={"VNĐ"}
                    />
                  ) : (
                    <NumberFormat
                      value={doctorInfor.priceData.valueEn}
                      displayType={"text"}
                      thousandSeparator={true}
                      prefix={"$"}
                    />
                  )
                ) : (
                  ""
                )}
                .
              </span>
              <span
                className="show-detail"
                onClick={() => this.showHideDoctorInfoExtra(true)}
              >
                <FormattedMessage id="admin.doctor-infor.more-detail" />
              </span>
            </div>
          ) : (
            <>
              <div className="title-price">
                <FormattedMessage id="admin.doctor-infor.examination-price" />:
                .
              </div>
              <div className="detail-infor">
                <div className="up">
                  <span className="left">
                    <FormattedMessage id="admin.doctor-infor.examination-price" />
                  </span>
                  <span className="right">
                    {doctorInfor && doctorInfor.priceData ? (
                      language === LANGUAGES.VI ? (
                        <NumberFormat
                          value={doctorInfor.priceData.valueVi}
                          displayType={"text"}
                          thousandSeparator={true}
                          suffix={"VNĐ"}
                        />
                      ) : (
                        <NumberFormat
                          value={doctorInfor.priceData.valueEn}
                          displayType={"text"}
                          thousandSeparator={true}
                          prefix={"$"}
                        />
                      )
                    ) : (
                      ""
                    )}
                  </span>
                  <div className="detail-infor-note">{doctorInfor.note}</div>
                </div>
                {doctorInfor && doctorInfor.note && (
                  <div className="down">
                    <FormattedMessage id="admin.doctor-infor.payment-note" />:
                    {"  "}
                    {`${
                      doctorInfor && doctorInfor.paymentData
                        ? language === LANGUAGES.VI
                          ? doctorInfor.paymentData.valueVi
                          : doctorInfor.paymentData.valueEn
                        : ""
                    }`}
                  </div>
                )}
              </div>
              <div>
                <span
                  className="hide-detail"
                  onClick={() => this.showHideDoctorInfoExtra(false)}
                >
                  <FormattedMessage id="admin.doctor-infor.hide-detail" />
                </span>
              </div>
            </>
          )}
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
  connect(mapStateToProps, mapDispatchToProps)(DoctorExtraInfor)
);
