import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import CircularProgress from "@material-ui/core/CircularProgress";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

// helpers
import request from "utils/request";
import replace from "lodash/replace";
import startCase from "lodash/startCase";
import toLower from "lodash/toLower";

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
    marginTop: theme.spacing.unit * 3
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

class AlarmSummary extends React.Component {
  state = {
    loading: false,
    loading2: false,
    obuGeneralData: {},
    deviceOverviewList: [],
    tabValue: 0
  };

  componentDidMount() {
    this.getOBUSummary();
    this.getDeviceOverview();
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };
  toggleLoading2 = isLoading => {
    this.setState({
      loading2: isLoading
    });
  };

  getOBUSummary = () => {
    const { vessel_id, vessel_name } = this.props.match.params;
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/summary/index";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET",
      params: { vessel_id }
    })
      .then(response => {
        this.toggleLoading(false);
        if (!this.props.handleRequest(response)) return;
        this.setState({
          obuGeneralData: response.data,
          vessel_name
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getDeviceOverview = () => {
    const { vessel_id } = this.props.match.params;
    const { tabValue } = this.state;
    const requestURL = process.env.REACT_APP_API_URL + "/alarm/device-overview";
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
        format = "hours";
    }
    this.toggleLoading2(true);
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id,
        format
      }
    })
      .then(response => {
        this.toggleLoading2(false);

        if (!this.props.handleRequest(response)) return;
        this.setState({
          deviceOverviewList: response.data
        });
      })
      .catch(() => {
        this.toggleLoading2(false);
        this.props.handleRequest(false);
      });
  };

  renderDeviceTable = () => {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow hover>
                <TableCell align="left">#</TableCell>
                <TableCell align="left">Device</TableCell>
                <TableCell align="left">Critical</TableCell>
                <TableCell align="left">Warning</TableCell>
                <TableCell align="left">Alert</TableCell>
                <TableCell align="left">Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.loading2 && (
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <div className={classes.centerAlign}>
                      <CircularProgress className={classes.progress} />
                    </div>
                  </TableCell>
                </TableRow>
              )}
              {!this.state.loading2 &&
                this.state.deviceOverviewList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan="6" align="center">
                      No available data.
                    </TableCell>
                  </TableRow>
                )}
              {!this.state.loading2 &&
                this.state.deviceOverviewList.map((data, indx) => {
                  return (
                    <TableRow hover key={"row" + data.device + indx}>
                      <TableCell align="left">{indx + 1}</TableCell>
                      <TableCell align="left">{data.device}</TableCell>
                      <TableCell align="left">{data.Critical}</TableCell>
                      <TableCell align="left">{data.Warning}</TableCell>
                      <TableCell align="left">{data.Alert}</TableCell>
                      <TableCell align="left">{data.Info}</TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </GridItem>
        <GridItem xs={12} sm={12} md={6} lg={6}>
          <ResponsiveContainer height="100%" width="100%">
            <BarChart
              data={this.state.deviceOverviewList}
              margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Critical" fill="#ff00ff" />
              <Bar dataKey="Warning" fill="#ff7f00" />
              <Bar dataKey="Alert" fill="#ff0000" />
              <Bar dataKey="Info" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </GridItem>
      </GridContainer>
    );
  };

  renderOBUTable = data => {
    if (!data) return;
    const { classes } = this.props;
    const { obuGeneralData } = this.state;
    return (
      <Table className={classes.table}>
        <TableBody>
          {this.state.loading && (
            <TableRow>
              <TableCell colSpan="2" align="center">
                <div className={classes.centerAlign}>
                  <CircularProgress className={classes.progress} />
                </div>
              </TableCell>
            </TableRow>
          )}
          {!this.state.loading &&
            Object.keys(obuGeneralData).map(item => {
              let label = replace(item, new RegExp("_", "g"), " ");
              return (
                <TableRow key={item} className={classes.tableRow}>
                  <TableCell>{startCase(toLower(label))}</TableCell>
                  <TableCell>{obuGeneralData[item]}</TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    );
  };

  handleTabChange = (event, tabVal) => {
    this.setState(
      {
        tabValue: tabVal
      },
      () => {
        this.getDeviceOverview();
      }
    );
  };

  render() {
    const { classes } = this.props;
    const { tabValue } = this.state;

    return (
      <React.Fragment>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray" className={classes.CardHeaderIcon}>
                <h4 className={classes.cardTitleWhite}>OBU Summary</h4>
                <h5>
                  {this.state.vessel_name} | {this.state.obuGeneralData.imo}
                </h5>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="gray" className={classes.CardHeaderIcon}>
                      <h4 className={classes.cardTitleWhite}>General Info</h4>
                    </CardHeader>
                    <CardBody className={classes.noPaddingTop}>
                      {this.renderOBUTable(this.state.obuGeneralData)}
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem xs={12} sm={12} md={12}>
                  <Card>
                    <CardHeader color="gray" className={classes.CardHeaderIcon}>
                      <h4 className={classes.cardTitleWhite}>
                        Device Overview
                      </h4>
                    </CardHeader>
                    <CardBody className={classes.noPaddingTop}>
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
                        {this.renderDeviceTable()}
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </React.Fragment>
    );
  }
}

AlarmSummary.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(AlarmSummary));
