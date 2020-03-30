import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "variables/colors";

const styles = () => ({
  mainBox: {
    "max-width": "600px",
    width: "100%",
    height: "100%",
    "max-height": "160px",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  }
});

class VSAT_Sailor900 extends React.Component {
  static defaultProps = {
    width: 600,
    height: 160
  };

  createVSAT = device => {
    const general = device.general ? device.general : {};
    let status = colors.OFF;
    if (device.status === "green") {
      status = colors.GREEN;
    } else if (device.status === "orange") {
      status = colors.ORANGE;
    }

    const img = require("assets/img/devices/VSAT_Sailor_900_600px.png");
    return (
      <g key="main">
        <rect x="40" y="46" width="12" height="12" style={{ fill: status }} />
        <rect
          x="40"
          y="74"
          width="12"
          height="12"
          style={{
            fill:
              general.AntennaStatus.toLowerCase() === "tracking"
                ? colors.YELLOW
                : colors.OFF
          }}
        />
        <rect
          x="40"
          y="102"
          width="12"
          height="12"
          style={{
            fill:
              general.AntennaStatus.toLowerCase() === "tracking"
                ? colors.YELLOW
                : colors.OFF
          }}
        />

        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="VSAT - Sailor_900" />
        </foreignObject>
        <g>
          <text
            x="135"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            MAIN
          </text>
          <text
            x="185"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            TX:
          </text>
          <text
            x="205"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            OK
          </text>
          <text
            x="235"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            GPS:
          </text>
          <text
            x="265"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            OK
          </text>
          <text
            x="300"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            HDG:
          </text>
          <text
            x="330"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            OK
          </text>
          <text
            x="370"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            LAN:{" "}
          </text>
          <text
            x="400"
            y="52"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            OK
          </text>
          <text
            x="135"
            y="80"
            fontSize="20"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            {general.AntennaStatus}
          </text>
          <text
            x="135"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            SAT:
          </text>
          <text
            x="165"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            {general.SatelliteLongitude}
          </text>
          <text
            x="200"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            RX:
          </text>
          <text
            x="225"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            {general.SatelliteRxPol}
          </text>
          <text
            x="245"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            {(general.RxIfFreq / 1000000).toFixed(3)}/
          </text>
          <text
            x="285"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            {(general.Down_Translation / 1000000).toFixed(2)}
          </text>
          <text
            x="340"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            TX:
          </text>
          <text
            x="360"
            y="115"
            fontSize="12"
            fontFamily="sans-serif"
            fontWeight="400"
            fill="rgba(255,0,0,1)"
          >
            {general.SatelliteTxPol.replace("Vertical", "V").replace(
              "Horizontal",
              "H"
            )}
          </text>
        </g>
        <g>
          <rect
            x="410"
            y="105"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect
            x="410"
            y="98"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect
            x="410"
            y="91"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect
            x="410"
            y="84"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect
            x="410"
            y="77"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect
            x="410"
            y="70"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect
            x="410"
            y="63"
            width="25"
            height="6"
            style={{ fill: colors.RED }}
          />
          <rect x="0" y="0" width="0" height="0" style={{ fill: colors.RED }} />
        </g>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 160">
        {this.createVSAT(this.props.device)}
      </svg>
    );
  }
}

VSAT_Sailor900.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(VSAT_Sailor900);
