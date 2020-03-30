import React from "react";
import PropTypes from "prop-types";

import withStyles from "@material-ui/core/styles/withStyles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Button2 from "components/CustomButtons/Button.jsx";

const styles = () => ({
  root: {
    flexGrow: 1
  },
  button: {
    margin: "10px 0"
  },
  button2: {
    margin: "10px"
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
  }
});

class RemoteConsoleDialog extends React.Component {
  render() {
    const { classes } = this.props;
    const createMenu = valArr => {
      let menuArr = [];

      valArr.forEach(optn => {
        menuArr.push(
          <MenuItem disabled className={classes.group}>
            {Object.keys(optn)[0]}
          </MenuItem>
        );
        optn[Object.keys(optn)[0]] &&
          optn[Object.keys(optn)[0]].length > 0 &&
          optn[Object.keys(optn)[0]].forEach(optn2 => {
            menuArr.push(
              <MenuItem value={optn2[Object.keys(optn2)[1]]}>
                {optn2[Object.keys(optn2)[0]]}
              </MenuItem>
            );
          });
      });
      return menuArr;
    };

    return (
      <Dialog
        open={this.props.remoteDialog.openDialog}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {this.props.remoteDialog.title.toUpperCase()}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this.props.remoteDialog.description}
          </DialogContentText>
          {this.props.remoteDialog.others.map((elm, indx) => {
            return (
              <div key={"others" + elm.name + indx}>
                {elm.type === "dropdown" && (
                  <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor={`other-${indx}`}>
                      {elm.name}
                    </InputLabel>
                    <Select
                      onChange={this.props.handleChangeValue(elm.name)}
                      value={elm.selected}
                      inputProps={{
                        name: `others-${elm.name}`,
                        id: `other-${indx}`
                      }}
                    >
                      {elm.values.map((optn, indx2) => {
                        return (
                          <MenuItem
                            key={"item" + indx + indx2}
                            value={optn[Object.keys(optn)[0]]}
                          >
                            {Object.keys(optn)[0]}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}

                {elm.type === "input" && (
                  <FormControl margin="normal" fullWidth>
                    <TextField
                      id={`other-${indx}`}
                      label={elm.name}
                      className={classes.textField}
                      value={elm.selected}
                      onChange={this.props.handleChangeValue(elm.name)}
                      margin="normal"
                    />
                  </FormControl>
                )}

                {elm.type === "groupdropdown" && (
                  <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor={`other-${indx}`}>
                      {elm.name}
                    </InputLabel>
                    <Select
                      onChange={this.props.handleChangeValue(elm.name)}
                      value={elm.selected}
                      inputProps={{
                        name: `others-${elm.name}`,
                        id: `other-${indx}`
                      }}
                    >
                      {createMenu(elm.values)}
                    </Select>
                  </FormControl>
                )}
              </div>
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button2
            onClick={this.props.handleClose}
            color="info"
            className={classes.button2}
          >
            Cancel
          </Button2>
          <Button2
            color="info"
            onClick={this.props.createOthersData}
            className={classes.button2}
          >
            {this.props.remoteDialog.title}
          </Button2>
        </DialogActions>
      </Dialog>
    );
  }
}

RemoteConsoleDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  remoteDialog: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleChangeValue: PropTypes.func.isRequired,
  createOthersData: PropTypes.func.isRequired
};

export default withStyles(styles)(RemoteConsoleDialog);
