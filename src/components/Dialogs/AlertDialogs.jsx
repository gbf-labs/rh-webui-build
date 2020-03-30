import React from "react";
import PropTypes from "prop-types";

import Button from "components/CustomButtons/Button.jsx";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class AlertDialogs extends React.Component {
  render() {
    return (
      <Dialog
        open={this.props.alertDialog.openDialog}
        // onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {this.props.alertDialog.dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {this.props.alertDialog.dialogBody}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.props.closeDialog("ok")} color="info">
            Ok
          </Button>
          {this.props.alertDialog.withCancelBtn && (
            <Button
              onClick={() => this.props.closeDialog("cancel")}
              color="info"
            >
              Cancel
            </Button>
          )}
        </DialogActions>
      </Dialog>
    );
  }
}

AlertDialogs.propTypes = {
  alertDialog: PropTypes.object.isRequired,
  closeDialog: PropTypes.func.isRequired
};

export default AlertDialogs;
