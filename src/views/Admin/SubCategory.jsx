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
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

// helpers
import request from "utils/request";
import general from "../../variables/general";

const styles = theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto"
  },
  table: {
    minWidth: 700
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
  }
});

let subCatInterval = null;
class SubCategory extends React.Component {
  state = {
    openDialog: false,
    loading: false,
    defOptions: [],
    subCategoryList: [],
    selectedSubId: [],
    dialogType: "create",
    subCategoryDataForm: {
      subCategoryName: {
        required: true,
        value: "",
        name: "Sub Category Name"
      },
      subCategoryOptions: {
        required: true,
        value: [],
        name: "Sub Category Options"
      }
    },
    subCategoryOptions: [],
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getSubCategory();
    subCatInterval = setInterval(
      () => this.getSubCategory(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(subCatInterval);
  }

  toggleLoading = isLoading => {
    this.setState({
      loading: isLoading
    });
  };

  handleChangePage = (event, newPage) => {
    this.setState(
      {
        page: newPage
      },
      () => {
        this.getSubCategory();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getSubCategory();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  handleClickOpen = type => () => {
    this.setState(
      {
        dialogType: type,
        openDialog: true
      },
      () => {
        if (type === "update") {
          let obj = this.state.subCategoryList.find(
            o => o.subcategory_id === this.state.selectedSubId[0]
          );

          let stateCopy = Object.assign({}, this.state);
          stateCopy.subCategoryDataForm.subCategoryName.value =
            obj.subcategory_name;

          let optns = [];
          if (obj.options) {
            for (let i = 0; i < obj.options.length; i++) {
              const element = obj.options[i];
              optns.push({
                value: element,
                label: element
              });
            }
          }
          stateCopy.defOptions = optns;

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
        this.getSubCategory();
      }
    );
  };

  resetForm = () => {
    let stateCopy = Object.assign({}, this.state);
    stateCopy.subCategoryDataForm.subCategoryName.value = "";
    stateCopy.selectedSubId = [];
    stateCopy.defOptions = [];
    this.setState(stateCopy);
  };

  getSubCategory = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/subcategory";
    this.toggleLoading(true);
    request(requestURL, {
      method: "GET",
      params: {
        limit: this.state.limit,
        page: parseInt(this.state.page, 10) + 1
      }
    })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.toggleLoading(false);

        let optns = [];
        for (let i = 0; i < response.options.length; i++) {
          const element = response.options[i];
          optns.push({
            value: element,
            label: element
          });
        }

        this.setState({
          subCategoryList: response.rows,
          subCategoryOptions: optns,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
        this.props.handleRequest(false);
      });
  };

  deleteSubCategory = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/subcategory/delete";
    const params = {
      subcategory_ids: this.state.selectedSubId
    };
    request(requestURL, { method: "DELETE", body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.props.enqueueSnackbar(response.message, { variant: "success" });

        this.setState({
          selectedSubId: []
        });
        this.getSubCategory();
      })
      .catch(() => {
        this.handleClose();
        this.props.handleRequest(false);
      });
  };

  handleCheck = id => event => {
    let oldSelected = this.state.selectedSubId;
    const checked = event.target.checked;
    if (id === "all") {
      if (checked) {
        this.setState({
          selectedSubId: this.state.subCategoryList.map(n => n.subcategory_id)
        });
      } else {
        this.setState({ selectedSubId: [] });
      }
    } else {
      const indxSel = this.state.selectedSubId.indexOf(id);
      if (checked) {
        if (indxSel === -1) {
          let oldSelected = this.state.selectedSubId;
          oldSelected.push(id);
          this.setState({ selectedSubId: oldSelected });
        }
      } else {
        oldSelected.splice(indxSel, 1);
        this.setState({ selectedSubId: oldSelected });
      }
    }
  };

  handleTextChangeDialog = name => e => {
    let stateCopy = Object.assign({}, this.state);
    if (name === "subCategoryOptions") {
      const name2 = [];
      e.forEach(el => {
        name2.push(el.label);
      });
      console.log();
      stateCopy.subCategoryDataForm[name].value = name2;

      this.setState(stateCopy);
    } else {
      stateCopy.subCategoryDataForm[e.target.name].value = e.target.value;
      this.setState(stateCopy);
    }
  };

  createSubCategory = () => {
    const requestURL =
      process.env.REACT_APP_API_URL + "/subcategory/" + this.state.dialogType;
    const params = {
      subcategory_name: this.state.subCategoryDataForm.subCategoryName.value,
      options: this.state.subCategoryDataForm.subCategoryOptions.value
    };
    let reqType = "POST";
    if (this.state.dialogType === "update") {
      reqType = "PUT";
      params.subcategory_id = this.state.selectedSubId[0];
    }
    console.log(
      "this.state.subCategoryDataForm = ",
      this.state.subCategoryDataForm
    );
    const errors = general.validateForm(this.state.subCategoryDataForm);
    console.log("errors = ", errors);
    console.log("params = ", params);

    if (errors.length > 0) {
      errors.forEach(err => {
        this.props.enqueueSnackbar(err, { variant: "error" });
      });
      return;
    }
    request(requestURL, { method: reqType, body: params }, true)
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        this.handleClose();
        this.props.enqueueSnackbar(response.message, { variant: "success" });
        this.getSubCategory();
      })
      .catch(() => {
        this.handleClose();
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
              <CardHeader color="gray" className={classes.CardHeaderIcon}>
                <h4 className={classes.cardTitleWhite}>SubCategory List</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <Paper className={classes.root}>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={
                          this.state.subCategoryList.length > 0 &&
                          this.state.selectedSubId.length ===
                            this.state.subCategoryList.length
                        }
                        selected={
                          this.state.subCategoryList.length > 0 &&
                          this.state.selectedSubId.length ===
                            this.state.subCategoryList.length
                        }
                      >
                        <TableCell align="left" padding="checkbox">
                          <Checkbox
                            onChange={this.handleCheck("all")}
                            value={"all"}
                            checked={
                              this.state.subCategoryList.length > 0 &&
                              this.state.selectedSubId.length ===
                                this.state.subCategoryList.length
                            }
                          />
                        </TableCell>
                        <TableCell align="left">Name</TableCell>
                        <TableCell align="left">Options</TableCell>
                      </TableRow>
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
                        this.state.subCategoryList.map(row => (
                          <TableRow
                            key={row.subcategory_id}
                            hover
                            role="checkbox"
                            aria-checked={
                              this.state.selectedSubId.indexOf(
                                row.subcategory_id
                              ) > -1
                            }
                            selected={
                              this.state.selectedSubId.indexOf(
                                row.subcategory_id
                              ) > -1
                            }
                          >
                            <TableCell align="left" padding="checkbox">
                              <Checkbox
                                onChange={this.handleCheck(row.subcategory_id)}
                                value={row.id}
                                checked={
                                  this.state.selectedSubId.indexOf(
                                    row.subcategory_id
                                  ) > -1
                                }
                              />
                            </TableCell>
                            {/* <TableCell align="left">{row.subcategory_id}</TableCell> */}
                            <TableCell align="left">
                              {row.subcategory_name}
                            </TableCell>
                            {row.options && (
                              <TableCell align="left">
                                {row.options.join(", ")}
                              </TableCell>
                            )}
                            {row.options === null && (
                              <TableCell align="left">None</TableCell>
                            )}
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.subCategoryList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="3" align="justify">
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
                  disabled={this.state.selectedSubId.length === 0}
                  onClick={this.deleteSubCategory}
                  color="info"
                >
                  Delete SubCategory
                </Button>
                <Button onClick={this.handleClickOpen("create")} color="info">
                  Create SubCategory
                </Button>
                <Button
                  disabled={
                    this.state.selectedSubId.length === 0 ||
                    this.state.selectedSubId.length > 1
                  }
                  onClick={this.handleClickOpen("update")}
                  color="info"
                >
                  Edit SubCategory
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
            {this.state.dialogType === "create" && "Create "}
            {this.state.dialogType === "update" && "Update "}
            Sub Category
          </DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={this.createCompany}>
              <FormControl margin="normal" required fullWidth>
                <TextField
                  required={true}
                  value={this.state.subCategoryDataForm.subCategoryName.value}
                  label="Name"
                  id="subCategoryName"
                  name="subCategoryName"
                  onChange={this.handleTextChangeDialog("subCategoryName")}
                  className={classNames(classes.margin, classes.textField)}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <ReactSelect
                  isMulti
                  inputId="subCategoryOptions"
                  defaultValue={this.state.defOptions}
                  options={this.state.subCategoryOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Options"
                  menuPosition="fixed"
                  onChange={this.handleTextChangeDialog("subCategoryOptions")}
                />
              </FormControl>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="info">
              Cancel
            </Button>
            <Button type="submit" onClick={this.createSubCategory} color="info">
              {this.state.dialogType === "create" && "Create"}
              {this.state.dialogType === "update" && "Update"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

SubCategory.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  requestTimeoutChckr: PropTypes.func.isRequired,
  timeOutCtr: PropTypes.number.isRequired
};

export default withStyles(styles)(withSnackbar(SubCategory));
