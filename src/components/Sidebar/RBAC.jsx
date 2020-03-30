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

class RBAC extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <List className="maplist" dense={true}>
        <ListItem button onClick={this.props.handleClick}>
          <ListItemIcon className={classes.itemIcon + classes.darkFont}>
            <Icon>accessibility</Icon>
          </ListItemIcon>
          <ListItemText
            inset
            primary="RBAC"
            className={classes.itemTextPadding}
          />
          {this.props.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.props.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink to="/rbac/permission">
              <ListItem button>
                <ListItemText
                  primary="Permission"
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

            <NavLink to="/rbac/role">
              <ListItem button>
                <ListItemText
                  primary="Role"
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

            <NavLink to="/rbac/users">
              <ListItem button>
                <ListItemText
                  primary="Users"
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

RBAC.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(sidebarStyle)(RBAC);
