import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { emitter } from "../../utils/emitter";
import "./UserManage.scss";

import {
  getAllUsers,
  createNewUserService,
  editUserService,
  deleteUserService,
} from "../../services/userService";
import ModalUser from "./ModalUser";
class UserManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isOpenModalUser: false,
      isEditUser: false,
      user: {},
    };
  }

  async componentDidMount() {
    await this.handleGetAllUsers();
  }

  handleGetAllUsers = async (userId = "ALL") => {
    let response = await getAllUsers(userId);
    if (response.errCode === 0 && response.users) {
      this.setState({
        users: response.users,
      });
    }
  };

  handleToggleModalUser = () => {
    this.setState(
      {
        isOpenModalUser: !this.state.isOpenModalUser,
        user: {},
        isEditUser: false,
      },
      () => {
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      }
    );
  };

  handleAddNewUser = (e) => {
    this.setState({
      isEditUser: false,
      isOpenModalUser: true,
      user: {},
    });
  };

  handleEditUser = (item) => {
    this.setState({
      user: item,
      isEditUser: true,
      isOpenModalUser: true,
    });
  };

  createNewUser = async (data) => {
    console.log(data);
    try {
      let response = await createNewUserService(data);
      console.log("Response create user: ", response);
      if (response.errCode === 0) {
        await this.handleGetAllUsers();
        this.handleToggleModalUser();
      } else {
        alert(response.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  editUserExisted = async (data) => {
    let { firstName, lastName, address } = data;
    try {
      let response = await editUserService({
        id: this.state.user.id,
        firstName,
        lastName,
        address,
      });
      console.log("Response create user: ", response);
      if (response.errCode === 0) {
        await this.handleGetAllUsers();
        this.handleToggleModalUser();
        emitter.emit("EVENT_CLEAR_MODAL_DATA");
      } else {
        alert(response.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDeleteUser = async (userId) => {
    console.log(userId);
    try {
      let response = await deleteUserService(userId);
      console.log(response);
      if (response.errCode === 0) {
        await this.handleGetAllUsers();
      } else {
        alert(response.errMessage);
      }
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    return (
      <div className="users-container">
        <div className="title text-center">Manage users</div>
        <ModalUser
          isOpen={this.state.isOpenModalUser}
          isEditUser={this.state.isEditUser}
          currentUser={this.state.user}
          handleToggleModal={() => this.handleToggleModalUser()}
          createNewUser={this.createNewUser}
          editUserExisted={this.editUserExisted}
        />
        <div className="mx-1">
          <button
            className="btn btn-primary px-3"
            onClick={(e) => this.handleAddNewUser(e)}
          >
            <i className="fas fa-plus"></i> Add new User
          </button>
        </div>
        <div className="users-table mt-4 mx-1">
          <table id="customers">
            <thead>
              <tr>
                <th>Email</th>
                <th>FirstName</th>
                <th>LastName</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.users.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>{item.email}</td>
                    <td>{item.firstName}</td>
                    <td>{item.lastName}</td>
                    <td>{item.address}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => this.handleEditUser(item)}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => this.handleDeleteUser(item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
