import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";
// @material-ui/icons
import Menu from "@material-ui/icons/Menu";
// core components
import HeaderLinks from "./HeaderLinks.jsx";
import CustomBreadCrumbs from "components/CustomBreadCrumbs/CustomBreadCrumbs.jsx";
import headerStyle from "assets/jss/material-dashboard-react/components/headerStyle.jsx";

class Header extends React.Component {
  render() {
    const { classes, color } = this.props;
    const appBarClasses = classNames({
      [" " + classes[color]]: color
    });

    return (
      <AppBar className={classes.appBar + appBarClasses}>
        <Toolbar className={classes.container}>
          <Hidden mdUp implementation="css">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.props.handleDrawerToggle}
            >
              <Menu />
            </IconButton>
          </Hidden>
          <Hidden smDown implementation="css">
            <HeaderLinks />
          </Hidden>
          <div className={classes.flex}>
            <CustomBreadCrumbs
              routes={this.props.routes}
              history={this.props.history}
              handleChangeSearch={this.props.handleChangeSearch}
              handleChangeGlobalDTPicker={this.props.handleChangeGlobalDTPicker}
              suggestions={this.props.searchSuggestions}
              selectedSuggestions={this.props.selectedSuggestions}
              selectedSearchSuggestions={this.props.selectedSearchSuggestions}
              withGlobalDTPicker={this.props.withGlobalDTPicker}
              globalDTPickerValue={this.props.globalDTPickerValue}
              selectedVesselState={this.props.selectedVesselState}
            />
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"]),
  handleChangeSearch: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleChangeGlobalDTPicker: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  searchSuggestions: PropTypes.array.isRequired,
  selectedSuggestions: PropTypes.array.isRequired,
  selectedSearchSuggestions: PropTypes.array.isRequired,
  globalDTPickerValue: PropTypes.string,
  handleDrawerToggle: PropTypes.func.isRequired,
  selectedVesselState: PropTypes.string.isRequired
};

export default withStyles(headerStyle)(Header);
