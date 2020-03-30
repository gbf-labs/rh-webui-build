import React from "react";
import PropTypes from "prop-types";
import { withSnackbar } from "notistack";
import request from "utils/request";
import CustomMapComponent from "components/CustomMap/CustomMap.jsx";
import general from "variables/general";

let vessInterval = null;
class MapComponent extends React.Component {
  state = {
    vessels: [],
    center: {
      lat: 0,
      lng: 0
    },
    zoom: 2.3
  };

  componentDidMount() {
    this.getVessels();
    vessInterval = setInterval(
      () => this.getVessels(),
      process.env.REACT_APP_AUTOREFRESH_INTERVAL
    );

    this.props.updateGlobalDTPicker(this.props.withGlobalDTPicker);
  }

  componentWillUnmount() {
    clearInterval(vessInterval);
  }

  toggleVesselInfo = vessel => {
    let center = {};
    let vessels = Object.assign([], this.props.searchSuggestions);
    if (vessel.vessel_name === "") {
      return;
    }
    for (let i in vessels) {
      if (vessels[i].vessel_id !== vessel.vessel_id) {
        vessels[i].isOpen = false;
      } else {
        vessels[i].isOpen = !vessel.isOpen;
        if (vessels[i].isOpen) {
          center = {
            lat: parseFloat(vessels[i].lat),
            lng: parseFloat(vessels[i].long)
          };
        }
      }
    }
    this.props.updateSearchSuggestions(vessels);

    if (center.lat && center.lng) {
      this.setState({
        center: center,
        zoom: 6,
        vessels
      });
    }
  };

  hoverVesselName = (vessel, hide) => {
    let vessels = Object.assign([], this.props.searchSuggestions);
    if (vessel.vessel_name === "") {
      return;
    }
    for (let i in vessels) {
      if (vessels[i]["isHoverOpen"] === undefined) {
        vessels[i]["isHoverOpen"] = false;
      }
      if (vessels[i].vessel_id !== vessel.vessel_id) {
        vessels[i]["isHoverOpen"] = false;
      } else {
        vessels[i]["isHoverOpen"] = hide;
      }
    }
    this.props.updateSearchSuggestions(vessels);

    this.setState({
      vessels
    });
  };

  getVessels = () => {
    const requestURL = process.env.REACT_APP_API_URL + "/vessels/data";

    request(requestURL, { method: "GET" })
      .then(response => {
        if (!this.props.handleRequest(response)) return;

        const suggestions = response.rows.map(elm => ({
          ...elm,
          label: elm.vessel_name,
          update_state: elm.update_state
        }));
        this.setState({ vessels: suggestions });

        this.props.updateSearchSuggestions(suggestions);
      })
      .catch(() => {
        this.props.handleRequest(false);
      });
  };

  getVesselZIndex = vessel => {
    if (vessel.update_state === "red") {
      return 2;
    } else {
      return 1;
    }
  };

  render() {
    let vessels = Object.assign(
      [],
      this.props.selectedSuggestions.length > 0
        ? this.props.selectedSuggestions
        : this.props.searchSuggestions
    );
    if (
      this.props.selectedVesselState !== "all" &&
      this.props.selectedSuggestions.length === 0
    ) {
      vessels = [];
    }
    return (
      <div style={{ height: `92vh` }}>
        <CustomMapComponent
          vessels={vessels}
          getVesselZIndex={this.getVesselZIndex}
          toggleVesselInfo={this.toggleVesselInfo}
          hoverVesselName={this.hoverVesselName}
          getVesselIcon={general.getVesselIcon}
          center={this.state.center}
          zoom={this.state.zoom}
          gotoButton={true}
        />
      </div>
    );
  }
}

MapComponent.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  updateGlobalDTPicker: PropTypes.func.isRequired,
  withGlobalDTPicker: PropTypes.bool.isRequired,
  handleRequest: PropTypes.func.isRequired,
  searchSuggestions: PropTypes.array.isRequired,
  updateSearchSuggestions: PropTypes.func.isRequired,
  selectedSuggestions: PropTypes.array.isRequired,
  selectedVesselState: PropTypes.string.isRequired
};
export default withSnackbar(MapComponent);
