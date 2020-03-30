import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSnackbar } from "notistack";
import ReactSelect from "react-select";

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

let compInterval = null,
  vessInterval = null;
class Company extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    defVessls: [],
    companyList: [],
    vesselList: [],
    selectedCompId: [],
    dialogType: "create",
    companyDataForm: {
      companyName: {
        required: true,
        value: "",
        name: "Company Name"
      },
      companyVessels: {
        required: true,
        value: [],
        value2: [],
        name: "Company Vessels"
      }
    },
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getCompany();
    this.getVessels();
    compInterval = setInterval(
      () => this.getCompany(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    vessInterval = setInterval(
      () => this.getVessels(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(compInterval);
    clearInterval(vessInterval);
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
        this.getCompany();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getCompany();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleClickOpen = type => () => {
    this.setState(
      {
        dialogType: type,
        openDialog: true
      },
      () => {
        if (type === "update") {
          let obj = this.state.companyList.find(
            o => o.company_id === this.state.selectedCompId[0]
          );

          let stateCopy = Object.assign({}, this.state);
          stateCopy.companyDataForm.companyName.value = obj.company_name;
          let vessels = [];
          let vesselIds = [];
          let defVsl = [];
          obj.vessels.forEach(vessel => {
            vessels.push(vessel.vessel_id + "-" + vessel.vessel_name);
            vesselIds.push(vessel.vessel_id);
            defVsl.push({
              value: vessel.vessel_id,
              label: vessel.vessel_name
            });
          });
          stateCopy.defVessls = defVsl;
          stateCopy.companyDataForm.companyVessels.value = vessels;
          stateCopy.companyDataForm.companyVessels.value2 = vesselIds;
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

  handleTextChangeDialog = name => e => {
    let stateCopy = Object.assign({}, this.state);
    if (name === "companyVessels") {
      const id = [];
      const name2 = [];
      e.forEach(el => {
        id.push(el.value);
        name2.push(el.label);
      });
      stateCopy.companyDataForm[name].value = name2;
      stateCopy.companyDataForm[name].value2 = id;

      this.setState(stateCopy);
    } else {
      stateCopy.companyDataForm[e.target.name].value = e.target.value;
      this.setState(stateCopy);
    }
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.companyDataForm.companyName.value = "";
    stateCopy.companyDataForm.companyVessels.value = [];
    stateCopy.companyDataForm.companyVessels.value2 = [];
    stateCopy.defVessls = [];
    stateCopy.selectedCompId = [];
    this.setState(stateCopy);
  };

  getCompany = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/company/index";
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
          companyList: response.rows,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getVessels = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/map/vessels";
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        let vessls = [];
        for (let i = 0; i < response.rows.length; i++) {
          const element = response.rows[i];
          vessls.push({
            value: element.vessel_id,
            label: element.vessel_name
          });
        }
        this.setState({
          vesselList: vessls
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  deleteCompany = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/company/delete";
    const params = {
      company_ids: this.state.selectedCompId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          selectedCompId: []
        });
        this.getCompany();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedCompId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedCompId: this.state.companyList.map(n => n.company_id)
        });
      } else {
        this.setState({ selectedCompId: [] });
      }
    } else {
      const indxSel = this.state.selectedCompId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedCompId;
          oldSelected.push(id);
          this.setState({ selectedCompId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedCompId: oldSelected });
      }
    }
  };

  createCompany = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/company/" + this.state.dialogType;
    const params = {
      company_name: this.state.companyDataForm.companyName.value,
      vessel_ids: this.state.companyDataForm.companyVessels.value2
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.company_id = this.state.selectedCompId[0];
    }
    const errors = general.validateForm(this.state.companyDataForm);
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

        this.getCompany();
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
                <h4 className={classes.cardTitleWhite}>Company List</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.companyList.length > 0 &&
                          this.state.selectedCompId.length ===
                            this.state.companyList.length
                        }
                        selected={
                          this.state.companyList.length > 0 &&
                          this.state.selectedCompId.length ===
                            this.state.companyList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.companyList.length > 0 &&
                              this.state.selectedCompId.length ===
                                this.state.companyList.length
                            }
                          />
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Vessels</TableCell>
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
                        this.state.companyList.map(row => (
                          <TableRow
                            key={row.company_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedCompId.indexOf(
                                row.company_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedCompId.indexOf(
                                row.company_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.company_id)}
                                value={row.id}
                                checked={
                                  this.state.selectedCompId.indexOf(
                                    row.company_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            {/* <TableCell align="left">{row.company_id}</TableCell> */}
                            <TableCell align="left">
                              {row.company_name}
                            </TableCell>
                            {row.vessels && (
                              <TableCell align="left">
                                {row.vessels
                                  .map(a => {
                                    return a.vessel_name;
                                  })
                                  .join(", ")}
                              </TableCell>
                            )}
                            {row.vessels === null && (
                              <TableCell align="left">None</TableCell>
                            )}
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.companyList.length === 0 && (
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
                  disabled={this.state.selectedCompId.length === 0}
                  onClick={this.deleteCompany}
                  color="info"
                >
                  Delete Company
                </Button>
                <Button onClick={this.handleClickOpen("create")} color="info">
                  Create Company
                </Button>
                <Button
                  disabled={
                    this.state.selectedCompId.length === 0 ||
                    this.state.selectedCompId.length > 1
                  }
                  onClick={this.handleClickOpen("update")}
                  color="info"
                >
                  Edit Company
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
            Company
          </DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={this.createCompany}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  required={true}
                  value={this.state.companyDataForm.companyName.value}
                  label="Name"
                  id="companyName"
                  name="companyName"
                  onChange={this.handleTextChangeDialog("companyName")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <ReactSelect
                  isMulti
                  inputId="companyVessel"
                  defaultValue={this.state.defVessls}
                  options={this.state.vesselList}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Vessels"
                  menuPosition="fixed"
                  onChange={this.handleTextChangeDialog("companyVessels")}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.createCompany} color="info">
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

Company.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  requestTimeoutChckr: PropTypes.func.isRequired,
  timeOutCtr: PropTypes.number.isRequired
};

export default withStyles(styles)(withSnackbar(Company));
