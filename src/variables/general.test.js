/* eslint-disable no-undef */
import React from "react";
import general from "./general";
import renderer from "react-test-renderer";

it("should convert long coordinate to Degree,Minute,Seconds", () => {
  expect(general.toDegreesMinutesAndSeconds(120.984222)).toEqual(
    "120° 59' 3''"
  );
});

it("should convert lat coordinate to Degree,Minute,Seconds", () => {
  expect(general.toDegreesMinutesAndSeconds(14.599512)).toEqual("14° 35' 58''");
});

it("should convert lat coordinate to Degree,Minute,Seconds with direction", () => {
  expect(general.convertLattoDMS(14.599512)).toEqual("14° 35' 58'' N");
});

it("should convert long coordinate to Degree,Minute,Seconds with direction", () => {
  expect(general.convertLngtoDMS(120.984222)).toEqual("120° 59' 3'' E");
});

it("should convert long/lat coordinate to Degrees,Minutes,Seconds with direction", () => {
  expect(general.convertDMS(14.599512, 120.984222)).toEqual(
    "14° 35' 58'' N, 120° 59' 3'' E"
  );
});

it("should return image object based on device info", () => {
  const tree = renderer
    .create(<img src={general.getDeviceImage({ device_type: "IOP" }, {})} />)
    .toJSON();
  expect(tree).toMatchSnapshot();

  const tree2 = renderer
    .create(
      <img
        src={general.getDeviceImage(
          { device_type: "Catalyst_2960" },
          { model: "WS-C2960-48TT-L" }
        )}
      />
    )
    .toJSON();
  expect(tree2).toMatchSnapshot();
});

it("should convert device name abbreviation to correct full name", () => {
  expect(general.humanizeName("NTWCONF")).toEqual("Network Configuration");
  expect(general.humanizeName("VSAT1")).toEqual("V-SAT 1");
});

it("should capitalize first letter of the string", () => {
  expect(general.capitalizeFirstLetter("powerswitch")).toEqual("Powerswitch");
  expect(general.capitalizeFirstLetter("NETWORK SWITCH")).toEqual(
    "Network switch"
  );
});

it("should return vessel icon based on vessel info", () => {
  const tree = renderer
    .create(
      <img src={general.getVesselIcon({ heading: 30, update_state: "red" })} />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();

  const tree2 = renderer
    .create(
      <img src={general.getVesselIcon({ heading: 0, update_state: "green" })} />
    )
    .toJSON();
  expect(tree2).toMatchSnapshot();
});

it("should convert epoch time to dd/mm/yyyy hh:mm:ss format", () => {
  expect(general.epochToJsDate(1568785580.94784)).toEqual(
    "18/09/2019 05:46:20"
  );

  expect(general.epochToJsDate(1568785759.781261)).toEqual(
    "18/09/2019 05:49:19"
  );
});

// it("should return the difference of dates in hours", () => {
//   expect(general.diffHours(new Date("17/09/2019 05:54:00"))).toEqual(
//     1568699640
//   );
// });
