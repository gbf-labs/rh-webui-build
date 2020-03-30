import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "variables/colors";

const styles = () => ({
  mainBox: {
    "max-height": "103px",
    "max-width": "600px",
    width: "100%",
    height: "100%",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  }
});

class FBB extends React.Component {
  static defaultProps = {
    width: 600,
    height: 103
  };

  createVHF = device => {
    const general = device.general ? device.general : {};
    const img = require("assets/img/devices/FBB_BDU_Connectors_600px.png");
    return (
      <g key="main">
        <rect x="160" y="54" width="22" height="7" />
        <rect x="187" y="54" width="22" height="7" />
        <rect x="231" y="54" width="27" height="7" />

        <rect
          x="284"
          y="37"
          width="27"
          height="7"
          style={{
            fill:
              general.Port1.toLowerCase() === "up" ? colors.GREEN : colors.OFF
          }}
        />
        <rect
          x="318"
          y="37"
          width="27"
          height="7"
          style={{
            fill:
              general.Port2.toLowerCase() === "up" ? colors.GREEN : colors.OFF
          }}
        />
        <rect
          x="284"
          y="54"
          width="27"
          height="7"
          style={{
            fill:
              general.Port3.toLowerCase() === "up" ? colors.GREEN : colors.OFF
          }}
        />
        <rect
          x="318"
          y="54"
          width="22"
          height="7"
          style={{
            fill:
              general.Port4.toLowerCase() === "up" ? colors.GREEN : colors.OFF
          }}
        />
        <rect
          x="465"
          y="42"
          width="25"
          height="20"
          style={{
            fill:
              general.ADU_State.toLowerCase() === "tracking"
                ? colors.GREEN
                : colors.OFF
          }}
        />

        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="FBB" />
        </foreignObject>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 103">
        {this.createVHF(this.props.device)}
      </svg>
    );
  }
}

FBB.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FBB);
