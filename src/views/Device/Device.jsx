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

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import BugReport from "@material-ui/icons/BugReport"; //debug
import Notifications from "@material-ui/icons/Notifications"; //alert
import Warning from "@material-ui/icons/Warning"; //warning
import Info from "@material-ui/icons/Info"; //info
import Whatshot from "@material-ui/icons/Whatshot"; //critical
import Button from "@material-ui/core/Button";
import ArrowRight from "@material-ui/icons/ArrowRight";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Grid from "@material-ui/core/Grid";
import green from "@material-ui/core/colors/green";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import FormControl from "@material-ui/core/FormControl";
import Select from "react-select";
import MaterialTooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import SaveIcon from "@material-ui/icons/Save";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import RemoteConsoleDialog from "components/Dialogs/RemoteConsoleDialog";
import SelectDropdown from "components/AutoComplete/SelectDropdown.jsx";
import CiscoSwitch from "components/DeviceImages/CiscoSwitch.jsx";
import IOP from "components/DeviceImages/IOP";
import VSAT from "components/DeviceImages/VSAT";
import VSATSailor900 from "components/DeviceImages/VSATSailor900";
import PowerSwitch from "components/DeviceImages/PowerSwitch";
import Modem from "components/DeviceImages/Modem";
import AzView from "components/DeviceImages/AzView";
import ElView from "components/DeviceImages/ElView";
import AlarmPanel from "components/DeviceImages/AlarmPanel";
import VHF from "components/DeviceImages/VHF";
import SATC from "components/DeviceImages/SATC";
import FBB from "components/DeviceImages/FBB";

import request from "utils/request";
import general from "variables/general";
import auth from "utils/auth";
import colors from "variables/colors";

const moment = require("moment-timezone");

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
    display: "flex",
    flexWrap: "wrap"
  },
  button: {
    margin: "10px 0"
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
  cardHeaderZIndex: {
    zIndex: "0 !important"
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
  leftText: {
    textAlign: "left"
  },
  topAlign: {
    verticalAlign: "top"
  },
  devSize: {
    width: "30%",
    margin: "10px"
  },
  marginLeft: {
    marginLeft: "10px"
  },
  marginBottom: {
    marginBottom: "15px"
  },
  noMarginTop: {
    marginTop: "0px"
  },
  vsatOffsetMargin: {
    marginTop: "-50px"
  },
  responsiveImg: {
    height: "auto",
    width: "auto",
    maxHeight: "150px",
    background: "black"
  },
  overFlowXAuto: {
    overflowX: "auto"
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: -6,
    left: -6,
    zIndex: 1
  },
  listHead: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "25%",
    flexShrink: 0
  },
  noOpa: {
    opacity: "1 !important"
  },
  whBG: {
    background: "white"
  },
  textField: {
    fontSize: theme.typography.pxToRem(15),
    margin: "0 -10px"
  },
  fullWidth: {
    background: "white",
    width: "100%",
    padding: "4px 0px 4px 0px",
    "margin-top": "12px"
  },
  tableLayout: {
    tableLayout: "fixed"
  },
  filterContainer: {
    display: "flex",
    flexDirection: "column"
  },
  filterIcon: {
    float: "right",
    fontSize: "25px !important",
    cursor: "pointer"
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
  autoOverFlow: {
    overflow: "auto"
  },
  thWidth: {
    width: "20%"
  },
  marginTopOffset: {
    marginTop: "-75px"
  },
  noMargin: {
    margin: "0"
  },
  buttonMin: {
    minWidth: "230px"
  }
});

let timer = null,
  devInfoInterval = null,
  devListInterval = null,
  remoteCommInterval = null,
  alarmStInterval = null,
  portForwInterval = null,
  chartsInterval = null,
  chartsInterval2 = null;
class Device extends React.Component {
  state = {
    //table
    deviceData: [],
    remoteCommands: [],
    alarmStateData: [],
    dataCategories: [],
    dataSubcategories: [],
    dataOptions: [],
    devImage: "",
    device: [],
    limit: 10,
    page: 0,
    totalCount: 0,
    portForwardingData: [],
    //table filter
    filterDateTime: null,
    filterCategory: "",
    filterSubCategory: "",
    filterOption: "",
    filterValue: "",
    sortType: "",
    sortVal: "",
    loading0: false,
    loading: false,
    loading2: false,
    filterOpen: true,
    updateState: "",
    //graphs
    graphFilter: "24",
    graphDataList: [],
    graphNameListStatistics: {},
    graphNameListStatisticsCombine: {},
    graphNameList: [],
    selectedGraphNameList: [],
    graphDataListCombine: [],
    graphNameListCombine: [],
    selectedGraphNameListCombine: [],
    //remote dialog
    remoteDialog: {
      openDialog: false,
      title: "",
      others: [],
      description: "",
      key: "",
      label: ""
    },
    courseUp: false
  };

  componentDidMount() {
    const moduleQryPrms = general.getQueryVariable("module") || "";
    const optionQryPrms = general.getQueryVariable("option") || "";
    if (moduleQryPrms || optionQryPrms) {
      this.setState(
        {
          filterCategory: moduleQryPrms,
          filterOption: optionQryPrms
        },
        () => this.getDeviceInfo()
      );
    } else {
      this.getDeviceInfo();
    }
    this.getDeviceList();
    this.getPortForwading();
    this.getRemoteCommands();
    this.getAlarmState();

    devInfoInterval = setInterval(
      () => this.getDeviceInfo(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    devListInterval = setInterval(
      () => this.getDeviceList(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    portForwInterval = setInterval(
      () => this.getPortForwading(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    remoteCommInterval = setInterval(
      () => this.getRemoteCommands(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    alarmStInterval = setInterval(
      () => this.getAlarmState(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );

    this.getChartOptions();
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
          this.getDeviceInfo();
          this.getDeviceList();
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
    clearInterval(devInfoInterval);
    clearInterval(devListInterval);
    clearInterval(portForwInterval);
    clearInterval(remoteCommInterval);
    clearInterval(alarmStInterval);
    clearInterval(chartsInterval);
    clearInterval(chartsInterval2);
  }

  toggleLoading0 = isLoading => {
    this.setState({
      loading0: isLoading
    });
  };

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

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false
    });
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

  regexCheck = str => {
    return new RegExp("NTWPERF").test(str);
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
      device_type: this.state.device.device_type,
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
        device_id: this.props.match.params.device_id,
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
        device_id: this.props.match.params.device_id,
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

  getDeviceList = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/device/list";
    let dt = "";
    if (this.state.filterDateTime) {
      dt = general.jsDateToEpoch(new Date(this.state.filterDateTime));
    }
    this.toggleLoading0(true);

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: this.props.match.params.vessel_id,
        device_id: this.props.match.params.device_id,
        date: dt
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading0(false);

        const img = general.getDeviceImage(
          response.data[0],
          response.data[0].general
        );
        this.setState({
          device: response.data[0],
          devImage: img
        });
      })
      .catch(() => {
        this.toggleLoading0(false);
        this.props.handleRequest(false);
      });
  };

  getDeviceInfo = () => {
    this.toggleLoading(true);
    const requestURL = process.env.REACT_APP_API_URL + "/device/state";
    const vessId = this.props.match.params.vessel_id;
    const devId = this.props.match.params.device_id;
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
        device_id: devId,
        date: dt,
        limit: this.state.limit,
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
          deviceData: response.data,
          totalCount: response.total_rows,
          dataCategories: response.categories,
          dataSubcategories: response.subcategories,
          dataOptions: response.options,
          updateState: general.epochToJsDate(response.update_state)
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  getPortForwading() {
    const requestURL =
      process.env.REACT_APP_API_URL + "/device/port/forwarding";
    const vessId = this.props.match.params.vessel_id;
    const devId = this.props.match.params.device_id;
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId,
        device_id: devId,
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

  handleClickOpen = (key, data, label) => {
    this.setState({
      remoteDialog: {
        openDialog: true,
        title: data.option,
        others: data.others,
        description: data.description,
        key,
        label
      }
    });
  };

  handleClose = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.remoteDialog.openDialog = false;
    this.setState(stateCopy);
  };

  createOthersData = () => {
    let stateCopy = Object.assign({}, this.state);
    let othersNew = {};
    for (let i = 0; i < stateCopy.remoteDialog.others.length; i++) {
      const othr = stateCopy.remoteDialog.others[i];
      othersNew[othr.name] = othr.selected;
    }
    this.postRemoteCommands(
      stateCopy.remoteDialog.key,
      othersNew,
      stateCopy.remoteDialog.label
    );
  };

  postRemoteCommands(key, others, label) {
    const requestURL = process.env.REACT_APP_API_URL + "/remote/command";
    const params = {
      key,
      others,
      label,
      vessel_id: this.props.match.params.vessel_id
    };
    let reqType = "POST";
    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar("Success", { variant: "success" });

        this.props.history.push({
          pathname:
            "/vessel/remoteconsole-result/" +
            this.props.match.params.vessel_id +
            "/" +
            this.props.match.params.vessel_name,
          state: {
            connectionInfo: response.connection_info,
            commandInfo: response.command_info,
            commandResult: response.output,
            commandLabel: label,
            commandKey: key
          }
        });
      })
      .catch(() => {
        this.props.enqueueSnackbar("Remote command failed to execute.", {
          variant: "error"
        });
      });
  }

  createGridButtons = (optns, label) => {
    return (
      <GridContainer>
        {optns.map((opt, indx) => {
          return (
            <GridItem xs={12} sm={6} md={6} key={indx}>
              {opt.others && (
                <MaterialTooltip title={opt.description}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={this.props.classes.button}
                    onClick={() => this.handleClickOpen(opt.option, opt, label)}
                  >
                    {opt.option}
                  </Button>
                </MaterialTooltip>
              )}
              {!opt.others && (
                <MaterialTooltip title={opt.description}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={this.props.classes.button}
                    onClick={() =>
                      this.postRemoteCommands(opt.option, {}, label)
                    }
                  >
                    {opt.option}
                  </Button>
                </MaterialTooltip>
              )}
            </GridItem>
          );
        })}
      </GridContainer>
    );
  };

  getRemoteCommands() {
    const requestURL = process.env.REACT_APP_API_URL + "/remote/command";
    const vessel_id = this.props.match.params.vessel_id;
    const device_id = this.props.match.params.device_id;

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id,
        device_id
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.setState({
          remoteCommands: response.data
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  }

  getAlarmState = () => {
    const vessel_id = this.props.match.params.vessel_id;
    const device_id = this.props.match.params.device_id;
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

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getDeviceInfo();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getDeviceInfo();
      }
    );
  };

  handleSort = (orderBy, orderDirection) => {
    const tableCols = ["timestamp", "module", "option", "value"];
    this.setState(
      {
        sortType: orderDirection,
        sortVal: tableCols[orderBy]
      },
      () => {
        this.getDeviceInfo();
      }
    );
  };

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
      this.setState(
        {
          filterDateTime: ev,
          page: 0
        },
        () => {
          this.getDeviceInfo();
          this.getDeviceList();
        }
      );
      return;
    }
    timer = setTimeout(() => {
      this.getDeviceInfo();
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
      <List dense={true}>
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

  createGUIHeader() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Typography
          variant="headline"
          component="h3"
          className={classes.leftText}
        >
          {general.capitalizeFirstLetter2(
            general.humanizeName(this.props.match.params.device_name)
          )}
          {this.state.device &&
            this.state.device.status === "green" && (
              <i
                title="online"
                className="material-icons md-18 successColor v-align-middle"
              >
                check_circle
              </i>
            )}
          {this.state.device &&
            this.state.device.status === "orange" && (
              <i
                title="warning"
                className="material-icons md-18 warningColor v-align-middle"
              >
                warning
              </i>
            )}
          {this.state.device &&
            this.state.device.status === "red" && (
              <i
                title="offline"
                className="material-icons md-18 dangerColor v-align-middle"
              >
                error
              </i>
            )}
        </Typography>
        {this.state.device && (
          <Typography component="p" className={classes.leftText}>
            <i className="material-icons md-18">router</i>
            <span className={classes.marginLeft}>
              {this.state.device.device_type}
            </span>
          </Typography>
        )}
        {this.state.device && (
          <Typography component="p" className={classes.leftText}>
            <i className="material-icons md-18">description</i>
            <span className={classes.marginLeft}>
              {this.state.device.description}
            </span>
          </Typography>
        )}
        {this.state.device && (
          <Typography component="p" className={classes.leftText}>
            <i className="material-icons md-18">calendar_today</i>
            <span className={classes.marginLeft}>{this.state.updateState}</span>
          </Typography>
        )}
      </React.Fragment>
    );
  }

  handleChangeValue = data => event => {
    let stateCopy = Object.assign({}, this.state);

    for (let i = 0; i < stateCopy.remoteDialog.others.length; i++) {
      const othr = stateCopy.remoteDialog.others[i];
      if (othr.type === "groupdropdown") {
        Loop2: for (let x = 0; x < othr.values.length; x++) {
          const groupHead = othr.values[x];
          for (
            let g = 0;
            g < groupHead[Object.keys(groupHead)[0]].length;
            g++
          ) {
            if (othr.name === data) {
              othr.selected = event.target.value;
              break Loop2;
            }
          }
        }
      } else {
        if (othr.name === data) {
          othr.selected = event.target.value;
        }
      }
    }
    this.setState(stateCopy);
  };

  showDeviceImageBlock = () => {
    const { classes } = this.props;

    if (
      !this.state.loading0 &&
      this.state.device &&
      this.state.device.general &&
      (this.state.device.device_type === "Catalyst_2960" ||
        this.state.device.device_type === "Catalyst_3750" ||
        this.state.device.device_type === "Cisco_SNMP")
    ) {
      return (
        <div className={classes.marginTopOffset}>
          <CiscoSwitch
            device={this.state.device}
            style={{ marginTop: "0px" }}
          />
        </div>
      );
    } else if (
      !this.state.loading0 &&
      this.state.device &&
      this.state.device.device_type === "IOP"
    ) {
      return (
        <div className={classes.marginTopOffset}>
          <IOP device={this.state.device} style={{ marginTop: "0px" }} />
        </div>
      );
    } else if (
      !this.state.loading0 &&
      this.state.device &&
      this.state.device.device_type === "Sailor_900"
    ) {
      return (
        <div className={classes.marginTopOffset}>
          <VSATSailor900
            device={this.state.device}
            style={{ marginTop: "0px" }}
          />
        </div>
      );
    } else if (
      !this.state.loading0 &&
      this.state.device &&
      this.state.device.general &&
      (this.state.device.device_type === "Intellian_V100_E2S" ||
        this.state.device.device_type === "Intellian_V100" ||
        this.state.device.device_type === "Intellian_V110")
    ) {
      return (
        <div>
          {this.createGUIHeader()}
          <div className={classes.vsatOffsetMargin}>
            <VSAT device={this.state.device} style={{ marginTop: "0px" }} />
          </div>
        </div>
      );
    } else if (
      !this.state.loading0 &&
      this.state.device &&
      (this.state.device.device_type === "Evolution_X5" ||
        this.state.device.device_type === "Evolution_X7")
    ) {
      return (
        <div className={classes.marginTopOffset}>
          <Modem device={this.state.device} style={{ marginTop: "0px" }} />
        </div>
      );
    } else if (
      !this.state.loading0 &&
      this.state.device &&
      this.state.device.outlet_status &&
      (this.state.device.device_type === "Raritan_PX2" ||
        this.state.device.device_type === "Sentry3")
    ) {
      return (
        <div className={classes.marginTopOffset}>
          <PowerSwitch
            device={this.state.device}
            style={{ marginTop: "0px" }}
          />
        </div>
      );
    } else if (this.state.device.device_type === "Sailor_6103") {
      return (
        <div className={classes.marginTopOffset}>
          <AlarmPanel device={this.state.device} />
        </div>
      );
    } else if (this.state.device.device_type === "Sailor_62xx") {
      return (
        <div className={classes.marginTopOffset}>
          <VHF device={this.state.device} />
        </div>
      );
    } else if (this.state.device.device_type === "Sailor_3027C") {
      return (
        <div className={classes.marginTopOffset}>
          <SATC device={this.state.device} />
        </div>
      );
    } else if (this.state.device.device_type === "Cobham_500") {
      return (
        <div className={classes.marginTopOffset}>
          <FBB device={this.state.device} />
        </div>
      );
    } else if (
      !this.state.loading0 &&
      this.state.devImage !== "no image" &&
      (this.state.device.device_type !== "Catalyst_2960" &&
        this.state.device.device_type !== "Catalyst_3750" &&
        this.state.device.device_type !== "Cisco_SNMP" &&
        this.state.device.device_type !== "IOP" &&
        this.state.device.device_type !== "Raritan_PX2" &&
        this.state.device.device_type !== "Sentry3" &&
        this.state.device.device_type !== "Evolution_X5" &&
        this.state.device.device_type !== "Evolution_X7" &&
        this.state.device.device_type !== "Intellian_V100_E2S" &&
        this.state.device.device_type !== "Intellian_V100" &&
        this.state.device.device_type !== "Cobham_500" &&
        this.state.device.device_type !== "Intellian_V110")
    ) {
      return (
        <img
          src={this.state.devImage}
          alt={this.state.device.device}
          className={classes.responsiveImg}
        />
      );
    } else {
      return <p>No image available</p>;
    }
  };

  render() {
    const { classes, ...rest } = this.props;
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
              <h4 className={classes.cardTitleWhite}>GUI</h4>
            </CardHeader>
            <CardBody className={classes.centerText}>
              <Grid container spacing={24}>
                <Grid item xs={12} sm={12} md={6}>
                  {this.state.loading0 && (
                    <div className={classes.centerText}>
                      <CircularProgress className={classes.progress} />
                    </div>
                  )}
                  {!this.state.loading0 && this.showDeviceImageBlock()}
                </Grid>
                {this.state.device.device_type !== "Intellian_V100_E2S" &&
                  this.state.device.device_type !== "Intellian_V100" &&
                  this.state.device.device_type !== "Intellian_V110" &&
                  this.state.device.device_type !== "Sailor_900" && (
                    <Grid item xs={12} sm={12} md={6}>
                      {this.createGUIHeader()}
                    </Grid>
                  )}

                {(this.state.device.device_type === "Intellian_V100_E2S" ||
                  this.state.device.device_type === "Intellian_V100" ||
                  this.state.device.device_type === "Intellian_V110" ||
                  this.state.device.device_type === "Sailor_900") && (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    className={classes.leftText}
                  >
                    <Typography
                      variant="headline"
                      component="h3"
                      className={classes.marginBottom}
                    >
                      AZ View
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.courseUp}
                            onChange={() => {
                              this.setState({
                                courseUp: !this.state.courseUp
                              });
                            }}
                            color="primary"
                          />
                        }
                        label="Course Up"
                        className={classes.marginLeft}
                      />
                    </Typography>
                    <AzView
                      courseUp={this.state.courseUp}
                      azimuth={this.state.device.vsat_antenna.azimuth[0]}
                    />
                  </Grid>
                )}
                {(this.state.device.device_type === "Intellian_V100_E2S" ||
                  this.state.device.device_type === "Intellian_V100" ||
                  this.state.device.device_type === "Intellian_V110" ||
                  this.state.device.device_type === "Sailor_900") && (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={3}
                    className={classes.leftText}
                  >
                    <Typography
                      variant="headline"
                      component="h3"
                      className={classes.marginBottom}
                    >
                      EL View
                    </Typography>
                    <ElView
                      elevation={this.state.device.vsat_antenna.elevation[0]}
                    />
                  </Grid>
                )}
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.cardHeaderZIndex}>
              {this.props.match.params.device_name && (
                <h4 className={classes.cardTitleWhite}>
                  {this.props.match.params.device_name}
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
                      className={[
                        "material-icons md-18  " + classes.filterIcon
                      ]}
                    >
                      filter_list
                    </i>
                  )}
                </h4>
              )}
            </CardHeader>
            <CardBody>
              <Paper className={classes.root}>
                <Table>
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
                            value={{
                              label: this.state.filterOption,
                              value: this.state.filterOption
                            }}
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
                      this.state.deviceData.map((row, index) => (
                        <TableRow hover key={index}>
                          <TableCell align="left">
                            {general.epochToJsDate(row.timestamp)}
                          </TableCell>
                          <TableCell align="left">{row.category}</TableCell>
                          <TableCell align="left">{row.sub_category}</TableCell>
                          <TableCell align="left">{row.option}</TableCell>
                          {/* <TableCell align="left">{general.addUnitsValues(row.option, row.value)}</TableCell> */}
                          <TableCell align="left">{row.value}</TableCell>
                        </TableRow>
                      ))}
                    {!this.state.loading &&
                      this.state.deviceData.length === 0 && (
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
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="gray" className={classes.cardHeaderZIndex}>
              <h4 className={classes.cardTitleWhite}>PORT FORWARDING</h4>
              <p className={classes.cardCategoryWhite}>
                Portforwarding rules for this device
              </p>
            </CardHeader>
            <CardBody>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Link</TableCell>
                      <TableCell align="left">Destination</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.portForwardingData.map((row, index) => (
                      <TableRow hover key={index}>
                        <TableCell align="left">
                          {row.link && (
                            <a
                              target="_blank"
                              href={row.link}
                              rel="noopener noreferrer"
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="gray" className={classes.cardHeaderZIndex}>
              <h4 className={classes.cardTitleWhite}>ALARMS</h4>
              <p className={classes.cardCategoryWhite}>
                Showing alarms for last available data.
              </p>
            </CardHeader>
            <CardBody>
              <div className={classes.autoOverFlow}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">Level</TableCell>
                      <TableCell align="left">TimeStamp</TableCell>
                      <TableCell align="left">Description</TableCell>
                      <TableCell align="left">Result</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.alarmStateData.length > 0 &&
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
                              <TableCell>
                                {this.renderTimeStampCell(row.results)}
                              </TableCell>
                              <TableCell className={classes.vAlignTop}>
                                {row.alarm_description}
                              </TableCell>
                              <TableCell>
                                {this.renderResultCell(row.results)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    {this.state.alarmStateData.length === 0 && (
                      <TableRow>
                        <TableCell colSpan="4" align="center">
                          No available data.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card>
            <CardHeader color="gray" className={classes.cardHeaderZIndex}>
              <h4 className={classes.cardTitleWhite}>REMOTE COMMANDS</h4>
              <p className={classes.cardCategoryWhite}>
                Showing remote commands for this specific device.
              </p>
            </CardHeader>
            <CardBody>
              <div>
                {this.state.remoteCommands.map(elm =>
                  this.createGridButtons(elm.options, elm.label)
                )}
              </div>
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
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan="4" align="center">
                            <div className={classes.centerText}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                  {!this.state.loading2 &&
                    this.state.selectedGraphNameList.length === 0 &&
                    this.state.selectedGraphNameListCombine.length === 0 && (
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan="4" align="center">
                              <div className={classes.centerText}>
                                No graphs selected.
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
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
                                (row, index) => (
                                  <Line
                                    dot={this.state.graphFilter <= 24}
                                    key={index}
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
                      <div className={classes.chartContainer} key={index}>
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

        <RemoteConsoleDialog
          remoteDialog={this.state.remoteDialog}
          closeDialog={this.closeDialog}
          handleClose={this.handleClose}
          handleChangeValue={this.handleChangeValue}
          createOthersData={this.createOthersData}
          {...rest}
        />
      </GridContainer>
    );
  }
}

Device.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(Device));
