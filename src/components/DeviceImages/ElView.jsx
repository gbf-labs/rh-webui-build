import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";

const styles = () => ({
  mainBox: {
    maxWidth: "300px",
    width: "100%",
    height: "100%",
    maxHeight: "150px",
    overflow: "visible"
  }
});

class ElView extends React.Component {
  rotater(deg) {
    return "rotate(" + deg + " 156 118)";
  }

  createTargElevation() {
    const { elevation } = this.props;
    const targElv = elevation.TargetElevation;
    if (isNaN(targElv) || targElv === undefined || targElv === null) {
      return;
    }
    return (
      <g className="line">
        <line
          x1="175"
          y1="118"
          x2="250"
          y2="118"
          stroke="red"
          strokeWidth="2"
          strokeDasharray="3, 3, 0"
          transform={this.rotater("-" + targElv)}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="175"
          y1="118"
          x2="250"
          y2="118"
          stroke="rgba(0,0,0,0)"
          strokeWidth="4"
          transform={this.rotater("-" + targElv)}
          vectorEffect="non-scaling-stroke"
        />
        <text
          className="linetext"
          x="275"
          y="118"
          fontSize=""
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="red"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={this.rotater("-" + targElv) + " " + this.rotater(targElv)}
        >
          {elevation.TargetElevation}°
        </text>
      </g>
    );
  }

  createElevation() {
    const { elevation } = this.props;
    const elv = elevation.Elevation;
    if (isNaN(elv) || elv === undefined || elv === null) {
      return;
    }
    return (
      <g className="line">
        <line
          x1="175"
          y1="118"
          x2="250"
          y2="118"
          stroke="orange"
          strokeWidth="2"
          transform={this.rotater("-" + elv)}
          vectorEffect="non-scaling-stroke"
        />
        <line
          x1="175"
          y1="118"
          x2="250"
          y2="118"
          stroke="rgba(0,0,0,0)"
          strokeWidth="8"
          transform={this.rotater("-" + elv)}
          vectorEffect="non-scaling-stroke"
        />
        <text
          className="linetext"
          x="275"
          y="118"
          fontSize=""
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="orange"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={this.rotater("-" + elv) + " " + this.rotater(elv)}
        >
          {elevation.Elevation}°
        </text>
      </g>
    );
  }
  render() {
    const { classes, elevation } = this.props;
    const elv = elevation.Elevation;
    const targElv = elevation.TargetElevation;
    return (
      <svg className={classes.mainBox} viewBox="0 0 300 150">
        <g transform="rotate(0 156 118)" />
        <g>
          <path
            d="M103,145 L200,145 L215,130 L130,130 L130,110 L135,110 L135,105 L120,105 L120,90 L118,90 L118,105 L100,105 L100,130 L85,130 L80,110 L70,115 L70,130 L65,130 L65,140 L69,145 L103,145 "
            stroke="black"
            strokeWidth=".5"
            fill="black"
          />
          <path
            d="M165,108 A5,5 0 0,0 165,128"
            stroke="black"
            strokeWidth=".5"
            fill="black"
            transform={this.rotater("-" + elv)}
          />
          <line
            x1="165"
            y1="118"
            x2="172"
            y2="118"
            stroke="black"
            strokeWidth="1"
            transform={this.rotater("-" + elv)}
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx="172"
            cy="118"
            r="2"
            stroke="black"
            strokeWidth=".5"
            fill="black"
            transform={this.rotater("-" + elv)}
          />
          <line
            x1="156"
            y1="130"
            x2="156"
            y2="118"
            stroke="black"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="156"
            y1="118"
            x2="145"
            y2="132"
            stroke="black"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </g>
        {this.createElevation()}
        {this.createTargElevation()}
        <text
          x="0"
          y="1"
          textAnchor="start"
          alignmentBaseline="hanging"
          fontSize=""
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="orange"
        >
          Elevation = {elv}°
        </text>
        <text
          x="0"
          y="14"
          textAnchor="start"
          alignmentBaseline="hanging"
          fontSize=""
          fontFamily="DDIN, sans-serif"
          fontWeight=""
          fill="red"
        >
          TargetElevation = {targElv}°
        </text>
      </svg>
    );
  }
}

ElView.propTypes = {
  classes: PropTypes.object.isRequired,
  elevation: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(ElView);
