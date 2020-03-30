import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "../../variables/colors";

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

class Modem extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60
  };

  createModem = device => {
    let img = require("assets/img/devices/MODEM_X5_600px.png");
    const checkPowerLed = pwrLed => {
      let clr = "";
      switch (pwrLed) {
        case "green":
          clr = colors.GREEN;
          break;
        case "orange":
          clr = colors.ORANGE;
          break;
        case "red":
          clr = colors.RED;
          break;
        default:
          clr = colors.OFF;
          break;
      }
      return clr;
    };
    if (device.device_type === "Evolution_X5") {
      return (
        <g key="main">
          <rect
            x="235"
            y="58"
            width="20"
            height="7"
            style={{
              fill:
                device.general.Rx_Lock === "LOCKED" ? colors.GREEN : colors.NONE
            }}
          />
          <rect
            x="262"
            y="58"
            width="20"
            height="7"
            style={{
              fill:
                device.general.Tx_State === "ON" ? colors.GREEN : colors.NONE
            }}
          />
          <rect
            x="289"
            y="58"
            width="20"
            height="7"
            style={{
              fill:
                device.general.Modem_State === "In Network"
                  ? colors.GREEN
                  : colors.NONE
            }}
          />
          <rect
            x="316"
            y="58"
            width="20"
            height="7"
            style={{
              fill:
                device.general.Link_State === "Established"
                  ? colors.GREEN
                  : colors.NONE
            }}
          />
          <rect
            x="343"
            y="58"
            width="20"
            height="7"
            style={{ fill: checkPowerLed(device.status) }}
          />

          <foreignObject width="100%" height="100%">
            <img width="100%" src={img} alt="Modem" />
          </foreignObject>
        </g>
      );
    } else if (device.device_type === "Evolution_X7") {
      img = require("assets/img/devices/MODEM_X7_600px.png");
      return (
        <g key="main">
          <rect
            x="215"
            y="15"
            width="18"
            height="5"
            style={{ fill: checkPowerLed(device.status) }}
          />
          <rect
            x="221"
            y="23"
            width="18"
            height="5"
            style={{
              fill:
                device.general.Link_State === "Established"
                  ? colors.GREEN
                  : colors.NONE
            }}
          />
          <rect
            x="227"
            y="31"
            width="18"
            height="5"
            style={{ fill: colors.OFF }}
          />
          <rect
            x="233"
            y="39"
            width="18"
            height="5"
            style={{ fill: colors.OFF }}
          />
          <rect
            x="372"
            y="15"
            width="18"
            height="5"
            style={{
              fill:
                device.general.Rx_Lock === "LOCKED" ? colors.GREEN : colors.NONE
            }}
          />
          <rect
            x="366"
            y="23"
            width="18"
            height="5"
            style={{ fill: colors.OFF }}
          />
          <rect
            x="360"
            y="31"
            width="18"
            height="5"
            style={{
              fill:
                device.general.Tx_State === "ON" ? colors.GREEN : colors.NONE
            }}
          />
          <rect
            x="354"
            y="39"
            width="18"
            height="5"
            style={{
              fill:
                device.general.Modem_State === "In Network"
                  ? colors.GREEN
                  : colors.NONE
            }}
          />

          <foreignObject width="100%" height="100%">
            <img width="100%" src={img} alt="Modem" />
          </foreignObject>
        </g>
      );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 156">
        {this.createModem(this.props.device)}
      </svg>
    );
  }
}

Modem.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Modem);
