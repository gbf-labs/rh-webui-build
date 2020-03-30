import React from "react";
import PropTypes from "prop-types";

// @material-ui
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

//core components
import signInStyle from "assets/jss/material-dashboard-react/layouts/signInStyle.jsx";

class InvalidPage extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      localStorage.clear();
      sessionStorage.clear();
      this.props.history.push("/signin");
    }, 5000);
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.parentMain}>
        <main className={classes.main}>
          <CssBaseline />
          <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockIcon />
            </Avatar>
            <Typography component="h4" variant="title">
              Invalid Access!
            </Typography>
            <br />
            <Typography component="p">
              You are not allowed to access page not binded to your user
              account! You will now be redirected to the login page.
            </Typography>
          </Paper>
        </main>
      </div>
    );
  }
}

InvalidPage.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default withStyles(signInStyle)(InvalidPage);
