import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import { NavLink } from "react-router-dom";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CustomMapComponent from "components/CustomMap/CustomMap.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CiscoSwitch from "components/DeviceImages/CiscoSwitch.jsx";
import IOP from "components/DeviceImages/IOP";
import VSAT from "components/DeviceImages/VSAT";
import VSATSailor900 from "components/DeviceImages/VSATSailor900";
import PowerSwitch from "components/DeviceImages/PowerSwitch";
import Modem from "components/DeviceImages/Modem";
import AlarmPanel from "components/DeviceImages/AlarmPanel";
import VHF from "components/DeviceImages/VHF";
import SATC from "components/DeviceImages/SATC";
import FBB from "components/DeviceImages/FBB";

//helpers
import request from "utils/request";
import general from "variables/general";
import auth from "utils/auth";

const styles = theme => ({
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

  devSize: {
    width: "30%",
    margin: "10px"
  },

  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
  },
  gridList: {
    width: "100%"
  },
  gridHeight: {
    height: "auto !important",
    minHeight: "230px"
  },
  icon: {
    color: "white"
  },
  title: {
    color: theme.palette.primary.light
  },
  titleBar: {
    top: "0"
  },
  img: {
    width: "auto",
    maxHeight: "150px",
    height: "auto",
    top: "55px",
    display: "block",
    margin: "auto",
    transform: "none",
    left: "0",
    marginTop: "75px",
    background: "black"
  },
  actionIcon: {
    float: "left",
    position: "relative",
    marginLeft: "5px"
  },
  titleWrap: {
    flexGrow: "0"
  },
  desc: {
    fontSize: "11px",
    marginLeft: "5px"
  },
  noPaddingTop: {
    paddingTop: "0px"
  },
  noImg: {
    top: "55px",
    left: 0,
    width: "100%",
    height: "100%",
    margin: "auto",
    display: "block",
    maxWidth: "600px",
    transform: "none",
    marginTop: "75px",
    maxHeight: "156px",
    textAlign: "center"
  }
});

let vessInterval = null;
class DeviceSelect extends React.Component {
  state = {
    vessels: [],
    center: {
      lat: 28.14002,
      lng: -15.42113
    },
    vesselId: "",
    vesselName: "",
    zoom: 5,
    gen_info: [],
    device_list: [],
    grid_list: [],
    loading: true
  };

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  componentDidMount() {
    this.getVessels();
    vessInterval = setInterval(
      () => this.getVessels(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL + 300
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(vessInterval);
  }

  toggleVesselInfo = vessel => {
    let center = {};
    let vessels = Object.assign([], this.state.vessels);
    for (let i in vessels) {
      if (vessels[i].vessel_id !== vessel.vessel_id) {
        vessels[i].isOpen = false;
      } else {
        vessels[i].isOpen = !vessel.isOpen;
        if (vessels[i].isOpen) {
          center = {
            lat: parseFloat(vessels[i].lat),
            lng: parseFloat(vessels[i].long)
          };
        }
      }
    }
    if (center.lat && center.lng) {
      this.setState({
        center: center,
        vessels
      });
    } else {
      this.setState({ vessels });
    }
  };

  hoverVesselName = (vessel, hide) => {
    let vessels = Object.assign([], this.state.vessels);
    if (vessel.vessel_name === "") {
      return;
    }
    for (let i in vessels) {
      if (vessels[i]["isHoverOpen"] === undefined) {
        vessels[i]["isHoverOpen"] = false;
      }
      if (vessels[i].vessel_id !== vessel.vessel_id) {
        vessels[i]["isHoverOpen"] = false;
      } else {
        vessels[i]["isHoverOpen"] = hide;
      }
    }

    this.setState({
      vessels
    });
  };

  getVessels = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/data";
    const vessNum = this.props.match.params.vessel_id;
    request(requestURL, {
      method: "GET",
      params: {
        vessel_ids: vessNum
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.setState({
          center: {
            lat: parseFloat(response.rows[0].lat),
            lng: parseFloat(response.rows[0].long)
          },
          vessels: response.rows,
          vesselId: response.rows[0].vessel_id,
          vesselName: response.rows[0].vessel_name
        });
        this.getGeneralInfo();
        this.getDeviceList();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getGeneralInfo = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/device/list/general/info";
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: this.state.vesselId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        const arr = [];
        for (let x = 0; x < response.rows.length; x++) {
          const element = response.rows[x];
          arr.push([element.option_name, element.value, element.data_provider]);
        }
        this.setState({
          gen_info: arr
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getDeviceList = () => {
    this.toggleLoading(true);
    const requestURL = process.env.REACT_APP_API_URL + "/device/list";
    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: this.state.vesselId
      }
    })
      .then(response => {
        this.toggleLoading(false);
        if (!this.props.handleRequest(response)) return;

        let dX = [];
        for (let x = 0; x < response.data.length; x++) {
          const d = response.data[x];
          const gen = response.data[x].general;
          if (general.getDeviceImage(d, gen)) {
            d.vessId = this.state.vesselId;
            d.id = d.device_id;
            d.title = general.capitalizeFirstLetter2(
              general.humanizeName(d.device)
            );
            d.img = general.getDeviceImage(d, gen);
            dX.push(d);
          }
        }
        // const filteredDx = dX.filter(d => this.regexCheck(d.title) === false);
        this.setState({
          device_list: response.data,
          grid_list: dX
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  regexCheck = str => {
    return new RegExp("NTWPERF").test(str);
  };

  createButtons = (dev, color, key) => {
    if (
      (auth.getUserInfo() &&
        (auth.getUserInfo().admin || auth.getUserInfo().superadmin)) ||
      general.checkPermission("maps_device")
    ) {
      let deviceLink = `/device/${this.state.vesselId}/${dev.device_id}/${
        dev.device
      }/${this.state.vesselName}`;
      if (dev.device.match(/NTWPERF/g)) {
        deviceLink = `/vessel/networkperformance/${this.state.vesselId}/${
          this.state.vesselName
        }`;
      }
      return (
        <NavLink to={deviceLink} key={key}>
          <Button variant="contained" color={color}>
            {general.capitalizeFirstLetter2(general.humanizeName(dev.device))}
          </Button>
        </NavLink>
      );
    } else {
      return (
        <Button variant="contained" color={color} key={key}>
          {general.capitalizeFirstLetter2(general.humanizeName(dev.device))}
        </Button>
      );
    }
  };

  createDeviceImages = (tile, classes) => {
    if (
      (auth.getUserInfo() &&
        (auth.getUserInfo().admin || auth.getUserInfo().superadmin)) ||
      general.checkPermission("maps_device")
    ) {
      return (
        <div>
          <NavLink
            to={`/device/${this.state.vesselId}/${tile.id}/${tile.title}/${
              this.state.vesselName
            }`}
          >
            {this.showDeviceImageBlock(tile)}

            <GridListTileBar
              className={classes.titleBar}
              classes={{
                actionIcon: classes.actionIcon,
                titleWrap: classes.titleWrap
              }}
              title={
                <div>
                  {tile.status === "green" && (
                    <i className="material-icons md-18 successColor v-align-sub">
                      check_circle
                    </i>
                  )}
                  {tile.status === "orange" && (
                    <i className="material-icons md-18 warningColor v-align-sub">
                      warning
                    </i>
                  )}
                  {tile.status === "red" && (
                    <i className="material-icons md-18 dangerColor v-align-sub">
                      error
                    </i>
                  )}
                  <span>{tile.title}</span>
                </div>
              }
              subtitle={<span>{tile.device_type}</span>}
              actionIcon={
                <div>
                  <IconButton className={classes.icon}>
                    <i className="material-icons md-18">description</i>
                    <span className={classes.desc}>{tile.description}</span>
                  </IconButton>
                </div>
              }
            />
          </NavLink>
        </div>
      );
    } else {
      return (
        <div>
          {(tile.device_type === "Catalyst_2960" ||
            tile.device_type === "Catalyst_3750" ||
            tile.device_type === "Cisco_SNMP") && <CiscoSwitch device={tile} />}
          {tile.device_type === "IOP" && <IOP device={tile} />}
          {(tile.device_type === "Intellian_V100_E2S" ||
            tile.device_type === "Intellian_V100" ||
            tile.device_type === "Intellian_V110") && <VSAT device={tile} />}
          {tile.device_type === "Sailor_900" && <VSATSailor900 device={tile} />}
          {(tile.device_type === "Raritan_PX2" ||
            tile.device_type === "Sentry3") && <PowerSwitch device={tile} />}
          {(tile.device_type === "Evolution_X5" ||
            tile.device_type === "Evolution_X7") && <Modem device={tile} />}
          {tile.device_type !== "Catalyst_2960" &&
            tile.device_type !== "Catalyst_3750" &&
            tile.device_type !== "Cisco_SNMP" &&
            tile.device_type !== "IOP" &&
            tile.device_type !== "Raritan_PX2" &&
            tile.device_type !== "Sentry3" &&
            tile.device_type !== "Intellian_V100_E2S" &&
            tile.device_type !== "Intellian_V100" &&
            tile.device_type !== "Intellian_V110" &&
            tile.device_type !== "Sailor_6103" &&
            tile.device_type !== "Evolution_X5" &&
            tile.device_type !== "Evolution_X7" &&
            tile.device_type !== "Sailor_62xx" &&
            tile.device_type !== "Sailor_3027C" && (
              <img src={tile.img} alt={tile.title} className={classes.img} />
            )}
          {tile.device_type === "Sailor_6103" && <AlarmPanel device={tile} />}
          {tile.device_type === "Sailor_62xx" && <VHF device={tile} />}
          {tile.device_type === "Sailor_3027C" && <SATC device={tile} />}
          {tile.device_type === "Cobham_500" && <FBB device={tile} />}
          <GridListTileBar
            className={classes.titleBar}
            classes={{
              actionIcon: classes.actionIcon,
              titleWrap: classes.titleWrap
            }}
            title={
              <div>
                {tile.status === "green" && (
                  <i className="material-icons md-18 successColor v-align-middle">
                    check_circle
                  </i>
                )}
                {tile.status === "orange" && (
                  <i className="material-icons md-18 warningColor v-align-middle">
                    warning
                  </i>
                )}
                {tile.status === "red" && (
                  <i className="material-icons md-18 dangerColor v-align-middle">
                    error
                  </i>
                )}
                <span>{tile.title}</span>
              </div>
            }
            subtitle={<span>{tile.device_type}</span>}
            actionIcon={
              <div>
                <IconButton className={classes.icon}>
                  <i className="material-icons md-18">description</i>
                  <span className={classes.desc}>{tile.description}</span>
                </IconButton>
              </div>
            }
          />
        </div>
      );
    }
  };

  getVesselZIndex = vessel => {
    if (vessel.update_state === "red") {
      return 2;
    } else {
      return 1;
    }
  };

  showDeviceImageBlock = device => {
    const { classes } = this.props;
    if (
      device.device_type === "Catalyst_2960" ||
      device.device_type === "Catalyst_3750" ||
      device.device_type === "Cisco_SNMP"
    ) {
      return <CiscoSwitch device={device} />;
    } else if (device.device_type === "IOP") {
      return <IOP device={device} />;
    } else if (
      device.device_type === "Intellian_V100_E2S" ||
      device.device_type === "Intellian_V100" ||
      device.device_type === "Intellian_V110"
    ) {
      return <VSAT device={device} />;
    } else if (device.device_type === "Sailor_900") {
      return <VSATSailor900 device={device} />;
    } else if (
      device.device_type === "Evolution_X5" ||
      device.device_type === "Evolution_X7"
    ) {
      return <Modem device={device} />;
    } else if (
      device.device_type === "Raritan_PX2" ||
      device.device_type === "Sentry3"
    ) {
      return <PowerSwitch device={device} />;
    } else if (device.device_type === "Sailor_6103") {
      return <AlarmPanel device={device} />;
    } else if (device.device_type === "Sailor_62xx") {
      return <VHF device={device} />;
    } else if (device.device_type === "Sailor_3027C") {
      return <SATC device={device} />;
    } else if (device.device_type === "Cobham_500") {
      return <FBB device={device} />;
    } else if (
      device.img !== "no image" &&
      (device.device_type !== "Catalyst_2960" &&
        device.device_type !== "Catalyst_3750" &&
        device.device_type !== "Cisco_SNMP" &&
        device.device_type !== "IOP" &&
        device.device_type !== "Raritan_PX2" &&
        device.device_type !== "Sentry3" &&
        device.device_type !== "Evolution_X5" &&
        device.device_type !== "Evolution_X7" &&
        device.device_type !== "Intellian_V100_E2S" &&
        device.device_type !== "Intellian_V100" &&
        device.device_type !== "Intellian_V110")
    ) {
      return (
        <img src={device.img} alt={device.title} className={classes.img} />
      );
    } else {
      return <p className={classes.noImg}>No image available</p>;
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardBody className={classes.centerText}>
              {this.state.device_list.map((prop, key) => {
                const dev = this.state.device_list[key];
                if (dev.status === "green") {
                  return this.createButtons(dev, "success", key);
                } else if (this.state.device_list[key].status === "orange") {
                  return this.createButtons(dev, "warning", key);
                } else {
                  return this.createButtons(dev, "danger", key);
                }
              })}
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>Devices</h4>
            </CardHeader>
            <CardBody>
              {this.state.loading && (
                <div className={classes.centerText}>
                  <CircularProgress className={classes.progress} />
                </div>
              )}
              <GridList cellHeight={180} className={classes.gridList}>
                {!this.state.loading &&
                  this.state.grid_list.map(tile => (
                    <GridListTile key={tile.img} className={classes.gridHeight}>
                      {this.createDeviceImages(tile, classes)}
                    </GridListTile>
                  ))}
              </GridList>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>General Info</h4>
            </CardHeader>
            <CardBody className={classes.noPaddingTop}>
              <Table
                tableHead={["Label", "Value", "Data Provider"]}
                tableData={this.state.gen_info}
              />
            </CardBody>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>Location</h4>
            </CardHeader>
            <CardBody className={classes.cardBodyLocation}>
              <CustomMapComponent
                getVesselZIndex={this.getVesselZIndex}
                vessels={this.state.vessels}
                toggleVesselInfo={this.toggleVesselInfo}
                hoverVesselName={this.hoverVesselName}
                getVesselIcon={general.getVesselIcon}
                center={this.state.center}
                zoom={this.state.zoom}
                gotoButton={false}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

DeviceSelect.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(DeviceSelect));
