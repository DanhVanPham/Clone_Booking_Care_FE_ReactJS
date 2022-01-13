import React, { Component } from "react";
import { connect } from "react-redux";
import "./MedicalFacility.scss";
import Slider from "react-slick";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import * as actions from "../../../store/actions";
class MedicalFacility extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicArr: [],
    };
  }

  componentDidMount() {
    this.props.fetchClinicStart();
  }

  componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.listClinic !== this.props.listClinic) {
      this.setState({
        clinicArr: this.props.listClinic || [],
      });
    }
  }

  handleViewDetailMedicalFacility = (item) => {
    if (this.props.history) {
      this.props.history.push(`/detail-clinic/${item.id}`);
    }
  };

  render() {
    let { clinicArr } = this.state;
    return (
      <div className="section-share section-medical-facility">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.medical-facility" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {clinicArr &&
                clinicArr.length > 0 &&
                clinicArr.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="section-customize"
                      onClick={() => this.handleViewDetailMedicalFacility(item)}
                    >
                      <div className="outer-bg">
                        <div
                          className="bg-image section-medical-facility-item"
                          style={{
                            backgroundImage: `url(${item.image})`,
                          }}
                        />
                        <div className="section-title">{item.name}</div>
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
    isLoggedIn: state.user.isLoggedIn,
    listClinic: state.admin.listClinic,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchClinicStart: () => dispatch(actions.fetchClinicStart()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MedicalFacility)
);
