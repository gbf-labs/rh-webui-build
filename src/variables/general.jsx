import { sha256 } from "js-sha256";
import auth from "../utils/auth";

// ##############################
// // // Common functions
// #############################

const general = {
  toDegreesMinutesAndSeconds(coordinate) {
    var absolute = Math.abs(coordinate);
    var degrees = Math.floor(absolute);
    var minutesNotTruncated = (absolute - degrees) * 60;
    var minutes = Math.floor(minutesNotTruncated);
    var seconds = Math.floor((minutesNotTruncated - minutes) * 60);

    return degrees + "° " + minutes + "' " + seconds + "''";
  },

  convertLattoDMS(lat) {
    var latitude = this.toDegreesMinutesAndSeconds(lat);
    var latitudeCardinal = Math.sign(lat) >= 0 ? "N" : "S";
    return latitude + " " + latitudeCardinal;
  },

  convertLngtoDMS(lng) {
    var longitude = this.toDegreesMinutesAndSeconds(lng);
    var longitudeCardinal = Math.sign(lng) >= 0 ? "E" : "W";
    return longitude + " " + longitudeCardinal;
  },

  convertDMS(lat, lng) {
    return this.convertLattoDMS(lat) + ", " + this.convertLngtoDMS(lng);
  },

  getDeviceImage(dev, general) {
    let img;
    const devType = dev.device_type;
    switch (devType) {
      case "Sailor_6103":
        img = require("assets/img/devices/sailor-6103-multi-alarm-panel.png");
        break;
      case "Sailor_3027C":
        img = require("assets/img/devices/satcsymbol_600px.png");
        break;
      case "Evolution_X5":
        img = require("assets/img/devices/MODEM_X5_600px.png");
        break;
      case "Evolution_X7":
        img = require("assets/img/devices/MODEM_X7_600px.png");
        break;
      case "Sentry3":
        img = require("assets/img/devices/POWERSWITCH_Sentry_CW8HEA211.png");
        break;
      case "Raritan_PX2":
        img = require("assets/img/devices/POWERSWITCH_Raritan_PX2-2190R_600px.png");
        break;
      case "APC_AP7921":
        img = require("assets/img/devices/POWERSWITCH_APC_AC7921_600px.png");
        break;
      case "IOP":
        img = require("assets/img/devices/IOP_BDU_600px.png");
        break;
      case "Seatel":
        img = require("assets/img/devices/VSAT_Seatel_DAC-2202_600px.png");
        break;
      case "Intellian_V80_E2S":
      case "Intellian_V100_E2S":
      case "Intellian_V110_E2S":
      case "Intellian_V80_IARM":
      case "Intellian_V100_IARM":
      case "Intellian_V110_IARM":
      case "Intellian_V100":
      case "Intellian_V110":
        img = require("assets/img/devices/VSAT_Intellian_Front_600px.png");
        break;
      case "Sailor_900":
        img = require("assets/img/devices/VSAT_Sailor_900_600px.png");
        break;
      case "Sailor_62xx":
        img = require("assets/img/devices/VHF_Sailor_62xx.png");
        break;
      case "Cobham_500":
        img = require("assets/img/devices/FBB_BDU_Connectors_600px.png");
        break;
      case "Catalyst_2960":
      case "Catalyst_3750":
      case "Cisco_SNMP":
        if (
          general &&
          (general.model === "SG300-52MP" ||
            general.model === "WS-C2960XR-48LPS-I" ||
            general.model === "WS-C2960-48TT-L")
        ) {
          img = require("assets/img/devices/cisco_switch_48.png");
        } else if (general && general.model === "SG300-10MP") {
          img = require("assets/img/devices/cisco_switch_8.png");
        } else {
          img = require("assets/img/devices/cisco_switch.png");
        }
        break;
      case "Intellian_M3_TV03":
        img = require("assets/img/devices/MEDIATOR_Intellian_M3-TV03_600px.png");
        break;
      case "Seatel_Mediator":
        img = require("assets/img/devices/MEDIATOR_Seatel_600px.png");
        break;
      case "Cisco_C8XX":
        img = require("assets/img/devices/ROUTER_Cisco_C896VA.png");
        break;
      case "ININMEA":
        img = require("assets/img/devices/nmea.png");
        break;
      case "Danalec_VRI1":
        img = require("assets/img/devices/vdr.png");
        break;
      default:
        img = null;
    }
    return img;
  },

  humanizeName(dName) {
    if (dName.match(/\d+$/)) {
      const num = dName.match(/\d+$/)[0];
      if (dName.match(/NTWPERF/g)) {
        return "Network Performance " + num;
      } else if (dName.match(/COREVALUES/g)) {
        return "Core Values" + num;
      } else if (dName.match(/IOP/g)) {
        return "Iridium OpenPort " + num;
      } else if (dName.match(/VDR/g)) {
        return "VDR " + num;
      } else if (dName.match(/VSAT/g)) {
        return "V-SAT " + num;
      } else if (dName.match(/FBB/g)) {
        return "FleetBroadBand " + num;
      } else if (dName.match(/VHF/g)) {
        return "VHF " + num;
      } else if (dName.match(/SATC/g)) {
        return "SAT-C " + num;
      } else {
        return dName.replace(/[0-9]/g, "") + " " + num;
      }
    } else {
      if (dName === "NTWCONF") {
        return "Network Configuration";
      }
    }
  },

  capitalizeFirstLetter(string) {
    let smallLetters = string.toLowerCase();
    return smallLetters.charAt(0).toUpperCase() + smallLetters.slice(1);
  },

  capitalizeFirstLetter2(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  getVesselIcon(vessel) {
    let iconUrl = "360.png";
    if (vessel.heading > 0) {
      for (let i = 5; i < 360; i += 5) {
        if (vessel.heading === i || vessel.heading < i + 5) {
          iconUrl = i + ".png";
          break;
        }
      }
    }
    let markerIcon = require("assets/img/ship/Ship-Grey/" + iconUrl);
    if (vessel.update_state === "red") {
      markerIcon = require("assets/img/ship/Ship-Red/" + iconUrl);
    } else if (vessel.update_state === "green") {
      markerIcon = require("assets/img/ship/Ship-Green/" + iconUrl);
    } else if (vessel.update_state === "orange") {
      markerIcon = require("assets/img/ship/Ship-Orange/" + iconUrl);
    } else if (vessel.update_state === "white") {
      markerIcon = require("assets/img/ship/Ship-White/" + iconUrl);
    }

    if (vessel.heading === 0) {
      markerIcon = require("assets/img/ship/Ship-Round/round.png");
      if (
        vessel.update_state === "red" ||
        vessel.update_state === "green" ||
        vessel.update_state === "orange" ||
        vessel.update_state === "white"
      ) {
        markerIcon = require("assets/img/ship/Ship-Round/round-" +
          vessel.update_state +
          ".png");
      }
    }
    return markerIcon;
  },

  epochToJsDate(ts) {
    // dd/mm/yyyy hh:mm:ss
    // return (new Date(ts*1000)).toLocaleString();
    const d = new Date(ts * 1000);
    let dt =
      ("00" + d.getUTCDate()).slice(-2) +
      "/" +
      ("00" + (d.getUTCMonth() + 1)).slice(-2) +
      "/" +
      d.getUTCFullYear() +
      " " +
      ("00" + d.getUTCHours()).slice(-2) +
      ":" +
      ("00" + d.getUTCMinutes()).slice(-2) +
      ":" +
      ("00" + d.getUTCSeconds()).slice(-2);
    return dt;
  },

  jsDateToEpoch(dt) {
    // dt = new Date(2010, 6, 26)
    return dt.getTime() / 1000;
  },

  diffHours(date1, date2) {
    let date1_time = date1.getTime(),
      date2_time = date2.getTime(),
      diff_sec = Math.abs(date1_time - date2_time) / 1000,
      diff_h = Math.round(diff_sec / 60 / 60);
    return diff_h;
  },

  getHHMMTimeFromDate(dt) {
    // dt = new Date(2010, 6, 26)
    return dt.getHours() + ":" + dt.getMinutes();
  },

  secondsToLogicalDate(secs) {
    let seconds = parseInt(secs, 10);
    const days = Math.floor(seconds / (3600 * 24));
    seconds -= days * 3600 * 24;
    const hrs = Math.floor(seconds / 3600);
    seconds -= hrs * 3600;
    const mnts = Math.floor(seconds / 60);
    seconds -= mnts * 60;
    return (
      days +
      " days, " +
      hrs +
      " Hrs, " +
      mnts +
      " Minutes, " +
      seconds +
      " Seconds"
    );
  },

  encryptText(text) {
    return sha256(text + process.env.REACT_APP_SALT);
  },

  validateForm(obj) {
    let errString = [];

    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const el = obj[key];
        if (el.required) {
          if (
            el.value === "" ||
            el.value === null ||
            el.value === undefined ||
            (Array.isArray(el.value) && el.value.length === 0)
          ) {
            errString.push(el.name + " is required");
          }
        }
      }
    }
    return errString;
  },

  randomTextGenerator() {
    return (
      Math.random()
        .toString(36)
        .substring(2) + new Date().getTime().toString(36)
    );
  },

  checkPermission(perm) {
    let isPermitted = false;
    if (auth.getUserInfo() && auth.getUserInfo().roles) {
      const roles = auth.getUserInfo().roles;
      if (perm === "maps") {
        return (isPermitted = true);
      }

      if (roles) {
        roles.forEach(role => {
          if (role.permissions) {
            role.permissions.forEach(permission => {
              if (
                permission.permission_name.toLowerCase() === perm.toLowerCase()
              ) {
                isPermitted = true;
              }
            });
          }
        });
      }
    }
    return isPermitted;
  },

  removeAsterisk(str) {
    return str.replace(/[*]/g, "");
  },

  isPasswordAllowed() {
    if (
      (auth.getUserInfo() && auth.getUserInfo().admin) ||
      this.checkPermission("vessel_parameters_show password")
    ) {
      return true;
    }
    return false;
  },

  addUnitsValues(name, vals) {
    const val = vals.toString();
    if (name.toLowerCase() === "latitude") {
      return this.convertLattoDMS(val);
    } else if (name.toLowerCase() === "longitude") {
      return this.convertLngtoDMS(val);
    } else if (name.toLowerCase().includes("uptime")) {
      return this.secondsToLogicalDate(val);
    } else if (name.toLowerCase() === "uplink frequenzy") {
      return val + "Hz";
    } else if (
      name.toLowerCase() === "heading" ||
      name.toLowerCase() === "absoluteaz" ||
      name.toLowerCase() === "relativeaz" ||
      name.toLowerCase() === "agc" ||
      name.toLowerCase() === "elevation"
    ) {
      if (parseFloat(val)) {
        return parseFloat(val) + "°";
      } else {
        return val + "°";
      }
    } else if (name.toLowerCase() === "antennastatus") {
      if (val === 1 || val.toLowerCase() === "tracking") {
        return "tracking";
      } else {
        return "not tracking";
      }
    } else if (
      name.toLowerCase() === "txmode" ||
      name.toLowerCase() === "modemlock"
    ) {
      if (val === 1 || val.toLowerCase() === "on") {
        return "ON";
      } else {
        return "OFF";
      }
    } else if (name.toLowerCase() === "password") {
      if (!this.isPasswordAllowed()) {
        return val.replace(/./g, "*");
      } else {
        return val;
      }
    } else {
      return val;
    }
  },

  randomHexColor() {
    return "#000000".replace(/0/g, function() {
      return (~~(Math.random() * 16)).toString(16);
    });
  },

  getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  },

  truncateText(source, size) {
    return source.length > size ? source.slice(0, size - 1) + "…" : source;
  }
};

export default general;
