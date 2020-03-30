import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "variables/colors";

const styles = () => ({
  mainBox: {
    "max-width": "600px",
    width: "100%",
    height: "100%",
    "max-height": "156px",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  }
});

class IOPOpenPort extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60
  };

  createIOP = device => {
    const info = device.info ? device.info : {};
    const status = device.status;
    const img = require("assets/img/devices/IOP_BDU_600px.png");
    const colorChecker = clr => {
      let color = colors.OFF;
      if (clr === "green") {
        color = colors.GREEN;
      } else if (clr === "amber") {
        color = colors.ORANGE;
      }
      return color;
    };
    const ledBlnk = ""; //'device-status';

    return (
      <g key="main">
        <rect
          x="212"
          y="15"
          width="10"
          height="10"
          style={{ fill: colorChecker(status) }}
          className={ledBlnk}
        />
        <rect
          x="212"
          y="28"
          width="10"
          height="10"
          style={{ fill: colorChecker(info.status) }}
          className={ledBlnk}
        />
        <rect
          x="212"
          y="41"
          width="10"
          height="10"
          style={{ fill: colorChecker(info.signal) }}
          className={ledBlnk}
        />
        <rect
          x="212"
          y="55"
          width="10"
          height="10"
          style={{ fill: colorChecker(info.gps) }}
          className={ledBlnk}
        />
        <rect
          x="355"
          y="89"
          width="14"
          height="14"
          style={{ fill: colorChecker(info.data) }}
          className={ledBlnk}
        />
        <rect
          x="400"
          y="89"
          width="14"
          height="14"
          style={{ fill: colorChecker(info.handset1) }}
          className={ledBlnk}
        />
        <rect
          x="446"
          y="89"
          width="14"
          height="14"
          style={{ fill: colorChecker(info.handset2) }}
          className={ledBlnk}
        />
        <rect
          x="492"
          y="89"
          width="14"
          height="14"
          style={{ fill: colorChecker(info.handset3) }}
          className={ledBlnk}
        />
        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="IOP" />
        </foreignObject>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 156">
        {this.createIOP(this.props.device)}
      </svg>
    );
  }
}

IOPOpenPort.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(IOPOpenPort);
