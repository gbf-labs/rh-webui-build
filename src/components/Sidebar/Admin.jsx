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

class Admin extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <List className="maplist" dense={true}>
        <ListItem button onClick={this.props.handleClick}>
          <ListItemIcon className={classes.itemIcon + classes.darkFont}>
            <Icon>equalizer</Icon>
          </ListItemIcon>
          <ListItemText
            inset
            primary="Admin"
            className={classes.itemTextPadding}
          />
          {this.props.open ? <ExpandLess /> : <ExpandMore />}
        </ListItem>
        <Collapse in={this.props.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <NavLink to="/admin/company">
              <ListItem button>
                <ListItemText
                  primary="Company"
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
            <NavLink to="/admin/vessels">
              <ListItem button>
                <ListItemText
                  primary="Vessels"
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
            <NavLink to="/admin/subcategory">
              <ListItem button>
                <ListItemText
                  primary="Sub Category"
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

Admin.propTypes = {
  classes: PropTypes.object.isRequired,
  handleClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(sidebarStyle)(Admin);
