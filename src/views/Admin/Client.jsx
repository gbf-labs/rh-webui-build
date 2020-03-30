import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

// @material-ui
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import CircularProgress from "@material-ui/core/CircularProgress";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

// helpers
import request from "utils/request";

const styles = () => ({
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

let clientInterval = null;
class Client extends React.Component {
  state = {
    loading: false,
    clientList: [],
    selectedClientId: [],
    limit: 10,
    page: 0,
    totalCount: 0
  };

  componentDidMount() {
    this.getClient();
    clientInterval = setInterval(
      () => this.getClient(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(clientInterval);
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
        this.getClient();
      }
    );
  };

  handleChangeRowsPerPage = event => {
    this.setState(
      {
        limit: event.target.value
      },
      () => {
        this.getClient();
      }
    );
  };

  displayedRows = ({ from, to, count }) => {
    return `${from}-${to} of ${count}`;
  };

  getClient = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/user/clients";
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

        this.setState({
          clientList: response.rows,
          totalCount: response.total_rows
        });
      })
      .catch(() => {
        this.toggleLoading(false);
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
                <h4 className={classes.cardTitleWhite}>Client List</h4>
              </CardHeader>
              <CardBody className={classes.centerText}>
                <div>
                  <Table className={classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">Username</TableCell>
                        <TableCell align="left">Roles</TableCell>
                        <TableCell align="left">Email</TableCell>
                        <TableCell align="left">Company</TableCell>
                        <TableCell align="left">Status</TableCell>
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
                        this.state.clientList.map(row => (
                          <TableRow key={row.company_id}>
                            <TableCell align="left">{row.username}</TableCell>
                            {row.roles && (
                              <TableCell align="left">
                                {row.roles.map(a => a.role_name)}
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
                          </TableRow>
                        ))}
                      {!this.state.loading &&
                        this.state.clientList.length === 0 && (
                          <TableRow>
                            <TableCell colSpan="5" align="justify">
                              No available data
                            </TableCell>
                          </TableRow>
                        )}
                    </TableBody>
                  </Table>
                </div>
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
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Client.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired
};

export default withStyles(styles)(withSnackbar(Client));
