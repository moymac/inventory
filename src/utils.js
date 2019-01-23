import HTMLParser from "fast-html-parser";

const AdesaAreas = [
  {
    name: "Customer Pk Lot",
    polygon: [
      [43.750328, -79.684545],
      [43.749959, -79.68393],
      [43.748578, -79.685577],
      [43.74895, -79.686173]
    ]
  },
  {
    name: "Shute A",
    polygon: [
      [43.749959, -79.68393],
      [43.749769, -79.683611],
      [43.748257, -79.68529],
      [43.748578, -79.685577]
    ]
  },
  {
    name: "Employee Pk Lot",
    polygon: [
      [43.74836, -79.68507],
      [43.74804, -79.68454],
      [43.74928, -79.68306],
      [43.74964, -79.68365]
    ]
  },
  {
    name: "Lane C",
    polygon: [
      [43.74843, -79.68395],
      [43.74763, -79.68291],
      [43.74817, -79.68235],
      [43.74892, -79.68339]
    ]
  },
  {
    name: "Back 40",
    polygon: [
      [43.75262, -79.6952],
      [43.74867, -79.69035],
      [43.75054, -79.68795],
      [43.75421, -79.69328]
    ]
  },
  {
    name: "Truck lot",
    polygon: [
      [43.74954, -79.68342],
      [43.74852, -79.68203],
      [43.74929, -79.68132],
      [43.75012, -79.68279]
    ]
  }
];

export function getAdesaLocationName(latitude, longitude) {
  var inside = require("point-in-polygon");

  let areaname = "other";

  for (let area of AdesaAreas) {
    if (inside([latitude, longitude], area.polygon)) {
      areaname = area.name;
      break;
    }
  }
  console.log(areaname);
  return areaname;
}

export async function decodeVIN(vin) {
  let response = await fetch("http://vinfreecheck.com/vin/" + vin);
  let responseText = await response.text();
  // console.log(responseText);
  let root = HTMLParser.parse(responseText);
  let detailsTable = root.querySelectorAll("table")[1];
  let tableNodes = detailsTable.querySelectorAll("td");
  let decodedVehicle = {};
  let objectKey = "";

  tableNodes.forEach((element, index) => {
    // let objectValue = "";
    // console.log(element[]);

    if (index % 2 === 0)
      objectKey = element["rawText"].toLowerCase().replace(/\s+/g, "");
    if (index % 2 !== 0) decodedVehicle[objectKey] = element["rawText"];
    // console.log(objectKey);

    // console.log(element.childNodes[0]);
  });
  return decodedVehicle;
}
