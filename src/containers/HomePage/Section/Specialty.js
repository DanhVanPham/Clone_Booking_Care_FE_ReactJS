import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import "./Specialty.scss";

import Slider from "react-slick";
import { FormattedMessage } from "react-intl";

import { getAllSpecialty } from "../../../services/userService";

class Specialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listSpecialty: [],
    };
  }

  async componentDidMount() {
    await this.fetchAllSpecialty();
  }

  fetchAllSpecialty = async () => {
    try {
      let response = await getAllSpecialty();
      if (response && response.errCode === 0) {
        this.setState({
          listSpecialty: response.data,
        });
      } else {
        this.setState({
          listSpecialty: [],
        });
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleViewDetailSpecialty = (item) => {
    console.log("CHECK:", this.props.history);
    if (this.props.history) {
      this.props.history.push(`/detail-specialty/${item.id}`);
    }
  };

  render() {
    let { listSpecialty } = this.state;
    console.log("STATE:", this.state);
    return (
      <div className="section-share section-sepecialty">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.specialty" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              {listSpecialty &&
                listSpecialty.length > 0 &&
                listSpecialty.map((item) => {
                  return (
                    <div
                      className="section-customize"
                      key={item.id}
                      onClick={() => this.handleViewDetailSpecialty(item)}
                    >
                      <div className="outer-bg">
                        <div
                          className="bg-image section-specialty-item"
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
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Specialty)
);
