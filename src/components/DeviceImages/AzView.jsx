import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
  mainBox: {
    maxWidth: "300px",
    width: "100%",
    height: "100%",
    maxHeight: "300px",
    overflow: "visible"
  }
});

class AzView extends React.Component {
  createCircles() {
    const { azimuth, courseUp } = this.props;
    const heading = azimuth.Heading;
    const rotateHeading = courseUp === true ? heading : 0;
    return (
      <g transform={"rotate(-" + rotateHeading + " 50 50)"}>
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="90"
          stroke="lightgrey"
          strokeWidth=".5"
        />
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="50"
          stroke="lightgrey"
          strokeWidth=".5"
        />
        <line
          x1="20"
          y1="20"
          x2="80"
          y2="80"
          stroke="lightgrey"
          strokeWidth=".5"
        />
        <line
          x1="80"
          y1="20"
          x2="20"
          y2="80"
          stroke="lightgrey"
          strokeWidth=".5"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="rgba(240,240,240,1)"
          strokeWidth="10px"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="10"
          stroke="lightgrey"
          strokeWidth=".5"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="20"
          stroke="lightgrey"
          strokeWidth=".5"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="30"
          stroke="lightgrey"
          strokeWidth=".5"
          fill="none"
        />
        <text
          x="50"
          y="6.5"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform="rotate(0 50 6.5 )  "
        >
          N
        </text>
        <text
          x="50"
          y="95.5"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform="rotate(0 50 95.5 )"
        >
          S
        </text>
        <text
          x="94.5"
          y="50"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform="rotate(0 94.5 50 )"
        >
          E
        </text>
        <text
          x="5.5"
          y="50"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform="rotate(0 5.5 50 )"
        >
          W
        </text>
      </g>
    );
  }

  createVesselImage() {
    const { azimuth, courseUp } = this.props;
    const heading = azimuth.Heading;
    const rotateHeading = courseUp === true ? heading : 0;
    return (
      <g transform={"rotate(-" + rotateHeading + " 50 50)"} className="line">
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="50"
          stroke="black"
          strokeWidth="0.5"
          transform={"rotate(" + heading + " 50 50)"}
        />
        <path
          d="M49,30  L50,24 A40,40 0 0,1 60,45 A30,30 0 0,1 60,52 A250,250 0 0,0 59,74 A1,1 0 0,1 58,75 L49,75 "
          stroke="black"
          strokeWidth="0"
          fill="black"
          transform={"rotate(" + heading + " 50 50)"}
        />
        <path
          d="M49,30  L50,24 A40,40 0 0,1 60,45 A30,30 0 0,1 60,52 A250,250 0 0,0 59,74 A1,1 0 0,1 58,75 L49,75 "
          stroke="black"
          strokeWidth="0"
          fill="black"
          transform={
            "scale(-1,1) translate (-100,0) rotate(-" + heading + " 50 50)"
          }
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="50"
          stroke="rgba(0,0,0,0)"
          strokeWidth="4"
          transform={"rotate(" + heading + " 50 50)"}
        />
        <text
          className="linetext"
          x="50"
          y="-10"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="black"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={
            "rotate(" + heading + " 50 50 ) rotate(-" + heading + " 50 -10 )"
          }
        >
          {heading}°
        </text>
      </g>
    );
  }

  createAntennaLine() {
    const { azimuth, courseUp } = this.props;
    const targetSatHeading = parseFloat(azimuth.TargetAzimuth);
    const heading = parseFloat(azimuth.Heading);
    const rotateHeading = courseUp === true ? heading : 0;
    if (
      isNaN(targetSatHeading) ||
      targetSatHeading === undefined ||
      targetSatHeading === null
    ) {
      return;
    }

    const displayTargetSatHeading = parseFloat(
      360 - heading + targetSatHeading
    );
    const rotateTargetSatHeading = parseFloat(
      heading + displayTargetSatHeading
    );
    return (
      <g transform={"rotate(-" + rotateHeading + " 50 50)"} className="line">
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="42"
          stroke="orange"
          strokeWidth="2"
          transform={"rotate(" + rotateTargetSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="42"
          stroke="rgba(0,0,0,0)"
          strokeWidth="8"
          transform={"rotate(" + rotateTargetSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <text
          className="linetext"
          x="0"
          y="100"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="orange"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {targetSatHeading}°
        </text>
      </g>
    );
  }

  createAntennaLine2() {
    const { azimuth, courseUp } = this.props;
    const relativeSatHeading = parseFloat(azimuth.RelativeAz);
    const heading = parseFloat(azimuth.Heading);
    const rotateHeading = courseUp === true ? heading : 0;
    if (
      isNaN(relativeSatHeading) ||
      relativeSatHeading === undefined ||
      relativeSatHeading === null
    ) {
      return;
    }
    const rotateRelativeSatHeading = parseFloat(heading + relativeSatHeading);
    return (
      <g transform={"rotate(-" + rotateHeading + " 50 50)"} className="line">
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="44"
          stroke="red"
          strokeWidth="2"
          strokeDasharray="3, 3, 0"
          transform={"rotate(" + rotateRelativeSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="10"
          x2="50"
          y2="44"
          stroke="rgba(0,0,0,0)"
          strokeWidth="4"
          transform={"rotate(" + rotateRelativeSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <text
          className="linetext"
          x="0"
          y="100"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="red"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {relativeSatHeading}°
        </text>
      </g>
    );
  }

  createAntenna() {
    const { azimuth, courseUp } = this.props;
    const absoluteSatHeading = parseFloat(azimuth.AbsoluteAz);
    const heading = parseFloat(azimuth.Heading);
    const rotateHeading = courseUp === true ? heading : 0;
    const displayAbsoluteSatHeading = parseFloat(
      360 - heading + absoluteSatHeading
    );
    const rotateAbsoluteSatHeading = parseFloat(
      heading + displayAbsoluteSatHeading
    );
    return (
      <g transform={"rotate(-" + rotateHeading + " 50 50)"} className="line">
        <path
          d="M54,50 A4,4 0 0,1 46,50"
          stroke="white"
          strokeWidth=".5"
          fill="white"
          transform={"rotate(" + rotateAbsoluteSatHeading + " 50 50)"}
        />
        <circle
          cx="50"
          cy="46"
          r="1"
          stroke="white"
          strokeWidth=".5"
          fill="white"
          transform={"rotate(" + rotateAbsoluteSatHeading + " 50 50)"}
        />
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="46"
          stroke="white"
          strokeWidth="0.5"
          transform={"rotate(" + rotateAbsoluteSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="11"
          x2="50"
          y2="45"
          stroke="blue"
          strokeWidth="1"
          strokeDasharray="3, 3, 0"
          transform={"rotate(" + rotateAbsoluteSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="50"
          y1="11"
          x2="50"
          y2="45"
          stroke="rgba(0,0,0,0)"
          strokeWidth="4"
          transform={"rotate(" + rotateAbsoluteSatHeading + " 50 50)"}
          vectorEffect="non-scaling-stroke"
        />
        <text
          className="linetext"
          x="0"
          y="100"
          fontSize="8"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="blue"
          textAnchor="middle"
          alignmentBaseline="middle"
        >
          {absoluteSatHeading}°
        </text>
      </g>
    );
  }

  createTextHeadings() {
    const { azimuth } = this.props;
    return (
      <g>
        <text
          x="-20"
          y="-19"
          textAnchor="start"
          alignmentBaseline="hanging"
          fontSize="7"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="black"
        >
          Heading = {azimuth.Heading}°
        </text>
        <text
          x="-20"
          y="-13"
          textAnchor="start"
          alignmentBaseline="hanging"
          fontSize="7"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="blue"
        >
          Absolute = {azimuth.AbsoluteAz}°
        </text>
        <text
          x="-20"
          y="-7"
          textAnchor="start"
          alignmentBaseline="hanging"
          fontSize="7"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="red"
        >
          Relative = {azimuth.RelativeAz}°
        </text>
        <text
          x="-20"
          y="-1"
          textAnchor="start"
          alignmentBaseline="hanging"
          fontSize="7"
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="orange"
        >
          Target = {azimuth.TargetAzimuth}°
        </text>
      </g>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="-20 -20 140 140">
        {this.createCircles()}
        {this.createVesselImage()}
        {this.createAntennaLine()}
        {this.createAntennaLine2()}
        {this.createAntenna()}
        <circle
          cx="50"
          cy="50"
          r="49.5"
          stroke="black"
          strokeWidth=".5"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="black"
          strokeWidth=".5"
          fill="none"
        />
        {this.createTextHeadings()}
      </svg>
    );
  }
}

AzView.propTypes = {
  classes: PropTypes.object.isRequired,
  azimuth: PropTypes.object.isRequired,
  courseUp: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(AzView);
