/*global google*/
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import React from "react";
import { NavLink } from "react-router-dom";
import { compose, withProps } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps";
// import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import general from "variables/general";
// import fancyMapStyles from 'variables/fancyMapStyles.json';
import Skeleton from "@material-ui/lab/Skeleton";

const CustomMapComponent = compose(
  withProps({
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=" +
      process.env.REACT_APP_GOOGLE_API_KEY +
      "&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100%` }} />,
    mapElement: <div style={{ height: `100%` }} />
  }),
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap
    zoom={props.zoom}
    center={props.center}
    defaultOptions={{
      streetViewControl: false,
      scaleControl: false,
      mapTypeControl: false,
      panControl: false,
      zoomControl: false,
      rotateControl: false,
      fullscreenControl: true
      // styles: fancyMapStyles
    }}
  >
    {/* <MarkerClusterer
        onClick={props.onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
      > */}
    {Object.keys(props.vessels).map(function(key) {
      const vessel = props.vessels[key];

      let markerIcon = props.getVesselIcon(vessel);
      if (parseFloat(vessel.lat) === 0 || parseFloat(vessel.long) === 0) {
        return false;
      }
      return (
        <Marker
          position={{
            lat: parseFloat(vessel.lat),
            lng: parseFloat(vessel.long)
          }}
          icon={{
            url: markerIcon,
            anchor: new google.maps.Point(25, 25)
          }}
          onClick={() => {
            props.toggleVesselInfo(vessel);
          }}
          onMouseOver={() => {
            props.hoverVesselName(vessel, true);
          }}
          onMouseOut={() => {
            props.hoverVesselName(vessel, false);
          }}
          zIndex={props.getVesselZIndex(vessel)}
          obj={vessel}
          key={key}
        >
          {vessel.isHoverOpen && (
            <InfoWindow
              onCloseClick={() => {
                props.hoverVesselName(vessel, false);
              }}
            >
              <div className="map-popover">
                <div className="popover-header">
                  <p className="title">
                    <span className="device-name">{vessel.vessel_name}</span>
                  </p>
                </div>
              </div>
            </InfoWindow>
          )}
          {vessel.isOpen && (
            <InfoWindow
              onCloseClick={() => {
                props.toggleVesselInfo(vessel);
              }}
            >
              <div className="map-popover">
                <div className="popover-header">
                  <p className="title">
                    <span className="device-name">{vessel.vessel_name}</span>
                  </p>
                </div>
                <div className="popover-body">
                  <div className="popover-body-bottom">
                    <p className="item">
                      <span className="title" title="Position Source">
                        Position Source:{" "}
                      </span>
                      <span className="text" title={vessel.position_source}>
                        {vessel.position_source}
                      </span>
                    </p>
                    <p className="item">
                      <span className="title" title="Position">
                        Position:{" "}
                      </span>
                      <span
                        className="text"
                        title={general.convertDMS(vessel.lat, vessel.long)}
                      >
                        {general.convertDMS(vessel.lat, vessel.long)}
                      </span>
                    </p>
                    {vessel.heading > 0 && (
                      <p className="item">
                        <span className="title" title="Heading Source">
                          Heading Source:{" "}
                        </span>
                        <span className="text" title={vessel.heading_source}>
                          {vessel.heading_source}
                        </span>
                      </p>
                    )}
                    {vessel.heading > 0 && (
                      <p className="item">
                        <span className="title" title="Heading">
                          Heading:{" "}
                        </span>
                        <span className="text" title={vessel.heading}>
                          {vessel.heading}°
                        </span>
                      </p>
                    )}
                    {vessel.speed > 0 && (
                      <p className="item">
                        <span className="title" title="Heading">
                          Speed:{" "}
                        </span>
                        <span className="text" title={vessel.heading}>
                          {vessel.speed} knot(s)
                        </span>
                      </p>
                    )}
                    {vessel.image_url !== "" ? (
                      <p className="item vessel-img-item">
                        <img
                          alt="vessel name"
                          src={vessel.image_url}
                          className="vessel-img"
                        />
                      </p>
                    ) : (
                      <Skeleton variant="rect" width={100} />
                    )}
                    {props.gotoButton && (
                      <p className="item">
                        <NavLink
                          to={`/vessel/deviceselect/${vessel.vessel_id}/${
                            vessel.vessel_name
                          }`}
                        >
                          <Button
                            size="small"
                            variant="contained"
                            color="default"
                          >
                            Goto
                            <Icon>navigate_next</Icon>
                          </Button>
                        </NavLink>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </InfoWindow>
          )}
        </Marker>
      );
    })}
    {/* </MarkerClusterer> */}
  </GoogleMap>
));

export default CustomMapComponent;
