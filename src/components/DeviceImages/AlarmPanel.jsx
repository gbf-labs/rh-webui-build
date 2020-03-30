import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "../../variables/colors";

const styles = () => ({
  mainBox: {
    "max-width": "600px",
    width: "100%",
    height: "100%",
    "max-height": "190px",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  }
});

class AlarmPanel extends React.Component {
  static defaultProps = {
    width: 213,
    height: 189
  };

  createAlarmPanel = device => {
    const { classes } = this.props;
    const gen = device.general;
    let img = require("assets/img/devices/sailor-6103-multi-alarm-panel.png");

    return (
      <g key="main">
        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="AlarmPanel" />
        </foreignObject>
        <svg className={classes.mainBox} viewBox="0 0 213 189">
          {gen &&
            gen.VHF1 && (
              <g>
                <text
                  x="50"
                  y="40"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  VHF1
                </text>
                <text
                  x="80"
                  y="40"
                  fontSize="40"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  .
                </text>
                {/* <text
                  x="95"
                  y="40"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Distress
                </text>
                <text
                  x="130"
                  y="40"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Fault
                </text>
                <text
                  x="155"
                  y="40"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.GREEN }}
                >
                  Test
                </text> */}
              </g>
            )}

          {gen &&
            gen.VHF2 && (
              <g>
                <text
                  x="50"
                  y="55"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  VHF2
                </text>
                <text
                  x="80"
                  y="55"
                  fontSize="40"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  .
                </text>
                {/* <text
                  x="95"
                  y="55"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Distress
                </text>
                <text
                  x="130"
                  y="55"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Fault
                </text>
                <text
                  x="155"
                  y="55"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.GREEN }}
                >
                  Test
                </text> */}
              </g>
            )}

          {gen &&
            gen.INMC1 && (
              <g>
                <text
                  x="50"
                  y="70"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Inm-C1
                </text>
                <text
                  x="80"
                  y="70"
                  fontSize="40"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  .
                </text>
                {/* <text
                  x="95"
                  y="70"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Distress
                </text>
                <text
                  x="130"
                  y="70"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Fault
                </text>
                <text
                  x="155"
                  y="70"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.GREEN }}
                >
                  Test
                </text> */}
              </g>
            )}
          {gen &&
            gen.INMC2 && (
              <g>
                <text
                  x="50"
                  y="85"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Inm-C2
                </text>
                <text
                  x="80"
                  y="85"
                  fontSize="40"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  .
                </text>
                {/* <text
                  x="95"
                  y="85"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Distress
                </text>
                <text
                  x="130"
                  y="85"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Fault
                </text>
                <text
                  x="155"
                  y="85"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.GREEN }}
                >
                  Test
                </text> */}
              </g>
            )}

          {gen &&
            gen.MFHF1 && (
              <g>
                <text
                  x="50"
                  y="100"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  MF/HF1
                </text>
                <text
                  x="80"
                  y="100"
                  fontSize="40"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  .
                </text>
                {/* <text
                  x="95"
                  y="100"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Distress
                </text>
                <text
                  x="130"
                  y="100"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Fault
                </text>
                <text
                  x="155"
                  y="100"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.GREEN }}
                >
                  Test
                </text> */}
              </g>
            )}

          {gen &&
            gen.MFHF1 && (
              <g>
                <text
                  x="50"
                  y="115"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  MF/HF2
                </text>
                <text
                  x="80"
                  y="115"
                  fontSize="40"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  .
                </text>
                {/* <text
                  x="95"
                  y="115"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Distress
                </text>
                <text
                  x="130"
                  y="115"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.RED }}
                >
                  Fault
                </text>
                <text
                  x="155"
                  y="115"
                  fontSize="8"
                  fontFamily="sans-serif"
                  fontWeight="400"
                  style={{ fill: colors.GREEN }}
                >
                  Test
                </text> */}
              </g>
            )}
        </svg>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 213 189">
        {this.createAlarmPanel(this.props.device)}
      </svg>
    );
  }
}

AlarmPanel.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(AlarmPanel);
