import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import { LANGUAGES } from "../../../../utils/constant";
import HomeHeader from "../../../../containers/HomePage/HomeHeader";
import { getDoctorDetailByIdService } from "../../../../services/userService";
import "./DetailDoctor.scss";
import LikeAndShare from "../../../HomePage/Patients/SocialPlugin/LikeAndShare";
import Comment from "../../../HomePage/Patients/SocialPlugin/Comment";

import DoctorSchedule from "./DoctorSchedule";
import DoctorExtraInfor from "./DoctorExtraInfor";
import ProfileDoctor from "./ProfileDoctor";
class DetailDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userDetail: {},
      previewImg: "",
      currentDoctorId: -1,
    };
  }

  async componentDidMount() {
    if (
      this.props.match &&
      this.props.match.params &&
      this.props.match.params.id
    ) {
      try {
        this.setState({
          currentDoctorId: this.props.match.params.id,
        });
        let response = await getDoctorDetailByIdService(
          this.props.match.params.id
        );
        console.log(response);
        if (response.errCode === 0 && response.data) {
          let userSelected = response.data;
          let imageBase64 = "";
          if (userSelected.image) {
            imageBase64 = new Buffer(userSelected.image, "base64").toString(
              "binary"
            );
          }
          this.setState({
            userDetail: userSelected,
            previewImg: imageBase64,
          });
        }
      } catch (e) {
        console.log(e);
      }
    }
  }

  componentDidUpdate(prevProps, prevState, snapShot) {}

  render() {
    let language = this.props.language;
    let { currentDoctorId } = this.state;
    let { firstName, lastName, positionData, markDownData } =
      this.state.userDetail;
    let currentUrl =
      process.env.REACT_APP_IS_LOCALHOST === 1 ? "" : window.location.href;
    console.log("POSL: ", positionData);
    console.log(this.props.match.params.id);
    return (
      <>
        <HomeHeader isShowBanner={false} />
        <div className="doctor-detail-container">
          <ProfileDoctor
            doctorId={currentDoctorId}
            isShowDescriptionDoctor={true}
          />
          <div className="schedule-doctor">
            <div className="content-left">
              <DoctorSchedule doctorId={currentDoctorId} />
            </div>
            <div className="content-right">
              <DoctorExtraInfor doctorId={currentDoctorId} />
              <LikeAndShare dataHref={currentUrl} />
            </div>
          </div>
          <div className="detail-infor-doctor">
            {markDownData && markDownData.contentHTML && (
              <span
                dangerouslySetInnerHTML={{ __html: markDownData.contentHTML }}
              ></span>
            )}
          </div>
          <div className="comment-doctor">
            <Comment dataHref={currentUrl} width={"100%"} />
          </div>
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
  connect(mapStateToProps, mapDispatchToProps)(DetailDoctor)
);
