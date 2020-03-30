import React from "react";
import PropTypes from "prop-types";
import { matchPath } from "react-router";
import { NavLink } from "react-router-dom";

import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import HomeIcon from "@material-ui/icons/Home";
import SelectDropdown from "components/AutoComplete/SelectDropdown.jsx";

import { MuiPickersUtilsProvider, DateTimePicker } from "material-ui-pickers";
import MomentUtils from "@date-io/moment";
import Grid from "@material-ui/core/Grid";

const moment = require("moment-timezone");

const styles = theme => ({
  root: {
    padding: `${theme.spacing.unit * 2 - 1}px ${theme.spacing.unit * 2 - 5}px`
  },
  link: {
    display: "flex",
    color: "rgba(0, 0, 0, 0.8)",
    "&:hover": {
      color: "rgba(0, 0, 0, 1)"
    }
  },
  link2: {
    display: "flex",
    color: "#999999",
    "&:hover,&:visited,&:focus": {
      color: "#999999"
    }
  },
  icon: {
    marginRight: theme.spacing.unit / 2,
    width: 20,
    height: 20
  },
  filterContainer: {
    display: "flex",
    flexDirection: "column"
  },
  globalDTPicker: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginLeft: 0,
    float: "right",
    right: 0,
    bottom: "33px",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing.unit,
      width: "auto"
    }
  },
  searchBoxStyles: {
    marginTop: "0px",
    padding: "2px 15px",
    marginBottom: "0px",
    width: "auto",
    minWidth: "185px",
    marginLeft: "8px",
    float: "right",
    right: 0,
    bottom: "27px",
    position: "relative",
    borderRadius: "4px",
    backgroundColor: "rgba(0, 0, 0, 0.15)"
  }
});

class CustomBreadCrumbs extends React.Component {
  makeNavs = classes => {
    let nav = [];

    this.props.routes.map(prop => {
      if (this.props.history) {
        const routerMatcher = matchPath(this.props.history.location.pathname, {
          path: prop.path,
          exact: true,
          strict: false
        });
        if (routerMatcher) {
          const navbarname = prop.navbarName.split(">");
          const bcRoutes = prop.breadCrumbRoutes;
          const params = this.props.history.location.pathname.split("/");
          for (let i = 0; i < bcRoutes.length; i++) {
            if (bcRoutes[i] === "") {
              if (navbarname[i].split(":").length > 1 && prop.paramsName) {
                const paramName = navbarname[i].split(":")[1];
                const paramValue = prop.paramsName[paramName];
                nav.push(
                  <Typography key={i} className={classes.link2}>
                    {params[paramValue]}
                  </Typography>
                );
              } else {
                nav.push(
                  <Typography key={i} className={classes.link2}>
                    {navbarname[i]}
                  </Typography>
                );
              }
            } else {
              if (navbarname[i].split(":").length > 1 && prop.paramsName) {
                const paramName = navbarname[i].split(":")[1];
                const paramValue = prop.paramsName[paramName];

                if (params[paramValue]) {
                  let spldRoute = bcRoutes[i].split("/");
                  for (let x = 0; x < spldRoute.length; x++) {
                    const r = spldRoute[x];
                    if (r.split(":").length > 1) {
                      const paramName2 = r.split(":")[1];
                      const paramValue2 = prop.paramsName[paramName2];
                      spldRoute[x] = params[paramValue2];
                    }
                  }
                  spldRoute = spldRoute.join("/");

                  nav.push(
                    <NavLink key={i} to={spldRoute} className={classes.link}>
                      {params[paramValue]}
                    </NavLink>
                  );
                }
              } else {
                let spldRoute = bcRoutes[i].split("/");
                for (let x = 0; x < spldRoute.length; x++) {
                  const r = spldRoute[x];
                  if (r.split(":").length > 1) {
                    const paramName2 = r.split(":")[1];
                    const paramValue2 = prop.paramsName[paramName2];
                    spldRoute[x] = params[paramValue2];
                  }
                }
                spldRoute = spldRoute.join("/");

                nav.push(
                  <NavLink key={i} to={spldRoute} className={classes.link}>
                    {navbarname[i]}
                  </NavLink>
                );
              }
            }
          }
        }
        return null;
      }
      return null;
    });
    return nav;
  };

  render() {
    const { classes } = this.props;
    const navs = this.makeNavs(classes);
    moment.tz.setDefault("UTC");
    let suggestions = this.props.suggestions;

    if (this.props.selectedVesselState !== "all") {
      const temp = suggestions.filter(obj => {
        return (
          obj.update_state.toLowerCase() ===
          this.props.selectedVesselState.toLowerCase()
        );
      });
      suggestions = temp;
    }
    return (
      <div>
        {navs.length > 0 && (
          <Paper className={classes.root}>
            <Breadcrumbs arial-label="Breadcrumb">
              <NavLink to="/" className={classes.link}>
                <HomeIcon className={classes.icon} />
              </NavLink>
              {navs}
            </Breadcrumbs>
            {this.props.history.location.pathname === "/maps" && (
              <SelectDropdown
                suggestions={suggestions}
                handleChange={this.props.handleChangeSearch}
                placeholder="Search..."
                createOptionPosition="first"
                padding={classes.searchBoxStyles}
                value={this.props.selectedSearchSuggestions}
                disableUnderline={true}
              />
            )}
            {this.props.withGlobalDTPicker && (
              <div className={classes.globalDTPicker}>
                <MuiPickersUtilsProvider utils={MomentUtils}>
                  <Grid
                    container
                    className={classes.grid + " " + classes.filterContainer}
                    justify="flex-start"
                  >
                    <DateTimePicker
                      margin="none"
                      label="Date Time Filter"
                      value={this.props.globalDTPickerValue}
                      onChange={this.props.handleChangeGlobalDTPicker}
                      disableFuture
                      showTodayButton
                      clearable
                      autoOk
                      ampm={false}
                      format="DD/MM/YYYY kk:mm:ss"
                    />
                  </Grid>
                </MuiPickersUtilsProvider>
              </div>
            )}
          </Paper>
        )}
      </div>
    );
  }
}

CustomBreadCrumbs.propTypes = {
  classes: PropTypes.object.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  routes: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  globalDTPickerValue: PropTypes.string,
  handleChangeGlobalDTPicker: PropTypes.func.isRequired,
  suggestions: PropTypes.array.isRequired,
  selectedSuggestions: PropTypes.array.isRequired,
  selectedSearchSuggestions: PropTypes.array.isRequired,
  handleChangeSearch: PropTypes.func.isRequired,
  selectedVesselState: PropTypes.string.isRequired
};

export default withStyles(styles)(CustomBreadCrumbs);
