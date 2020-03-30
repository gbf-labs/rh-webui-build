import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";

// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";

// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

// helpers
import request from "utils/request";

class Dashboard extends React.Component {
  state = {
    value: 0,
    announcement: [],
    companies: [],
    shipowners: [],
    vessels: [],
    totalCompany: 0,
    totalVessel: 0
  };
  componentDidMount() {
    // this.getAnnouncement();
    this.getStats();
    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getAnnouncement = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/announcement";

    request(requestURL, { method: "GET" })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        const ann = [];
        for (let i = 0; i < response.rows.length; i++) {
          const announcement = [];
          const row = response.rows[i];
          announcement.push(row.time);
          announcement.push(row.subject);
          ann.push(announcement);
        }
        this.setState({ announcement: ann });
      })
      .catch(() => {
        this.props.handleRequest(false);
        this.setState({ announcement: [] });
      });
  };

  getStats = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/dashboard";
    request(requestURL, { method: "GET" })
      .then(response => {
        if (!this.props.handleRequest(response)) return;
        this.setState({
          companies: response.companies,
          totalCompany: response.total_companies,
          totalVessel: response.total_vessels
        });
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  returnTopCompany = () => {
    let companies = "";
    if (this.state.companies) {
      for (let i = 0; i < this.state.companies.length; i++) {
        const company = this.state.companies[i];
        companies +=
          company.company_name + " - (" + company.vessels + " vessels) <br/>";
      }
    }
    return companies;
  };

  returnTopClient = () => {
    let clients = "";
    if (this.state.clients && this.state.clients.top_client) {
      for (let i = 0; i < this.state.clients.top_client.length; i++) {
        const client = this.state.clients.top_client[i];
        clients += client.client_name + " (" + client.count + ") <br/>";
      }
    }
    return clients;
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={8} md={6}>
            <Card>
              <CardHeader stats icon>
                <CardIcon color="warning">
                  <Icon>directions_boat</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Vessels</p>
                <h3 className={classes.cardTitle}>
                  {this.state.vessels && this.state.totalVessel}
                </h3>
              </CardHeader>
              <CardFooter stats>
                {/* {this.state.vessels && 
                  <div className={classes.stats}>
                    {this.state.vessels.paying} are paying a monthly fee <br/>
                    {this.state.vessels.demo} are in demo-period <br/>
                    {this.state.vessels.not_pay} should not pay <br/>
                    {this.state.vessels.labo} are installed in the labo <br/>
                    {this.state.vessels.be_installed} are not installed yet <br/>
                  </div>
                } */}
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={8} md={6}>
            <Card>
              <CardHeader stats icon>
                <CardIcon color="success">
                  <Icon>vpn_key</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Company</p>
                <h3 className={classes.cardTitle}>
                  {this.state.companies && this.state.totalCompany}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div
                  className={classes.stats}
                  dangerouslySetInnerHTML={{ __html: this.returnTopCompany() }}
                />
              </CardFooter>
            </Card>
          </GridItem>
          {/* <GridItem xs={12} sm={8} md={4}>
            <Card>
              <CardHeader stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Clients</p>
                <h3 className={classes.cardTitle}>
                  {this.state.clients && this.state.clients.count}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div
                  className={classes.stats}
                  dangerouslySetInnerHTML={{ __html: this.returnTopClient() }}
                />
              </CardFooter>
            </Card>
          </GridItem> */}
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="gray">
                <h4 className={classes.cardTitleWhite}>Announcements</h4>
                <p className={classes.cardCategoryWhite}>
                  RH Box announcements
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHead={["Date", "Subject"]}
                  tableData={this.state.announcement}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(withSnackbar(Dashboard));
