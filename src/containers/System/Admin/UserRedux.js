import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import _ from "lodash";

import { LANGUAGES, CommonUtils } from "../../../utils";
import * as actions from "../../../store/actions";

import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

import "./UserRedux.scss";

import TableManageUser from "./TableManageUser";

class UserRedux extends Component {
  constructor(props) {
    super(props);
    this.state = {
      genderArr: [],
      roleArr: [],
      positionArr: [],
      previewImgUrl: "",
      isOpen: false,

      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      gender: "",
      position: "",
      role: "",
      avatar: "",

      isSelected: false,
    };
  }

  componentDidMount() {
    this.props.getGenderStart();
    this.props.getRoleStart();
    this.props.getPositionStart();
  }

  componentDidUpdate(preProps, preState, snapshow) {
    if (preProps.genders !== this.props.genders) {
      let arrGender = this.props.genders;
      this.setState({
        genderArr: arrGender,
        gender: arrGender && arrGender.length > 0 ? arrGender[0].keyMap : "",
      });
    }

    if (preProps.roles !== this.props.roles) {
      let arrRole = this.props.roles;
      this.setState({
        roleArr: arrRole,
        role: arrRole && arrRole.length > 0 ? arrRole[0].keyMap : "",
      });
    }

    if (preProps.positions !== this.props.positions) {
      let arrPosition = this.props.positions;
      this.setState({
        positionArr: arrPosition,
        position:
          arrPosition && arrPosition.length > 0 ? arrPosition[0].keyMap : "",
      });
    }

    if (preProps.users !== this.props.users) {
      this.setState({
        ...this.state,
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        gender:
          this.props.genders && this.props.genders.length > 0
            ? this.props.genders[0].keyMap
            : "",
        role:
          this.props.roles && this.props.roles.length > 0
            ? this.props.roles[0].keyMap
            : "",
        position:
          this.props.positions && this.props.positions.length > 0
            ? this.props.positions[0].keyMap
            : "",
        previewImgUrl: "",
      });
    }

    if (!_.isEqual(preProps.userSelected, this.props.userSelected)) {
      let userSelected = this.props.userSelected;
      let imageBase64 = "";
      if (userSelected.image) {
        imageBase64 = new Buffer(userSelected.image, "base64").toString(
          "binary"
        );
      }
      this.setState({
        ...this.state,
        email: userSelected.email,
        password: "Hard Password",
        firstName: userSelected.firstName,
        lastName: userSelected.lastName,
        address: userSelected.address,
        gender: userSelected.gender,
        role: userSelected.roleId,
        phoneNumber: userSelected.phoneNumber,
        position: userSelected.positionId,
        previewImgUrl: imageBase64,
        isSelected: userSelected && !_.isEmpty(userSelected),
      });
    }
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      console.log("BASE64: ", base64);
      let objectUrl = URL.createObjectURL(file);
      this.setState({
        previewImgUrl: objectUrl,
        avatar: base64,
      });
    }
  };

  handlePreviewImage = () => {
    if (!this.state.previewImgUrl) return;
    this.setState({
      isOpen: true,
    });
  };

  checkValidateInput = () => {
    let isValid = true;
    let arrCheck = [
      "email",
      "password",
      "firstName",
      "lastName",
      "phoneNumber",
      "address",
    ];
    for (let i = 0; i < arrCheck.length; i++) {
      if (!this.state[arrCheck[i]]) {
        isValid = false;
        break;
      }
    }
    return isValid;
  };

  onChangeInput = (event, key) => {
    this.setState(
      {
        [key]: event.target.value,
      },
      () => {
        console.log("CHECK STATE: " + this.state);
      }
    );
  };

  handleSaveUser = (event) => {
    event.preventDefault();
    if (!this.checkValidateInput()) {
      alert("Missing required parameters!");
      return;
    }

    !this.state.isSelected
      ? this.props.createNewUser({
          email: this.state.email,
          password: this.state.password,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address,
          gender: this.state.gender,
          roleId: this.state.role,
          phoneNumber: this.state.phoneNumber,
          positionId: this.state.position,
          avatar: this.state.avatar,
        })
      : this.props.editAUserService({
          id: this.props.userSelected.id,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          address: this.state.address,
          gender: this.state.gender,
          roleId: this.state.role,
          phoneNumber: this.state.phoneNumber,
          positionId: this.state.position,
          avatar: this.state.avatar,
        });
  };

  handleCanceledUser = (e) => {
    e.preventDefault();
    this.setState({
      ...this.state,
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
    });
    this.props.canceledUserSelected();
  };

  render() {
    let language = this.props.language;
    let {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      address,
      gender,
      position,
      role,
      isSelected,
    } = this.state;
    console.log(this.state.previewImgUrl);
    return (
      <div className="user-redux-container">
        <div className="title">User Redux</div>
        <div className="user-redux-body">
          <div className="container">
            <form>
              <div className="row">
                <div className="col-12 my-3">
                  <FormattedMessage id="manage-user.add" />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputEmail4">
                    <FormattedMessage id="manage-user.email" />
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="inputEmail4"
                    value={email}
                    disabled={isSelected}
                    onChange={(e) => this.onChangeInput(e, "email")}
                    placeholder="Email"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="inputPassword4">
                    <FormattedMessage id="manage-user.password" />
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="inputPassword4"
                    value={isSelected ? "Hard Password" : password}
                    disabled={isSelected}
                    onChange={(e) => this.onChangeInput(e, "password")}
                    placeholder="Password"
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="firstName">
                  <FormattedMessage id="manage-user.first-name" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={firstName}
                  onChange={(e) => this.onChangeInput(e, "firstName")}
                  id="firstName"
                />
              </div>
              <div className="form-group">
                <label htmlFor="lastName">
                  <FormattedMessage id="manage-user.last-name" />
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={lastName}
                  onChange={(e) => this.onChangeInput(e, "lastName")}
                  id="lastName"
                />
              </div>
              <div className="row">
                <div className="form-group col-md-6">
                  <label htmlFor="phoneNumber">
                    <FormattedMessage id="manage-user.phone-number" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={phoneNumber}
                    onChange={(e) => this.onChangeInput(e, "phoneNumber")}
                    id="phoneNumber"
                  />
                </div>
                <div className="form-group col-md-6">
                  <label htmlFor="address">
                    <FormattedMessage id="manage-user.address" />
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => this.onChangeInput(e, "address")}
                    id="address"
                  />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-3">
                  <label htmlFor="gender">
                    <FormattedMessage id="manage-user.gender" />
                  </label>
                  <select
                    className="form-control"
                    value={gender}
                    onChange={(e) => this.onChangeInput(e, "gender")}
                  >
                    {this.state.genderArr &&
                      this.state.genderArr.map((item, index) => {
                        return (
                          <option key={item.id} value={item.keyMap}>
                            {language === LANGUAGES.EN
                              ? item.valueEn
                              : item.valueVi}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="position">
                    <FormattedMessage id="manage-user.position" />
                  </label>
                  <select
                    className="form-control"
                    value={position}
                    onChange={(e) => this.onChangeInput(e, "position")}
                  >
                    {this.state.positionArr &&
                      this.state.positionArr.map((item, index) => {
                        return (
                          <option key={item.id} value={item.keyMap}>
                            {language === LANGUAGES.EN
                              ? item.valueEn
                              : item.valueVi}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="role">
                    <FormattedMessage id="manage-user.role" />
                  </label>
                  <select
                    className="form-control"
                    value={role}
                    onChange={(e) => this.onChangeInput(e, "role")}
                  >
                    {this.state.roleArr &&
                      this.state.roleArr.map((item, index) => {
                        return (
                          <option key={item.id} value={item.keyMap}>
                            {language === LANGUAGES.EN
                              ? item.valueEn
                              : item.valueVi}
                          </option>
                        );
                      })}
                  </select>
                </div>
                <div className="form-group col-md-3">
                  <label htmlFor="image">
                    <FormattedMessage id="manage-user.image" />
                  </label>
                  <div className="preview-img-container">
                    <input
                      type="file"
                      id="image"
                      hidden
                      onChange={(event) => this.handleOnChangeImage(event)}
                    />
                    <label htmlFor="image" className="label-upload">
                      Tải ảnh<i className="fas fa-upload"></i>
                    </label>
                    <div
                      className="preview-image"
                      style={{
                        backgroundImage: `url(${this.state.previewImgUrl})`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "contain",
                      }}
                      onClick={() => this.handlePreviewImage()}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="col-12 mt-4">
                <button
                  className={
                    isSelected ? "btn btn-secondary" : "btn btn-primary"
                  }
                  onClick={(event) => this.handleSaveUser(event)}
                >
                  {isSelected ? (
                    <FormattedMessage id="manage-user.edit" />
                  ) : (
                    <FormattedMessage id="manage-user.save" />
                  )}
                </button>
                {isSelected && (
                  <button
                    className={"btn btn-warning ml-4"}
                    onClick={(event) => this.handleCanceledUser(event)}
                  >
                    <FormattedMessage id="manage-user.canceled" />
                  </button>
                )}
              </div>
            </form>
          </div>
          <TableManageUser />
        </div>
        {this.state.isOpen && this.state.previewImgUrl && (
          <Lightbox
            mainSrc={this.state.previewImgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
    roles: state.admin.roles,
    positions: state.admin.positions,
    isLoadingGender: state.admin.isLoadingGender,
    users: state.admin.users,
    userSelected: state.admin.userSelected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGenderStart: () => dispatch(actions.fetchGenderStart()),
    getPositionStart: () => dispatch(actions.fetchPositionStart()),
    getRoleStart: () => dispatch(actions.fetchRoleStart()),
    createNewUser: (data) => dispatch(actions.createNewUser(data)),
    editAUserService: (data) => dispatch(actions.editAUserService(data)),
    canceledUserSelected: () => dispatch(actions.canceledUserSelected()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
