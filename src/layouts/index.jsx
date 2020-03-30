/* eslint-disable */
import React from "react";
import PropTypes from "prop-types";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { withSnackbar } from 'notistack';

// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

// core components
import Header from "components/Header/Header.jsx";
import Footer from "components/Footer/Footer.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";

import dashboardRoutes from "routes/dashboard.jsx";
import dashboardStyle from "assets/jss/material-dashboard-react/layouts/dashboardStyle.jsx";
import auth from 'utils/auth';
import image from "assets/img/login.jpg";
import logo from "assets/img/favicon_rh-48x48.png";
import AlertDialogs from "components/Dialogs/AlertDialogs";

class Dashboard extends React.Component {
  state = {
    timeOutCtr: 0,
    alertDialog: {
      openDialog: false,
      withCancelBtn: false,
      dialogTitle: 'test',
      dialogBody: 'test',
      cb: ()=>{}
    },
    searchBox: {
      selectedVesselState: "all",
      suggestions: [],
      selectedSearchSuggestions: [],
      selectedSuggestions: [],
      value: ""
    },
    globalDTPicker: {
      withGlobalDTPicker: false,
      value: null
    },
    mobileOpen: false
  }

  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
      const ps = new PerfectScrollbar(this.refs.mainPanel);
    }
    this.checkSession(); 
    window.addEventListener("resize", this.resizeFunction);
  }

  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  openAlertDialog = (diagTitle, diagBody, cb, withCancelBtn) => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.alertDialog.openDialog = true;
    stateCopy.alertDialog.dialogTitle = diagTitle;
    stateCopy.alertDialog.dialogBody = diagBody;
    stateCopy.alertDialog.withCancelBtn = withCancelBtn || false;
    stateCopy.alertDialog.cb = cb;
    this.setState(stateCopy);
  };

  closeDialog = (type) => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.alertDialog.openDialog = false;
    if(type === 'ok'){
      stateCopy.alertDialog.cb()            
    }
    this.setState(stateCopy);
  };

  logoutUser = () =>{
    localStorage.clear();
    sessionStorage.clear();
    this.props.history.push('/signin')
  }

  requestTimeoutChckr = (ctr) => {
    let stateCopy = Object.assign({}, this.state);
    if(ctr === 0){
      stateCopy.timeOutCtr = 0;
    } else {
      stateCopy.timeOutCtr = stateCopy.timeOutCtr+1;
    }
    this.setState(stateCopy);
  }

  handleRequest = (response) => {
    if(!response){
      let stateCopy = Object.assign({}, this.state);
      this.requestTimeoutChckr(1);
      if (stateCopy.timeOutCtr < 5) {
        this.props.enqueueSnackbar("API error. Failed to fetch data.", {
          variant: "error"
        });
      } else {
        this.props.enqueueSnackbar("Looks like there is a problem with your connection, one cause could be that you are not connected to the VPN client.", { variant: 'warning' });
      }
      return false;
    } else {
      this.requestTimeoutChckr(0);
      if((response.status).toString().toLowerCase() === 'failed'){
        if((response.alert).toString().toLowerCase() === 'invalid token'){
          this.openAlertDialog('Invalid Token', 'This is either your session has expired or new user login is detected. Please relogin to use the platform.', this.logoutUser);
          return false;
        }
        this.props.enqueueSnackbar(response.alert, { variant: 'warning' });
        return false;
      }
      return true;
    }
  };

  checkSession = () => {
    if(auth.getToken() === null || auth.getToken() === ''){
      this.logoutUser();
    }
  }

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  getRoute = () => {
    return this.props.location.pathname !== "/maps";
  }
  
  resizeFunction = () => {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  handleChangeSearch = val => {
    let stateCopy = Object.assign({}, this.state);
    if(val){
      if(val.vessel_id){
        stateCopy.searchBox.selectedSuggestions = (val ? [val] : []);
        stateCopy.searchBox.selectedSearchSuggestions = (val ? [val] : []);
      } else {
        stateCopy.searchBox.selectedSuggestions = (stateCopy.searchBox.suggestions).filter(obj => {
          return ((obj.label).toLowerCase()).includes((val.label).toLowerCase());
        })
      }
    } else {
      stateCopy.searchBox.selectedSuggestions = [];
      stateCopy.searchBox.selectedSearchSuggestions = [];
      if (stateCopy.searchBox.selectedVesselState !== "all") {
        stateCopy.searchBox.selectedSuggestions = (stateCopy.searchBox.suggestions).filter(obj => {
          return ((obj.update_state).toLowerCase()) === ((stateCopy.searchBox.selectedVesselState).toLowerCase());
        })
      }
    }

    this.setState(stateCopy);
  }

  sidebarFilter = val => {
    let stateCopy = Object.assign({}, this.state);
    if(val){
      if(val.value === "all"){
        stateCopy.searchBox.selectedSuggestions = stateCopy.searchBox.suggestions;
      } else {
        const temp = (stateCopy.searchBox.suggestions).filter(obj => {
          return ((obj.update_state).toLowerCase()) === ((val.value).toLowerCase());
        })

        stateCopy.searchBox.selectedSuggestions = temp;
      }

      if(val.value !== stateCopy.searchBox.selectedVesselState){
        stateCopy.searchBox.selectedSearchSuggestions = [];
      }

    } else {
      stateCopy.searchBox.selectedSuggestions = stateCopy.searchBox.suggestions;
    }
    stateCopy.searchBox.selectedVesselState = val.value;

    this.setState(stateCopy);
  }

  updateSearchSuggestions = suggestions => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.searchBox.suggestions = suggestions;
    this.setState(stateCopy);
  }

  handleChangeGlobalDTPicker = val => {
    let stateCopy = Object.assign({}, this.state);

    let v = null
    if(val) {
      v = (new Date(val)).setUTCSeconds(0)
    }

    stateCopy.globalDTPicker.value = v;
    this.setState(stateCopy);
  }

  updateGlobalDTPicker = value => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.globalDTPicker.withGlobalDTPicker = value;
    this.setState(stateCopy);
  }


  render() {
    const { classes, ...rest } = this.props;
    const switchRoutes = (
      <Switch>
        {dashboardRoutes.map((prop, key) => {
          if (prop.redirect) {
            return <Redirect from={prop.path} to={prop.to} key={key} />;
          }

          return <Route 
                    path={prop.path}
                    render={props =>
                      auth.authenticateRoutes(prop.permissionName) ? (
                        <prop.component {...props} 
                          openAlertDialog={this.openAlertDialog}
                          timeOutCtr={this.state.timeOutCtr}
                          updateSearchSuggestions={this.updateSearchSuggestions}
                          searchSuggestions={this.state.searchBox.suggestions}
                          selectedSuggestions={this.state.searchBox.selectedSuggestions}
                          closeDialog={this.closeDialog}
                          handleRequest={this.handleRequest}
                          withGlobalDTPicker={prop.withGlobalDTPicker}
                          updateGlobalDTPicker={this.updateGlobalDTPicker}
                          globalDTPickerValue={this.state.globalDTPicker.value}
                          handleChangeGlobalDTPicker={this.handleChangeGlobalDTPicker}
                          selectedVesselState={this.state.searchBox.selectedVesselState}
                        />
                      ) : (
                        <Redirect
                          to={{
                            pathname: "/404"
                          }}
                        />
                      )
                    }
                    key={key}
                  />;
        })}
      </Switch>
    );
    
    return (
      <div className={classes.wrapper}>
        <Sidebar
          routes={dashboardRoutes}
          logoText={"RH Box"}
          logo={logo}
          image={image}
          handleDrawerToggle={this.handleDrawerToggle}
          open={this.state.mobileOpen}
          color="gray"
          pathname={this.props.location}
          handleRequest={this.handleRequest}
          updateSearchSuggestions={this.updateSearchSuggestions}
          searchSuggestions={this.state.searchBox.suggestions}
          selectedSuggestions={this.state.searchBox.selectedSuggestions}
          sidebarFilter={this.sidebarFilter}
          selectedVesselState={this.state.searchBox.selectedVesselState}
          {...rest}
        />
        <div className={classes.mainPanel} ref="mainPanel">
          <Header
            routes={dashboardRoutes}
            handleDrawerToggle={this.handleDrawerToggle}
            handleChangeSearch={this.handleChangeSearch}
            searchSuggestions={this.state.searchBox.suggestions}
            selectedSuggestions={this.state.searchBox.selectedSuggestions}
            selectedSearchSuggestions={this.state.searchBox.selectedSearchSuggestions}
            handleChangeGlobalDTPicker={this.handleChangeGlobalDTPicker}
            withGlobalDTPicker={this.state.globalDTPicker.withGlobalDTPicker}
            globalDTPickerValue={this.state.globalDTPicker.value}
            selectedVesselState={this.state.searchBox.selectedVesselState}
            {...rest}
          />
          <AlertDialogs 
            alertDialog={this.state.alertDialog}
            closeDialog={this.closeDialog}
            {...rest}
          />
          {/* On the /maps route we want the map to be on full screen - this is not possible if the content and conatiner classes are present because they have some paddings which would make the map smaller */}
          {this.getRoute() ? (
            <div className={classes.content}>
              <div className={classes.container}>{switchRoutes}</div>
            </div>
          ) : (
            <div className={classes.map}>{switchRoutes}</div>
          )}
          {this.getRoute() ? <Footer /> : null}
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(
  withSnackbar(Dashboard),
);