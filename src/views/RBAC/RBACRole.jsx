import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import ListItemText from "@material-ui/core/ListItemText";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
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
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

let roleInterval = null,
  permInterval = null;
class RBACRole extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    dialogType: "create",
    roleList: [],
    permissionList: [],
    roleDataForm: {
      roleName: {
        required: true,
        value: "",
        name: "Role Name"
      },
      roleDetails: {
        required: true,
        value: "",
        name: "Role Details"
      }
    },
    selectedPermissionsId: [],
    selectedPermissions: [],
    selectedRoleId: [],
    limit: 10,
    page: 0,
    totalCount: 0
  };

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  componentDidMount() {
    this.getRole();
    this.getPermissions();
    roleInterval = setInterval(
      () => this.getRole(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    permInterval = setInterval(
      () => this.getPermissions(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(permInterval);
    clearInterval(roleInterval);
  }

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getRole();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getRole();
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
          let obj = this.state.roleList.find(
            o => o.role_id === this.state.selectedRoleId[0]
          );

          let stateCopy = Object.assign({}, this.state);
          stateCopy.roleDataForm.roleName.value = obj.role_name;
          stateCopy.roleDataForm.roleDetails.value = obj.role_details;
          let permissions = [];
          let permissionIds = [];
          if (obj.permissions) {
            obj.permissions.forEach(perm => {
              permissions.push(perm.permission_id + "-" + perm.permission_name);
              permissionIds.push(perm.permission_id);
            });
          }
          stateCopy.selectedPermissions = permissions;
          stateCopy.selectedPermissionsId = permissionIds;
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

    if (name === "selectedPermissions") {
      const id = [];
      const name = [];
      value.forEach(el => {
        const val = el.split("-");
        id.push(val[0]);
        name.push(val[1]);
      });
      this.setState({
        selectedPermissionsId: id,
        selectedPermissions: value
      });
    } else {
      let stateCopy = Object.assign({}, this.state);
      stateCopy.roleDataForm[name].value = value;

      this.setState(stateCopy);
    }
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.roleDataForm.roleName.value = "";
    stateCopy.roleDataForm.roleDetails.value = "";
    stateCopy.selectedPermissions = [];
    stateCopy.selectedPermissionsId = [];
    stateCopy.selectedRoleId = [];
    this.setState(stateCopy);
  };

  getRole = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/role/index";
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
          roleList: response.rows,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getPermissions = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/permission/index";
    request(requestURL, {
      method: "GET",
      params: {
        limit: 100,
        page: 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.setState({
          permissionList: response.rows
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  createRole = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/role/" + this.state.dialogType;
    const params = {
      permission_ids: this.state.selectedPermissionsId,
      role_name: this.state.roleDataForm.roleName.value,
      role_details: this.state.roleDataForm.roleDetails.value
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.role_id = this.state.selectedRoleId[0];
    }
    const errors = general.validateForm(this.state.roleDataForm);
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
        this.getRole();
      })
      .catch(() => {
        this.handleClose();
        this.props.enqueueSnackbar("Role creation failed.", {
          variant: "error"
        });
      });
  };

  deleteRole = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/role/delete";
    const params = {
      role_ids: this.state.selectedRoleId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.setState({
          selectedRoleId: []
        });
        this.getRole();
        this.props.enqueueSnackbar(response.message, { variant: "success" });
      })
      .catch(() => {
        this.handleClose();
        this.props.enqueueSnackbar("Role deletion failed.", {
          variant: "error"
        });
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedRoleId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedRoleId: this.state.roleList.map(n => n.role_id)
        });
      } else {
        this.setState({ selectedRoleId: [] });
      }
    } else {
      const indxSel = this.state.selectedRoleId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedRoleId;
          oldSelected.push(id);
          this.setState({ selectedRoleId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedRoleId: oldSelected });
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
                <h4 className={classes.cardTitleWhite}>Role List</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.roleList.length > 0 &&
                          this.state.selectedRoleId.length ===
                            this.state.roleList.length
                        }
                        selected={
                          this.state.roleList.length > 0 &&
                          this.state.selectedRoleId.length ===
                            this.state.roleList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.roleList.length > 0 &&
                              this.state.selectedRoleId.length ===
                                this.state.roleList.length
                            }
                          />
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Permissions</TableCell>
                        <TableCell align="left">Details</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="4" align="center">
                            <div className={classes.centerAlign}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.roleList.map(row => (
                          <TableRow
                            key={row.role_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedRoleId.indexOf(row.role_id) >
                              -1
                            }
                            selected={
                              this.state.selectedRoleId.indexOf(row.role_id) >
                              -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.role_id)}
                                value={row.role_id}
                                checked={
                                  this.state.selectedRoleId.indexOf(
                                    row.role_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            <TableCell align="left">{row.role_name}</TableCell>
                            {row.permissions && (
                              <TableCell align="left">
                                {row.permissions
                                  .map(a => {
                                    return a.permission_name;
                                  })
                                  .join(", ")}
                              </TableCell>
                            )}
                            {row.permissions === null && (
                              <TableCell align="left">None</TableCell>
                            )}
                            <TableCell align="left">
                              {row.role_details}
                            </TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.roleList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="4" align="justify">
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
                  disabled={this.state.selectedRoleId.length === 0}
                  onClick={this.deleteRole}
                  color="info"
                >
                  Delete Role
                </Button>
                <Button
                  onClick={() => this.handleClickOpen("create")}
                  color="info"
                >
                  Create Role
                </Button>
                <Button
                  disabled={
                    this.state.selectedRoleId.length === 0 ||
                    this.state.selectedRoleId.length > 1
                  }
                  onClick={() => this.handleClickOpen("update")}
                  color="info"
                >
                  Edit Role
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
          <DialogTitle id="form-dialog-title">Create Role</DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={this.createRole}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  required={true}
                  label="Name"
                  id="roleName"
                  name="roleName"
                  value={this.state.roleDataForm.roleName.value}
                  onChange={this.handleTextChangeDialog}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  required={true}
                  label="Details"
                  id="roleDetails"
                  name="roleDetails"
                  value={this.state.roleDataForm.roleDetails.value}
                  onChange={this.handleTextChangeDialog}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl className={classes.formControl} fullWidth>
                <InputLabel htmlFor="selectedPermissions">
                  Permissions
                </InputLabel>
                <Select
                  multiple
                  value={this.state.selectedPermissions}
                  onChange={this.handleTextChangeDialog}
                  input={
                    <Input
                      id="selectedPermissions"
                      name="selectedPermissions"
                    />
                  }
                  renderValue={selected => {
                    var spltedArr = [];
                    for (var i = 0; i < selected.length; i++) {
                      var split = selected[i].split("-");
                      spltedArr.push(split[1]);
                    }
                    return spltedArr.join(", ");
                  }}
                  className={classNames(classes.margin, classes.textField)}
                  MenuProps={MenuProps}
                >
                  {this.state.permissionList
                    .filter(r => {
                      if (
                        "all" === r.permission_name ||
                        r.permission_name === "all and with admin vessel VPN."
                      ) {
                        return false;
                      } else {
                        return r;
                      }
                    })
                    .map(row => (
                      <MenuItem
                        key={row.permission_id}
                        value={row.permission_id + "-" + row.permission_name}
                      >
                        <Checkbox
                          value={row.permission_id + "-" + row.permission_name}
                          checked={
                            this.state.selectedPermissions.indexOf(
                              row.permission_id + "-" + row.permission_name
                            ) > -1
                          }
                        />
                        <ListItemText primary={row.permission_name} />
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.createRole} color="info">
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RBACRole.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(RBACRole));
