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

class VSAT extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60
  };

  createVSAT = device => {
    const general = device.general ? device.general : {};
    let status = colors.OFF;
    if (device.status === "green") {
      status = colors.GREEN;
    } else if (device.status === "orange") {
      status = colors.ORANGE;
    }
    const line1 = general.AntennaStatus.toUpperCase() + " SIG: " + general.AGC;
    const line2 =
      "AZ:" +
      parseFloat(general.Heading) +
      "(" +
      general.RelativeAz +
      ") EL:" +
      general.Elevation +
      " SK:" +
      general.POL;

    const img = require("assets/img/devices/VSAT_Intellian_Front_600px.png");
    return (
      <g key="main">
        <rect x="77" y="29" width="7" height="7" style={{ fill: status }} />
        <rect
          x="77"
          y="38"
          width="7"
          height="7"
          style={{
            fill:
              general.AntennaStatus.toLowerCase() === "tracking"
                ? colors.YELLOW
                : colors.OFF
          }}
        />
        <rect x="77" y="47" width="7" height="7" style={{ fill: colors.OFF }} />

        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="VSAT" />
        </foreignObject>
        <text
          x="125"
          y="27"
          fontSize="10"
          fontFamily="courier new"
          fontWeight="400"
          style={{ fill: colors.INTELLIAN_ACU_DISP }}
        >
          {line1}
        </text>
        <text
          x="125"
          y="40"
          fontSize="10"
          fontFamily="courier new"
          fontWeight="400"
          style={{ fill: colors.INTELLIAN_ACU_DISP }}
        >
          {line2}
        </text>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 156">
        {this.createVSAT(this.props.device)}
      </svg>
    );
  }
}

VSAT.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(VSAT);
