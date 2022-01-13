import React, { Component } from "react";
import { connect } from "react-redux";
import "./ManageDoctor.scss";
import * as actions from "../../../store/actions";
import { LANGUAGES } from "../../../utils/constant";
import { getAllDoctorService } from "../../../services/userService";

import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import { toast } from "react-toastify";

import { getDoctorDetailByIdService } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
// Register plugins if required
// MdEditor.use(YOUR_PLUGINS_HERE);

// Initialize a markdown parser
const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!

class ManageDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentMarkdown: "",
      contentHTML: "",
      selectedDoctor: "",
      description: "",
      optionDoctors: [],

      optionPrices: [],
      selectedPrice: "",

      optionPayments: [],
      selectedPayment: "",

      optionProvinces: [],
      selectedProvince: "",

      optionSpecialty: [],
      selectedSpecialty: "",

      optionClinics: [],
      selectedClinic: "",

      nameClinic: "",
      addressClinic: "",
      note: "",
    };
  }

  componentDidMount() {
    this.props.fetchAllDoctorService();
    this.props.fetchPriceStart();
    this.props.fetchPaymentStart();
    this.props.fetchProvinceStart();
    this.props.fetchSpecialtyStart();
    this.props.fetchClinicStart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.listDoctors !== this.props.listDoctors) {
      let listDoctor = this.props.listDoctors;
      if (listDoctor && listDoctor.length > 0) {
        let result = this.buildDataInputSelect(listDoctor, "DOCTOR");
        this.setState({
          optionDoctors: result,
        });
      }
    }
    if (prevProps.language !== this.props.language) {
      this.props.fetchAllDoctorService();
      this.props.fetchPriceStart();
      this.props.fetchPaymentStart();
      this.props.fetchProvinceStart();
    }

    if (prevProps.listPrice !== this.props.listPrice) {
      let listPrice = this.props.listPrice;
      if (listPrice && listPrice.length > 0) {
        let result = this.buildDataInputSelect(listPrice);
        this.setState({
          optionPrices: result,
        });
      }
    }

    if (prevProps.listPayment !== this.props.listPayment) {
      let listPayment = this.props.listPayment;
      if (listPayment && listPayment.length > 0) {
        let result = this.buildDataInputSelect(listPayment);
        this.setState({
          optionPayments: result,
        });
      }
    }

    if (prevProps.listProvince !== this.props.listProvince) {
      let listProvince = this.props.listProvince;
      if (listProvince && listProvince.length > 0) {
        let result = this.buildDataInputSelect(listProvince);
        this.setState({
          optionProvinces: result,
        });
      }
    }
    if (prevProps.listSpecialty !== this.props.listSpecialty) {
      let listSpecialty = this.props.listSpecialty;
      if (listSpecialty && listSpecialty.length > 0) {
        let result = this.buildDataInputSelect(listSpecialty, "SPECIALTY");
        this.setState({
          optionSpecialty: result,
        });
      }
    }
    if (prevProps.listClinic !== this.props.listClinic) {
      let listClinic = this.props.listClinic;
      if (listClinic && listClinic.length > 0) {
        let result = this.buildDataInputSelect(listClinic, "CLINIC");
        this.setState({
          optionClinics: result,
        });
      }
    }
  }

  buildDataInputSelect = (data, type = "DEFAULT") => {
    let result = [];
    let { language } = this.props;
    if (data && data.length > 0) {
      data.forEach((item) => {
        let label = "";
        switch (type) {
          case "DOCTOR":
            if (language === LANGUAGES.VI) {
              label = `${item.lastName} ${item.firstName}`;
            } else if (language === LANGUAGES.EN) {
              label = `${item.firstName} ${item.lastName}`;
            }
            result.push({
              value: item.id,
              label,
            });
            break;
          case "SPECIALTY":
            label = item.name;
            result.push({
              value: item.id,
              label,
            });
            break;
          case "CLINIC":
            label = item.name;
            result.push({
              value: item.id,
              label,
            });
            break;
          default:
            if (language === LANGUAGES.VI) {
              label = `${item.valueVi}`;
            } else if (language === LANGUAGES.EN) {
              label = `${item.valueEn}`;
            }
            result.push({
              value: item.keyMap,
              label,
            });
            break;
        }
      });
    }
    return result;
  };

  handleEditorChange = ({ html, text }) => {
    console.log("handleEditorChange", html, text);
    this.setState({
      contentHTML: html,
      contentMarkdown: text,
    });
  };

  handleSaveContentMarkdown = () => {
    if (
      !this.state.contentHTML ||
      !this.state.contentMarkdown ||
      !this.state.description ||
      !this.state.selectedDoctor ||
      !this.state.selectedPrice ||
      !this.state.selectedPayment ||
      !this.state.selectedProvince ||
      !this.state.selectedSpecialty ||
      !this.state.selectedClinic ||
      !this.state.nameClinic ||
      !this.state.addressClinic ||
      !this.state.note
    ) {
      toast.warn("Missing required parameters!", {
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
    console.log(this.state);
    this.props.saveDetailDoctorService({
      contentHTML: this.state.contentHTML,
      contentMarkdown: this.state.contentMarkdown,
      description: this.state.description,
      doctorId: this.state.selectedDoctor.value,

      priceId: this.state.selectedPrice.value,
      paymentId: this.state.selectedPayment.value,
      provinceId: this.state.selectedProvince.value,
      specialtyId: this.state.selectedSpecialty.value,
      clinicId: this.state.selectedClinic.value,
      nameClinic: this.state.nameClinic,
      addressClinic: this.state.addressClinic,
      note: this.state.note,
    });
  };

  handleOnChangeTypeText = (e, key) => {
    this.setState({
      [key]: e.target.value,
    });
  };

  handleChangeOptions = async (type, selectedOption) => {
    console.log("SELECT: ", type, selectedOption);
    type === "Doctor" &&
      (await this.fetchDoctorDetailById(selectedOption.value));
    this.setState({
      [`selected${type}`]: selectedOption,
    });
  };

  fetchDoctorDetailById = async (userId) => {
    try {
      let response = await getDoctorDetailByIdService(userId);
      if (response.errCode === 0 && response.data) {
        if (response.data.markDownData) {
          let markDown = response.data.markDownData;
          console.log(response.data);
          this.setState({
            contentMarkdown: markDown.contentMarkdown || "",
            contentHTML: markDown.contentHTML || "",
            description: markDown.description || "",
          });
        } else {
          this.setState({
            contentMarkdown: "",
            contentHTML: "",
            description: "",
          });
        }

        if (response.data.doctorInfoData) {
          let doctorInfo = response.data.doctorInfoData;
          console.log(
            "CHECK:",
            this.autoSelectDefault(doctorInfo.priceId, "PRICE")
          );
          let selectedPrice = this.autoSelectDefault(
            doctorInfo.priceId,
            "PRICE"
          );
          let selectedPayment = this.autoSelectDefault(
            doctorInfo.paymentId,
            "PAYMENT"
          );
          let selectedProvince = this.autoSelectDefault(
            doctorInfo.provinceId,
            "PROVINCE"
          );
          let selectedSpecialty = this.autoSelectDefault(
            doctorInfo.specialtyData?.id || -1,
            "SPECIALTY"
          );
          let selectedClinic = this.autoSelectDefault(
            doctorInfo.clinicId || -1,
            "CLINIC"
          );
          this.setState(
            {
              nameClinic: doctorInfo.nameClinic || "",
              addressClinic: doctorInfo.addressClinic || "",
              note: doctorInfo.note || "",
              selectedPrice,
              selectedPayment,
              selectedProvince,
              selectedSpecialty,
              selectedClinic,
            },
            () => {
              console.log("STATE:", this.state);
            }
          );
        } else {
          this.setState({
            nameClinic: "",
            addressClinic: "",
            selectedPrice: "",
            selectedPayment: "",
            selectedProvince: "",
            selectedSpecialty: "",
            selectedClinic: "",
          });
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  autoSelectDefault = (keyMap, type) => {
    let itemSelect = "";
    switch (type) {
      case "PRICE": {
        let optionsPrice = this.state.optionPrices;
        optionsPrice &&
          optionsPrice.length > 0 &&
          optionsPrice.forEach((item) => {
            if (item.value === keyMap) {
              itemSelect = item;
            }
          });
        break;
      }
      case "PROVINCE": {
        let optionsProvince = this.state.optionProvinces;
        optionsProvince &&
          optionsProvince.length > 0 &&
          optionsProvince.forEach((item) => {
            if (item.value === keyMap) {
              itemSelect = item;
            }
          });
        break;
      }
      case "PAYMENT": {
        let optionsPayment = this.state.optionPayments;
        optionsPayment &&
          optionsPayment.length > 0 &&
          optionsPayment.forEach((item) => {
            if (item.value === keyMap) {
              itemSelect = item;
            }
          });
        break;
      }
      case "SPECIALTY": {
        let optionSpecialty = this.state.optionSpecialty;
        optionSpecialty &&
          optionSpecialty.length > 0 &&
          optionSpecialty.forEach((item) => {
            if (item.value === keyMap) {
              itemSelect = item;
            }
          });
        break;
      }
      case "CLINIC": {
        let optionClinics = this.state.optionClinics;
        optionClinics &&
          optionClinics.length > 0 &&
          optionClinics.forEach((item) => {
            if (item.value === keyMap) {
              itemSelect = item;
            }
          });
        break;
      }
      default:
        break;
    }
    return itemSelect;
  };

  loadOptionsByFilter = async (inputValue) => {
    const response = await getAllDoctorService(inputValue);
    this.props.fetchAllDoctorSuccess(response.data);
    const result = this.buildDataInputSelect(response.data);
    return result;
  };

  render() {
    console.log(this.state);
    return (
      <div className="manage-doctor-container">
        <div className="manage-doctor-title">
          <FormattedMessage id="admin.manage-doctor.title" />
        </div>
        <div className="more-infor">
          <div className="content-left form-group">
            <label htmlFor="select-doctor">
              <FormattedMessage id="admin.manage-doctor.choose-doctor" />
            </label>
            <AsyncSelect
              cacheOptions
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-doctor" />
              }
              value={this.state.selectedDoctor}
              onChange={this.handleChangeOptions.bind(this, "Doctor")}
              loadOptions={this.loadOptionsByFilter}
              defaultOptions={this.state.optionDoctors}
              id="select-doctor"
            />
          </div>
          <div className="content-right form-group">
            <label htmlFor="personal-info">
              <FormattedMessage id="admin.manage-doctor.doctor-info" />
            </label>
            <textarea
              id="personal-info"
              className="form-control more-infor-textarea"
              rows={4}
              onChange={(e) => this.handleOnChangeTypeText(e, "description")}
              value={this.state.description}
            ></textarea>
          </div>
        </div>
        <div className="more-infor-extra row">
          <div className="col-4 form-group">
            <label htmlFor="choose-price">
              <FormattedMessage id="admin.manage-doctor.choose-price" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-price" />
              }
              value={this.state.selectedPrice}
              onChange={this.handleChangeOptions.bind(this, "Price")}
              options={this.state.optionPrices}
              id="choose-price"
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="choose-payment-method">
              <FormattedMessage id="admin.manage-doctor.choose-payment-method" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-payment-method" />
              }
              value={this.state.selectedPayment}
              onChange={this.handleChangeOptions.bind(this, "Payment")}
              options={this.state.optionPayments}
              id="choose-payment-method"
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="choose-province">
              <FormattedMessage id="admin.manage-doctor.choose-province" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-province" />
              }
              value={this.state.selectedProvince}
              onChange={this.handleChangeOptions.bind(this, "Province")}
              options={this.state.optionProvinces}
              id="choose-province"
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="name-clinic">
              <FormattedMessage id="admin.manage-doctor.name-clinic" />
            </label>
            <input
              type="text"
              id="name-clinic"
              className="form-control"
              value={this.state.nameClinic}
              onChange={(e) => this.handleOnChangeTypeText(e, "nameClinic")}
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="address-clinic">
              <FormattedMessage id="admin.manage-doctor.address-clinic" />
            </label>
            <input
              type="text"
              id="address-clinic"
              className="form-control"
              value={this.state.addressClinic}
              onChange={(e) => this.handleOnChangeTypeText(e, "addressClinic")}
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="note">
              <FormattedMessage id="admin.manage-doctor.note" />
            </label>
            <input
              type="text"
              id="note"
              className="form-control"
              value={this.state.note}
              onChange={(e) => this.handleOnChangeTypeText(e, "note")}
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="choose-specialty">
              <FormattedMessage id="admin.manage-doctor.choose-specialty" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-specialty" />
              }
              value={this.state.selectedSpecialty}
              onChange={this.handleChangeOptions.bind(this, "Specialty")}
              options={this.state.optionSpecialty}
              id="choose-specialty"
            />
          </div>
          <div className="col-4 form-group">
            <label htmlFor="choose-clinic">
              <FormattedMessage id="admin.manage-doctor.choose-clinic" />
            </label>
            <Select
              placeholder={
                <FormattedMessage id="admin.manage-doctor.choose-clinic" />
              }
              value={this.state.selectedClinic}
              onChange={this.handleChangeOptions.bind(this, "Clinic")}
              options={this.state.optionClinics}
              id="choose-clinic"
            />
          </div>
        </div>
        <div className="manage-doctor-editor">
          <MdEditor
            value={this.state.contentMarkdown}
            style={{ height: "300px" }}
            renderHTML={(text) => mdParser.render(text)}
            onChange={this.handleEditorChange}
          />
        </div>
        <button
          className="save-content-doctor"
          onClick={() => this.handleSaveContentMarkdown()}
        >
          <FormattedMessage id="admin.manage-doctor.save-change" />
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    language: state.app.language,
    users: state.admin.users,
    listDoctors: state.admin.listDoctors,
    listPrice: state.admin.listPrice,
    listPayment: state.admin.listPayment,
    listProvince: state.admin.listProvince,
    listSpecialty: state.admin.listSpecialty,
    listClinic: state.admin.listClinic,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchAllDoctorService: (nameSearch) =>
      dispatch(actions.fetchAllDoctorService(nameSearch)),
    fetchAllDoctorSuccess: (data) =>
      dispatch(actions.fetchAllDoctorSuccess(data)),
    fetchPriceStart: () => dispatch(actions.fetchPriceStart()),
    fetchPaymentStart: () => dispatch(actions.fetchPaymentStart()),
    fetchProvinceStart: () => dispatch(actions.fetchProvinceStart()),
    fetchSpecialtyStart: () => dispatch(actions.fetchSpecialtyStart()),
    fetchClinicStart: () => dispatch(actions.fetchClinicStart()),

    saveDetailDoctorService: (data) => dispatch(actions.saveDetailDoctor(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ManageDoctor);
