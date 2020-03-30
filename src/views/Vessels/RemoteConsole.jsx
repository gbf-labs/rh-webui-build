import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import ErrorIcon from "@material-ui/icons/Error";
import Router from "@material-ui/icons/Router";
import NetworkCheck from "@material-ui/icons/NetworkCheck";
import Apps from "@material-ui/icons/Apps";
import PowerInput from "@material-ui/icons/PowerInput";
import CodeIcon from "@material-ui/icons/Code";

//core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomTabs from "components/CustomTabs/CustomTabs.jsx";
import RemoteConsoleDialog from "components/Dialogs/RemoteConsoleDialog";

//helpers
import request from "utils/request";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  wrapper: {
    margin: theme.spacing(1),
    position: "relative",
    textAlign: "center"
  },
  button: {
    margin: "10px 0",
    width: "100%"
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

  item: {
    paddingLeft: 5
  },
  group: {
    fontWeight: "bold",
    opacity: 1,
    cursor: "default",
    "&:hover": {
      backgroundColor: "transparent !important"
    }
  },
  fabProgress: {
    color: green[500],
    position: "absolute",
    top: "20%",
    left: "45%",
    zIndex: 1
  }
});

class RemoteConsole extends React.Component {
  state = {
    loading: false,
    postCommandLoading: false,
    postCommandLoadingButtons: [],
    remoteCommandsData: [],
    remoteCommands: [],
    remoteDialog: {
      openDialog: false,
      title: "",
      others: [],
      description: "",
      key: "",
      label: ""
    }
  };

  componentDidMount() {
    this.getRemoteCommands();
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {}

  loadIcons = icn => {
    switch (icn) {
      case "Apps":
        return Apps;
      case "PowerInput":
        return PowerInput;
      case "NetworkCheck":
        return NetworkCheck;
      case "Router":
        return Router;
      case "ErrorIcon":
        return ErrorIcon;
      case "CodeIcon":
        return CodeIcon;
      default:
        return null;
    }
  };

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
      stateCopy.remoteDialog.label,
      null
    );
  };

  createGridButtons = (optns, label) => {
    const { classes } = this.props;
    return (
      <GridContainer>
        {optns.map((opt, indx) => {
          return (
            <GridItem xs={3} sm={3} md={3} key={indx}>
              <div className={classes.wrapper}>
                {label === "SSH" && (
                  <Tooltip title={opt.option}>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={opt.option}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.postCommandLoading}
                        className={this.props.classes.button}
                      >
                        {opt.option}
                      </Button>
                    </a>
                  </Tooltip>
                )}
                {opt.others &&
                  label !== "SSH" && (
                    <Tooltip title={opt.description}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.postCommandLoading}
                        className={this.props.classes.button}
                        onClick={() =>
                          this.handleClickOpen(opt.option, opt, label)
                        }
                      >
                        {opt.option}
                      </Button>
                    </Tooltip>
                  )}
                {!opt.others &&
                  label !== "SSH" && (
                    <Tooltip title={opt.description}>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={this.state.postCommandLoading}
                        className={this.props.classes.button}
                        onClick={() =>
                          this.postRemoteCommands(opt.option, {}, label, indx)
                        }
                      >
                        {opt.option}
                      </Button>
                    </Tooltip>
                  )}
                {this.state.postCommandLoading &&
                  this.state.postCommandLoadingButtons[indx] === true && (
                    <CircularProgress
                      size={35}
                      className={classes.fabProgress}
                    />
                  )}
              </div>
            </GridItem>
          );
        })}
      </GridContainer>
    );
  };

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  postRemoteCommands(key, others, label, indx) {
    const requestURL = process.env.REACT_APP_API_URL + "/remote/command";
    const params = {
      key,
      others,
      label,
      vessel_id: this.props.match.params.vessel_id
    };
    let reqType = "POST";
    let postCommandLoadingButtons = this.state.postCommandLoadingButtons;
    postCommandLoadingButtons[indx] = true;
    this.setState(
      {
        postCommandLoadingButtons: postCommandLoadingButtons,
        postCommandLoading: true
      },
      () => {
        this.setState({
          remoteCommands: this.state.remoteCommandsData.map(elm => ({
            ...elm,
            tabName: elm.label,
            tabIcon: this.loadIcons(elm.icon),
            tabContent: this.createGridButtons(elm.options, elm.label)
          }))
        });
      }
    );
    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar("Success", { variant: "success" });
        postCommandLoadingButtons[indx] = false;
        this.setState({
          postCommandLoadingButtons: postCommandLoadingButtons,
          postCommandLoading: false
        });
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

  getRemoteCommands() {
    const requestURL = process.env.REACT_APP_API_URL + "/remote/command";
    const vessId = this.props.match.params.vessel_id;

    request(requestURL, {
      method: "GET",
      params: {
        vessel_id: vessId
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        this.setState({
          remoteCommandsData: response.data,
          remoteCommands: response.data.map(elm => ({
            ...elm,
            tabName: elm.label,
            tabIcon: this.loadIcons(elm.icon),
            tabContent: this.createGridButtons(elm.options, elm.label)
          }))
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  }

  render() {
    const { ...rest } = this.props;

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <CustomTabs
              title="Please select a command:"
              headerColor="gray"
              tabs={this.state.remoteCommands}
            />
          </GridItem>
        </GridContainer>
        <RemoteConsoleDialog
          remoteDialog={this.state.remoteDialog}
          closeDialog={this.closeDialog}
          handleClose={this.handleClose}
          handleChangeValue={this.handleChangeValue}
          createOthersData={this.createOthersData}
          {...rest}
        />
      </div>
    );
  }
}

RemoteConsole.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(RemoteConsole));
