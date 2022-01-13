import React, { Component } from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { isArrayLiteralExpression } from "typescript";
import * as actions from "../../../store/actions";
import "./TableManageUser.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
function handleEditorChange({ html, text }) {
  console.log("handleEditorChange", html, text);
}

class TableManageUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isOpenModalUser: false,
      isEditUser: false,
      user: {},
    };
  }

  componentDidMount() {
    this.props.getAllUserService("ALL");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.users !== this.props.users) {
      this.setState({
        users: this.props.users,
      });
    }
  }

  handleDeleteUser = (userId) => {
    if (!userId) {
      toast.warn("Your action something wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    let confirmText = "Are you sure to want to delete selected user?";
    if (window.confirm(confirmText)) {
      this.props.deleteAUserService(userId);
    } else {
      toast.warn("Your action has been canceled successfully.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  handleEditUser = (data) => {
    this.props.selectedUser(data);
  };

  render() {
    console.log("CHECK USERS: ", this.state.users);
    return (
      <>
        <div className="users-container mb-5">
          <div className="title text-center">Manage users</div>
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
                {this.state.users &&
                  this.state.users.length > 0 &&
                  this.state.users.map((item) => {
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
        <MdEditor
          style={{ height: "500px" }}
          renderHTML={(text) => mdParser.render(text)}
          onChange={handleEditorChange}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.admin.users,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllUserService: (inputId) =>
      dispatch(actions.getAllUserService(inputId)),
    deleteAUserService: (userId) =>
      dispatch(actions.deleteAUserService(userId)),
    selectedUser: (data) => dispatch(actions.selectedUser(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableManageUser);
