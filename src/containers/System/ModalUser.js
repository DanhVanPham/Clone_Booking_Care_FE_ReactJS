import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { emitter } from "../../utils/emitter";
import _ from "lodash";
import "./ModalUser.scss";

class ModalUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      address: "",
      isShowPassword: false,
    };
    this.listenToEmitter();
  }

  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", (data) => {
      this.setState({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        address: "",
        isShowPassword: false,
      });
    });
  }

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    let user = this.props.currentUser;
    let isEditUser = this.props.isEditUser;
    if (
      !_.isEqual(prevProps, this.props) &&
      isEditUser &&
      user &&
      !_.isEmpty(user)
    ) {
      this.setState({
        email: user.email,
        password: "password",
        firstName: user.firstName,
        lastName: user.lastName,
        address: user.address,
      });
    }
  }

  handleOnChangeInput = (e, nameInput) => {
    this.setState({
      [nameInput]: e.target.value,
    });
  };

  handleTypePasswordInput = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword,
    });
  };

  checkValidateInput = () => {
    return (
      this.state.email &&
      this.state.firstName &&
      this.state.lastName &&
      this.state.password &&
      this.state.address
    );
  };

  handleAddNewUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid) {
      this.props.createNewUser(this.state);
    } else {
      alert("Missing required parameters!");
    }
  };

  handleEditUser = () => {
    let isValid = this.checkValidateInput();
    if (isValid) {
      this.props.editUserExisted(this.state);
    } else {
      alert("Missing required parameters!");
    }
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        toggle={() => this.props.handleToggleModal()}
        size="lg"
        className="modal-container"
      >
        <ModalHeader>
          {this.props.isEditUser ? "Edit a user" : "Create a new user"}
        </ModalHeader>
        <ModalBody>
          <div className="container modal-body">
            <div className="row">
              <div className="col-6 form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  value={this.state.email}
                  className="form-control"
                  disabled={this.props.isEditUser}
                  onChange={(e) => this.handleOnChangeInput(e, "email")}
                />
              </div>
              <div className="col-6 form-group login-input">
                <label htmlFor="password">Password</label>
                <div className="custom-input-password">
                  <input
                    type={this.state.isShowPassword ? "text" : "password"}
                    id="password"
                    value={this.state.password}
                    onChange={(e) => this.handleOnChangeInput(e, "password")}
                    disabled={this.props.isEditUser}
                    placeholder="Enter your password"
                    className="form-control"
                  />
                  {!this.props.isEditUser && (
                    <i
                      className={
                        this.state.isShowPassword
                          ? "far fa-eye hide-show-password"
                          : "fas fa-eye-slash hide-show-password"
                      }
                      onClick={() => this.handleTypePasswordInput()}
                    ></i>
                  )}
                </div>
              </div>
              <div className="col-6 form-group">
                <label htmlFor="firstName">FirstName</label>
                <input
                  type="text"
                  id="firstName"
                  value={this.state.firstName}
                  onChange={(e) => this.handleOnChangeInput(e, "firstName")}
                  className="form-control"
                />
              </div>
              <div className="col-6 form-group">
                <label htmlFor="lastName">LastName</label>
                <input
                  type="text"
                  id="lastName"
                  value={this.state.lastName}
                  onChange={(e) => this.handleOnChangeInput(e, "lastName")}
                  className="form-control"
                />
              </div>
              <div className="col-12 form-group">
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  value={this.state.address}
                  onChange={(e) => this.handleOnChangeInput(e, "address")}
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="btn btn-primary px-3"
            onClick={() => {
              !this.props.isEditUser
                ? this.handleAddNewUser()
                : this.handleEditUser();
            }}
          >
            {this.props.isEditUser ? "Save changes" : "Add new"}
          </Button>
          <Button
            color="secondary"
            className="btn btn-secondary px-3"
            onClick={() => this.props.handleToggleModal()}
          >
            Close
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
