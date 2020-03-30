import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import BugReport from "@material-ui/icons/BugReport"; //debug
import Notifications from "@material-ui/icons/Notifications"; //alert
import Warning from "@material-ui/icons/Warning"; //warning
import Info from "@material-ui/icons/Info"; //info
import Whatshot from "@material-ui/icons/Whatshot"; //critical
import Button from "@material-ui/core/Button";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button2 from "components/CustomButtons/Button.jsx";
import SelectDropdownOnly from "components/AutoComplete/SelectDropdownOnly.jsx";

// helpers
import request from "utils/request";
import general from "variables/general";
import colors from "variables/colors";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  button: {
    margin: theme.spacing.unit
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
  tableIcons: {
    margin: "0 0 0 2px",
    verticalAlign: "bottom"
  },
  colorCritical: {
    color: colors.RED
  },
  colorInfo: {
    color: colors.BLUECYAN
  },
  colorAlert: {
    color: colors.BLUE
  },
  colorWarning: {
    color: colors.YELLOW
  },
  colorDebug: {
    color: colors.GREY
  },
  iconSmall: {
    fontSize: 20
  }
});

let alrmInterval = null;
class AlarmTriggers extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    alarmTriggerList: [],
    selectedalarmTrggrId: [],
    alarmTriggerDataList: {
      alarmTypes: [],
      conditions: []
    },
    alarmTriggerDataForm: {
      alarmTypes: {
        required: true,
        value: [],
        selectedId: "",
        name: "Alarm Types"
      },
      conditions: {
        required: true,
        value: [],
        selectedId: "",
        name: "Condition"
      },
      label: {
        required: true,
        value: "",
        name: "Label"
      },
      description: {
        required: true,
        value: "",
        name: "Description"
      },
      alarmEnabled: {
        required: true,
        value: false,
        name: "Alarm Enabled"
      },
      isAcknowledged: {
        required: true,
        value: false,
        name: "Alarm Acknowledged"
      }
    },
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getAlarmTriggers();
    this.getAlarmConditions();
    this.getAlarmTypes();
    alrmInterval = setInterval(
      () => this.getAlarmTriggers(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(alrmInterval);
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
        this.getAlarmTriggers();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getAlarmTriggers();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  getAlarmTriggers = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/trigger/index";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET",
      params: {
        limit: this.state.limit,
        page: parseInt(this.state.page, 10) + 1
      }
    })
      .then(response => {
        this.toggleLoading(false);
        if (!this.props.handleRequest(response)) return;
        this.setState({
          alarmTriggerList: response.data,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getAlarmConditions = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/condition/index";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);
        let stateCopy = Object.assign({}, this.state);
        stateCopy.alarmTriggerDataList.conditions = response.data.map(
          condtn => ({
            value: condtn.alarm_condition_id,
            label: condtn.comment
          })
        );
        this.setState(stateCopy);
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getAlarmTypes = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/type/index";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);
        let stateCopy = Object.assign({}, this.state);
        stateCopy.alarmTriggerDataList.alarmTypes = response.data.map(
          condtn => ({ value: condtn.alarm_type_id, label: condtn.alarm_type })
        );
        this.setState(stateCopy);
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  deleteAlarmTrggr = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/trigger/delete";
    const params = {
      alarm_trigger_ids: this.state.selectedalarmTrggrId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.setState({
          selectedalarmTrggrId: []
        });
        this.getAlarmTriggers();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedalarmTrggrId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedalarmTrggrId: this.state.alarmTriggerList.map(
            n => n.alarm_trigger_id
          )
        });
      } else {
        this.setState({ selectedalarmTrggrId: [] });
      }
    } else {
      const indxSel = this.state.selectedalarmTrggrId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedalarmTrggrId;
          oldSelected.push(id);
          this.setState({ selectedalarmTrggrId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedalarmTrggrId: oldSelected });
      }
    }
  };

  handleClickOpen = type => () => {
    this.setState(
      {
        dialogType: type,
        openDialog: true
      },
      () => {
        if (type === "update") {
          let obj = this.state.alarmTriggerList.find(
            o => o.alarm_trigger_id === this.state.selectedalarmTrggrId[0]
          );

          let stateCopy = Object.assign({}, this.state);
          stateCopy.alarmTriggerDataForm.label.value = obj.label;
          stateCopy.alarmTriggerDataForm.description.value = obj.description;
          stateCopy.alarmTriggerDataForm.alarmEnabled.value = obj.alarm_enabled;
          stateCopy.alarmTriggerDataForm.isAcknowledged.value =
            obj.is_acknowledged;
          stateCopy.alarmTriggerDataForm.alarmTypes.value = [
            {
              label: obj.alarm_type,
              value: obj.alarm_type_id
            }
          ];
          stateCopy.alarmTriggerDataForm.alarmTypes.selectedId =
            obj.alarm_type_id;
          stateCopy.alarmTriggerDataForm.conditions.value = [
            {
              label: obj.alarm_condition_label,
              value: obj.alarm_condition_id
            }
          ];
          stateCopy.alarmTriggerDataForm.conditions.selectedId =
            obj.alarm_condition_id;
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
        this.getAlarmTriggers();
      }
    );
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.alarmTriggerDataForm.label.value = "";
    stateCopy.alarmTriggerDataForm.description.value = "";
    stateCopy.alarmTriggerDataForm.alarmEnabled.value = false;
    stateCopy.alarmTriggerDataForm.isAcknowledged.value = false;
    stateCopy.alarmTriggerDataForm.alarmTypes.value = [];
    stateCopy.alarmTriggerDataForm.alarmTypes.selectedId = "";
    stateCopy.alarmTriggerDataForm.conditions.value = [];
    stateCopy.alarmTriggerDataForm.conditions.selectedId = "";
    stateCopy.selectedalarmTrggrId = [];
    this.setState(stateCopy);
  };

  handleTextChangeDialog = name => e => {
    let stateCopy = Object.assign({}, this.state);

    if (name === "alarmTypes" || name === "conditions") {
      stateCopy.alarmTriggerDataForm[name].value = e || [];
      stateCopy.alarmTriggerDataForm[name].selectedId = e ? e.value : "";
      this.setState(stateCopy);
    } else if (name === "alarmEnabled" || name === "isAcknowledged") {
      stateCopy.alarmTriggerDataForm[name].value = e.target.checked;
      this.setState(stateCopy);
    } else {
      stateCopy.alarmTriggerDataForm[e.target.name].value = e.target.value;
      this.setState(stateCopy);
    }
  };

  createAlarmTrigger = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/alarm/trigger/" + this.state.dialogType;
    const params = {
      alarm_condition_id: this.state.alarmTriggerDataForm.conditions.value
        .value,
      alarm_enabled: this.state.alarmTriggerDataForm.alarmEnabled.value,
      is_acknowledged: this.state.alarmTriggerDataForm.isAcknowledged.value,
      alarm_type_id: this.state.alarmTriggerDataForm.alarmTypes.value.value,
      description: this.state.alarmTriggerDataForm.description.value,
      label: this.state.alarmTriggerDataForm.label.value
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.alarm_trigger_id = this.state.selectedalarmTrggrId[0];
    }
    const errors = general.validateForm(this.state.alarmTriggerDataForm);
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
                <h4 className={classes.cardTitleWhite}>Alarm Triggers</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.alarmTriggerList.length > 0 &&
                          this.state.selectedalarmTrggrId.length ===
                            this.state.alarmTriggerList.length
                        }
                        selected={
                          this.state.alarmTriggerList.length > 0 &&
                          this.state.selectedalarmTrggrId.length ===
                            this.state.alarmTriggerList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.alarmTriggerList.length > 0 &&
                              this.state.selectedalarmTrggrId.length ===
                                this.state.alarmTriggerList.length
                            }
                          />
                        </TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Condition</TableCell>
                        <TableCell align="left">Label</TableCell>
                        <TableCell align="left">Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="5" align="center">
                            <div className={classes.centerAlign}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.alarmTriggerList.map(row => (
                          <TableRow
                            hover
                            role="checkbox"
                            key={row.alarm_trigger_id}
                            aria-checked={
                              this.state.selectedalarmTrggrId.indexOf(
                                row.alarm_trigger_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedalarmTrggrId.indexOf(
                                row.alarm_trigger_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(
                                  row.alarm_trigger_id
                                )}
                                value={row.id}
                                checked={
                                  this.state.selectedalarmTrggrId.indexOf(
                                    row.alarm_trigger_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            {row.alarm_type.toLowerCase() === "debug" && (
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  size="small"
                                  className={classes.button}
                                >
                                  {row.alarm_type}
                                  <BugReport
                                    className={
                                      classes.tableIcons +
                                      " " +
                                      classes.colorDebug +
                                      " " +
                                      classes.iconSmall
                                    }
                                  />
                                </Button>
                              </TableCell>
                            )
                            // <TableCell align="left"><BugReport className={classes.tableIcons +' '+classes.colorDebug} />{row.alarm_type}</TableCell>
                            }
                            {row.alarm_type.toLowerCase() === "alert" && (
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  size="small"
                                  className={classes.button}
                                >
                                  {row.alarm_type}
                                  <Notifications
                                    className={
                                      classes.tableIcons +
                                      " " +
                                      classes.colorAlert +
                                      " " +
                                      classes.iconSmall
                                    }
                                  />
                                </Button>
                              </TableCell>
                            )
                            // <TableCell align="left"><Notifications className={classes.tableIcons +' '+classes.colorAlert}/>{row.alarm_type}</TableCell>
                            }
                            {row.alarm_type.toLowerCase() === "warning" && (
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  size="small"
                                  className={classes.button}
                                >
                                  {row.alarm_type}
                                  <Warning
                                    className={
                                      classes.tableIcons +
                                      " " +
                                      classes.colorWarning +
                                      " " +
                                      classes.iconSmall
                                    }
                                  />
                                </Button>
                              </TableCell>
                            )
                            // <TableCell align="left"><Warning className={classes.tableIcons +' '+classes.colorWarning}/>{row.alarm_type}</TableCell>
                            }
                            {row.alarm_type.toLowerCase() === "info" && (
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  size="small"
                                  className={classes.button}
                                >
                                  {row.alarm_type}
                                  <Info
                                    className={
                                      classes.tableIcons +
                                      " " +
                                      classes.colorInfo +
                                      " " +
                                      classes.iconSmall
                                    }
                                  />
                                </Button>
                              </TableCell>
                            )
                            // <TableCell align="left"><Info className={classes.tableIcons +' '+classes.colorInfo}/>{row.alarm_type}</TableCell>
                            }
                            {row.alarm_type.toLowerCase() === "critical" && (
                              <TableCell align="left">
                                <Button
                                  variant="contained"
                                  size="small"
                                  className={classes.button}
                                >
                                  {row.alarm_type}
                                  <Whatshot
                                    className={
                                      classes.tableIcons +
                                      " " +
                                      classes.colorCritical +
                                      " " +
                                      classes.iconSmall
                                    }
                                  />
                                </Button>
                              </TableCell>
                            )
                            // <TableCell align="left"><Whatshot className={classes.tableIcons +' '+classes.colorCritical}/>{row.alarm_type}</TableCell>
                            }
                            <TableCell align="left">
                              {row.alarm_condition_label}
                            </TableCell>
                            <TableCell align="left">{row.label}</TableCell>
                            <TableCell align="left">
                              {row.description}
                            </TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.alarmTriggerList.length === 0 && (
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

                <Button2 onClick={this.handleClickOpen("create")} color="info">
                  Create
                </Button2>
                <Button2
                  disabled={
                    this.state.selectedalarmTrggrId.length === 0 ||
                    this.state.selectedalarmTrggrId.length > 1
                  }
                  onClick={this.handleClickOpen("update")}
                  color="info"
                >
                  Edit
                </Button2>
                <Button2
                  disabled={this.state.selectedalarmTrggrId.length === 0}
                  onClick={this.deleteAlarmTrggr}
                  color="info"
                >
                  Delete
                </Button2>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          fullWidth={true}
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.dialogType === "create" && "Create "}
            {this.state.dialogType === "update" && "Update "}
            Alarm Trigger
          </DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={this.createAlarmTrigger}>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <TextField
                  required={true}
                  value={this.state.alarmTriggerDataForm.label.value}
                  label="Label"
                  id="alarmTriggerLabel"
                  name="label"
                  onChange={this.handleTextChangeDialog("label", null)}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>

              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <TextField
                  required={true}
                  value={this.state.alarmTriggerDataForm.description.value}
                  label="Description"
                  id="alarmTriggerDescription"
                  name="description"
                  onChange={this.handleTextChangeDialog("description", null)}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>

              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        this.state.alarmTriggerDataForm.alarmEnabled.value
                      }
                      onChange={this.handleTextChangeDialog("alarmEnabled")}
                      value="alarmEnabled"
                      color="primary"
                    />
                  }
                  label="Alarm Enable"
                />
              </FormControl>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <FormControlLabel
                  control={
                    <Switch
                      checked={
                        this.state.alarmTriggerDataForm.isAcknowledged.value
                      }
                      onChange={this.handleTextChangeDialog("isAcknowledged")}
                      value="isAcknowledged"
                      color="primary"
                    />
                  }
                  label="Alarm Acknowledged"
                />
              </FormControl>

              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdownOnly
                  customId="alarmTypes"
                  suggestions={this.state.alarmTriggerDataList.alarmTypes}
                  handleChange={this.handleTextChangeDialog("alarmTypes", null)}
                  placeholder="Alarm Types"
                  isMulti={false}
                  padding={classes.noPadding}
                  value={this.state.alarmTriggerDataForm.alarmTypes.value}
                />
              </FormControl>

              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdownOnly
                  customId="alarmConditions"
                  suggestions={this.state.alarmTriggerDataList.conditions}
                  handleChange={this.handleTextChangeDialog("conditions", null)}
                  placeholder="Conditions"
                  isMulti={false}
                  padding={classes.noPadding}
                  value={this.state.alarmTriggerDataForm.conditions.value}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button2 onClick={this.handleClose} color="info">
              Cancel
            </Button2>
            <Button2
              type="submit"
              onClick={this.createAlarmTrigger}
              color="info"
            >
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button2>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlarmTriggers.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(AlarmTriggers));
