import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

// @material-ui
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

//core components
import styles from "assets/jss/material-dashboard-react/layouts/signInStyle.jsx";

//helpers
import general from "variables/general";
import request from "utils/request";
import auth from "utils/auth";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      redirectToReferrer: false,
      value: {},
      errors: [],
      didCheckErrors: false
    };
    this.checkSession = this.checkSession.bind(this);
    this.resizeFunction = this.resizeFunction.bind(this);
  }

  componentDidMount() {
    this.checkSession();
    window.addEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      // eslint-disable-next-line react/no-string-refs
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }

  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }

  checkSession() {
    if (auth.getToken() !== null && auth.getToken() !== "") {
      this.props.history.push("/dashboard");
    }
  }

  handleRequest = response => {
    if (response.status.toString().toLowerCase() === "failed") {
      if (response.alert.toString().toLowerCase() === "invalid token") {
        localStorage.clear();
        sessionStorage.clear();
        this.props.history.push("/signin");
        return false;
      }
      this.props.enqueueSnackbar(response.alert, { variant: "warning" });
      return false;
    }
    return true;
  };

  changePassword = e => {
    e.preventDefault();
    const body = this.state.value;
    const email = body.email;
    const auth = body.authkey;
    const pwd = body.password;
    const pwd2 = body.password2;
    const requestURL = process.env.REACT_APP_API_URL + "/user/reset/password";
    if (pwd !== pwd2) {
      this.props.enqueueSnackbar("Passwords do not match!", {
        variant: "error"
      });
      return;
    }
    const params = {
      email: email.trim(),
      new_password: general.encryptText(pwd.trim()),
      reset_token: auth
    };

    request(requestURL, { method: "PUT", body: params }, true)
      .then(response => {
        if (!this.handleRequest(response)) return;
        this.props.enqueueSnackbar("Password successfully changed!", {
          variant: "success"
        });

        this.redirectUser();
      })
      .catch(() => {
        this.props.enqueueSnackbar("API error. Failed to send data.", {
          variant: "error"
        });
      });
  };

  handleChange = ({ target }) => {
    this.setState({
      value: { ...this.state.value, [target.name]: target.value }
    });
  };

  redirectUser = () => {
    this.props.history.push("/");
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

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
            <Typography component="h1" variant="title">
              Change Password
            </Typography>
            <form className={classes.form} onSubmit={this.changePassword}>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input
                  onChange={this.handleChange}
                  id="email"
                  name="email"
                  autoFocus
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">New Password</InputLabel>
                <Input
                  onChange={this.handleChange}
                  type="password"
                  name="password"
                  id="password"
                  autoFocus
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password2">
                  Re-type New Password
                </InputLabel>
                <Input
                  onChange={this.handleChange}
                  name="password2"
                  type="password"
                  id="password2"
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="authkey">Authentication key</InputLabel>
                <Input
                  onChange={this.handleChange}
                  id="authkey"
                  type="password"
                  name="authkey"
                  autoFocus
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </main>
      </div>
    );
  }
}

ChangePassword.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withStyles(styles)(withSnackbar(ChangePassword));
