import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";

const styles = {
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
  }
};

function TableList(props) {
  const { classes } = props;
  return (
    <GridContainer>
      <GridItem xs={12} sm={12} md={12}>
        <Card>
          <CardHeader color="primary" className={classes.CardHeaderIcon}>
            <i class="material-icons">assignment</i>
          </CardHeader>
          <CardBody>
            <Table
              tableHeaderColor="primary"
              tableHead={["Vessel Imo", "Vessel Name", "Vessel Shipowner", "Vessel Client", "Vessel Po", "Vessel Monthlypay", "Actions"]}
              tableData={[
                // ["9793234", "Anderida", "PCCW", "Radio Holland - NL", "", "Pay on monthly basis", ""],
                // ["9420837", "Donaugracht", "Spliethoff", "Radio Holland - NL", "", "Pay on monthly basis", ""],
                // ["9224764", "FSO Africa", "FSO Owner", "Radio Holland - BE", "", "Not Paying", ""],
                // ["9224752", "FSO Asia", "Jackupbarge.com", "Radio Holland - BE", "", "Not Paying", ""],
                // ["8771071", "JB 117", "OOS Owner", "Radio Holland - NL", "", "Pay on monthly basis", ""],
                // ["9650963", "OOS Gretha", "OOS Owner", "Radio Holland - BE", "", "Not Paying", ""],
                // ["8769781", "OOS Prometheus", "OOS Owner", "Radio Holland - BE", "", "Not Paying", ""]
              ]}
            />
          </CardBody>
        </Card>
      </GridItem>
    </GridContainer>
  );
}

export default withStyles(styles)(TableList);
