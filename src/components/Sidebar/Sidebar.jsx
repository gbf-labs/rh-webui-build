import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { matchPath } from "react-router";
import Select from "react-select";
import chroma from "chroma-js";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import NavigateNext from "@material-ui/icons/NavigateNext";
import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";
import avatar from "assets/img/faces/blank.jpeg";

// core components
import HeaderLinks from "components/Header/HeaderLinks.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import VesselOptions from "./VesselOptions";
import RBAC from "./RBAC";
import Admin from "./Admin";
import Alarm from "./Alarm";

// helpers
import auth from "utils/auth";
import general from "variables/general";

class Sidebar extends React.Component {
  state = {
    openVessels: true,
    openRBAC: false,
    openVesselOpts: false,
    openAdmin: false,
    openAlarm: false,
    vesselStatesOptions: [
      { value: "all", label: "All", color: "#666666" },
      { value: "green", label: "Online", color: "#36B37E" },
      { value: "red", label: "Offline", color: "#ff0000" },
      { value: "orange", label: "Warning", color: "#FF8B00" },
      // {
      //   value: "white",
      //   label: "Not installed",
      //   color: "#000000"
      // }
    ]
  };

  handleClick = type => {
    if (type === "admin") {
      this.setState(state => ({ openAdmin: !state.openAdmin }));
    } else if (type === "rbac") {
      this.setState(state => ({ openRBAC: !state.openRBAC }));
    } else if (type === "vessels") {
      this.setState(state => ({ openVessels: !state.openVessels }));
    } else if (type === "vesselOpts") {
      this.setState(state => ({ openVesselOpts: !state.openVesselOpts }));
    } else if (type === "alarm") {
      this.setState(state => ({ openAlarm: !state.openAlarm }));
    }
  };

  // verifies if routeName is the one active (in browser input)
  activeRoute = routeName => {
    return this.props.location.pathname.indexOf(routeName) > -1 ? true : false;
  };

  generateVesselList = () => {
    const { classes } = this.props;
    let vessels =
      this.props.selectedSuggestions.length > 0
        ? this.props.selectedSuggestions
        : this.props.searchSuggestions;

    if (this.props.selectedVesselState !== "all") {
      vessels = this.props.selectedSuggestions;
    }
    return vessels.map(vessel => (
      <ListItem
        button
        key={`item-${vessel.vessel_id}`}
        // onClick={()=>this.toggleVesselInfo(vessel)}
      >
        {vessel.vessel_name && (
          <ListItemAvatar>
            <Avatar src={general.getVesselIcon(vessel)} />
          </ListItemAvatar>
        )}
        {/* {vessel.vessel_name && vessel.lat !== 0 && vessel.long !== 0 && 
          <ListItemText
            primary={vessel.vessel_name}
            secondary={null}
          />
        } */}

        {/* {vessel.lat === 0 && vessel.long === 0 && */}
        <NavLink
          to={`/vessel/deviceselect/${vessel.vessel_id}/${vessel.vessel_name}`}
          className={classes.item}
          activeClassName="active"
        >
          <ListItemText primary={vessel.vessel_name} secondary={null} />
          <ListItemSecondaryAction>
            <IconButton>
              <NavigateNext />
            </IconButton>
          </ListItemSecondaryAction>
        </NavLink>
        {/* } */}
      </ListItem>
    ));
  };

  logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push("/signin");
  };

  render() {
    const { classes, color, logo, image, logoText, routes } = this.props;
    const vesPageRoutePropMatch = matchPath(
      this.props.history.location.pathname,
      {
        path: "/vessel/:pagename/:vessel_id/:vessel_name",
        exact: false,
        strict: false
      }
    );
    const alarmPageRoutePropMatch = matchPath(
      this.props.history.location.pathname,
      {
        path: "/alarms/state/:verbose_level/:vessel_id/:vessel_name",
        exact: false,
        strict: false
      }
    );
    const alarmSummaryPageRoutePropMatch = matchPath(
      this.props.history.location.pathname,
      {
        path: "/alarms/summary/:vessel_id/:vessel_name",
        exact: false,
        strict: false
      }
    );
    const devPageRoutePropMatch = matchPath(
      this.props.history.location.pathname,
      {
        path: "/device/:vessel_id/:device_id/:device_name/:vessel_name",
        exact: false,
        strict: false
      }
    );

    const getPageType = () => {
      if (alarmPageRoutePropMatch) {
        return "alarmpage";
      } else if (alarmSummaryPageRoutePropMatch) {
        return "alarmsummarypage";
      } else if (vesPageRoutePropMatch) {
        return "vesselpage";
      } else {
        return "";
      }
    };

    const dot = (color = "#ccc") => ({
      alignItems: "center",
      display: "flex",

      ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10
      }
    });

    const colourStyles = {
      control: styles => ({ ...styles, backgroundColor: "white", width: 180 }),
      option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.color);
        return {
          ...styles,
          backgroundColor: isDisabled
            ? null
            : isSelected
              ? data.color
              : isFocused
                ? color.alpha(0.1).css()
                : null,
          color: isDisabled
            ? "#ccc"
            : isSelected
              ? chroma.contrast(color, "white") > 2
                ? "white"
                : "black"
              : data.color,
          cursor: isDisabled ? "not-allowed" : "default",

          ":active": {
            ...styles[":active"],
            backgroundColor:
              !isDisabled && (isSelected ? data.color : color.alpha(0.3).css())
          }
        };
      },
      input: styles => ({ ...styles, ...dot() }),
      placeholder: styles => ({ ...styles, ...dot() }),
      singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) })
    };

    const links = (
      <div>
        <List className={classes.list}>
          {routes.map((prop, key) => {
            if (
              auth.getUserInfo() &&
              !auth.getUserInfo().admin &&
              (prop.sidebarName &&
                !general.checkPermission(prop.permissionName) &&
                prop.sidebarName !== "Dashboard")
            ) {
              return null;
            }
            if (
              auth.getUserInfo() &&
              auth.getUserInfo().admin === false &&
              (prop.sidebarName && prop.sidebarName === "Dashboard")
            ) {
              return null;
            }
            if (prop.redirect || prop.sidebarName === "") return null;
            var activePro = " ";
            var listItemClasses;

            listItemClasses = classNames({
              [" " + classes[color]]: this.activeRoute(prop.path)
            });
            const whiteFontClasses = classNames({
              [" " + classes.whiteFont]: this.activeRoute(prop.path)
            });
            return (
              <NavLink
                to={prop.path}
                className={activePro + classes.item}
                activeClassName="active"
                key={key}
              >
                {prop.parent === "" && (
                  <ListItem
                    button
                    className={classes.itemLink + listItemClasses}
                  >
                    <ListItemIcon
                      className={classes.itemIcon + whiteFontClasses}
                    >
                      {typeof prop.icon === "string" ? (
                        <Icon>{prop.icon}</Icon>
                      ) : (
                        <prop.icon />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={prop.sidebarName}
                      className={classes.itemText + whiteFontClasses}
                      disableTypography={true}
                    />
                  </ListItem>
                )}
              </NavLink>
            );
          })}
        </List>
        {this.props.pathname.pathname === "/maps" && (
          <List className="maplist" dense={true}>
            <ListItem button onClick={() => this.handleClick("vessels")}>
              <ListItemIcon className={classes.darkFont}>
                <Icon>directions_boat</Icon>
              </ListItemIcon>
              <ListItemText
                inset
                primary="Vessels"
                className={classes.itemTextPadding}
              />
              {this.state.openVessels ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={this.state.openVessels} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem button>
                  <Select
                    className="basic-single"
                    classNamePrefix="select"
                    defaultValue={{ value: "All", label: "All" }}
                    styles={colourStyles}
                    name="Vessel Status"
                    options={this.state.vesselStatesOptions}
                    onChange={this.props.sidebarFilter}
                    menuPosition="fixed"
                  />
                </ListItem>
                {this.generateVesselList()}
              </List>
            </Collapse>
          </List>
        )}

        {(vesPageRoutePropMatch || devPageRoutePropMatch) &&
          ((auth.getUserInfo() && auth.getUserInfo().admin) ||
            (general.checkPermission("vessel_port forwarding") ||
              general.checkPermission("vessel_network configuration") ||
              general.checkPermission("vessel_core values"))) && (
            <VesselOptions
              handleRequest={this.props.handleRequest}
              handleClick={() => this.handleClick("vesselOpts")}
              open={this.state.openVesselOpts}
              pageType={vesPageRoutePropMatch ? "vesselpage" : "devicepage"}
              pathname={this.props.history.location.pathname}
            />
          )}

        {auth.getUserInfo() &&
          auth.getUserInfo().admin && (
            <RBAC
              handleClick={() => this.handleClick("rbac")}
              open={this.state.openRBAC}
            />
          )}

        {auth.getUserInfo() &&
          auth.getUserInfo().admin && (
            <Admin
              handleClick={() => this.handleClick("admin")}
              open={this.state.openAdmin}
            />
          )}

        {auth.getUserInfo() &&
          auth.getUserInfo().admin && (
            <Alarm
              handleClick={() => this.handleClick("alarm")}
              open={this.state.openAlarm}
              pageType={getPageType()}
              pathname={this.props.history.location.pathname}
            />
          )}

        <NavLink
          onClick={this.logout}
          to="#"
          className={classes.item}
          activeClassName="active"
        >
          <ListItem button className={classes.itemLink}>
            <ListItemIcon className={classes.itemIcon}>
              <Icon>lock_open</Icon>
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              className={classes.itemText}
              disableTypography={true}
            />
          </ListItem>
        </NavLink>
      </div>
    );
    const brand = (
      <div className={classes.logo}>
        <a href="/" className={classes.logoLink}>
          <div className={classes.logoImage}>
            <img src={logo} alt="logo" className={classes.img} />
          </div>
          {logoText}
        </a>
      </div>
    );
    const profile = (
      <div className={classes.logo}>
        {auth.getUserInfo() && (
          <NavLink to="/userprofile" className={classes.logoLink}>
            <CardAvatar profile>
              <img src={avatar} alt="..." />
            </CardAvatar>
            {auth.getUserInfo().username !== "" && (
              <CardAvatar profileText>
                {general.truncateText(auth.getUserInfo().username, 15)}
              </CardAvatar>
            )}
            {auth.getUserInfo().username === "" && (
              <CardAvatar profileText>
                {general.truncateText(auth.getUserInfo().email, 15)}
              </CardAvatar>
            )}
          </NavLink>
        )}
      </div>
    );
    return (
      <div>
        <Hidden mdUp implementation="css">
          <Drawer
            variant="temporary"
            anchor="right"
            open={this.props.open}
            classes={{
              paper: classes.drawerPaper
            }}
            onClose={this.props.handleDrawerToggle}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {brand}
            {profile}
            <div className={classes.sidebarWrapper}>
              <HeaderLinks />
              {links}
            </div>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            anchor="left"
            variant="permanent"
            open
            classes={{
              paper: classes.drawerPaper
            }}
          >
            {brand}
            {profile}
            <div className={classes.sidebarWrapper}>{links}</div>
            {image !== undefined ? (
              <div
                className={classes.background}
                style={{ backgroundImage: "url(" + image + ")" }}
              />
            ) : null}
          </Drawer>
        </Hidden>
      </div>
    );
  }
}

Sidebar.propTypes = {
  classes: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedSuggestions: PropTypes.array.isRequired,
  searchSuggestions: PropTypes.array,
  history: PropTypes.object.isRequired,
  color: PropTypes.string.isRequired,
  logo: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  logoText: PropTypes.string.isRequired,
  routes: PropTypes.array.isRequired,
  pathname: PropTypes.object.isRequired,
  handleRequest: PropTypes.func.isRequired,
  sidebarFilter: PropTypes.func.isRequired,
  selectedVesselState: PropTypes.string.isRequired
};

export default withStyles(sidebarStyle)(Sidebar);
