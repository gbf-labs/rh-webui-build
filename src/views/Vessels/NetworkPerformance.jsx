import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import {
  ResponsiveContainer,
  Brush,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
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
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import Select from "react-select";
import MaterialTooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";

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
import auth from "utils/auth";

const moment = require("moment-timezone");

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 200
  },
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
  toggleContainer: {
    height: 56,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: `${theme.spacing.unit}px 0`,
    background: theme.palette.background.default
  },
  chartContainer: {
    width: "100%",
    height: "400px"
  },
  alignLeft: {
    textAlign: "left"
  },
  noPadding: {
    padding: "0px !important"
  }
});

let timer = null,
  networkPerflInterval = null,
  chartsInterval = null,
  chartsInterval2 = null;
class NetworkPerformance extends React.Component {
  state = {
    //table
    networkPerformanceData: [],
    dataCategories: [],
    dataSubcategories: [],
    dataOptions: [],
    loading: false,
    loading2: false,

    //graphs
    graphFilter: "24",
    graphNameListStatistics: {},
    graphNameListStatisticsCombine: {},
    graphDataList: [],
    graphNameList: [],
    selectedGraphNameList: [],
    graphDataListCombine: [],
    graphNameListCombine: [],
    selectedGraphNameListCombine: [],

    //table filter
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
    filterOpen: true
  };

  componentDidMount() {
    this.getNetworkPerformance();
    this.getChartOptions();
    networkPerflInterval = setInterval(
      () => this.getNetworkPerformance(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    chartsInterval = setInterval(
      () => this.getCharts(false),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    chartsInterval2 = setInterval(
      () => this.getCharts(true),
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
          this.getNetworkPerformance();
          const dToday = new Date();
          const fDay = new Date(nextProps.globalDTPickerValue);
          let gFltr = "24";
          if (general.diffHours(fDay, dToday) <= 6) {
            gFltr = "6";
          } else if (
            general.diffHours(fDay, dToday) <= 12 &&
            general.diffHours(fDay, dToday) >= 7
          ) {
            gFltr = "12";
          } else if (
            general.diffHours(fDay, dToday) <= 24 &&
            general.diffHours(fDay, dToday) >= 13
          ) {
            gFltr = "24";
          } else if (
            general.diffHours(fDay, dToday) <= 120 &&
            general.diffHours(fDay, dToday) >= 25
          ) {
            gFltr = "120";
          } else if (general.diffHours(fDay, dToday) >= 168) {
            gFltr = "168";
          }

          this.setState(
            {
              graphFilter: gFltr
            },
            () => {
              this.getChartOptions();
            }
          );
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.handleChangeGlobalDTPicker(null);
    clearInterval(networkPerflInterval);
    clearInterval(chartsInterval);
    clearInterval(chartsInterval2);
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
        this.getNetworkPerformance();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getNetworkPerformance();
      }
    );
  };

  handleGraph = (event, val) => {
    if (val) {
      this.setState(
        {
          graphFilter: val
        },
        () => {
          this.getCharts(false);
          this.getCharts(true);
        }
      );
    }
  };

  updateVesselState(combined) {
    const requestURL = process.env.REACT_APP_API_URL + "/graph/selected";
    let selectedGraphs = [];

    if (combined) {
      for (let i = 0; i < this.state.selectedGraphNameListCombine.length; i++) {
        const sel = this.state.selectedGraphNameListCombine[i];
        selectedGraphs.push(sel.value);
      }
    } else {
      for (let i = 0; i < this.state.selectedGraphNameList.length; i++) {
        const sel = this.state.selectedGraphNameList[i];
        selectedGraphs.push(sel.value);
      }
    }
    const params = {
      device_type: "NTWPERF1",
      labels: selectedGraphs,
      select_type: combined ? "combine" : ""
    };
    let reqType = "PUT";

    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.getCharts(combined);
        this.props.enqueueSnackbar("Default selected graphs changed!", {
          variant: "success"
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  }

  getChartOptions() {
    const requestURL = process.env.REACT_APP_API_URL + "/graph";
    const vessId = this.props.match.params.vessel_id;
    this.toggleLoading2(true);
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId,
        device_id: "NTWPERF1",
        hours: this.state.graphFilter,
        keys: "",
        combine: false
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading2(false);

        let graphNameList = response.available_options;
        let graphNameListCombine = response.available_options;
        let selectedGraphNameList = response.default_selected;
        let selectedGraphNameListCombine = response.default_selected_combine;

        this.setState({
          graphNameList,
          graphNameListCombine,
          selectedGraphNameList,
          selectedGraphNameListCombine
        });

        this.getCharts(false);
        this.getCharts(true);
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  }

  getCharts(combine) {
    const combined = combine || false;
    let selectedGraphs = [];
    let requestURL = process.env.REACT_APP_API_URL + "/graph";
    if (combined) {
      for (let i = 0; i < this.state.selectedGraphNameListCombine.length; i++) {
        const sel = this.state.selectedGraphNameListCombine[i];
        selectedGraphs.push(sel.value);
      }
      requestURL = process.env.REACT_APP_API_URL + "/graph/combine";
    } else {
      for (let i = 0; i < this.state.selectedGraphNameList.length; i++) {
        const sel = this.state.selectedGraphNameList[i];
        selectedGraphs.push(sel.value);
      }
    }
    const vessId = this.props.match.params.vessel_id;
    this.toggleLoading2(true);
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId,
        device_id: "NTWPERF1",
        hours: this.state.graphFilter,
        keys: selectedGraphs.toString(),
        combine: combined
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading2(false);
        let graphNameList = response.available_options;
        let graphNameListCombine = response.available_options;

        if (combined) {
          this.setState({
            graphNameListStatisticsCombine: response.statistics.combine,
            graphDataListCombine: response.data,
            graphNameList,
            graphNameListCombine
          });
        } else {
          const graphDataList = [];
          for (let i = 0; i < selectedGraphs.length; i++) {
            const g = selectedGraphs[i];
            graphDataList.push({
              name: g,
              data: response.data[g]
            });
          }
          this.setState({
            graphNameListStatistics: response.statistics,
            graphDataList,
            graphNameList,
            graphNameListCombine
          });
        }
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  }

  getNetworkPerformance() {
    const requestURL =
      process.env.REACT_APP_API_URL + "/vessels/network/performance";
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
          networkPerformanceData: response.data,
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
      this.getNetworkPerformance();
    }, 500);
  };

  handleChangeGraph = event => {
    this.setState({ selectedGraphNameList: event }, () => {
      this.getCharts(false);
    });
  };

  handleChangeGraphCombine = event => {
    this.setState({ selectedGraphNameListCombine: event }, () => {
      this.getCharts(true);
    });
  };

  render() {
    const { classes } = this.props;
    const TTformatter = (value, name) => {
      return general.addUnitsValues(name, value);
    };
    moment.tz.setDefault("UTC");
    const getDomain = (data, typ) => {
      if (data) {
        if (typ === "min") {
          return parseFloat(data[typ]) - 10;
        } else {
          return parseFloat(data[typ]) + 10;
        }
      } else {
        if (typ === "min") {
          return "dataMin";
        } else {
          return "dataMax";
        }
      }
    };

    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>
                NETWORK PERFORMANCE
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
                                className={[
                                  classes.grid,
                                  classes.filterContainer
                                ]}
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
                          <TableCell colSpan="4" align="center">
                            <div className={classes.centerText}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.networkPerformanceData.map(row => (
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
                        this.state.networkPerformanceData.length === 0 && (
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
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>GRAPH</h4>
            </CardHeader>
            <CardBody className={classes.centerText}>
              <GridContainer>
                <GridItem xs={12} sm={4} md={4}>
                  {auth.getUserInfo() &&
                    auth.getUserInfo().admin && (
                      <FormControl className={classes.formControl}>
                        <GridContainer>
                          <GridItem xs={11} sm={11} md={11}>
                            <Select
                              value={this.state.selectedGraphNameList}
                              isMulti
                              name="single-graph"
                              options={this.state.graphNameList}
                              className={classes.alignLeft}
                              placeholder="Single Graphs"
                              onChange={this.handleChangeGraph}
                            />
                          </GridItem>
                          <GridItem
                            xs={1}
                            sm={1}
                            md={1}
                            className={classes.noPadding}
                          >
                            <MaterialTooltip
                              title="Save as default"
                              placement="right"
                            >
                              <IconButton
                                onClick={() => this.updateVesselState(false)}
                                className={
                                  classes.button + " " + classes.noPadding
                                }
                                aria-label="Save as default"
                              >
                                <SaveIcon />
                              </IconButton>
                            </MaterialTooltip>
                          </GridItem>
                        </GridContainer>
                      </FormControl>
                    )}
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  <div className={classes.toggleContainer}>
                    <ToggleButtonGroup
                      value={this.state.graphFilter}
                      exclusive
                      onChange={this.handleGraph}
                    >
                      <ToggleButton value="168">7 Days</ToggleButton>
                      <ToggleButton value="120">5 Days</ToggleButton>
                      <ToggleButton value="24">24 Hours</ToggleButton>
                      <ToggleButton value="12">12 Hours</ToggleButton>
                      <ToggleButton value="6">6 Hours</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                </GridItem>
                <GridItem xs={12} sm={4} md={4}>
                  {auth.getUserInfo() &&
                    auth.getUserInfo().admin && (
                      <FormControl className={classes.formControl}>
                        <GridContainer>
                          <GridItem xs={11} sm={11} md={11}>
                            <Select
                              value={this.state.selectedGraphNameListCombine}
                              isMulti
                              name="multiple-graph"
                              options={this.state.graphNameListCombine}
                              className={classes.alignLeft}
                              placeholder="Combine Graphs"
                              onChange={this.handleChangeGraphCombine}
                            />
                          </GridItem>
                          <GridItem
                            xs={1}
                            sm={1}
                            md={1}
                            className={classes.noPadding}
                          >
                            <MaterialTooltip
                              title="Save as default"
                              placement="right"
                            >
                              <IconButton
                                onClick={() => this.updateVesselState(true)}
                                className={
                                  classes.button + " " + classes.noPadding
                                }
                                aria-label="Save as default"
                              >
                                <SaveIcon />
                              </IconButton>
                            </MaterialTooltip>
                          </GridItem>
                        </GridContainer>
                      </FormControl>
                    )}
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  {this.state.loading2 && (
                    <Table>
                      <TableRow>
                        <TableCell colSpan="4" align="center">
                          <div className={classes.centerText}>
                            <CircularProgress className={classes.progress} />
                          </div>
                        </TableCell>
                      </TableRow>
                    </Table>
                  )}
                  {!this.state.loading2 &&
                    this.state.selectedGraphNameList.length === 0 &&
                    this.state.selectedGraphNameListCombine.length === 0 && (
                      <Table>
                        <TableRow>
                          <TableCell colSpan="4" align="center">
                            <div className={classes.centerText}>
                              No graphs selected.
                            </div>
                          </TableCell>
                        </TableRow>
                      </Table>
                    )}
                  {!this.state.loading2 &&
                    this.state.selectedGraphNameListCombine.length > 0 && (
                      <div className={classes.chartContainer}>
                        <ResponsiveContainer>
                          <LineChart
                            syncId="LineChartId"
                            data={this.state.graphDataListCombine}
                            margin={{ top: 20, right: 0, bottom: 0, left: 10 }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis
                              yAxisId="left"
                              orientation="left"
                              stroke="#8884d8"
                              domain={[
                                getDomain(
                                  this.state.graphNameListStatisticsCombine,
                                  "min"
                                ),
                                getDomain(
                                  this.state.graphNameListStatisticsCombine,
                                  "max"
                                )
                              ]}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={TTformatter} />
                            <Legend verticalAlign="top" height={36} />
                            {this.state.graphDataListCombine.length > 0 && (
                              <Brush
                                dataKey="name"
                                height={30}
                                stroke="#8884d8"
                              />
                            )}
                            {this.state.graphDataListCombine.length > 0 &&
                              this.state.selectedGraphNameListCombine.map(
                                (row, indx) => (
                                  <Line
                                    key={"line" + row.value + indx}
                                    dot={this.state.graphFilter <= 24}
                                    type="linear"
                                    yAxisId="left"
                                    dataKey={row.value}
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                  />
                                )
                              )}
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  {!this.state.loading2 &&
                    this.state.selectedGraphNameList.length > 0 &&
                    this.state.graphDataList.map((row, index) => (
                      <div
                        className={classes.chartContainer}
                        key={"linechart" + row.name + index}
                      >
                        <ResponsiveContainer>
                          <LineChart
                            syncId="LineChartId"
                            data={row.data}
                            margin={{ top: 20, right: 0, bottom: 0, left: 10 }}
                          >
                            <XAxis dataKey="name" />
                            <YAxis
                              yAxisId="left"
                              orientation="left"
                              stroke="#8884d8"
                              domain={[
                                getDomain(
                                  this.state.graphNameListStatistics[row.name],
                                  "min"
                                ),
                                getDomain(
                                  this.state.graphNameListStatistics[row.name],
                                  "max"
                                )
                              ]}
                            />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={TTformatter} />
                            <Legend verticalAlign="top" height={36} />
                            {this.state.selectedGraphNameListCombine.length ===
                              0 &&
                              index === 0 && (
                                <Brush
                                  dataKey="name"
                                  height={30}
                                  stroke="#8884d8"
                                />
                              )}
                            <Line
                              dot={this.state.graphFilter <= 24}
                              type="linear"
                              yAxisId="left"
                              dataKey={row.name}
                              stroke="#8884d8"
                              fill="#8884d8"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    ))}
                </GridItem>
              </GridContainer>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

NetworkPerformance.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  globalDTPickerValue: PropTypes.string.isRequired,
  handleChangeGlobalDTPicker: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(NetworkPerformance));
