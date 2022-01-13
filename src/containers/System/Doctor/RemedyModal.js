import _, { add } from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import CommonUtils from "../../../utils/CommonUtils";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import "./RemedyModal.scss";
import { toast } from "react-toastify";

class RemedyModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      imageBase64: "",
    };
  }

  handleOnChangeValue = (e, key) => {
    this.setState({
      [key]: e.target.value,
    });
  };

  async componentDidMount() {
    if (this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  async componentDidUpdate(prevProps, prevState, snapShot) {
    if (prevProps.dataModal !== this.props.dataModal) {
      this.setState({
        email: this.props.dataModal.email,
      });
    }
  }

  handleOnChangeImage = async (e) => {
    let data = e.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      this.setState({
        imageBase64: base64,
      });
    }
  };

  handleSendRemedy = async () => {
    try {
      this.props.sendRemedy(this.state);
    } catch (e) {
      console.log(e);
      toast.error("Booking a new appointment error!");
    }
  };

  render() {
    let { isShowModal, dataModal, onCloseRemedyModal } = this.props;

    return (
      <Modal
        isOpen={isShowModal}
        // toggle={() => this.props.handleClickEvent(false)}
        size="lg"
        centered
        backdrop={true}
        className="booking-modal-container"
      >
        <ModalHeader
          toggle={function noRefCheck() {
            onCloseRemedyModal();
          }}
        >
          Gửi hóa đơn khám bệnh thành công
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-6 form-group">
              <label>Email bệnh nhân</label>
              <input
                type="email"
                className="form-control"
                value={dataModal && dataModal.email}
                readOnly
              />
            </div>
            <div className="col-6 form-group">
              <label>Chọn file đơn thuốc</label>
              <input
                type="file"
                className="form-control-file"
                onChange={(e) => this.handleOnChangeImage(e)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            onClick={() => {
              this.handleSendRemedy();
            }}
          >
            Send
          </Button>{" "}
          <Button
            onClick={function noRefCheck() {
              onCloseRemedyModal();
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    genders: state.admin.genders,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(RemedyModal)
);
