import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import BugReport from "@material-ui/icons/BugReport"; //debug
import Notifications from "@material-ui/icons/Notifications"; //alert
import Warning from "@material-ui/icons/Warning"; //warning
import Info from "@material-ui/icons/Info"; //info
import Whatshot from "@material-ui/icons/Whatshot"; //critical
import ArrowRight from "@material-ui/icons/ArrowRight";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";
import Grid from "@material-ui/core/Grid";

//core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SelectDropdown from "components/AutoComplete/SelectDropdown.jsx";

//helpers
import request from "utils/request";
import general from "variables/general";

const moment = require("moment-timezone");

const styles = theme => ({
  cardCategoryWhite: {
    "&,& a,& a:hover,& a:focus": {
      color: "rgba(255,255,255,.62)",
      margin: "0",
      fontSize: "14px",
      marginTop: "0",
      marginBottom: "0"
    },
    "& a,& a:hover,& a:focus": {
      color: "#FFFFFF"
    }
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
  cardBodyLocation: {
    height: "300px"
  },
  centerText: {
    textAlign: "center"
  },
  tableLayout: {
    tableLayout: "fixed"
  },
  filterIcon: {
    float: "right",
    fontSize: "25px !important",
    cursor: "pointer"
  },
  textField: {
    fontSize: theme.typography.pxToRem(15),
    margin: "0 -10px"
  },
  filterContainer: {
    display: "flex",
    flexDirection: "column"
  },
  fullWidth: {
    background: "white",
    width: "100%",
    padding: "4px 0px 4px 0px",
    "margin-top": "12px"
  },
  thWidth: {
    width: "20%"
  },
  topAlign: {
    verticalAlign: "top"
  },
  noPadding: {
    padding: "0px !important"
  },
  noMargin: {
    margin: "0"
  },
  buttonMin: {
    minWidth: "230px"
  }
});

let timer = null,
  networkConflInterval = null,
  alarmsInterval = null;
class NetworkConfiguration extends React.Component {
  state = {
    alarmStateData: [],
    networkConfigurationData: [],
    dataCategories: [],
    dataSubcategories: [],
    dataOptions: [],
    portForwardingData: [],
    filterDateTime: null,
    filterCategory: "",
    filterSubCategory: "",
    filterOption: "",
    filterValue: "",
    sortType: "",
    sortVal: "",
    limit: 10,
    page: 0,
    totalCount: 0,
    filterOpen: true,
    loading: false
  };

  componentDidMount() {
    this.getNetworkConfiguration();
    this.getPortForwading();
    this.getAlarmState();
    networkConflInterval = setInterval(
      () => this.getNetworkConfiguration(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    alarmsInterval = setInterval(
      () => this.getAlarmState(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.globalDTPickerValue !== nextProps.globalDTPickerValue) {
      this.setState(
        {
          filterDateTime: nextProps.globalDTPickerValue
        },
        () => {
          this.getPortForwading();
          this.getNetworkConfiguration();
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.handleChangeGlobalDTPicker(null);
    clearInterval(networkConflInterval);
    clearInterval(alarmsInterval);
  }

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  toggleFilter = isFiltering => {
    this.setState({
      filterOpen: isFiltering
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getNetworkConfiguration();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getNetworkConfiguration();
      }
    );
  };

  getNetworkConfiguration() {
    const requestURL =
      process.env.REACT_APP_API_URL + "/vessels/network/configuration";
    const vessId = this.props.match.params.vessel_id;
    this.toggleLoading(true);

    let filCol = [],
      filVal = [];
    if (this.state.filterCategory.trim() !== "") {
      filCol.push("category");
      filVal.push(this.state.filterCategory);
    }
    if (this.state.filterSubCategory.trim() !== "") {
      filCol.push("sub_category");
      filVal.push(this.state.filterSubCategory);
    }
    if (this.state.filterOption.trim() !== "") {
      filCol.push("option");
      filVal.push(this.state.filterOption);
    }
    if (this.state.filterValue.trim() !== "") {
      filCol.push("value");
      filVal.push(this.state.filterValue);
    }

    let dt = "";
    if (this.state.filterDateTime) {
      dt = general.jsDateToEpoch(new Date(this.state.filterDateTime));
    }

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId,
        limit: this.state.limit,
        date: dt,
        page: parseInt(this.state.page, 10) + 1,
        filter_column: filCol,
        filter_value: filVal,
        sort_type: this.state.sortType,
        sort_column: this.state.sortVal
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        this.setState({
          networkConfigurationData: response.data,
          totalCount: response.total_rows,
          dataCategories: response.categories,
          dataSubcategories: response.subcategories,
          dataOptions: response.options
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  }

  getPortForwading() {
    const requestURL =
      process.env.REACT_APP_API_URL + "/device/port/forwarding";
    const vessId = this.props.match.params.vessel_id;
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId,
        limit: 100,
        page: 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.setState({
          portForwardingData: response.data
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  }

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleChangeField = name => event => {
    clearInterval(timer);
    if (name === "category") {
      let val = event || "";
      if (val) {
        val = event.value;
      }
      this.setState({
        filterCategory: val,
        page: 0
      });
    } else if (name === "sub_category") {
      let val = event || "";
      if (val) {
        val = event.value;
      }
      this.setState({
        filterSubCategory: val,
        page: 0
      });
    } else if (name === "option") {
      let val = event || "";
      if (val) {
        val = event.value;
      }
      this.setState({
        filterOption: val,
        page: 0
      });
    } else if (name === "value") {
      this.setState({
        filterValue: event.target.value,
        page: 0
      });
    } else if (name === "date") {
      let ev = null;
      if (event) {
        ev = new Date(event).setUTCSeconds(0);
      }
      this.setState({
        filterDateTime: ev,
        page: 0
      });
    }
    timer = setTimeout(() => {
      this.getNetworkConfiguration();
    }, 500);
  };

  getAlarmState = () => {
    const vessel_id = this.props.match.params.vessel_id;
    const device_id = "NTWCONF";
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/state/index";
    request(requestURL, {
      method: "GET",
      params: {
        verbose_level: 50,
        format: "",
        vessel_id,
        device_id
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.setState({
          alarmStateData: response.data
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  renderVerboseTypeButton(alarmType) {
    const { classes } = this.props;
    if (alarmType.toLowerCase() === "debug") {
      return (
        <Button variant="contained" size="small" className={classes.button}>
          {alarmType}
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
      );
    } else if (alarmType.toLowerCase() === "alert") {
      return (
        <Button variant="contained" size="small" className={classes.button}>
          {alarmType}
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
      );
    } else if (alarmType.toLowerCase() === "warning") {
      return (
        <Button variant="contained" size="small" className={classes.button}>
          {alarmType}
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
      );
    } else if (alarmType.toLowerCase() === "info") {
      return (
        <Button variant="contained" size="small" className={classes.button}>
          {alarmType}
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
      );
    } else if (alarmType.toLowerCase() === "critical") {
      return (
        <Button variant="contained" size="small" className={classes.button}>
          {alarmType}
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
      );
    }
  }

  renderResultCell(results) {
    const { classes } = this.props;
    const returnIfAvailable = dataVal => {
      if (dataVal && dataVal.trim() !== "") {
        return (
          <React.Fragment>
            <ArrowRight />
            {dataVal}
          </React.Fragment>
        );
      }
      return "";
    };
    return (
      <List dense={true}>
        {results.map((data, indx) => {
          return (
            <ListItem
              key={"list" + data.device + indx}
              className={classes.noPadding}
            >
              <Button
                variant="contained"
                size="small"
                className={classes.button}
              >
                {data.vessel_name}
                <ArrowRight />
                {data.device}
                {returnIfAvailable(data.module)}
                {returnIfAvailable(data.option)}
              </Button>
            </ListItem>
          );
        })}
      </List>
    );
  }

  renderTimeStampCell(results) {
    const { classes } = this.props;
    return (
      <List dense={false}>
        {results
          .filter(data => {
            return data.datas[0];
          })
          .map((data, indx) => {
            return (
              <ListItem
                className={classes.noPadding}
                key={"list" + data.datas[0].timestamp + indx}
              >
                <Button
                  variant="contained"
                  size="small"
                  className={classes.button + " " + classes.buttonMin}
                >
                  {general.epochToJsDate(data.datas[0].timestamp)} UTC
                  <ArrowRight />
                  <p
                    className={
                      classes[data.datas[0].remarks] + " " + classes.noMargin
                    }
                  >
                    {data.datas[0].message}
                  </p>
                </Button>
              </ListItem>
            );
          })}
      </List>
    );
  }

  render() {
    const { classes } = this.props;
    moment.tz.setDefault("UTC");

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>
                NETWORK CONFIGURATION
                {!this.state.filterOpen && (
                  <i
                    onClick={() => this.toggleFilter(!this.state.filterOpen)}
                    className={[
                      "material-icons md-18 flip-icons " + classes.filterIcon
                    ]}
                  >
                    filter_list
                  </i>
                )}
                {this.state.filterOpen && (
                  <i
                    onClick={() => this.toggleFilter(!this.state.filterOpen)}
                    className={["material-icons md-18  " + classes.filterIcon]}
                  >
                    filter_list
                  </i>
                )}
              </h4>
            </CardHeader>
            <CardBody className={classes.centerText}>
              <Paper className={classes.root}>
                <div>
                  <Table className={classes.tableLayout}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left" className={classes.thWidth}>
                          Time Stamp
                        </TableCell>
                        <TableCell align="left" className={classes.thWidth}>
                          Category
                        </TableCell>
                        <TableCell align="left" className={classes.thWidth}>
                          Sub-Category
                        </TableCell>
                        <TableCell align="left" className={classes.thWidth}>
                          Option
                        </TableCell>
                        <TableCell align="left" className={classes.thWidth}>
                          Value
                        </TableCell>
                      </TableRow>
                      {this.state.filterOpen && (
                        <TableRow>
                          <TableCell align="left" className={classes.topAlign}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                              <Grid
                                container
                                className={
                                  classes.grid + " " + classes.filterContainer
                                }
                                justify="flex-start"
                              >
                                <DateTimePicker
                                  margin="normal"
                                  label="Date Time Filter"
                                  value={this.state.filterDateTime}
                                  onChange={this.handleChangeField("date")}
                                  disableFuture
                                  showTodayButton
                                  clearable
                                  autoOk
                                  ampm={false}
                                  format="DD/MM/YYYY kk:mm:ss"
                                />
                              </Grid>
                            </MuiPickersUtilsProvider>
                          </TableCell>
                          <TableCell align="left" className={classes.topAlign}>
                            <SelectDropdown
                              suggestions={this.state.dataCategories}
                              handleChange={this.handleChangeField("category")}
                              placeholder="Filter"
                              value={{
                                label: this.state.filterCategory,
                                value: this.state.filterCategory
                              }}
                              createOptionPosition="first"
                            />
                          </TableCell>
                          <TableCell align="left" className={classes.topAlign}>
                            <SelectDropdown
                              suggestions={this.state.dataSubcategories}
                              handleChange={this.handleChangeField(
                                "sub_category"
                              )}
                              placeholder="Filter"
                              value={{
                                label: this.state.filterSubCategory,
                                value: this.state.filterSubCategory
                              }}
                              createOptionPosition="first"
                            />
                          </TableCell>
                          <TableCell align="left" className={classes.topAlign}>
                            <SelectDropdown
                              suggestions={this.state.dataOptions}
                              handleChange={this.handleChangeField("option")}
                              placeholder="Filter"
                              createOptionPosition="first"
                            />
                          </TableCell>
                          <TableCell align="left" className={classes.topAlign}>
                            <TextField
                              id="value"
                              label="Filter"
                              className={
                                classes.textField + " " + classes.fullWidth
                              }
                              type="search"
                              value={this.state.filterValue}
                              onChange={this.handleChangeField("value")}
                            />
                          </TableCell>
                        </TableRow>
                      )}
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="5" align="center">
                            <div className={classes.centerText}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.networkConfigurationData.map(row => (
                          <TableRow hover key={row.id}>
                            <TableCell align="left">
                              {general.epochToJsDate(row.timestamp)}
                            </TableCell>
                            <TableCell align="left">{row.category}</TableCell>
                            <TableCell align="left">
                              {row.sub_category}
                            </TableCell>
                            <TableCell align="left">{row.option}</TableCell>
                            {/* <TableCell align="left">{general.addUnitsValues(row.option, row.value)}</TableCell> */}
                            <TableCell align="left">{row.value}</TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.networkConfigurationData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="4" align="justify">
                              No available data
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
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
              </Paper>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

NetworkConfiguration.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  globalDTPickerValue: PropTypes.string.isRequired,
  handleChangeGlobalDTPicker: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(NetworkConfiguration));
