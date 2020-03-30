import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "variables/colors";

const styles = () => ({
  mainBox: {
    "max-width": "361px",
    width: "100%",
    height: "100%",
    "max-height": "59px",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  }
});

class SATC extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60
  };

  createSATC = device => {
    const general = device.general ? device.general : {};
    const img = require("assets/img/devices/satcsymbol_600px.png");
    const getCurProtocol = name => {
      if (name === "cpLogin") {
        return "✘";
      } else if (name === "cpFree") {
        return "✓";
      } else if (name === "warning") {
        return "‎⚠";
      }
    };

    const getCurProtocolColors = name => {
      if (name === "cpLogin") {
        return colors.RED;
      } else if (name === "cpFree") {
        return colors.GREEN;
      } else if (name === "warning") {
        return colors.ORANGE;
      }
    };
    return (
      <g key="main">
        <rect
          x="0"
          y="0"
          width="361"
          height="59"
          style={{ fill: colors.BLACK }}
        />
        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="VSAT" />
        </foreignObject>
        <text
          x="310"
          y="55"
          fontSize="60"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{
            fill: getCurProtocolColors(general.currentProtocol)
          }}
        >
          {getCurProtocol(general.currentProtocol)}
        </text>
        <text
          x="80"
          y="20"
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.WHITE }}
        >
          {general.currentOceanRegion}
        </text>
        <text
          x="80"
          y="45"
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.WHITE }}
        >
          {general.latitude.split(".")[0] + "°"}
          {general.latitude.split(".")[1] + "'"}
          {general.latitude.split(".")[2] + '"'}
        </text>
        <text
          x="165"
          y="45"
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.WHITE }}
        >
          {general.latitudeDirection}
        </text>
        <text
          x="200"
          y="45"
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.WHITE }}
        >
          {general.longitude.split(".")[0] + "°"}
          {general.longitude.split(".")[1] + "'"}
          {general.longitude.split(".")[2] + '"'}
        </text>
        <text
          x="275"
          y="45"
          fontSize="20"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.WHITE }}
        >
          {general.longitudeDirection}
        </text>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 361 59">
        {this.createSATC(this.props.device)}
      </svg>
    );
  }
}

SATC.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(SATC);
