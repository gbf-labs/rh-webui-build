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

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
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
  }
});

let alrmInterval = null;
class AlarmConditions extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    alarmConditionList: [],
    selectedAlarmCndtnId: [],
    dialogType: "create",
    alarmConditionDataList: {
      operators: [],
      parameters: []
    },
    alarmConditionDataForm: {
      comment: {
        required: true,
        value: "",
        name: "Comment"
      },
      operator: {
        required: true,
        value: [],
        selectedId: "",
        name: "Operator"
      },
      parameters: {
        required: false,
        value: [],
        name: "Parameters"
      }
    },
    paramsLength: 1,
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getAlarmConditions();
    this.getAlarmParameters();
    this.getAlarmOperators();
    alrmInterval = setInterval(
      () => this.getAlarmConditions(),
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
        this.getAlarmConditions();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getAlarmConditions();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  getAlarmConditions = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/condition/index";
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
          alarmConditionList: response.data,
          totalCount: response.total_rows,
          paramsLength: response.max_param
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getAlarmParameters = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/alarm/parameters/index";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        this.toggleLoading(false);
        if (!this.props.handleRequest(response)) return;

        let stateCopy = Object.assign({}, this.state);
        stateCopy.alarmConditionDataList.parameters = response.data;
        this.setState(stateCopy);
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getAlarmOperators = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/operators/index";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        this.toggleLoading(false);
        if (!this.props.handleRequest(response)) return;

        let stateCopy = Object.assign({}, this.state);
        stateCopy.alarmConditionDataList.operators = response.data;
        this.setState(stateCopy);
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  deleteAlarmCondition = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/alarm/condition/delete";
    const params = {
      alarm_condition_ids: this.state.selectedAlarmCndtnId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.setState({
          selectedAlarmCndtnId: []
        });
        this.getAlarmConditions();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedAlarmCndtnId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedAlarmCndtnId: this.state.alarmConditionList.map(
            n => n.alarm_condition_id
          )
        });
      } else {
        this.setState({ selectedAlarmCndtnId: [] });
      }
    } else {
      const indxSel = this.state.selectedAlarmCndtnId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedAlarmCndtnId;
          oldSelected.push(id);
          this.setState({ selectedAlarmCndtnId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedAlarmCndtnId: oldSelected });
      }
    }
  };

  handleTextChangeDialog = (name, index) => e => {
    let stateCopy = Object.assign({}, this.state);

    if (name === "operator") {
      stateCopy.alarmConditionDataForm[name].value = e || [];
      stateCopy.alarmConditionDataForm[name].selectedId = e ? e.value : "";
      const params = [];
      if (e) {
        for (var i = 0; i < parseInt(e.param_num, 10); i++) {
          params.push({
            value2: []
          });
        }
      }
      stateCopy.alarmConditionDataForm["parameters"].value = params;
      this.setState(stateCopy);
    } else if (name === "parameters") {
      if (e) {
        if (e.type) {
          stateCopy.alarmConditionDataForm["parameters"].value[index] = e;
        } else {
          stateCopy.alarmConditionDataForm["parameters"].value[index] = {
            label: e.label,
            type: "",
            value: ""
          };
        }
        stateCopy.alarmConditionDataForm["parameters"].value[index][
          "value2"
        ] = e;
      } else {
        stateCopy.alarmConditionDataForm["parameters"].value[index] = {};
        stateCopy.alarmConditionDataForm["parameters"].value[index][
          "value2"
        ] = [];
      }
      this.setState(stateCopy);
    } else {
      stateCopy.alarmConditionDataForm[e.target.name].value = e.target.value;
      this.setState(stateCopy);
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
          let obj = this.state.alarmConditionList.find(
            o => o.alarm_condition_id === this.state.selectedAlarmCndtnId[0]
          );

          let stateCopy = Object.assign({}, this.state);
          stateCopy.alarmConditionDataForm.comment.value = obj.comment;
          stateCopy.alarmConditionDataForm.operator.value = this.state.alarmConditionDataList.operators.map(
            op => {
              if (op.options[0].value === obj.operator_id) {
                return op.options[0];
              }
            }
          );
          stateCopy.alarmConditionDataForm.operator.selectedId =
            obj.operator_id;
          stateCopy.alarmConditionDataForm.parameters.value = obj.parameters;
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
        this.getAlarmConditions();
      }
    );
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.alarmConditionDataForm.comment.value = "";
    stateCopy.alarmConditionDataForm.operator.value = [];
    stateCopy.alarmConditionDataForm.operator.selectedId = "";
    stateCopy.alarmConditionDataForm.parameters.value = [];
    stateCopy.selectedAlarmCndtnId = [];
    this.setState(stateCopy);
  };

  createAlarmCondition = () => {
    const requestURL =
      process.env.REACT_APP_API_URL +
      "/alarm/condition/" +
      this.state.dialogType;
    const paramErrs = [];
    const parameters = this.state.alarmConditionDataForm.parameters.value.map(
      (param, index) => {
        if (param.value2 && param.value2.length === 0) {
          paramErrs.push(index + 1);
        }
        return {
          label: param.label,
          id: param.value,
          type: param.type,
          number: index + 1
        };
      }
    );

    if (paramErrs.length > 0) {
      this.props.enqueueSnackbar(
        "Parameter(s): " + paramErrs.join(",") + " is required.",
        { variant: "error" }
      );
      return;
    }
    const params = {
      comment: this.state.alarmConditionDataForm.comment.value,
      operator_id: this.state.alarmConditionDataForm.operator.selectedId,
      parameters: parameters
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.alarm_condition_id = this.state.selectedAlarmCndtnId[0];
    }
    const errors = general.validateForm(this.state.alarmConditionDataForm);
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

  optionRenderer(data) {
    return (
      <div>
        {" "}
        {data.label} <small>small</small>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    const paramHeaders = [];
    for (let i = 0; i < this.state.paramsLength; i++) {
      paramHeaders.push(
        <TableCell align="left" key={general.randomTextGenerator()}>
          Parameter
          {i + 1}
        </TableCell>
      );
    }
    const paramContent = params => {
      const param = [];
      for (let i = 0; i < params.length; i++) {
        param.push(
          <TableCell align="left" key={general.randomTextGenerator()}>
            {params[i].label}
          </TableCell>
        );
      }
      for (let i = 0; i < this.state.paramsLength - params.length; i++) {
        param.push(
          <TableCell align="left" key={general.randomTextGenerator()}>
            <i>(not set)</i>
          </TableCell>
        );
      }
      return param;
    };

    const formatGroupLabel = data => (
      <div>
        <span>
          <b>
            {data.label} {data.options[0].operator}
          </b>
        </span>
      </div>
    );

    const formatOptionLabel = ({ label, param_num }) => (
      <div style={{ display: "flex" }}>
        {label}. This takes {param_num} parameters.
      </div>
    );

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray" className={classes.CardHeaderIcon}>
                <h4 className={classes.cardTitleWhite}>Alarm Conditions</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.alarmConditionList.length > 0 &&
                          this.state.selectedAlarmCndtnId.length ===
                            this.state.alarmConditionList.length
                        }
                        selected={
                          this.state.alarmConditionList.length > 0 &&
                          this.state.selectedAlarmCndtnId.length ===
                            this.state.alarmConditionList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.alarmConditionList.length > 0 &&
                              this.state.selectedAlarmCndtnId.length ===
                                this.state.alarmConditionList.length
                            }
                          />
                        </TableCell>
                        {/* <TableCell align="left">ID</TableCell> */}
                        <TableCell align="left">Comment</TableCell>
                        <TableCell align="left">Operator</TableCell>
                        {paramHeaders}
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
                        this.state.alarmConditionList.map(row => (
                          <TableRow
                            hover
                            role="checkbox"
                            key={row.alarm_condition_id}
                            aria-checked={
                              this.state.selectedAlarmCndtnId.indexOf(
                                row.company_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedAlarmCndtnId.indexOf(
                                row.company_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(
                                  row.alarm_condition_id
                                )}
                                value={row.alarm_condition_id.toString()}
                                checked={
                                  this.state.selectedAlarmCndtnId.indexOf(
                                    row.alarm_condition_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            {/* <TableCell align="left">
                              {row.alarm_condition_id}
                            </TableCell> */}
                            <TableCell align="left">{row.comment}</TableCell>
                            <TableCell align="left">
                              {row.alarm_operator}
                            </TableCell>
                            {paramContent(row.parameters)}
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.alarmConditionList.length === 0 && (
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
                    this.state.selectedAlarmCndtnId.length === 0 ||
                    this.state.selectedAlarmCndtnId.length > 1
                  }
                  onClick={this.handleClickOpen("update")}
                  color="info"
                >
                  Edit
                </Button>
                <Button
                  disabled={this.state.selectedAlarmCndtnId.length === 0}
                  onClick={this.deleteAlarmCondition}
                  color="info"
                >
                  Delete
                </Button>
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
            Alarm Conditions
          </DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={this.createAlarmCondition}>
              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <TextField
                  required={true}
                  value={this.state.alarmConditionDataForm.comment.value}
                  label="Comment"
                  id="alarmConditionComment"
                  name="comment"
                  onChange={this.handleTextChangeDialog("comment", null)}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>

              <FormControl
                className={classes.formControlMargin}
                required
                fullWidth
              >
                <SelectDropdownOnly
                  customId="conditionOperator"
                  suggestions={this.state.alarmConditionDataList.operators}
                  handleChange={this.handleTextChangeDialog("operator", null)}
                  formatGroupLabel={formatGroupLabel}
                  placeholder="Operator"
                  isMulti={false}
                  padding={classes.noPadding}
                  formatOptionLabel={formatOptionLabel}
                  value={this.state.alarmConditionDataForm.operator.value}
                />
              </FormControl>

              {this.state.alarmConditionDataForm.parameters.value.length > 0 &&
                this.state.alarmConditionDataForm.parameters.value.map(
                  (row, index) => (
                    <FormControl
                      className={classes.formControlMargin}
                      required
                      fullWidth
                      key={"conditionParameterForm" + (index + 1)}
                    >
                      <SelectDropdown
                        customId={"conditionParameter" + (index + 1)}
                        suggestions={
                          this.state.alarmConditionDataList.parameters
                        }
                        handleChange={this.handleTextChangeDialog(
                          "parameters",
                          index
                        )}
                        placeholder="Parameter"
                        formatGroupLabel={formatGroupLabel}
                        createOptionPosition="first"
                        isMulti={false}
                        padding={classes.noPadding}
                        value={
                          this.state.alarmConditionDataForm.parameters.value[
                            index
                          ]
                        }
                      />
                    </FormControl>
                  )
                )}
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={this.createAlarmCondition}
              color="info"
            >
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AlarmConditions.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(AlarmConditions));
