import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import "./ManageClinic.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

import { createNewClinicService } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import { toast } from "react-toastify";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
class ManageClinic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: "",
      nameClinic: "",
      imageClinic: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
    };
  }

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      console.log("BASE64: ", base64);
      this.setState({
        imageClinic: base64,
      });
    }
  };

  handleEditorChange = ({ html, text }) => {
    console.log("handleEditorChange", html, text);
    this.setState({
      descriptionHTML: html,
      descriptionMarkdown: text,
    });
  };

  handleChangeInput = (e, key) => {
    this.setState({
      [key]: e.target.value,
    });
  };

  handleSaveChangeClinic = async () => {
    let {
      address,
      nameClinic,
      descriptionHTML,
      descriptionMarkdown,
      imageClinic,
    } = this.state;
    if (
      !address ||
      !nameClinic ||
      !descriptionHTML ||
      !descriptionMarkdown ||
      !imageClinic
    ) {
      toast.warn("Missing required parameters!");
      return;
    }
    try {
      let response = await createNewClinicService({
        address: address,
        descriptionHTML: descriptionHTML,
        descriptionMarkdown: descriptionMarkdown,
        image: imageClinic,
        name: nameClinic,
      });
      if (response && response.errCode === 0) {
        toast.success(response.errMessage || "Create new Clinic successfull");
      } else {
        toast.success(response.errMessage || "Create new Clinic failed!");
      }
    } catch (e) {
      toast.error("Error from server!");
      console.log(e);
    }
  };

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapShot) {}

  render() {
    console.log("STATE:", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">Manage Clinic</div>
        <div className="more-infor-extra row">
          <div className="col-6 form-group">
            <label htmlFor="name-clinic">Tên phòng khám</label>
            <input
              type="text"
              id="name-clinic"
              className="form-control"
              value={this.state.nameClinic}
              onChange={(e) => this.handleChangeInput(e, "nameClinic")}
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="address-clinic">Ảnh phòng khám</label>
            <input
              type="file"
              id="image"
              className="form-control-file"
              onChange={(event) => this.handleOnChangeImage(event)}
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="name-clinic">Địa chỉ phòng khám</label>
            <input
              type="text"
              id="name-clinic"
              className="form-control"
              value={this.state.address}
              onChange={(e) => this.handleChangeInput(e, "address")}
            />
          </div>
        </div>
        <div className="manage-doctor-editor form-group">
          <label htmlFor="description">
            <FormattedMessage id="admin.manage-specialty.description" />
          </label>
          <MdEditor
            id="description"
            value={this.state.descriptionMarkdown}
            style={{ height: "500px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
        </div>
        <button
          className="save-content-doctor"
          onClick={() => this.handleSaveChangeClinic()}
        >
          <FormattedMessage id="admin.manage-specialty.save-change" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ManageClinic)
);
