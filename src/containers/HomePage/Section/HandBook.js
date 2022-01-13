import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import Slider from "react-slick";

class HandBook extends Component {
  render() {
    return (
      <div className="section-share section-handbook">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.hand-book" />
            </span>
            <button className="btn-section">
              <FormattedMessage id="homepage.more-infor" />
            </button>
          </div>
          <div className="section-body">
            <Slider {...this.props.settings}>
              <div className="section-customize">
                <div className="bg-image section-handbook-item" />
                <div className="section-title">Cẩm nang 1</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-handbook-item" />
                <div className="section-title">Cẩm nang 2</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-handbook-item" />
                <div className="section-title">Cẩm nang 3</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-handbook-item" />
                <div className="section-title">Cẩm nang 4</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-handbook-item" />
                <div className="section-title">Cẩm nang 5</div>
              </div>
              <div className="section-customize">
                <div className="bg-image section-handbook-item" />
                <div className="section-title">Cẩm nang 6</div>
              </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(HandBook);
