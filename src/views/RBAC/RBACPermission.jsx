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
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
// helpers
import request from "utils/request";
import general from "../../variables/general";

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
  requiredField: {
    fontSize: "11px"
  }
});

let permInterval = null;
class RBACPermission extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    dialogType: "create",
    userList: [],
    permissionList: [],
    selectedPermId: [],
    permissionDataForm: {
      permName: {
        required: true,
        value: "",
        name: "Permission Name"
      },
      permDetails: {
        required: true,
        value: "",
        name: "Permission Details"
      }
    },
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getPermissions();
    permInterval = setInterval(
      () => this.getPermissions(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(permInterval);
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
        this.getPermissions();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getPermissions();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleClickOpen = type => {
    this.setState(
      {
        dialogType: type,
        openDialog: true
      },
      () => {
        if (type === "update") {
          let obj = this.state.permissionList.find(
            o => o.permission_id === this.state.selectedPermId[0]
          );

          let stateCopy = Object.assign({}, this.state);
          stateCopy.permissionDataForm.permName.value = obj.permission_name;
          stateCopy.permissionDataForm.permDetails.value =
            obj.permission_details;

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
      }
    );
  };

  handleTextChangeDialog = e => {
    const name = e.target.name;
    const value = e.target.value;

    let stateCopy = Object.assign({}, this.state);
    stateCopy.permissionDataForm[name].value = value;

    this.setState(stateCopy);
  };

  getPermissions = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/permission/index";
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

        this.setState({
          permissionList: response.rows,
          totalCount: response.total_rows
        });
        this.toggleLoading(false);
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.permissionDataForm.permName.value = "";
    stateCopy.permissionDataForm.permDetails.value = "";
    stateCopy.selectedPermId = [];
    this.setState(stateCopy);
  };

  createPermission = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/permission/" + this.state.dialogType;
    const params = {
      permission_name: this.state.permissionDataForm.permName.value,
      permission_details: this.state.permissionDataForm.permDetails.value
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.permission_id = this.state.selectedPermId[0];
    }
    const errors = general.validateForm(this.state.permissionDataForm);
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
        this.getPermissions();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  deletePermission = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/permission/delete";
    const params = {
      permission_ids: this.state.selectedPermId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.setState({
          selectedPermId: []
        });
        this.getPermissions();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedPermId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedPermId: this.state.permissionList.map(n => n.permission_id)
        });
      } else {
        this.setState({ selectedPermId: [] });
      }
    } else {
      const indxSel = this.state.selectedPermId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedPermId;
          oldSelected.push(id);
          this.setState({ selectedPermId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedPermId: oldSelected });
      }
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray" className={classes.CardHeaderIcon}>
                <h4 className={classes.cardTitleWhite}>Permission List</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.permissionList.length > 0 &&
                          this.state.selectedPermId.length ===
                            this.state.permissionList.length
                        }
                        selected={
                          this.state.permissionList.length > 0 &&
                          this.state.selectedPermId.length ===
                            this.state.permissionList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.permissionList.length > 0 &&
                              this.state.selectedPermId.length ===
                                this.state.permissionList.length
                            }
                          />
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="3" align="center">
                            <div className={classes.centerAlign}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.permissionList.map(row => (
                          <TableRow
                            key={row.permission_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedPermId.indexOf(
                                row.permission_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedPermId.indexOf(
                                row.permission_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.permission_id)}
                                value={row.permission_id}
                                checked={
                                  this.state.selectedPermId.indexOf(
                                    row.permission_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            <TableCell align="left">
                              {row.permission_name}
                            </TableCell>
                            <TableCell align="left">
                              {row.permission_details}
                            </TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.permissionList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="3" align="justify">
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
                  disabled={this.state.selectedPermId.length === 0}
                  onClick={this.deletePermission}
                  color="info"
                >
                  Delete Permission
                </Button>
                <Button
                  onClick={() => this.handleClickOpen("create")}
                  color="info"
                >
                  Create Permission
                </Button>
                <Button
                  disabled={
                    this.state.selectedPermId.length === 0 ||
                    this.state.selectedPermId.length > 1
                  }
                  onClick={() => this.handleClickOpen("update")}
                  color="info"
                >
                  Edit Permission
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
          {this.state.dialogType === "create" && (
            <DialogTitle id="form-dialog-title">Create Permission</DialogTitle>
          )}
          {this.state.dialogType === "update" && (
            <DialogTitle id="form-dialog-title">Edit Permission</DialogTitle>
          )}
          <DialogContent>
            <form className={classes.form} onSubmit={this.createPermission}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  required={true}
                  value={this.state.permissionDataForm.permName.value}
                  label="Name"
                  id="name"
                  name="permName"
                  onChange={this.handleTextChangeDialog}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  required={true}
                  value={this.state.permissionDataForm.permDetails.value}
                  label="Details"
                  id="details"
                  name="permDetails"
                  onChange={this.handleTextChangeDialog}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
            </form>
            <p className={classes.requiredField}>* indicates required field</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.createPermission} color="info">
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RBACPermission.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(RBACPermission));
