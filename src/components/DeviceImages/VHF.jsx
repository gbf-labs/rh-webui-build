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

class VHF extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60
  };

  createVHF = device => {
    const general = device.general ? device.general : {};
    const img = require("assets/img/devices/VHF_Sailor_62xx.png");
    return (
      <g key="main">
        <rect
          x="149"
          y="17"
          width="115"
          height="85"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_BG }}
        />
        <foreignObject width="100%" height="100%">
          <img width="100%" src={img} alt="VSAT" />
        </foreignObject>
        <text
          x="152"
          y="28"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          SCAN
        </text>
        <text
          x="152"
          y="49"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          LOCAL
        </text>
        <text
          x="152"
          y="70"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          PHBOOK
        </text>
        <text
          x="152"
          y="91"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          SETUP
        </text>
        <text
          x="190"
          y="70"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          {general.currentChDesc}
        </text>
        <text
          x="190"
          y="60"
          fontSize="40"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          {general.currentCh}
        </text>
        <text
          x="235"
          y="28"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          LO
        </text>
        <text
          x="235"
          y="60"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          {general.transmitMode}
        </text>
        <text
          x="250"
          y="70"
          fontSize="7"
          fontFamily="sans-serif"
          fontWeight="400"
          style={{ fill: colors.SAILOR_VHF62xx_DISP_FG }}
        >
          INT
        </text>
      </g>
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 361 160">
        {this.createVHF(this.props.device)}
      </svg>
    );
  }
}

VHF.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(VHF);
