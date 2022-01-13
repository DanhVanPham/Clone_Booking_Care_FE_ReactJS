import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { toast } from "react-toastify";
import { postVerifyPatientBookAppointment } from "../../../services/userService";
// import "./VerifyEmail.scss";
import HomeHeader from "../../../containers/HomePage/HomeHeader";
class VerifyEmail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errCode: 3,
      message: "",
    };
  }

  async componentDidMount() {
    if (this.props.location && this.props.location.search) {
      const urlParams = new URLSearchParams(this.props.location.search);
      let token = urlParams.get("token");
      let doctorId = urlParams.get("doctorId");
      if (token && doctorId) {
        await this.verifyBookAppointment(token, doctorId);
      }
    }
  }

  verifyBookAppointment = async (token, doctorId) => {
    try {
      let response = await postVerifyPatientBookAppointment({
        token,
        doctorId,
      });
      if (response && response.errCode === 0) {
        this.setState({
          errCode: response.errCode,
          message: response.errMessage,
        });
      } else {
        this.setState({
          errCode: response.errCode,
          message: response.errMessage,
        });
      }
    } catch (e) {
      console.log(e);
      this.setState({
        errCode: -1,
        message: "Error from server!",
      });
    }
  };

  async componentDidUpdate(prevProps, prevState, snapShot) {}

  render() {
    let { message, errCode } = this.state;
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="verify-booking-container">
          {errCode === 3 ? (
            <h2 className="text-center mt-5 d-block font-weight-bold">
              Loading data...
            </h2>
          ) : (
            <h2
              className={`text-center mt-5 d-block font-weight-bold ${
                errCode === 0 ? "text-success" : "text-danger"
              }`}
            >
              {message}
            </h2>
          )}
        </div>
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
  connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
);
