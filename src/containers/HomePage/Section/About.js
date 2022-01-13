import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

class About extends Component {
  render() {
    return (
      <div className="section-share section-about">
        <div className="section-container">
          <div className="section-header">
            <span className="title-section">
              <FormattedMessage id="homepage.media-say-about" />
            </span>
          </div>
          <div className="section-about-content">
            <div className="content-left">
              <iframe
                width="100%"
                height="350px"
                src="https://www.youtube.com/embed/FyDQljKtWnI"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="content-right">
              <p>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste
                porro minus sit veniam nemo nesciunt quisquam optio eligendi
                aperiam, modi exercitationem unde possimus perspiciatis
                temporibus maiores in, veritatis odit dolores. Lorem ipsum dolor
                sit amet consectetur, adipisicing elit. Exercitationem qui
                tenetur cum maiores sequi odio ipsum repellendus quos? Suscipit,
                expedita pariatur architecto nobis natus quas consequuntur quis
                quaerat tenetur numquam?
              </p>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(About);
