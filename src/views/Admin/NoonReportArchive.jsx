import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

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
  }
});

let archInterval = null;
class AdminVesselsNoonRepArchive extends React.Component {
  state = {
    fullWidth: true,
    loading: false,
    openDialog: false,
    maxWidth: "md",
    selectedArchiveId: [],
    selectedArchive: [],
    archiveList: [],
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getArchives();
    archInterval = setInterval(
      () => this.getArchives(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(archInterval);
  }

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  getArchives = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/email/noon/report";
    this.toggleLoading(true);

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: this.props.match.params.vessel_id,
        limit: this.state.limit,
        page: parseInt(this.state.page, 10) + 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        this.setState({
          archiveList: response.rows,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedArchiveId;
    let oldSelectedArch = this.state.selectedArchive;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedArchiveId: this.state.archiveList.map(n => n.vessel_id),
          selectedArchive: this.state.archiveList.map(n => n)
        });
      } else {
        this.setState({
          selectedArchiveId: [],
          selectedArchive: []
        });
      }
    } else {
      const indxSel = this.state.selectedArchiveId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedArchiveId;
          let oldSelectedArch = this.state.selectedArchive;
          oldSelected.push(id);
          oldSelectedArch.push(
            this.state.archiveList.filter(n => {
              if (id === n.vessel_id) {
                return n;
              }
              return false;
            })[0]
          );
          this.setState({
            selectedArchiveId: oldSelected,
            selectedArchive: oldSelectedArch
          });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        oldSelectedArch.splice(indxSel, 1);
        this.setState({
          selectedArchiveId: oldSelected,
          selectedArchive: oldSelectedArch
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
        this.getArchives();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getArchives();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  getVesselReport = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/email/noon/report/data";
    this.toggleLoading(true);

    request(requestURL, {
      method: "GET",
      params: {
        mail_log_ids: this.state.selectedArchiveId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        this.setState({
          noonReportTemplate: response.rows[0].message
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  downloadVesselReports = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/email/noon/report/pdf";
    this.toggleLoading(true);

    request(requestURL, {
      method: "GET",
      params: {
        mail_log_ids: this.state.selectedArchiveId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        const url = process.env.REACT_APP_API_URL + "/" + response.location;
        const win = window.open(url);
        win.focus();

        this.toggleLoading(false);
        this.handleClose();
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  handleClickOpen = () => {
    let stateCopy = Object.assign({}, this.state);
    this.getVesselReport();
    stateCopy.openDialog = true;
    this.setState(stateCopy);
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

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.selectedArchiveId = [];
    stateCopy.selectedArchive = [];
    stateCopy.noonReportTemplate = "";
    this.setState(stateCopy, () => {
      this.getArchives();
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
                <h4 className={classes.cardTitleWhite}>Noon Report Archive</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" padding="checkbox" />
                        <TableCell align="left">Date Time (UTC)</TableCell>
                        <TableCell align="left">Recipients</TableCell>
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
                        this.state.archiveList.map(row => (
                          <TableRow
                            key={row.mail_log_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedArchiveId.indexOf(
                                row.mail_log_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedArchiveId.indexOf(
                                row.mail_log_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.mail_log_id)}
                                value={row.id}
                                checked={
                                  this.state.selectedArchiveId.indexOf(
                                    row.mail_log_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            <TableCell align="left">
                              {general.epochToJsDate(row.created_on)}
                            </TableCell>
                            <TableCell align="left">{row.email}</TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.archiveList.length === 0 && (
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
                  disabled={
                    this.state.selectedArchiveId.length === 0 ||
                    this.state.selectedArchiveId.length > 1
                  }
                  onClick={() => this.handleClickOpen("noonreportingarchive")}
                  color="info"
                >
                  View Noon Report
                </Button>
                <Button
                  disabled={this.state.selectedArchiveId.length === 0}
                  onClick={() => this.downloadVesselReports()}
                  color="info"
                >
                  Download Noon Report(s)
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>

        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Noon Report Details</DialogTitle>
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
                    className={classes.textField}
                    InputProps={{
                      classes: {
                        input: classes.noonReportForm
                      }
                    }}
                    disabled={true}
                    margin="none"
                  />
                </FormControl>
              </GridItem>
            </GridContainer>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.downloadVesselReports} color="info">
              Download Report
            </Button>
            <Button onClick={this.handleClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

AdminVesselsNoonRepArchive.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(AdminVesselsNoonRepArchive));
