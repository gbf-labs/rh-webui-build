import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import Icon from "@material-ui/core/Icon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import NavigateNext from "@material-ui/icons/NavigateNext";
import ListItemIcon from "@material-ui/core/ListItemIcon";

// core components
import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";

// helpers
import auth from "utils/auth";
import general from "variables/general";

class VesselOptions extends React.Component {
  render() {
    const { classes } = this.props;
    const vesId =
      this.props.pageType === "vesselpage"
        ? this.props.pathname.split("/")[3]
        : this.props.pathname.split("/")[2];
    const vesName =
      this.props.pageType === "vesselpage"
        ? this.props.pathname.split("/")[4]
        : this.props.pathname.split("/")[5];
    return (
      <List className="maplist" dense={true}>
        <ListItem button onClick={this.props.handleClick}>
          <ListItemIcon className={classes.itemIcon + classes.darkFont}>
            <Icon>directions_boat</Icon>
          </ListItemIcon>
          <ListItemText
            inset
            primary={vesName}
            className={classes.itemTextPadding}
          />
          {this.props.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.props.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {auth.getUserInfo() &&
              auth.getUserInfo().admin && (
                <NavLink
                  onClick={this.logout}
                  to={`/vessel/deviceselect/${vesId}/${vesName}`}
                  className={classes.item}
                  activeClassName="active"
                >
                  <ListItem button>
                    <ListItemText primary={vesName} secondary={null} />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <NavigateNext />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </NavLink>
              )}
            {auth.getUserInfo() &&
              (auth.getUserInfo().admin || auth.getUserInfo().superadmin) && (
                <NavLink
                  onClick={this.logout}
                  to={`/vessel/parameters/${vesId}/${vesName}`}
                  className={classes.item}
                  activeClassName="active"
                >
                  <ListItem button>
                    <ListItemText primary="Parameters" secondary={null} />
                    <ListItemSecondaryAction>
                      <IconButton>
                        <NavigateNext />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </NavLink>
              )}
            {((auth.getUserInfo() && auth.getUserInfo().admin) ||
              general.checkPermission("vessel_core values")) && (
              <NavLink
                onClick={this.logout}
                to={`/vessel/corevalues/${vesId}/${vesName}`}
                className={classes.item}
                activeClassName="active"
              >
                <ListItem button>
                  <ListItemText primary="Core Values" secondary={null} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <NavigateNext />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </NavLink>
            )}
            {((auth.getUserInfo() && auth.getUserInfo().admin) ||
              general.checkPermission("vessel_failover")) && (
              <NavLink
                onClick={this.logout}
                to={`/vessel/failover/${vesId}/${vesName}`}
                className={classes.item}
                activeClassName="active"
              >
                <ListItem button>
                  <ListItemText primary="Failover" secondary={null} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <NavigateNext />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </NavLink>
            )}
            {((auth.getUserInfo() && auth.getUserInfo().admin) ||
              general.checkPermission("vessel_network configuration")) && (
              <NavLink
                onClick={this.logout}
                to={`/vessel/networkconfiguration/${vesId}/${vesName}`}
                className={classes.item}
                activeClassName="active"
              >
                <ListItem button>
                  <ListItemText
                    primary="Network Configuration"
                    secondary={null}
                  />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <NavigateNext />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </NavLink>
            )}
            {((auth.getUserInfo() && auth.getUserInfo().admin) ||
              general.checkPermission("vessel_port forwarding")) && (
              <NavLink
                onClick={this.logout}
                to={`/vessel/portforwarding/${vesId}/${vesName}`}
                className={classes.item}
                activeClassName="active"
              >
                <ListItem button>
                  <ListItemText primary="Port Forwarding" secondary={null} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <NavigateNext />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </NavLink>
            )}
            {((auth.getUserInfo() && auth.getUserInfo().admin) ||
              general.checkPermission("vessel_remote console")) && (
              <NavLink
                onClick={this.logout}
                to={`/vessel/remoteconsole/${vesId}/${vesName}`}
                className={classes.item}
                activeClassName="active"
              >
                <ListItem button>
                  <ListItemText primary="Remote Console" secondary={null} />
                  <ListItemSecondaryAction>
                    <IconButton>
                      <NavigateNext />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </NavLink>
            )}
          </List>
        </Collapse>
      </List>
    );
  }
}

VesselOptions.propTypes = {
  classes: PropTypes.object.isRequired,
  pathname: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(sidebarStyle)(VesselOptions);
