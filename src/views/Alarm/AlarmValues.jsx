import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SelectDropdown from "components/AutoComplete/SelectDropdown.jsx";
import SelectDropdownOnly from "components/AutoComplete/SelectDropdownOnly.jsx";

// helpers
import request from "utils/request";
import general from "variables/general";

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
  formControlMargin: {
    marginTop: "5px",
    marginBottom: "25px"
  },
  noPadding: {
    paddingTop: "0 !important",
    "margin-top": "0 !important",
    "margin-bottom": "0 !important"
  }
});

let alrmInterval = null,
  alrmDataInterval = null;
class AlarmValues extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    alarmValueList: [],
    selectedalarmValueId: [],
    dialogType: "create",
    alarmValueDataList: {
      deviceTypes: [],
      devices: [],
      modules: [],
      options: [],
      vessels: []
    },
    alarmValueDataForm: {
      name: {
        required: true,
        value: "",
        name: "Name"
      },
      vessel: {
        required: false,
        value: [],
        value2: [],
        defValue: [],
        name: "Vessel"
      },
      device: {
        required: false,
        value: [],
        value2: [],
        defValue: [],
        name: "Device"
      },
      deviceType: {
        required: false,
        value: [],
        value2: [],
        defValue: [],
        name: "Device Type"
      },
      module: {
        required: false,
        value: [],
        value2: [],
        defValue: [],
        name: "Module"
      },
      option: {
        required: true,
        value: [],
        value2: [],
        defValue: [],
        name: "Option"
      },
      value: {
        required: true,
        value: "",
        defValue: [],
        name: "Value"
      }
    },
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getAlarmValues();
    this.getAlarmValueData();
    alrmInterval = setInterval(
      () => this.getAlarmValues(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    alrmDataInterval = setInterval(
      () => this.getAlarmValueData(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(alrmInterval);
    clearInterval(alrmDataInterval);
  }

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getAlarmValues();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getAlarmValues();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  getAlarmValueData = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/value/data";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);
        this.setState({
          alarmValueDataList: {
            deviceTypes: response.device_types,
            devices: response.devices,
            modules: response.modules,
            options: response.options,
            vessels: response.vessels
          }
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getAlarmValues = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/value/index";
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
          alarmValueList: response.data,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  deleteAlarmValue = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/value/delete";
    const params = {
      alarm_value_ids: this.state.selectedalarmValueId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.setState({
          selectedalarmValueId: []
        });
        this.getAlarmValues();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleClickOpen = type => () => {
    this.setState(
      {
        dialogType: type,
        openDialog: true
      },
      () => {
        if (type === "update") {
          let obj = this.state.alarmValueList.find(
            o => o.alarm_value_id === this.state.selectedalarmValueId[0]
          );

          let createDefVal = (arr, arr2) => {
            let newArr = [];
            arr.forEach((el, indx) => {
              if (el !== "") {
                if (arr2) {
                  newArr.push({
                    value: arr2[indx],
                    label: el
                  });
                } else {
                  newArr.push({
                    value: el,
                    label: el
                  });
                }
              }
            });
            return newArr;
          };

          let stateCopy = Object.assign({}, this.state);
          stateCopy.alarmValueDataForm.name.value = obj.name;
          stateCopy.alarmValueDataForm.vessel.value = obj.vessel_name.split(
            ","
          );
          stateCopy.alarmValueDataForm.vessel.value2 = obj.vessel.split(",");
          stateCopy.alarmValueDataForm.vessel.defValue = createDefVal(
            obj.vessel_name.split(","),
            obj.vessel.split(",")
          );
          stateCopy.alarmValueDataForm.device.value = obj.device.split(",");
          stateCopy.alarmValueDataForm.device.defValue = createDefVal(
            obj.device.split(",")
          );
          stateCopy.alarmValueDataForm.deviceType.value = obj.device_type.split(
            ","
          );
          stateCopy.alarmValueDataForm.deviceType.defValue = createDefVal(
            obj.device_type.split(",")
          );
          stateCopy.alarmValueDataForm.module.value = obj.module.split(",");
          stateCopy.alarmValueDataForm.module.defValue = createDefVal(
            obj.module.split(",")
          );
          stateCopy.alarmValueDataForm.option.value = obj.option.split(",");
          stateCopy.alarmValueDataForm.option.defValue = createDefVal(
            obj.option.split(",")
          );
          stateCopy.alarmValueDataForm.value.value = obj.value.split(",");
          stateCopy.alarmValueDataForm.value.defValue = createDefVal(
            obj.value.split(",")
          );
          this.setState(stateCopy);
        }
      }
    );
  };

  handleClose = () => {
    this.setState(
      {
        openDialog: false
      },
      () => {
        this.resetForm();
        this.getAlarmValues();
        this.getAlarmValueData();
      }
    );
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedalarmValueId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedalarmValueId: this.state.alarmValueList.map(
            n => n.alarm_value_id
          )
        });
      } else {
        this.setState({ selectedalarmValueId: [] });
      }
    } else {
      const indxSel = this.state.selectedalarmValueId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedalarmValueId;
          oldSelected.push(id);
          this.setState({ selectedalarmValueId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedalarmValueId: oldSelected });
      }
    }
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.alarmValueDataForm.vessel.value = [];
    stateCopy.alarmValueDataForm.vessel.value2 = [];
    stateCopy.alarmValueDataForm.vessel.defValue = [];
    stateCopy.alarmValueDataForm.device.value = [];
    stateCopy.alarmValueDataForm.device.value2 = [];
    stateCopy.alarmValueDataForm.device.defValue = [];
    stateCopy.alarmValueDataForm.deviceType.value = [];
    stateCopy.alarmValueDataForm.deviceType.value2 = [];
    stateCopy.alarmValueDataForm.deviceType.defValue = [];
    stateCopy.alarmValueDataForm.module.value = [];
    stateCopy.alarmValueDataForm.module.value2 = [];
    stateCopy.alarmValueDataForm.module.defValue = [];
    stateCopy.alarmValueDataForm.option.value = [];
    stateCopy.alarmValueDataForm.option.value2 = [];
    stateCopy.alarmValueDataForm.option.defValue = [];
    stateCopy.alarmValueDataForm.value.value = [];
    stateCopy.alarmValueDataForm.name.value = "";
    stateCopy.selectedalarmValueId = [];
    this.setState(stateCopy);
  };

  handleTextChangeDialog = name => e => {
    let stateCopy = Object.assign({}, this.state);
    if (
      name === "vessel" ||
      name === "device" ||
      name === "deviceType" ||
      name === "module" ||
      name === "option" ||
      name === "value"
    ) {
      const id = [];
      const name2 = [];
      e.forEach(el => {
        id.push(el.value);
        name2.push(el.label);
      });
      stateCopy.alarmValueDataForm[name].value = name2;
      stateCopy.alarmValueDataForm[name].value2 = id;
      this.setState(stateCopy);
    } else {
      stateCopy.alarmValueDataForm[e.target.name].value = e.target.value;
      this.setState(stateCopy);
    }
  };

  createAlarmValues = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/alarm/value/" + this.state.dialogType;
    const params = {
      device: this.state.alarmValueDataForm.device.value.join(),
      device_type: this.state.alarmValueDataForm.deviceType.value.join(),
      module: this.state.alarmValueDataForm.module.value.join(),
      name: this.state.alarmValueDataForm.name.value,
      value: this.state.alarmValueDataForm.value.value.join(),
      option: this.state.alarmValueDataForm.option.value.join(),
      vessel: this.state.alarmValueDataForm.vessel.value2.join()
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.alarm_value_id = this.state.selectedalarmValueId[0];
    }
    const errors = general.validateForm(this.state.alarmValueDataForm);
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
        this.getAlarmValues();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
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
                <h4 className={classes.cardTitleWhite}>Alarm Values</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.alarmValueList.length > 0 &&
                          this.state.selectedalarmValueId.length ===
                            this.state.alarmValueList.length
                        }
                        selected={
                          this.state.alarmValueList.length > 0 &&
                          this.state.selectedalarmValueId.length ===
                            this.state.alarmValueList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.alarmValueList.length > 0 &&
                              this.state.selectedalarmValueId.length ===
                                this.state.alarmValueList.length
                            }
                          />
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Vessel</TableCell>
                        <TableCell align="left">Device</TableCell>
                        <TableCell align="left">Module</TableCell>
                        <TableCell align="left">Option</TableCell>
                        <TableCell align="left">Value</TableCell>
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
                        this.state.alarmValueList.map(row => (
                          <TableRow
                            key={row.alarm_value_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedalarmValueId.indexOf(
                                row.alarm_value_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedalarmValueId.indexOf(
                                row.alarm_value_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.alarm_value_id)}
                                value={row.id}
                                checked={
                                  this.state.selectedalarmValueId.indexOf(
                                    row.alarm_value_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">
                              {row.vessel_name}
                            </TableCell>
                            <TableCell align="left">{row.device}</TableCell>
                            <TableCell align="left">{row.module}</TableCell>
                            <TableCell align="left">{row.option}</TableCell>
                            <TableCell align="left">{row.value}</TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.alarmValueList.length === 0 && (
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

                <Button onClick={this.handleClickOpen("create")} color="info">
                  Create
                </Button>
                <Button
                  disabled={
                    this.state.selectedalarmValueId.length === 0 ||
                    this.state.selectedalarmValueId.length > 1
                  }
                  onClick={this.handleClickOpen("update")}
                  color="info"
                >
                  Edit
                </Button>
                <Button
                  disabled={this.state.selectedalarmValueId.length === 0}
                  onClick={this.deleteAlarmValue}
                  color="info"
                >
                  Delete
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.dialogType === "create" && "Create "}
            {this.state.dialogType === "update" && "Update "}
            Alarm Values
          </DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={this.createAlarmValues}>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <TextField
                  required={true}
                  value={this.state.alarmValueDataForm.name.value}
                  label="Name"
                  id="alarmValueName"
                  name="name"
                  onChange={this.handleTextChangeDialog("name")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>

              <Typography variant="caption" display="block" gutterBottom>
                Leave empty to enable for all vessels.
              </Typography>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdownOnly
                  customId="vesselName"
                  suggestions={this.state.alarmValueDataList.vessels}
                  handleChange={this.handleTextChangeDialog("vessel")}
                  placeholder="Vessel"
                  createOptionPosition="first"
                  isMulti={true}
                  padding={classes.noPadding}
                  defaultValue={this.state.alarmValueDataForm.vessel.defValue}
                />
              </FormControl>
              <br />

              <Typography variant="caption" display="block" gutterBottom>
                Leave empty to enable for all devices. Use VSAT% for all VSATs.
                Typing ‘VSAT1’, only checks for values of VSAT1
              </Typography>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                {/* <ReactSelect
                                    isMulti
                                    defaultValue={this.state.alarmValueDataForm.device.value}
                                    options={this.state.alarmValueDataList.devices}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                    placeholder="Device"
                                    onChange={this.handleTextChangeDialog('device')}
                                /> */}
                <SelectDropdown
                  customId="deviceName"
                  suggestions={this.state.alarmValueDataList.devices}
                  handleChange={this.handleTextChangeDialog("device")}
                  placeholder="Device"
                  createOptionPosition="first"
                  isMulti={true}
                  padding={classes.noPadding}
                  defaultValue={this.state.alarmValueDataForm.device.defValue}
                />
              </FormControl>
              <br />

              <Typography variant="caption" display="block" gutterBottom>
                Leave empty to enable for every device-types. Typing
                {"'Intellian_V%'"}, only checks for all intellian VSAT’s of the
                V90, V100, V110, …
              </Typography>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdown
                  customId="deviceType"
                  suggestions={this.state.alarmValueDataList.deviceTypes}
                  handleChange={this.handleTextChangeDialog("deviceType")}
                  placeholder="Device Type"
                  createOptionPosition="first"
                  isMulti={true}
                  padding={classes.noPadding}
                  defaultValue={
                    this.state.alarmValueDataForm.deviceType.defValue
                  }
                />
              </FormControl>
              <br />

              <Typography variant="caption" display="block" gutterBottom>
                Give module,
                <ul>
                  <li>If empty : General module is used</li>
                  <li>If {"'%'"} : all modules are used</li>
                  <li>
                    If {"'port%'"} : all modules starting with {"'port'"} are
                    used
                  </li>
                  <li>If ModuleName : {"'ModuleName'"} is used</li>
                </ul>
              </Typography>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdown
                  customId="moduleName"
                  suggestions={this.state.alarmValueDataList.modules}
                  handleChange={this.handleTextChangeDialog("module")}
                  placeholder="Module"
                  createOptionPosition="first"
                  isMulti={true}
                  padding={classes.noPadding}
                  defaultValue={this.state.alarmValueDataForm.module.defValue}
                />
              </FormControl>
              <br />

              <Typography variant="caption" display="block" gutterBottom>
                Give option,
                <ul>
                  <li>If txLock : {"'txLock'"} is used</li>
                  <li>
                    If {"'beam%'"} : all options starting with {"'beam'"} are
                    used
                  </li>
                  <li>If {"'%'"} : all options are used</li>
                  <li>If empty : Invalid, nothing will be found</li>
                </ul>
              </Typography>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdown
                  customId="optionName"
                  suggestions={this.state.alarmValueDataList.options}
                  handleChange={this.handleTextChangeDialog("option")}
                  placeholder="Option"
                  createOptionPosition="first"
                  isMulti={true}
                  padding={classes.noPadding}
                  defaultValue={this.state.alarmValueDataForm.option.defValue}
                />
              </FormControl>
              <br />

              <Typography variant="caption" display="block" gutterBottom>
                Choose out of the list:
              </Typography>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdown
                  suggestions={[
                    {
                      label: "Raw Value",
                      value: "Raw Value"
                    }
                  ]}
                  customId="valueName"
                  handleChange={this.handleTextChangeDialog("value")}
                  placeholder="Value"
                  createOptionPosition="first"
                  isMulti={true}
                  padding={classes.noPadding}
                  defaultValue={this.state.alarmValueDataForm.value.defValue}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.createAlarmValues} color="info">
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlarmValues.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(AlarmValues));
