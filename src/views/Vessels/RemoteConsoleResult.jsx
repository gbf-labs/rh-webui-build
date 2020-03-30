import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import * as Anser from "anser";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

//core components
import GridContainer from "components/Grid/GridContainer.jsx";
import GridItem from "components/Grid/GridItem.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import Button from "components/CustomButtons/Button.jsx";

const styles = () => ({
  root: {
    flexGrow: 1,
    margin: "10px 0 10px 0",
    padding: "5px"
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
  commandArea: {
    color: "#333",
    backgroundColor: "#eee",
    borderColor: "#e0e0e0"
  },
  resultArea: {
    color: "#31708f",
    backgroundColor: "black",
    borderColor: "#bce8f1"
  },
  textFormatter: {
    fontFamily: "monospace",
    marginLeft: "5px",
    paddingLeft: "5px",
    borderLeft: "1px solid lightgrey",
    whiteSpace: "pre"
  }
});

class RemoteConsoleResult extends React.Component {
  state = {
    loading: false,
    remoteCommands: []
  };

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  UNSAFE_componentWillMount() {
    if (!this.props.location.state) {
      this.props.history.push("/");
      return;
    }
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    const { classes } = this.props;
    return (
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color="gray" className={classes.CardHeaderIcon}>
              <h4 className={classes.cardTitleWhite}>
                {this.props.location.state.commandLabel +
                  " : " +
                  this.props.location.state.commandKey}
              </h4>
            </CardHeader>
            {this.props.location.state && (
              <CardBody>
                <Paper className={classes.root}>
                  <Typography variant="button" display="block">
                    Connection Info
                  </Typography>
                  <div className={classes.textFormatter}>
                    {this.props.location.state.connectionInfo}
                  </div>
                </Paper>
                <Paper className={classes.root}>
                  <Typography variant="button" display="block">
                    Command
                  </Typography>
                  <div
                    className={
                      classes.textFormatter + " " + classes.commandArea
                    }
                    dangerouslySetInnerHTML={{
                      __html: Anser.ansiToHtml(
                        this.props.location.state.commandInfo
                      )
                    }}
                  />
                </Paper>
                <Paper className={classes.root}>
                  <Typography variant="button" display="block">
                    Result
                  </Typography>
                  <div
                    className={classes.textFormatter + " " + classes.resultArea}
                    dangerouslySetInnerHTML={{
                      __html: Anser.ansiToHtml(
                        this.props.location.state.commandResult
                      )
                    }}
                  />
                </Paper>
                <Button
                  onClick={this.goBack}
                  color="info"
                  className={classes.button2}
                >
                  Back
                </Button>
              </CardBody>
            )}
          </Card>
        </GridItem>
      </GridContainer>
    );
  }
}

RemoteConsoleResult.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(RemoteConsoleResult));
