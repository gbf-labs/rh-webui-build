import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import GetAppIcon from "@material-ui/icons/GetApp";
import DeleteIcon from "@material-ui/icons/Delete";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import AddCircle from "@material-ui/icons/AddCircle";
import Clear from "@material-ui/icons/Clear";
import InputAdornment from "@material-ui/core/InputAdornment";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, TimePicker } from "material-ui-pickers";
import Paper from "@material-ui/core/Paper";
import NativeSelect from "@material-ui/core/NativeSelect";
import DeleteForeverOutlinedIcon from "@material-ui/icons/DeleteForeverOutlined";
import MaterialTooltip from "@material-ui/core/Tooltip";
import DirectionsBoat from "@material-ui/icons/DirectionsBoat";
import Tooltip from "@material-ui/core/Tooltip";
import DescriptionIcon from "@material-ui/icons/Description";
import Typography from "@material-ui/core/Typography";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SelectDropdown from "components/AutoComplete/SelectDropdown.jsx";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

// helpers
import request from "utils/request";
import general from "../../variables/general";
import auth from "utils/auth";

const { listTimeZones } = require("timezone-support");
const { formatToTimeZone } = require("date-fns-timezone");

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      color: "#777",
      fontSize: "65%",
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  centerAlign: {
    textAlign: "center"
  },
  actionButtons: {
    padding: "5px"
  },
  noMargin: {
    margin: 0
  },
  removeTime: {
    float: "right",
    top: "-45px"
  },
  autoCompletePadding: {
    "margin-top": "16px",
    "margin-bottom": "23px"
  },
  fullWidth: {
    width: "100%",
    position: "relative"
  },
  removeBtn: {
    position: "absolute",
    top: "10px",
    right: "-60px"
  },
  noonReportForm: {
    color: "white",
    background: "black"
  },
  vesselThumb: {
    width: "100px"
  },
  vesselThumb2: {
    width: "200px"
  },
  relativePos: {
    position: "relative"
  },
  deleteProf: {
    position: "absolute",
    left: "95px",
    color: "#c32d2d",
    cursor: "pointer"
  },
  uploadFileTxt: {
    marginBottom: "0px",
    marginTop: "15px"
  }
});

let vessInterval = null,
  vessFilesInterval = null;
class Vessels extends React.Component {
  state = {
    alertDialog: {
      openDialog: false,
      withCancelBtn: true,
      dialogTitle: "test",
      dialogBody: "test",
      cb: () => {}
    },
    fullWidth: true,
    maxWidth: "md",
    openDialogCV: false,
    openDialogNR: false,
    openDialogINI: false,
    openDialog: false,
    openDialogUpload: false,
    openDialogSelectVess: false,
    openDialogSelectVessType: "",
    vesselList: [],
    loading: false,
    selectedVessId: [],
    selectedVesselRev: [],
    selectedVess: [],
    selectedVessForEdit: null,
    limit: 10,
    page: 0,
    totalCount: 0,
    tzList: [],
    noonReportTemplate: "",
    createVesselName: "",
    createVesselIMO: "",
    iniFilesData: {
      filenames: [],
      datas: {},
      vessId: ""
    },
    vesselDataForm: {
      vesselTime: {
        required: false,
        value: [null],
        name: "Vessel Time"
      },
      vesselTimeTZ: {
        required: false,
        value: [],
        name: "Vessel Timezone"
      },
      emailList: {
        required: false,
        value: [""],
        name: "Email List"
      },
      emailEnabled: {
        required: false,
        value: true,
        name: "Email Enabled"
      }
    },
    uploadData: {
      vesselProfileImg: null,
      vesselFiles: null
    },
    vesselFileList: [],
    expandedPanel: false
  };

  componentDidMount() {
    this.getVessels();
    const tzlist = listTimeZones(),
      tzConverted = [];
    const dateToday = new Date();
    const format = "D.M.YYYY HH:mm:ss [UTC]Z (z)";
    for (let i = 0; i < tzlist.length; i++) {
      const tz = tzlist[i];
      const output = formatToTimeZone(dateToday, format, {
        timeZone: tz
      }).split(" ");
      tzConverted.push({
        label: tz + " " + output[2],
        value: tz + " " + output[2]
      });
    }
    this.setState({
      tzList: tzConverted
    });
    vessInterval = setInterval(
      () => this.getVessels(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(vessInterval);
    clearInterval(vessFilesInterval);
  }

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedVessId;
    let oldSelectedVess = this.state.selectedVess;
    let oldSelectedVessRev = this.state.selectedVesselRev;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedVessId: this.state.vesselList.map(n => n.vessel_id),
          selectedVesselRev: this.state.vesselList.map(n => n.vessel_rev),
          selectedVess: this.state.vesselList.map(n => n)
        });
      } else {
        this.setState({
          selectedVessId: [],
          selectedVesselRev: [],
          selectedVess: []
        });
      }
    } else {
      const indxSel = this.state.selectedVessId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedVessId;
          let oldSelectedVess = this.state.selectedVess;
          let oldSelectedVessRev = this.state.selectedVesselRev;
          oldSelected.push(id);
          oldSelectedVessRev.push(
            this.state.vesselList
              .filter(n => {
                if (id === n.vessel_id) {
                  return n;
                }
                return false;
              })
              .map(obj => {
                return obj.vessel_rev;
              })[0]
          );
          oldSelectedVess.push(
            this.state.vesselList.filter(n => {
              if (id === n.vessel_id) {
                return n;
              }
              return false;
            })[0]
          );
          this.setState({
            selectedVessId: oldSelected,
            selectedVesselRev: oldSelectedVessRev,
            selectedVess: oldSelectedVess
          });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        oldSelectedVess.splice(indxSel, 1);
        oldSelectedVessRev.splice(indxSel, 1);
        this.setState({
          selectedVessId: oldSelected,
          selectedVesselRev: oldSelectedVessRev,
          selectedVess: oldSelectedVess
        });
      }
    }
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getVessels();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getVessels();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleClickOpen = type => {
    let stateCopy = Object.assign({}, this.state);

    if (type === "noonreporting") {
      this.getVesselReport();
      stateCopy.openDialogNR = true;
      this.setState(stateCopy);
      return;
    } else if (type === "noonreportingarc") {
      const lnk = `/admin/noonreportarchive/${this.state.selectedVessId}/${
        this.state.selectedVess[0].vessel_name
      }`;
      this.props.history.push(lnk);
      return;
    }
    let selectedVess = this.state.selectedVess[0];
    if (this.state.selectedVessForEdit) {
      for (let i = 0; i < this.state.selectedVess.length; i++) {
        if (
          this.state.selectedVess[i].vessel_id ===
          this.state.selectedVessForEdit
        ) {
          selectedVess = this.state.selectedVess[i];
        }
      }
    }

    let times = selectedVess.schedules.length > 0 ? [] : [null];
    let emails = selectedVess.emails.length > 0 ? selectedVess.emails : [""];
    let emailEnabled = selectedVess.mail_enable;
    let tz = selectedVess.schedules.length > 0 ? [] : [""];
    for (let i = 0; i < selectedVess.schedules.length; i++) {
      const sched = selectedVess.schedules[i].split(" ");
      const time = sched[0].split(":");
      times.push(new Date(1970, 0, 1, time[0], time[1], time[2]));
      tz.push(sched[1] + " " + sched[2]);
    }

    stateCopy.openDialog = true;
    stateCopy.vesselDataForm.vesselTime.value = times;
    stateCopy.vesselDataForm.vesselTimeTZ.value = tz;
    stateCopy.vesselDataForm.emailList.value = emails;
    stateCopy.vesselDataForm.emailEnabled.value = emailEnabled;
    this.setState(stateCopy);
  };

  handleClickOpenUploader = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.openDialogUpload = true;
    this.setState(stateCopy, this.getVesselFiles);

    vessFilesInterval = setInterval(
      () => this.getVesselFiles(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
  };

  handleClose = () => {
    this.setState(
      {
        openDialog: false,
        openDialogNR: false,
        openDialogUpload: false,
        openDialogSelectVess: false,
        openDialogCV: false,
        openDialogINI: false,
        selectedVessForEdit: null,
        selectedVessForEditType: null
      },
      () => {
        this.resetForm();
      }
    );
  };

  handleChangeField = (name, index) => event => {
    let stateCopy = Object.assign({}, this.state);
    if (name === "noonReportTemplate") {
      stateCopy.noonReportTemplate = event.target.value;
      this.setState(stateCopy);
      return;
    } else if (name === "createVesselName") {
      stateCopy.createVesselName = event.target.value;
      this.setState(stateCopy);
      return;
    } else if (name === "createVesselIMO") {
      stateCopy.createVesselIMO = event.target.value;
      this.setState(stateCopy);
      return;
    }
    let arrList = this.state.vesselDataForm[name].value;
    let val = event;
    if (name === "emailList") {
      val = event.target.value;
    } else if (name === "vesselTimeTZ") {
      if (event) {
        val = event.value;
      }
    }

    if (name === "emailEnabled") {
      val = event.target.checked;
      arrList = val;
    } else {
      arrList[index] = val;
    }

    stateCopy.vesselDataForm[name].value = arrList;
    this.setState(stateCopy);
  };

  getVesselReport = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/report";
    this.toggleLoading(true);

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: this.state.selectedVessForEdit || this.state.selectedVessId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        this.setState({
          noonReportTemplate: response.report_data
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getVessels = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels";
    this.toggleLoading(true);

    request(requestURL, {
      method: "GET",
      params: {
        limit: this.state.limit,
        page: parseInt(this.state.page, 10) + 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        this.setState({
          vesselList: response.rows,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  addNewTimeEmailList = type => {
    let arrList = this.state.vesselDataForm[type].value;
    if (type === "vesselTime") {
      arrList.push(null);
    } else {
      arrList.push("");
    }
    let stateCopy = Object.assign({}, this.state);
    stateCopy.vesselDataForm[type].value = arrList;
    this.setState(stateCopy);
  };

  removeEmailList = (type, indx) => {
    let arrList = this.state.vesselDataForm[type].value;
    // if (arrList.length === 1) {
    //   return;
    // }
    arrList.splice(indx, 1);
    let stateCopy = Object.assign({}, this.state);
    stateCopy.vesselDataForm[type].value = arrList;
    this.setState(stateCopy);
  };

  updateVessel = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/email/schedule/update";
    let timeFltr = [];
    for (
      let i = 0;
      i < this.state.vesselDataForm.vesselTime.value.length;
      i++
    ) {
      const tme = new Date(this.state.vesselDataForm.vesselTime.value[i]);
      const tzone = this.state.vesselDataForm.vesselTimeTZ.value[i];
      timeFltr.push(
        ("0" + tme.getHours()).slice(-2) +
          ":" +
          ("0" + tme.getMinutes()).slice(-2) +
          ":00 " +
          tzone
      );
    }
    const params = {
      emails: this.state.vesselDataForm.emailList.value,
      mail_enable: this.state.vesselDataForm.emailEnabled.value,
      schedules: timeFltr,
      vessel_ids: this.state.selectedVessId
    };
    let reqType = "PUT";
    const errors = general.validateForm(this.state.vesselDataForm);
    if (errors.length > 0) {
      errors.forEach(err => {
        this.props.enqueueSnackbar(err, { variant: "error" });
      });
      return;
    }
    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.getVessels();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  updateNoonReport = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/report/update";
    const params = {
      vessel_ids: this.state.selectedVessId,
      report_data: this.state.noonReportTemplate
    };
    let reqType = "PUT";
    if (this.state.noonReportTemplate.trim().length === 0) {
      this.props.enqueueSnackbar("Noon Report Template is empty", {
        variant: "error"
      });
      return;
    }
    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.getVessels();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  updateVesselState = (vessId, vessSt) => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/state/update";
    const params = {
      vessel_id: vessId,
      state: vessSt
    };
    let reqType = "PUT";

    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.getVessels();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  updateVesselStateDesc = vessSt => {
    if (vessSt.toLowerCase() === "green") {
      return "* Online";
    } else if (vessSt.toLowerCase() === "orange") {
      return "* More than 15 minutes offline";
    } else if (vessSt.toLowerCase() === "red") {
      return "* Offline  (more than 20 minutes)";
    } else if (vessSt.toLowerCase() === "white") {
      return "* To Be installed)";
    } else {
      return "";
    }
  };

  getVesselNumericState = vessSt => {
    if (vessSt.toLowerCase() === "green") {
      return "2";
    } else if (vessSt.toLowerCase() === "orange") {
      return "2";
    } else if (vessSt.toLowerCase() === "red") {
      return "2";
    } else if (vessSt.toLowerCase() === "white") {
      return "1";
    } else {
      return "1";
    }
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.vesselDataForm.emailList.value = [];
    stateCopy.vesselDataForm.emailEnabled.value = false;
    stateCopy.vesselDataForm.vesselTime.value = [null];
    stateCopy.selectedVessId = [];
    stateCopy.selectedVess = [];
    stateCopy.noonReportTemplate = "";
    this.setState(stateCopy, () => {
      this.getVessels();
    });
  };

  vesselImgChangedHandler = event => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.uploadData.vesselProfileImg = event.target.files[0];
    this.setState(stateCopy);
  };

  vesselFilesChangedHandler = event => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.uploadData.vesselFiles = event.target.files;
    this.setState(stateCopy);
  };

  vesselImgUploadHandler = () => {
    const data = new FormData();
    // If file selected
    if (this.state.uploadData.vesselProfileImg) {
      data.append("upfile", this.state.uploadData.vesselProfileImg);

      const requestURL = process.env.REACT_APP_API_URL + "/vessels/image";

      request(
        requestURL,
        {
          method: "POST",
          params: {
            vessel_id: this.state.selectedVessId
          },
          body: data
        },
        false
      )
        .then(response => {
          if (!this.props.handleRequest(response)) return;
          this.props.enqueueSnackbar("Success! Vessel image uploaded.", {
            variant: "success"
          });
          let stateCopy = Object.assign({}, this.state);
          stateCopy.uploadData.vesselProfileImg = null;
          this.setState(stateCopy);
          this.getVesselFiles();
        })
        .catch(() => {
          this.props.handleRequest(false);
        });
    } else {
      this.props.enqueueSnackbar("Please select image file to upload.", {
        variant: "warning"
      });
    }
  };

  vesselFilesUploadHandler = () => {
    const data = new FormData();
    // If file selected
    if (this.state.uploadData.vesselFiles) {
      for (let i = 0; i < this.state.uploadData.vesselFiles.length; i++) {
        data.append("upfile", this.state.uploadData.vesselFiles[i]);
      }

      const requestURL = process.env.REACT_APP_API_URL + "/vessels/file";

      request(
        requestURL,
        {
          method: "POST",
          params: {
            vessel_id: this.state.selectedVessId
          },
          body: data
        },
        false
      )
        .then(response => {
          if (!this.props.handleRequest(response)) return;
          this.props.enqueueSnackbar("Success! Vessel files uploaded.", {
            variant: "success"
          });
          let stateCopy = Object.assign({}, this.state);
          stateCopy.uploadData.vesselFiles = null;
          this.setState(stateCopy);

          this.getVesselFiles();
        })
        .catch(() => {
          this.props.handleRequest(false);
        });
    } else {
      this.props.enqueueSnackbar("Please select files to upload.", {
        variant: "warning"
      });
    }
  };

  deleteVesselProf = vessId => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/image/delete";
    const params = {
      vessel_ids: [vessId]
    };
    let reqType = "DELETE";

    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.props.enqueueSnackbar("Success! Image deleted.", {
          variant: "success"
        });

        this.handleClose();
        this.getVessels();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  deleteVesselFiles = fileName => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/file/delete";
    const params = {
      vessel_id: this.state.selectedVessId[0],
      vessel_files: [fileName]
    };
    let reqType = "DELETE";

    request(
      requestURL,
      {
        method: reqType,
        body: params
      },
      true
    )
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar("Success! " + fileName + " deleted.", {
          variant: "success"
        });
        this.getVesselFiles();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getVesselFiles = () => {
    if (!this.state.openDialogUpload) {
      return false;
    }
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/file/list";
    let reqType = "GET";

    request(
      requestURL,
      {
        params: {
          vessel_id: this.state.selectedVessId
        },
        method: reqType
      },
      true
    )
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.setState({
          vesselFileList: response
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  deleteVessel = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/delete";
    const vessInfo = [];
    for (let i = 0; i < this.state.selectedVessId.length; i++) {
      const vessid = this.state.selectedVessId[i];
      const vessrev = this.state.selectedVesselRev[i];
      vessInfo.push({
        vessel_id: vessid,
        vessel_rev: vessrev
      });
    }
    const params = {
      vessel_info: vessInfo
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          selectedVessId: []
        });
        this.getVessels();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  createVessel = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/create";
    const params = {
      imo: this.state.createVesselIMO,
      vessel_name: this.state.createVesselName
    };
    const errors = general.validateForm({
      createVesselIMO: {
        required: true,
        value: this.state.createVesselIMO,
        name: "Vessel IMO"
      },
      createVesselName: {
        required: true,
        value: this.state.createVesselName,
        name: "Vessel Name"
      }
    });
    if (errors.length > 0) {
      errors.forEach(err => {
        this.props.enqueueSnackbar(err, { variant: "error" });
      });
      return;
    }
    request(requestURL, { method: "POST", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          createVesselIMO: "",
          createVesselName: "",
          openDialogCV: false
        });
        this.getVessels();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getINIFiles = vessId => {
    const requestURL = process.env.REACT_APP_API_URL + "/ini/files";

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.iniFilesData.filenames = response.filenames;
        stateCopy.iniFilesData.datas = response.datas;
        stateCopy.iniFilesData.vessId = vessId;
        this.setState(stateCopy);
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleChangeFieldINIFiles = filename => event => {
    const val = event.target.value;
    let stateCopy = Object.assign({}, this.state);
    stateCopy.iniFilesData.datas[filename] = val;
    this.setState(stateCopy);
  };

  updateINIFiles = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/update/ini/files";

    request(requestURL, {
      method: "PUT",
      body: {
        datas: this.state.iniFilesData.datas,
        vessel_id: this.state.iniFilesData.vessId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar(response.message, { variant: "success" });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handlePanelChange = panel => (event, isExpanded) => {
    this.setState({
      expandedPanel: isExpanded ? panel : false
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray" className={classes.CardHeaderIcon}>
                <h4 className={classes.cardTitleWhite}>Vessel List</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" padding="checkbox">
                          {/* <Checkbox
                            onChange={this.handleCheck('all')}
                            value={'all'}
                            checked={(this.state.vesselList.length > 0 && 
                                this.state.selectedVessId.length === this.state.vesselList.length)}
                        /> */}
                        </TableCell>
                        <TableCell align="left">IMO</TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Schedules</TableCell>
                        <TableCell align="left">Email Enabled</TableCell>
                        <TableCell align="left">Vessel State</TableCell>
                        <TableCell align="left">Vessel Image</TableCell>
                        {auth.getUserInfo().superadmin && (
                          <TableCell align="left">Actions</TableCell>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="7" align="center">
                            <div className={classes.centerAlign}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.vesselList.map(row => (
                          <TableRow
                            key={row.vessel_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedVessId.indexOf(row.vessel_id) >
                              -1
                            }
                            selected={
                              this.state.selectedVessId.indexOf(row.vessel_id) >
                              -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.vessel_id)}
                                value={row.id}
                                checked={
                                  this.state.selectedVessId.indexOf(
                                    row.vessel_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            <TableCell align="left">
                              {row.vessel_number}
                            </TableCell>
                            <TableCell align="left">
                              {row.vessel_name}
                            </TableCell>
                            {row.schedules && (
                              <TableCell align="left">
                                {row.schedules.join(", ")}
                              </TableCell>
                            )}
                            {(row.schedules === null ||
                              row.schedules === "") && (
                              <TableCell align="left">None</TableCell>
                            )}
                            <TableCell align="left">
                              {general.capitalizeFirstLetter(
                                row.mail_enable.toString()
                              )}
                            </TableCell>
                            {/* <TableCell align="left">{row.update_state}</TableCell> */}
                            <TableCell align="left">
                              <FormControl className={classes.formControl}>
                                <NativeSelect
                                  value={this.getVesselNumericState(
                                    row.update_state
                                  )}
                                  onChange={event => {
                                    const val = event.target.value;
                                    this.props.openAlertDialog(
                                      "Attention!",
                                      `You are about to change the vessel state, are you sure about that?`,
                                      () =>
                                        this.updateVesselState(
                                          row.vessel_id,
                                          val
                                        ),
                                      this.state.alertDialog.withCancelBtn
                                    );
                                  }}
                                  name="vesselState"
                                  className={classes.selectEmpty}
                                >
                                  <option value="1">To be installed</option>
                                  <option value="2">Installed on vessel</option>
                                  {/* <option value='Red'>Red</option>
                                                            <option value='Orange'>Orange</option>
                                                            <option value='Green'>Green</option>
                                                            <option value='White'>White</option> */}
                                </NativeSelect>
                                {/* <FormHelperText>{this.updateVesselStateDesc(row.update_state || 'red')}</FormHelperText> */}
                              </FormControl>
                            </TableCell>
                            <TableCell
                              align="left"
                              className={classes.relativePos}
                            >
                              {row.image_url ? (
                                <React.Fragment>
                                  <img
                                    alt="vessel name"
                                    src={row.image_url}
                                    className={classes.vesselThumb}
                                  />
                                  <MaterialTooltip title="Delete Vessel Image">
                                    <DeleteForeverOutlinedIcon
                                      className={classes.deleteProf}
                                      onClick={() => {
                                        this.props.openAlertDialog(
                                          "Attention!",
                                          `You are about to delete the vessel profile image, are you sure about that?`,
                                          () =>
                                            this.deleteVesselProf(
                                              row.vessel_id
                                            ),
                                          this.state.alertDialog.withCancelBtn
                                        );
                                      }}
                                    />
                                  </MaterialTooltip>
                                </React.Fragment>
                              ) : (
                                <p>No image available</p>
                              )}
                            </TableCell>
                            {auth.getUserInfo().superadmin && (
                              <TableCell>
                                <Tooltip title="Download Vessel VPN">
                                  <IconButton
                                    onClick={() =>
                                      window.open(
                                        process.env.REACT_APP_API_URL +
                                          "/" +
                                          row.vpn_url
                                      )
                                    }
                                    aria-label="Vessel VPN"
                                    className={classes.margin}
                                    size="small"
                                    disabled={
                                      row.vpn_url === undefined ||
                                      row.vpn_url === ""
                                    }
                                  >
                                    <DirectionsBoat fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit INI Files">
                                  <IconButton
                                    onClick={() => {
                                      this.setState(
                                        {
                                          openDialogINI: true
                                        },
                                        () => {
                                          this.getINIFiles(row.vessel_id);
                                        }
                                      );
                                    }}
                                    aria-label="INI Files"
                                    className={classes.margin}
                                    size="small"
                                    disabled={
                                      row.vessel_id === undefined ||
                                      row.vessel_id === ""
                                    }
                                  >
                                    <DescriptionIcon fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.vesselList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="5" align="justify">
                              No available data
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </Paper>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={this.state.totalCount}
                  rowsPerPage={this.state.limit}
                  page={this.state.page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page"
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page"
                  }}
                  labelDisplayedRows={this.displayedRows}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
                <Button
                  variant="contained"
                  onClick={() => this.setState({ openDialogCV: true })}
                  color="info"
                >
                  Create Vessel
                </Button>
                <Button
                  variant="contained"
                  disabled={this.state.selectedVessId.length === 0}
                  onClick={() => {
                    this.props.openAlertDialog(
                      "Attention!",
                      `You are about to DELETE a vessel, are you sure about that?`,
                      () => this.deleteVessel(),
                      this.state.alertDialog.withCancelBtn
                    );
                  }}
                  color="info"
                >
                  DELETE
                </Button>
                <Button
                  disabled={this.state.selectedVessId.length === 0}
                  onClick={() => {
                    if (this.state.selectedVessId.length > 1) {
                      this.setState({
                        openDialogSelectVess: true,
                        openDialogSelectVessType: "update"
                      });
                    } else {
                      this.handleClickOpen("update");
                    }
                  }}
                  color="info"
                >
                  Edit Noon Report Email Settings
                </Button>
                <Button
                  disabled={this.state.selectedVessId.length === 0}
                  onClick={() => {
                    if (this.state.selectedVessId.length > 1) {
                      this.setState({
                        openDialogSelectVess: true,
                        openDialogSelectVessType: "noonreporting"
                      });
                    } else {
                      this.handleClickOpen("noonreporting");
                    }
                  }}
                  color="info"
                >
                  Edit Noon Report Template
                </Button>
                <Button
                  variant="contained"
                  disabled={
                    this.state.selectedVessId.length === 0 ||
                    this.state.selectedVessId.length > 1
                  }
                  onClick={() => this.handleClickOpen("noonreportingarc")}
                  color="info"
                >
                  View Noon Report Archive
                </Button>
                <Button
                  variant="contained"
                  disabled={
                    this.state.selectedVessId.length === 0 ||
                    this.state.selectedVessId.length > 1
                  }
                  onClick={() => this.handleClickOpenUploader()}
                  color="info"
                >
                  Upload/View Vessel Files
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          fullWidth={false}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialogCV}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Create Vessel</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Vessel Name"
                    value={this.state.createVesselName}
                    type="text"
                    onChange={this.handleChangeField("createVesselName")}
                    className={classNames(classes.margin, classes.textField)}
                  />
                </FormControl>
              </GridItem>
              <GridItem xs={12} sm={12} md={12}>
                <FormControl required fullWidth>
                  <TextField
                    label="Vessel IMO"
                    value={this.state.createVesselIMO}
                    type="text"
                    onChange={this.handleChangeField("createVesselIMO")}
                    className={classNames(classes.margin, classes.textField)}
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.createVessel} color="info">
              Create Vessel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialogSelectVess}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Select Vessel to use as template
          </DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <FormControl required fullWidth>
                  <Select
                    labelId="select-vessel-dropdown"
                    id="select-vessel-dropdown"
                    value={this.state.selectedVessForEdit}
                    onChange={evnt => {
                      this.setState(
                        {
                          selectedVessForEdit: evnt.target.value,
                          openDialogSelectVess: false
                        },
                        () => {
                          this.handleClickOpen(
                            this.state.openDialogSelectVessType
                          );
                        }
                      );
                    }}
                  >
                    {this.state.selectedVess &&
                      this.state.selectedVess.map(vess => {
                        return (
                          <MenuItem key={vess.vessel_id} value={vess.vessel_id}>
                            {vess.vessel_name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </FormControl>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialogNR}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Update Noon Report Template
          </DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <FormControl required fullWidth>
                  <TextField
                    id="standard-multiline-flexible"
                    label=""
                    multiline
                    rows="20"
                    rowsMax="20"
                    value={this.state.noonReportTemplate}
                    onChange={this.handleChangeField("noonReportTemplate")}
                    className={classes.textField}
                    InputProps={{
                      classes: {
                        input: classes.noonReportForm
                      }
                    }}
                    margin="none"
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.updateNoonReport} color="info">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Update Noon Report Email Settings
          </DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.vesselDataForm.emailEnabled.value}
                      onChange={this.handleChangeField("emailEnabled")}
                      value="emailEnabled"
                      color="primary"
                    />
                  }
                  label="Enable Emailing"
                />
              </GridItem>
              <GridItem xs={12} sm={12} md={4}>
                {this.state.vesselDataForm.emailList.value.map(
                  (emailAdd, index) => (
                    <FormControl margin="normal" required fullWidth key={index}>
                      <TextField
                        label={`Email Address ${index + 1}`}
                        value={emailAdd}
                        type="text"
                        id={`vesselEmail${index}`}
                        onChange={this.handleChangeField("emailList", index)}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="Remove email"
                                onClick={() =>
                                  this.removeEmailList("emailList", index)
                                }
                              >
                                <Clear />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </FormControl>
                  )
                )}
                <IconButton
                  onClick={() => this.addNewTimeEmailList("emailList")}
                  className={classes.actionButtons}
                  color="secondary"
                  aria-label="Add"
                >
                  <AddCircle />
                </IconButton>
              </GridItem>
              <GridItem
                xs={12}
                sm={12}
                md={8}
                style={{ borderLeft: "2px solid rgba(0, 0, 0, 0.12)" }}
              >
                <GridContainer>
                  <GridItem xs={12} sm={12} md={5}>
                    {this.state.vesselDataForm.vesselTime.value.map(
                      (time, index) => (
                        <MuiPickersUtilsProvider
                          utils={MomentUtils}
                          key={index}
                        >
                          <TimePicker
                            fullWidth
                            margin="normal"
                            clearable
                            label={`Time Schedule ${index + 1}`}
                            ampm={false}
                            value={time}
                            onChange={this.handleChangeField(
                              "vesselTime",
                              index
                            )}
                          />
                        </MuiPickersUtilsProvider>
                      )
                    )}
                  </GridItem>
                  <GridItem xs={12} sm={12} md={6}>
                    {this.state.vesselDataForm.vesselTimeTZ.value.map(
                      (tz, index) => (
                        <div className={classes.fullWidth} key={index}>
                          <SelectDropdown
                            isValidNewOption={() => false}
                            suggestions={this.state.tzList}
                            value={{
                              label: tz,
                              value: tz
                            }}
                            handleChange={this.handleChangeField(
                              "vesselTimeTZ",
                              index
                            )}
                            placeholder="Timezone"
                          />
                          <IconButton
                            className={classes.removeBtn}
                            onClick={() => {
                              this.removeEmailList("vesselTime", index);
                              this.removeEmailList("vesselTimeTZ", index);
                            }}
                          >
                            <Clear />
                          </IconButton>
                        </div>
                      )
                    )}
                  </GridItem>
                  <div className={classes.fullWidth}>
                    <IconButton
                      onClick={() => {
                        this.addNewTimeEmailList("vesselTime");
                        this.addNewTimeEmailList("vesselTimeTZ");
                      }}
                      className={classes.actionButtons}
                      color="secondary"
                      aria-label="Add"
                    >
                      <AddCircle />
                    </IconButton>
                  </div>
                </GridContainer>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.updateVessel} color="info">
              Update
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialogUpload}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Upload Vessel Files</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                <div
                  className="card border-light mb-3 mt-5"
                  style={{ boxShadow: "0 5px 10px 2px rgba(195,192,192,.5)" }}
                >
                  <div className="card-header">
                    <h3 style={{ color: "#555", marginLeft: "12px" }}>
                      Vessel Image Upload
                    </h3>
                    <p className="text-muted" style={{ marginLeft: "12px" }}>
                      Upload Size: 250px x 250px ( Max 2MB )
                    </p>
                  </div>
                  <div className="card-body">
                    <GridContainer>
                      <GridItem xs={12} sm={12} md={6}>
                        <p className="card-text">
                          Please select only image file
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={this.vesselImgChangedHandler}
                        />
                      </GridItem>
                      <GridItem xs={12} sm={12} md={6}>
                        {this.state.vesselFileList.vessel_images &&
                          this.state.vesselFileList.vessel_images.length >
                            0 && (
                            <React.Fragment>
                              <p className="card-text">
                                Current Uploaded Picture:
                              </p>
                              <img
                                alt="vessel name"
                                src={
                                  this.state.vesselFileList.vessel_images[0]
                                    .image_url
                                }
                                className={classes.vesselThumb2}
                              />
                            </React.Fragment>
                          )}
                      </GridItem>
                    </GridContainer>
                    <div className="mt-3">
                      <button
                        className="btn btn-info"
                        onClick={this.vesselImgUploadHandler}
                      >
                        Upload!
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  className="card border-light mb-3 mt-5"
                  style={{ boxShadow: "0 5px 10px 2px rgba(195,192,192,.5)" }}
                >
                  <div className="card-header">
                    <h3 style={{ color: "#555", marginLeft: "12px" }}>
                      Vessel Files Upload
                    </h3>
                    {/* <p className="text-muted" style={{ marginLeft: "12px" }}>
                      Upload Size: 250px x 250px ( Max 2MB )
                    </p> */}
                  </div>
                  <div className="card-body">
                    <p className="card-text">You can upload multiple files</p>
                    <input
                      type="file"
                      multiple
                      onChange={this.vesselFilesChangedHandler}
                    />
                    <div className="mt-3">
                      <button
                        className="btn btn-info"
                        onClick={this.vesselFilesUploadHandler}
                      >
                        Upload!
                      </button>
                    </div>
                    <div>
                      <p className={classes.uploadFileTxt}>Uploaded Files:</p>
                      <List dense={true}>
                        {this.state.vesselFileList.vessel_files &&
                          this.state.vesselFileList.vessel_files.length > 0 &&
                          this.state.vesselFileList.vessel_files.map(file => {
                            return (
                              <ListItem
                                key={file.vessel_id + file.vessel_file_id}
                              >
                                <ListItemIcon>
                                  <FileCopyIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={file.file_name}
                                  // secondary={secondary ? "Secondary text" : null}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    onClick={() => {
                                      this.props.openAlertDialog(
                                        "Attention!",
                                        `You are about to delete ${
                                          file.file_name
                                        }, are you sure about that?`,
                                        () =>
                                          this.deleteVesselFiles(
                                            file.file_name
                                          ),
                                        this.state.alertDialog.withCancelBtn
                                      );
                                    }}
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                  <a
                                    href={file.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <IconButton
                                      edge="end"
                                      aria-label="download"
                                    >
                                      <GetAppIcon />
                                    </IconButton>
                                  </a>
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                      </List>
                    </div>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialogINI}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update INI Files</DialogTitle>
          <DialogContent>
            <GridContainer>
              <GridItem xs={12} sm={12} md={12}>
                {this.state.iniFilesData.filenames.map(filename => {
                  return (
                    <ExpansionPanel
                      expanded={
                        this.state.expandedPanel === `${filename}-panel`
                      }
                      onChange={this.handlePanelChange(`${filename}-panel`)}
                      key={filename}
                    >
                      <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={`panel${filename}bh-content`}
                        id={`panel${filename}bh-header`}
                      >
                        <Typography className={classes.heading}>
                          {filename}
                        </Typography>
                      </ExpansionPanelSummary>
                      <ExpansionPanelDetails>
                        <FormControl required fullWidth>
                          <TextField
                            id="standard-multiline-flexible"
                            label=""
                            multiline
                            rows="20"
                            rowsMax="20"
                            value={this.state.iniFilesData.datas[filename]}
                            onChange={this.handleChangeFieldINIFiles(filename)}
                            className={classes.textField}
                            InputProps={{
                              classes: {
                                input: classes.noonReportForm
                              }
                            }}
                            margin="none"
                          />
                        </FormControl>
                      </ExpansionPanelDetails>
                    </ExpansionPanel>
                  );
                })}
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.updateINIFiles} color="info">
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Vessels.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  openAlertDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(Vessels));
