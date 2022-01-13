import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";

import * as actions from "../../store/actions";

import "./Login.scss";
import { handleLogin } from "../../services/userService";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      isShowPassword: false,
      errMessage: "",
    };
  }

  //0 = Username, 1 = Password
  handleOnChangeInput = (e, type) => {
    switch (type) {
      case 0:
        this.setState({
          username: e.target.value,
        });
        break;
      case 1:
        this.setState({
          password: e.target.value,
        });
        break;
      default:
        break;
    }
  };

  handleLogin = async (e) => {
    try {
      this.setState({
        errMessage: "",
      });
      e.preventDefault();
      let data = await handleLogin(this.state.username, this.state.password);
      if (data && data.errCode !== 0) {
        this.setState({
          errMessage: data.message,
        });
      }
      if (data && data.errCode === 0) {
        this.props.userLoginSuccess(data.user);
      }
    } catch (error) {
      console.log(error.response);
      if (error.response) {
        if (error.response.data) {
          this.setState({
            errMessage: error.response.data.message,
          });
        }
      }
      //   this.setState({
      //     errMessage: e.error
      //   })
    }
  };

  handleTypePasswordInput = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  render() {
    return (
      <div className="login-background">
        <div className="login-container">
          <div className="login-content row">
            <div className="col-12 text-login">Login</div>
            <div className="col-12 form-group login-input">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                value={this.state.username}
                onChange={(e) => this.handleOnChangeInput(e, 0)}
                placeholder="Enter your username"
                className="form-control"
              />
            </div>
            <div className="col-12 form-group login-input">
              <label htmlFor="password">Password</label>
              <div className="custom-input-password">
                <input
                  type={this.state.isShowPassword ? "text" : "password"}
                  id="password"
                  value={this.state.password}
                  onChange={(e) => this.handleOnChangeInput(e, 1)}
                  placeholder="Enter your password"
                  className="form-control"
                />
                <i
                  className={
                    this.state.isShowPassword
                      ? "far fa-eye hide-show-password"
                      : "fas fa-eye-slash hide-show-password"
                  }
                  onClick={() => this.handleTypePasswordInput()}
                ></i>
              </div>
            </div>
            <div
              className="col-12"
              style={{
                color: "red",
              }}
            >
              {this.state.errMessage}
            </div>
            <div className="col-12">
              <button
                className="btn-login"
                onClick={(e) => this.handleLogin(e)}
              >
                Log in
              </button>
            </div>
            <div className="col-12">
              <span className="forgot-password">Forgot your password?</span>
            </div>
            <div className="col-12 text-center">
              <span className="text-other-login">Or Login with:</span>
            </div>
            <div className="col-12 social-login">
              <i className="fab fa-facebook-f facebook"></i>
              <i className="fab fa-twitter twitter"></i>
              <i className="fab fa-google-plus-g google"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    navigate: (path) => dispatch(push(path)),
    //   dispatch(actions.adminLoginSuccess(adminInfo)),
    userLoginFail: () => dispatch(actions.userLoginFail()),
    userLoginSuccess: (userInfo) =>
      dispatch(actions.userLoginSuccess(userInfo)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
