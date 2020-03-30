import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import { Progress, UncontrolledTooltip, Table } from "reactstrap";
import { NavLink } from "react-router-dom";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Table2 from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import BugReport from "@material-ui/icons/BugReport"; //debug
import Notifications from "@material-ui/icons/Notifications"; //alert
import Warning from "@material-ui/icons/Warning"; //warning
import Info from "@material-ui/icons/Info"; //info
import Whatshot from "@material-ui/icons/Whatshot"; //critical
import Button from "@material-ui/core/Button";
import ArrowRight from "@material-ui/icons/ArrowRight";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

// helpers
import request from "utils/request";
import colors from "variables/colors";
import general from "variables/general";

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

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
  vAlignTop: {
    verticalAlign: "baseline"
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
  },
  orange: {
    color: colors.ORANGE
  },
  red: {
    color: colors.RED
  },
  violet: {
    color: colors.MAGENTA
  },
  green: {
    color: colors.GREEN
  },
  orangeBg: {
    backgroundColor: colors.ORANGE,
    borderRight: "1px solid"
  },
  redBg: {
    backgroundColor: colors.RED,
    borderRight: "1px solid"
  },
  violetBg: {
    backgroundColor: colors.MAGENTA,
    borderRight: "1px solid"
  },
  greenBg: {
    backgroundColor: colors.GREEN,
    borderRight: "1px solid"
  },
  blueBg: {
    backgroundColor: colors.BLUE,
    borderRight: "1px solid"
  },
  noMargin: {
    margin: "0"
  },
  noPaddingLR: {
    paddingLeft: "0",
    paddingRight: "0"
  },
  alignRight: {
    textAlign: "-webkit-right"
  },
  customTooltip: {
    backgroundColor: "#fff"
  },
  barChart: {
    width: "100%",
    margin: "15px"
  },
  tooltip: {
    marginTop: "0px",
    marginBottom: "0px",
    width: "100%",
    height: "100%"
  },
  hidden: {
    visibility: "hidden"
  }
});

class AlarmState extends React.Component {
  state = {
    tabValue: 0,
    alarmStateData: [],
    loading: false,
    alarmStateType: "",
    alarmStateDate: "."
  };

  componentDidMount() {
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
    this.getAlarmState(null, null);
    this.updateAlarmStateType(null);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    if (
      newProps.match.params.verbose_level !==
      this.props.match.params.verbose_level
    ) {
      this.getAlarmState(null, newProps.match.params);
      this.updateAlarmStateType(newProps.match.params);
    }
  }

  updateAlarmStateType(props) {
    const { verbose_level } = props || this.props.match.params;
    let aType = "Alarms";
    if (verbose_level === "20") {
      aType = "Alarms and Warnings";
    } else if (verbose_level === "50") {
      aType = "All";
    }

    this.setState({
      alarmStateType: aType
    });
  }

  handleTabChange = (event, tabValue) => {
    this.setState({ tabValue });
    let format = "";
    switch (tabValue) {
      case 1:
        format = "day";
        break;
      case 2:
        format = "week";
        break;
      case 3:
        format = "month";
        break;
      case 4:
        format = "quarter";
        break;
      case 5:
        format = "annual";
        break;
      default:
        format = "";
    }
    this.getAlarmState(format, null);
  };

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  getAlarmState = (ts, newprops) => {
    const { vessel_id, verbose_level } = newprops || this.props.match.params;
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/state/index";
    let dateEpoch = ts;
    if (!ts) {
      dateEpoch = "";
    }
    let vessId = vessel_id;
    if (vessel_id === "all") {
      vessId = "";
    }
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET",
      params: {
        verbose_level,
        format: dateEpoch,
        vessel_id: vessId
      }
    })
      .then(response => {
        this.toggleLoading(false);
        if (!this.props.handleRequest(response)) return;
        this.setState({
          alarmStateData: response.data
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  createUrlLink = data => {
    if (data.device === "COREVALUES") {
      return (
        "/vessel/corevalues/" +
        data.vessel_id +
        "/" +
        data.vessel_name +
        "?module=" +
        data.module +
        "&option=" +
        data.option
      );
    } else if (data.device === "FAILOVER") {
      return (
        "/vessel/failover/" +
        data.vessel_id +
        "/" +
        data.vessel_name +
        "?module=" +
        data.module +
        "&option=" +
        data.option
      );
    } else {
      return (
        "/device/" +
        data.vessel_id +
        "/" +
        data.device_id +
        "/" +
        data.device +
        "/" +
        data.vessel_name +
        "?module=" +
        data.module +
        "&option=" +
        data.option
      );
    }
  };

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
            <NavLink
              key={"list" + data.vessel_name + indx}
              to={this.createUrlLink(data)}
            >
              <ListItem className={classes.noPaddingLR}>
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
            </NavLink>
          );
        })}
      </List>
    );
  }

  renderResultCell2(results, indx0) {
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
              className={classes.noPaddingLR}
              key={"list" + data.vessel_name + indx}
            >
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <NavLink
                    key={"list" + data.vessel_name + indx}
                    to={this.createUrlLink(data)}
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
                  </NavLink>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.barChart}>
                    <Progress multi>
                      {data.datas.map((d, indx2) => {
                        return (
                          <React.Fragment key={"progress" + indx + indx2}>
                            {d.start_time &&
                              d.end_time && (
                                <Progress
                                  bar
                                  value={d.percentage}
                                  className={classes[d.remarks + "Bg"]}
                                >
                                  <div
                                    className={classes.tooltip}
                                    id={
                                      d.message.split(" ").join("") +
                                      (
                                        parseInt(d.start_time, 10) +
                                        parseInt(d.end_time, 10)
                                      ).toString() +
                                      indx0 +
                                      indx +
                                      indx2
                                    }
                                  >
                                    {/* {d.percentage} */}
                                  </div>
                                </Progress>
                              )}
                            {d.start_time &&
                              d.end_time && (
                                <UncontrolledTooltip
                                  placement="top"
                                  target={
                                    d.message.split(" ").join("") +
                                    (
                                      parseInt(d.start_time, 10) +
                                      parseInt(d.end_time, 10)
                                    ).toString() +
                                    indx0 +
                                    indx +
                                    indx2
                                  }
                                >
                                  {`${general.epochToJsDate(
                                    d.start_time
                                  )} to ${general.epochToJsDate(
                                    d.end_time
                                  )} (${d.message.split(" ").join("")})`}
                                </UncontrolledTooltip>
                              )}
                          </React.Fragment>
                        );
                      })}
                    </Progress>
                  </div>
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    );
  }

  renderResultCell3(results, tabValue, indx0) {
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

    const createTTip = (data, message) => {
      let dateTime = "";
      if (tabValue === 4 || tabValue === 5) {
        dateTime = `${general.epochToJsDate(
          data.start_time
        )} to ${general.epochToJsDate(data.end_time)}`;
      } else {
        dateTime = general.epochToJsDate(data.epoch_date);
      }
      return `${dateTime} : 
                No Data=${data.blue} Ok=${data.green} Unknown=${
        data.orange
      } Alarm=${data.red} Invalid=${data.violet} 
                (${message})`;
    };

    return (
      <List dense={true}>
        {results.map((data, indx) => {
          return (
            <ListItem
              className={classes.noPaddingLR}
              key={"list" + data.vessel_name + indx}
            >
              <Grid container spacing={24}>
                <Grid item xs={6}>
                  <NavLink
                    key={"list" + data.vessel_name + indx}
                    to={this.createUrlLink(data)}
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
                  </NavLink>
                </Grid>
                <Grid item xs={6}>
                  <div className={classes.barChart}>
                    <Progress multi>
                      {data.datas.map((d, indx2) => {
                        return (
                          <React.Fragment key={"progress" + indx + indx2}>
                            {d.blue > 0 && (
                              <Progress
                                bar
                                value={d.blue}
                                className={classes["blueBg"]}
                              >
                                <div
                                  className={classes.tooltip}
                                  id={"blueBar" + indx0 + indx + indx2}
                                >
                                  {/* {d.blue} */}
                                </div>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"blueBar" + indx0 + indx + indx2}
                                >
                                  {createTTip(d, data.message)}
                                </UncontrolledTooltip>
                              </Progress>
                            )}

                            {d.green > 0 && (
                              <Progress
                                bar
                                value={d.green}
                                className={classes["greenBg"]}
                              >
                                <div
                                  className={classes.tooltip}
                                  id={"greenBar" + indx0 + indx + indx2}
                                >
                                  {/* {d.green} */}
                                </div>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"greenBar" + indx0 + indx + indx2}
                                >
                                  {createTTip(d, data.message)}
                                </UncontrolledTooltip>
                              </Progress>
                            )}

                            {d.orange > 0 && (
                              <Progress
                                bar
                                value={d.orange}
                                className={classes["orangeBg"]}
                              >
                                <div
                                  className={classes.tooltip}
                                  id={"orangeBar" + indx0 + indx + indx2}
                                >
                                  {/* {d.orange} */}
                                </div>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"orangeBar" + indx0 + indx + indx2}
                                >
                                  {createTTip(d, data.message)}
                                </UncontrolledTooltip>
                              </Progress>
                            )}

                            {d.red > 0 && (
                              <Progress
                                bar
                                value={d.red}
                                className={classes["redBg"]}
                              >
                                <div
                                  className={classes.tooltip}
                                  id={"redBar" + indx0 + indx + indx2}
                                >
                                  {/* {d.red} */}
                                </div>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"redBar" + indx0 + indx + indx2}
                                >
                                  {createTTip(d, data.message)}
                                </UncontrolledTooltip>
                              </Progress>
                            )}

                            {d.violet > 0 && (
                              <Progress
                                bar
                                value={d.violet}
                                className={classes["violetBg"]}
                              >
                                <div
                                  className={classes.tooltip}
                                  id={"violetBar" + indx0 + indx + indx2}
                                >
                                  {/* {d.violet} */}
                                </div>
                                <UncontrolledTooltip
                                  placement="top"
                                  target={"violetBar" + indx0 + indx + indx2}
                                >
                                  {createTTip(d, data.message)}
                                </UncontrolledTooltip>
                              </Progress>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </Progress>
                  </div>
                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
    );
  }

  renderTimeStampCell(results) {
    const { classes } = this.props;
    return (
      <List dense={true}>
        {results
          .filter(data => {
            return data.datas[0];
          })
          .map((data, indx) => {
            return (
              <ListItem
                className={classes.noPaddingLR}
                key={"list" + data.datas[0].timestamp + indx}
              >
                <Button
                  variant="contained"
                  size="small"
                  className={classes.button}
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

  renderTabContents() {
    const { classes } = this.props;
    const { tabValue } = this.state;

    if (tabValue === 0) {
      return (
        <TabContainer>
          <Table2 className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Level</TableCell>
                <TableCell align="left">Description</TableCell>
                <TableCell align="left">Result</TableCell>
                <TableCell align="left">TimeStamp</TableCell>
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
                this.state.alarmStateData.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="4" align="center">
                      No available data.
                    </TableCell>
                  </TableRow>
                )}
              {!this.state.loading &&
                this.state.alarmStateData.length > 0 &&
                this.state.alarmStateData
                  .filter(row => {
                    return row.results.length > 0;
                  })
                  .map(row => {
                    return (
                      <TableRow key={row.vessel}>
                        <TableCell className={classes.vAlignTop}>
                          {this.renderVerboseTypeButton(row.alarm_type)}
                        </TableCell>
                        <TableCell className={classes.vAlignTop}>
                          {row.alarm_description}
                        </TableCell>
                        <TableCell>
                          {this.renderResultCell(row.results)}
                        </TableCell>
                        <TableCell>
                          {this.renderTimeStampCell(row.results)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
            </TableBody>
          </Table2>
        </TabContainer>
      );
    } else if (tabValue === 1) {
      return (
        <TabContainer>
          <Table size="sm" className={classes.table}>
            <thead>
              <tr>
                <td padding="dense" align="left">
                  Level
                </td>
                <td padding="dense" align="left">
                  Description
                </td>
                <td align="left">Result</td>
              </tr>
            </thead>
            <tbody>
              {this.state.loading && (
                <tr>
                  <td colSpan="3" align="center">
                    <div className={classes.centerAlign}>
                      <CircularProgress className={classes.progress} />
                    </div>
                  </td>
                </tr>
              )}
              {!this.state.loading &&
                this.state.alarmStateData.length === 0 && (
                  <tr>
                    <td colSpan="3" align="center">
                      No available data.
                    </td>
                  </tr>
                )}
              {!this.state.loading &&
                this.state.alarmStateData.length > 0 &&
                this.state.alarmStateData
                  .filter(row => {
                    return row.results.length > 0;
                  })
                  .map((row, index) => {
                    return (
                      <tr key={row.vessel}>
                        <td padding="dense" className={classes.vAlignTop}>
                          {this.renderVerboseTypeButton(row.alarm_type)}
                        </td>
                        <td padding="dense" className={classes.vAlignTop}>
                          {row.alarm_description}
                        </td>
                        <td className={classes.vAlignTop}>
                          {this.renderResultCell2(row.results, index)}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>
        </TabContainer>
      );
    } else if (
      tabValue === 2 ||
      tabValue === 3 ||
      tabValue === 4 ||
      tabValue === 5
    ) {
      return (
        <TabContainer>
          <Table size="sm" className={classes.table}>
            <thead>
              <tr>
                <td padding="dense" align="left">
                  Level
                </td>
                <td padding="dense" align="left">
                  Description
                </td>
                <td align="left">Result</td>
              </tr>
            </thead>
            <tbody>
              {this.state.loading && (
                <tr>
                  <td colSpan="3" align="center">
                    <div className={classes.centerAlign}>
                      <CircularProgress className={classes.progress} />
                    </div>
                  </td>
                </tr>
              )}
              {!this.state.loading &&
                this.state.alarmStateData.length === 0 && (
                  <tr>
                    <td colSpan="3" align="center">
                      No available data.
                    </td>
                  </tr>
                )}
              {!this.state.loading &&
                this.state.alarmStateData.length > 0 &&
                this.state.alarmStateData
                  .filter(row => {
                    return row.results.length > 0;
                  })
                  .map((row, index) => {
                    return (
                      <tr key={row.vessel}>
                        <td padding="dense" className={classes.vAlignTop}>
                          {this.renderVerboseTypeButton(row.alarm_type)}
                        </td>
                        <td padding="dense" className={classes.vAlignTop}>
                          {row.alarm_description}
                        </td>
                        <td className={classes.vAlignTop}>
                          {this.renderResultCell3(row.results, tabValue, index)}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </Table>
        </TabContainer>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const { tabValue } = this.state;

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>
                Alarm State: {this.state.alarmStateType}
              </h4>
            </CardHeader>
            <CardBody className={classes.centerText}>
              <p>
                Showing last available data
                {this.state.alarmStateDate}
              </p>
              <div className={classes.root}>
                <AppBar position="static" color="default">
                  <Tabs
                    value={tabValue}
                    onChange={this.handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="auto"
                  >
                    <Tab label="Current" />
                    <Tab label="24 Hours" />
                    <Tab label="7 Days" />
                    <Tab label="1 Month" />
                    <Tab label="3 Months" />
                    <Tab label="1 Year" />
                  </Tabs>
                </AppBar>
                {this.renderTabContents()}
              </div>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

AlarmState.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(AlarmState));
