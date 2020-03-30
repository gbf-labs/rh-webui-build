import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import classNames from "classnames";
import { withSnackbar } from "notistack";
import PropTypes from "prop-types";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import request from "utils/request";
import general from "../../variables/general";
import auth from "../../utils/auth";

const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};
let profInterval = null;
class UserProfile extends React.Component {
  state = {
    userDataForm: {
      userName: {
        required: true,
        value: "",
        name: "Username"
      },
      userFName: {
        required: true,
        value: "",
        name: "First Name"
      },
      userMName: {
        required: false,
        value: "",
        name: "Middle Name"
      },
      userLName: {
        required: true,
        value: "",
        name: "Last Name"
      },
      userEmail: {
        required: true,
        value: "",
        name: "Email"
      },
      userPassword: {
        required: false,
        value: "",
        name: "Password"
      },
      userCompanies: {
        required: true,
        value: [],
        name: "Companies"
      },
      userRoles: {
        required: true,
        value: [],
        name: "Roles"
      },
      userVessels: {
        required: false,
        value: [],
        name: "Vessels"
      }
    }
  };

  componentDidMount() {
    this.getProfile();
    profInterval = setInterval(
      () => this.getProfile(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(profInterval);
  }

  getProfile = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/profile";
    request(requestURL, {
      method: "GET"
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        const data = response.data;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.userDataForm.userName.value = data.username;
        stateCopy.userDataForm.userFName.value = data.first_name;
        stateCopy.userDataForm.userMName.value = data.middle_name;
        stateCopy.userDataForm.userLName.value = data.last_name;
        stateCopy.userDataForm.userEmail.value = data.email;
        let companyIds = [];
        if (data.companies) {
          data.companies.forEach(company => {
            companyIds.push(company.company_id);
          });
        }
        stateCopy.userDataForm.userCompanies.value = companyIds;
        let roleIds = [];
        if (data.roles) {
          data.roles.forEach(role => {
            roleIds.push(role.role_id);
          });
        }
        stateCopy.userDataForm.userRoles.value = roleIds;
        stateCopy.userDataForm.userVessels.value = data.vessels || [];
        this.setState(stateCopy);
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleTextChangeDialog = e => {
    const name = e.target.name;
    const value = e.target.value;
    let stateCopy = Object.assign({}, this.state);
    stateCopy.userDataForm[name].value = value;

    this.setState(stateCopy);
  };

  updateProfile = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/update";
    const params = {
      account_id: auth.getUserInfo().id,
      companies: this.state.userDataForm.userCompanies.value,
      roles: this.state.userDataForm.userRoles.value,
      vessels: this.state.userDataForm.userVessels.value,
      username: this.state.userDataForm.userName.value,
      first_name: this.state.userDataForm.userFName.value,
      last_name: this.state.userDataForm.userLName.value,
      middle_name: this.state.userDataForm.userMName.value,
      email: this.state.userDataForm.userEmail.value,
      url: window.location.host,
      status: true
    };

    if (this.state.userDataForm.userPassword.value.trim()) {
      params.password = general.encryptText(
        this.state.userDataForm.userPassword.value.trim()
      );
    }
    let reqType = "PUT";
    const errors = general.validateForm(this.state.userDataForm);
    if (errors.length > 0) {
      errors.forEach(err => {
        this.props.enqueueSnackbar(err, { variant: "error" });
      });
      return;
    }
    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.getProfile();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray">
                <h4 className={classes.cardTitleWhite}>Edit Profile</h4>
                <p className={classes.cardCategoryWhite}>
                  Complete your profile
                </p>
              </CardHeader>
              <CardBody>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        required={true}
                        value={this.state.userDataForm.userFName.value}
                        label="First Name"
                        id="userFName"
                        name="userFName"
                        onChange={this.handleTextChangeDialog}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        required={false}
                        value={this.state.userDataForm.userMName.value}
                        label="Middle Name"
                        id="userMName"
                        name="userMName"
                        onChange={this.handleTextChangeDialog}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        required={true}
                        value={this.state.userDataForm.userLName.value}
                        label="Last Name"
                        id="userLName"
                        name="userLName"
                        onChange={this.handleTextChangeDialog}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
                <GridContainer>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        required={true}
                        value={this.state.userDataForm.userName.value}
                        label="Username"
                        id="userName"
                        name="userName"
                        onChange={this.handleTextChangeDialog}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        required={true}
                        value={this.state.userDataForm.userEmail.value}
                        label="Email"
                        id="userEmail"
                        name="userEmail"
                        onChange={this.handleTextChangeDialog}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                      />
                    </FormControl>
                  </GridItem>
                  <GridItem xs={12} sm={12} md={4}>
                    <FormControl margin="normal" required fullWidth>
                      <TextField
                        required={true}
                        value={this.state.userDataForm.userPassword.value}
                        label="Password"
                        id="userPassword"
                        name="userPassword"
                        type="password"
                        onChange={this.handleTextChangeDialog}
                        className={classNames(
                          classes.margin,
                          classes.textField
                        )}
                      />
                    </FormControl>
                  </GridItem>
                </GridContainer>
              </CardBody>
              <CardFooter>
                <Button color="info" onClick={this.updateProfile}>
                  Update Profile
                </Button>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

UserProfile.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(UserProfile));
