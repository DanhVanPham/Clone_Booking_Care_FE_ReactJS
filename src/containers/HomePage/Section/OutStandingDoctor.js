import React, { Component } from "react";
import { connect } from "react-redux";
import Slider from "react-slick";
import _ from "lodash";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils/constant";
import { FormattedMessage } from "react-intl";
import { Redirect, withRouter } from "react-router";
import { push } from "connected-react-router";
class OutStandingDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listTopDoctor: [],
    };
  }
  componentDidMount() {
    this.props.loadTopDoctors();
    this.setState({
      listTopDoctor: this.props.topDoctorList,
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (!_.isEqual(prevProps.topDoctorList, this.props.topDoctorList)) {
      this.setState({
        listTopDoctor: this.props.topDoctorList,
      });
    }
  }

  handleViewDetailDoctor = (item) => {
    console.log(item);
    if (this.props.history) {
      this.props.history.push(`/detail-doctor/${item.id}`);
    }
    // return <Redirect to={`/users/${item.id}`} push={true} />;
  };

  render() {
    let listDoctorTop = this.state.listTopDoctor;
    console.log("STATE:", this.state);
    let { language } = this.props;
    return (
      <div className="section-share section-outstanding-doctor">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.out-standing-doctor" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {listDoctorTop &&
                listDoctorTop.length > 0 &&
                listDoctorTop.map((item, index) => {
                  let nameVi = `${item.positionData.valueVi || "Undefined"}, ${
                    item.lastName
                  } ${item.firstName}`;
                  let nameEn = `${item.positionData.valueEn || "Undefined"}, ${
                    item.firstName
                  } ${item.lastName}`;
                  let imageBase64 = "";
                  if (item.image) {
                    imageBase64 = new Buffer(item.image, "base64").toString(
                      "binary"
                    );
                  }
                  return (
                    <div
                      className="section-customize"
                      key={item.id}
                      onClick={() => this.handleViewDetailDoctor(item)}
                    >
                      <div className="outer-bg outer-bg-border-grey">
                        <div
                          className="bg-image section-outstanding-doctor"
                          style={{
                            backgroundImage: `url(${imageBase64})`,
                          }}
                        />
                        <div className="position text-center">
                          <div className="position-title">
                            {language === LANGUAGES.VI ? nameVi : nameEn}
                          </div>
                          <div className="position-major">Cơ xương khớp</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    isLoggedIn: state.user.isLoggedIn,
    topDoctorList: state.admin.topDoctors,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTopDoctors: () => dispatch(actions.fetchTopDoctor()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OutStandingDoctor)
);
