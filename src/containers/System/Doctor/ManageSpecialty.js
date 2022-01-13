import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";

import "./ManageSpecialty.scss";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";

import { createNewSpecialtyService } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
import { CommonUtils } from "../../../utils";
import { toast } from "react-toastify";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
class ManageSpecialty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameSpecialty: "",
      imageSpecialty: "",
      descriptionHTML: "",
      descriptionMarkdown: "",
    };
  }

  async componentDidMount() {}

  async componentDidUpdate(prevProps, prevState, snapShot) {}

  handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      console.log("BASE64: ", base64);
      this.setState({
        imageSpecialty: base64,
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

  handleSaveChangeSpecialty = async () => {
    let {
      nameSpecialty,
      descriptionHTML,
      descriptionMarkdown,
      imageSpecialty,
    } = this.state;
    if (
      !nameSpecialty ||
      !descriptionHTML ||
      !descriptionMarkdown ||
      !imageSpecialty
    ) {
      toast.warn("Missing required parameters!");
      return;
    }
    try {
      let response = await createNewSpecialtyService({
        descriptionHTML: descriptionHTML,
        descriptionMarkdown: descriptionMarkdown,
        image: imageSpecialty,
        name: nameSpecialty,
      });
      if (response && response.errCode === 0) {
        toast.success(
          response.errMessage || "Create new specialty successfull"
        );
      } else {
        toast.success(response.errMessage || "Create new specialty failed!");
      }
    } catch (e) {
      toast.error("Error from server!");
      console.log(e);
    }
  };

  render() {
    console.log("STATE:", this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-specialty.title" />
        </div>
        <div className="more-infor-extra row">
          <div className="col-6 form-group">
            <label htmlFor="name-clinic">
              <FormattedMessage id="admin.manage-specialty.name-specialty" />
            </label>
            <input
              type="text"
              id="name-clinic"
              className="form-control"
              value={this.state.nameSpecialty}
              onChange={(e) => this.handleChangeInput(e, "nameSpecialty")}
            />
          </div>
          <div className="col-6 form-group">
            <label htmlFor="address-clinic">
              <FormattedMessage id="admin.manage-specialty.image-specialty" />
            </label>
            <input
              type="file"
              id="image"
              className="form-control-file"
              onChange={(event) => this.handleOnChangeImage(event)}
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
          onClick={() => this.handleSaveChangeSpecialty()}
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
  connect(mapStateToProps, mapDispatchToProps)(ManageSpecialty)
);
