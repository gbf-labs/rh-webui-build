import React from "react";
import PropTypes from "prop-types";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import { NavLink } from "react-router-dom";
// core components

import sidebarStyle from "assets/jss/material-dashboard-react/components/sidebarStyle.jsx";
import Icon from "@material-ui/core/Icon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import NavigateNext from "@material-ui/icons/NavigateNext";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";

class Alarm extends React.Component {
  render() {
    const { classes, pageType, pathname } = this.props;
    let vesId = "all";
    let vesName = "all";
    switch (pageType) {
      case "vesselpage":
      case "alarmsummarypage":
        vesId = pathname.split("/")[3];
        vesName = pathname.split("/")[4];
        break;
      case "alarmpage":
        vesId = pathname.split("/")[4];
        vesName = pathname.split("/")[5];
        break;
      default:
        vesId = pathname.split("/")[2];
        vesName = pathname.split("/")[5];
        break;
    }

    // let vesId = (this.props.pageType === 'vesselpage' ? (this.props.pathname).split('/')[3] : (this.props.pathname).split('/')[2])
    // let vesName = (this.props.pageType === 'vesselpage' ? (this.props.pathname).split('/')[4] : (this.props.pathname).split('/')[5])

    if (
      vesId === undefined ||
      vesName === undefined ||
      vesId === "all" ||
      vesName === "all"
    ) {
      vesId = "all";
      vesName = "all";
    }
    return (
      <List className="maplist" dense={true}>
        <ListItem button onClick={this.props.handleClick}>
          <ListItemIcon className={classes.itemIcon + classes.darkFont}>
            <Icon>access_alarm</Icon>
          </ListItemIcon>
          <ListItemText
            inset
            primary="Alarm"
            className={classes.itemTextPadding}
          />
          {this.props.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.props.open} timeout="auto" unmountOnExit>
          <ListSubheader>States</ListSubheader>
          <List component="div" disablePadding>
            <NavLink to={`/alarms/state/10/${vesId}/${vesName}`}>
              <ListItem button>
                <ListItemText
                  primary="Alarms"
                  className={classes.item}
                  secondary={null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NavigateNext />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </NavLink>
            <NavLink to={`/alarms/state/20/${vesId}/${vesName}`}>
              <ListItem button>
                <ListItemText
                  primary="Alarms and Warnings"
                  className={classes.item}
                  secondary={null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NavigateNext />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </NavLink>
            <NavLink to={`/alarms/state/50/${vesId}/${vesName}`}>
              <ListItem button>
                <ListItemText
                  primary="All"
                  className={classes.item}
                  secondary={null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NavigateNext />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </NavLink>
          </List>

          {vesId !== "all" &&
            vesName !== "all" && (
              <React.Fragment>
                <Divider />
                <List component="div" disablePadding>
                  <ListSubheader>Summary</ListSubheader>
                  <NavLink to={`/alarms/summary/${vesId}/${vesName}`}>
                    <ListItem button>
                      <ListItemText
                        primary="Vessel Summary"
                        className={classes.item}
                        secondary={null}
                      />
                      <ListItemSecondaryAction>
                        <IconButton>
                          <NavigateNext />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </NavLink>
                </List>
              </React.Fragment>
            )}
          <Divider />
          <ListSubheader>Configuration</ListSubheader>
          <List component="div" disablePadding>
            <NavLink to="/alarms/triggers">
              <ListItem button>
                <ListItemText
                  primary="Alarm Triggers"
                  className={classes.item}
                  secondary={null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NavigateNext />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </NavLink>
            <NavLink to="/alarms/conditions">
              <ListItem button>
                <ListItemText
                  primary="Alarms Conditions"
                  className={classes.item}
                  secondary={null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NavigateNext />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </NavLink>
            <NavLink to="/alarms/values">
              <ListItem button>
                <ListItemText
                  primary="Alarm Values"
                  className={classes.item}
                  secondary={null}
                />
                <ListItemSecondaryAction>
                  <IconButton>
                    <NavigateNext />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </NavLink>
          </List>
        </Collapse>
      </List>
    );
  }
}

Alarm.propTypes = {
  classes: PropTypes.object.isRequired,
  pageType: PropTypes.string.isRequired,
  pathname: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(sidebarStyle)(Alarm);
