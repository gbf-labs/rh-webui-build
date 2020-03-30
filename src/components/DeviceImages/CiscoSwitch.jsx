import React from "react";
import PropTypes from "prop-types";
import withStyles from "@material-ui/core/styles/withStyles";
import colors from "../../variables/colors";

const styles = () => ({
  mainBox: {
    "max-width": "600px",
    width: "100%",
    height: "100%",
    "max-height": "60px",
    top: "55px",
    left: 0,
    margin: "auto",
    display: "block",
    transform: "none",
    "margin-top": "75px"
  },
  rectBox: {
    fill: "rgba(80,80,80,1)",
    stroke: "rgba(103,141,152,1)",
    "stroke-width": "5px"
  },
  rectBoxSmall: {
    fill: "rgba(80,80,80,1)",
    stroke: "rgba(103,141,152,1)",
    "stroke-width": "2.5px"
  },
  lineBorder: {
    stroke: "rgba(255,230,80,1)",
    "stroke-width": "2.5px;"
  }
});

class CiscoSwitch extends React.Component {
  static defaultProps = {
    width: 600,
    height: 60,
    portnumbers: 0,
    fillColor: "rgba(80,80,80,1)",
    fillOuterColor: "rgba(255,255,255,1)",
    fillInnerColorOn: "rgba(0,255,0,1)",
    fillInnerColorOff: "rgba(192,192,192,1)",
    strokeColor: "rgba(103,141,152,1)"
  };

  createCiscoSwitch = device => {
    const temp = device.general ? device.general.entPhysicalName : null;
    const temp2 = device.general ? device.general.model : "";
    const model = temp ? temp : temp2;
    const ports = device.ports ? device.ports : [];
    let fillColor = "rgba(80,80,80,1)";
    let strokeColor = "rgba(103,141,152,1)";
    let width = 600;
    let portData = {
      ports,
      portnumbers: 0,
      gbPortnumbers: 0,
      colorPortArray: {
        connected: colors.GREEN, //green
        up: colors.GREEN, //green
        notconnect: colors.GREY, //grey
        down: colors.GREY, //grey
        disabled: colors.RED, //red
        "err-disabled": colors.RED //red
      }
    };
    switch (model) {
      case "SG300-10MP":
        width = 300;
        portData["portNaming"] = "Gi";
        portData["portnumbers"] = 8;
        portData["counttype"] = "leftToRight";
        fillColor = "rgba(20,20,20,1)";
        portData["yStart"] = 20;
        portData["xStart"] = 180;
        portData["oneLine"] = true;
        strokeColor = fillColor;
        portData["specialPorts"] = [
          { x: 220, name: "gi9", name2: "Gi9", direction: "UP" },
          { x: 275, name: "gi10", name2: "Gi10", direction: "UP" }
        ];
        break;
      case "SG300-28MP":
      case "SG350-28MP":
        portData["portNaming"] = "Gi";
        portData["portnumbers"] = 24;
        portData["counttype"] = "leftToRight";
        fillColor = "rgba(20,20,20,1)";
        portData["yStart"] = 12;
        strokeColor = fillColor;
        portData["specialPorts"] = [
          { x: 550, name: "gi25", name2: "Gi25", direction: "UP" },
          { x: 550, name: "gi26", name2: "Gi26", direction: "DOWN" },
          { x: 575, name: "gi27", name2: "Gi27", direction: "UP" },
          { x: 575, name: "gi28", name2: "Gi28", direction: "DOWN" }
        ];

        break;
      case "SF300-24MP":
        portData["portNaming"] = "Fa";
        portData["portnumbers"] = 24;
        portData["counttype"] = "leftToRight";
        fillColor = "rgba(20,20,20,1)";
        strokeColor = fillColor;
        portData["specialPorts"] = [
          { x: 550, name: "gi1", name2: "Gi1", direction: "UP" },
          { x: 575, name: "gi2", name2: "Gi2", direction: "UP" },
          { x: 550, name: "gi3", name2: "Gi3", direction: "DOWN" },
          { x: 575, name: "gi4", name2: "Gi4", direction: "DOWN" }
        ];

        break;
      case "SG300-52MP":
        portData["portNaming"] = "Gi";
        portData["portnumbers"] = 48;
        portData["counttype"] = "leftToRight";
        fillColor = "rgba(20,20,20,1)";
        portData["yStart"] = 12;
        strokeColor = fillColor;
        portData["specialPorts"] = [
          { x: 550, name: "gi49", name2: "Gi49", direction: "UP" },
          { x: 550, name: "gi50", name2: "Gi50", direction: "DOWN" },
          { x: 575, name: "gi51", name2: "Gi51", direction: "UP" },
          { x: 575, name: "gi52", name2: "Gi52", direction: "DOWN" }
        ];

        break;
      case "WS-C3750X-24T-S":
        portData["portNaming"] = "Gi1/0/";
        portData["portnumbers"] = 24;
        portData["xStart"] = 480;
        fillColor = "rgba(202,202,202,1)";
        portData["specialPorts"] = [
          { x: 509, name: "gi1/1/1", name2: "Gi1/1/1", direction: "DOWN" },
          { x: 531, name: "gi1/1/2", name2: "Gi1/1/2", direction: "DOWN" },
          { x: 553, name: "gi1/1/3", name2: "Gi1/1/3", direction: "DOWN" },
          { x: 575, name: "gi1/1/4", name2: "Gi1/1/4", direction: "DOWN" },
          { x: 45, name: "fa0", name2: "Fa0", direction: "DOWN" }
        ];
        break;
      case "WS-C2960XR-48LPS-I":
        portData["portNaming"] = "Gi1/0/";
        portData["portnumbers"] = 48;
        fillColor = "rgba(202,202,202,1)";
        portData["specialPorts"] = [
          { x: 550, name: "gi1/0/49", name2: "Gi1/0/49", direction: "UP" },
          { x: 550, name: "gi1/0/50", name2: "Gi1/0/50", direction: "DOWN" },
          { x: 575, name: "gi1/0/51", name2: "Gi1/0/51", direction: "UP" },
          { x: 575, name: "gi1/0/52", name2: "Gi1/0/52", direction: "DOWN" },
          { x: 12, defaultColor: "GREENBLUE", direction: "DOWN" },
          { x: 12, name: "fa0", name2: "Fa0", direction: "UP" }
        ];
        break;
      case "WS-C2960-48TT-L":
        portData["portNaming"] = "Fa0/";
        portData["portnumbers"] = 48;
        portData["specialPorts"] = [
          { x: 550, y: 18, name: "gi0/1", name2: "Gi0/1", type: "GBP" },
          { x: 575, y: 18, name: "gi0/2", name2: "Gi0/2", type: "GBP" }
        ];
        break;
      case "WS-C2960+24LC-S":
      case "WS-C2960-24LC-S":
      case "WS-C2960-24TT-L":
      case "WS-C2960+24LC-L":
        portData["portNaming"] = "Fa0/";
        portData["portnumbers"] = 24;
        portData["specialPorts"] = [
          { x: 550, y: 18, name: "gi0/1", name2: "Gi0/1", type: "SFP" },
          { x: 575, y: 18, name: "gi0/2", name2: "Gi0/2", type: "SFP" }
        ];
        break;
      case "WS-C2960-24-S":
        portData["portNaming"] = "Fa0/";
        portData["portnumbers"] = 24;
        break;
      default:
        break;
    }
    return (
      <g key="main">
        <rect
          key="rect1"
          x="0"
          y="0"
          width={width}
          height="60"
          style={{ fill: fillColor, stroke: strokeColor, strokeWidth: "5px" }}
        />
        <rect
          key="rect2"
          x="1.25"
          y="1.25"
          width="35"
          height="57.5"
          style={{ fill: fillColor, stroke: strokeColor, strokeWidth: "2.5px" }}
        />
        <text
          key="text1"
          x="7"
          y="13"
          fontSize="10"
          fontFamily="sans-serif"
          fontWeight="10"
          fill="white"
        >
          Cisco
        </text>
        <text
          key="text2"
          x={width - 75}
          y="11"
          fontSize="8"
          fontFamily="sans-serif"
          fontWeight="10"
          fill="white"
        >
          {model}
        </text>
        {this.createSwitchPort(portData)}
      </g>
    );
  };

  createSwitchPort = data => {
    let xStart = data["xStart"] ? data["xStart"] : 517;
    let y = data["yStart"] ? data["yStart"] : 18;
    let portNaming = data["portNaming"] ? data["portNaming"] : "Fa0/";
    let specialPorts = data["specialPorts"] ? data["specialPorts"] : [];
    let portnumbers = data["portnumbers"] ? data["portnumbers"] : 0;
    let defaultColor = data["defaultColor"]
      ? data["defaultColor"]
      : "rgba(255,255,255,1)";
    let colorPortArray = data["colorPortArray"] ? data["colorPortArray"] : null;
    let counttype = data["counttype"] ? data["counttype"] : "upToDown";
    let oneLine = data["oneLine"] ? data["oneLine"] : false;
    let result = [];

    if (counttype === "upToDown") {
      let x = xStart + 20 - 20 * portnumbers - 5 * (portnumbers / 6 - 1);
      if (!oneLine) {
        x = xStart + 20 - 20 * (portnumbers / 2) - 5 * (portnumbers / 12 - 1);
      }
      result.push(
        <line
          key="line"
          x1={x}
          y1="13"
          x2={xStart + 20}
          y2="13"
          style={{ stroke: "rgba(255,230,80,1)", strokeWidth: "2.5px" }}
        />
      );
      for (let i = 0; i < portnumbers; i++) {
        const port = data.ports[i];
        if (port) {
          let portName = port.name;
          let colorPort = colorPortArray[port.value] || defaultColor;
          let colorBorderPort = defaultColor;
          if ([12, 24, 36, 48, 60, 72].indexOf(i) > -1) {
            x = x + 5;
          }

          let portDirection = "UP";
          if (i > 0 && i % 2 !== 0) {
            portDirection = "DOWN"; //if even number
          }
          result.push(
            this.createNetworkPort({
              x,
              y,
              direction: portDirection,
              colorPort,
              colorBorderPort,
              portName
            })
          );
          if (i > 0 && i % 2 !== 0) {
            x = x + 20;
          }
        }
      }
    } else {
      let x = xStart + 20 - 20 * portnumbers - 5 * (portnumbers / 4 - 1);
      if (!oneLine) {
        x = xStart + 20 - 20 * (portnumbers / 2) - 5 * (portnumbers / 12 - 1);
      }
      let initialx = x;
      let i = 1;
      let j = 0;
      while (i < portnumbers + 1) {
        const port = data.ports[j];
        let portName = portNaming + i;
        let colorPort = colorPortArray[port.value] || defaultColor;

        let colorBorderPort = defaultColor;

        if (!oneLine) {
          if ([6, 12, 18, 24, 30, 36, 42, 48, 54].indexOf(i - 1) > -1) {
            x = x + 5;
          }
        } else {
          if ([4, 8, 12, 16, 20, 24].indexOf(i - 1) > -1) {
            x = x + 5;
          }
        }

        //if even number
        let portDirection = "UP";
        if (!oneLine) {
          if (i - 1 === portnumbers / 2) {
            x = initialx;
          }
          if (i > portnumbers / 2) {
            // draw port down
            portDirection = "DOWN";
          }
        }

        result.push(
          this.createNetworkPort({
            x,
            y,
            direction: portDirection,
            colorPort,
            colorBorderPort,
            portName
          })
        );
        x = x + 20;
        i = i + 1;
        j = j + 1;
      }
    }

    if (specialPorts) {
      let yStart = y;
      for (let z = 0; z < specialPorts.length; z++) {
        const line = specialPorts[z];
        const portStatus = data.ports.find(
          port => port.name === line["name"] || port.name === line["name2"]
        );
        const x = line["x"] ? line["x"] : 0;
        const y = line["y"] ? line["y"] : yStart;

        let type = line["type"] ? line["type"] : null;
        let name = line["name2"] ? line["name2"] : null;
        let direction = line["direction"] ? line["direction"] : null;

        let colorBorderPort = defaultColor;

        let colorPort = colorPortArray[portStatus.value] || defaultColor;

        result.push(
          this.createNetworkPort({
            x,
            y,
            direction,
            colorPort,
            colorBorderPort,
            portName: name,
            type
          })
        );
      }
    }
    return result;
  };

  createNetworkPort = data => {
    let result = [];
    let direction = data["direction"] ? data["direction"] : "DOWN";
    let type = data["type"] ? data["type"] : null;
    let x = data["x"] ? data["x"] : 0;
    let y = data["y"] ? data["y"] : 0;
    let colorBorderPort = data["colorBorderPort"]
      ? data["colorBorderPort"]
      : "rgba(255,255,255,1)";
    let colorPort = data["colorPort"]
      ? data["colorPort"]
      : "rgba(192,192,192,1)";
    let portName = data["portName"] ? data["portName"] : "-Unknown-";
    let portClassName = "switchRJ45InnerBorder ";
    if (colorPort !== "rgba(192,192,192,1)") {
      // portClassName += 'device-status'
    }
    if (direction === "DOWN") {
      result.push(
        <g>
          <rect
            className="switchRJ45OuterBorder"
            x={x}
            y={y + 20}
            width="19"
            height="17"
            style={{ fill: colorBorderPort }}
          >
            <title>{portName}</title>
          </rect>
          <polygon
            className={portClassName}
            style={{ fill: colorPort }}
            points={
              x +
              2 +
              " " +
              (y + 23) +
              " " +
              (x + 17) +
              " " +
              (y + 23) +
              " " +
              (x + 17) +
              " " +
              (y + 31) +
              " " +
              (x + 14) +
              " " +
              (y + 31) +
              " " +
              (x + 14) +
              " " +
              (y + 34) +
              " " +
              (x + 5) +
              " " +
              (y + 34) +
              " " +
              (x + 5) +
              " " +
              (y + 31) +
              " " +
              (x + 2) +
              " " +
              (y + 31)
            }
          />
          <line
            className="switchRJ45Pin"
            x1={x + 4.5}
            y1={y + 26.5}
            x2={x + 14.5}
            y2={y + 26.5}
          />
        </g>
      );
      // console.log('type === ', type);
      if (type && type === "SFP") {
        result.push(
          <g>
            <rect
              x={x}
              y={y}
              width="19"
              height="37"
              style={{ fill: "none", stroke: "black", strokeWidth: "1px" }}
            />
            <rect
              x={x}
              y={y}
              width="19"
              height="13"
              style={{ fill: colorPort, stroke: "black", strokeWidth: "1px" }}
            />
            <line
              className="switchSFPLine"
              x1={x + 6}
              y1={y + 12}
              x2={x + 12.5}
              y2={y + 12}
              style={{ stroke: "black", strokeWidth: "2px" }}
            />
            <rect
              className="switchSFPOuterBorder"
              x={x}
              y={y}
              width="19"
              height="37"
            >
              <title>{portName}</title>
            </rect>
          </g>
        );
      }
    } else {
      result.push(
        <g>
          <rect
            className="switchRJ45OuterBorder"
            x={x}
            y={y}
            width="19"
            height="17"
            style={{ fill: colorBorderPort }}
          >
            <title>{portName}</title>
          </rect>
          <polygon
            className={portClassName}
            style={{ fill: colorPort }}
            points={
              x +
              5 +
              " " +
              (y + 3) +
              " " +
              (x + 14) +
              " " +
              (y + 3) +
              " " +
              (x + 14) +
              " " +
              (y + 6) +
              " " +
              (x + 17) +
              " " +
              (y + 6) +
              " " +
              (x + 17) +
              " " +
              (y + 14) +
              " " +
              (x + 2) +
              " " +
              (y + 14) +
              " " +
              (x + 2) +
              " " +
              (y + 6) +
              " " +
              (x + 5) +
              " " +
              (y + 6)
            }
          />
          <line
            className="switchRJ45Pin"
            x1={x + 4.5}
            y1={y + 10.5}
            x2={x + 14.5}
            y2={y + 10.5}
          />
        </g>
      );
    }

    return result;
  };

  render() {
    const { classes } = this.props;
    return (
      <svg className={classes.mainBox} viewBox="0 0 600 60">
        {this.createCiscoSwitch(this.props.device)}
      </svg>
    );
  }
}

CiscoSwitch.propTypes = {
  classes: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(CiscoSwitch);
