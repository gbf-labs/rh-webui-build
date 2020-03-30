import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "variables/colors";

const styles = () => ({
  mainBox: {
    "max-width": "600px",
    width: "100%",
    height: "100%",
    "max-height": "61px",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  }
});

class PowerSwitch extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60
  };

  ledBlnkChecker = (status, clr) => {
    if (clr === "black") {
      // return status === '1' ? 'device-status-black': '';
      return "";
    } else {
      // return status === '1' ? 'device-status': '';
      return "";
    }
  };

  createPowerSwitch = (device, classes) => {
    let img = require("assets/img/devices/POWERSWITCH_Raritan_PX2-2190R_600px.png");
    const outlet = device.outlet_status;
    if (device.device_type === "Raritan_PX2") {
      img = require("assets/img/devices/POWERSWITCH_Raritan_PX2-2190R_600px.png");
      const txtChckr = value => {
        if (value == null) {
          return "0 . 0";
        } else {
          const val = value.toString().split("");
          return val.join(" ");
        }
      };
      return (
        <g key="main">
          <rect
            x="25"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[0].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[0].value, "black")}
          />
          <rect
            x="73"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[1].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[1].value, "black")}
          />
          <rect
            x="122"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[2].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[2].value, "black")}
          />
          <rect
            x="170"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[3].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[3].value, "black")}
          />
          <rect
            x="220"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[4].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[4].value, "black")}
          />
          <rect
            x="265"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[5].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[5].value, "black")}
          />
          <rect
            x="315"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[6].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[6].value, "black")}
          />
          <rect
            x="362"
            y="6"
            width="10"
            height="10"
            style={{
              fill: outlet[7].value === "1" ? colors.RED : colors.BLACK
            }}
            className={this.ledBlnkChecker(outlet[7].value, "black")}
          />
          <rect
            x="515"
            y="6"
            width="8"
            height="50"
            style={{ fill: colors.BLACK }}
          />
          <rect
            x="515"
            y="8"
            width="8"
            height="8"
            style={{ fill: colors.RED }}
          />
          <rect
            x="523"
            y="6"
            width="50"
            height="48"
            style={{ fill: colors.RARITAN_7SEGDISP_BG }}
          />
          <foreignObject width="100%" height="100%">
            <img width="100%" src={img} alt="Powerswitch" />
          </foreignObject>
          <svg className={classes.mainBox} viewBox="0 0 600 61">
            <text
              x="525"
              y="26"
              fontSize="16"
              fontFamily="DSEG7Classic-BoldItalicExpanded"
              fontWeight="400"
              style={{ fill: colors.RARITAN_7SEGDISP_SEGOFF }}
            >
              8 8 8
            </text>
            <text
              x="525"
              y="26"
              fontSize="16"
              fontFamily="DSEG7Classic-BoldItalicExpanded"
              fontWeight="400"
              style={{ fill: colors.RARITAN_7SEGDISP_SEGON }}
            >
              {txtChckr(device.pdu_inlet_current)}
            </text>
            <text
              x="525"
              y="48"
              fontSize="16"
              fontFamily="DSEG7Classic-BoldItalicExpanded"
              fontWeight="400"
              style={{ fill: colors.RARITAN_7SEGDISP_SEGOFF }}
            >
              8 8
            </text>
            <text
              x="525"
              y="48"
              fontSize="16"
              fontFamily="DSEG7Classic-BoldItalicExpanded"
              fontWeight="400"
              style={{ fill: colors.RARITAN_7SEGDISP_SEGON }}
            >
              L 1
            </text>
          </svg>
        </g>
      );
    } else if (device.device_type === "Sentry3") {
      img = require("assets/img/devices/POWERSWITCH_Sentry_CW8HEA211.png");
      return (
        <g key="main">
          <rect
            x="83"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[0].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[0].value)}
          />
          <rect
            x="120"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[1].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[1].value)}
          />
          <rect
            x="164"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[2].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[2].value)}
          />
          <rect
            x="204"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[3].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[3].value)}
          />
          <rect
            x="245"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[4].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[4].value)}
          />
          <rect
            x="287"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[5].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[5].value)}
          />
          <rect
            x="329"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[6].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[6].value)}
          />
          <rect
            x="371"
            y="49"
            width="7"
            height="7"
            style={{
              fill: outlet[7].value === "1" ? colors.GREEN : colors.OFF
            }}
            className={this.ledBlnkChecker(outlet[7].value)}
          />
          <foreignObject width="100%" height="100%">
            <img width="100%" src={img} alt="Powerswitch" />
          </foreignObject>
          <svg className={classes.mainBox} viewBox="0 0 600 61">
            <text
              x="441"
              y="25"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="400"
              style={{ fill: colors.GREEN }}
            >
              {device.infeed_load_value}
            </text>
            <text
              x="441"
              y="40"
              fontSize="9"
              fontFamily="sans-serif"
              fontWeight="400"
              style={{ fill: colors.GREEN }}
            >
              {device.infeed_power}
            </text>
          </svg>
        </g>
      );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 61">
        {this.createPowerSwitch(this.props.device, classes)}
      </svg>
    );
  }
}

PowerSwitch.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(PowerSwitch);
