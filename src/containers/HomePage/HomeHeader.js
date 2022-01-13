import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";

import "./HomeHeader.scss";
import khamchuyenkhoa from "../../assets/images/khamchuyenkhoa.png";
import dichvuxetnghiem from "../../assets/images/dichvuxetnghiem.png";
import goiphauthuat from "../../assets/images/goi-phau-thuat.png";
import khamtainha from "../../assets/images/khamtainha.png";
import khamtongquat from "../../assets/images/khamtongquat.png";
import khamtuxa from "../../assets/images/khamtuxa.png";
import suckhoetinhthan from "../../assets/images/suckhoetinhthan.png";
import { LANGUAGES } from "../../utils/constant";
import * as actions from "../../store/actions";
import { withRouter } from "react-router";
class HomeHeader extends Component {
  changeLanguage = (language) => {
    //fire redux event: actions
    this.props.changeLanguageApp(language);
  };
  returnToHome = () => {
    if (this.props.history) {
      this.props.history.replace("/home");
    }
  };
  render() {
    let { isShowBanner } = this.props;
    return (
      <>
        <div className="home-header-container">
          <div className="home-header-content">
            <div className="left-content">
              <i className="fas fa-bars"></i>
              <div
                className="header-logo"
                onClick={() => this.returnToHome()}
              ></div>
            </div>
            <div className="center-content">
              <div className="child-content">
                <div className="child-content-title">
                  <b>
                    <FormattedMessage id="home-header.specialty" />
                  </b>
                </div>
                <span className="subs-title">
                  <FormattedMessage id="home-header.search-doctor" />
                </span>
              </div>
              <div className="child-content">
                <div className="child-content-title">
                  <b>
                    <FormattedMessage id="home-header.health-facility" />
                  </b>
                </div>
                <span className="subs-title">
                  <FormattedMessage id="home-header.select-room" />
                </span>
              </div>
              <div className="child-content">
                <div className="child-content-title">
                  <b>
                    <FormattedMessage id="home-header.doctor" />
                  </b>
                </div>
                <span className="subs-title">
                  <FormattedMessage id="home-header.select-doctor" />
                </span>
              </div>
              <div className="child-content">
                <div className="child-content-title">
                  <b>
                    <FormattedMessage id="home-header.fee" />
                  </b>
                </div>
                <span className="subs-title">
                  <FormattedMessage id="home-header.check-health" />
                </span>
              </div>
            </div>
            <div className="right-content">
              <div className="support">
                <i className="fas fa-question-circle"></i>
                <span>
                  <FormattedMessage id="home-header.support" />
                </span>
              </div>
              <div className="language">
                <div
                  className={`language-vi ${
                    this.props.lang === LANGUAGES.VI && "active"
                  }`}
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>
                    VN
                  </span>
                </div>
                <div className="divider"></div>
                <div
                  className={`language-en ${
                    this.props.lang === LANGUAGES.EN && "active"
                  }`}
                >
                  <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>
                    EN
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {isShowBanner && (
          <div className="home-header-banner">
            <div className="content-up">
              <h1 className="banner-title">
                <FormattedMessage id="banner.title1" />
                <br />
                <b>
                  <FormattedMessage id="banner.title2" />
                </b>
              </h1>
              <div className="search">
                <i className="fas fa-search search-icon"></i>
                <FormattedMessage
                  id="banner.findClinic"
                  defaultMessage="TÌm kiếm"
                >
                  {(placeholder) => (
                    <input
                      type="text"
                      className="search-input"
                      placeholder={placeholder}
                    />
                  )}
                </FormattedMessage>
              </div>
            </div>
            <div className="content-down">
              <div className="options">
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${khamchuyenkhoa})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child1" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${khamtuxa})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child2" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${khamtongquat})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child3" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${dichvuxetnghiem})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child4" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${suckhoetinhthan})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child5" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${khamchuyenkhoa})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child6" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${goiphauthuat})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child7" />
                  </div>
                </div>
                <div className="option-child">
                  <div
                    className="icon-child"
                    style={{
                      background: `url(${khamtainha})`,
                    }}
                  ></div>
                  <div className="text-child">
                    <FormattedMessage id="banner.child8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
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
  return {
    changeLanguageApp: (language) =>
      dispatch(actions.changeLanguageApp(language)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(HomeHeader)
);
