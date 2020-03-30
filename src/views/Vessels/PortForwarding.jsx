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
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

//core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

//helpers
import request from "utils/request";

const styles = () => ({
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
  }
});

let timer = null,
  portForwInterval = null;
class Portforwarding extends React.Component {
  state = {
    portForwardingData: [],
    dataModules: [],
    dataOptions: [],
    filterDate: "",
    filterModule: "",
    filterOption: "",
    filterValue: "",
    sortType: "",
    sortVal: "",
    limit: 10,
    page: 0,
    totalCount: 0,
    loading: false
  };

  componentDidMount() {
    this.getPortForwading();
    portForwInterval = setInterval(
      () => this.getPortForwading(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(portForwInterval);
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
        this.getPortForwading();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getPortForwading();
      }
    );
  };

  getPortForwading() {
    const requestURL =
      process.env.REACT_APP_API_URL + "/device/port/forwarding";
    const vessId = this.props.match.params.vessel_id;
    this.toggleLoading(true);

    let filCol = [],
      filVal = [];
    if (this.state.filterModule.trim() !== "") {
      filCol.push("module");
      filVal.push(this.state.filterModule);
    }
    if (this.state.filterOption.trim() !== "") {
      filCol.push("option");
      filVal.push(this.state.filterOption);
    }
    if (this.state.filterValue.trim() !== "") {
      filCol.push("value");
      filVal.push(this.state.filterValue);
    }

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId,
        limit: this.state.limit,
        start_date: this.state.filterDate,
        end_date: this.state.filterDate,
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
          portForwardingData: response.data,
          totalCount: response.total_rows,
          dataModules: [{ label: "", value: "" }].concat(response.modules),
          dataOptions: [{ label: "", value: "" }].concat(response.options)
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  }

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleChangeField = name => event => {
    clearInterval(timer);
    if (name === "module") {
      this.setState({
        filterModule: event.value,
        page: 0
      });
    } else if (name === "option") {
      this.setState({
        filterOption: event.value,
        page: 0
      });
    } else {
      const val = event.target.value;
      if (name === "datetime") {
        this.setState({
          filterDate: val,
          page: 0
        });
      } else if (name === "value") {
        this.setState({
          filterValue: val,
          page: 0
        });
      }
    }
    timer = setTimeout(() => {
      this.getPortForwading();
    }, 500);
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>PORT FORWARDING</h4>
            </CardHeader>
            <CardBody className={classes.centerText}>
              <Paper className={classes.root}>
                <div>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Link</TableCell>
                        <TableCell align="left">Destination</TableCell>
                        <TableCell align="left">Device</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="3" align="center">
                            <div className={classes.centerText}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.portForwardingData.map(row => (
                          <TableRow hover key={row.id}>
                            <TableCell align="left">
                              {row.link && (
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={row.link}
                                >
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.button}
                                  >
                                    {row.description}
                                  </Button>
                                </a>
                              )}
                              {row.link === "" && (
                                <Button
                                  disabled="true"
                                  variant="contained"
                                  color="primary"
                                  className={classes.button}
                                >
                                  {row.description}
                                </Button>
                              )}
                            </TableCell>
                            <TableCell align="left">
                              {row.destination_ip}:{row.destination_port}
                            </TableCell>
                            <TableCell align="left">{row.device}</TableCell>
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.portForwardingData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="3" align="justify">
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

Portforwarding.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(Portforwarding));
