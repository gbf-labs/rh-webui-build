import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { withSnackbar } from "notistack";
import ReactSelect from "react-select";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DirectionsBoat from "@material-ui/icons/DirectionsBoat";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Tooltip from "@material-ui/core/Tooltip";
import TableSortLabel from "@material-ui/core/TableSortLabel";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SelectDropdown from "components/AutoComplete/SelectDropdown.jsx";

// helpers
import request from "utils/request";
import general from "../../variables/general";
import auth from "utils/auth";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
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
  centerAlign: {
    textAlign: "center"
  },
  filterIcon: {
    float: "right",
    fontSize: "25px !important",
    cursor: "pointer"
  },
  marginBottom: {
    marginBottom: "10px"
  }
});

let timer = null,
  roleInterval = null,
  userInterval = null,
  compInterval = null;
class RBACUsers extends React.Component {
  state = {
    alertDialog: {
      openDialog: false,
      withCancelBtn: true,
      dialogTitle: "test",
      dialogBody: "test",
      cb: () => {}
    },
    openDialog: false,
    loading: false,
    dialogType: "invite",
    userList: [],
    roleList: [],
    defComp: [],
    defRole: [],
    compList: [],
    selectedAll: false,
    selectedUserId: [],
    userDataForm: {
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
      userCompany: {
        required: true,
        value: [], // compname
        value2: [], // compId
        name: "Company"
      },
      userRole: {
        required: true,
        value: [],
        value2: [],
        name: "Roles"
      },
      userVessel: {
        required: false,
        value: [], // vesselId
        value2: [], // vessel Names
        value3: [], // allow/disallow access
        name: "Vessels"
      }
    },
    limit: 10,
    page: 0,
    totalCount: 0,
    //table filter
    filterOpen: true,
    filterUsername: "",
    filterEmail: "",
    filterCompany: "",
    filterStatus: "",
    sortType: "",
    sortVal: "",
    usernameList: [],
    emailList: [],
    statusList: []
  };

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  toggleFilter = isFiltering => {
    this.setState({
      filterOpen: isFiltering
    });
  };

  componentDidMount() {
    this.getRole();
    this.getUsers();
    this.getCompany();
    roleInterval = setInterval(
      () => this.getRole(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    userInterval = setInterval(
      () => this.getUsers(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    compInterval = setInterval(
      () => this.getCompany(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(roleInterval);
    clearInterval(userInterval);
    clearInterval(compInterval);
  }

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getUsers();
      }
    );
  };

  handleSort = (orderBy, orderDirection) => {
    let orderDir = orderDirection;
    if (orderDirection === "asc") {
      orderDir = "desc";
    } else {
      orderDir = "asc";
    }
    this.setState(
      {
        sortVal: orderBy,
        sortType: orderDir
      },
      () => {
        this.getUsers();
      }
    );
  };

  handleChangeField = name => event => {
    clearInterval(timer);
    let val = event || "";
    if (val) {
      val = event.value;
    }
    if (name === "email") {
      this.setState({
        filterEmail: val,
        page: 0
      });
    } else if (name === "username") {
      this.setState({
        filterUsername: val,
        page: 0
      });
    } else if (name === "status") {
      this.setState({
        filterStatus: val,
        page: 0
      });
    }

    timer = setTimeout(() => {
      this.getUsers();
    }, 500);
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getUsers();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleClickOpen = type => {
    this.setState(
      {
        dialogType: type,
        openDialog: true
      },
      () => {
        if (type === "update") {
          this.getUserCompany(this.state.selectedUserId);

          let obj = this.state.userList.find(
            o => o.id === this.state.selectedUserId[0]
          );
          let stateCopy = Object.assign({}, this.state);
          stateCopy.userDataForm.userFName.value = obj.first_name;
          stateCopy.userDataForm.userMName.value = obj.middle_name;
          stateCopy.userDataForm.userLName.value = obj.last_name;
          stateCopy.userDataForm.userEmail.value = obj.email;
          let roles = [];
          let roleIds = [];
          let defRl = [];
          if (obj.roles) {
            obj.roles.forEach(role => {
              roles.push(role.role_id + "-" + role.role_name);
              roleIds.push(role.role_id);
              defRl.push({
                value: role.role_id,
                label: role.role_name
              });
            });
          }
          stateCopy.defRole = defRl;
          stateCopy.userDataForm.userRole.value = roles;
          stateCopy.userDataForm.userRole.value2 = roleIds;

          let companies = [];
          let companyIds = [];
          let defCm = [];
          if (obj.companies) {
            obj.companies.forEach(company => {
              companies.push(company.company_id + "-" + company.company_name);
              companyIds.push(company.company_id);
              defCm.push({
                value: company.company_id,
                label: company.company_name
              });
            });
          }

          stateCopy.defComp = defCm;
          stateCopy.userDataForm.userCompany.value = companies;
          stateCopy.userDataForm.userCompany.value2 = companyIds;

          this.setState(stateCopy);
        }
      }
    );
  };

  handleClose = () => {
    this.setState(
      {
        openDialog: false
      },
      () => {
        this.resetForm();
      }
    );
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.userDataForm.userFName.value = "";
    stateCopy.userDataForm.userMName.value = "";
    stateCopy.userDataForm.userLName.value = "";
    stateCopy.userDataForm.userEmail.value = "";
    stateCopy.userDataForm.userRole.value = [];
    stateCopy.userDataForm.userRole.value2 = [];
    stateCopy.userDataForm.userCompany.value = [];
    stateCopy.userDataForm.userCompany.value2 = [];
    stateCopy.userDataForm.userVessel.value = [];
    stateCopy.userDataForm.userVessel.value2 = [];
    stateCopy.userDataForm.userVessel.value3 = [];
    stateCopy.defComp = [];
    stateCopy.defRole = [];
    this.setState(stateCopy);
  };

  handleTextChangeDialog = (name, index) => e => {
    let stateCopy = Object.assign({}, this.state);
    if (name === "userCompany" || name === "userRole") {
      const id = [];
      const name2 = [];
      e.forEach(el => {
        id.push(el.value);
        name2.push(el.label);
      });
      stateCopy.userDataForm[name].value = name2;
      stateCopy.userDataForm[name].value2 = id;

      if (name === "userCompany") {
        let filteredArray = stateCopy.compList.filter(itm => {
          return id.indexOf(itm.value) > -1;
        });
        let vsslsId = [],
          vsslsName = [],
          enbld = [];
        filteredArray.forEach(comp => {
          comp.vessels.forEach(vssl => {
            if (vsslsId.indexOf(vssl.vessel_id) < 0) {
              vsslsId.push(vssl.vessel_id);
              vsslsName.push(vssl.vessel_name);
              const ndx = stateCopy.userDataForm.userVessel.value.indexOf(
                vssl.vessel_id
              );
              enbld.push(stateCopy.userDataForm.userVessel.value3[ndx]);
            }
          });
        });
        stateCopy.userDataForm.userVessel.value = vsslsId;
        stateCopy.userDataForm.userVessel.value2 = vsslsName;
        stateCopy.userDataForm.userVessel.value3 = enbld;
      }
      this.setState(stateCopy);
    } else if (name === "userVessel") {
      stateCopy.userDataForm.userVessel.value3[index] = e.target.checked;
      this.setState(stateCopy);
    } else {
      stateCopy.userDataForm[e.target.name].value = e.target.value;
      this.setState(stateCopy);
    }
  };

  getCompany = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/company/index";
    request(requestURL, {
      method: "GET",
      params: {
        limit: 100,
        page: 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        let comp = [];
        for (let i = 0; i < response.rows.length; i++) {
          const element = response.rows[i];
          comp.push({
            value: element.company_id,
            label: element.company_name,
            vessels: element.vessels
          });
        }
        this.setState({
          compList: comp
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getUserCompany = userid => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/company";
    request(requestURL, {
      method: "GET",
      params: {
        account_id: userid
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        let companyIds = [],
          compList = [];
        for (let i = 0; i < response.rows.length; i++) {
          const element = response.rows[i];
          companyIds.push(element.company_id);
          compList.push({
            value: element.company_id,
            label: element.company_name,
            vessels: element.vessels
          });
        }
        let stateCopy = Object.assign({}, this.state);
        let filteredArray = compList.filter(itm => {
          return companyIds.indexOf(itm.value) > -1;
        });
        let vsslsId = [],
          vsslsName = [],
          enbld = [];
        filteredArray.forEach(comp => {
          comp.vessels.forEach(vssl => {
            if (vsslsId.indexOf(vssl.vessel_id) < 0) {
              vsslsId.push(vssl.vessel_id);
              vsslsName.push(vssl.vessel_name);
              enbld.push(vssl.allow_access || false);
            }
          });
        });
        stateCopy.userDataForm.userVessel.value = vsslsId;
        stateCopy.userDataForm.userVessel.value2 = vsslsName;
        stateCopy.userDataForm.userVessel.value3 = enbld;
        // stateCopy.compList = compList;

        this.setState(stateCopy);
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getRole = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/role/index";
    request(requestURL, {
      method: "GET",
      params: {
        limit: 100,
        page: 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        let role = [];
        for (let i = 0; i < response.rows.length; i++) {
          const element = response.rows[i];
          role.push({
            value: element.role_id,
            label: element.role_name
          });
        }
        this.setState({
          roleList: role
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getUsers = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/index";
    this.toggleLoading(true);

    let filCol = [],
      filVal = [];
    if (this.state.filterEmail.trim() !== "") {
      filCol.push("email");
      filVal.push(this.state.filterEmail);
    }
    if (this.state.filterUsername.trim() !== "") {
      filCol.push("username");
      filVal.push(this.state.filterUsername);
    }
    if (this.state.filterStatus.trim() !== "") {
      filCol.push("status");
      filVal.push(this.state.filterStatus);
    }

    request(requestURL, {
      method: "GET",
      params: {
        limit: this.state.limit,
        page: parseInt(this.state.page, 10) + 1,
        filter_column: filCol,
        filter_value: filVal,
        sort_type: this.state.sortType,
        sort_column: this.state.sortVal
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);
        this.setState(
          {
            userList: response.rows,
            totalCount: response.total_rows,
            usernameList: response.username,
            emailList: response.email,
            statusList: response.status2
          },
          () => {
            if (this.state.selectedAll) {
              let oldSelected = this.state.selectedUserId;
              const selected = [];
              response.rows.forEach(n => {
                if (this.state.selectedUserId.indexOf(n.id) === -1) {
                  selected.push(n.id);
                }
              });
              this.setState({ selectedUserId: selected.concat(oldSelected) });
            }
          }
        );
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  sendInvite = () => {
    const { classes } = this.props;
    const requestURL =
      process.env.REACT_APP_API_URL + "/user/" + this.state.dialogType;
    let vssls = [];
    for (let i = 0; i < this.state.userDataForm.userVessel.value.length; i++) {
      const vsslId = this.state.userDataForm.userVessel.value[i];
      const vsslAllow = this.state.userDataForm.userVessel.value3[i];
      vssls.push({
        vessel_id: vsslId,
        allow_access: vsslAllow || false
      });
    }
    const params = {
      companies: this.state.userDataForm.userCompany.value2,
      first_name: this.state.userDataForm.userFName.value,
      last_name: this.state.userDataForm.userLName.value,
      middle_name: this.state.userDataForm.userMName.value,
      email: this.state.userDataForm.userEmail.value,
      roles: this.state.userDataForm.userRole.value2,
      url: window.location.host,
      vessels: vssls
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.account_id = this.state.selectedUserId[0];
    }
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

        // this.props.enqueueSnackbar(response.message, { variant: "success" });
        if (response.note === "This is not a Production server!") {
          if (response.password !== "") {
            const d = (
              <div key={response.password} className={classes.marginBottom}>
                Email: {this.state.userDataForm.userEmail.value} <br />
                Password: {response.password}
              </div>
            );
            this.props.openAlertDialog(
              response.message,
              d,
              () => {
                this.getUsers();
                this.handleClose();
              },
              false
            );
          }
          return;
        }
        this.handleClose();
        this.getUsers();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  disableUser = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/disable";
    const params = {
      user_ids: this.state.selectedUserId
    };
    request(requestURL, { method: "PUT", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          selectedUserId: []
        });
        this.getUsers();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  deleteUser = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/delete";
    const params = {
      user_ids: this.state.selectedUserId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          selectedUserId: []
        });
        this.getUsers();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  enableUser = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/enable";
    const params = {
      user_ids: this.state.selectedUserId
    };
    request(requestURL, { method: "PUT", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          selectedUserId: []
        });
        this.getUsers();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  reInvite = () => {
    const { classes } = this.props;
    const requestURL = process.env.REACT_APP_API_URL + "/user/reinvite";
    const params = {
      user_ids: this.state.selectedUserId
    };
    request(requestURL, { method: "POST", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        // this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.setState({
          selectedUserId: []
        });

        if (response.note === "This is not a Production server!") {
          if (response.users_password) {
            const usrpwd = response.users_password.map(d => {
              return (
                <div key={d.password} className={classes.marginBottom}>
                  Email: {d.email} <br />
                  Password: {d.password}
                </div>
              );
            });
            this.props.openAlertDialog(
              response.message,
              usrpwd,
              () => this.getUsers(),
              false
            );
          }
          return;
        }
        this.getUsers();
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedUserId;
    const checked = event.target.checked;
    if (id === "all") {
      let selected = [];
      let selectAll = false;
      if (checked) {
        selectAll = true;
        selected = this.state.userList.map(n => {
          return n.id;
        });
      }
      this.setState({ selectedUserId: selected, selectedAll: selectAll });
    } else {
      const indxSel = this.state.selectedUserId.indexOf(id);
      let selectAll = false;
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedUserId;
          oldSelected.push(id);
        }
        if (oldSelected.length === this.state.userList.length) {
          selectAll = true;
        }
      } else {
        oldSelected.splice(indxSel, 1);
        selectAll = false;
      }
      this.setState({ selectedUserId: oldSelected, selectedAll: selectAll });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray" className={classes.CardHeaderIcon}>
                <h4 className={classes.cardTitleWhite}>
                  User List
                  {!this.state.filterOpen && (
                    <i
                      onClick={() => this.toggleFilter(!this.state.filterOpen)}
                      className={[
                        "material-icons md-18 flip-icons " + classes.filterIcon
                      ]}
                    >
                      filter_list
                    </i>
                  )}
                  {this.state.filterOpen && (
                    <i
                      onClick={() => this.toggleFilter(!this.state.filterOpen)}
                      className={[
                        "material-icons md-18  " + classes.filterIcon
                      ]}
                    >
                      filter_list
                    </i>
                  )}
                </h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table>
                    <colgroup>
                      <col style={{ width: "0%" }} />
                      <col style={{ width: "17%" }} />
                      <col style={{ width: "15%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "20%" }} />
                      <col style={{ width: "17%" }} />
                      <col style={{ width: "10%" }} />
                    </colgroup>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.userList.length > 0 &&
                          this.state.selectedUserId.length ===
                            this.state.userList.length
                        }
                        selected={
                          this.state.userList.length > 0 &&
                          this.state.selectedUserId.length ===
                            this.state.userList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.userList.length > 0 &&
                              this.state.selectedAll
                            }
                          />
                        </TableCell>
                        <TableCell
                          align="left"
                          sortDirection={
                            this.state.sortVal === "username" &&
                            this.state.sortType === "asc"
                              ? true
                              : false
                          }
                        >
                          <TableSortLabel
                            active={this.state.sortVal === "username"}
                            direction={this.state.sortType}
                            onClick={() =>
                              this.handleSort("username", this.state.sortType)
                            }
                          >
                            Username
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="left">Roles</TableCell>
                        <TableCell
                          align="left"
                          sortDirection={
                            this.state.sortVal === "email" &&
                            this.state.sortType === "asc"
                              ? true
                              : false
                          }
                        >
                          <TableSortLabel
                            active={this.state.sortVal === "email"}
                            direction={this.state.sortType}
                            onClick={() =>
                              this.handleSort("email", this.state.sortType)
                            }
                          >
                            Email
                          </TableSortLabel>
                        </TableCell>
                        <TableCell align="left">Company</TableCell>
                        <TableCell
                          align="left"
                          sortDirection={
                            this.state.sortVal === "status" &&
                            this.state.sortType === "asc"
                              ? true
                              : false
                          }
                        >
                          <TableSortLabel
                            active={this.state.sortVal === "status"}
                            direction={this.state.sortType}
                            onClick={() =>
                              this.handleSort("status", this.state.sortType)
                            }
                          >
                            Status
                          </TableSortLabel>
                        </TableCell>
                        {auth.getUserInfo().superadmin && (
                          <TableCell align="left">VPNs</TableCell>
                        )}
                      </TableRow>

                      {this.state.filterOpen && (
                        <TableRow>
                          <TableCell align="left" />
                          <TableCell align="left">
                            <SelectDropdown
                              suggestions={this.state.usernameList}
                              handleChange={this.handleChangeField("username")}
                              placeholder="Filter"
                              createOptionPosition="first"
                            />
                          </TableCell>
                          <TableCell align="left" />
                          <TableCell align="left" className={classes.topAlign}>
                            <SelectDropdown
                              suggestions={this.state.emailList}
                              handleChange={this.handleChangeField("email")}
                              placeholder="Filter"
                              createOptionPosition="first"
                            />
                          </TableCell>
                          <TableCell align="left" />
                          <TableCell align="left" className={classes.topAlign}>
                            <SelectDropdown
                              suggestions={this.state.statusList}
                              handleChange={this.handleChangeField("status")}
                              placeholder="Filter"
                              createOptionPosition="first"
                            />
                          </TableCell>
                          {auth.getUserInfo().superadmin && (
                            <TableCell align="left" />
                          )}
                        </TableRow>
                      )}
                    </TableHead>
                    <TableBody>
                      {this.state.loading && (
                        <TableRow>
                          <TableCell colSpan="5" align="center">
                            <div className={classes.centerAlign}>
                              <CircularProgress className={classes.progress} />
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                      {!this.state.loading &&
                        this.state.userList.map(row => (
                          <TableRow
                            hover
                            role="checkbox"
                            key={row.id}
                            aria-checked={
                              this.state.selectedUserId.indexOf(row.id) > -1
                            }
                            selected={
                              this.state.selectedUserId.indexOf(row.id) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.id)}
                                value={row.id}
                                checked={
                                  this.state.selectedUserId.indexOf(row.id) > -1
                                }
                              />
                            </TableCell>
                            <TableCell align="left">{row.username}</TableCell>
                            {row.roles && (
                              <TableCell align="left">
                                {row.roles
                                  .map(a => {
                                    return a.role_name;
                                  })
                                  .join(", ")}
                              </TableCell>
                            )}
                            {row.roles === null && (
                              <TableCell align="left">None</TableCell>
                            )}
                            <TableCell align="left">{row.email}</TableCell>
                            {row.companies && (
                              <TableCell align="left">
                                {row.companies
                                  .map(a => {
                                    return a.company_name;
                                  })
                                  .join(", ")}
                              </TableCell>
                            )}
                            {row.companies === null && (
                              <TableCell align="left">None</TableCell>
                            )}

                            {row.status && (
                              <TableCell align="left">Enabled</TableCell>
                            )}
                            {row.status === false && (
                              <TableCell align="left">Disabled</TableCell>
                            )}
                            {auth.getUserInfo().superadmin && (
                              <TableCell>
                                <Tooltip title="Download Vessel VPN">
                                  <IconButton
                                    onClick={() =>
                                      window.open(
                                        process.env.REACT_APP_API_URL +
                                          "/" +
                                          row.vessel_vpn
                                      )
                                    }
                                    aria-label="Vessel VPN"
                                    className={classes.margin}
                                    size="small"
                                    disabled={
                                      row.vessel_vpn === undefined ||
                                      row.vessel_vpn === ""
                                    }
                                  >
                                    <DirectionsBoat fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Download Web VPN">
                                  <IconButton
                                    onClick={() =>
                                      window.open(
                                        process.env.REACT_APP_API_URL +
                                          "/" +
                                          row.web_vpn
                                      )
                                    }
                                    aria-label="Web VPN"
                                    className={classes.margin}
                                    size="small"
                                    disabled={
                                      row.web_vpn === undefined ||
                                      row.web_vpn === ""
                                    }
                                  >
                                    <AccountCircle fontSize="inherit" />
                                  </IconButton>
                                </Tooltip>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.roleList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="6" align="justify">
                              No available data
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </Paper>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 50, 100]}
                  component="div"
                  count={this.state.totalCount}
                  rowsPerPage={this.state.limit}
                  page={this.state.page}
                  backIconButtonProps={{
                    "aria-label": "Previous Page"
                  }}
                  nextIconButtonProps={{
                    "aria-label": "Next Page"
                  }}
                  labelDisplayedRows={this.displayedRows}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />

                <Button
                  disabled={this.state.selectedUserId.length === 0}
                  onClick={() => {
                    this.props.openAlertDialog(
                      "Attention!",
                      `You are about to DELETE a user, are you sure about that?`,
                      () => this.deleteUser(),
                      this.state.alertDialog.withCancelBtn
                    );
                  }}
                  color="info"
                >
                  Delete
                </Button>

                <Button
                  disabled={this.state.selectedUserId.length === 0}
                  onClick={() => {
                    this.props.openAlertDialog(
                      "Attention!",
                      `You are about to disable a user, are you sure about that?`,
                      () => this.disableUser(),
                      this.state.alertDialog.withCancelBtn
                    );
                  }}
                  color="info"
                >
                  Disable
                </Button>
                <Button
                  disabled={this.state.selectedUserId.length === 0}
                  onClick={() => {
                    this.props.openAlertDialog(
                      "Attention!",
                      `You are about to enable a user, are you sure about that?`,
                      () => this.enableUser(),
                      this.state.alertDialog.withCancelBtn
                    );
                  }}
                  color="info"
                >
                  Enable
                </Button>
                <Button
                  onClick={() => this.handleClickOpen("invite")}
                  color="info"
                >
                  Invite
                </Button>
                <Button
                  disabled={
                    this.state.selectedUserId.length === 0 ||
                    this.state.selectedUserId.length > 1
                  }
                  onClick={() => this.handleClickOpen("update")}
                  color="info"
                >
                  Edit
                </Button>
                <Button
                  disabled={this.state.selectedUserId.length === 0}
                  onClick={() => {
                    this.props.openAlertDialog(
                      "Attention!",
                      `You are about to resend an invite to a user, are you sure about that?`,
                      () => this.reInvite(),
                      this.state.alertDialog.withCancelBtn
                    );
                  }}
                  color="info"
                >
                  Resend Invite
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
        <Dialog
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {this.state.dialogType.charAt(0).toUpperCase() +
              this.state.dialogType.slice(1)}{" "}
            User
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              To add a user to the platform, please fill out this form. We will
              send the link and instruction to the email provided.
            </DialogContentText>
            <form className={classes.form} onSubmit={this.sendInvite}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  type="text"
                  required={true}
                  label="First Name"
                  id="userFName"
                  name="userFName"
                  value={this.state.userDataForm.userFName.value}
                  onChange={this.handleTextChangeDialog("userMName")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  type="text"
                  label="Middle Name"
                  id="userMName"
                  name="userMName"
                  value={this.state.userDataForm.userMName.value}
                  onChange={this.handleTextChangeDialog("userMName")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  type="text"
                  required={true}
                  label="Last Name"
                  id="userLName"
                  name="userLName"
                  value={this.state.userDataForm.userLName.value}
                  onChange={this.handleTextChangeDialog("userLName")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  type="email"
                  required={true}
                  label="Email address"
                  id="userEmail"
                  name="userEmail"
                  value={this.state.userDataForm.userEmail.value}
                  onChange={this.handleTextChangeDialog("userEmail")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <ReactSelect
                  isMulti
                  inputId="userCompany"
                  menuPosition="fixed"
                  defaultValue={this.state.defComp}
                  options={this.state.compList}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Company"
                  onChange={this.handleTextChangeDialog("userCompany")}
                />
              </FormControl>
              {this.state.userDataForm.userVessel.value2.length > 0 && (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Vessel Name</TableCell>
                      <TableCell>Allow VPN Access</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.userDataForm.userVessel.value2.map(
                      (vsslNme, indx) => (
                        <TableRow key={"row" + vsslNme + indx}>
                          <TableCell>{vsslNme}</TableCell>
                          <TableCell>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={
                                    this.state.userDataForm.userVessel.value3[
                                      indx
                                    ]
                                  }
                                  onChange={this.handleTextChangeDialog(
                                    "userVessel",
                                    indx
                                  )}
                                  value="false"
                                  color="primary"
                                />
                              }
                            />
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              )}

              <FormControl margin="normal" required fullWidth>
                <ReactSelect
                  isMulti
                  inputId="userRole"
                  menuPosition="fixed"
                  defaultValue={this.state.defRole}
                  options={this.state.roleList}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Role"
                  onChange={this.handleTextChangeDialog("userRole")}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.sendInvite} color="info">
              {this.state.dialogType === "invite" && "Send Invite"}
              {this.state.dialogType === "update" && "Update User"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

RBACUsers.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  openAlertDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(RBACUsers));
